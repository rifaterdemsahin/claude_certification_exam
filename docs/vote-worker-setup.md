# Vote Worker Setup

Cloudflare Worker that acts as a write proxy for GitHub Gist-based voting.

## Architecture

```
Browser (read)  ──► GitHub Gist API (unauthenticated)
Browser (write) ──► Cloudflare Worker ──► GitHub Gist API (authenticated)
```

## Gist

- **URL**: https://gist.github.com/rifaterdemsahin/2bfb092b05e08669b092f8371ac9c018
- **File**: `claude-cert-votes.json`
- **Format**: `{ "1": 0, "2": 0, ... "16": 0 }`

## Worker

- **URL**: https://tiny-mode-1370.polished-boat-17b2.workers.dev
- **Name**: tiny-mode-1370 (Cloudflare auto-generated)

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Read all votes from gist |
| POST | `/` | Submit a vote `{ "ids": [1, 5, 12] }` |
| OPTIONS | `/` | CORS preflight |

### Worker Code

```javascript
const GIST_ID = '2bfb092b05e08669b092f8371ac9c018';
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN'; // Fine-grained PAT with Gists → Read and write
const ALLOWED_ORIGIN = 'https://rifaterdemsahin.github.io';

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'GET, POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // GET — read votes
    if (request.method === 'GET') {
      const resp = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'User-Agent': 'claude-cert-votes' },
      });
      const gist = await resp.json();
      const content = gist.files['claude-cert-votes.json'].content;
      return new Response(content, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        },
      });
    }

    // POST — record a vote
    if (request.method === 'POST') {
      const { ids } = await request.json();

      // Validate: array of 1-3 numbers between 1-16
      if (!Array.isArray(ids) || ids.length < 1 || ids.length > 3 ||
          ids.some(id => id < 1 || id > 16)) {
        return new Response(JSON.stringify({ error: 'Invalid vote' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
        });
      }

      // Read current votes
      const getResp = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'User-Agent': 'claude-cert-votes' },
      });
      const gist = await getResp.json();
      const votes = JSON.parse(gist.files['claude-cert-votes.json'].content);

      // Increment
      ids.forEach(id => { votes[String(id)] = (votes[String(id)] || 0) + 1; });

      // Write back
      await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'User-Agent': 'claude-cert-votes',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: {
            'claude-cert-votes.json': { content: JSON.stringify(votes, null, 2) },
          },
        }),
      });

      return new Response(JSON.stringify({ ok: true, votes }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
      });
    }

    return new Response('Method not allowed', { status: 405 });
  },
};
```

## GitHub Token Setup

1. Go to github.com/settings/tokens?type=beta
2. Generate new fine-grained token
3. Name: `claude-cert-votes`
4. Expiration: 90 days
5. Repository access: No repositories
6. Account permissions: Gists → Read and write
7. Copy token → paste into worker code → Save and Deploy

## Test Commands

```bash
# Read votes
curl https://tiny-mode-1370.polished-boat-17b2.workers.dev/

# Submit a vote (pick videos 1 and 5)
curl -X POST https://tiny-mode-1370.polished-boat-17b2.workers.dev/ \
  -H "Content-Type: application/json" \
  -d '{"ids": [1, 5]}'

# Invalid vote (out of range)
curl -X POST https://tiny-mode-1370.polished-boat-17b2.workers.dev/ \
  -H "Content-Type: application/json" \
  -d '{"ids": [99]}'
# Returns: {"error": "Invalid vote"}
```

## Client Integration

In `pages/create.html`:
```javascript
const GIST_ID = '2bfb092b05e08669b092f8371ac9c018';
const WORKER_URL = 'https://tiny-mode-1370.polished-boat-17b2.workers.dev';
```

- **Read**: `fetch('https://api.github.com/gists/' + GIST_ID)` (unauthenticated)
- **Write**: `fetch(WORKER_URL, { method: 'POST', body: JSON.stringify({ ids }) })`

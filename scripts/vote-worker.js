const GIST_ID = '2bfb092b05e08669b092f8371ac9c018';
const GITHUB_TOKEN = 'PASTE_YOUR_TOKEN_HERE';
const ALLOWED_ORIGIN = 'https://rifaterdemsahin.github.io';

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'GET, POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

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

    if (request.method === 'POST') {
      const { ids } = await request.json();

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

      // Write back with error checking
      const patchResp = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
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

      if (!patchResp.ok) {
        const errText = await patchResp.text();
        return new Response(JSON.stringify({ error: 'GitHub PATCH failed', status: patchResp.status, body: errText }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
        });
      }

      return new Response(JSON.stringify({ ok: true, votes }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
      });
    }

    return new Response('Method not allowed', { status: 405 });
  },
};

const GIST_ID = '2bfb092b05e08669b092f8371ac9c018';
const GITHUB_TOKEN = 'PASTE_YOUR_TOKEN_HERE'; // Classic token with `repo` + `gist` scopes
const ALLOWED_ORIGIN = 'https://rifaterdemsahin.github.io';
const REPO = 'rifaterdemsahin/claude_certification_exam';
const OPENROUTER_KEY = 'PASTE_OPENROUTER_KEY_HERE'; // OpenRouter API key

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
      const body = await request.json();

      // Reset action
      if (body.action === 'reset') {
        const zeros = {};
        for (let i = 1; i <= 16; i++) zeros[String(i)] = 0;
        const patchResp = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'claude-cert-votes',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: { 'claude-cert-votes.json': { content: JSON.stringify(zeros, null, 2) } },
          }),
        });
        return new Response(JSON.stringify({ ok: true, votes: zeros }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
        });
      }

      // Create memory card action
      if (body.action === 'create-card') {
        const { path, content, message } = body;
        if (!path || !content) {
          return new Response(JSON.stringify({ error: 'Missing path or content' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          });
        }

        // Validate path is in formula/memory/
        if (!path.startsWith('formula/memory/MEM-Q') || !path.endsWith('.md')) {
          return new Response(JSON.stringify({ error: 'Invalid path. Must be formula/memory/MEM-Q*.md' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          });
        }

        const encoded = btoa(unescape(encodeURIComponent(content)));

        // Check if file exists
        let sha = null;
        const checkResp = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
          headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'User-Agent': 'claude-cert-worker' },
        });
        if (checkResp.ok) {
          const existing = await checkResp.json();
          sha = existing.sha;
        }

        const body_payload = {
          message: message || (sha ? `Update ${path}` : `Add ${path}`),
          content: encoded,
          branch: 'main',
        };
        if (sha) body_payload.sha = sha;

        const putResp = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'claude-cert-worker',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body_payload),
        });

        if (!putResp.ok) {
          const err = await putResp.json();
          return new Response(JSON.stringify({ error: err.message }), {
            status: putResp.status,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          });
        }

        const result = await putResp.json();
        return new Response(JSON.stringify({ ok: true, sha: result.commit.sha, name: result.content.name }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
        });
      }

      // Upload image action
      if (body.action === 'upload-image') {
        const { path, content, message } = body;
        if (!path || !content) {
          return new Response(JSON.stringify({ error: 'Missing path or content' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          });
        }

        if (!path.startsWith('assets/memory/') || !path.match(/\.(svg|png|jpg|jpeg|gif|webp)$/i)) {
          return new Response(JSON.stringify({ error: 'Invalid path. Must be assets/memory/*.{svg,png,jpg,jpeg,gif,webp}' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          });
        }

        // Check if file exists
        let sha = null;
        const checkResp = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
          headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'User-Agent': 'claude-cert-worker' },
        });
        if (checkResp.ok) {
          const existing = await checkResp.json();
          sha = existing.sha;
        }

        const body_payload = {
          message: message || `Upload ${path}`,
          content: content,
          branch: 'main',
        };
        if (sha) body_payload.sha = sha;

        const putResp = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'claude-cert-worker',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body_payload),
        });

        if (!putResp.ok) {
          const err = await putResp.json();
          return new Response(JSON.stringify({ error: err.message }), {
            status: putResp.status,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          });
        }

        const result = await putResp.json();
        return new Response(JSON.stringify({ ok: true, sha: result.commit.sha, name: result.content.name, url: result.content.download_url }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
        });
      }

      // AI generate action
      if (body.action === 'ai-generate') {
        const { prompt, system } = body;
        if (!prompt) {
          return new Response(JSON.stringify({ error: 'Missing prompt' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          });
        }

        if (!OPENROUTER_KEY || OPENROUTER_KEY === 'PASTE_OPENROUTER_KEY_HERE') {
          return new Response(JSON.stringify({ error: 'OpenRouter key not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          });
        }

        try {
          const aiResp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${OPENROUTER_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://rifaterdemsahin.github.io',
              'X-Title': 'Claude Certification Study App',
            },
            body: JSON.stringify({
              model: 'anthropic/claude-sonnet-4',
              messages: [
                { role: 'system', content: system || 'You are a helpful assistant for creating certification study materials. Be concise and accurate.' },
                { role: 'user', content: prompt },
              ],
              max_tokens: 500,
            }),
          });

          const aiData = await aiResp.json();
          if (aiData.choices && aiData.choices[0]) {
            return new Response(JSON.stringify({ text: aiData.choices[0].message.content }), {
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
            });
          } else {
            return new Response(JSON.stringify({ error: 'No response from AI', data: aiData }), {
              status: 500,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
            });
          }
        } catch (e) {
          return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          });
        }
      }

      // Vote action
      const { ids } = body;

      if (!ids) {
        return new Response(JSON.stringify({ error: 'Missing ids field', received: body }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
        });
      }

      const idArr = Array.isArray(ids) ? ids : [ids];
      const numIds = idArr.map(Number);

      if (numIds.length < 1 || numIds.length > 3 ||
          numIds.some(id => isNaN(id) || id < 1 || id > 16)) {
        return new Response(JSON.stringify({ error: 'Invalid vote', ids: idArr, parsed: numIds }), {
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

// Content Worker — Handles memory card creation, image upload, and AI writing
// Deploy to Cloudflare Workers
const GITHUB_TOKEN = 'PASTE_YOUR_TOKEN_HERE'; // Classic token with `repo` scope
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
      return new Response(JSON.stringify({
        status: 'ok',
        worker: 'content',
        config: {
          github_token: GITHUB_TOKEN && GITHUB_TOKEN !== 'PASTE_YOUR_TOKEN_HERE' ? 'configured' : 'missing',
          openrouter_key: OPENROUTER_KEY && OPENROUTER_KEY !== 'PASTE_OPENROUTER_KEY_HERE' ? 'configured' : 'missing',
        },
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
      });
    }

    if (request.method === 'POST') {
      const body = await request.json();

      // Create memory card
      if (body.action === 'create-card') {
        const { path, content, message } = body;
        if (!path || !content) {
          return new Response(JSON.stringify({ error: 'Missing path or content' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          });
        }

        if (!path.startsWith('formula/memory/MEM-Q') || !path.endsWith('.md')) {
          return new Response(JSON.stringify({ error: 'Invalid path. Must be formula/memory/MEM-Q*.md' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          });
        }

        const encoded = btoa(unescape(encodeURIComponent(content)));
        let sha = null;

        const checkResp = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
          headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'User-Agent': 'claude-cert-content' },
        });
        if (checkResp.ok) {
          const existing = await checkResp.json();
          sha = existing.sha;
        }

        const payload = {
          message: message || (sha ? `Update ${path}` : `Add ${path}`),
          content: encoded,
          branch: 'main',
        };
        if (sha) payload.sha = sha;

        const putResp = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'claude-cert-content',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
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

      // Upload image
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

        let sha = null;
        const checkResp = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
          headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'User-Agent': 'claude-cert-content' },
        });
        if (checkResp.ok) {
          const existing = await checkResp.json();
          sha = existing.sha;
        }

        const payload = {
          message: message || `Upload ${path}`,
          content: content,
          branch: 'main',
        };
        if (sha) payload.sha = sha;

        const putResp = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'claude-cert-content',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
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

      // AI generate
      if (body.action === 'ai-generate') {
        const { prompt, system } = body;
        if (!prompt) {
          return new Response(JSON.stringify({ error: 'Missing prompt' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          });
        }

        const orKey = OPENROUTER_KEY.trim().replace(/^['"]|['"]$/g, '');
        if (!orKey || orKey === 'PASTE_OPENROUTER_KEY_HERE' || orKey.length < 10) {
          return new Response(JSON.stringify({ error: 'OpenRouter key not configured', hint: 'Check OPENROUTER_KEY in worker code' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          });
        }

        try {
          const aiResp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${orKey}`,
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

      return new Response(JSON.stringify({ error: 'Unknown action', action: body.action }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
      });
    }

    return new Response('Method not allowed', { status: 405 });
  },
};

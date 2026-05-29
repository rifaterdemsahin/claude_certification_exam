// Content Worker — AI generation only (post-Azure migration to Blob Storage)
// Uses env.OPENROUTER_KEY. Deploy to Cloudflare Workers.
const ALLOWED_ORIGIN = '*';

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
        worker: 'content-ai',
        service: 'OpenRouter AI for study materials',
        note: 'create-card and upload-image removed (now handled by Azure Functions)',
      }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const body = await request.json();

    if (body.action === 'ai-generate') {
      const { prompt, system } = body;
      if (!prompt) {
        return new Response(JSON.stringify({ error: 'Missing prompt' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
        });
      }

      const orKey = (env.OPENROUTER_KEY || '').trim();
      if (!orKey || orKey.length < 15) {
        return new Response(JSON.stringify({ 
          error: 'OpenRouter key not configured', 
          hint: 'Set OPENROUTER_KEY in Cloudflare Worker environment variables' 
        }), {
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
            'HTTP-Referer': 'https://rifaterdemsahin.github.io/claude_certification_exam/',
            'X-Title': 'Claude Certification Study App',
          },
          body: JSON.stringify({
            model: 'anthropic/claude-sonnet-4',
            messages: [
              { 
                role: 'system', 
                content: system || 'You are an expert at creating Claude Developer Certification study materials. Produce concise, accurate memory cards, explanations, and exam insights. Use markdown, emojis for mnemonics, and structured format.' 
              },
              { role: 'user', content: prompt },
            ],
            max_tokens: 700,
            temperature: 0.7,
          }),
        });

        if (!aiResp.ok) {
          const errText = await aiResp.text();
          throw new Error(`OpenRouter error: ${aiResp.status} ${errText}`);
        }

        const aiData = await aiResp.json();
        if (aiData.choices && aiData.choices[0] && aiData.choices[0].message) {
          return new Response(JSON.stringify({ 
            text: aiData.choices[0].message.content,
            model: aiData.model || 'anthropic/claude-sonnet-4'
          }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
          });
        } else {
          return new Response(JSON.stringify({ error: 'No valid response from AI', data: aiData }), {
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

    return new Response(JSON.stringify({ 
      error: 'Unknown action. Only "ai-generate" is supported post-Azure migration.' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': ALLOWED_ORIGIN },
    });
  },
};

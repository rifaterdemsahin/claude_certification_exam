# How to Update the Cloudflare Content Worker

## Worker URL
`https://content-worker.polished-boat-17b2.workers.dev`

## Dashboard
https://dash.cloudflare.com/3683d1886e0a3a3152242c84f226ba3f/workers/services/view/content-worker/production

## When to Update
- Changing CORS origins (`ALLOWED_ORIGIN`)
- Adding new API actions (e.g., `list-cards`, `delete-card`)
- Rotating the GitHub token or OpenRouter key
- Fixing bugs in worker logic

## Steps
1. Edit `scripts/content-worker.js` in the repo (source of truth)
2. Open the Cloudflare dashboard link above
3. Click on the worker code editor
4. Paste the updated code from `scripts/content-worker.js`
5. Click **Save and Deploy**
6. Test with `curl https://content-worker.polished-boat-17b2.workers.dev`

## Current Actions
- `create-card` — Creates/updates a memory card markdown file
- `upload-image` — Uploads an image to `assets/memory/`
- `ai-generate` — Generates text via OpenRouter (Claude Sonnet)

## Important
- The git repo stores the source code, but Cloudflare does NOT auto-deploy from git
- You must manually copy the code to Cloudflare and click Save and Deploy
- After deploying, test the worker GET endpoint to confirm it's live

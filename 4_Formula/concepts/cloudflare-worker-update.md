# Cloudflare Content Worker — Post-Migration Guide

## Status: DEPRECATED for card/image storage

The Cloudflare content worker is **no longer used** for memory card creation or image uploads. These operations now use Azure Blob Storage via the Azure Function App.

## What Changed

| Operation | Before (Cloudflare) | After (Azure) |
|-----------|---------------------|---------------|
| Create memory card | Worker → GitHub API | Azure Function → Blob Storage |
| Upload image | Worker → GitHub API | Azure Function → Blob Storage |
| List cards | GitHub API directly | Azure Function → Blob Storage |
| AI generate | Worker → OpenRouter | Worker → OpenRouter (unchanged) |

## Current Architecture

- **Azure Function App:** `https://claude-cert-api.azurewebsites.net/api`
- **Azure Blob Storage:** `https://claudecertstore.blob.core.windows.net`
- **Cloudflare Worker:** `https://content-worker.polished-boat-17b2.workers.dev` (AI generate only)

## Worker URL (still active for AI)
`https://content-worker.polished-boat-17b2.workers.dev`

## Dashboard
https://dash.cloudflare.com/3683d1886e0a3a3152242c84f226ba3f/workers/services/view/content-worker/production

## When to Update the Worker
- Only for AI generate functionality
- Rotating the OpenRouter key
- Fixing bugs in AI generation logic

## Steps to Update
1. Edit `scripts/content-worker.js` in the repo (source of truth)
2. Open the Cloudflare dashboard link above
3. Click on the worker code editor
4. Paste the updated code from `scripts/content-worker.js`
5. Click **Save and Deploy**
6. Test with `curl https://content-worker.polished-boat-17b2.workers.dev`

## Azure Resources

### Resource Group
`claude-certificate-training` (East US)

### Storage Account
`claudecertstore`

### Blob Containers
- `memory-cards` — stores `.md` files
- `memory-images` — stores `.png/.svg/.jpg` images

### Function App
`claude-cert-api`

#### Endpoints
- `GET /api/cards` — list all memory cards
- `POST /api/cards` — create/update a memory card
- `POST /api/images` — upload an image

## Important
- Adding memory cards/images no longer triggers GitHub deployments
- The Cloudflare worker is only used for AI text generation
- Azure Function App code is in `azure-api/` directory

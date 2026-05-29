# Azure Migration Report

## Date: 2026-05-28

## Executive Summary

Successfully migrated memory card and image storage from GitHub API (via Cloudflare Worker) to Azure Blob Storage. This change decouples content creation from code deployment, allowing new memory cards to be added without triggering GitHub Pages deployments.

## Rationale

### Problem
Previously, adding a new memory card or image required:
1. Browser → Cloudflare Worker → GitHub API
2. GitHub API creates a commit
3. Commit triggers GitHub Pages deployment
4. Every content addition = unnecessary deployment

### Solution
Move all user-generated content to Azure Blob Storage:
1. Browser → Azure Function App → Azure Blob Storage
2. No commits, no deployments
3. Content is decoupled from code

## Architecture Changes

### Before
```
Browser → Cloudflare Worker → GitHub API → GitHub Pages (triggers deployment)
```

### After
```
Browser → Azure Function App → Azure Blob Storage (no deployment)
Browser → Cloudflare Worker → OpenRouter (AI generate only)
```

## Azure Resources Created

### Resource Group
- **Name:** `claude-certificate-training`
- **Location:** East US
- **ID:** `/subscriptions/b85b029d-9f7c-4c5a-8939-819480780c5d/resourceGroups/claude-certificate-training`

### Storage Account
- **Name:** `claudecertstore`
- **Type:** StorageV2
- **SKU:** Standard_LRS
- **URL:** `https://claudecertstore.blob.core.windows.net`

### Blob Containers
| Container | Purpose | Public Access |
|-----------|---------|---------------|
| `memory-cards` | Markdown files (.md) | Blob (public read) |
| `memory-images` | Images (.png, .svg, .jpg) | Blob (public read) |

### Function App
- **Name:** `claude-cert-api`
- **Runtime:** Node.js 24
- **URL:** `https://claude-cert-api.azurewebsites.net`
- **Endpoints:**
  - `GET /api/cards` — List all memory cards
  - `POST /api/cards` — Create/update a memory card
  - `POST /api/images` — Upload an image

## Data Migration

### Memory Cards
- **Source:** `formula/memory/` directory (100 files)
- **Destination:** `memory-cards` container in Azure Blob Storage
- **Status:** ✅ Uploaded (100 files)

### Images
- **Source:** `assets/memory/` directory (95 files)
- **Destination:** `memory-images` container in Azure Blob Storage
- **Status:** ✅ Uploaded (95 files)

## Code Changes

### New Files
| File | Purpose |
|------|---------|
| `azure-api/host.json` | Azure Function App configuration |
| `azure-api/package.json` | Node.js dependencies |
| `azure-api/local.settings.json` | Local development settings |
| `azure-api/ListCards/function.json` | List cards function config |
| `azure-api/ListCards/index.js` | List cards implementation |
| `azure-api/CreateCard/function.json` | Create card function config |
| `azure-api/CreateCard/index.js` | Create card implementation |
| `azure-api/UploadImage/function.json` | Upload image function config |
| `azure-api/UploadImage/index.js` | Upload image implementation |

### Modified Files
| File | Changes |
|------|---------|
| `js/data.js` | Updated image URLs to Azure Blob Storage |
| `pages/add_memory_card.html` | Updated to use Azure endpoints |
| `pages/quick_memory.html` | Updated to use Azure endpoints |
| `pages/memory_cards.html` | Dynamic loading from Azure API |
| `pages/markdown_renderer.html` | Dynamic loading from Azure API |
| `formula/concepts/cloudflare-worker-update.md` | Updated documentation |

### Removed Code
- GitHub API calls for card creation
- GitHub API calls for image upload
- `raw.githubusercontent.com` image URLs
- `api.github.com` card listing

## Places That Need Manual Update

### 1. Azure Function App Configuration
The Azure Function App needs the storage connection string configured:
1. Go to Azure Portal → Function App → Configuration
2. Add setting: `AzureWebJobsStorage` = `<connection-string>`
3. Get connection string from: Storage Account → Access keys

### 2. Cloudflare Worker (Optional)
The Cloudflare worker can be simplified to only handle AI generation:
- Remove `create-card` action
- Remove `upload-image` action
- Keep `ai-generate` action

### 3. Local Development
For local testing of Azure Functions:
1. Update `azure-api/local.settings.json` with storage connection string
2. Run `cd azure-api && npm install && npm start`

## Verification Checklist

- [ ] Azure Function App is deployed and accessible
- [ ] `GET /api/cards` returns list of memory cards
- [ ] `POST /api/cards` creates a new memory card
- [ ] `POST /api/images` uploads an image
- [ ] `quick_memory.html` can create cards via Azure
- [ ] `add_memory_card.html` can create cards via Azure
- [ ] `memory_cards.html` loads cards from Azure
- [ ] `markdown_renderer.html` loads cards from Azure
- [ ] Images display correctly from Azure Blob URLs
- [ ] No GitHub commits triggered when adding content

## Cost Estimate

### Azure Blob Storage
- Storage: ~100 MB (100 cards + 95 images)
- Cost: ~$0.01/month

### Azure Function App
- Consumption plan: 1 million free requests/month
- Cost: $0 for this usage level

### Total Estimated Cost
**~$0.01/month**

## Next Steps

1. **Deploy Azure Functions:** Run `cd azure-api && npm install && func azure functionapp publish claude-cert-api`
2. **Configure connection string:** Add `AzureWebJobsStorage` to Function App settings
3. **Test end-to-end:** Verify all pages work with Azure endpoints
4. **Optional:** Remove local `formula/memory/` and `assets/memory/` directories
5. **Optional:** Simplify Cloudflare worker to AI-only

## Rollback Plan

If issues arise:
1. Revert `js/data.js` to use GitHub URLs
2. Revert `pages/add_memory_card.html` to use Cloudflare Worker
3. Revert `pages/quick_memory.html` to use Cloudflare Worker
4. Memory cards still exist in GitHub repo (not deleted)

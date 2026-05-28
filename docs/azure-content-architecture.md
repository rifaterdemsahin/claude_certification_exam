# Azure Content Storage Architecture

## Overview

All user-generated content (memory cards and images) is stored in Azure Blob Storage, decoupled from GitHub Pages deployment. Adding content does NOT trigger a deployment.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Frontend)                       │
│                                                                 │
│  quick_memory.html ─┐                                           │
│  add_memory_card.html ─┤──→ Azure Function App ──→ Blob Storage │
│  memory_cards.html ──┘      claude-cert-api          claudecertstore │
│  markdown_renderer.html ──→ Blob Storage (read)                 │
└─────────────────────────────────────────────────────────────────┘
```

## Azure Resources

### Resource Group
| Property | Value |
|----------|-------|
| Name | `claude-certificate-training` |
| Location | East US |
| Subscription | Azure subscription 1 |

### Storage Account
| Property | Value |
|----------|-------|
| Name | `claudecertstore` |
| Type | StorageV2 |
| SKU | Standard_LRS |
| URL | `https://claudecertstore.blob.core.windows.net` |

### Blob Containers
| Container | Purpose | Public Access | Content Type |
|-----------|---------|---------------|--------------|
| `memory-cards` | Markdown files | Blob (public read) | `text/markdown` |
| `memory-images` | Images | Blob (public read) | `image/*` |

### Function App
| Property | Value |
|----------|-------|
| Name | `claude-cert-api` |
| Runtime | Node.js 24 |
| Plan | Y1 Consumption (serverless) |
| URL | `https://claude-cert-api.azurewebsites.net` |

### Key Vault
| Property | Value |
|----------|-------|
| Name | `dp-kv-deliverypilot` |
| Resource Group | `deliverypilot-rg` |
| Secret | `AzureWebJobsStorage` |

## API Endpoints

### List Memory Cards
```
GET /api/cards
Response: { "files": ["MEM-Q001.md", "MEM-Q002.md", ...] }
```

### Create Memory Card
```
POST /api/cards
Body: { "filename": "MEM-Q101.md", "content": "# Memory Card..." }
Response: { "ok": true, "filename": "MEM-Q101.md", "url": "https://..." }
```

### Upload Image
```
POST /api/images
Body: { "filename": "MEM-Q101_v1.png", "content": "<base64>", "contentType": "image/png" }
Response: { "ok": true, "filename": "MEM-Q101_v1.png", "url": "https://..." }
```

## URL Patterns

### Memory Card (Azure Blob)
```
https://claudecertstore.blob.core.windows.net/memory-cards/MEM-Q{ID}.md
```

### Memory Image (Azure Blob)
```
https://claudecertstore.blob.core.windows.net/memory-images/MEM-Q{ID}_v1.{ext}
```

### Frontend Pages
```
pages/markdown_renderer.html?url=https://claudecertstore.blob.core.windows.net/memory-cards/MEM-Q{ID}.md&title=Memory Card {ID}
```

## Cost Estimate

### Y1 Consumption Plan (Function App)
- **Free grant:** 1 million executions/month, 400,000 GB-seconds
- **Compute cost:** $0 at low usage
- **Cold start:** ~2-5 seconds when idle

### Blob Storage
- **Storage:** ~100 MB → ~$0.002/month
- **Transactions:** ~10,000/month → ~$0.004/month
- **Bandwidth:** First 5 GB free

### Total Estimated Cost
**~$0.01/month** at current usage

## Cold Start Behavior

The Y1 Consumption Plan scales to zero when idle. First request after idle period:
- **Compute spin-up:** 2-5 seconds
- **Function execution:** <1 second
- **Total first request:** 3-6 seconds
- **Subsequent requests:** <1 second

## Security

### Storage Account
- Public read access for blobs (memory cards and images)
- Write access only via Function App

### Function App
- Anonymous access (no auth required)
- CORS enabled for all origins
- Storage connection string in Key Vault

### Key Vault
- Managed Identity access for Function App
- Secret: `AzureWebJobsStorage`

## Data Flow

### Creating a Memory Card
1. User fills form in `quick_memory.html` or `add_memory_card.html`
2. Frontend sends POST to `/api/cards` with filename and content
3. Azure Function writes markdown to `memory-cards` container
4. Frontend receives success response with blob URL

### Uploading an Image
1. User pastes/selects image in frontend
2. Frontend sends POST to `/api/images` with filename and base64 content
3. Azure Function writes image to `memory-images` container
4. Frontend receives success response with blob URL

### Reading Memory Cards
1. `memory_cards.html` fetches `/api/cards` to get list
2. Each card link points to blob URL via `markdown_renderer.html`
3. `markdown_renderer.html` fetches markdown from blob URL
4. Markdown is rendered in the browser

## Files Modified

| File | Change |
|------|--------|
| `js/data.js` | Image URLs → Azure Blob Storage |
| `pages/add_memory_card.html` | Uses Azure Function API |
| `pages/quick_memory.html` | Uses Azure Function API |
| `pages/memory_cards.html` | Dynamic loading from Azure API |
| `pages/markdown_renderer.html` | Loads from Azure Blob URLs |
| `pages/exam.html` | Memory card links → Azure URLs |
| `pages/practice_exam.html` | Memory card links → Azure URLs |
| `pages/mindmap.html` | Memory card links → Azure URLs |
| `CLAUDE.md` | Updated documentation |
| `GEMINI.md` | Updated documentation |
| `AGENTS.md` | Updated documentation |
| `mimo.md` | Updated documentation |

## Azure Function Code

### Location
`azure-api/` directory

### Files
- `host.json` — Function App configuration
- `package.json` — Node.js dependencies
- `ListCards/index.js` — List memory cards
- `ListCards/function.json` — HTTP trigger config
- `CreateCard/index.js` — Create memory card
- `CreateCard/function.json` — HTTP trigger config
- `UploadImage/index.js` — Upload image
- `UploadImage/function.json` — HTTP trigger config

### Dependencies
- `@azure/storage-blob` — Azure Blob Storage SDK

## Deployment

### Prerequisites
1. Azure CLI installed and logged in
2. Storage account created
3. Function App created
4. Key Vault secret configured

### Deploy Function Code
```bash
cd azure-api
npm install
npx func azure functionapp publish claude-cert-api --build remote
```

### Verify Deployment
```bash
curl https://claude-cert-api.azurewebsites.net/api/cards
```

## Troubleshooting

### 500 Internal Server Error
- Check `AzureWebJobsStorage` setting in Function App
- Verify Key Vault secret is accessible
- Check Function App logs in Azure Portal

### CORS Errors
- Function code includes `Access-Control-Allow-Origin: *`
- If still failing, add origin in Function App CORS settings

### Cold Start Delays
- Expected behavior for Y1 Consumption Plan
- First request after idle: 3-6 seconds
- Subsequent requests: <1 second

### Blob Not Found
- Verify blob exists in correct container
- Check blob name matches expected pattern
- Verify container has public read access

## Migration Notes

### Before (GitHub)
- Memory cards in `formula/memory/` directory
- Images in `assets/memory/` directory
- Cloudflare Worker → GitHub API for writes
- GitHub Pages serves content

### After (Azure)
- Memory cards in `memory-cards` blob container
- Images in `memory-images` blob container
- Azure Function App for writes
- Azure Blob Storage serves content
- No deployment triggered on content add

### Removed
- `formula/memory/` directory (100 files)
- `assets/memory/` directory (95 files)
- GitHub API calls for content creation
- Cloudflare Worker for content storage

### Kept
- Cloudflare Worker for AI generation only
- GitHub Pages for frontend hosting
- All exam questions and concepts in repo

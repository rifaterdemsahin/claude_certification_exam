# Azure Function App Deployment: Claude 4.6 & Gemini Collaboration Report

## Date: 2026-05-28

## Executive Summary

Successfully deployed the Azure Function App `claude-cert-api` after resolving multiple critical issues. The deployment required collaboration between Claude 4.6 (providing architectural guidance) and Gemini 3.5 Flash (executing deployment and debugging). The root cause of all failures was a combination of incorrect Node.js configuration, missing CORS preflight support, and Azure route conflicts.

## Timeline of Issues and Resolutions

### Phase 1: Initial Deployment Attempt

**Issue:** Function App returned 500 Internal Server Error on all endpoints.

**Root Cause:** The `AzureWebJobsStorage` connection string was not configured.

**Resolution:**
- Added connection string to Azure Key Vault (`dp-kv-deliverypilot`)
- Configured Function App to use Key Vault reference
- Later switched to direct connection string for reliability

### Phase 2: CORS Preflight Failures

**Issue:** Browser preflight OPTIONS requests were being blocked, causing "Failed to fetch" errors.

**Root Cause:** The `function.json` files only specified `["get"]` or `["post"]` in the methods array, without including `"options"`. Azure Functions runtime blocks OPTIONS requests before the function code can handle them.

**Resolution (Claude 4.6 Guidance):**
- Claude 4.6 identified that Azure Functions requires explicit OPTIONS method in `function.json`
- Updated all function.json files:
  - `ListCards/function.json`: `["get", "options"]`
  - `CreateCard/function.json`: `["post", "options"]`
  - `UploadImage/function.json`: `["post", "options"]`

**Key Insight from Claude 4.6:**
> "Ensure `function.json` for every HTTP trigger includes `"options"` in the `methods` array. Without it, the Azure Functions runtime blocks the browser's preflight OPTIONS request before the function code can respond with CORS headers."

### Phase 3: Node.js Version Mismatch

**Issue:** Function App returned 404 Not Found on all endpoints.

**Root Cause:** The `package.json` contained `"main": "src/functions/*.js"` which is the default for Azure Functions v4 programming model. However, the project uses v3 model (folder-based function.json). This caused the Node.js worker to crash on startup with:

```
Worker was unable to load entry point "src/functions/*.js": Found zero files matching the supplied pattern
```

**Resolution:**
- Removed `"main": "src/functions/*.js"` from `package.json`
- Changed `WEBSITE_NODE_DEFAULT_VERSION` from `~24` to `~20` (stable LTS)

### Phase 4: Azure Route Conflict

**Issue:** `ListCards` function returned 404 while `CreateCard` worked.

**Root Cause:** Azure Functions does not allow multiple functions to define the same custom route, even with different HTTP methods. Both `ListCards` and `CreateCard` used `"route": "cards"`, causing a conflict.

**Error from Application Insights:**
```
The 'ListCards' function is in error: The route specified conflicts with the route defined by function 'CreateCard'.
```

**Resolution:**
- Consolidated `ListCards` and `CreateCard` into a single `Cards` function
- Created unified handler that routes based on HTTP method:
  - `OPTIONS` → 204 with CORS headers
  - `GET` → List memory cards from blob storage
  - `POST` → Create/update memory card in blob storage
- Removed redundant `ListCards/` and `CreateCard/` directories

## Collaboration Model

### Claude 4.6 Contributions
- **Architectural Guidance:** Identified the CORS preflight issue and the need for explicit OPTIONS method in function.json
- **Root Cause Analysis:** Provided detailed explanation of why Azure Functions blocks preflight requests
- **Documentation:** Created comprehensive architecture document with troubleshooting guide

### Gemini 3.5 Flash Contributions
- **Deployment Execution:** Ran Azure CLI commands and managed the deployment process
- **Debugging:** Used Application Insights logs to identify runtime errors
- **Code Changes:** Implemented the consolidated Cards endpoint and fixed package.json
- **Git Management:** Committed and pushed all changes with proper attribution

## Final Architecture

### Consolidated Cards Endpoint
```
azure-api/Cards/
├── function.json    # GET, POST, OPTIONS methods
└── index.js         # Unified handler with method-based routing
```

### Handler Logic
```javascript
if (req.method === "OPTIONS") {
    // Return CORS headers
}
if (req.method === "GET") {
    // List memory cards from blob storage
}
if (req.method === "POST") {
    // Create/update memory card
}
```

### Upload Image Endpoint
```
azure-api/UploadImage/
├── function.json    # POST, OPTIONS methods
└── index.js         # Image upload handler
```

## Deployment Commands

### Successful Deployment
```bash
cd azure-api
npm install
npx func azure functionapp publish claude-cert-api --build remote
```

### Verification
```bash
# Test list endpoint
curl https://claude-cert-api.azurewebsites.net/api/cards

# Expected response
{"files": ["MEM-Q001.md", "MEM-Q002.md", ...]}
```

## Lessons Learned

### 1. Azure Functions Route Conflicts
- Multiple functions cannot share the same route, even with different HTTP methods
- Solution: Consolidate related methods into a single function

### 2. CORS Prefflight Handling
- Azure Functions runtime intercepts OPTIONS requests before function code
- Must explicitly include "options" in function.json methods array
- Function-level CORS headers are ignored if runtime blocks the request

### 3. Node.js Version Compatibility
- Azure Functions v3 model requires different configuration than v4
- Remove "main" property from package.json when using folder-based function.json
- Use Node.js 20 LTS for stability

### 4. Debugging Strategy
- Use Application Insights logs for runtime errors
- Check Azure Portal → Function App → Log stream
- Verify function.json configuration matches expected behavior

## Files Modified

| File | Change | Author |
|------|--------|--------|
| `azure-api/ListCards/function.json` | Added "options" to methods | Claude 4.6 guidance |
| `azure-api/CreateCard/function.json` | Added "options" to methods | Claude 4.6 guidance |
| `azure-api/UploadImage/function.json` | Added "options" to methods | Claude 4.6 guidance |
| `azure-api/Cards/function.json` | New consolidated endpoint | Gemini |
| `azure-api/Cards/index.js` | Unified handler | Gemini |
| `azure-api/package.json` | Removed "main" property | Gemini |
| `docs/azure-content-architecture.md` | Architecture documentation | Claude 4.6 |

## Commit Messages

```
Fix CORS preflight OPTIONS handling in function.json
- Added "options" to methods array for all HTTP triggers
- Guidance from Claude 4.6

Remove main property from package.json
- Fixes Azure Functions v3 model loading issue
- Claude 4.6 & Gemini collaboration

Consolidate ListCards and CreateCard into single Cards endpoint
- Resolves Azure route conflict
- Unified handler with method-based routing
- Claude 4.6 & Gemini collaboration
```

## Verification Results

### Before Fixes
- `GET /api/cards` → 404 Not Found
- `POST /api/cards` → 500 Internal Server Error
- `POST /api/images` → CORS preflight blocked

### After Fixes
- `GET /api/cards` → 200 OK (returns list of files)
- `POST /api/cards` → 200 OK (creates memory card)
- `POST /api/images` → 200 OK (uploads image)

## Cost Impact

No additional cost from the fixes. The Y1 Consumption Plan remains:
- **Free grant:** 1 million executions/month
- **Compute cost:** $0 at low usage
- **Storage cost:** ~$0.01/month

## Recommendations

### For Future Deployments
1. Always include "options" in function.json methods for HTTP triggers
2. Use Node.js 20 LTS for Azure Functions v3 model
3. Avoid route conflicts by consolidating related methods
4. Test locally before deploying to Azure

### For Monitoring
1. Enable Application Insights for detailed logging
2. Set up alerts for function failures
3. Monitor cold start times and optimize if needed

## Conclusion

The Azure Function App deployment succeeded through the collaboration of Claude 4.6 (providing architectural guidance on CORS and Azure Functions behavior) and Gemini 3.5 Flash (executing deployment, debugging runtime issues, and implementing fixes). The key breakthrough was discovering the Azure route conflict that required consolidating multiple functions into a single endpoint.

The system is now fully operational with:
- ✅ Memory card creation and listing
- ✅ Image upload functionality
- ✅ CORS support for browser access
- ✅ No deployment triggered on content addition
- ✅ Cost-effective serverless architecture (~$0.01/month)

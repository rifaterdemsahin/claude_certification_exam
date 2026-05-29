# Azure Function App Deployment Guide

## Prerequisites
- Azure CLI installed and logged in
- Storage account `claudecertstore` created
- Function App `claude-cert-api` created

## Step 1: Get Storage Connection String

1. Go to Azure Portal → Storage Accounts → `claudecertstore`
2. Click **Access keys** (left menu)
3. Copy the **Connection string** for key1

**Direct link:** https://portal.azure.com/#@/resource/subscriptions/b85b029d-9f7c-4c5a-8939-819480780c5d/resourceGroups/claude-certificate-training/providers/Microsoft.Storage/storageAccounts/claudecertstore/keys

## Step 2: Configure Function App

1. Go to Azure Portal → Function Apps → `claude-cert-api`
2. Click **Environment variables** (left menu)
3. Click **Add** → **Application setting**
4. Fill in:
   - **Name:** `AzureWebJobsStorage`
   - **Value:** `<paste connection string from step 1>`
5. Click **Apply** → **Confirm**

**Direct link:** https://portal.azure.com/#@/resource/subscriptions/b85b029d-9f7c-4c5a-8939-819480780c5d/resourceGroups/claude-certificate-training/providers/Microsoft.Web/sites/claude-cert-api/configuration

## Step 3: Deploy Function Code

Run these commands in terminal:

```bash
cd /Users/rifaterdemsahin/projects/claude_certification_exam/azure-api
npm install
npx func azure functionapp publish claude-cert-api
```

## Step 4: Test Deployment

```bash
# Test list cards endpoint
curl https://claude-cert-api.azurewebsites.net/api/cards

# Expected response: {"files": ["MEM-Q001.md", "MEM-Q002.md", ...]}
```

## Function App Details

| Property | Value |
|----------|-------|
| Name | `claude-cert-api` |
| URL | `https://claude-cert-api.azurewebsites.net` |
| Runtime | Node.js 24 |
| Resource Group | `claude-certificate-training` |
| Storage Account | `claudecertstore` |

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/cards` | List all memory cards |
| POST | `/api/cards` | Create/update a memory card |
| POST | `/api/images` | Upload an image |

## Troubleshooting

### "Failed to fetch" error
- Check that Function App is running
- Verify `AzureWebJobsStorage` is configured
- Check CORS settings in Function App

### 500 Internal Server Error
- Check Function App logs in Azure Portal
- Verify storage connection string is correct

### CORS errors
- Function code already includes `Access-Control-Allow-Origin: *`
- If still failing, add origin in Function App → CORS settings

## Quick Links

| Resource | Link |
|----------|------|
| Resource Group | https://portal.azure.com/#@/resource/subscriptions/b85b029d-9f7c-4c5a-8939-819480780c5d/resourceGroups/claude-certificate-training/overview |
| Storage Account | https://portal.azure.com/#@/resource/subscriptions/b85b029d-9f7c-4c5a-8939-819480780c5d/resourceGroups/claude-certificate-training/providers/Microsoft.Storage/storageAccounts/claudecertstore/overview |
| Function App | https://portal.azure.com/#@/resource/subscriptions/b85b029d-9f7c-4c5a-8939-819480780c5d/resourceGroups/claude-certificate-training/providers/Microsoft.Web/sites/claude-cert-api/appServices |
| Storage Access Keys | https://portal.azure.com/#@/resource/subscriptions/b85b029d-9f7c-4c5a-8939-819480780c5d/resourceGroups/claude-certificate-training/providers/Microsoft.Storage/storageAccounts/claudecertstore/keys |
| Function App Settings | https://portal.azure.com/#@/resource/subscriptions/b85b029d-9f7c-4c5a-8939-819480780c5d/resourceGroups/claude-certificate-training/providers/Microsoft.Web/sites/claude-cert-api/configuration |

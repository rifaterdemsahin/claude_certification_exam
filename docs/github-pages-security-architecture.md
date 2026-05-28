# GitHub Pages Security Architecture Guide

## Overview

GitHub Pages serves static content only — no server-side code, no authentication, no secrets. This document outlines secure architecture patterns for building authenticated applications on GitHub Pages.

## Architecture Options

### Option 1: Azure Function App as Backend (Current Implementation)

```
┌─────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│  GitHub Pages   │────→│  Azure Function App  │────→│  Azure Storage  │
│  (Frontend)     │     │  (Backend API)       │     │  (Data)         │
└─────────────────┘     └─────────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌─────────────────────┐
                        │  Azure Key Vault    │
                        │  (Secrets)          │
                        └─────────────────────┘
```

**Pros:**
- Full control over authentication
- Serverless scaling
- Secrets stored securely in Key Vault
- No CORS issues for same-origin API calls

**Cons:**
- Additional Azure costs (minimal with Y1 plan)
- Cold start delays (3-6 seconds)
- More complex deployment

**Security Features:**
- Admin password stored in Key Vault
- Session tokens with expiration
- CORS restrictions
- HTTPS only

### Option 2: Azure Static Web Apps with Built-in Auth

```
┌─────────────────────────────────────────┐
│  Azure Static Web Apps                  │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ Static Site │  │ API Functions    │  │
│  │ (Frontend)  │  │ (Backend)        │  │
│  └─────────────┘  └──────────────────┘  │
│         │                 │              │
│         ▼                 ▼              │
│  ┌─────────────────────────────────┐    │
│  │  Built-in Authentication       │    │
│  │  (GitHub, Google, Azure AD)    │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Pros:**
- Built-in authentication providers
- No custom auth code needed
- Free tier available
- Global CDN included

**Cons:**
- Tied to Azure ecosystem
- Less flexible than custom auth
- Requires Azure subscription

### Option 3: Cloudflare Workers + D1 Database

```
┌─────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│  GitHub Pages   │────→│  Cloudflare Workers  │────→│  D1 Database    │
│  (Frontend)     │     │  (Backend API)       │     │  (Data)         │
└─────────────────┘     └─────────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌─────────────────────┐
                        │  Cloudflare KV      │
                        │  (Sessions)         │
                        └─────────────────────┘
```

**Pros:**
- Very low latency
- Generous free tier
- Global edge network
- D1 SQL database

**Cons:**
- Different ecosystem from Azure
- Learning curve for Workers
- Limited to Cloudflare features

### Option 4: Supabase (PostgreSQL + Auth)

```
┌─────────────────┐     ┌─────────────────────┐
│  GitHub Pages   │────→│  Supabase           │
│  (Frontend)     │     │  ┌───────────────┐  │
└─────────────────┘     │  │ Auth          │  │
                        │  │ (Email, OAuth)│  │
                        │  └───────────────┘  │
                        │  ┌───────────────┐  │
                        │  │ PostgreSQL    │  │
                        │  │ (Database)    │  │
                        │  └───────────────┘  │
                        │  ┌───────────────┐  │
                        │  │ Storage       │  │
                        │  │ (Files)       │  │
                        │  └───────────────┘  │
                        └─────────────────────┘
```

**Pros:**
- Built-in authentication (Email, Google, GitHub)
- Real-time subscriptions
- Row-level security
- Generous free tier

**Cons:**
- External dependency
- Limited to PostgreSQL
- Vendor lock-in

### Option 5: Firebase (Google)

```
┌─────────────────┐     ┌─────────────────────┐
│  GitHub Pages   │────→│  Firebase           │
│  (Frontend)     │     │  ┌───────────────┐  │
└─────────────────┘     │  │ Auth          │  │
                        │  │ (Email, OAuth)│  │
                        │  └───────────────┘  │
                        │  ┌───────────────┐  │
                        │  │ Firestore     │  │
                        │  │ (NoSQL DB)    │  │
                        │  └───────────────┘  │
                        │  ┌───────────────┐  │
                        │  │ Storage       │  │
                        │  │ (Files)       │  │
                        │  └───────────────┘  │
                        └─────────────────────┘
```

**Pros:**
- Google OAuth built-in
- Real-time database
- Offline support
- Generous free tier

**Cons:**
- NoSQL only
- Vendor lock-in
- Limited querying

## Security Best Practices

### 1. Never Store Secrets in Frontend Code

```javascript
// ❌ WRONG - Secret exposed in frontend
const API_KEY = "sk-1234567890";

// ✅ CORRECT - Use environment variables or backend proxy
const response = await fetch('/api/proxy', {
    method: 'POST',
    body: JSON.stringify({ action: 'getData' })
});
```

### 2. Use HTTPS Everywhere

```javascript
// ❌ WRONG - HTTP endpoint
const API_URL = "http://api.example.com";

// ✅ CORRECT - HTTPS endpoint
const API_URL = "https://api.example.com";
```

### 3. Implement CORS Properly

```javascript
// Backend CORS configuration
const corsHeaders = {
    "Access-Control-Allow-Origin": "https://yourdomain.github.io",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
};
```

### 4. Use Token-Based Authentication

```javascript
// Frontend - Store token securely
localStorage.setItem('token', token);
localStorage.setItem('tokenExpiry', expiry);

// Backend - Validate token
function validateToken(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }
    const token = authHeader.substring(7);
    // Validate token against stored tokens
    return isValidToken(token);
}
```

### 5. Implement Token Expiration

```javascript
// Frontend - Check token expiry
function isTokenValid() {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');
    if (!token || !expiry) return false;
    return new Date(expiry) > new Date();
}

// Backend - Set token expiration
const tokenExpiry = Date.now() + (60 * 60 * 1000); // 1 hour
```

### 6. Use Key Vault for Secrets

```bash
# Store secret in Azure Key Vault
az keyvault secret set \
    --vault-name "my-vault" \
    --name "AdminPassword" \
    --value "SecurePassword123!"

# Reference in Function App
az functionapp config appsettings set \
    --name "my-function-app" \
    --resource-group "my-rg" \
    --settings "ADMIN_PASSWORD=@Microsoft.KeyVault(VaultName=my-vault;SecretName=AdminPassword)"
```

### 7. Implement Rate Limiting

```javascript
// Backend - Rate limiting middleware
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 8. Validate Input Data

```javascript
// Backend - Validate input
function validateInput(data) {
    if (!data.filename || !data.content) {
        return { valid: false, error: "Missing required fields" };
    }
    if (!data.filename.match(/^MEM-Q\d+\.md$/)) {
        return { valid: false, error: "Invalid filename format" };
    }
    if (data.content.length > 1000000) { // 1MB limit
        return { valid: false, error: "Content too large" };
    }
    return { valid: true };
}
```

## Current Implementation Details

### Architecture
- **Frontend:** GitHub Pages (static HTML/CSS/JS)
- **Backend:** Azure Function App (Node.js 20)
- **Storage:** Azure Blob Storage
- **Secrets:** Azure Key Vault
- **Authentication:** Custom token-based

### Security Measures
1. **Admin Password:** Stored in Azure Key Vault (`ClaudeCertificateSiteAdminPassword`)
2. **Session Tokens:** 1-hour expiration, stored in memory
3. **CORS:** Configured for specific origins
4. **HTTPS:** All communication encrypted
5. **Input Validation:** Server-side validation for all inputs
6. **Rate Limiting:** Azure Function App built-in throttling

### Authentication Flow
1. User enters admin password
2. Frontend sends POST to `/api/auth`
3. Backend validates password against Key Vault secret
4. Backend generates session token with 1-hour expiry
5. Frontend stores token in localStorage
6. Frontend includes token in Authorization header for protected endpoints
7. Backend validates token on each request

## Cost Comparison

| Solution | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| Azure Functions + Storage | 1M executions/month | ~$0.01/month | Enterprise, existing Azure |
| Azure Static Web Apps | 100GB bandwidth/month | ~$9/month | Azure-native apps |
| Cloudflare Workers | 100K requests/day | ~$5/month | Low latency, global |
| Supabase | 500MB database | ~$25/month | Full-stack apps |
| Firebase | 1GB storage | ~$25/month | Google ecosystem |

## Recommendations

### For This Project (Claude Certification Exam)
**Current approach is optimal:** Azure Function App + Blob Storage + Key Vault

Reasons:
- Minimal cost (~$0.01/month)
- Full control over authentication
- Secrets stored securely
- No vendor lock-in for core functionality
- Easy to migrate if needed

### For New Projects
Consider Azure Static Web Apps if:
- You need built-in authentication
- You want simplified deployment
- You're already in Azure ecosystem

Consider Supabase if:
- You need real-time features
- You want built-in auth providers
- You prefer PostgreSQL

## Migration Path

If you need to migrate from current architecture:

1. **Export data** from Azure Blob Storage
2. **Update frontend** to use new API endpoints
3. **Configure authentication** on new platform
4. **Test thoroughly** before switching DNS
5. **Update documentation** and environment variables

## References

- [Azure Functions Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/)
- [Azure Key Vault Documentation](https://learn.microsoft.com/en-us/azure/key-vault/)
- [GitHub Pages Security](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

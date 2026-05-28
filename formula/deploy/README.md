# Deployment Documentation

All deployment guides for the Claude Certification Study App infrastructure.

## Guides

| Document | Description |
|----------|-------------|
| [Cloudflare Worker](cloudflare-worker.md) | Deploy and maintain the vote/content worker |

## Quick Links

| Resource | URL |
|----------|-----|
| Cloudflare Dashboard | https://dash.cloudflare.com/3683d1886e0a3a3152242c84f226ba3f/workers-and-pages |
| Worker Endpoint | https://tiny-mode-1370.polished-boat-17b2.workers.dev |
| GitHub Gist (votes) | https://gist.github.com/rifaterdemsahin/2bfb092b05e08669b092f8371ac9c018 |
| GitHub Repo | https://github.com/rifaterdemsahin/claude_certification_exam |
| GitHub Pages | https://rifaterdemsahin.github.io/claude_certification_exam |
| OpenRouter Keys | https://openrouter.ai/keys |
| GitHub Tokens | https://github.com/settings/tokens |

## Worker Actions Summary

```mermaid
flowchart TD
    GET["GET /"] -->|"Read votes"| GIST["Gist API"]
    VOTE["POST {ids:[1,5]}"] -->|"Increment votes"| GIST
    RESET["POST {action:reset}"] -->|"Zero all votes"| GIST
    CARD["POST {action:create-card}"] -->|"Commit .md file"| REPO["GitHub API"]
    IMG["POST {action:upload-image}"] -->|"Commit image"| REPO
    AI["POST {action:ai-generate}"] -->|"Generate text"| OR["OpenRouter"]

    style GET fill:#38bdf8,stroke:#333,color:#fff
    style VOTE fill:#10b981,stroke:#333,color:#fff
    style RESET fill:#ef4444,stroke:#333,color:#fff
    style CARD fill:#f59e0b,stroke:#333,color:#fff
    style IMG fill:#a855f7,stroke:#333,color:#fff
    style AI fill:#ec4899,stroke:#333,color:#fff
```

## Prerequisites

- GitHub Classic Token with `repo` + `gist` scopes
- OpenRouter API Key (for AI writing helper)
- Cloudflare free tier account

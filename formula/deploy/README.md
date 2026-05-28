# Deployment Documentation

All deployment guides for the Claude Certification Study App infrastructure.

## Guides

| Document | Description |
|----------|-------------|
| [Cloudflare Worker](cloudflare-worker.md) | Deploy vote + content workers |

## Two Workers

```mermaid
flowchart LR
    subgraph "Vote Worker"
        V1["GET /"] -->|"Read"| G[Gist]
        V2["POST {ids}"] -->|"Vote"| G
        V3["POST {action:reset}"] -->|"Reset"| G
    end

    subgraph "Content Worker"
        C1["POST {action:create-card}"] -->|"Commit"| R[Repo]
        C2["POST {action:upload-image}"] -->|"Upload"| R
        C3["POST {action:ai-generate}"] -->|"Generate"| O[OpenRouter]
    end

    style V1 fill:#38bdf8,stroke:#333,color:#fff
    style V2 fill:#10b981,stroke:#333,color:#fff
    style V3 fill:#ef4444,stroke:#333,color:#fff
    style C1 fill:#f59e0b,stroke:#333,color:#fff
    style C2 fill:#a855f7,stroke:#333,color:#fff
    style C3 fill:#ec4899,stroke:#333,color:#fff
```

## Quick Links

| Resource | URL |
|----------|-----|
| Cloudflare Dashboard | https://dash.cloudflare.com/3683d1886e0a3a3152242c84f226ba3f/workers-and-pages |
| Vote Worker | https://vote-worker.polished-boat-17b2.workers.dev |
| Content Worker | https://content-worker.polished-boat-17b2.workers.dev |
| GitHub Gist (votes) | https://gist.github.com/rifaterdemsahin/2bfb092b05e08669b092f8371ac9c018 |
| GitHub Repo | https://github.com/rifaterdemsahin/claude_certification_exam |
| GitHub Pages | https://rifaterdemsahin.github.io/claude_certification_exam |
| OpenRouter Keys | https://openrouter.ai/keys |
| GitHub Tokens | https://github.com/settings/tokens |

## Worker Files

| File | Purpose |
|------|---------|
| `scripts/vote-worker.js` | Vote read/write/reset |
| `scripts/content-worker.js` | Cards, images, AI writing |
| `tests/test_vote_worker.js` | Vote worker tests |
| `tests/test_content_worker.js` | Content worker tests |

## Prerequisites

- GitHub Classic Token with `repo` + `gist` scopes
- OpenRouter API Key (for AI writing helper)
- Cloudflare free tier account

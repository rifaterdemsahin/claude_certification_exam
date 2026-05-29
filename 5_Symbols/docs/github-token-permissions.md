# GitHub Token Permissions Guide

What access your tokens need for different parts of the Claude Certification project.

## Token Types

| Type | URL | Best For |
|------|-----|----------|
| Classic | github.com/settings/tokens | Simple, broad access |
| Fine-grained | github.com/settings/tokens?type=beta | Precise, scoped access |

## Operations vs Required Permissions

### 1. Vote Worker (Gist Read/Write)

**What it does:** Reads and writes vote counts to a GitHub Gist.

| Token Type | Permissions Needed |
|------------|-------------------|
| Classic | `gist` scope |
| Fine-grained | User permissions → Gists → Read and write |

**Do NOT use** a fine-grained token for gists — it returns `403: Resource not accessible by personal access token`. Use a **classic token** with `gist` scope.

### 2. Memory Card Creation (Repo File Commits)

**What it does:** Creates new markdown files in `formula/memory/` and commits them to the repo.

| Token Type | Permissions Needed |
|------------|-------------------|
| Classic | `repo` scope (full control) |
| Fine-grained | Repository permissions → Contents → Read and write |

### 3. Code Review / PR Management

**What it does:** Creates branches, opens PRs, comments on PRs.

| Token Type | Permissions Needed |
|------------|-------------------|
| Classic | `repo` scope |
| Fine-grained | Repository permissions → Pull requests → Read and write |

### 4. Issue Management

**What it does:** Creates, labels, and closes issues.

| Token Type | Permissions Needed |
|------------|-------------------|
| Classic | `repo` scope |
| Fine-grained | Repository permissions → Issues → Read and write |

### 5. CI/CD (GitHub Actions)

**What it does:** Triggers workflow runs, reads artifacts.

| Token Type | Permissions Needed |
|------------|-------------------|
| Classic | `repo` scope + `workflow` scope |
| Fine-grained | Repository permissions → Actions → Read and write |

## Recommended Token Setup

### For the Vote Worker (Classic Token)

```
Name: claude-cert-votes
Expiration: 90 days
Scopes: [x] gist
```

### For Content Management (Classic Token)

```
Name: claude-cert-content
Expiration: 90 days
Scopes: [x] repo
```

### For Everything (Single Classic Token)

```
Name: claude-cert-admin
Expiration: 90 days
Scopes: [x] repo
        [x] gist
```

## Fine-Grained Token Permissions (If Preferred)

### Repository: `claude_certification_exam`

| Permission | Access Level | What It Allows |
|------------|-------------|----------------|
| Contents | Read and write | Create/edit/delete files |
| Commit statuses | Read | View CI status |
| Metadata | Read | View repo info |
| Pull requests | Read and write | Create/manage PRs |
| Issues | Read and write | Create/manage issues |
| Actions | Read and write | Trigger/manage workflows |

### User Permissions

| Permission | Access Level | What It Allows |
|------------|-------------|----------------|
| Gists | Read and write | Manage gists (NOT recommended — use classic token) |
| Private repo invitations | Read | Accept invites |

## Security Best Practices

1. **Minimum access** — Only grant what the operation needs
2. **Short expiration** — 90 days max, rotate regularly
3. **Separate tokens** — Don't use one token for everything
4. **Never commit tokens** — Store in Cloudflare Workers, env vars, or secret managers
5. **Revoke unused tokens** — Delete tokens you no longer need

## Token Scopes Quick Reference (Classic)

| Scope | Access |
|-------|--------|
| `repo` | Full control of repositories |
| `repo:status` | Read/write commit statuses |
| `public_repo` | Public repos only |
| `gist` | Full control of gists |
| `workflow` | Update GitHub Actions workflows |
| `read:org` | Read org membership |

## Where Tokens Are Used in This Project

| Location | Token Type | Purpose |
|----------|-----------|---------|
| Cloudflare Worker (vote proxy) | Classic `gist` | Write votes to gist |
| GitHub Actions (future) | Fine-grained or Classic `repo` | Auto-generate memory cards |
| Local scripts (manual) | Classic `repo` | Push content updates |

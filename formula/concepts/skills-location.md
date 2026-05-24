# Skills Location

## Overview

Claude Code supports **skills** — reusable prompt fragments that teach Claude how to perform specific tasks. The location where a skill file lives determines its scope, visibility, and shareability.

## Visual: Skills Location Hierarchy

![Skills Location Hierarchy](https://raw.githubusercontent.com/rifaterdemsahin/claude_certification_exam/main/assets/concepts/skills-location.png)

## The Two Locations

### 1. Personal Skills — `~/.claude/skills/`
- **Scope**: Available to Claude Code in *any* project on your machine
- **Use case**: Personal shortcuts, organization-specific workflows, credentials helpers
- **Not shared**: Lives outside any Git repository
- **Priority**: Lower than project skills — project skills override personal ones

### 2. Project Skills — `.claude/skills/` (inside the repo)
- **Scope**: Available only when working inside that specific project
- **Use case**: Team-wide PR review checklists, project-specific coding standards, deployment playbooks
- **Shared via Git**: Checked into version control so the whole team gets them
- **Priority**: Higher than personal skills for that project

## Exam Relevance

**CAT03: Claude Code Configuration & Workflows (20%)** — Expect questions on:

- Which skill location is best for a team-wide checklist? → **Project skills** (shared via Git)
- Which skill location is personal-only? → `~/.claude/skills/`
- What is the override priority? → Project > Personal

## Related Concepts

- [CLAUDE.md](claude-code.md) — The project-level constitution that works alongside skills
- [Custom Slash Commands](claude-code.md#slash-commands) — Often defined within skills

## Edit Link
[Edit this page](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/formula/concepts/skills-location.md)

# Mimo - Project Guidelines

Guidelines for Mimo (Xiaomi MiMo) working on the **Claude Developer Certification - Study Mastery App**.

## Core Architecture
- **Single-File App:** The main application lives entirely in `index.html`. Do not split into multiple entry points.
- **No Build Step:** No Webpack, Vite, or npm. Load React, Mermaid, and MQTT via CDN.
- **State:** Use browser cookies for progress, favorites, and mastered concepts.

## Styling & UI
- **Vanilla CSS:** Plain CSS inside `<style>` tags in `index.html`. No Tailwind, no CSS-in-JS.
- **Dark Theme:** Maintain `--bg-primary: #0f172a`, `--bg-secondary: #1e293b`, `--border: #334155`.
- **Responsive:** Mobile-first. Use `clamp()` for fluid typography.
- **Visuals:** SVGs, emojis, and Mermaid diagrams for learning aids.

## Content & Structure
- **5 Competencies (CAT01–CAT05):** Every question, doc, and page must map to one.
  - CAT01: Agentic Architecture & Orchestration (27%)
  - CAT02: Tool Design & MCP Integration (18%)
  - CAT03: Claude Code Configuration & Workflows (20%)
  - CAT04: Prompt Engineering & Structured Output (20%)
  - CAT05: Context Management & Reliability (15%)
- **Question IDs:** Pattern `CAT{NN}-Q{NNN}` (e.g., `CAT01-Q005`).
- **Directories:**
  - `assets/exam/`, `assets/memory/`, `assets/concepts/` — visual media
  - `data/exam.json` — question source data
  - `docs/` — study documentation
  - `formula/concepts/`, `formula/exam/`, `formula/memory/` — content files
  - `pages/` — auxiliary HTML pages with shared `nav.js` menu
  - `.kilo/agent/` — AI-specific guidelines (claude.md, gemini.md, opencode.md, mimo.md)

## Navigation & Pages
- **Shared Menu:** All auxiliary pages in `pages/` include `nav.js` which injects a sticky nav bar.
- **SEO:** Every page must have `<meta name="description">`, favicon link, and semantic HTML.

## AI Interaction Rules
- **Surgical Edits:** Use targeted replacements on `index.html`. Never rewrite the whole file.
- **Consistency:** Follow existing `questionsData`, `categories`, `state`, and `render*` patterns.
- **Cookie Keys:** Use `claude_cert_*` prefix (e.g., `claude_cert_favorites`, `claude_cert_progress_v2`).
- **Verification:** After edits, check that `render()` produces valid HTML and the app is functional.

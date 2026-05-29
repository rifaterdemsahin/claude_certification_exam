# Claude Developer Certification - Study Mastery App

Agent-focused guidance for AI tools working on this project.

## Project Purpose

Interactive study guide for the **Claude Developer Certification** exam. Single-file React app with 100 questions, visual hints, memory aids, and progress tracking.

## Core Architecture

- **Single-File App:** Main application is entirely within `index.html`.
- **No Build Step:** Do not introduce Webpack, Vite, or npm build scripts. Use libraries (React, etc.) via CDN.
- **State:** Use browser cookies for progress tracking.
- **Hosting:** Static site deployed to GitHub Pages.

## Styling & UI

- **Vanilla CSS:** Use plain CSS for all styling.
- **Theme:** Maintain the dark theme and responsive design.
- **Visuals:** Use SVG graphics and emojis for hints and mnemonics.
- **Design Tokens:**
  - `--bg-primary: #0f172a`
  - `--bg-secondary: #1e293b`
  - `--bg-card: #1e293b`
  - `--border: #334155`
  - `--text-primary: #e2e8f0`
  - `--text-secondary: #94a3b8`
  - `--accent-blue: #38bdf8`
  - `--accent-purple: #a855f7`
  - `--accent-green: #10b981`
  - `--accent-yellow: #fbbf24`
  - `--accent-red: #ef4444`
  - `--accent-orange: #f59e0b`

## Content & Structure

- **Competencies:** Align all questions and docs with the 5 core competency areas (01-05).
  - CAT01: Agentic Architecture & Orchestration (27%)
  - CAT02: Tool Design & MCP Integration (18%)
  - CAT03: Claude Code Configuration & Workflows (20%)
  - CAT04: Prompt Engineering & Structured Output (20%)
  - CAT05: Context Management & Reliability (15%)
- **Assets:** All visual media lives in `assets/`.
  - `assets/exam/` — Exam question images.
  - `assets/concepts/` — Concept diagrams (Moved to Azure Blob Storage).
- **Azure API:** Azure Function App for memory card operations in `azure-api/`.
- **Data:** Raw data and source material in `data/`.
  - `data/exam.json` — Question data source.
  - `data/exam_source.pdf` — Exam source material.
- **Docs Directory:** Keep study materials in `docs/` organized by competency.
- **Exercises:** Add hands-on challenges to the `exercises/` folder.
- **Formula:** Concept explanations and exam questions live in `formula/`.
  - `formula/concepts/`
  - `formula/exam/`
  - Memory cards stored in Azure Blob Storage.
- **Pages:** Auxiliary HTML pages in `pages/`.
  - `pages/dictionary.html`
  - `pages/markdown_renderer.html`
  - `pages/mindmap.html`
  - `pages/tactics.html`
  - `pages/agi-path.html`
  - `pages/skills.html` — AI skills, slash commands, and agent file guidance
  - `pages/explicit_criteria.html` — Explicit output criteria and constraint examples
  - `pages/structured_reasoning.html` — Chain-of-thought and structured reasoning patterns
  - `pages/multi_turn.html` — Multi-turn prompting strategies and patterns
  - `pages/context_compression.html` — Context window compression and summary techniques
- **Scripts:** Automation scripts in `scripts/`.
- **AI Guidelines:** Agent-specific instructions in project root.
  - `CLAUDE.md` — Claude-specific guidelines
  - `GEMINI.md` — Gemini CLI guidelines
  - `mimo.md` — Mimo (Xiaomi MiMo) guidelines
  - `AGENTS.md` — Multi-agent guidelines (this file)

## File Layout

```
.
├── index.html              # Main application (single-file React app)
├── AGENTS.md               # This file
├── README.md               # Human-facing project overview
├── .kilo/
│   └── agent/
│       ├── claude.md       # Claude-specific guidelines
│       ├── gemini.md       # Gemini-specific guidelines
│       ├── opencode.md     # OpenCode-specific guidelines
│       └── mimo.md         # Mimo (Xiaomi MiMo) guidelines
├── assets/                 # All visual media
│   ├── exam/               # Exam question images
│   ├── memory/             # Memory card visual aids (PNG/SVG)
│   └── concepts/           # Concept diagrams and illustrations
├── data/                   # Raw data & source material
│   ├── exam.json           # Question data source
│   └── exam_source.pdf     # Exam source material
├── docs/                   # Study documentation by competency
├── exercises/              # Hands-on coding challenges
├── formula/                # Concepts and exam questions
│   ├── concepts/
│   ├── exam/
│   └── memory/
├── pages/                  # Auxiliary HTML pages
│   ├── dictionary.html
│   ├── markdown_renderer.html
│   ├── mindmap.html
│   ├── tactics.html
│   ├── agi-path.html
│   ├── skills.html         # AI skills and slash-command guide
│   ├── explicit_criteria.html # Explicit output criteria examples
│   ├── structured_reasoning.html # Chain-of-thought and structured reasoning
│   ├── multi_turn.html      # Multi-turn prompting strategies
│   ├── context_compression.html # Context compression and summary
│   └── nav.js              # Shared navigation menu script
├── scripts/                # Automation scripts
│   └── generate_notes.py
├── robots.txt
└── sitemap.xml
```

## AI Interaction Rules

- **Surgical Edits:** When modifying `index.html`, use targeted replacements.
- **Consistency:** Follow existing naming conventions and component structures.
- **Verification:** Always verify changes by checking the live demo logic if possible.
- **CDN Libraries:** React, Mermaid, and MQTT are loaded via CDN in `index.html`.
- **Question IDs:** Use pattern `CAT{NN}-Q{NNN}` (e.g., `CAT01-Q005`).

## Related Files

- `CLAUDE.md` — Original project guidelines (kept for reference).
- `README.md` — Human-facing project overview.

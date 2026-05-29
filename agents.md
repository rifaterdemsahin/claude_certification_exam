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
- **Assets:** All visual media lives in `5_Symbols/assets/`.
  - `5_Symbols/assets/exam/` — Exam question images.
  - `5_Symbols/assets/concepts/` — Concept diagrams (Moved to Azure Blob Storage).
- **Azure API:** Azure Function App for memory card operations in `5_Symbols/azure-api/`.
- **Data:** Raw data and source material in `5_Symbols/data/`.
  - `5_Symbols/data/exam.json` — Question data source.
  - `5_Symbols/data/exam_source.pdf` — Exam source material.
- **Docs Directory:** Keep study materials in `5_Symbols/docs/` organized by competency.
- **Exercises:** Add hands-on challenges to the `exercises/` folder.
- **Formula:** Concept explanations and exam questions live in `4_Formula/`.
  - `4_Formula/concepts/`
  - `4_Formula/exam/`
  - Memory cards stored in Azure Blob Storage.
- **Pages:** Auxiliary HTML pages in `5_Symbols/pages/`.
  - `5_Symbols/pages/dictionary.html`
  - `5_Symbols/pages/markdown_renderer.html`
  - `5_Symbols/pages/mindmap.html`
  - `5_Symbols/pages/tactics.html`
  - `5_Symbols/pages/agi-path.html`
  - `5_Symbols/pages/skills.html` — AI skills, slash commands, and agent file guidance
  - `5_Symbols/pages/explicit_criteria.html` — Explicit output criteria and constraint examples
  - `5_Symbols/pages/structured_reasoning.html` — Chain-of-thought and structured reasoning patterns
  - `5_Symbols/pages/multi_turn.html` — Multi-turn prompting strategies and patterns
  - `5_Symbols/pages/context_compression.html` — Context window compression and summary techniques
- **Scripts:** Automation scripts in `5_Symbols/scripts/`.
- **AI Guidelines:** Agent-specific instructions in project root.
  - `claude.md` — Claude-specific guidelines
  - `gemini.md` — Gemini CLI guidelines
  - `mimo.md` — Mimo (Xiaomi MiMo) guidelines
  - `agents.md` — Multi-agent guidelines (this file)

## File Layout

```
.
├── index.html              # Main application (single-file React app)
├── agents.md               # Multi-agent guidelines (this file)
├── README.md               # Human-facing project overview
├── claude.md               # Claude-specific guidelines
├── gemini.md               # Gemini-specific guidelines
├── copilot.md              # GitHub Copilot guidelines
├── kilocode.md             # Kilo Code guidelines
├── mimo.md                 # Mimo-specific guidelines
├── 1_Real_Unknown/         # Problem definitions, OKRs, core questions, and hypotheses
│   ├── README.md           # Stage overview
│   ├── problem_statement.md # The core problem this project solves
│   ├── okrs.md             # Objectives and Key Results
│   ├── questions.md        # Open questions driving the work
│   └── hypotheses.md       # Assumptions to validate
├── 2_Environment/          # Setup and configuration guidelines
│   ├── README.md           # Stage overview
│   ├── azure.md            # Azure cloud integration
│   ├── cloudflare_workers.md # Cloudflare Workers edge configuration
│   ├── fly_io.md           # Backend hosting guide
│   ├── github_pages.md     # Frontend static hosting guide
│   └── navigation.md       # Navigation components
├── 3_Simulation/           # UI mockups and design vision
├── 4_Formula/              # Concepts, exam questions, and checklists
│   ├── concepts/           # Concept explanations
│   ├── exam/               # Exam question notes
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── INDEX_STRUCTURE.md
│   ├── PRO_EXAM_QUICK_START.md
│   └── PRO_EXAM_STATUS.md
├── 5_Symbols/              # Implementation code and assets
│   ├── assets/             # Visual media
│   ├── azure-api/          # Function App API
│   ├── css/                # App styles
│   ├── data/               # Raw source data (exam.json, etc.)
│   ├── docs/               # Technical documents
│   ├── js/                 # App logic scripts
│   ├── pages/              # Auxiliary HTML pages
│   └── scripts/            # Automation scripts
├── 6_Semblance/            # Error logs and workarounds
├── 7_Testing_Known/        # Testing configurations and scripts
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

- `claude.md` — Original project guidelines (kept for reference).
- `README.md` — Human-facing project overview.

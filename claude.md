# Claude Code Project Guidelines

## Project Overview

**Claude Developer Certification - Study Mastery App**

Interactive study guide for the Claude Developer Certification exam featuring 100 questions, visual hints, memory aids, and progress tracking.

## Core Architecture

- **Single-File App:** Entire frontend application in `index.html`
- **No Build Step:** Use CDNs for React, Mermaid, and other libraries. Never introduce npm, webpack, or vite.
- **State Management:** Browser cookies for progress tracking
- **Vanilla CSS:** All styling in plain CSS within `<style>` tags
- **Hosting:** Static site deployed to GitHub Pages

## Design Tokens

```css
--bg-primary: #0f172a
--bg-secondary: #1e293b
--bg-card: #1e293b
--border: #334155
--text-primary: #e2e8f0
--text-secondary: #94a3b8
--accent-blue: #38bdf8
--accent-purple: #a855f7
--accent-green: #10b981
--accent-yellow: #fbbf24
--accent-red: #ef4444
--accent-orange: #f59e0b
```

## Content Structure

### Competencies (5 Core Areas)
1. **CAT01:** Agentic Architecture & Orchestration (27%)
2. **CAT02:** Tool Design & MCP Integration (18%)
3. **CAT03:** Claude Code Configuration & Workflows (20%)
4. **CAT04:** Prompt Engineering & Structured Output (20%)
5. **CAT05:** Context Management & Reliability (15%)

### Question IDs
Pattern: `CAT{NN}-Q{NNN}` (e.g., `CAT01-Q005`)

## Directory Layout

```
├── index.html              # Main application (single-file React app)
├── agents.md               # Multi-agent guidelines
├── claude.md               # This file (Claude Code config)
├── gemini.md               # Gemini-specific guidelines
├── copilot.md              # GitHub Copilot guidelines
├── kilocode.md             # Kilo Code guidelines
├── mimo.md                 # Mimo-specific guidelines
├── README.md               # Human-facing project overview
├── 1_Real_Unknown/         # Problem definitions, OKRs, core questions, and hypotheses
│   ├── README.md           # Stage overview
│   ├── problem_statement.md # The core problem this project solves
│   ├── okrs.md             # Objectives and Key Results
│   ├── questions.md        # Open questions driving the work
│   └── hypotheses.md       # Assumptions to validate
├── 2_Environment/          # Setup and configuration guidelines
├── 3_Simulation/           # UI mockups and design vision
├── 4_Formula/              # Concepts, exam questions, and checklists
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
└── 7_Testing_Known/        # Testing configurations and scripts
```

## Code Editing Rules

### When modifying `index.html`
- Use **surgical edits** with targeted replacements
- Never rewrite large sections without explicit approval
- Preserve existing component structure and naming conventions
- Follow existing `questionsData` and `categories` patterns

### JavaScript Conventions
- Use descriptive function names: `renderSomething`, `handleSomething`
- Keep functions focused and single-purpose
- Maintain modularity even within the single file

### CSS Conventions
- Maintain dark theme consistency
- Ensure responsive design (mobile, tablet, desktop)
- Use the established design tokens

## Content Guidelines

- **Visuals:** Use SVG graphics and emojis for hints and mnemonics
- **Memory Cards:** Stored in Azure Blob Storage, accessible via `5_Symbols/pages/markdown_renderer.html`
- **Pattern:** `5_Symbols/pages/markdown_renderer.html?url=https://claudecertstore.blob.core.windows.net/memory-cards/MEM-Q{ID}.md&title=Memory Card {ID}`
- **Images:** Stored in Azure Blob Storage at `https://claudecertstore.blob.core.windows.net/memory-images/`

## Testing & Verification

- Always verify changes by checking the live demo logic
- For Mermaid charts, ensure valid syntax before committing
- Test responsive design across breakpoints

## Libraries (CDN)

- React 18
- Mermaid (for diagrams)
- No npm dependencies

## Common Tasks

### Adding a New Question
1. Add to `questionsData` array in `index.html`
2. Follow the CAT{NN}-Q{NNN} ID pattern
3. Include visual hint (SVG/emoji)
4. Add memory aid if applicable

### Creating Memory Cards
1. Use `5_Symbols/pages/quick_memory.html` or `5_Symbols/pages/add_memory_card.html`
2. Cards are stored in Azure Blob Storage (no GitHub deployment triggered)
3. Use naming pattern: `MEM-Q{ID}.md`

## Don'ts

- Don't introduce build tools (npm, webpack, vite)
- Don't use CSS preprocessors (Sass, Less)
- Don't add external dependencies without CDN approval
- Don't break the single-file architecture
- Don't modify cookie structure without migration plan

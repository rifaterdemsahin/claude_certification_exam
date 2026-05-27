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
├── index.html              # Main single-file React app
├── AGENTS.md               # Multi-agent guidelines
├── CLAUDE.md               # This file (Claude Code config)
├── GEMINI.md               # Gemini-specific guidelines
├── mimo.md                 # Mimo-specific guidelines
├── README.md               # Human-facing project overview
├── assets/                 # Visual media
│   ├── exam/               # Exam question images
│   ├── memory/             # Memory card visual aids
│   └── concepts/           # Concept diagrams
├── data/                   # Raw data & source material
├── docs/                   # Study documentation by competency
├── formula/                # Concepts, exam questions, memory cards
├── pages/                  # Auxiliary HTML pages
├── scripts/                # Automation scripts
└── tests/                  # Test files
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
- **Memory Cards:** Accessible via unique URLs using `pages/markdown_renderer.html`
- **Pattern:** `pages/markdown_renderer.html?url=../formula/memory/MEM-Q{ID}.md&title=Memory Card {ID}`

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
1. Create markdown file in `formula/memory/`
2. Use naming pattern: `MEM-Q{ID}.md`
3. Add URL to memory cards index

## Don'ts

- Don't introduce build tools (npm, webpack, vite)
- Don't use CSS preprocessors (Sass, Less)
- Don't add external dependencies without CDN approval
- Don't break the single-file architecture
- Don't modify cookie structure without migration plan

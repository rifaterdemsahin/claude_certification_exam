# Mimo (Xiaomi MiMo) - Project Guidelines

This file provides guidelines for Mimo AI working on the **Claude Developer Certification - Study Mastery App**.

## Project Identity

- **Purpose:** Interactive study guide for Claude Developer Certification exam
- **Architecture:** Single-file React app in `index.html`
- **Hosting:** GitHub Pages (static site)
- **State:** Browser cookies for progress tracking

## Core Constraints

### Architecture Rules
1. **Single-File App:** Everything stays in `index.html`
2. **No Build Step:** Never introduce npm, webpack, vite, or any build tool
3. **CDN Only:** Use CDNs for React, Mermaid, and other libraries
4. **Vanilla CSS:** Plain CSS in `<style>` tags, no preprocessors
5. **Cookie State:** Use browser cookies for persistence

### Design System
```css
/* Dark Theme Tokens */
--bg-primary: #0f172a
--bg-secondary: #1e293b
--bg-card: #1e293b
--border: #334155
--text-primary: #e2e8f0
--text-secondary: #94a3b8

/* Accent Colors */
--accent-blue: #38bdf8
--accent-purple: #a855f7
--accent-green: #10b981
--accent-yellow: #fbbf24
--accent-red: #ef4444
--accent-orange: #f59e0b
```

## Content Framework

### Competency Areas
| Code | Area | Weight |
|------|------|--------|
| CAT01 | Agentic Architecture & Orchestration | 27% |
| CAT02 | Tool Design & MCP Integration | 18% |
| CAT03 | Claude Code Configuration & Workflows | 20% |
| CAT04 | Prompt Engineering & Structured Output | 20% |
| CAT05 | Context Management & Reliability | 15% |

### Question Format
- **ID Pattern:** `CAT{NN}-Q{NNN}` (e.g., `CAT01-Q005`)
- **Visual Hints:** SVG graphics or emoji mnemonics
- **Memory Aids:** Short, memorable associations

## Editing Protocol

### When Working with `index.html`
1. **Surgical Edits Only:** Use targeted replacements, not full rewrites
2. **Preserve Structure:** Maintain existing component patterns
3. **Verify Changes:** Check live demo logic after modifications
4. **Naming Conventions:** Follow `renderSomething`, `handleSomething` patterns

### Content Modifications
- Align all questions with the 5 competency areas
- Include visual hints for each question
- Maintain consistency with existing `questionsData` structure

## File Organization

```
.
├── index.html              # Main app (single-file React)
├── exercises/              # Hands-on coding challenges
├── 1_Real_Unknown/         # OKRs and problem definitions
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

## Quality Checklist

Before completing any task:
- [ ] Changes are surgical, not wholesale rewrites
- [ ] Design tokens are used consistently
- [ ] Responsive design is maintained
- [ ] Visual hints (SVG/emoji) are included where appropriate
- [ ] Question IDs follow the CAT{NN}-Q{NNN} pattern
- [ ] No build tools or npm dependencies were introduced

## Memory Cards

### URL Pattern
```
5_Symbols/pages/markdown_renderer.html?url=https://claudecertstore.blob.core.windows.net/memory-cards/MEM-Q{ID}.md&title=Memory Card {ID}
```

### Storage
- Location: Azure Blob Storage (`memory-cards` container)
- Pattern: `MEM-Q{ID}.md`
- Images: Azure Blob Storage (`memory-images` container)

## Common Pitfalls

- **Don't** introduce npm or package.json
- **Don't** use CSS preprocessors
- **Don't** break the single-file architecture
- **Don't** modify cookie structure without migration
- **Don't** add external dependencies without CDN approval
- **Don't** rewrite large sections of index.html

## Bloom's Taxonomy Integration

Support multiple learning levels:
- **Remember:** Slideshows and flashcards
- **Analyse:** Concept breakdowns
- **Evaluate:** Relationships and trade-offs
- **Create:** Synthesizing knowledge for high-level goals

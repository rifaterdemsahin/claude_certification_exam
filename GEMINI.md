# Gemini - Project Guidelines

This file serves as a foundational mandate for Gemini CLI and other AI tools working on the **Claude Developer Certification - Study Mastery App**.

## 🛠️ Core Architecture
- **Single-File App:** The entire frontend application must reside in `index.html`.
- **No Build Step:** Use CDNs for all external libraries (React, Mermaid, etc.). Do not introduce npm, webpack, or vite.
- **State Management:** Use browser cookies for persistent progress tracking.
- **Vanilla CSS:** All styling must be written in plain CSS within `<style>` tags in `index.html`.

## 🎨 Styling & UI
- **Dark Theme:** Maintain the established dark theme (`#0f172a` background, etc.).
- **Responsive Design:** Ensure the app works on mobile, tablet, and desktop.
- **Visuals:** Use SVGs and Emojis for mnemonics. Incorporate Mermaid charts for complex relationships.

## 📚 Content & Structure
- **Competencies:** Align all content with the 5 core areas:
  1. Agentic Architecture & Orchestration (27%)
  2. Tool Design & MCP Integration (18%)
  3. Claude Code Configuration & Workflows (20%)
  4. Prompt Engineering & Structured Output (20%)
  5. Context Management & Reliability (15%)
- **Directory Usage:**
  - `assets/`: Visual media — `assets/exam/` for question images, `assets/memory/` for memory card visuals.
  - `data/`: Raw data — `data/exam.json`, `data/exam_source.pdf`.
  - `docs/`: Markdown files for detailed study content.
  - `exercises/`: Hands-on coding challenges.
  - `formula/`: Concepts (`concepts/`), exam questions (`exam/`), and memory card notes (`memory/`).
  - `pages/`: Auxiliary HTML pages (`dictionary.html`, `markdown_renderer.html`, `memory_cards.html`).
  - `scripts/`: Utility scripts.
  - `CLAUDE.md`, `GEMINI.md`, `mimo.md`: AI-specific guideline files in project root.

## 🔗 Unique URLs & Accessibility
- All memory cards must be accessible via unique URLs using the `pages/markdown_renderer.html`.
- Pattern: `pages/markdown_renderer.html?url=../formula/memory/MEM-Q{ID}.md&title=Memory Card {ID}`
- A central index of these URLs should be maintained in `pages/memory_cards.html`.

## 🤖 AI Interaction Rules
- **Surgical Edits:** Use targeted `replace` calls when modifying `index.html`.
- **Consistency:** Follow the existing `questionsData` and `categories` structure.
- **Modularity:** Even within a single file, keep JS functions focused and well-named (e.g., `renderSomething`, `handleSomething`).
- **Validation:** Always verify logic changes. For Mermaid charts, ensure valid syntax.

## 🧠 Bloom's Taxonomy Integration
The app should support multiple levels of learning:
- **Remember:** Slideshows and flashcards for recall.
- **Analyse:** Breakdown of key concepts into components.
- **Evaluate:** Understanding relationships and trade-offs between architectural patterns.
- **Create:** Synthesizing knowledge to understand high-level goals like AGI.

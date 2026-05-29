# Sanity Check Review — v1

Review of the refactored project structure and navigation. This document lists observations, near-misses, and concrete suggestions to perform.

## 🔍 Observations & Near-Misses

### 1. Guideline File Case Sensitivity
- **Issue:** We renamed `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md` to lowercase (`agents.md`, `claude.md`, `gemini.md`) to prevent 404 errors on case-sensitive Linux servers (like GitHub Pages).
- **Impact:** However, inside the codebase (namely `README.md`, `agents.md`, `claude.md`, `gemini.md`, `copilot.md`, `kilocode.md`), there are still multiple references to these files in uppercase (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`).
- **Correction:** We must update all code/guideline file structure descriptions to refer to lowercase `agents.md`, `claude.md`, and `gemini.md`.

### 2. GitHub Inline Edit Links in Markdown Files
- **Issue:** Inside `4_Formula/concepts/*.md` and `4_Formula/exam/*.md`, there are edit-button footers with hardcoded URLs pointing to the old folder path:
  `[Edit this page](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/formula/concepts/...)`
- **Impact:** While the `formula` symbolic link prevents broken requests locally and on Pages, developers trying to click "Edit this page" to make changes directly on GitHub will get a 404 on the GitHub web UI because the directory is now renamed to `4_Formula/`.
- **Correction:** Update all inline edit links in these markdown files to reference `4_Formula` instead of `formula`.

### 3. JSDOM Test Automation File Loader
- **Issue:** The test framework in `tests/test_logic.js` previously relied on manual parsing of inline script blocks and was broken because variables were declared as block-scoped `const`/`let` in separate files (`data.js` and `state.js`).
- **Correction:** We have updated the script loader to attach variables to JSDOM's `window` context and initialized the DOM with standard HTTP localhost configurations to make cookie testing work cleanly.

---

## 🛠️ Action Plan (Suggestions to Execute)

1. [x] **Update index.html Footer Link**: Make sure the repository link references the correct paths.
2. [ ] **Case Correction for Agent Files**: Update references to uppercase `CLAUDE.md`, `GEMINI.md`, and `AGENTS.md` inside `agents.md`, `claude.md`, `gemini.md`, `copilot.md`, `kilocode.md`, and `README.md` to use lowercase filenames.
3. [ ] **Update Edit Page Footers**: Write a Python script to scan all files under `4_Formula/concepts/` and `4_Formula/exam/` and replace `formula/concepts/` with `4_Formula/concepts/` and `formula/exam/` with `4_Formula/exam/` in their GitHub edit links.

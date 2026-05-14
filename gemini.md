# Gemini - Project Guidelines

This file serves as a reminder for AI tools (like Gemini) working on the **Claude Developer Certification - Study Mastery App**.

## 🛠️ Core Architecture
- **Single-File App:** The main application is contained entirely within `index.html`.
- **No Build Step:** Do not introduce Webpack, Vite, or npm build scripts. Use libraries (React, etc.) via CDN.
- **State:** Use browser cookies for progress tracking.

## 🎨 Styling & UI
- **Vanilla CSS:** Use plain CSS for all styling.
- **Theme:** Maintain the dark theme and responsive design.
- **Visuals:** Use SVG graphics and emojis for hints and mnemonics.

## 📚 Content & Structure
- **Competencies:** Align all questions and docs with the 5 core competency areas (01-05).
- **Docs Directory:** Keep study materials in `docs/` organized by competency.
- **Exercises:** Add hands-on challenges to the `exercises/` folder.

## 🤖 AI Interaction Rules
- **Surgical Edits:** When modifying `index.html`, use targeted replacements.
- **Consistency:** Follow existing naming conventions and component structures.
- **Verification:** Always verify changes by checking the live demo logic if possible.

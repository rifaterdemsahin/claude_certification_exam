# Sanity Check Review — v2

Comprehensive sanity review of the Claude Developer Certification Study App. This document assesses the self-learning system modules, identifies gaps, lists near-misses, and outlines an action plan for future work.

---

## 📊 Modules Under Review
The self-learning system leverages Bloom's Taxonomy hierarchy across five key stages:
1. **Remember (Start Point):** Flashcards (`cards.html`), slideshow (`remember.html`), quiz (`quiz.html`), memory cards index (`memory_cards.html`), add card (`add_memory_card.html`), and quick memory (`quick_memory.html`).
2. **Understand (Apply):** Mock exam cards (`exam.html`), practice exam (`practice_exam.html`), and pro exam (`pro-exam.html`).
3. **Analyse (Connect):** BMAD (`bmad.html`), AGI Path (`agi-path.html`), architecture (`claude_architecture.html`), context compression (`context_compression.html`), explicit criteria (`explicit_criteria.html`), dictionary (`dictionary.html`), and mindmap (`mindmap.html`).
4. **Evaluate (Collaborate):** Multiplayer game (`multiplayer.html`), discussion board (`understand.html`), and model pricing comparison (`claude_pricing.html`).
5. **Create (Build):** Vote for videos (`create.html`), creator (`creator.html`), and tactics (`tactics.html`).

---

## 🔍 Identified Gaps

### 1. Capacity Limits in Image Assets (Q30-Q31, Q40-Q42, Q44, Q54-Q58)
* **Gap:** Eleven visual mnemonics are currently missing because the DALL-E image generator hit model request limits (`429 Resource Exhausted`).
* **Impact:** The study app falls back to rendering small placeholder graphics for these questions instead of the detailed, surreal De Chirico visual mnemonics.
* **Resolution Plan:** Generate the remaining 11 images using the prompts in `mnemonic_prompts.json` once the quota resets (expected at 21:24 Local Time), copy them, and upload using `copy_and_upload_images.sh`.

### 2. Static Question Previews on Memory Cards Grid
* **Gap:** The Memory Cards Index (`memory_cards.html`) only displays generic labels like `"Memory Card 001"` instead of the actual question text.
* **Impact:** Users browsing the index cannot quickly identify which card covers what topic without clicking into the card.
* **Resolution Plan:** Import the static `questionsData` database from `5_Symbols/js/data.js` into `memory_cards.html` and render the question text inside the grid cards.

### 3. Duplicate Navigation Lists & Redundancy
* **Gap:** The project navigation structure is maintained separately in `5_Symbols/js/nav.js` (`navItems` array) and `5_Symbols/pages/markdown_renderer.html` (sidebar list).
* **Impact:** Adding, removing, or renaming files requires updating multiple files manually, making the system prone to drift and broken links.
* **Resolution Plan:** Consolidate navigation configs or design a shared script configuration to load data.

### 4. No Centralized Progress Reset
* **Gap:** While a user can reset overall card mastery progress on the main dashboard, dictionary check-offs (`dict_remembered` cookie) and mock exam progress (`exam_state` cookie) must be reset page-by-page.
* **Impact:** No "Clear All Progress" button exists to let a user start the entire certification prep from a blank slate.
* **Resolution Plan:** Implement a global `resetAllData()` function on `index.html` that clears all app cookies.

### 5. Local vs. Cloud Image Sync Gaps
* **Gap:** The test file `test_pro_exam_images.js` asserts the local presence of files but does not verify whether they have been correctly uploaded to Azure Blob Storage.
* **Impact:** Deployed sites might load 404 images from the cloud if a copy script failed or was skipped, even when tests pass locally.
* **Resolution Plan:** Update `test_pro_exam_images.js` to execute HEAD requests to the Azure URLs and assert HTTP 200 responses.

### 6. Empty Example Placeholders in Dictionary
* **Gap:** Several dictionary terms in `dictionary.html` have empty example links (`example: ""`), leaving learners without real examples.
* **Impact:** Incomplete visual mnemonics for specific terminology.
* **Resolution Plan:** Go through terms like "structured error handling" or "context window management" and add visual link paths.

---

## 🛠️ Action Plan

- [ ] **Resume Visual Mnemonic Generation:** Run the generation loop for the remaining 11 questions (Q30-Q31, Q40-Q42, Q44, Q54-Q58) after 21:24. Run `copy_and_upload_images.sh` to upload them.
- [ ] **Enhance Memory Cards Index:** Link `5_Symbols/js/data.js` in `5_Symbols/pages/memory_cards.html` to render actual question previews.
- [ ] **Verify Azure Blob Presence in Tests:** Implement asynchronous HTTP checks in `7_Testing_Known/test_pro_exam_images.js` to assert remote file availability.
- [ ] **Implement Global Progress Reset:** Add a global reset action on the home dashboard to wipe out all learning data cookies.
- [ ] **Complete Dictionary Examples:** Add visual links for key terms currently lacking diagrams.

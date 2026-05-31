# 📋 Claude Developer Certification - Kanban Board

## 📥 Backlog
- [ ] Add alerting for the cost management https://portal.azure.com/#view/Microsoft_Azure_CostManagement/Menu/~/costanalysis/openedBy/AzurePortal > requires manual Azure Portal setup
- [ ] Move these pages to the create menu > https://rifaterdemsahin.github.io/claude_certification_exam/5_Symbols/pages/quick_memory.html > https://rifaterdemsahin.github.io/claude_certification_exam/5_Symbols/pages/add_memory_card.html  > https://rifaterdemsahin.github.io/claude_certification_exam/5_Symbols/pages/analyse_renderer.html?action=new in Admin group and remove from other menus


-> These backlog tasks are implemented in bulk by Claude and moved to done

## ⚙️ In Progress
### WIP 1 : Real time AI everything else goes to backlog

-> Manually getting implemented by Gemini and hands on implementation
- [ ] Add Generate the audio files upload to azure and add Kokoro audio play button to pro-exam.html > https://rifaterdemsahin.github.io/claude_certification_exam/5_Symbols/pages/pro-exam.html

## ⚙️ Maintenance

- [ ] Update the environment folder > 1_Real_Unknown
- [ ] Update the environment folder > 2_Environment
- [ ] Add new features incoming as visuals folder > 3_Simulation
- [ ] Add new ways of doing the implementation  to formula folder > 4_Formula
- [ ] Update the Symbols and pay technical debt > 5_Symbols
- [ ] Add new errors in semblance  > 6_Semblance
- [x] Update the tests folder > 7_Testing_Known — link checker added


## ✅ Done
- [x] Add Category selection + 🤖 Generate Template button + 📋 Copy AI Prompt button to analyse_renderer.html new-page creation form
- [x] Update remember.html: show Azure memory palace images when answer revealed, improved ⬅️/👁️/➡️ nav buttons with icons, 🔊 audio play button scaffold
- [x] Azure data loading: created data_loader.js (fetches questions.json from Azure, falls back to data.js); generated questions.json; remember.html and mastery.html now load via dataReady promise; loading state shown while fetching
- [x] Add AI spend, AI weak links, Jupiter Labs AI code, slash commands, AI mental health, World model (Gemini Omni) to the Analyse menu as 📹 Video Resources section in menu.json and nav.js; also added to search_index.json
- [x] Add history_of_ai_from_semi_conductors.html to the Analyse menu (Architectures & Loops section) and search_index.json
- [x] Add maintenance checklist to claude.md and antigravity.md covering all 7 stage folders (`cf2b9b2`)
- [x] Kokoro TTS pipeline: Dockerised `ghcr.io/remsky/kokoro-fastapi-cpu:latest`, generated all 100 MP3s, uploaded to Azure `memory-audio` container, wired `audioUrl` in data.js (`fabf3ca`)
- [x] Add 🔊 Play Audio button to memory cards — flip card back and modal in cards.html (`3217eff`)
- [x] Add `2_Environment/kokoro.md` (Docker setup, API ref, Azure config, troubleshooting) and `4_Formula/kokoro_audio_pipeline.md` (end-to-end pipeline formula)
- [x] Update `2_Environment/azure.md` with `memory-audio` container row and portal link
- [x] Add debug console logging (page, session keys, cookies) when debug mode is active
- [x] Make analyse menu dropdowns open on click in addition to hover (click-toggle with .click-open class)
- [x] Auto-collapse Blooms guide by default (closed unless user explicitly opens it; cookie persists preference)
- [x] Dynamic Azure-hosted menu.json and search_index.json synced automatically upon page saving/deletion.
- [x] Move the Analyse pages to Azure
- [x] Implement Delivery Pilot Template
- [x] Update and rewrite bookmarks.md, register in layout trees, sidebar notes, and debug menus (`2c9bd58`)
- [x] Create sanity check review v2 and document project gaps (`3ab086f`)
- [x] Copy and upload generated mnemonics for questions 23-29, 33-39, 49-53 and fix security push blocker (`2fb081a`)
- [x] Update Semblance log with verification check at 13:12 (`558c228`)
- [x] Add `mnemonic_generation_blockage.md` Semblance document (`1acf6c3`)
- [x] Generate and upload initial batch of surreal memory palace images (q018-q022, q032, q045-q048) (`c0cfc08`)
- [x] Generate and upload memory palace diagrams for questions 18 to 58 and verify (`9a43cf5`)
- [x] Update hint images for questions 7 to 17 to PNG format and verify (`37c7531`)
- [x] Update hint images for questions 1 to 6 to PNG format and verify (`dde12bb`)
- [x] Add mastered functionality to pro-exam with cookie persistence and reset (`108737c`)
- [x] Find and remove duplicates, and create `antigravity.md` guidelines (`24f0b71`)
- [x] Move duplicate tactics sections from `index.html` to `tactics.html`, classify tactics.html under Category 5 (Create) and update emoji to temple (`e23ba16`)
- [x] Add Bloom's self-learning progress tracker widget with cookie persistence, self-reporting, and automatic hooks (`b6c4ecf`)
- [x] Update navigation labels with step numbers and add visual Bloom's self-learning loop guide banner (`41ff98e`)
- [x] Add `sanity_check_review_v1.md` to document project structure observations and suggestions (`da00e16`)
- [x] Add `user_experience.md` to debug drawer menu list and update tests (`f62511b`)
- [x] Create `user_experience.md`, document mockups, update layouts, and pass JSDOM tests (`2b8e59e`)
- [x] Link checker test: `7_Testing_Known/test_links.js` — checks 49 GitHub Pages + Azure blob URLs, generates fix prompt for broken links; 49/49 pass (`npm run test:links`)
- [x] Embed 🔊 audio play button in remember.html — always visible below question, auto-stops on nav (`c91def0`+)
- [x] Add `2_Environment/azure.md` and expand environment directory trees (`a3a7402`)
- [x] Add Stage 1 problem_statement, okrs, questions, hypotheses and expand directory trees (`b01f12a`)
- [x] Update paths and references to align with the 7-Stage directory layout (5_Symbols and 7_Testing_Known) (`98645d3`)
- [x] Add Debug Menu Dashboard in delivery pilot template
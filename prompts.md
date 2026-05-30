# Prompts Used to Generate the Claude Certification Study App

This file documents the prompts used to build the project, reconstructed from git commit history. Each entry includes the commit ID and the likely prompt that generated the code.

---

## Commit 1: `1fba166` — Initial commit: Claude Dev Cert study app with 100 questions

Create a Claude Developer Certification study app with 100 questions covering all exam topics. Include categories for Agentic Architecture, Tool Design & MCP, Claude Code Workflows, Prompt Engineering, and Context & Reliability. Each question should have a question, 4 answer options, correct answer, explanation, and a hint. Use React with a single HTML file.

---

## Commit 2: `83c5a8d` — Create static.yml

Create a GitHub Actions workflow file for deploying to GitHub Pages as a static site.

---

## Commit 3: `7777eea` — Add visual hints with SVG+emojis and YouTube learning resources

Add visual hints to each question using SVG graphics and emojis. Include YouTube learning resource links for each question to help with studying.

---

## Commit 4: `0af4cb8` — updates

General updates to the app.

---

## Commit 5: `7f7d487` — Rewrite as vanilla JS for GitHub Pages, add mobile responsive + LinkedIn footer

Rewrite the app from React to vanilla JavaScript so it works on GitHub Pages without a build step. Make it mobile responsive. Add a LinkedIn footer with my profile link.

---

## Commit 6: `1039fc4` — Add gemini.md, claude.md, and opencode.md documentation files

Create documentation files for AI tools (gemini.md, claude.md, opencode.md) with guidelines for how each AI tool should work with this project.

---

## Commit 7: `cff750f` — Update AI tool guidelines with core project architecture and conventions

Update the AI tool documentation files with the core project architecture, conventions, and rules for editing the codebase.

---

## Commit 8: `fc07024` — Enhance quiz mode with randomized unanswered questions, progress tracking, and reset functionality

Enhance the quiz mode to show randomized unanswered questions first. Add progress tracking to show how many questions have been answered. Add a reset button to clear progress and start over.

---

## Commit 9: `8720e7f` — feat: add Remember, Analyse, Evaluate, and Create pages with Mermaid diagrams and slideshow

Create separate pages for Remember (flashcard slideshow), Analyse (statistics), Evaluate (concept maps with Mermaid diagrams), and Create (AGI path). Each page should have its own navigation and study mode.

---

## Commit 10: `1fc68f4` — feat: add SEO files, favicon, and fix navigation menu

Add SEO files (sitemap.xml, robots.txt), a favicon, and fix the navigation menu to properly link between pages.

---

## Commit 11: `e5d97ac` — feat: add JSON UIDs, footnote source viewer, media embeds, Claude TA button, and debug mode

Add unique IDs (UIDs) to each question in JSON format. Add a footnote source viewer to show where answers come from. Add media embeds for video/audio content. Add a "Ask Claude TA" button that opens Claude with the question. Add a debug mode for development.

---

## Commit 12: `680d165` — fix: increase card size, move Ask Claude/video/audio into hint popup, remove overlapping buttons

Increase the card size for better readability. Move the Ask Claude, video, and audio buttons into the hint popup to reduce clutter. Remove overlapping buttons that were causing UI issues.

---

## Commit 13: `8af4f2b` — Add initial content to readme.md

Add initial content to the README.md file with project description and setup instructions.

---

## Commit 14: `a4ea1f4` — Add files via upload

Upload files to the repository.

---

## Commit 15: `ae62e4c` — feat: add per-question imageUrl to JSON, show image on card front for 4s then fade out

Add an imageUrl field to each question in the JSON data. Show the image on the front of each card for 4 seconds, then fade it out to reveal the question text.

---

## Commit 16: `1ba34f9` — Merge branch 'main'

Merge remote changes.

---

## Commit 17: `f3cd0e5` — fix: scrollable hint popup, add shuffle button, emojis+colors on nav tabs, add learning tagline

Make the hint popup scrollable for long content. Add a shuffle button to randomize card order. Add emojis and colors to navigation tabs. Add a learning tagline to the header.

---

## Commit 18: `7fc1a21` — feat: global shuffle button, card modal popup, conditional video/audio, related video + Google Images links

Add a global shuffle button that works across all cards. Create a card modal popup for detailed view. Show video/audio conditionally based on availability. Add related video and Google Images search links to each card.

---

## Commit 19: `ba96e8f` — Create CAT01-Q001.md

Create the first study note markdown file for question CAT01-Q001.

---

## Commit 20: `cbe615e` — feat: add notesUrl to JSON, create markdown_renderer.html, conditionally show Notes link in hint and card modal

Add a notesUrl field to each question in JSON. Create a markdown_renderer.html page that can render markdown files. Conditionally show a Notes link in the hint popup and card modal when notes are available.

---

## Commit 21: `b05731e` — Merge branch 'main'

Merge remote changes.

---

## Commit 22: `29c191a` — feat: fix back button in markdown renderer, add dictionary.html with certification terms and video examples, add dictionary nav link

Fix the back button in the markdown renderer to properly navigate back. Create a dictionary page with certification terms and definitions. Include video examples for each term. Add a dictionary link to the navigation.

---

## Commit 23: `6d00428` — refactor: default Unmastered filter, sticky filter bar, reorganize nav into Study/Explore/Links groups

Set the default filter to show only unmastered cards. Make the filter bar sticky so it stays visible when scrolling. Reorganize the navigation into Study, Explore, and Links groups.

---

## Commit 24: `4c5d508` — fix: replace broken shuffle logic with simple random sort toggle

Fix the broken shuffle logic by replacing it with a simple random sort toggle button.

---

## Commit 25: `4f695b7` — feat: add multiplayer exam game with MQTT sync, real-time chat, and director controls

Create a multiplayer exam game mode. Use MQTT for real-time synchronization between players. Add a real-time chat feature. Add director controls for managing the game session.

---

## Commit 26: `d4d46a5` — feat: add Mock Exam tab and exam.json with 40 questions

Add a Mock Exam tab that simulates the real exam experience. Create an exam.json file with 40 questions specifically for mock exams.

---

## Commit 27: `bb0d2ca` — docs: generate 40 question-specific study notes in formula/ with GitHub edit links

Generate 40 question-specific study notes as markdown files in the formula/ directory. Include GitHub edit links so users can suggest improvements.

---

## Commit 28: `e01384c` — feat: add Agentic AI concept image to Analyse section

Add an Agentic AI concept image to the Analyse section for visual learning.

---

## Commit 29: `ac98889` — refactor: restructure study notes into exam/ and memory/ subfolders

Restructure the study notes into separate exam/ and memory/ subfolders for better organization.

---

## Commit 30: `294b32e` — feat: add Agentic Loop concept with optimization image to Analyse section

Add an Agentic Loop concept page with an optimization image to the Analyse section.

---

## Commit 31: `9a63a83` — feat: add Claude Mastery Path page and update memory card links

Create a Claude Mastery Path page showing the learning journey. Update memory card links to point to the new structure.

---

## Commit 32: `8716cf6` — feat: restructure navigation into Bloom's Taxonomy visual hierarchy

Restructure the navigation menu into a visual hierarchy based on Bloom's Taxonomy levels: Remember, Understand, Analyse, Evaluate, Create.

---

## Commit 33: `e41c9f5` — Create readme.md

Create the README.md file for the project.

---

## Commit 34: `067a6a3` — Add files via upload

Upload files to the repository.

---

## Commit 35: `f8ab18b` — feat: link memory cards to referable concept pages

Link each memory card to a referable concept page so users can dive deeper into topics.

---

## Commit 36-42: `4b64b9f` through `2c604e8` — Add files via upload

Upload various files including memory card images, concept diagrams, and visual aids.

---

## Commit 43: `1728c04` — Integrate memory card images and update image fallback path

Integrate memory card images into the app. Update the image fallback path to use the correct pattern. Add concepts tagging to memory cards for category filtering.

---

## Commit 44: `20409e0` — Merge branch 'main'

Merge remote changes.

---

## Commit 45: `3f2b35f` — Fix MEM-Q014 filename to use hyphen for memory card integration

Fix the MEM-Q014 filename to use a hyphen instead of underscore for consistency with memory card integration.

---

## Commit 46: `0d17f2c` — Add files via upload

Upload files to the repository.

---

## Commit 47: `c4fa6d4` — feat: link memory card images to GitHub and display them in slideshow

Link memory card images to their GitHub URLs and display them in the slideshow mode.

---

## Commit 48: `7ca1632` — feat: generate 85 SVG visual aids for memory cards 16-100 and update UI to support SVGs

Generate 85 SVG visual aids for memory cards 16 through 100. Update the UI to properly support and display SVG files.

---

## Commit 49: `3735699` — Reorganize project into logical directories

Reorganize the project into logical directories:
- Move visual media from imaginary/ to assets/{exam,memory}/
- Move raw data to data/ (exam.json, exam_source.pdf)
- Move auxiliary pages to pages/ (dictionary, markdown_renderer)
- Move AI guidelines to .kilo/agent/ (claude.md, gemini.md, opencode.md)
- Update all references in index.html, pages, scripts, sitemap

---

## Commit 50: `02c2b52` — Add memory palace mindmap to Analyse tier, fix SVG display, add open-in-new-tab

Create a memory palace mindmap page using Mermaid flowchart showing all 100 memory cards. Fix SVG display issues (cover to contain, increase modal max-height). Add open-in-new-tab link on memory card modal images.

---

## Commit 51: `8126eef` — Append 'claude llm' to Google image search for more relevant results

Append 'claude llm' to the Google image search query to get more relevant results for Claude-related topics.

---

## Commit 52: `217b381` — Add LLM evolution concept with visual timeline

Add an LLM evolution concept page with a visual timeline showing the progression of language models.

---

## Commit 53: `4be7ba4` — Add MCP before/after concept with visual comparison

Add an MCP before/after concept page with a visual comparison showing the benefits of MCP standardization.

---

## Commit 54: `788cffc` — Add Skills Location concept and dictionary entry

Add a Skills Location concept page explaining where skills are stored. Add a dictionary entry for the term. Update the dictionary renderer to show image badges.

---

## Commit 55: `38cd47c` — Auto-advance to next card after marking mastered in modal

Auto-advance to the next card after marking a card as mastered in the modal. Close the popup immediately and open the next card (wrap from Q100 to Q1).

---

## Commit 56: `ab260e1` — Hide mastered cards across all modes until progress reset

Hide mastered cards across all modes (Memory Cards grid, Slideshow, Quiz) until the user resets progress. Show a fallback banner if everything is mastered.

---

## Commit 57: `d9fcf5c` — Fix syntax error: remove stray brace and duplicate nextRemember function

Fix a syntax error by removing a stray brace and duplicate nextRemember function.

---

## Commit 58: `8723b39` — Add Exam Tactics page with multi-sensory study strategy and memory palace guide

Create an Exam Tactics page with:
- Readiness checklist and score thresholds
- Multi-sensory training guide (visual, auditory, kinesthetic, social, motion, spatial)
- Memory palace method with instructions
- Live AI session prompts for Gemini/Claude
- Exam day protocol and pre-exam checklist

---

## Commit 59: `9a3ab1f` — Move AGI Path to standalone page with personalized RAG and knowledge graphs

Move the AGI Path content to a standalone page with:
- 5-phase AGI evolution
- Personalized RAG engine section
- Personal knowledge graph with dynamic profile
- Multi-source retrieval architecture diagram
- Adaptive study plan based on mastery count
- Ready-to-use prompts for AI tutors

---

## Commit 60: `41a01cd` — Add LLM Context Size concept and implement concept mastery tracking with cookies

Add an LLM Context Size concept page. Implement concept mastery tracking using cookies so users can track which concepts they've mastered.

---

## Commit 61: `0eadfa2` — Add MCP Python Server & Client implementation guide to resources

Add an MCP Python Server & Client implementation guide to the resources page with code examples.

---

## Commit 62: `c1fc3cc` — Add Claude Pricing Evolution guide to resources

Add a Claude Pricing Evolution guide to the resources page showing how Claude pricing has changed over time.

---

## Commit 63: `7d042d1` — Add mimo.md agent, shared nav.js, favorites system, memory card progress bar, reward animation, skills & criteria pages, SEO meta tags, and update sitemap

A large commit adding multiple features:
- Create .kilo/agent/mimo.md with project guidelines for Mimo model
- Add pages/nav.js shared navigation menu
- Add favorites feature with star button and cookie persistence
- Add progress bar showing mastered/remaining count
- Add confetti reward animation when marking mastered
- Create pages/skills.html and pages/explicit_criteria.html
- Add SEO meta tags and update sitemap

---

## Commit 64: `cf1a819` — Add structured reasoning resource page with CoT examples and categorization patterns

Create a structured reasoning resource page with:
- 5 chain-of-thought techniques
- Before/after examples
- XML tag pattern
- Categorization-first pattern
- Numbered step chains
- Exam traps

---

## Commit 65: `7685b11` — Add multi-turn prompting & context compression pages, quiz mastered button, auto-skip mastered popups, SEO meta tags on all pages

Create two new pages:
- Multi-turn prompting with 5 patterns (refine/branch/build/correct/deepen)
- Context compression with window anatomy, compression techniques, token math

Add mastered button to quiz mode. Auto-skip mastered cards. Add SEO meta tags to all pages.

---

## Commit 66: `7694ef8` — Add mastered and favorite buttons to slideshow mode

Add mastered and favorite buttons to the slideshow mode. Both buttons update state and persist via cookies.

---

## Commit 67: `146ceed` — Improve markdown_renderer.html with navigation sidebar and local file loading

Improve the markdown renderer with:
- Sidebar with categories (Memory Cards, Concepts, Exam Questions, Agent Files)
- Local file loading from formula/ and docs/ folders
- Keep users on the site instead of linking to external GitHub pages

---

## Commit 68: `f791d6b` — Update claude_pricing.html with all Claude models up to 4.7 Adaptive

Update the pricing page with:
- All Claude models from 1.0 through 4.7 Adaptive
- Sorting functionality by Release Date, Context, Input/Output Price, Tier
- Model comparison cards (Flagship, Balanced, Fast)
- Full model timeline

---

## Commit 69: `61b6df7` — Add favorite button to mock exam view

Add a favorite button to mock exam questions. Uses exam question ID as the identifier. Persists favorites in cookies.

---

## Commit 70: `a60943a` — Add visual rationale and progress tracking to mock exam

Add to the mock exam:
- Mermaid diagram showing reasoning flow for each question
- Progress bar showing answered/unanswered questions
- Percentage complete tracking
- Visual warning for remaining questions
- Success message when all questions answered

---

## Commit 71: `3002691` — Fix visual rationale display and add emojis to answers

Fix the visual rationale display by replacing Mermaid with SVG. Add emoji indicators to all answer options in mock exam. Add link to full explanation page.

---

## Commit 72: `bc4fffd` — Fix answer substring to properly strip 'A) ' prefix

Fix the answer substring logic to properly strip the 'A) ' prefix (3 chars instead of 2).

---

## Commit 73: `2832f51` — Fix markdown_renderer.html file paths

Fix all file paths in markdown_renderer.html to use correct relative paths from the pages/ directory.

---

## Commit 74: `a71a1d3` — Add GitHub Actions badge to footer

Add a GitHub Actions badge linking to the Actions page in the footer.

---

## Commit 75: `d57fddf` — Add emojis and rationale image to multiplayer mode

Add emoji indicators to multiplayer answer choices. Add SVG rationale diagram in the reveal phase.

---

## Commit 76: `411b20c` — Refactor: Modularize app into separate pages with shared components

Major architectural refactoring:
- Extract CSS into css/styles.css
- Extract data into js/data.js
- Extract state management into js/state.js
- Extract utilities into js/utils.js
- Create dedicated pages for each study mode
- Create lightweight index.html as dashboard

---

## Commit 77: `ce4f06f` — Add shared top navigation menu to all pages

Replace redundant per-page links and back buttons with a unified dropdown navigation bar (js/nav.js) organized by Bloom's taxonomy levels.

---

## Commit 78: `1ee6080` — Reorder menu: Remember, Understand, Analyse, Evaluate, Create

Reorder navigation menu items to match Bloom's taxonomy progression. Add search bar to top right of navigation. Fix memory card links.

---

## Commit 79: `b1083e1` — Reorganize menu: move Mastery to Remember, consolidate Analyse

Move Mastery page under Remember section. Move Resources, Dictionary, MCP Python, Pricing, Criteria, Reasoning, Multi-Turn, Evaluate, Skills under Analyse section. Simplify Understand and Create sections.

---

## Commit 80: `280d709` — Move Multiplayer, Criteria, Reasoning, Multi-Turn, Evaluate to Evaluate menu

Move Multiplayer, Criteria, Reasoning, Multi-Turn, and Evaluate pages to the Evaluate menu section.

---

## Commit 81: `9744ed0` — Add card modal view with mastered/favorite actions, remove old nav div

Create a card modal popup that shows full question, answer, hint, and memory aid. Add mastered and favorite toggle buttons. Make it mobile friendly. Remove redundant nav.js from markdown_renderer.html.

---

## Commit 82: `10945c9` — Reorganize menu: Evaluate has only Pricing/Multiplayer, add image/video links

Reorganize menu so Evaluate has only Pricing and Multiplayer. Add memory card image display in card modal. Add Google Image Search and YouTube Video links. Add link to notes for each card.

---

## Commit 83: `d56ae07` — Add visual rationale, mastered/favorite, and reset to quiz mode

Add memory card image display after answering questions. Add Google Image Search and YouTube video links. Add notes link to markdown renderer. Add mastered/favorite buttons and reset functionality to quiz mode.

---

## Commit 84: `605c20a` — Remove shared-nav from all pages, add image/video search to memory cards

Remove the shared-nav div from all pages by emptying pages/nav.js. Add Google Image Search and YouTube links to each memory card in memory_cards.html.

---

## Commit 85: `efa4da7` — Fix broken links: update .kilo/agent references to project root

Check the last commit and reflect to the structure and fix links. The .kilo/agent/ directory no longer exists - files were moved to project root. Update all references in markdown_renderer.html, skills.html, CLAUDE.md, GEMINI.md, AGENTS.md, README.md to point to the correct locations.

---

## Commit 86: (pending) — Fix mastered button auto-advance in cards.html

When clicking "Mark Mastered" in the card modal, it should automatically advance to the next unmastered question instead of reopening the same card. Add a getNextUnmasteredId function that finds the next unmastered card in sequence.

---

## Commit 87: (pending) — Show remaining count and card images in cards.html

Show the remaining question count in the card modal when playing memory cards. Add thumbnail images from assets/memory to the card grid view. Display images on the front of each card with proper styling.

---

## Commit 88: (pending) — Add Claude CLI enterprise architecture analysis page

Create a new page analyzing Claude CLI's open architecture strategy. Include content about enterprise compliance, developer real estate war, infrastructure offloading, and MCP open standard strategy. Add comparison table for Direct API vs Hyperscaler Backends. Include the concept image from assets/concepts/claude_cli_opensource.png.

---

## Commit 89: (pending) — Add shuffle button to cards.html

Add a shuffle button to the memory cards page that randomly shuffles the order of questions. Use Fisher-Yates shuffle algorithm for proper randomization.

---

## Commit 90: (pending) — Add can remember checkbox to dictionary.html

Add a "I can remember this" checkbox to each dictionary term. Save the state in a cookie so users can track which terms they've memorized. Add a reset button to clear all remembered terms.

---

## Commit 91: (pending) — Save exam state in cookie

Save exam progress in a cookie so users can resume where they left off. Store exam data, current index, and answers. Add shuffle button to restart with new questions.

---

## Commit 92: (pending) — Add shuffle button to exam.html

Add a shuffle button to the exam page that randomizes questions and restarts the exam with new questions from the question bank.

---

## Commit 93: (pending) — Show rationale and memory cards in exam

Show rationale with mermaid diagram explaining the answer logic. Add related memory card links for each question. Add colored borders for A/B/C/D options.

---

## Commit 94: (pending) — Update footer on all pages

Update all pages to have consistent footer with "Created by Rifat Erdem Sahin" and navigation links including Home, Cards, Quiz, Exam, Mastery, and GitHub.

---

## Commit 95: (pending) — Rename analyse page to Stats

Rename the analyse page title and navigation link from "Analyse" to "Stats" for clearer naming.

---

## Commit 96: (pending) — Add prompt caching content

Create a new page explaining prompt caching concepts, efficiency impact, and best practices. Include comparison table showing impact with and without caching.

---

## Commit 97: (pending) — Move AGI Path to Analyse menu and add YouTube videos

Move the AGI Path page from Create menu to Analyse menu. Add converge/diverge emojis to menu labels (Remember ◀️, Analyse ▶️, Create ◀️). Add YouTube channel videos to Create menu with external link support.

---

## Commit 98: (pending) — Reorder Remember menu and fix exam rationale

Reorder Remember menu items: Play Cards, Slideshow, Mastery, Quiz Mode, Memory Cards. Update mermaid diagram in exam to show concepts leading to the answer instead of just the question. Fix memory card links to use correct format MEM-Q{id}.

---

## Commit 99: (pending) — Move tactics content to home page

Move the exam tactics and study strategy content from tactics.html to the home page (index.html). Include readiness checklist, score thresholds, multi-sensory training grid, memory palace method, live AI study sessions with copyable prompts, exam day protocol, and tidy-up checklist. Add external training links for Claude, Anthropic certification exam, Skilljar, and Anthropic documentation.

---

## Commit 100: (pending) — Make exam buttons more graphical

Update exam Previous/Next buttons to be more graphical and useful. Add emojis (⬅️/➡️/🏁), show question numbers as hints, add centered progress indicator (current/total), enhance hover effects with elevation and color, add colored left/right borders, and style the results page buttons consistently.

---

## Commit 101: (pending) — Update Create menu with all YouTube videos

Replace the 4 video links in the Create menu with all 24 videos from Erdem's YouTube channel, using the actual video IDs fetched via oEmbed API.

---

## Commit 102: (pending) — Add correct answer animation and Enter key navigation

Add CSS animations for correct answers (green pulse) and incorrect answers (red shake). Add Enter keyboard shortcut to move to next question after answering. Show keyboard hint below explanation.

---

## Commit 103: (pending) — Fix mermaid diagram and add colors

Fix broken mermaid diagrams by sanitizing answer text (removing special characters). Add colorful styling with blue concept nodes and green answer node. Improve mermaid initialization with better error handling and theme variables.

---

## Commit 104: (pending) — Refactor project structure to follow Delivery Pilot Template

Reorganize project folders into the 7-stage Delivery Pilot Template structure. Created stages 1-7, renamed agent files to lowercase in git, migrated formula notes to 4_Formula with a symlink fallback, implemented the two-menu navigation system (top Project navigation and bottom-right floating toggle debug drawer) with persistence, and updated markdown_renderer.html to browse framework stages and agents.

---

## Commit 105: (pending) — Perform sanity check and execute suggestions

Created sanity_check_review_v1.md in 6_Semblance folder. Wrote and ran Python automation scripts to recursively sanitize and update 54 files under 4_Formula/ changing github edit/blob links to the correct 4_Formula path, and updated agent rule files (agents.md, claude.md, gemini.md, mimo.md) to reference agent names in lowercase.

---

## Commit 106: (pending) — Find and remove duplicates, and create antigravity.md guidelines

Created antigravity.md guidelines in the root folder. Identified and removed the duplicate navigation script pages/nav.js and stripped all redundant <script src="nav.js"></script> script tags across 13 HTML files in 5_Symbols/pages/ to prevent browser console 404 load errors. Updated the debug menu in nav.js and sidebar notes list in markdown_renderer.html to integrate antigravity.md. Updated logic tests to assert the correct 15 debug menu items.

---

## Commit 107: (pending) — Update hint images for questions 1 to 6 to PNG format

Download the six new hint images from Azure Blob Storage (`exam-images` container), rename them to `q001.png` through `q006.png` locally in `5_Symbols/assets/exam-images/` and re-upload them to Azure. Delete the old placeholder SVGs (`q001.svg` to `q006.svg`) and the temporary JPEG blobs from Azure. Update `manifest.json` and `pro-exam.html` to support the new PNG format for the first six questions. Log errors/workarounds in `6_Semblance/error_log.md` and add automated tests to `7_Testing_Known/test_pro_exam_images.js` to verify.

---

## Commit 108: (pending) — Update hint images for questions 7 to 17 to PNG format

Download the eleven new hint images (questions 7 to 17) from Azure Blob Storage (`exam-images` container), rename them to `q007.png` through `q017.png` locally in `5_Symbols/assets/exam-images/` and re-upload them to Azure. Delete the old placeholder SVGs (`q007.svg` to `q017.svg`) and the temporary JPEG blobs from Azure. Update `manifest.json`, `pro-exam.html`, and `test_pro_exam_images.js` to support the new PNG format for questions 7 to 17.



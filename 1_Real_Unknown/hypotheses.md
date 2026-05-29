# 🧪 Hypotheses to Validate

This document lists the assumptions we are testing through this project and how they are validated in Stage 7 (`7_Testing_Known`).

---

## 🧠 Pedagogical Hypotheses

### Hypothesis 1: Mnemonic-Assisted Active Recall
* **Assumption:** Associating abstract, technical topics (e.g., `CLAUDE.md` hierarchy, MCP server capabilities) with concrete visual emojis and physical locations (Memory Palace) increases retention by 30% compared to typical slide/text study.
* **Validation Method:** Track initial score profiles versus final score profiles in `7_Testing_Known/` checklists. Measure the speed of question resolution when visual aids are active.

---

## 🛠️ Technical Hypotheses

### Hypothesis 2: Lightweight JSDOM Testing
* **Assumption:** We can validate complex front-end interactions (navigation injection, search, cookie persistence) reliably in a headless JSDOM environment in Node.js, completely avoiding the need for heavy automation frameworks like Playwright or Puppeteer.
* **Validation Method:** Proven in [test_logic.js](file:///Users/rifaterdemsahin/projects/claude_certification_exam/7_Testing_Known/test_logic.js), which successfully simulates toggle actions, document selectors, and cookie reads in under 100ms.

### Hypothesis 3: Single-File Performance
* **Assumption:** Delivering the app as a single static HTML page under 500KB via CDN will yield sub-second load times on mobile connections while maintaining zero hosting cost or server maintenance.
* **Validation Method:** Verify page weight and load speed via Lighthouse audits on the live GitHub Pages deployment.

### Hypothesis 4: Cookie State Stability
* **Assumption:** Storing progress in a single browser cookie with a 30-day expiry is sufficient to prevent progress loss for 95% of users during their study prep window, without necessitating database setups or logins.
* **Validation Method:** Conduct user testing cycles to monitor cookie clearance rates on modern browsers.

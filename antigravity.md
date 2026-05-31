# 🛸 Antigravity — Delivery Pilot Template

## Persona & Role

You are Antigravity, a powerful agentic AI coding assistant operating within the **Project Self-Learning System** framework. Your mission is to transform unknowns into proven, tested solutions through a structured 7-stage journey.

---

## 🗺 Project Self-Learning System — 7-Stage Journey

### Stage Overview: Unknown → Proven

| Stage | Folder | Purpose |
|-------|--------|---------|
| 1 | `1_Real_Unknown` | **The "Why"** — Problem definitions, OKRs, core questions |
| 2 | `2_Environment` | **The "Context"** — Roadmaps, constraints, setup guides |
| 3 | `3_Simulation` | **The "Vision"** — UI mockups, image carousel |
| 4 | `4_Formula` | **The "Recipe"** — Step-by-step guides, research, logic |
| 5 | `5_Symbols` | **The "Reality"** — Core source code, implementation |
| 6 | `6_Semblance` | **The "Scars"** — Error logs, workarounds, gap analysis |
| 7 | `7_Testing_Known` | **The "Proof"** — Validation, checklists, outcome confirmation |

---

## 📂 Folder Structure Logic

```
delivery-pilot-template/
├── 1_Real_Unknown/       # Problem definitions, OKRs, core questions
├── 2_Environment/        # Roadmaps, constraints, setup guides (Win/Mac/AI)
├── 3_Simulation/         # UI mockups, dynamic image carousel
├── 4_Formula/            # Step-by-step guides, research notes, build logic
├── 5_Symbols/            # Source code (assets, azure-api, css, data, docs, exercises, js, pages, scripts)
├── 6_Semblance/          # Error logs, near-misses, workarounds
├── 7_Testing_Known/      # Validation, testing checklists, outcomes (tests, package.json)
├── index.html            # Main entry point with unified navigation
├── markdown_renderer.html
├── robots.txt
├── sitemap.xml
├── .gitignore
├── agents.md             # Agent rules & persona instructions
├── prompts.md            # Prompt log & PM framework
├── claude.md
├── kilocode.md
├── copilot.md
├── gemini.md
└── antigravity.md        # This file
```

---

## 🛸 Antigravity-Specific Instructions

### Behavior Guidelines
- Always follow the 7-stage structure when creating or organizing content.
- **Deduplication:** Find and remove duplicate files or redundant resources. Ensure obsolete elements (like local navigation placeholders or duplicate script tags) are deleted or cleaned up.
- **Structure Format:** Maintain the format defined in the template repository [delivery-pilot-template](https://github.com/rifaterdemsahin/delivery-pilot-template).
- **After every command, commit and push** — do not batch changes; each step gets its own commit.
- Use emojis (✨, 🛠, 🧪, 🐛) for readability.
- **Record every prompt** in `prompts.md` — log date, agent, and purpose for each prompt given.
- Keep `index.html` at the repo root — GitHub Pages requires it at the root.
- Implement unified navigation: Project Menu (Bloom's taxonomy aid) + Debug Menu (sliding side drawer toggled via bottom-right button).

---

## 🔁 Maintenance Checklist

Run these checks at each delivery cycle to keep the 7-stage system healthy:

- [ ] Update the environment folder — `1_Real_Unknown` (problem statements, OKRs, open questions, hypotheses)
- [ ] Update the environment folder — `2_Environment` (setup guides, azure, cloudflare, navigation docs)
- [ ] Add new features incoming as visuals — `3_Simulation` (UI mockups, design vision, UX documentation)
- [ ] Add new ways of doing the implementation — `4_Formula` (concepts, exam questions, checklists, research notes)
- [ ] Update the Symbols and pay technical debt — `5_Symbols` (source code, assets, scripts, data, pages)
- [ ] Add new errors in Semblance — `6_Semblance` (error logs, workarounds, gap analysis)
- [ ] Update the tests folder — `7_Testing_Known` (validation checklists, test scripts, outcome confirmation)

# 3️⃣ Simulation — The "Vision"

> **Stage 3 of 7:** Make the invisible visible before writing production code.

- We reserve engineer the symbols if we need to see where we need to go.

## Purpose

This folder holds **visual representations** of what the project will look like and how it will behave. Mockups, wireframes, and screenshots live here. The image carousel on `index.html` auto-loads from this folder.

## What belongs here

- **UI mockups** — Wireframes and design prototypes
- **Screenshots** — Captures of the working system at key milestones
- **Flow diagrams** — User journeys and interaction flows
- **Demo assets** — Any static assets used in presentations

## Files

| File | Description |
|------|-------------|
| `mockup_index.png` | Homepage mockup |
| `mockup_navigation.png` | Navigation menu mockup |
| `flow_user_journey.md` | User journey flow diagram |
| `carousel_config.json` | Image list for the auto-updating carousel |
| `user_experience.md` | User experience guides and mockups explaining the system |
| `study_dashboard.png` | Study dashboard mockup image (active recall grid) |
| `memory_palace_mindmap.png` | Memory palace mindmap mockup image |
| `flashcard_recall_view.png` | Flashcard recall view mockup image |

## Image Carousel

The carousel on `index.html` automatically includes any image added to this folder. Supported formats: `.png`, `.jpg`, `.gif`, `.webp`.

To add a new slide:
1. Drop the image into `3_Simulation/`
2. Commit and push — the carousel updates automatically ✨

## Rules

- Name images descriptively: `feature_name_state.png`
- Add a caption comment above each image reference in `carousel_config.json`
- Move superseded designs to `_obsolete/` 🚮

## 🧪 Testing Checklist

<!-- Embed a relevant YouTube video explaining UI prototyping / wireframing -->

- [ ] At least one mockup exists for the homepage
- [ ] Carousel loads and cycles through all images in this folder
- [ ] Images are mobile-readable (min 375px wide)
- [ ] Flow diagrams cover the main user journey

# Mnemonic Generation Formula

## Description
A programmatic formula for generating visual memory palace infographics to help candidates memorize and understand advanced Claude Developer Certification concepts.

## Architecture & Layout Recipe
To maximize retrieval, each infographic is structured as a split-screen 1200x800 card following the teal-amber-white palette on a dark theme (`#0f172a`):

1. **Left Section (The Mnemonic Palace):**
   * **Space & Architecture:** Selects an architectural space matching the competency category:
     * *Library Atrium* (scholarly) for Multi-Agent Research
     * *Postal Sorting Hall* (bureaucracy) for Tool Design & MCP
     * *Forge* (industrial) for Claude Code Workflows
     * *Courtroom* (legal) for Prompt Engineering
     * *Excavation Site* (archaeological) for Context & Reliability
   * **Mechanism (Correct Path - Teal `#10b981`):** A primary center node describing the correct solution to the scenario.
   * **Contrast Ghost (Wrong Path - Red `#ef4444`):** A secondary node illustrating the common failure mode or incorrect option.
   * **Physical Metaphor (Amber `#f59e0b`):** A tactile physical symbol (Key, Scale, Stamp, Shield, Compass) mapped to the solution's core constraint.

2. **Right Section (The Technical Data):**
   * **Digest:** Short summary of the exam scenario.
   * **Principle:** A single core guideline carved as a mnemonic rule.
   * **Rationale:** Full technical explanation highlighting tradeoffs.
   * **Balance Badge (Purple `#a855f7`):** The primary floating tradeoff axis (e.g., latency vs. accuracy).

## Implementation in Python
The programmatic generation is implemented in [generate_memory_palace_cards.py](file:///Users/rifaterdemsahin/projects/claude_certification_exam/5_Symbols/scripts/generate_memory_palace_cards.py) using the **Pillow** image drawing library. The script maps questions dynamically based on NLP keyword scans:
* Detects scenario keywords (e.g. "allowed-tools" maps to a "Security Shield" metaphor).
* Extracts correct vs. wrong option paths from the source `pro-exam.json` database.
* Draws custom rounded rectangles, connection pathways, and text blocks.

## Related Memory Cards
All practice questions from `CAT01-Q018` to `CAT05-Q058` use this mnemonic layout.

## Edit Link
[Edit this page](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/4_Formula/concepts/mnemonic-generation-formula.md)

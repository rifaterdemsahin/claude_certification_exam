# Mnemonic Generation Formula

## Description
A visual generation formula using DALL-E (`generate_image`) to create surreal, abstract visual memory palace diagrams to help candidates memorize and understand advanced Claude Developer Certification concepts.

## visual Mnemonic Prompt Recipe
To maximize retention, each mnemonic image is generated using a structured visual recipe based on a De Chirico surreal memory palace style:

1. **Artistic Style:**
   * **Style:** A surreal memory palace space, De Chirico stone architecture, dramatic chiaroscuro lighting, teal-amber-white palette, painterly cinematic render.
   * **Typographic Overlays:** Bold sans-serif typographic overlays carved into stone architecture and physical objects throughout the scene.

2. **Core Components (Center & Foreground):**
   * **The Mechanism:** A central green-teal robed figure representing the competency (e.g., 'Code Generation with Claude Code') holding a glowing object representing the correct solution.
   * **The Contrast Ghost (Wrong Path):** A ghostly shadow figure to the left, frozen mid-mistake, representing the failure mode, with cascading red light and debris/broken chains. Includes a caption "Incorrect Action" above the ghost.
   * **The Physical Metaphor:** A massive glowing physical object (such as a *Golden Compass*, *Balancing Scale*, *Security Shield*, *Key*, or *Engraved Stamp*) with a teal/amber glow, corresponding to the scenario constraint.

3. **Background & Atmosphere:**
   * **Palace Corridors:** Sealed dark corridors representing wrong paths, contrasted with one lit teal corridor representing the correct architectural decision.
   * **Trade-Off overlay:** A floating typographic badge (e.g. `'cost vs. context'`, `'latency vs. accuracy'`) floating above the scene.

## Workflow Process
1. **Prompts Database compilation:** Scenario details, correct/incorrect choices, and tradeoff axes are extracted and compiled into `mnemonic_prompts.json`.
2. **Sequential Generation:** Invoke `generate_image` using the prompt. To avoid concurrent RPM limits, a 15-second delay is introduced between generations.
3. **Local Sync & Cloud Storage:** The generated PNGs are copied to local assets (`5_Symbols/assets/exam-images/qXXX.png`) and uploaded to the Azure Blob Container (`exam-images`) using credentials.

## Related Files
* Visual Prompts: [mnemonic_prompts.json](file:///Users/rifaterdemsahin/projects/claude_certification_exam/5_Symbols/scripts/mnemonic_prompts.json)
* Validation Test: [test_pro_exam_images.js](file:///Users/rifaterdemsahin/projects/claude_certification_exam/7_Testing_Known/test_pro_exam_images.js)

## Edit Link
[Edit this page](https://github.com/rifaterdemsahin/claude_certification_exam/edit/main/4_Formula/concepts/mnemonic-generation-formula.md)


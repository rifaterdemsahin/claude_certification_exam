#!/usr/bin/env python3
import json
from pathlib import Path

def select_metaphors_and_spaces(scenario, question_text, answer_text, rationale_text):
    # Spaces mapping
    space = "estate mansion"
    drama = "estate architecture"
    
    sc_lower = scenario.lower()
    if "agent" in sc_lower or "research" in sc_lower:
        space = "library atrium"
        drama = "scholarly research"
    elif "tool" in sc_lower or "mcp" in sc_lower:
        space = "postal sorting hall"
        drama = "postal bureaucracy"
    elif "code" in sc_lower or "workflows" in sc_lower:
        space = "forge"
        drama = "industrial forge"
    elif "prompt" in sc_lower or "structured" in sc_lower:
        space = "courtroom"
        drama = "legal drama"
    elif "context" in sc_lower or "reliability" in sc_lower:
        space = "excavation site"
        drama = "archaeological expedition"

    # Physical Metaphor object mapping
    metaphor_obj = "Key"
    q_lower = question_text.lower() + answer_text.lower()
    if "allowed-tools" in q_lower or "tool" in q_lower:
        metaphor_obj = "Security Shield"
    elif "context" in q_lower or "fork" in q_lower or "cache" in q_lower:
        metaphor_obj = "Golden Compass"
    elif "prompt" in q_lower or "xml" in q_lower or "template" in q_lower:
        metaphor_obj = "Engraved Stamp"
    elif "eval" in q_lower or "test" in q_lower or "assert" in q_lower:
        metaphor_obj = "Balancing Scale"
    elif "system prompt" in q_lower or "rules" in q_lower:
        metaphor_obj = "Iron Key"

    # Tradeoff mapping
    tradeoff = "cost vs. context"
    r_lower = rationale_text.lower()
    if "latency" in r_lower or "speed" in r_lower:
        tradeoff = "latency vs. accuracy"
    elif "token" in r_lower or "cost" in r_lower:
        tradeoff = "cost vs. density"
    elif "security" in r_lower or "isolation" in r_lower or "permission" in r_lower:
        tradeoff = "security vs. integration"
    elif "xml" in r_lower or "structure" in r_lower:
        tradeoff = "strictness vs. flexibility"

    return space, drama, metaphor_obj, tradeoff

def compile_prompts():
    project_root = Path(__file__).resolve().parent.parent.parent
    json_path = project_root / '5_Symbols' / 'data' / 'pro-exam.json'
    output_json_path = project_root / '5_Symbols' / 'scripts' / 'mnemonic_prompts.json'
    
    with open(json_path, 'r') as f:
        data = json.load(f)
        
    questions = [q for q in data['questions'] if q['question_number'] >= 19]
    compiled = {}
    
    for q in questions:
        q_num = q['question_number']
        scenario = q['scenario']
        question_text = q['question']
        options = q['options']
        answer = q['answer']
        rationale = q['answer_rationale']
        
        answer_text = f"{answer}) {options[answer]}"
        
        # Select wrong option for contrast ghost
        wrong_keys = [k for k in options.keys() if k != answer]
        wrong_text = f"{wrong_keys[0]}) {options[wrong_keys[0]]}" if wrong_keys else "Incorrect path"
        
        space, drama, metaphor_obj, tradeoff = select_metaphors_and_spaces(scenario, question_text, answer_text, rationale)
        principle = rationale.split('.')[0] + '.'
        
        # Build detailed visual prompt
        prompt = (
            f"A surreal memory palace {space}, De Chirico stone architecture, dramatic chiaroscuro lighting, teal-amber-white palette, painterly cinematic render. "
            f"Center foreground — the Mechanism: A robed figure in green-teal robes representing '{scenario}' holding a glowing object representing the correct solution '{answer_text}'. "
            f"Contrast ghost — the Wrong Path: A ghostly shadow figure to the left, frozen mid-mistake, doing '{wrong_text}', cascading red light, debris or broken chains around them. "
            f"Caption above the ghost: 'Incorrect Action'. "
            f"The Physical Metaphor: A massive glowing {metaphor_obj} representing '{metaphor_obj}' with a teal glow. "
            f"Typographic overlays: "
            f"Carved into the stone floor: '{principle}' "
            f"On the figure's plinth: '{scenario}' "
            f"On the contrast ghost: 'Failure Mode' "
            f"On the physical metaphor object: '{metaphor_obj}' "
            f"Floating above the scene: '{tradeoff}'. "
            f"Background — the Memory Palace: Sealed dark corridors representing wrong paths. One lit teal corridor representing the correct architectural decision. "
            f"Bold sans-serif typographic overlays carved into stone architecture and physical objects throughout. De Chirico surrealism meets {drama}. Teal-amber-white light sources. Cinematic depth. Painterly render."
        )
        
        compiled[str(q_num)] = {
            "question_number": q_num,
            "prompt": prompt
        }
        
    with open(output_json_path, 'w') as f:
        json.dump(compiled, f, indent=2)
    print(f"✓ Compiled {len(compiled)} prompts to {output_json_path}")

if __name__ == '__main__':
    compile_prompts()

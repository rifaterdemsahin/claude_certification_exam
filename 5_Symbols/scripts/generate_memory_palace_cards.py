#!/usr/bin/env python3
import json
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

def wrap_text(text, font, max_width, draw):
    if not text:
        return ""
    words = text.split(' ')
    lines = []
    current_line = []
    for word in words:
        current_line.append(word)
        line_str = ' '.join(current_line)
        bbox = draw.textbbox((0, 0), line_str, font=font)
        w = bbox[2] - bbox[0]
        if w > max_width:
            if len(current_line) > 1:
                current_line.pop()
                lines.append(' '.join(current_line))
                current_line = [word]
            else:
                # Word itself is wider than max_width, force it
                lines.append(' '.join(current_line))
                current_line = []
    if current_line:
        lines.append(' '.join(current_line))
    return '\n'.join(lines)

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

def generate_cards():
    project_root = Path(__file__).resolve().parent.parent.parent
    json_path = project_root / '5_Symbols' / 'data' / 'pro-exam.json'
    output_dir = project_root / '5_Symbols' / 'assets' / 'exam-images'
    
    output_dir.mkdir(parents=True, exist_ok=True)
    
    with open(json_path, 'r') as f:
        data = json.load(f)
        
    questions = [q for q in data['questions'] if q['question_number'] >= 18]
    print(f"Generating memory palace cards for {len(questions)} questions...")
    
    font_path = "/System/Library/Fonts/Supplemental/Arial.ttf"
    if not os.path.exists(font_path):
        font_path = None # Fallback to default
        
    # Fonts
    font_title = ImageFont.truetype(font_path, 28) if font_path else ImageFont.load_default()
    font_header = ImageFont.truetype(font_path, 22) if font_path else ImageFont.load_default()
    font_body = ImageFont.truetype(font_path, 16) if font_path else ImageFont.load_default()
    font_body_bold = ImageFont.truetype(font_path, 16) if font_path else ImageFont.load_default()
    font_small = ImageFont.truetype(font_path, 13) if font_path else ImageFont.load_default()
    font_badge = ImageFont.truetype(font_path, 18) if font_path else ImageFont.load_default()

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
        
        # Extract core principle (first sentence of rationale)
        principle = rationale.split('.')[0] + '.'
        
        # Image base
        width, height = 1200, 800
        image = Image.new('RGB', (width, height), color='#0b0f19')
        draw = ImageDraw.Draw(image)
        
        # Draw background grids/borders
        draw.rounded_rectangle([(20, 20), (width-20, height-20)], radius=16, fill='#0f172a', outline='#334155', width=2)
        
        # Split line in center
        draw.line([(600, 40), (600, 760)], fill='#1e293b', width=2)
        
        # Left Side: Mnemonic Palace Diagram
        # Title of Left Section
        draw.text((40, 40), f"MNEMONIC MEMORY PALACE", font=font_header, fill='#38bdf8')
        draw.text((40, 70), f"De Chirico Surrealism meets {drama.upper()}", font=font_small, fill='#94a3b8')
        
        # Outer space box
        draw.rectangle([(40, 110), (560, 750)], outline='#1e293b', width=1)
        draw.text((60, 130), f"ARCHITECTURE: {space.upper()}", font=font_body_bold, fill='#f59e0b')
        
        # Draw central Mechanism box (teal theme)
        # Rect dimensions: width 400x160 centered at x=300, y=280
        mech_box = [(100, 200), (500, 360)]
        draw.rounded_rectangle(mech_box, radius=8, fill='#1e293b', outline='#10b981', width=3)
        draw.rounded_rectangle([(110, 210), (220, 240)], radius=4, fill='#10b981')
        draw.text((120, 215), "CORRECT PATH", font=font_small, fill='#ffffff')
        
        # Wrap and draw correct solution text
        wrapped_sol = wrap_text(answer_text, font_small, 360, draw)
        draw.text((120, 250), wrapped_sol, font=font_small, fill='#e2e8f0')
        draw.text((120, 330), f"Solution Plinth: {scenario}", font=font_small, fill='#10b981')

        # Draw Contrast Ghost box (red/purple theme)
        ghost_box = [(100, 400), (500, 540)]
        draw.rounded_rectangle(ghost_box, radius=8, fill='#1e293b', outline='#ef4444', width=2)
        draw.rounded_rectangle([(110, 410), (240, 440)], radius=4, fill='#ef4444')
        draw.text((120, 415), "CONTRAST GHOST", font=font_small, fill='#ffffff')
        
        # Wrap and draw wrong solution text
        wrapped_wrong = wrap_text(wrong_text, font_small, 360, draw)
        draw.text((120, 450), wrapped_wrong, font=font_small, fill='#94a3b8')
        draw.text((120, 510), "Failure Label: Incorrect execution boundary", font=font_small, fill='#ef4444')

        # Draw Physical Metaphor box (amber theme)
        meta_box = [(100, 580), (500, 710)]
        draw.rounded_rectangle(meta_box, radius=8, fill='#1e293b', outline='#f59e0b', width=2)
        draw.rounded_rectangle([(110, 590), (280, 620)], radius=4, fill='#f59e0b')
        draw.text((120, 595), f"METAPHOR: {metaphor_obj.upper()}", font=font_small, fill='#0f172a')
        
        # Draw descriptive sentence
        meta_desc = f"Carved symbol of security constraint, representing active restriction rules."
        wrapped_meta = wrap_text(meta_desc, font_small, 360, draw)
        draw.text((120, 630), wrapped_meta, font=font_small, fill='#e2e8f0')
        draw.text((120, 680), f"Object Label: {metaphor_obj}", font=font_small, fill='#f59e0b')

        # Draw pathways/corridors
        draw.line([(300, 360), (300, 400)], fill='#ef4444', width=2)
        draw.line([(300, 540), (300, 580)], fill='#f59e0b', width=2)

        # Right Side: Rationale & Answer Details
        draw.text((640, 40), f"QUESTION {q_num} DIAGRAM CARD", font=font_header, fill='#38bdf8')
        draw.text((640, 70), f"SCENARIO: {scenario}", font=font_small, fill='#94a3b8')
        
        # Highlight Box for Scenario/Question Text digest
        draw.rounded_rectangle([(640, 110), (1160, 240)], radius=6, fill='#1e293b', outline='#334155', width=1)
        draw.text((660, 125), "EXAM QUESTION DIGEST:", font=font_small, fill='#38bdf8')
        wrapped_q = wrap_text(question_text, font_small, 480, draw)
        # Limit to fit
        if len(wrapped_q.split('\n')) > 4:
            wrapped_q = '\n'.join(wrapped_q.split('\n')[:4]) + "..."
        draw.text((660, 150), wrapped_q, font=font_small, fill='#e2e8f0')
        
        # Correct Answer Section
        draw.rounded_rectangle([(640, 260), (1160, 320)], radius=6, fill='#1e293b', outline='#10b981', width=1)
        draw.text((660, 278), f"CORRECT OPTION:   {answer}", font=font_header, fill='#10b981')
        
        # Key Principle (Stone Carving Metaphor)
        draw.text((640, 345), "PRINCIPLE CARVED INTO STONE FLOOR:", font=font_small, fill='#f59e0b')
        wrapped_principle = wrap_text(principle, font_body, 500, draw)
        draw.text((640, 375), f'"{wrapped_principle}"', font=font_body, fill='#e2e8f0')
        
        # Rationale Panel
        draw.text((640, 485), "TECHNICAL RATIONALE & ARCHITECTURE:", font=font_small, fill='#a855f7')
        wrapped_rat = wrap_text(rationale, font_small, 500, draw)
        if len(wrapped_rat.split('\n')) > 7:
            wrapped_rat = '\n'.join(wrapped_rat.split('\n')[:7]) + "\n[Refer to pro-exam details for full text]"
        draw.text((640, 515), wrapped_rat, font=font_small, fill='#94a3b8')
        
        # Tradeoff Indicator Panel
        draw.rounded_rectangle([(640, 680), (1160, 740)], radius=6, fill='#1e293b', outline='#a855f7', width=1)
        draw.text((660, 698), f"FLOATING TRADEOFF BALANCE:  {tradeoff.upper()}", font=font_body_bold, fill='#a855f7')
        
        # Save to disk
        filename = f"q{String(q_num).padStart(3, '0')}.png"
        filepath = output_dir / filename
        image.save(filepath)
        print(f"  Saved {filepath.name}")

# JS-like Helper
class String:
    def __init__(self, val):
        self.val = str(val)
    def padStart(self, length, char):
        return self.val.zfill(length)

if __name__ == '__main__':
    generate_cards()

import os

def update_agent_references():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_files = [
        'README.md',
        'agents.md',
        'claude.md',
        'gemini.md',
        'copilot.md',
        'kilocode.md',
        'mimo.md',
        'pages/markdown_renderer.html'
    ]
    
    count = 0
    for filename in target_files:
        file_path = os.path.join(base_dir, filename)
        if not os.path.exists(file_path):
            print(f"File not found: {filename}")
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        
        # Replace uppercase markdown references to lowercase filenames
        # We target exact matches like 'CLAUDE.md', 'GEMINI.md', 'AGENTS.md'
        new_content = new_content.replace('CLAUDE.md', 'claude.md')
        new_content = new_content.replace('GEMINI.md', 'gemini.md')
        new_content = new_content.replace('AGENTS.md', 'agents.md')
        
        # Also clean up old formula/ references in root md files to point to 4_Formula/
        if 'formula/' in new_content and filename.endswith('.md'):
            new_content = new_content.replace('formula/', '4_Formula/')
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {filename}")
            count += 1
            
    print(f"Total files updated: {count}")

if __name__ == '__main__':
    update_agent_references()

import os

def update_markdown_files():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    formula_dir = os.path.join(base_dir, '4_Formula')
    
    count = 0
    for root, dirs, files in os.walk(formula_dir):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                
                # Replace edit links paths
                has_updates = False
                if 'formula/concepts/' in new_content:
                    new_content = new_content.replace('formula/concepts/', '4_Formula/concepts/')
                    has_updates = True
                if 'formula/exam/' in new_content:
                    new_content = new_content.replace('formula/exam/', '4_Formula/exam/')
                    has_updates = True
                
                if has_updates and new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated: {os.path.relpath(file_path, base_dir)}")
                    count += 1
                    
    print(f"Total files updated: {count}")

if __name__ == '__main__':
    update_markdown_files()

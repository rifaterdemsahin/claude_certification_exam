import os
import re

def remove_nav_script_tag():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pages_dir = os.path.join(base_dir, 'pages')
    
    pattern = re.compile(r'<\s*script\s+src=["\']nav\.js["\']\s*>\s*<\s*/\s*script\s*>', re.IGNORECASE)
    
    count = 0
    for root, dirs, files in os.walk(pages_dir):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Search and remove
                if pattern.search(content):
                    new_content = pattern.sub('', content)
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Removed redundant nav script from: {os.path.relpath(file_path, base_dir)}")
                    count += 1
                    
    print(f"Total files cleaned: {count}")

if __name__ == '__main__':
    remove_nav_script_tag()

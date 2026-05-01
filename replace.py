import os
import re

dirs_to_search = ['frontend/src', 'backend/src']
files_to_search = [f for f in os.listdir('.') if f.endswith(('.md', '.sql', '.bat', '.sh', '.properties'))]

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content, count = re.subn(re.compile(r'msme', re.IGNORECASE), 'Organization', content)
        if count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Replaced {count} instances in {filepath}')
    except Exception as e:
        print(f'Error processing {filepath}: {e}')

for f in files_to_search:
    replace_in_file(f)

for d in dirs_to_search:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith(('.js', '.jsx', '.css', '.html', '.java', '.properties', '.xml')):
                replace_in_file(os.path.join(root, file))

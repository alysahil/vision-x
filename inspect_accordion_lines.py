import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'EXPLICIT ACCORDION CARDS STYLES' in line or '.accordion-card' in line:
        print(f"Line {idx+1}: {line.strip()}")
        for k in range(idx, min(len(lines), idx+35)):
            print(f"  {lines[k].strip()}")
        print("-" * 50)

import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
matches = [line.strip() for line in css.splitlines() if 'accordion' in line.lower()]

print("=== ACCORDION RULES IN STYLE.CSS ===")
for m in matches:
    print(m)

print("\n" + "="*50 + "\n")

with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

js_matches = [line.strip() for line in js.splitlines() if 'accordion' in line.lower()]
print("=== ACCORDION LISTENERS IN SCRIPT.JS ===")
for m in js_matches:
    print(m)

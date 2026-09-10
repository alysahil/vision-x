import glob
import re
import os
import zipfile
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("Fixing mobile card and drawer accordions across the website...")

# 1. Update style.css with clean mobile accordion rules
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

new_mobile_accordion_css = '''/* Mobile Service Card Accordion System */
@media (max-width: 768px) {
  .accordion-toggle-icon {
    display: flex !important;
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
    background: rgba(255, 255, 255, 0.06) !important;
    border: 1px solid rgba(201, 162, 39, 0.25) !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 13px !important;
    color: #eccb6c !important;
    transition: transform 0.3s ease, background 0.3s ease !important;
  }

  .accordion-content-body {
    display: none !important;
    margin-top: 14px !important;
    padding-top: 14px !important;
    border-top: 1px solid rgba(201, 162, 39, 0.15) !important;
  }

  .accordion-card.active .accordion-content-body,
  .accordion-card.mobile-expanded .accordion-content-body {
    display: block !important;
    animation: fadeInSlide 0.3s ease-out !important;
  }

  .accordion-card.active .accordion-toggle-icon,
  .accordion-card.mobile-expanded .accordion-toggle-icon {
    transform: rotate(180deg) !important;
    background: rgba(201, 162, 39, 0.25) !important;
    color: #fef08a !important;
    border-color: #eccb6c !important;
  }

  .accordion-card {
    cursor: pointer !important;
    touch-action: manipulation !important;
  }
}'''

# Replace old mobile accordion CSS block
css_pattern = r'/\* Mobile Service Cards: Always Visible & Tap-Ready \*/[\s\S]*?touch-action: manipulation !important;\s*\}\s*\}'
if re.search(css_pattern, css):
    css = re.sub(css_pattern, new_mobile_accordion_css, css)
    print("Replaced mobile accordion CSS in style.css!")
else:
    css = css.replace("/* Mobile Service Cards: Always Visible & Tap-Ready */", new_mobile_accordion_css)
    print("Updated mobile accordion CSS in style.css!")

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)

# 2. Update script.js with unified mobile accordion logic
with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

unified_accordion_js = '''  /* ==========================================================================
     UNIFIED MOBILE CARD ACCORDION & DRAWER ACCORDION ENGINE
     ========================================================================== */
  const initAllAccordions = () => {
    // 1. Mobile Service Card Accordion Toggle
    const cards = document.querySelectorAll('.accordion-card, .spotlight-card');
    
    // Auto-expand 1st card on mobile for visual guide
    if (window.innerWidth <= 768 && cards.length > 0) {
      cards[0].classList.add('active', 'mobile-expanded');
    }

    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        // If user explicitly clicked the subpage link button inside the body, allow navigation
        if (e.target.tagName === 'A' || e.target.closest('a') || e.target.classList.contains('btn') || e.target.closest('.btn')) {
          const btnLink = e.target.tagName === 'A' ? e.target : e.target.closest('a');
          if (btnLink && btnLink.getAttribute('href')) {
            window.location.href = btnLink.getAttribute('href');
          }
          return;
        }

        // On mobile viewports (<= 768px), toggle expand/collapse state
        if (window.innerWidth <= 768) {
          const isCurrentlyActive = card.classList.contains('active') || card.classList.contains('mobile-expanded');

          // Close other cards for clean single-accordion behavior
          cards.forEach(c => {
            if (c !== card) {
              c.classList.remove('active', 'mobile-expanded');
            }
          });

          // Toggle current card
          card.classList.toggle('active', !isCurrentlyActive);
          card.classList.toggle('mobile-expanded', !isCurrentlyActive);
        }
      });
    });

    // 2. 3-Dot Drawer Accordion Toggle
    const navAccordionHeaders = document.querySelectorAll('.nav-accordion-header');
    navAccordionHeaders.forEach(header => {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = header.closest('.nav-accordion-item');
        if (!item) return;
        
        const isOpen = item.classList.contains('open');
        
        document.querySelectorAll('.nav-accordion-item').forEach(i => {
          if (i !== item) i.classList.remove('open');
        });

        item.classList.toggle('open', !isOpen);
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAccordions);
  } else {
    initAllAccordions();
  }'''

# Replace all old accordion handlers in script.js with unified accordion JS
js_pattern = r'/\* --- 14\. Mobile Category Accordion Functionality --- \*/[\s\S]*?/\* --- 18\. Drawer Accordion Navigation Toggle --- \*/[\s\S]*?\}\);\s*\}\);\s*\}\);'
if re.search(js_pattern, js):
    js = re.sub(js_pattern, unified_accordion_js, js)
    print("Replaced old accordion handlers in script.js!")
else:
    # Append at end before closing bracket
    js = js.replace("/* --- 18. Drawer Accordion Navigation Toggle --- */", unified_accordion_js)
    print("Updated accordion JS in script.js!")

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js)

# 3. Update versioning to v=22.0 across all 18 HTML files
for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    html = re.sub(r'style\.css\?v=[\d\.]+', 'style.css?v=22.0', html)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

print("Updated all HTML files to style.css?v=22.0!")

# 4. Rebuild kinetic-growth-site.zip
zip_filename = 'kinetic-growth-site.zip'
files_to_zip = [
    'index.html', 'services.html', 'results.html', 'why-us.html',
    'testimonials.html', 'pricing.html', 'contact.html', 'ai-solutions.html',
    'video-production.html', 'graphic-design.html', 'photo-services.html',
    'digital-marketing.html', 'social-media-management.html',
    'web-app-development.html', 'ui-ux-design.html',
    'software-coding-solutions.html', 'technology-solutions.html',
    'additional-services.html', 'style.css', 'script.js', 'package.json', '.gitignore', 'netlify.toml'
]

with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for file in files_to_zip:
        if os.path.exists(file):
            zipf.write(file, file)
    if os.path.exists('assets'):
        for root, dirs, files in os.walk('assets'):
            for f in files:
                full_path = os.path.join(root, f)
                zipf.write(full_path, full_path)

print(f"Successfully rebuilt deployment package: {os.path.abspath(zip_filename)} (size: {os.path.getsize(zip_filename)} bytes)")

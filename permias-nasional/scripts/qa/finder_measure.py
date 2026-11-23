"""Measure the finder 'Go' button colours + contrast. usage: finder_measure.py <url> [dark]"""
import json, re, sys
from playwright.sync_api import sync_playwright

def lum(rgb):
    def ch(c):
        c = c / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)

def parse(s):
    return [float(x) for x in re.findall(r'[\d.]+', s)][:3]

url = sys.argv[1]
dark = len(sys.argv) > 2
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel='chrome')
    ctx = b.new_context(viewport={'width': 1440, 'height': 900}, color_scheme='dark' if dark else 'light')
    page = ctx.new_page()
    if dark:
        page.add_init_script("localStorage.setItem('permias-theme', JSON.stringify('dark'))")
    page.goto(url, wait_until='load')
    btn = page.get_by_role('button', name=re.compile('Go to map|Ke peta|chapter', re.I)).last
    btn.wait_for()
    btn.scroll_into_view_if_needed()
    page.wait_for_timeout(900)
    data = btn.evaluate("""el => { const c = getComputedStyle(el); return {text: el.textContent.trim(), color: c.color, bg: c.backgroundColor, cls: el.className} }""")
    h2 = page.locator('section:has(#chapter-state) h2').first.evaluate("el => ({text: el.textContent, color: getComputedStyle(el).color})")
    fg, bg = parse(data['color']), parse(data['bg'])
    L1, L2 = sorted([lum(fg), lum(bg)], reverse=True)
    data['contrast'] = round((L1 + 0.05) / (L2 + 0.05), 2)
    data['heading'] = h2
    print(json.dumps(data, indent=2))
    b.close()

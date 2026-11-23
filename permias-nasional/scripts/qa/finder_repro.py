"""Reproduce the home 'Find your nearest chapter' finder behaviour.
usage: finder_repro.py <base_url> <out_prefix>
"""
import json, sys
from playwright.sync_api import sync_playwright

base, out = sys.argv[1], sys.argv[2]
report = {}
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel='chrome')
    for label, vp in (('1440', {'width': 1440, 'height': 900}), ('390', {'width': 390, 'height': 844})):
        ctx = b.new_context(viewport=vp, device_scale_factor=1)
        page = ctx.new_page()
        logs = []
        page.on('console', lambda m: logs.append(f'{m.type}: {m.text}'))
        page.on('pageerror', lambda e: logs.append(f'pageerror: {e}'))
        page.goto(base + ('&' if '?' in base else '?') + 'notrack=1', wait_until='load')
        sel = page.locator('#chapter-state')
        sel.wait_for()
        sel.scroll_into_view_if_needed()
        page.wait_for_timeout(1200)
        box = sel.evaluate("""el => { const cs = getComputedStyle(el); const o = el.options[0]; const oc = getComputedStyle(o);
            return {selectColor: cs.color, selectBg: cs.backgroundColor, firstOptionColor: oc.color, firstOptionBg: oc.backgroundColor,
                    optionCount: el.options.length, options: [...el.options].slice(0,6).map(x => x.textContent)} }""")
        page.screenshot(path=f'{out}-{label}-finder.png')
        # pick the first real state
        val = sel.evaluate('el => el.options[1].value')
        sel.select_option(val)
        page.get_by_role('button', name=__import__('re').compile('Go to map|Ke peta')).click()
        page.wait_for_timeout(1800)
        url = page.url
        info = page.evaluate("""() => {
            const p = document.querySelector('path[id^="state-"].fill-brand-red, path[aria-pressed="true"]');
            const map = document.getElementById('chapters-map');
            const r = map ? map.getBoundingClientRect() : null;
            const dlg = document.querySelector('[role="dialog"]');
            return { highlighted: p ? p.id : null, mapTop: r ? Math.round(r.top) : null, scrollY: Math.round(scrollY),
                     dialogVisible: !!dlg, bodyOverflow: document.body.style.overflow, h1: document.querySelector('h1')?.textContent }
        }""")
        page.screenshot(path=f'{out}-{label}-after-go.png')
        report[label] = {'select': box, 'picked': val, 'url': url, 'after': info, 'console': logs}
        ctx.close()
    b.close()
print(json.dumps(report, indent=2))

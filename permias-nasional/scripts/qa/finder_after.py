"""Finder contrast after the fix: measures the Go to map button and heading on the home directory (light + dark)."""
import json, sys
from playwright.sync_api import sync_playwright
base, out = sys.argv[1], sys.argv[2]
JS = r"""() => {
 const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number); const [r,g,b] = m.slice(0,3).map(v => { v/=255; return v<=0.03928? v/12.92 : ((v+0.055)/1.055)**2.4 }); return 0.2126*r+0.7152*g+0.0722*b };
 const bgOf = (el) => { while (el) { const c = getComputedStyle(el).backgroundColor; if (c && !c.startsWith('rgba(0, 0, 0, 0)') && c !== 'transparent') return c; el = el.parentElement } return 'rgb(255,255,255)' };
 const ratio = (a,b) => { const [x,y] = [lum(a),lum(b)].sort((p,q)=>q-p); return +( (x+0.05)/(y+0.05) ).toFixed(2) };
 const btn = document.querySelector('#cari-chapter form button[type=submit]');
 const h = document.querySelector('#cari-chapter h2');
 const sel = document.querySelector('#chapter-state');
 return { button: { text: btn.innerText.trim(), color: getComputedStyle(btn).color, bg: bgOf(btn), ratio: ratio(getComputedStyle(btn).color, bgOf(btn)) },
          heading: { text: h.innerText.trim(), color: getComputedStyle(h).color, bg: bgOf(h), ratio: ratio(getComputedStyle(h).color, bgOf(h)) },
          select: { color: getComputedStyle(sel).color, bg: bgOf(sel), ratio: ratio(getComputedStyle(sel).color, bgOf(sel)) } };
}"""
res = {}
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel='chrome')
    for theme in ['light', 'dark']:
        ctx = b.new_context(viewport={'width': 1440, 'height': 900})
        ctx.add_init_script(f"localStorage.setItem('permias_cookie_consent','declined'); localStorage.setItem('permias_theme',JSON.stringify('{theme}')); localStorage.setItem('permias_lang',JSON.stringify('en'))")
        pg = ctx.new_page(); pg.goto(base + '/', wait_until='load'); pg.wait_for_timeout(1500)
        pg.locator('#cari-chapter').scroll_into_view_if_needed(); pg.wait_for_timeout(800)
        res[theme] = pg.evaluate(JS)
        pg.locator('#cari-chapter').screenshot(path=out.replace('.json', f'-{theme}.png'))
        ctx.close()
    b.close()
json.dump(res, open(out, 'w'), indent=1); print(json.dumps(res))

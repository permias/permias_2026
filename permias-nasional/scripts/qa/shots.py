"""Screenshot routes at given widths and capture console output.

usage: shots.py <base_url> <out_dir> <widths comma> <route>[=name] ... [--full] [--wait ms] [--lang en|id] [--theme light|dark]
Writes <out_dir>/<name>-<width>[-<lang>][-<theme>].png and appends console lines to <out_dir>/console.jsonl
"""
import argparse, json, os, re
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('base'); ap.add_argument('out'); ap.add_argument('widths')
ap.add_argument('routes', nargs='+')
ap.add_argument('--full', action='store_true')
ap.add_argument('--wait', type=int, default=1600)
ap.add_argument('--lang', default=None)
ap.add_argument('--theme', default=None)
ap.add_argument('--height', type=int, default=None)
ap.add_argument('--reduced', action='store_true')
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)
log = open(os.path.join(a.out, 'console.jsonl'), 'a')

with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel='chrome')
    for w in [int(x) for x in a.widths.split(',')]:
        h = a.height or (844 if w < 600 else 1024 if w < 900 else 900)
        ctx = b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1,
                            reduced_motion='reduce' if a.reduced else 'no-preference',
                            color_scheme='dark' if a.theme == 'dark' else 'light')
        init = []
        if a.lang:
            init.append(f"localStorage.setItem('permias_lang', JSON.stringify('{a.lang}'));")
        if a.theme:
            init.append(f"localStorage.setItem('permias_theme', JSON.stringify('{a.theme}'));")
        init.append("localStorage.setItem('permias_cookie_choice', JSON.stringify('declined'));")
        ctx.add_init_script(''.join(init))
        for r in a.routes:
            route, _, name = r.partition('=')
            name = name or (re.sub(r'[^a-z0-9]+', '-', route.strip('/').lower()) or 'home')
            page = ctx.new_page()
            msgs = []
            page.on('console', lambda m, msgs=msgs: msgs.append({'type': m.type, 'text': m.text}))
            page.on('pageerror', lambda e, msgs=msgs: msgs.append({'type': 'pageerror', 'text': str(e)}))
            page.goto(a.base.rstrip('/') + route, wait_until='load')
            page.wait_for_timeout(a.wait)
            overflow = page.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
            suffix = ''.join(f'-{x}' for x in (a.lang, a.theme) if x)
            path = os.path.join(a.out, f'{name}-{w}{suffix}.png')
            if a.full:
                # trigger lazy content / in-view animations before the full-page capture
                page.evaluate("""async () => { const s = document.scrollingElement; for (let y = 0; y < s.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); }""")
                page.wait_for_timeout(500)
            page.screenshot(path=path, full_page=a.full)
            errs = [m for m in msgs if m['type'] in ('error', 'pageerror', 'warning')]
            log.write(json.dumps({'route': route, 'width': w, 'lang': a.lang, 'theme': a.theme, 'overflowX': overflow,
                                  'errors': len([m for m in msgs if m['type'] in ('error', 'pageerror')]),
                                  'warnings': len([m for m in msgs if m['type'] == 'warning']), 'messages': errs}) + '\n')
            print(f'{path} overflowX={overflow} errors/warnings={len(errs)}')
            for m in errs[:5]:
                print('   ', m['type'], m['text'][:300])
            page.close()
        ctx.close()
    b.close()

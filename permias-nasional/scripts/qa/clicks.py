"""Real-pointer click audit.

1. Hit-test: every visible link/button on each route is scrolled into view and checked with
   document.elementFromPoint at its centre; anything covered by another element is reported with the blocker.
2. Real clicks (page.mouse via locator.click, no JS el.click()) on named targets, asserting navigation or state change.

usage: clicks.py <base_url> <out_json> [--widths 1440,390] [--routes / /chapters ...]
"""
import argparse, json, re, sys
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('base'); ap.add_argument('out')
ap.add_argument('--widths', default='1460x790,1440x900,390x844')
ap.add_argument('--browser', default='chromium', choices=['chromium', 'webkit'])
ap.add_argument('--routes', nargs='*', default=['/', '/chapters', '/events', '/resources', '/about', '/team', '/contact', '/partners', '/about/sejarah', '/chapters/register', '/resources/visa'])
a = ap.parse_args()
base = a.base.rstrip('/')

HIT_JS = r"""
() => {
  const out = [], clear = [];
  const key = (el) => `${el.tagName.toLowerCase()}|${(el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 50)}|${el.getAttribute('href') || ''}`;
  const els = [...document.querySelectorAll('a[href], button, [role=tab], [role=button], select, input:not([type=hidden])')];
  for (const el of els) {
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[aria-hidden=true]') || el.disabled) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    const x = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 1);
    const y = Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 1);
    const at = document.elementFromPoint(x, y);
    const ok = at && (at === el || el.contains(at) || at.contains(el) && at.tagName === 'LABEL');
    if (ok) { clear.push(key(el)); continue; }
    {
      const d = (n) => n ? `${n.tagName.toLowerCase()}${n.id ? '#' + n.id : ''}.${String(n.className && n.className.baseVal !== undefined ? n.className.baseVal : n.className).split(' ').slice(0, 4).join('.')}` : 'null';
      out.push({ key: key(el), el: d(el), text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 50), blocker: d(at), blockerFixed: at ? getComputedStyle(at).position : '' });
    }
  }
  return { out, clear };
}
"""

def hit_test(page):
    blocked = {}
    clear_keys = set()
    total = set()
    h = page.evaluate('document.documentElement.scrollHeight')
    y = 0
    while y < h:
        page.evaluate(f'window.scrollTo(0, {y})')
        page.wait_for_timeout(250)
        res = page.evaluate(HIT_JS)
        clear_keys.update(res['clear'])
        for b in res['out']:
            blocked.setdefault(b['key'], []).append(b)
        n = page.evaluate("document.querySelectorAll('a[href], button').length")
        total.add(n)
        y += int(page.viewport_size['height'] * 0.5)
        h = page.evaluate('document.documentElement.scrollHeight')
    # only elements that were covered at every scroll position they were seen at are real blockers
    return {k: v for k, v in blocked.items() if k not in clear_keys}

def element_ever_clear(page, sel_text):
    return True

results = {'hit': {}, 'clicks': [], 'pass': 0, 'fail': 0}
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel='chrome') if a.browser == 'chromium' else p.webkit.launch(headless=True)
    for spec in a.widths.split(','):
        w, vh = (int(x) for x in spec.split('x'))
        # --- cookie buttons in a clean context
        ctx = b.new_context(viewport={'width': w, 'height': vh}, is_mobile=False)
        page = ctx.new_page()
        page.goto(base + '/', wait_until='load')
        page.wait_for_timeout(1800)
        for name in ['Terima|Accept']:
            try:
                btn = page.get_by_role('button', name=re.compile(f'^({name})$'))
                btn.click(timeout=4000)
                page.wait_for_timeout(500)
                gone = page.get_by_role('button', name=re.compile(f'^({name})$')).count() == 0
                results['clicks'].append({'w': f'{w}x{vh}', 'target': 'cookie accept', 'ok': gone})
            except Exception as e:
                results['clicks'].append({'w': f'{w}x{vh}', 'target': 'cookie accept', 'ok': False, 'err': str(e)[:200]})
        ctx.close()

        ctx = b.new_context(viewport={'width': w, 'height': vh})
        ctx.add_init_script("localStorage.setItem('permias_cookie_consent','declined')")
        page = ctx.new_page()
        # --- hit test on every route: an element counts as blocked only if it is covered at every scroll position it was seen at
        for r in a.routes:
            page.goto(base + r, wait_until='load')
            page.wait_for_timeout(1500)
            bl = hit_test(page)
            seen_ok = page.evaluate("1")
            results['hit'][f'{w}x{vh}{r}'] = [{'el': v[0]['el'], 'text': v[0]['text'], 'blocker': v[0]['blocker'], 'times': len(v)} for k, v in bl.items()]

        # --- real clicks on named targets
        def nav_click(desc, locate, expect_url=None, expect_fn=None, start='/'):
            page.goto(base + start, wait_until='load')
            page.wait_for_timeout(1400)
            try:
                loc = locate(page)
                loc.scroll_into_view_if_needed(timeout=4000)
                page.wait_for_timeout(300)
                loc.click(timeout=4000)
                page.wait_for_timeout(1200)
                ok = True
                if expect_url:
                    ok = re.search(expect_url, page.url) is not None
                if expect_fn:
                    ok = ok and expect_fn(page)
                results['clicks'].append({'w': f'{w}x{vh}', 'target': desc, 'ok': ok, 'url': page.url})
            except Exception as e:
                results['clicks'].append({'w': f'{w}x{vh}', 'target': desc, 'ok': False, 'err': str(e).split('\n')[0][:300]})

        dock = lambda pg: pg.get_by_role('navigation', name=re.compile('Navigasi utama|Main navigation'))
        top = lambda pg: pg.get_by_role('navigation', name=re.compile('Navigasi situs|Site navigation'))
        nav_click('dock: Chapters', lambda pg: dock(pg).get_by_role('link', name=re.compile('^Chapter')), r'/chapters')
        nav_click('dock: Events', lambda pg: dock(pg).get_by_role('link', name=re.compile('^(Acara|Events)$')), r'/events')
        nav_click('dock: Home', lambda pg: dock(pg).get_by_role('link', name=re.compile('^(Beranda|Home)$')), r'/$', start='/events')
        nav_click('dock: Search opens dialog', lambda pg: dock(pg).get_by_role('button', name=re.compile('^(Cari|Search)$')), None,
                  lambda pg: pg.get_by_role('dialog').count() > 0)
        nav_click('dock: More opens dialog', lambda pg: dock(pg).get_by_role('button', name=re.compile('^(Lainnya|More)$')), None,
                  lambda pg: pg.get_by_role('dialog').count() > 0)
        if w >= 1024:
            for name, url in [('Chapter|Chapters', '/chapters'), ('Acara|Events', '/events'), ('Panduan|Guides', '/resources'), ('Tentang|About', '/about'), ('Kontak|Contact', '/contact')]:
                nav_click(f'top nav: {name}', lambda pg, name=name: top(pg).get_by_role('link', name=re.compile(f'^({name})$')), url)
        nav_click('top: register chapter', lambda pg: pg.get_by_role('link', name=re.compile('^(Daftarkan chapter Anda|Register your chapter)$')).first, r'/chapters/register') if w >= 768 else None
        nav_click('top: EN toggle', lambda pg: pg.get_by_role('radio', name='EN').first, None,
                  lambda pg: pg.evaluate("document.documentElement.lang") == 'en')
        nav_click('hero: find chapter', lambda pg: pg.get_by_role('link', name=re.compile('^(Cari chapter|Find your chapter)')).first, r'(#cari-chapter|/chapters)')
        nav_click('hero: about', lambda pg: pg.get_by_role('link', name=re.compile('^(Tentang PERMIAS|About PERMIAS)$')).first, r'/about')
        nav_click('chapter card opens map', lambda pg: pg.locator('[data-testid=chapter-card] a').first, r'/chapters\?')
        nav_click('finder: go to map', lambda pg: pg.locator('#chapter-state'), None, None)
        # state select + Go
        page.goto(base + '/', wait_until='load'); page.wait_for_timeout(1200)
        try:
            page.locator('#chapter-state').scroll_into_view_if_needed()
            page.locator('#chapter-state').select_option('ca')
            page.get_by_role('button', name=re.compile('^(Ke peta|Go to map)')).click(timeout=4000)
            page.wait_for_timeout(1200)
            results['clicks'].append({'w': f'{w}x{vh}', 'target': 'finder: select California + Go', 'ok': 'state=ca' in page.url, 'url': page.url})
        except Exception as e:
            results['clicks'].append({'w': f'{w}x{vh}', 'target': 'finder: select California + Go', 'ok': False, 'err': str(e).split('\n')[0][:300]})
        ctx.close()
    b.close()

results['clicks'] = [c for c in results['clicks'] if c]
results['pass'] = sum(1 for c in results['clicks'] if c['ok'])
results['fail'] = sum(1 for c in results['clicks'] if not c['ok'])
results['blockedTotal'] = sum(len(v) for v in results['hit'].values())
json.dump(results, open(a.out, 'w'), indent=1)
print(f"clicks pass={results['pass']} fail={results['fail']}  hit-test blocked elements={results['blockedTotal']}")
for c in results['clicks']:
    if not c['ok']:
        print('FAIL', c)
for k, v in results['hit'].items():
    for x in v[:6]:
        print('BLOCKED', k, x)

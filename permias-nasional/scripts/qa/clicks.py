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
ap.add_argument('--theme', default=None, choices=[None, 'light', 'dark'])
ap.add_argument('--lang', default=None, choices=[None, 'en', 'id'])
ap.add_argument('--routes', nargs='*', default=['/', '/chapters', '/events', '/resources', '/about', '/team', '/contact', '/partners', '/about/sejarah', '/chapters/register', '/resources/visa'])
a = ap.parse_args()
base = a.base.rstrip('/')
# useLocalStorage JSON-parses every value, so theme and language must be stored JSON-encoded ('"dark"', not 'dark')
INIT = "localStorage.setItem('permias_cookie_consent','declined');" + ''.join(
    f"localStorage.setItem('permias_{k}', JSON.stringify('{v}'));" for k, v in (('theme', a.theme), ('lang', a.lang)) if v)

HIT_JS = r"""
() => {
  const out = [], clear = [];
  const key = (el) => `${el.tagName.toLowerCase()}|${(el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 50)}|${el.getAttribute('href') || ''}`;
  const els = [...document.querySelectorAll('a[href], button, [role=tab], [role=button], select, input:not([type=hidden])')];
  for (const el of els) {
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[aria-hidden=true]') || el.disabled) continue;
    // map state shapes: the bounding-box centre is often outside the shape (Michigan, Florida, Hawaii) or under a pin, so the centre test is meaningless
    if (el.closest('svg')) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    const x = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 1);
    const y = Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 1);
    // scrolled out of a horizontal scroller (chip rows, A-Z bar): not on screen, so not a blocked target
    let clipped = false;
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (/(auto|scroll|hidden|clip)/.test(s.overflowX + s.overflowY)) {
        const ar = a.getBoundingClientRect();
        if (x < ar.left || x > ar.right || y < ar.top || y > ar.bottom) { clipped = true; break; }
      }
    }
    if (clipped) continue;
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

results = {'hit': {}, 'clicks': [], 'console': {}, 'pass': 0, 'fail': 0, 'browser': a.browser, 'widths': a.widths, 'theme': a.theme, 'lang': a.lang}
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
        ctx.add_init_script(INIT)
        page = ctx.new_page()
        errs = []
        page.on('console', lambda m: errs.append(m.text[:200]) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errs.append(str(e)[:200]))
        # --- hit test on every route: an element counts as blocked only if it is covered at every scroll position it was seen at
        for r in a.routes:
            errs.clear()
            page.goto(base + r, wait_until='load')
            page.wait_for_timeout(1500)
            try:
                bl = hit_test(page)
            except Exception as e:
                bl = {'error': [{'el': 'hit-test', 'text': str(e)[:120], 'blocker': ''}]}
            results['console'][f'{w}x{vh}{r}'] = list(errs)
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
        # home is the base URL itself; under a subpath base the router shows it without the trailing slash
        nav_click('dock: Home', lambda pg: dock(pg).get_by_role('link', name=re.compile('^(Beranda|Home)$')), rf'^{re.escape(base)}/?(\?.*)?$', start='/events')
        nav_click('dock: Search opens dialog', lambda pg: dock(pg).get_by_role('button', name=re.compile('^(Cari|Search)$')), None,
                  lambda pg: pg.get_by_role('dialog').count() > 0)
        nav_click('dock: More opens dialog', lambda pg: dock(pg).get_by_role('button', name=re.compile('^(Lainnya|More)$')), None,
                  lambda pg: pg.get_by_role('dialog').count() > 0)
        if w >= 1024:
            for name, url in [('Chapter|Chapters', '/chapters'), ('Acara|Events', '/events'), ('Panduan|Guides', '/resources'), ('Tentang|About', '/about'), ('Kontak|Contact', '/contact')]:
                nav_click(f'top nav: {name}', lambda pg, name=name: top(pg).get_by_role('link', name=re.compile(f'^({name})$')), url)
        if w >= 1024:
            nav_click('top: Chapters menu opens and links to a chapter page', lambda pg: (top(pg).get_by_role('button', name=re.compile('^(Chapters menu|Menu Chapter)$')).click(), pg.wait_for_timeout(600), pg.get_by_role('link', name=re.compile('Permias Purdue')).first)[-1], r'/chapters/permiaspurdue$')
            nav_click('top: Guides menu opens and links to a guide', lambda pg: (top(pg).get_by_role('button', name=re.compile('^(Guides menu|Menu Panduan)$')).click(), pg.wait_for_timeout(600), pg.get_by_role('link', name=re.compile('^(Visa|Visa)')).first)[-1], r'/resources/')
        nav_click('chapter page: next chapter', lambda pg: pg.get_by_role('link', name=re.compile('^(Next chapter|Chapter berikutnya)')), r'/chapters/[a-z0-9_.-]+$', start='/chapters/berkeleybisa')
        nav_click('chapter page: full map', lambda pg: pg.get_by_role('link', name=re.compile('^(Open the full map|Buka peta lengkap)$')), r'/chapters\?state=ca&chapter=c-berkeleybisa', start='/chapters/berkeleybisa')
        def open_chat(pg):
            if w >= 768:
                return pg.get_by_role('button', name=re.compile('^(Open assistant|Buka asisten)$'))
            dock(pg).get_by_role('button', name=re.compile('^(Lainnya|More)$')).click()
            pg.wait_for_timeout(700)
            return pg.get_by_role('button', name=re.compile('^(Open assistant|Buka asisten)$')).first
        chat_dialog = lambda pg: pg.get_by_role('dialog', name=re.compile('Assistant|Asisten'))
        nav_click('chat: opens panel', open_chat, None, lambda pg: chat_dialog(pg).count() > 0)
        def offline_link(pg):
            open_chat(pg).click()
            pg.wait_for_timeout(5000)  # reachability check times out or fails, then the offline card appears
            return chat_dialog(pg).get_by_role('link', name=re.compile('^(Visa guide|Panduan visa)$')).first
        nav_click('chat: offline card links to the visa guide', offline_link, r'/resources/visa$')
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
results['consoleErrors'] = sum(len(v) for v in results['console'].values())
json.dump(results, open(a.out, 'w'), indent=1)
print(f"[{a.browser} {a.widths} theme={a.theme} lang={a.lang}] clicks pass={results['pass']} fail={results['fail']}  hit-test blocked={results['blockedTotal']}  console errors={results['consoleErrors']}")
for k, v in results['console'].items():
    for m in v[:3]:
        print('CONSOLE', k, m)
for c in results['clicks']:
    if not c['ok']:
        print('FAIL', c)
for k, v in results['hit'].items():
    for x in v[:6]:
        print('BLOCKED', k, x)

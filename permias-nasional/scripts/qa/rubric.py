"""Score every route against the ui-review-rubric rules, using the rubric's own probe for the measurements.

usage: rubric.py <base_url> <out_dir> [--routes / /events ...] [--viewports 1440x900,390x844]

For each route it runs ~/.agents/skills/ui-review-rubric/scripts/ui_probe.py, saves <out_dir>/<name>.json,
then grades the numbers into P1/P2/P3 findings (rules below) and a score out of 100:
  score = max(0, 100 - 12 * P1 - 5 * P2 - 1.5 * P3)   (each finding counted once per route, worst viewport)
Rules (rubric section in brackets):
  P1  horizontal overflow [6], console errors [6], focus stop without a visible ring [4],
      non-inline target < 24px failing the spacing exception (probe p1_candidates) [4],
      small text under 3:1 on a solid background [3]
  P2  small text 3:1-4.5:1 [3], h2 larger than h1 [1], most paragraph text under 16px at 390 [1],
      transitions over 600ms [5], infinite animation still running under reduced motion [5],
      more than 3 off-grid section paddings [2], no-JS H1 hidden [5]
  P3  bold (>=600) serif headings (Preston's ask: regular-weight Times headlines) [1],
      same-level headings more than 2px apart [1], transition: all with a duration [5],
      layout-property transitions [5], more than 4 distinct shadows [2],
      above-fold images without width/height, LCP image without fetchpriority=high [6]
Writes <out_dir>/scores.json and prints a markdown table.
"""
import argparse, json, os, re, subprocess, sys

PROBE = os.path.expanduser('~/.agents/skills/ui-review-rubric/scripts/ui_probe.py')
ROUTES = ['/', '/chapters', '/chapters/register', '/events', '/team', '/about', '/about/sejarah', '/contact', '/partners',
          '/resources', '/resources/embassies', '/resources/visa', '/resources/academics', '/resources/jobs',
          '/resources/research', '/resources/scholarships', '/resources/entrepreneurship', '/resources/cultural']


def name_of(route):
    return re.sub(r'[^a-z0-9]+', '-', route.strip('/').lower()) or 'home'


def grade(d):
    f = {}  # finding key -> (sev, detail)

    def add(key, sev, detail):
        if key not in f or 'P123'.index(sev[1]) < 'P123'.index(f[key][0][1]):
            f[key] = (sev, detail)

    for vp, v in d.get('viewports', {}).items():
        if v.get('overflow', {}).get('h_overflow'):
            add('overflow', 'P1', f'{vp} scrollWidth {v["overflow"]["scrollWidth"]}')
        if v.get('console_errors'):
            add('console', 'P1', f'{vp} {len(v["console_errors"])} errors')
        for c in v.get('targets', {}).get('p1_candidates', []):
            add(f'target:{c.get("sel")}', 'P1', f'{vp} {c.get("w")}x{c.get("h")}')
        for col, s in v.get('small_text_colors', {}).items():
            r = s.get('min_ratio', 21)
            if s.get('bg_image'):
                continue
            if r < 3:
                add(f'contrast:{s.get("worst")}', 'P1', f'{vp} "{s.get("text", "")[:30]}" {r}:1')
            elif r < 4.5:
                add(f'contrast:{s.get("worst")}', 'P2', f'{vp} "{s.get("text", "")[:30]}" {r}:1')
        hs = v.get('headings', {})
        h1 = max((h['size'] for h in hs.get('h1', [])), default=0)
        h2s = [h['size'] for h in hs.get('h2', [])]
        if h1 and h2s and max(h2s) > h1:
            add('h2>h1', 'P2', f'{vp} h2 {max(h2s)} > h1 {h1}')
        for lvl in ('h2', 'h3'):
            sizes = sorted({round(h['size']) for h in hs.get(lvl, [])})
            if len(sizes) > 1 and sizes[-1] - sizes[0] > 2:
                add(f'scale:{lvl}', 'P3', f'{vp} {lvl} sizes {sizes}')
            bold = [h for h in hs.get(lvl, []) if 'Times' in h.get('family', '') and int(h.get('weight', '400')) >= 600]
            if bold:
                add(f'boldserif:{lvl}', 'P3', f'{vp} {len(bold)} bold serif {lvl} e.g. "{bold[0]["text"][:30]}"')
        if v.get('vw', 0) < 600:
            hist = v.get('body_histogram', {})
            small = sum(n for k, n in hist.items() if float(k.split('/')[0]) < 16)
            total = sum(hist.values()) or 1
            if small / total > 0.5:
                add('body<16', 'P2', f'{vp} {small}/{total} text samples under 16px')
        m = v.get('motion', {})
        if m.get('over_600ms'):
            add('motion>600', 'P2', f'{vp} {m["over_600ms"][:2]}')
        ta = [x for x in m.get('transition_all', []) if not x.endswith(' 0s')]
        if ta:
            add('transition-all', 'P3', f'{vp} {ta[:2]}')
        if m.get('layout_transitions'):
            add('layout-transition', 'P3', f'{vp} {m["layout_transitions"][:2]}')
        if len(v.get('off_grid_paddings', [])) > 3:
            add('offgrid', 'P2', f'{vp} {len(v["off_grid_paddings"])} off-grid paddings')
        if v.get('distinct_shadows', 0) > 4:
            add('shadows', 'P3', f'{vp} {v["distinct_shadows"]} distinct shadows')
        imgs = v.get('above_fold_images', [])
        nodims = [i['src'] for i in imgs if not i.get('has_dims')]
        if nodims:
            add('img-dims', 'P3', f'{vp} {nodims[:2]}')
    fv = d.get('focus_visible', {})
    miss = [s for s in fv.get('stops', []) if not s.get('visible_ring')]
    for s in miss:
        add(f'focus:{s.get("text", "")[:20]}', 'P1', 'no visible ring')
    rm = d.get('reduced_motion', {})
    if rm.get('infinite', 0) > 0:
        add('rm-infinite', 'P2', f'{rm["infinite"]} infinite animations under reduced motion')
    nj = d.get('no_js_h1')
    if isinstance(nj, dict) and float(nj.get('opacity', 1)) < 0.5:
        add('nojs-h1', 'P2', f'opacity {nj.get("opacity")}')
    p = {s: sum(1 for v in f.values() if v[0] == s) for s in ('P1', 'P2', 'P3')}
    score = max(0, round(100 - 12 * p['P1'] - 5 * p['P2'] - 1.5 * p['P3'], 1))
    return score, p, {k: {'sev': v[0], 'detail': v[1]} for k, v in f.items()}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('base'); ap.add_argument('out')
    ap.add_argument('--routes', nargs='*', default=ROUTES)
    ap.add_argument('--viewports', default='1440x900,390x844')
    ap.add_argument('--regrade', action='store_true', help='grade existing JSON without probing again')
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    scores = {}
    for r in a.routes:
        path = os.path.join(a.out, name_of(r) + '.json')
        if not a.regrade:
            subprocess.run([sys.executable, PROBE, a.base.rstrip('/') + r, '--out', path, '--viewports', a.viewports],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=240)
        try:
            d = json.load(open(path))
        except Exception as e:
            scores[r] = {'score': None, 'error': str(e)}
            continue
        s, p, f = grade(d)
        scores[r] = {'score': s, **p, 'findings': f}
        print(f'{r}: {s} (P1 {p["P1"]}, P2 {p["P2"]}, P3 {p["P3"]})', flush=True)
    vals = [v['score'] for v in scores.values() if v.get('score') is not None]
    avg = round(sum(vals) / len(vals), 1) if vals else None
    json.dump({'average': avg, 'routes': scores}, open(os.path.join(a.out, 'scores.json'), 'w'), indent=1)
    print(f'average {avg} over {len(vals)} routes')


if __name__ == '__main__':
    main()

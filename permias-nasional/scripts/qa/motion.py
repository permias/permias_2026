"""Records short webm clips: hero slideshow (idle), map zoom into a state, dock hover/press."""
import sys, os, shutil, re
from playwright.sync_api import sync_playwright
base, outdir = sys.argv[1], sys.argv[2]
os.makedirs(outdir, exist_ok=True)
def rec(name, fn, w=1440, h=900):
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True, channel='chrome')
        ctx = b.new_context(viewport={'width': w, 'height': h}, record_video_dir=outdir, record_video_size={'width': w // 2, 'height': h // 2})
        ctx.add_init_script("localStorage.setItem('permias_cookie_consent','declined'); localStorage.setItem('permias_lang','en')")
        pg = ctx.new_page(); fn(pg); path = pg.video.path(); ctx.close(); b.close()
        shutil.move(path, os.path.join(outdir, f'{name}.webm'))
def hero(pg):
    pg.goto(base + '/', wait_until='load'); pg.wait_for_timeout(15000)
def mapzoom(pg):
    pg.goto(base + '/chapters', wait_until='load'); pg.wait_for_timeout(2500)
    pg.locator('#chapters-state').select_option('ca'); pg.wait_for_timeout(2200)
    pg.locator('#chapters-state').select_option('ny'); pg.wait_for_timeout(2200)
    pg.get_by_role('button', name=re.compile('Show all states|Tampilkan semua')).click(); pg.wait_for_timeout(2000)
def dock(pg):
    pg.goto(base + '/events', wait_until='load'); pg.wait_for_timeout(1500)
    nav = pg.get_by_role('navigation', name=re.compile('Main navigation|Navigasi utama'))
    box = nav.bounding_box()
    for k in range(24):
        pg.mouse.move(box['x'] + box['width'] * k / 23, box['y'] + box['height'] / 2); pg.wait_for_timeout(60)
    nav.get_by_role('link', name=re.compile('^Chapters?$')).click(); pg.wait_for_timeout(1800)
    pg.mouse.wheel(0, 900); pg.wait_for_timeout(1200); pg.mouse.wheel(0, -900); pg.wait_for_timeout(1200)
rec('map-zoom', mapzoom); rec('dock', dock)
print(sorted(os.listdir(outdir)))

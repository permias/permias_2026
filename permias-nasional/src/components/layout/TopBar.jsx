import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useUi } from '../../context/UiContext.jsx';
import { chapters, REGION_LABELS, REGIONS, stateCount } from '../../data/chapters.js';
import { PAGE_PHOTOS, photo } from '../../data/photos.js';
import { resourceSections } from '../../data/resources.js';
import { GUIDE_NOTES } from '../../data/guideNotes.js';
import { chapterPath } from '../../lib/chapterInfo.js';
import { REGION_TONE } from '../../lib/regionTone.js';
import { motionTokens, springs } from '../../lib/motion.js';
import { publicUrl } from '../../utils/site.js';
import { cn } from '../../utils/cn.js';
import { ChapterLogo } from '../chapters/ChapterLogo.jsx';
import { IconArrowRight, IconChevronDown, IconLocate, IconMoon, IconPlus, IconSearch, IconSun } from '../ui/Icons.jsx';

const LINKS = [
  { to: '/', key: 'dock.home', match: (p) => p === '/' },
  { to: '/chapters', key: 'dock.chapters', menu: 'chapters', match: (p) => p.startsWith('/chapters') || p === '/about/chapters' },
  { to: '/events', key: 'dock.events', match: (p) => p.startsWith('/events') },
  { to: '/resources', key: 'dock.resources', menu: 'guides', match: (p) => p.startsWith('/resources') },
  { to: '/about', key: 'nav.about', menu: 'about', match: (p) => ['/about', '/about/sejarah', '/team', '/about/team', '/partners'].includes(p) },
  { to: '/contact', key: 'nav.contact.short', match: (p) => p === '/contact' },
];


const ABOUT_LINKS = [
  { to: '/about', title: { en: 'About PERMIAS', id: 'Tentang PERMIAS' }, note: { en: 'Mission, vision and how we are organised', id: 'Misi, visi, dan struktur organisasi' } },
  { to: '/about/sejarah', title: { en: 'Our history', id: 'Sejarah kami' }, note: { en: 'A national association since 1961', id: 'Organisasi nasional sejak 1961' } },
  { to: '/team', title: { en: 'Leadership team', id: 'Tim pengurus' }, note: { en: 'The volunteers who run PERMIAS Nasional', id: 'Para relawan pengurus PERMIAS Nasional' } },
  { to: '/partners', title: { en: 'Partners', id: 'Mitra' }, note: { en: 'Embassy, consulates, scholarships, culture', id: 'Kedutaan, konsulat, beasiswa, budaya' } },
  { to: '/contact', title: { en: 'Contact', id: 'Kontak' }, note: { en: 'Email the board or find us on social', id: 'Email pengurus atau temui kami di media sosial' } },
];

// Four chapters shown in the menu, one per region, picked for coast-to-coast spread.
const featured = ['c-indonesiacolumbia', 'c-permiaspurdue', 'c-isagatech', 'c-berkeleybisa'].map((id) => chapters.find((c) => c.id === id)).filter(Boolean);

const regionCount = Object.fromEntries(REGIONS.map((r) => [r, chapters.filter((c) => c.region === r).length]));

function Callout({ to, image, title, sub, onNavigate }) {
  const p = photo(image);
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="group relative isolate flex min-h-[244px] flex-col justify-end overflow-hidden rounded-[20px] bg-[#0A1220] p-5 text-white outline-offset-2"
    >
      {p && (
        <img
          src={p.small}
          alt=""
          width="800"
          height="533"
          loading="lazy"
          className="photo-grade absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      )}
      <span className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,18,32,0)_30%,rgba(10,18,32,.82)_100%)]" aria-hidden="true" />
      <span className="font-display text-[26px] leading-[1.05]">{title}</span>
      <span className="mt-1.5 text-sm text-white/80">{sub}</span>
      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
        <span className="underline decoration-white/40 underline-offset-4 transition-colors group-hover:decoration-white">{p?.alt}</span>
      </span>
    </Link>
  );
}

function MenuLink({ to, title, note, onNavigate, children }) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="group flex items-start gap-3 rounded-[14px] p-2.5 outline-offset-0 transition-colors duration-150 hover:bg-ink/[0.045] dark:hover:bg-white/[0.06]"
    >
      {children}
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-[15px] font-semibold text-ink">
          {title}
          <IconArrowRight className="h-3.5 w-3.5 -translate-x-1 text-merah opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-x-0 group-hover:opacity-100" />
        </span>
        {note && <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{note}</span>}
      </span>
    </Link>
  );
}

function ChaptersMenu({ pick, t, onNavigate }) {
  return (
    <div className="grid grid-cols-[260px_minmax(0,1fr)_minmax(0,1.1fr)] gap-6">
      <Callout
        to="/chapters"
        image="campus-stanford"
        onNavigate={onNavigate}
        title={pick({ en: 'Find your chapter', id: 'Cari chapter Anda' })}
        sub={pick({ en: `${chapters.length} chapters in ${stateCount} states and DC`, id: `${chapters.length} chapter di ${stateCount} negara bagian dan DC` })}
      />
      <div>
        <p className="px-2.5 font-display text-lg text-ink">{pick({ en: 'By region', id: 'Menurut wilayah' })}</p>
        <ul className="mt-2">
          {REGIONS.map((r) => (
            <li key={r}>
              <MenuLink to={`/chapters?region=${encodeURIComponent(r)}`} onNavigate={onNavigate} title={pick(REGION_LABELS[r])} note={pick({ en: `${regionCount[r]} chapters`, id: `${regionCount[r]} chapter` })}>
                <span className={cn('mt-2 h-2.5 w-2.5 shrink-0 rounded-full', REGION_TONE[r].dot)} aria-hidden="true" />
              </MenuLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-l border-border pl-6">
        <p className="px-2.5 font-display text-lg text-ink">{pick({ en: 'Chapter pages', id: 'Halaman chapter' })}</p>
        <ul className="mt-2">
          {featured.map((c) => (
            <li key={c.id}>
              <MenuLink to={chapterPath(c)} onNavigate={onNavigate} title={c.chapterName} note={`${c.universityFull || c.university}, ${c.city}`}>
                <ChapterLogo c={c} size={36} />
              </MenuLink>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2 px-2.5">
          <Link to="/chapters?near=1" onClick={onNavigate} className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-border px-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30">
            <IconLocate className="h-4 w-4 text-merah" />
            {t('home.finder.near')}
          </Link>
          <Link to="/chapters/register" onClick={onNavigate} className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-border px-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink/30">
            <IconPlus className="h-4 w-4 text-merah" />
            {t('chapters.register')}
          </Link>
        </div>
      </div>
    </div>
  );
}

function GuidesMenu({ pick, onNavigate }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_260px] gap-6">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
        {resourceSections.map((s) => {
          const p = photo(PAGE_PHOTOS[s.id] || PAGE_PHOTOS.resources);
          return (
            <li key={s.id}>
              <MenuLink to={`/resources/${s.id}`} onNavigate={onNavigate} title={pick(s.title)} note={pick(GUIDE_NOTES[s.id])}>
                {p && <img src={p.small} alt="" width="44" height="44" loading="lazy" className="photo-grade media-outline h-11 w-11 shrink-0 rounded-[10px] object-cover" />}
              </MenuLink>
            </li>
          );
        })}
      </ul>
      <Callout
        to="/resources/visa"
        image="nyc-empire-state"
        onNavigate={onNavigate}
        title={pick({ en: 'Visa and status', id: 'Visa dan status' })}
        sub={pick({ en: 'The F-1 timeline, step by step', id: 'Linimasa F-1, langkah demi langkah' })}
      />
    </div>
  );
}

function AboutMenu({ pick, onNavigate }) {
  return (
    <div className="grid grid-cols-[260px_minmax(0,1fr)] gap-6">
      <Callout
        to="/about/sejarah"
        image="us-lincoln-reflecting"
        onNavigate={onNavigate}
        title={pick({ en: 'Since 1961', id: 'Sejak 1961' })}
        sub={pick({ en: 'How a national association of students began', id: 'Awal mula perhimpunan mahasiswa nasional' })}
      />
      <ul className="grid grid-cols-2 content-start gap-x-4 gap-y-1">
        {ABOUT_LINKS.map((l) => (
          <li key={l.to}>
            <MenuLink to={l.to} onNavigate={onNavigate} title={pick(l.title)} note={pick(l.note)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function LangSwitch({ lang, setLang, label, light }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('relative inline-flex rounded-full p-1', light ? 'bg-white/15' : 'bg-ink/[0.06] dark:bg-white/10')}>
      {[
        { value: 'id', label: 'ID' },
        { value: 'en', label: 'EN' },
      ].map((o) => {
        const on = lang === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => setLang(o.value)}
            className={cn(
              'relative flex min-h-[36px] items-center justify-center rounded-full text-[13px] font-semibold tracking-wide transition-colors duration-150',
              on ? (light ? 'text-[#13233F]' : 'text-ink') : light ? 'text-white/85 hover:text-white' : 'text-ink/65 hover:text-ink',
            )}
          >
            {on ? (
              <motion.span
                layoutId="lang-thumb"
                className="flex min-h-[36px] min-w-[38px] items-center justify-center rounded-full bg-white px-2 shadow-[0_2px_8px_-2px_rgba(15,27,45,.35)] sm:min-w-[42px] sm:px-2.5 dark:bg-[#2A3954]"
                transition={springs.snappy}
              >
                {o.label}
              </motion.span>
            ) : (
              <span className="flex min-h-[36px] min-w-[38px] items-center justify-center px-2 sm:min-w-[42px] sm:px-2.5">{o.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Institutional top bar with a glass surface that strengthens as the page scrolls,
 * a sliding active indicator, and image mega-menus for Chapters, Guides and About.
 * Over the home slideshow it starts clear with white text.
 */
export function TopBar() {
  const { t, lang, setLang, pick } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { openSearch } = useUi();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 40);
  const [menu, setMenu] = useState(null);
  const [menuPath, setMenuPath] = useState(pathname);
  const [hovered, setHovered] = useState(null);
  const timer = useRef(0);
  const headerRef = useRef(null);
  const triggerRefs = useRef({});
  const panelId = useId();
  const { scrollY } = useScroll();
  const isHome = pathname === '/';
  const overHero = isHome && !scrolled && !menu;
  const strong = useTransform(scrollY, [0, 140], [0, 1]);
  const softHome = useTransform(scrollY, [0, 60], [0, 1]);
  const [isMac] = useState(() => typeof navigator === 'undefined' || /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent));

  // a route change closes any open menu (state adjusted during render, not in an effect)
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (menu) setMenu(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback(() => {
    clearTimeout(timer.current);
    setMenu(null);
  }, []);

  useEffect(() => {
    if (!menu) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        const trigger = triggerRefs.current[menu];
        setMenu(null);
        trigger?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu]);

  const openSoon = (id) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMenu(id), menu ? 0 : 90);
  };
  const closeSoon = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMenu(null), 180);
  };

  const activeIdx = LINKS.findIndex((l) => l.match(pathname));
  const light = overHero;

  const iconBtn = cn(
    'relative flex h-11 w-11 items-center justify-center rounded-[12px] transition-[background-color,color,transform] duration-150 active:scale-95',
    light ? 'text-white hover:bg-white/15' : 'text-ink hover:bg-ink/[0.06] dark:hover:bg-white/10',
  );

  return (
    <header
      ref={headerRef}
      className={cn('fixed inset-x-0 top-0 z-[55] transition-colors duration-300', light ? 'bg-gradient-to-b from-black/50 to-black/0 text-white' : 'text-ink')}
      onPointerLeave={closeSoon}
      onPointerEnter={() => clearTimeout(timer.current)}
      onBlur={(e) => {
        if (menu && !e.currentTarget.contains(e.relatedTarget)) setMenu(null);
      }}
    >
      {/* glass: a soft layer, then a stronger one that fades in with scroll */}
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-white/60 backdrop-blur-[14px] dark:bg-[#0A1220]/55" style={{ opacity: menu || !isHome ? 1 : softHome }} />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-white/[0.86] shadow-[0_1px_0_rgb(var(--border)),0_18px_40px_-28px_rgba(19,35,63,.45)] backdrop-blur-[24px] backdrop-saturate-[1.8] dark:bg-[#0A1220]/[0.86] dark:shadow-[0_1px_0_rgba(255,255,255,.08),0_18px_40px_-28px_rgba(0,0,0,.8)]"
        style={{ opacity: menu ? 1 : strong }}
      />

      <div className="container-x flex h-16 items-center justify-between gap-2 sm:gap-4 md:h-[72px]">
        <Link to="/" className="group flex min-w-0 shrink items-center gap-2 rounded-[12px] sm:gap-3 lg:shrink-0 outline-offset-4" aria-label={t('topbar.homeLabel')}>
          <img
            src={publicUrl(light || theme === 'dark' ? '/images/brand/emblem-white.png' : '/images/brand/emblem-red.png')}
            alt=""
            width="36"
            height="40"
            className="h-9 w-8 transition-transform sm:h-10 sm:w-9 duration-300 ease-out group-hover:-translate-y-0.5"
          />
          <span className="flex flex-col leading-none">
            <span className="whitespace-nowrap font-display text-[18px] tracking-[0.01em] sm:text-[21px]">
              PERMIAS <span className="italic">Nasional</span>
            </span>
            <span className={cn('mt-1 hidden whitespace-nowrap text-[11px] font-medium sm:block lg:hidden xl:block', light ? 'text-white/75' : 'text-muted-foreground')}>
              {pick({ en: 'Indonesian students in the United States', id: 'Mahasiswa Indonesia di Amerika Serikat' })}
            </span>
          </span>
        </Link>

        <nav aria-label={t('topbar.primary')} className="hidden lg:block" onPointerLeave={() => setHovered(null)}>
          <ul className="flex items-center gap-0.5">
            {LINKS.map((l, i) => {
              const active = i === activeIdx;
              const open = menu === l.menu && !!l.menu;
              return (
                <li
                  key={l.to}
                  className="relative flex items-center"
                  onPointerEnter={() => {
                    setHovered(i);
                    if (l.menu) openSoon(l.menu);
                    else closeSoon();
                  }}
                >
                  {hovered === i && (
                    <motion.span
                      layoutId="nav-hover"
                      className={cn('absolute inset-0 rounded-[12px]', light ? 'bg-white/15' : 'bg-ink/[0.055] dark:bg-white/[0.08]')}
                      transition={springs.snappy}
                      aria-hidden="true"
                    />
                  )}
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative flex h-11 items-center rounded-[12px] text-[15px] font-semibold transition-colors duration-150',
                      l.menu ? 'pl-3.5 pr-1' : 'px-3.5',
                      light ? 'text-white/90 hover:text-white' : active ? 'text-ink' : 'text-ink/70 hover:text-ink',
                    )}
                  >
                    {t(l.key)}
                  </NavLink>
                  {l.menu && (
                    <button
                      type="button"
                      ref={(el) => (triggerRefs.current[l.menu] = el)}
                      aria-expanded={open}
                      aria-controls={open ? panelId : undefined}
                      aria-label={pick({ en: `${t(l.key)} menu`, id: `Menu ${t(l.key)}` })}
                      onClick={() => setMenu(open ? null : l.menu)}
                      className={cn('relative mr-1 flex h-8 w-7 items-center justify-center rounded-[8px] transition-colors', light ? 'text-white/80 hover:text-white' : 'text-ink/50 hover:text-ink')}
                    >
                      <IconChevronDown className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')} />
                    </button>
                  )}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className={cn('absolute inset-x-3.5 -bottom-[3px] h-[2px] rounded-full', light ? 'bg-white' : 'bg-merah')}
                      transition={springs.snappy}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => openSearch()}
            aria-label={t('dock.search')}
            aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
            className={cn(
              'group flex h-11 w-11 items-center justify-center rounded-[12px] transition-[background-color,box-shadow,transform] duration-150 active:scale-95 2xl:w-auto 2xl:gap-2 2xl:pl-3 2xl:pr-2',
              light ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-ink/[0.05] text-ink hover:bg-ink/[0.09] dark:bg-white/[0.07] dark:hover:bg-white/[0.12]',
            )}
          >
            <IconSearch className="h-[18px] w-[18px]" />
            <span className="hidden text-sm font-medium 2xl:inline">{t('dock.search')}</span>
            <kbd aria-hidden="true" className={cn('hidden rounded-[6px] px-1.5 py-0.5 font-sans text-[11px] font-semibold 2xl:inline', light ? 'bg-white/20' : 'bg-ink/[0.08] text-ink/65 dark:bg-white/10')}>
              {isMac ? '⌘K' : 'Ctrl K'}
            </kbd>
          </button>
          <LangSwitch lang={lang} setLang={setLang} label={t('nav.lang')} light={light} />
          <button type="button" onClick={toggleTheme} className={cn(iconBtn, 'hidden sm:flex')} aria-label={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -60, scale: motionTokens.scale.press }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 60, scale: motionTokens.scale.press, transition: { duration: motionTokens.duration.exit } }}
                transition={springs.snappy}
                className="flex"
              >
                {theme === 'dark' ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
          <Link
            to="/chapters/register"
            className="ml-1 hidden h-11 items-center whitespace-nowrap rounded-[12px] bg-merah px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_8px_20px_-10px_rgb(var(--merah)/0.9)] transition-[transform,background-color,box-shadow] duration-150 hover:bg-[#a90d26] hover:shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_12px_26px_-10px_rgb(var(--merah)/0.95)] active:scale-[0.97] md:flex lg:hidden xl:flex"
          >
            {t('chapters.register')}
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div
            key="mega"
            id={panelId}
            initial={{ opacity: 0, y: -motionTokens.distance.sm, scale: motionTokens.scale.subtle }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth } }}
            exit={{ opacity: 0, y: -motionTokens.distance.xs, transition: { duration: motionTokens.duration.exit } }}
            style={{ transformOrigin: 'top center' }}
            className="absolute inset-x-0 top-full hidden px-4 lg:block"
          >
            <div className="mx-auto mt-2 max-w-[1080px] rounded-[28px] border border-white/70 bg-white/[0.94] p-4 text-ink shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_40px_80px_-40px_rgba(15,27,45,.45)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-[#0E1828]/[0.95] dark:shadow-[0_40px_80px_-40px_rgba(0,0,0,.9)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={menu}
                  initial={{ opacity: 0, x: -motionTokens.distance.sm }}
                  animate={{ opacity: 1, x: 0, transition: { duration: motionTokens.duration.fast, ease: motionTokens.easing.smooth } }}
                  exit={{ opacity: 0, transition: { duration: motionTokens.duration.instant } }}
                >
                  {menu === 'chapters' && <ChaptersMenu pick={pick} t={t} onNavigate={close} />}
                  {menu === 'guides' && <GuidesMenu pick={pick} onNavigate={close} />}
                  {menu === 'about' && <AboutMenu pick={pick} onNavigate={close} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

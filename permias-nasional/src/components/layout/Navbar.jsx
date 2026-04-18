import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { buildSearchIndex, searchIndex } from '../../utils/searchIndex.js';
import { navAboutLinks, navResourceLinks } from '../../data/quickAccess.js';
import { brand } from '../../data/siteMedia.js';
import { cn } from '../../utils/cn.js';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Modal } from '../ui/Modal.jsx';

function ChevronDown({ className }) {
  return (
    <svg className={cn('h-4 w-4 shrink-0 opacity-70', className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavDropdown({ id, label, items, parentActive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        id={`${id}-trigger`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={`${id}-menu`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors sm:px-2.5 sm:text-xs sm:tracking-[0.2em]',
          open || parentActive
            ? 'text-brand-red'
            : 'text-brand-charcoal/55 hover:text-brand-red dark:text-white/55 dark:hover:text-white',
        )}
      >
        <span className="max-w-[8rem] truncate sm:max-w-none">{label}</span>
        <ChevronDown className={cn('h-3 w-3 shrink-0 opacity-60 transition-transform sm:h-3.5 sm:w-3.5', open && 'rotate-180')} />
      </button>
      <div
        id={`${id}-menu`}
        role="menu"
        aria-labelledby={`${id}-trigger`}
        className={cn(
          'absolute left-0 top-full z-[80] mt-1.5 min-w-[min(100vw-2rem,260px)] rounded-xl border border-brand-charcoal/10 bg-white py-1.5 shadow-lg dark:border-white/10 dark:bg-surface-card',
          open ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0',
          'transition-opacity duration-150',
        )}
      >
        <ul className="max-h-[min(70vh,420px)] overflow-y-auto py-0.5">
          {items.map((item) => {
            const isHere = location.pathname === item.to;
            return (
              <li key={item.to} role="none">
                <Link
                  role="menuitem"
                  to={item.to}
                  className={cn(
                    'block w-full px-4 py-2.5 text-left text-sm font-medium text-brand-charcoal transition hover:bg-brand-red/10 hover:text-brand-red dark:text-white dark:hover:bg-white/10',
                    isHere && 'bg-brand-red/10 font-semibold text-brand-red dark:text-white',
                  )}
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const aboutMenuActive = navAboutLinks.some((i) => location.pathname === i.to);
  const resourcesMenuActive = navResourceLinks.some((i) => location.pathname === i.to);
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const index = useMemo(() => buildSearchIndex(), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer]);

  const results = useMemo(() => searchIndex(q, index), [q, index]);

  const grouped = useMemo(() => {
    const g = { chapters: [], resources: [], events: [], team: [] };
    for (const r of results) {
      if (g[r.category]) g[r.category].push(r);
    }
    return g;
  }, [results]);

  const openSearch = () => setSearchOpen(true);

  const linkClass = ({ isActive }) =>
    cn(
      'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
      isActive
        ? 'text-brand-red'
        : 'text-brand-charcoal/80 hover:text-brand-red dark:text-white/80 dark:hover:text-white',
    );

  return (
    <>
      <div
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          'border-b border-transparent bg-white/90 backdrop-blur-md transition-all duration-200 dark:bg-surface-dark/90',
          scrolled && 'border-brand-charcoal/10 py-3 dark:border-white/10',
          !scrolled && 'py-4 md:py-5',
        )}
      >
        <div className="mx-auto flex max-w-content items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 shrink-0 items-center">
            <img
              src={brand.logoHorizontal}
              alt="PERMIAS Nasional"
              className="h-9 w-auto max-w-[min(56vw,220px)] object-contain object-left sm:h-11 sm:max-w-[260px]"
              width={260}
              height={56}
              decoding="async"
            />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            <NavLink to="/" className={linkClass} end>
              {t('nav.home')}
            </NavLink>
            <NavDropdown id="nav-about" label={t('nav.about')} items={navAboutLinks} parentActive={aboutMenuActive} />
            <NavDropdown id="nav-resources" label={t('nav.resources')} items={navResourceLinks} parentActive={resourcesMenuActive} />
            <NavLink to="/contact" className={linkClass}>
              {t('nav.contact')}
            </NavLink>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
              className="rounded-lg border border-brand-charcoal/15 px-2 py-1 text-xs font-bold uppercase tracking-wide text-brand-charcoal transition hover:border-brand-red/40 dark:border-white/15 dark:text-white"
              aria-label={t('nav.lang')}
            >
              {lang === 'en' ? 'EN' : 'ID'}
            </button>

            <button
              type="button"
              onClick={openSearch}
              className="rounded-full p-2 text-brand-charcoal hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
              aria-label={t('nav.search')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15ZM16.5 16.5 21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="hidden rounded-full p-2 text-brand-charcoal hover:bg-black/5 sm:block dark:text-white dark:hover:bg-white/10"
              aria-label={t('nav.theme')}
            >
              {theme === 'dark' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.48 0l1.79-1.79 1.41 1.41-1.79 1.8-1.41-1.42zM12 4V1h-1v3h1zm0 19v-3h-1v3h1zm7-8h3v-1h-3v1zM1 12h3v-1H1v1zm16.24 7.16l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM6.76 19.16l-1.8 1.79-1.41-1.41 1.79-1.8 1.42 1.42zM12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M21 14.5A7.5 7.5 0 0 1 9.5 3 7.5 7.5 0 1 0 21 14.5z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              className="rounded-full p-2 text-brand-charcoal hover:bg-black/5 lg:hidden dark:text-white dark:hover:bg-white/10"
              aria-label={drawer ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={drawer}
              onClick={() => setDrawer(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} labelledBy="search-title">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 id="search-title" className="font-display text-xl font-bold">
              {t('search.title')}
            </h2>
            <Button type="button" variant="ghost" className="!px-3 !py-2" onClick={() => setSearchOpen(false)}>
              {t('search.close')}
            </Button>
          </div>
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('search.placeholder')}
          />
          <div className="max-h-[50vh] space-y-6 overflow-y-auto pr-1">
            {!q.trim() && <p className="text-sm text-brand-charcoal/60 dark:text-white/60">{t('search.placeholder')}</p>}
            {q.trim() && results.length === 0 && (
              <p className="text-sm text-brand-charcoal/60 dark:text-white/60">{t('search.empty')}</p>
            )}
            {['chapters', 'resources', 'events', 'team'].map((cat) => {
              const items = grouped[cat];
              if (!items.length) return null;
              const labelKey =
                cat === 'chapters'
                  ? 'search.groups.chapters'
                  : cat === 'resources'
                    ? 'search.groups.resources'
                    : cat === 'events'
                      ? 'search.groups.events'
                      : 'search.groups.team';
              return (
                <div key={cat}>
                  <p className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-brand-red">{t(labelKey)}</p>
                  <ul className="space-y-2">
                    {items.slice(0, 8).map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className="w-full rounded-xl border border-brand-charcoal/10 bg-white px-4 py-3 text-center text-sm transition hover:border-brand-red/40 dark:border-white/10 dark:bg-surface-dark"
                          onClick={() => {
                            setSearchOpen(false);
                            navigate(item.href);
                          }}
                        >
                          <span className="block font-semibold text-brand-charcoal dark:text-white">{item.title}</span>
                          {item.subtitle && (
                            <span className="mt-1 block text-xs text-brand-charcoal/60 dark:text-white/60">{item.subtitle}</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      <div
        className={cn(
          'fixed inset-0 z-[60] bg-black/40 transition-opacity lg:hidden',
          drawer ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!drawer}
        onClick={() => setDrawer(false)}
      />
      <aside
        className={cn(
          'fixed right-0 top-0 z-[70] flex h-full w-[min(100%,360px)] flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-surface-card lg:hidden',
          drawer ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-brand-charcoal/10 p-4 dark:border-white/10">
          <img
            src={brand.logoHorizontal}
            alt="PERMIAS Nasional"
            className="h-8 w-auto max-w-[200px] object-contain"
            width={200}
            height={44}
            decoding="async"
          />
          <button
            type="button"
            className="rounded-full p-2"
            aria-label={t('nav.closeMenu')}
            onClick={() => setDrawer(false)}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 text-center" aria-label="Mobile primary">
          <div>
            <NavLink
              to="/"
              end
              onClick={() => setDrawer(false)}
              className={({ isActive }) =>
                cn(
                  'block rounded-xl px-4 py-3 text-base font-semibold',
                  isActive ? 'bg-brand-red/10 text-brand-red' : 'text-brand-charcoal dark:text-white',
                )
              }
            >
              {t('nav.home')}
            </NavLink>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-red">{t('nav.about')}</p>
            <ul className="mt-2 space-y-1">
              {navAboutLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-red/10 hover:text-brand-red dark:text-white"
                    onClick={() => setDrawer(false)}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-red">{t('nav.resources')}</p>
            <ul className="mt-2 space-y-1">
              {navResourceLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-red/10 hover:text-brand-red dark:text-white"
                    onClick={() => setDrawer(false)}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-1 border-t border-brand-charcoal/10 pt-4 dark:border-white/10">
            <NavLink
              to="/events"
              onClick={() => setDrawer(false)}
              className={({ isActive }) =>
                cn(
                  'block rounded-xl px-4 py-3 text-base font-semibold',
                  isActive ? 'bg-brand-red/10 text-brand-red' : 'text-brand-charcoal dark:text-white',
                )
              }
            >
              {t('nav.events')}
            </NavLink>
            <NavLink
              to="/chapters"
              onClick={() => setDrawer(false)}
              className={({ isActive }) =>
                cn(
                  'block rounded-xl px-4 py-3 text-base font-semibold',
                  isActive ? 'bg-brand-red/10 text-brand-red' : 'text-brand-charcoal dark:text-white',
                )
              }
            >
              {t('nav.chapters')}
            </NavLink>
            <NavLink
              to="/team"
              onClick={() => setDrawer(false)}
              className={({ isActive }) =>
                cn(
                  'block rounded-xl px-4 py-3 text-base font-semibold',
                  isActive ? 'bg-brand-red/10 text-brand-red' : 'text-brand-charcoal dark:text-white',
                )
              }
            >
              {t('nav.team')}
            </NavLink>
            <NavLink
              to="/partners"
              onClick={() => setDrawer(false)}
              className={({ isActive }) =>
                cn(
                  'block rounded-xl px-4 py-3 text-base font-semibold',
                  isActive ? 'bg-brand-red/10 text-brand-red' : 'text-brand-charcoal dark:text-white',
                )
              }
            >
              {t('nav.partners')}
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setDrawer(false)}
              className={({ isActive }) =>
                cn(
                  'block rounded-xl px-4 py-3 text-base font-semibold',
                  isActive ? 'bg-brand-red/10 text-brand-red' : 'text-brand-charcoal dark:text-white',
                )
              }
            >
              {t('nav.contact')}
            </NavLink>
          </div>
        </nav>
      </aside>
    </>
  );
}

import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useUi } from '../../context/UiContext.jsx';
import { brand } from '../../data/siteMedia.js';
import { cn } from '../../utils/cn.js';
import { IconMoon, IconSearch, IconSun } from '../ui/Icons.jsx';
import { SegmentedToggle } from './MoreSheet.jsx';

const LINKS = [
  { to: '/', key: 'dock.home', end: true },
  { to: '/chapters', key: 'dock.chapters' },
  { to: '/events', key: 'dock.events' },
  { to: '/resources', key: 'dock.resources' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact.short' },
];

/**
 * Institutional top bar: solid white (navy in dark mode), logo, clear primary links, search, EN/ID, theme, register.
 * Over the home slideshow it starts transparent with white text, and turns solid after a short scroll.
 */
export function TopBar() {
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { openSearch } = useUi();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const overHero = pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[55] transition-[background-color,box-shadow,color] duration-300',
        overHero
          ? 'bg-gradient-to-b from-black/45 to-transparent text-white'
          : 'bg-white/95 text-ink shadow-[0_1px_0_rgb(var(--border)),0_8px_24px_-18px_rgba(19,35,63,.5)] backdrop-blur-md dark:bg-[#0A1220]/95',
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-[72px]">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label={t('topbar.homeLabel')}>
          <span className={cn('flex h-11 items-center rounded-[12px] px-2.5', overHero ? 'bg-white' : 'bg-white dark:bg-white')}>
            <img src={brand.logoHorizontal} alt="" className="h-7 w-auto" width="112" height="28" />
          </span>
        </Link>

        <nav aria-label={t('topbar.primary')} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    cn(
                      'relative flex h-11 items-center rounded-[10px] px-3.5 text-[15px] font-semibold transition-colors',
                      overHero ? 'text-white/90 hover:text-white' : 'text-ink/75 hover:text-ink',
                      isActive && (overHero ? 'text-white' : 'text-merah'),
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {t(l.key)}
                      {isActive && <span className={cn('absolute inset-x-3.5 bottom-1.5 h-[2px] rounded-full', overHero ? 'bg-white' : 'bg-merah')} aria-hidden="true" />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => openSearch()}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-[12px] transition-colors xl:w-auto xl:gap-2 xl:px-3',
              overHero ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-ink/[0.05] text-ink hover:bg-ink/10',
            )}
            aria-label={t('nav.search')}
          >
            <IconSearch className="h-[18px] w-[18px]" />
            <span className="hidden text-sm font-medium xl:inline">{t('dock.search')}</span>
            <kbd className={cn('hidden rounded px-1.5 py-0.5 text-[11px] font-semibold xl:inline', overHero ? 'bg-white/20' : 'bg-ink/10 text-ink/60')}>⌘K</kbd>
          </button>
          <SegmentedToggle
            className={overHero ? '!bg-white/15 [&_[aria-checked=false]]:!text-white/85' : ''}
            label={t('nav.lang')}
            value={lang}
            onChange={setLang}
            options={[
              { value: 'id', label: 'ID' },
              { value: 'en', label: 'EN' },
            ]}
          />
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              'hidden h-11 w-11 items-center justify-center rounded-[12px] transition-colors sm:flex',
              overHero ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-ink/[0.05] text-ink hover:bg-ink/10',
            )}
            aria-label={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
          >
            {theme === 'dark' ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
          </button>
          <Link
            to="/chapters/register"
            className="hidden h-11 items-center rounded-[12px] bg-merah px-4 text-sm font-semibold text-white transition-[transform,background-color] duration-150 hover:bg-[#a90d26] active:scale-[0.97] md:flex"
          >
            {t('chapters.register')}
          </Link>
        </div>
      </div>
    </header>
  );
}

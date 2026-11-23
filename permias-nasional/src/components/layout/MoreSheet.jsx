import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useUi } from '../../context/UiContext.jsx';
import { navResourceLinks } from '../../data/quickAccess.js';
import { Sheet } from '../ui/Sheet.jsx';
import {
  IconBook,
  IconCalendar,
  IconChat,
  IconClock,
  IconHandshake,
  IconHome,
  IconInfo,
  IconMail,
  IconMap,
  IconMoon,
  IconPlus,
  IconSun,
  IconUsers,
} from '../ui/Icons.jsx';
import { cn } from '../../utils/cn.js';

const PRIMARY = [
  { to: '/', key: 'dock.home', Icon: IconHome },
  { to: '/chapters', key: 'dock.chapters', Icon: IconMap },
  { to: '/events', key: 'dock.events', Icon: IconCalendar },
  { to: '/resources', key: 'dock.resources', Icon: IconBook },
  { to: '/about', key: 'nav.about', Icon: IconInfo },
  { to: '/about/sejarah', key: 'nav.dd.sejarah', Icon: IconClock },
  { to: '/team', key: 'nav.team', Icon: IconUsers },
  { to: '/partners', key: 'nav.partners', Icon: IconHandshake },
  { to: '/contact', key: 'nav.contact', Icon: IconMail },
];

export function SegmentedToggle({ label, value, options, onChange, className }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex rounded-full bg-ink/[0.07] p-1 dark:bg-white/10', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'flex min-h-[36px] min-w-[44px] items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-[background-color,color] duration-150',
            value === o.value ? 'bg-white text-ink shadow-[0_2px_8px_-2px_rgba(15,27,45,.3)] dark:bg-white/20' : 'text-ink/70 hover:text-ink',
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function MoreSheet() {
  const { t, lang, setLang } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { overlay, closeOverlay, openChat } = useUi();

  return (
    <Sheet open={overlay === 'more'} onClose={closeOverlay} labelledBy="more-title" variant="dock" panelClassName="max-w-[560px]">
      <div className="max-h-[min(72vh,640px)] overflow-y-auto p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 id="more-title" className="text-xl">
            {t('more.title')}
          </h2>
          <div className="flex items-center gap-2">
            <SegmentedToggle
              label={t('nav.lang')}
              value={lang}
              onChange={setLang}
              options={[
                { value: 'en', label: 'EN' },
                { value: 'id', label: 'ID' },
              ]}
            />
            <SegmentedToggle
              label={t('nav.theme')}
              value={theme}
              onChange={setTheme}
              options={[
                { value: 'light', label: <span className="sr-only">{t('theme.light')}</span>, icon: <IconSun className="h-4 w-4" /> },
                { value: 'dark', label: <span className="sr-only">{t('theme.dark')}</span>, icon: <IconMoon className="h-4 w-4" /> },
              ]}
            />
          </div>
        </div>

        <nav aria-label={t('more.title')} className="mt-5 grid grid-cols-3 gap-2">
          {PRIMARY.map(({ to, key, Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={closeOverlay}
              className="flex min-h-[84px] flex-col items-start justify-between rounded-[20px] bg-white/70 p-3 text-sm font-semibold text-ink transition-[background-color,transform] duration-150 hover:bg-white active:scale-[0.97] dark:bg-white/[0.06] dark:hover:bg-white/10"
            >
              <Icon className="h-5 w-5 text-merah" />
              <span className="leading-tight">{t(key)}</span>
            </Link>
          ))}
        </nav>

        <h3 className="font-sans mt-6 text-sm font-semibold text-muted-foreground" style={{ fontFamily: 'inherit', letterSpacing: 0 }}>
          {t('more.guides')}
        </h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {navResourceLinks.map((l) => (
            <li key={l.to}>
              <Link to={l.to} onClick={closeOverlay} className="chip">
                {t(l.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Link
            to="/chapters/register"
            onClick={closeOverlay}
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-control bg-ink px-4 text-[15px] font-semibold text-mist transition-transform duration-150 active:scale-[0.97]"
          >
            <IconPlus className="h-5 w-5" />
            {t('chapters.register')}
          </Link>
          <button
            type="button"
            onClick={openChat}
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-control border border-ink/15 px-4 text-[15px] font-semibold text-ink transition-transform duration-150 active:scale-[0.97]"
          >
            <IconChat className="h-5 w-5" />
            {t('chat.open')}
          </button>
        </div>
      </div>
    </Sheet>
  );
}

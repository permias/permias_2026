import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useUi } from '../../context/UiContext.jsx';
import { motionTokens, prefersReducedMotion, springs } from '../../lib/motion.js';
import { cn } from '../../utils/cn.js';
import { IconBook, IconCalendar, IconGrid, IconHome, IconInfo, IconMap, IconSearch } from '../ui/Icons.jsx';

const ROUTES = [
  { id: 'home', to: '/', key: 'dock.home', Icon: IconHome, match: (p) => p === '/' },
  { id: 'chapters', to: '/chapters', key: 'dock.chapters', Icon: IconMap, match: (p) => p.startsWith('/chapters') || p === '/about/chapters' },
  { id: 'events', to: '/events', key: 'dock.events', Icon: IconCalendar, match: (p) => p.startsWith('/events') },
  { id: 'resources', to: '/resources', key: 'dock.resources', Icon: IconBook, match: (p) => p.startsWith('/resources'), wide: true },
  { id: 'about', to: '/about', key: 'dock.about', Icon: IconInfo, match: (p) => p === '/about' || p === '/about/sejarah' || p.includes('team') || p === '/partners', wide: true },
];

/** One dock item with macOS-style magnification driven by the pointer's x position. */
function DockItem({ mouseX, active, label, Icon, as: As = 'button', className, accent, ...rest }) {
  const ref = useRef(null);
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r || x === Infinity) return 999;
    return x - (r.left + r.width / 2);
  });
  const scaleRaw = useTransform(distance, [-140, 0, 140], [1, 1.16, 1]);
  const scale = useSpring(scaleRaw, springs.snappy);
  const yRaw = useTransform(distance, [-140, 0, 140], [0, -5, 0]);
  const y = useSpring(yRaw, springs.snappy);

  return (
    <As
      ref={ref}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex h-[52px] min-w-[56px] flex-col items-center justify-center rounded-[20px] px-2.5 text-[11px] font-semibold outline-offset-2 sm:min-w-[64px]',
        accent ? 'text-white' : active ? 'text-ink' : 'text-ink/70 hover:text-ink',
        className,
      )}
      {...rest}
    >
      {active && !accent && (
        <motion.span
          layoutId="dock-lens"
          className="absolute inset-0 rounded-[20px] bg-white shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_6px_16px_-6px_rgba(15,27,45,.35)] dark:bg-white/15 dark:shadow-[0_1px_0_rgba(255,255,255,.18)_inset]"
          transition={springs.snappy}
          aria-hidden="true"
        />
      )}
      {accent && <span className="absolute inset-1 rounded-[17px] bg-merah shadow-[0_8px_20px_-8px_rgb(var(--merah)/0.8),inset_0_1px_0_rgba(255,255,255,.35)]" aria-hidden="true" />}
      <motion.span className="relative flex flex-col items-center gap-0.5" style={{ scale, y }}>
        <Icon className="h-[22px] w-[22px]" strokeWidth={active || accent ? 2.1 : 1.8} />
        <span className="leading-none">{label}</span>
      </motion.span>
    </As>
  );
}

export function Dock() {
  const { t } = useLanguage();
  const { openSearch, openMore, overlay } = useUi();
  const { pathname } = useLocation();
  const mouseX = useMotionValue(Infinity);
  const [compact, setCompact] = useState(false);

  // Scrolling down tucks the dock slightly; scrolling up restores it.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setCompact(y > last && y > 240);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion()) return;
    mouseX.set(e.clientX);
  };

  const routes = ROUTES;
  const activeId = routes.find((r) => r.match(pathname))?.id;

  return (
    <motion.nav
      aria-label={t('dock.label')}
      className="pointer-events-none fixed inset-x-0 bottom-[max(14px,env(safe-area-inset-bottom))] z-[60] flex justify-center px-3"
      initial={{ y: motionTokens.distance.xl, opacity: 0 }}
      animate={{ y: compact && !overlay ? motionTokens.distance.sm : 0, opacity: 1, scale: compact && !overlay ? motionTokens.scale.subtle : 1 }}
      transition={springs.snappy}
    >
      <div
        className="glass sheen pointer-events-auto flex items-center gap-0.5 rounded-[26px] p-1.5"
        onPointerMove={(e) => {
          onMove(e);
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
          e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
        }}
        onPointerLeave={() => mouseX.set(Infinity)}
      >
        {routes.slice(0, 2).map((r) => (
          <DockItem key={r.id} as={Link} to={r.to} mouseX={mouseX} active={activeId === r.id} label={t(r.key)} Icon={r.Icon} />
        ))}
        <DockItem
          type="button"
          mouseX={mouseX}
          accent
          label={t('dock.search')}
          Icon={IconSearch}
          aria-haspopup="dialog"
          aria-expanded={overlay === 'search'}
          onClick={() => openSearch()}
        />
        {routes.slice(2).map((r) => (
          <DockItem
            key={r.id}
            as={Link}
            to={r.to}
            mouseX={mouseX}
            active={activeId === r.id}
            label={t(r.key)}
            Icon={r.Icon}
            className={r.wide ? 'hidden md:flex' : undefined}
          />
        ))}
        <span className="mx-1 hidden h-8 w-px bg-ink/15 md:block" aria-hidden="true" />
        <DockItem
          type="button"
          mouseX={mouseX}
          active={overlay === 'more'}
          label={t('dock.more')}
          Icon={IconGrid}
          aria-haspopup="dialog"
          aria-expanded={overlay === 'more'}
          onClick={openMore}
        />
      </div>
    </motion.nav>
  );
}

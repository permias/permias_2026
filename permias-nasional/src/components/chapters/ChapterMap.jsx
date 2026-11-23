import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import usaMap from '@svg-maps/usa';
import { svgPathBbox } from 'svg-path-bbox';
import { chapters, chaptersByStateId } from '../../data/chapters.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { motionTokens, springs } from '../../lib/motion.js';
import { cn } from '../../utils/cn.js';
import { chapterMedia, placePhoto } from '../../lib/chapterInfo.js';
import { ChapterLogo } from './ChapterLogo.jsx';

const BASE = usaMap.viewBox.split(' ').map(Number); // [x, y, w, h]
const ASPECT = BASE[2] / BASE[3];
const BBOX = Object.fromEntries(usaMap.locations.map((l) => [l.id, svgPathBbox(l.path)]));
const BY_STATE = chaptersByStateId();
const PINNED = chapters.filter((c) => c.mapX != null);
const MIN_X = Math.min(...PINNED.map((c) => c.mapX));
const SPAN_X = Math.max(...PINNED.map((c) => c.mapX)) - MIN_X;

/** viewBox that frames a state (padded, base aspect ratio, never zooms past ~8x). */
function stateViewBox(stateId) {
  const b = BBOX[stateId];
  if (!b) return BASE;
  let [x0, y0, x1, y1] = b;
  let w = Math.max(x1 - x0, 110);
  let h = Math.max(y1 - y0, 110 / ASPECT);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  w *= 1.5;
  h *= 1.5;
  if (w / h > ASPECT) h = w / ASPECT;
  else w = h * ASPECT;
  return [cx - w / 2, cy - h / 2, w, h];
}

/** viewBox that frames a set of chapters (search results, one selected chapter). */
function pointsViewBox(list, minW = 210) {
  const pts = list.filter((c) => c.mapX != null);
  if (!pts.length) return null;
  const xs = pts.map((c) => c.mapX);
  const ys = pts.map((c) => c.mapY);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  let w = Math.max((Math.max(...xs) - Math.min(...xs)) * 1.4, minW);
  let h = Math.max((Math.max(...ys) - Math.min(...ys)) * 1.4, minW / ASPECT);
  if (w / h > ASPECT) h = w / ASPECT;
  else w = h * ASPECT;
  if (w >= BASE[2]) return BASE;
  return [cx - w / 2, cy - h / 2, w, h];
}

/** Hover / tap card: the chapter's own photo when the media collector found one, else its campus or city photo. */
function PinCard({ items }) {
  const { t } = useLanguage();
  if (items.length > 1) {
    return (
      <div className="w-[260px] p-3">
        <p className="px-1 text-sm font-bold leading-tight text-ink">{t('map.clusterTitle', { n: items.length })}</p>
        <ul className="mt-2 space-y-1.5">
          {items.slice(0, 4).map((c) => (
            <li key={c.id} className="flex items-center gap-2.5">
              <ChapterLogo c={c} size={28} />
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold leading-tight text-ink">{c.chapterName}</span>
                <span className="block truncate text-xs text-muted-foreground">{c.university}</span>
              </span>
            </li>
          ))}
        </ul>
        {items.length > 4 && <p className="mt-1.5 px-1 text-xs text-muted-foreground">+{items.length - 4}</p>}
      </div>
    );
  }
  const c = items[0];
  const own = chapterMedia(c).photos[0];
  const img = own ? own.src : placePhoto(c).small;
  return (
    <div className="w-[248px] overflow-hidden">
      <div className="relative h-[108px] bg-[#0A1220]">
        {img && <img src={img} alt="" width="248" height="108" className="h-full w-full object-cover" />}
        <span className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" aria-hidden="true" />
        <span className="absolute -bottom-5 left-3 rounded-full ring-[3px] ring-white dark:ring-[#16223A]">
          <ChapterLogo c={c} size={44} ring={false} />
        </span>
      </div>
      <div className="px-3 pb-3 pt-7">
        <p className="text-[16px] font-bold leading-tight text-ink">{c.chapterName}</p>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
          {c.universityFull || c.university}, {c.city}
        </p>
      </div>
    </div>
  );
}

/** Greedy clustering in map units; `d` shrinks as you zoom in. */
function cluster(list, d) {
  const out = [];
  for (const c of list) {
    const hit = out.find((g) => Math.hypot(g.x - c.mapX, g.y - c.mapY) < d);
    if (hit) {
      hit.items.push(c);
      hit.x = (hit.x * (hit.items.length - 1) + c.mapX) / hit.items.length;
      hit.y = (hit.y * (hit.items.length - 1) + c.mapY) / hit.items.length;
    } else out.push({ id: c.id, x: c.mapX, y: c.mapY, items: [c] });
  }
  return out;
}

export function ChapterMap({
  selectedState = '',
  selectedChapter = '',
  focus, // chapters to frame (search results); wins over selectedState
  highlight, // Set of chapter ids, or undefined = all
  userPoint, // { mapX, mapY } | null
  onSelectState,
  onSelectCluster, // (chapters[]) => void
  zoom = true,
  reveal = true,
  className,
  label,
}) {
  const { t } = useLanguage();
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { once: true, margin: '-80px' });
  const visible = useInView(wrapRef, { margin: '80px' }); // ambient pin pulse pauses off-screen
  const [hover, setHover] = useState(null); // { x, y, items }
  const [hoverState, setHoverState] = useState(null);

  const selChapter = selectedChapter ? PINNED.find((c) => c.id === selectedChapter) : null;
  const focusKey = focus ? focus.map((c) => c.id).join(',') : '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const focusVb = useMemo(() => (focus && focus.length ? pointsViewBox(focus) : null), [focusKey]);
  const vb = !zoom ? BASE : focusVb || (selectedState ? stateViewBox(selectedState) : BASE);
  const k = BASE[2] / vb[2];
  const r = 7 / Math.pow(k, 0.8);
  const groups = useMemo(() => cluster(PINNED, 15 / k), [k]);
  const shown = !reveal || inView;
  // the west-to-east sweep plays once; later re-clusters (zoom) appear without delay
  const [settled, setSettled] = useState(!reveal);
  useEffect(() => {
    if (!inView || settled) return undefined;
    const id = setTimeout(() => setSettled(true), (motionTokens.duration.normal + motionTokens.duration.crawl * 1.6) * 1000);
    return () => clearTimeout(id);
  }, [inView, settled]);

  // keep the card inside the map: flip below pins near the top, shift sideways near the edges
  const tipPlace = (x, y) => {
    const fx = (x - vb[0]) / vb[2];
    const fy = (y - vb[1]) / vb[3];
    return cn(fy < 0.42 ? 'top-[14px]' : 'bottom-[14px]', fx < 0.22 ? '-translate-x-[12%]' : fx > 0.78 ? '-translate-x-[88%]' : '-translate-x-1/2');
  };
  const pct = (x, y) => ({ left: `${((x - vb[0]) / vb[2]) * 100}%`, top: `${((y - vb[1]) / vb[3]) * 100}%` });

  return (
    <div ref={wrapRef} className={cn('relative select-none', className)} onPointerLeave={() => setHover(null)} data-offscreen={visible ? undefined : true}>
      <motion.svg
        viewBox={BASE.join(' ')}
        animate={{ viewBox: vb.join(' ') }}
        transition={{ duration: motionTokens.duration.crawl * 0.9, ease: motionTokens.easing.smooth }}
        className="block h-auto w-full"
        role="group"
        aria-label={label || t('map.label')}
      >
        {usaMap.locations.map((loc) => {
          const n = BY_STATE[loc.id]?.length || 0;
          const b = BBOX[loc.id];
          const tiny = b && (b[2] - b[0]) * (BASE[2] / vb[2]) < 16 && (b[3] - b[1]) * (BASE[2] / vb[2]) < 16;
          const pick = n && onSelectState && !tiny;
          const active = selectedState === loc.id;
          const hov = hoverState === loc.id;
          return (
            <path
              key={loc.id}
              d={loc.path}
              vectorEffect="non-scaling-stroke"
              strokeWidth={active ? 2 : 1}
              tabIndex={pick ? 0 : -1}
              role={pick ? 'button' : undefined}
              aria-label={n ? t('map.stateLabel', { state: loc.name, n }) : undefined}
              aria-hidden={n ? undefined : true}
              aria-pressed={pick ? active : undefined}
              className={cn(
                'outline-none transition-[fill,stroke] duration-200',
                n ? 'cursor-pointer' : '',
                active ? 'fill-merah/15 stroke-merah' : hov ? 'fill-land-on stroke-white dark:stroke-[#0A1220]' : n ? 'fill-land-on/80 stroke-white dark:stroke-[#0A1220]' : 'fill-land stroke-white dark:stroke-[#0A1220]',
                'focus-visible:stroke-merah focus-visible:[stroke-width:3px]',
              )}
              onPointerEnter={() => n && setHoverState(loc.id)}
              onPointerLeave={() => setHoverState(null)}
              onClick={() => n && onSelectState?.(active ? '' : loc.id)}
              onKeyDown={(e) => {
                if (n && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onSelectState?.(active ? '' : loc.id);
                }
              }}
            >
              <title>{n ? t('map.stateLabel', { state: loc.name, n }) : loc.name}</title>
            </path>
          );
        })}

        {groups.map((g) => {
          const lit = !highlight || g.items.some((c) => highlight.has(c.id));
          const sel = g.items.some((c) => c.id === selectedChapter);
          const count = g.items.length;
          const delay = reveal && !settled ? motionTokens.duration.normal + ((g.x - MIN_X) / SPAN_X) * motionTokens.duration.crawl * 1.3 : 0;
          const rr = count > 1 ? r * 1.35 : r;
          return (
            <motion.g
              key={g.id + count}
              initial={reveal ? { opacity: 0, scale: 0.2 } : false}
              animate={shown ? { opacity: lit ? 1 : 0.22, scale: 1 } : { opacity: 0, scale: 0.2 }}
              transition={{ ...springs.snappy, delay: shown && reveal ? delay : 0 }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              className="cursor-pointer"
              onPointerEnter={() => setHover(g)}
              onPointerLeave={() => setHover(null)}
              onClick={() => onSelectCluster?.(g.items)}
            >
              {settled && lit && !sel && (
                <circle
                  cx={g.x}
                  cy={g.y}
                  r={rr}
                  className="pin-pulse pointer-events-none fill-merah/45"
                  style={{ animationDelay: `${((g.x - MIN_X) / SPAN_X) * 2.8}s` }}
                />
              )}
              {sel && <circle cx={g.x} cy={g.y} r={rr * 2} className="fill-merah/20" />}
              <circle cx={g.x} cy={g.y} r={rr} className="fill-merah stroke-white dark:stroke-[#0A1220]" strokeWidth={rr * 0.36} />
              {count > 1 && (
                <text
                  x={g.x}
                  y={g.y}
                  dy="0.35em"
                  textAnchor="middle"
                  className="pointer-events-none fill-white font-sans font-bold"
                  style={{ fontSize: rr * 1.15 }}
                >
                  {count}
                </text>
              )}
            </motion.g>
          );
        })}

        {userPoint && (
          <g>
            <circle cx={userPoint.mapX} cy={userPoint.mapY} r={r * 1.9} className="fill-amber-400/25" />
            <circle cx={userPoint.mapX} cy={userPoint.mapY} r={r * 0.95} className="fill-amber-400 stroke-white" strokeWidth={r * 0.4} />
          </g>
        )}
      </motion.svg>

      <AnimatePresence>
        {(hover || selChapter) && (
          <motion.div
            key={hover ? hover.id + hover.items.length : selChapter.id}
            className={cn('pointer-events-none absolute z-10', !hover && 'hidden md:block')}
            style={hover ? pct(hover.x, hover.y) : pct(selChapter.mapX, selChapter.mapY)}
            initial={{ opacity: 0, scale: motionTokens.scale.press }}
            animate={{ opacity: 1, scale: 1, transition: { duration: motionTokens.duration.fast, ease: motionTokens.easing.smooth, delay: hover ? 0 : motionTokens.duration.crawl * 0.9 } }}
            exit={{ opacity: 0, transition: { duration: motionTokens.duration.instant } }}
            role="presentation"
          >
            <div
              className={cn(
                'absolute left-0 overflow-hidden rounded-[18px] border border-white/70 bg-white/[0.94] shadow-[0_24px_50px_-20px_rgba(15,27,45,.55)] backdrop-blur-xl dark:border-white/10 dark:bg-[#16223A]/[0.96]',
                tipPlace(hover ? hover.x : selChapter.mapX, hover ? hover.y : selChapter.mapY),
              )}
            >
              <PinCard items={hover ? hover.items : [selChapter]} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

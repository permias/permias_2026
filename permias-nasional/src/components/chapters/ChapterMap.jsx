import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import usaMap from '@svg-maps/usa';
import { svgPathBbox } from 'svg-path-bbox';
import { chapters, chaptersByStateId } from '../../data/chapters.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { motionTokens, springs } from '../../lib/motion.js';
import { cn } from '../../utils/cn.js';

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

  const vb = zoom && selectedState ? stateViewBox(selectedState) : BASE;
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
          const active = selectedState === loc.id;
          const hov = hoverState === loc.id;
          return (
            <path
              key={loc.id}
              d={loc.path}
              vectorEffect="non-scaling-stroke"
              strokeWidth={active ? 2 : 1}
              tabIndex={n && onSelectState ? 0 : -1}
              role={n && onSelectState ? 'button' : undefined}
              aria-label={n ? t('map.stateLabel', { state: loc.name, n }) : undefined}
              aria-hidden={n ? undefined : true}
              aria-pressed={n && onSelectState ? active : undefined}
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

      {hover && (
        <div
          className="glass pointer-events-none absolute z-10 w-max max-w-[240px] -translate-x-1/2 rounded-[16px] px-3 py-2"
          style={{ ...pct(hover.x, hover.y), transform: 'translate(-50%, calc(-100% - 14px))' }}
          role="presentation"
        >
          {hover.items.length === 1 ? (
            <>
              <p className="text-sm font-bold leading-tight text-ink">{hover.items[0].chapterName}</p>
              <p className="text-xs text-muted-foreground">
                {hover.items[0].university}, {hover.items[0].city}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold leading-tight text-ink">{t('map.clusterTitle', { n: hover.items.length })}</p>
              <p className="line-clamp-2 text-xs text-muted-foreground">{hover.items.map((c) => c.chapterName).join(', ')}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

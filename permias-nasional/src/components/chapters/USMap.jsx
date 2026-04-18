import usaMap from '@svg-maps/usa';
import { stateIdsWithChapters } from '../../data/chapters.js';
import { cn } from '../../utils/cn.js';

export function USMap({ selectedStateId, hoveredStateId, onHover, onSelect }) {
  return (
    <svg
      viewBox={usaMap.viewBox}
      className="h-auto w-full max-h-[560px] drop-shadow-sm"
      role="img"
      aria-label="Interactive map of the United States"
    >
      <title>United States</title>
      {usaMap.locations.map((loc) => {
        const has = stateIdsWithChapters.includes(loc.id);
        const active = selectedStateId === loc.id;
        const hover = hoveredStateId === loc.id;
        return (
          <path
            key={loc.id}
            id={`state-${loc.id}`}
            d={loc.path}
            tabIndex={has ? 0 : -1}
            aria-label={has ? `${loc.name}, ${loc.id.toUpperCase()} — chapters available` : `${loc.name} — no chapter data`}
            className={cn(
              'stroke-white/40 transition-[transform,fill] duration-150 ease-out dark:stroke-black/30',
              'origin-center [transform-box:fill-box]',
              has ? 'cursor-pointer' : 'cursor-default opacity-40',
              !has && 'pointer-events-none',
              !active && !hover && has && 'fill-neutral-200 dark:fill-neutral-700',
              hover && has && 'fill-brand-red',
              active && 'fill-brand-red',
            )}
            style={{
              transform: hover && has ? 'scale(1.02)' : 'scale(1)',
            }}
            onMouseEnter={() => has && onHover?.(loc.id)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => has && onSelect?.(loc.id)}
            onKeyDown={(e) => {
              if (!has) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.(loc.id);
              }
            }}
          />
        );
      })}
    </svg>
  );
}

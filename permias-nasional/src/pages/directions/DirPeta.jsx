import '@fontsource-variable/plus-jakarta-sans';
import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import usaMap from '@svg-maps/usa';
import { chapters, stateIdsWithChapters } from '../../data/chapters.js';
import { motionTokens, springs } from '../../lib/motion.js';
import { publicUrl } from '../../utils/site.js';

/* Direction 1: Peta (atlas). The chapter map is the hero; glass sits over the map only. */
const C = { ground: '#F4F6F9', ink: '#0F1B2D', red: '#CE1126', land: '#DFE5EC', landOn: '#C5CFDB', gold: '#F2B33D' };

export function DirPeta() {
  const [hover, setHover] = useState(null);
  const sorted = useMemo(() => [...chapters].filter((c) => c.mapX != null).sort((a, b) => a.mapX - b.mapX), []);
  const minX = sorted[0]?.mapX ?? 0;
  const span = (sorted.at(-1)?.mapX ?? 1) - minX;
  const states = new Set(chapters.map((c) => c.stateId)).size;
  const active = hover ? chapters.find((c) => c.id === hover) : null;

  return (
    <div style={{ background: C.ground, color: C.ink, fontFamily: '"Plus Jakarta Sans Variable", sans-serif' }} className="relative min-h-screen overflow-hidden">
      <header className="relative z-10 mx-auto flex max-w-[1320px] items-center justify-between px-5 py-5 md:px-10">
        <img src={publicUrl('/images/brand/logo-permias-horizontal.png')} alt="PERMIAS Nasional" className="h-9 w-auto" />
        <nav className="hidden items-center gap-8 text-[15px] font-medium md:flex" aria-label="Preview">
          <span>Chapters</span>
          <span>Events</span>
          <span>Resources</span>
          <span>About</span>
        </nav>
        <span className="rounded-full border border-black/10 px-3 py-1.5 text-sm font-semibold">EN / ID</span>
      </header>

      <section className="relative mx-auto grid max-w-[1320px] items-center gap-8 px-5 pb-16 pt-6 md:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:pt-14">
        <div className="relative z-10">
          <h1 style={{ fontFamily: 'inherit', color: 'inherit' }} className="text-balance text-[44px] font-extrabold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-[84px]">
            Find your people in {states - 1} states and DC.
          </h1>
          <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-[#3B4A5E] md:text-xl">
            PERMIAS connects Indonesian students at {chapters.length} campus and city chapters across the United States.
          </p>
          <label className="mt-8 flex max-w-md items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_12px_40px_-12px_rgba(15,27,45,.25)] backdrop-blur-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <span className="sr-only">Search chapters</span>
            <input className="w-full bg-transparent text-[17px] outline-none placeholder:text-[#5B6B80]" placeholder="Campus, city or state" />
          </label>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            {['Boston', 'Seattle', 'Los Angeles', 'Chicago'].map((x) => (
              <span key={x} className="rounded-full bg-white px-3 py-1.5 shadow-[0_1px_2px_rgba(15,27,45,.08)]">{x}</span>
            ))}
          </div>
        </div>

        <div className="relative">
          <svg viewBox={usaMap.viewBox} className="h-auto w-full" role="img" aria-label="Map of PERMIAS chapters">
            {usaMap.locations.map((l) => (
              <path key={l.id} d={l.path} fill={stateIdsWithChapters.includes(l.id) ? C.landOn : C.land} stroke="#fff" strokeWidth="1.2" />
            ))}
            {sorted.map((c) => (
              <motion.g
                key={c.id}
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...springs.snappy, delay: motionTokens.duration.normal + ((c.mapX - minX) / span) * motionTokens.duration.crawl * 1.4 }}
                style={{ transformOrigin: `${c.mapX}px ${c.mapY}px` }}
                onMouseEnter={() => setHover(c.id)}
                onMouseLeave={() => setHover(null)}
              >
                <circle cx={c.mapX} cy={c.mapY} r="7" fill={C.red} stroke="#fff" strokeWidth="2.5" />
              </motion.g>
            ))}
          </svg>
          <motion.div
            className="pointer-events-none absolute bottom-[8%] right-[4%] w-[260px] rounded-[22px] border border-white/70 bg-white/55 p-4 shadow-[0_1px_0_rgba(255,255,255,.9)_inset,0_20px_50px_-20px_rgba(15,27,45,.35)] backdrop-blur-xl"
            initial={{ opacity: 0, y: motionTokens.distance.md }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.gentle, delay: motionTokens.duration.crawl * 2 }}
          >
            <p className="text-[13px] font-semibold text-[#5B6B80]">{active ? `${active.city}, ${active.state}` : 'Hover a pin'}</p>
            <p className="mt-1 text-lg font-bold leading-tight">{active ? active.chapterName : `${chapters.length} chapters`}</p>
            <p className="mt-1 text-sm text-[#3B4A5E]">{active ? active.university : 'From Bellingham to Gainesville'}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

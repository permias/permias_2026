import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/plus-jakarta-sans';
import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { chapters } from '../../data/chapters.js';
import { motionTokens, springs } from '../../lib/motion.js';
import { publicUrl } from '../../utils/site.js';

/* Direction 2: Kaca (glass). Full-bleed campus photography, liquid-glass panes with a pointer-following sheen. */
export function DirKaca() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const zoom = useTransform(scrollYProgress, [0, 1], [1.08, 1.32]);
  const mx = useMotionValue(50);
  const my = useMotionValue(30);
  const sx = useSpring(mx, springs.gentle);
  const sy = useSpring(my, springs.gentle);
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${sx}% ${sy}%, rgba(255,255,255,.42), rgba(255,255,255,0) 60%)`;

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const glass =
    'border border-white/35 bg-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,.55),inset_0_-1px_0_rgba(255,255,255,.12),0_30px_80px_-30px_rgba(0,0,0,.6)] backdrop-blur-2xl backdrop-saturate-150';

  return (
    <div ref={ref} className="relative h-[140vh] bg-[#0B1626] text-white" style={{ fontFamily: '"Plus Jakarta Sans Variable", sans-serif' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: motionTokens.duration.crawl * 2.4, ease: motionTokens.easing.smooth }}
        >
          <motion.img
            src={publicUrl('/images/photos/berkeley-campanile-sunset-1600.webp')}
            alt="Sather Tower at UC Berkeley at sunset"
            className="h-full w-full object-cover"
            style={{ scale: zoom }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,22,38,.15)_0%,rgba(11,22,38,.05)_40%,rgba(11,22,38,.7)_100%)]" />

        <header className="relative z-10 mx-auto flex max-w-[1320px] items-center justify-between px-5 py-5 md:px-10">
          <span className={`rounded-full px-4 py-2 text-sm font-bold ${glass}`}>PERMIAS Nasional</span>
          <span className={`rounded-full px-3 py-2 text-sm font-semibold ${glass}`}>EN / ID</span>
        </header>

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto grid max-w-[1320px] gap-5 px-5 pb-28 md:px-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end lg:pb-32">
          <motion.div
            onPointerMove={onMove}
            className={`relative overflow-hidden rounded-[32px] p-7 md:p-10 ${glass}`}
            initial={{ opacity: 0, y: motionTokens.distance.xl }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.gentle, delay: motionTokens.duration.slow }}
          >
            <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: sheen }} />
            <h1
              className="relative text-balance text-[42px] font-bold leading-[0.95] tracking-[-0.035em] sm:text-6xl lg:text-[88px]"
              style={{ fontFamily: '"Bricolage Grotesque Variable", sans-serif', color: '#fff' }}
            >
              New campus, same family.
            </h1>
            <p className="relative mt-5 max-w-[42ch] text-lg leading-relaxed text-white/85">
              {chapters.length} PERMIAS chapters welcome Indonesian students from their first week in the US.
            </p>
            <div className="relative mt-7 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-5 py-3 text-[15px] font-bold text-[#0B1626]">Find a chapter</span>
              <span className={`rounded-full px-5 py-3 text-[15px] font-semibold ${glass}`}>See events</span>
            </div>
          </motion.div>

          <div className="hidden flex-col gap-3 lg:flex">
            {chapters.filter((c) => ['c-berkeleybisa', 'c-stanfordindonesia', 'c-permiassfba'].includes(c.id)).map((c, i) => (
              <motion.div
                key={c.id}
                className={`rounded-[22px] px-5 py-4 ${glass}`}
                initial={{ opacity: 0, x: motionTokens.distance.xl }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springs.gentle, delay: motionTokens.duration.slow * 2 + i * motionTokens.stagger.children }}
              >
                <p className="text-[13px] font-semibold text-white/70">{c.city}, {c.state}</p>
                <p className="text-lg font-bold">{c.chapterName}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <nav aria-label="Preview dock" className={`absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-[26px] p-1.5 ${glass}`}>
          {['Home', 'Map', 'Search', 'Events', 'More'].map((x, i) => (
            <span key={x} className={`rounded-[20px] px-4 py-2.5 text-[13px] font-semibold ${i === 0 ? 'bg-white text-[#0B1626]' : 'text-white/90'}`}>{x}</span>
          ))}
        </nav>
      </div>
    </div>
  );
}

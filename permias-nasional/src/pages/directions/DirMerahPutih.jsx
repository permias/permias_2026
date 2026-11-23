import '@fontsource-variable/archivo/wdth.css';
import { animate, motion, useMotionValue, useMotionTemplate } from 'motion/react';
import { useEffect } from 'react';
import { chapters } from '../../data/chapters.js';
import { motionTokens } from '../../lib/motion.js';
import { publicUrl } from '../../utils/site.js';

/* Direction 3: Merah Putih. The flag split is the layout; the wordmark stretches across it. */
const photos = [
  ['boston-skyline', 'Boston'],
  ['chicago-skyline', 'Chicago'],
  ['seattle-kerry-park', 'Seattle'],
  ['nyc-empire-state', 'New York'],
  ['la-griffith-night', 'Los Angeles'],
  ['pittsburgh-night', 'Pittsburgh'],
];

export function DirMerahPutih() {
  const wdth = useMotionValue(62);
  const settings = useMotionTemplate`"wdth" ${wdth}`;

  useEffect(() => {
    const controls = animate(wdth, 125, { duration: motionTokens.duration.crawl * 1.6, ease: motionTokens.easing.smooth, delay: motionTokens.duration.normal });
    return () => controls.stop();
  }, [wdth]);

  const word = (
    <motion.span
      className="block whitespace-nowrap text-center text-[15.5vw] font-black leading-[0.8] tracking-[-0.04em]"
      style={{ fontVariationSettings: settings, fontFamily: '"Archivo Variable", sans-serif' }}
    >
      PERMIAS
    </motion.span>
  );

  return (
    <div className="min-h-screen bg-white text-[#14161A]" style={{ fontFamily: '"Archivo Variable", sans-serif' }}>
      <section className="relative">
        <div className="bg-[#CE1126] px-5 pb-0 pt-5 text-white md:px-10">
          <header className="mx-auto flex max-w-[1320px] items-center justify-between text-sm font-semibold">
            <span>Persatuan Mahasiswa Indonesia di Amerika Serikat</span>
            <span className="hidden md:inline">EN / ID</span>
          </header>
          <div className="relative mt-[6vh] h-[calc(15.5vw*0.4)] overflow-hidden" aria-hidden>
            {word}
          </div>
        </div>
        <div className="relative h-[calc(15.5vw*0.4)] overflow-hidden px-5 text-[#CE1126] md:px-10" aria-hidden>
          <div className="-translate-y-1/2">{word}</div>
        </div>
        <h1 className="sr-only">PERMIAS Nasional</h1>
        <div className="mx-auto mt-8 grid max-w-[1320px] gap-6 px-5 md:grid-cols-2 md:px-10">
          <p className="text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-[40px]" style={{ fontVariationSettings: '"wdth" 88' }}>
            The Indonesian student association of the United States, with {chapters.length} chapters on campus and in your city.
          </p>
          <div className="flex items-end gap-3 md:justify-end">
            <span className="rounded-md bg-[#14161A] px-5 py-3 text-[15px] font-semibold text-white">Find your chapter</span>
            <span className="rounded-md border-2 border-[#14161A] px-5 py-3 text-[15px] font-semibold">Read the visa guide</span>
          </div>
        </div>
      </section>
      <div className="mt-12 flex gap-4 overflow-x-auto px-5 pb-10 md:px-10" style={{ scrollSnapType: 'x mandatory' }}>
        {photos.map(([slug, city], i) => (
          <motion.figure
            key={slug}
            className="relative h-[52vh] min-h-[320px] w-[72vw] shrink-0 overflow-hidden rounded-md md:w-[30vw]"
            style={{ scrollSnapAlign: 'start' }}
            initial={{ opacity: 0, x: motionTokens.distance.xl }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay: motionTokens.duration.crawl + i * motionTokens.stagger.children }}
          >
            <img src={publicUrl(`/images/photos/${slug}-800.webp`)} alt="" className="h-full w-full object-cover" />
            <figcaption className="absolute bottom-3 left-3 rounded bg-white px-2.5 py-1 text-sm font-semibold">{city}</figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}

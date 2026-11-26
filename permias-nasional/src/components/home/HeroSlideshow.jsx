import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { chapters, stateCount } from '../../data/chapters.js';
import { heroSlides } from '../../data/heroSlides.js';
import { photo } from '../../data/photos.js';
import { motionTokens, prefersReducedMotion } from '../../lib/motion.js';
import { IconArrowRight } from '../ui/Icons.jsx';

const SLIDE_MS = 6500;
const byId = Object.fromEntries(chapters.map((c) => [c.id, c]));

function PauseIcon({ paused }) {
  return paused ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l10-6.5-10-6.5Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <rect x="6.5" y="5" width="4" height="14" rx="1" />
      <rect x="13.5" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

/**
 * Opening slideshow: US landmarks and campuses alternating with Indonesian monuments.
 * Crossfade + slow zoom per slide; text enters left to right. Autoplay pauses on hover/focus,
 * has a visible pause button (WCAG 2.2.2) and never autoplays under reduced motion.
 */
export function HeroSlideshow() {
  const { t, pick } = useLanguage();
  const [i, setI] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [reduced, setReduced] = useState(false);
  const paused = userPaused || hovering || reduced;
  const n = heroSlides.length;
  const go = useCallback((k) => setI(((k % n) + n) % n), [n]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReduced(prefersReducedMotion()));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    const id = setTimeout(() => go(i + 1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [i, paused, go]);

  // preload the next slide so the crossfade never shows a blank frame
  useEffect(() => {
    const next = photo(heroSlides[(i + 1) % n].slug);
    const img = new Image();
    img.src = next.src;
  }, [i, n]);

  const slide = heroSlides[i];
  const p = photo(slide.slug);
  const near = (slide.chapters || []).map((id) => byId[id]).filter(Boolean);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t('hero.carouselLabel')}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-night"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      {/* photos */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.slug}
          className="absolute inset-0 -z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: motionTokens.duration.crawl * 1.1, ease: motionTokens.easing.sharp } }}
          exit={{ opacity: 0, transition: { duration: motionTokens.duration.crawl * 1.1 } }}
        >
          <motion.img
            src={p.src}
            srcSet={p.srcSet}
            sizes="100vw"
            width={p.w}
            height={p.h}
            alt={`${pick(slide.name)}, ${slide.place}`}
            className="photo-grade h-full w-full object-cover"
            initial={{ scale: 1.14, x: '-2%' }}
            animate={{ scale: 1.02, x: '0%' }}
            transition={{ duration: (SLIDE_MS / 1000) * 1.4, ease: motionTokens.easing.linear }}
            fetchPriority={i === 0 ? 'high' : undefined}
          />
        </motion.div>
      </AnimatePresence>

      {/* scrims: strong on the left where the text sits, and along the bottom for the caption */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(18,19,21,.86)_0%,rgba(18,19,21,.62)_38%,rgba(18,19,21,.12)_72%,rgba(18,19,21,0)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-[linear-gradient(0deg,rgba(18,19,21,.85),rgba(18,19,21,0))]" aria-hidden="true" />

      <div className="container-x flex flex-1 flex-col justify-end pb-[calc(var(--dock-h)+32px)] pt-24 md:pb-36 md:pt-28">
        <div className="max-w-[1000px]">
          <motion.p
            className="text-[15px] font-semibold text-white/80"
            initial={{ opacity: 0, x: -motionTokens.distance.xl }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay: motionTokens.duration.fast }}
          >
            {t('hero.welcome')}
          </motion.p>
          <h1 className="mt-4 text-white display-xl [font-size:clamp(2.4rem,1.4rem+4.6vw,5.6rem)] md:mt-5">
            {t('hero.title')
              .split('\n')
              .map((line, k) => (
                <motion.span
                  key={line}
                  className="block"
                  initial={{ x: -motionTokens.distance.xl * 1.5, clipPath: 'inset(0 100% 0 0)' }}
                  animate={{ x: 0, clipPath: 'inset(0 0% 0 0)' }}
                  transition={{ duration: motionTokens.duration.crawl, ease: motionTokens.easing.smooth, delay: motionTokens.duration.normal + k * 0.14 }}
                >
                  {line}
                </motion.span>
              ))}
          </h1>
          <motion.p
            className="mt-4 max-w-[54ch] text-[15px] leading-relaxed text-white/90 md:mt-6 md:text-[19px]"
            initial={{ opacity: 0, x: -motionTokens.distance.lg }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay: motionTokens.duration.crawl }}
          >
            {t('hero.sub', { n: chapters.length, s: stateCount })}
          </motion.p>
          <motion.div
            className="mt-6 flex flex-wrap gap-3 md:mt-8"
            initial={{ opacity: 0, x: -motionTokens.distance.lg }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay: motionTokens.duration.crawl + 0.15 }}
          >
            <a
              href="#cari-chapter"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-[12px] bg-accent px-5 text-[15px] font-semibold text-on-accent transition-[transform,background-color] duration-150 hover:bg-accent/90 active:scale-[0.97] md:min-h-[52px] md:px-6 md:text-base"
            >
              {t('hero.ctaFind')}
              <IconArrowRight className="h-5 w-5" />
            </a>
            <Link
              to="/about"
              className="inline-flex min-h-[48px] items-center rounded-[12px] border border-white/60 px-5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-white/10 active:scale-[0.97] md:min-h-[52px] md:px-6 md:text-base"
            >
              {t('hero.ctaAbout')}
            </Link>
          </motion.div>
        </div>

        {/* caption + controls; one thin line across the top fills over each slide */}
        <div className="relative mt-8 flex flex-col gap-3 pt-4 md:mt-12 md:flex-row md:items-end md:justify-between md:gap-4 md:pt-5">
          <span className="absolute inset-x-0 top-0 h-px bg-white/20" aria-hidden="true">
            <span
              key={`${i}-${paused}`}
              className="absolute inset-0 origin-left bg-white/80"
              style={{ animation: paused ? 'none' : `slideProgress ${SLIDE_MS}ms linear forwards`, transform: paused ? 'scaleX(0)' : undefined }}
            />
          </span>
          <div className="min-h-[64px]" aria-live={paused ? 'polite' : 'off'} aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: motionTokens.duration.exit } }}
                transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
              >
                <p className="text-[13px] font-semibold text-white/70">
                  {slide.country === 'id' ? 'Indonesia' : t('hero.usa')} / {slide.place}
                </p>
                <p className="mt-1 font-display text-2xl text-white md:text-[28px]">{pick(slide.name)}</p>
                {near.length > 0 && (
                  <p className="mt-1 text-sm text-white/75">
                    {t('hero.nearby')}{' '}
                    {near.map((c, k) => (
                      <span key={c.id}>
                        {k > 0 && ', '}
                        <Link to={`/chapters/${c.id.replace(/^c-/, '')}`} className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                          {c.chapterName}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2" role="group" aria-label={t('hero.slides')}>
            <p className="mr-2 text-sm font-semibold text-white/80 tabular" aria-hidden="true">
              {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
            </p>
            <button
              type="button"
              onClick={() => go(i - 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-[background-color,transform] duration-150 hover:bg-white/10 active:scale-95"
              aria-label={t('rail.prev')}
            >
              <IconArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(i + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-[background-color,transform] duration-150 hover:bg-white/10 active:scale-95"
              aria-label={t('rail.next')}
            >
              <IconArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setUserPaused((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-[background-color,transform] duration-150 hover:bg-white/10 active:scale-95"
              aria-label={paused ? t('hero.play') : t('hero.pause')}
              aria-pressed={userPaused}
            >
              <PauseIcon paused={paused} />
            </button>
            <a href={p.page} target="_blank" rel="noopener noreferrer" className="ml-2 hidden max-w-[220px] truncate text-[11px] text-white/60 hover:text-white xl:block">
              {t('photo.credit', { who: p.artist, lic: p.license })}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { chapters, stateCount } from '../../data/chapters.js';
import { heroSlides } from '../../data/heroSlides.js';
import { photo } from '../../data/photos.js';
import { motionTokens, prefersReducedMotion } from '../../lib/motion.js';
import { cn } from '../../utils/cn.js';
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
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#0B1424]"
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
            alt={`${pick(slide.name)}, ${slide.place}`}
            className="h-full w-full object-cover"
            initial={{ scale: 1.14, x: '-2%' }}
            animate={{ scale: 1.02, x: '0%' }}
            transition={{ duration: (SLIDE_MS / 1000) * 1.4, ease: motionTokens.easing.linear }}
            fetchPriority={i === 0 ? 'high' : undefined}
          />
        </motion.div>
      </AnimatePresence>

      {/* scrims: strong on the left where the text sits, and along the bottom for the caption */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,14,28,.86)_0%,rgba(8,14,28,.62)_38%,rgba(8,14,28,.12)_72%,rgba(8,14,28,0)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-[linear-gradient(0deg,rgba(8,14,28,.85),rgba(8,14,28,0))]" aria-hidden="true" />

      <div className="container-x flex flex-1 flex-col justify-end pb-[calc(var(--dock-h)+84px)] pt-28 md:pb-36">
        <div className="max-w-[1000px]">
          <motion.p
            className="flex items-center gap-3 text-[15px] font-semibold text-[#F2C46D]"
            initial={{ opacity: 0, x: -motionTokens.distance.xl }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay: motionTokens.duration.fast }}
          >
            <span className="h-px w-10 bg-[#F2C46D]" aria-hidden="true" />
            {t('hero.welcome')}
          </motion.p>
          <h1 className="mt-5 text-white display-xl [font-size:clamp(2.9rem,1.4rem+4.6vw,5.6rem)]">
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
            className="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-white/90 md:text-[19px]"
            initial={{ opacity: 0, x: -motionTokens.distance.lg }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay: motionTokens.duration.crawl }}
          >
            {t('hero.sub', { n: chapters.length, s: stateCount })}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, x: -motionTokens.distance.lg }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay: motionTokens.duration.crawl + 0.15 }}
          >
            <a
              href="#cari-chapter"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-[12px] bg-merah px-6 text-base font-semibold text-white shadow-[0_12px_30px_-12px_rgba(200,16,46,.9)] transition-[transform,background-color] duration-150 hover:bg-[#a90d26] active:scale-[0.97]"
            >
              {t('hero.ctaFind')}
              <IconArrowRight className="h-5 w-5" />
            </a>
            <Link
              to="/about"
              className="inline-flex min-h-[52px] items-center rounded-[12px] border border-white/60 px-6 text-base font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-white/10 active:scale-[0.97]"
            >
              {t('hero.ctaAbout')}
            </Link>
          </motion.div>
        </div>

        {/* caption + controls */}
        <div className="mt-12 flex flex-col gap-4">
          <div className="flex flex-col gap-4 border-t border-white/20 pt-5 md:flex-row md:items-end md:justify-between">
            <div className="min-h-[64px]" aria-live={paused ? 'polite' : 'off'} aria-atomic="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={slide.slug}
                  initial={{ opacity: 0, x: -motionTokens.distance.lg }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: motionTokens.distance.lg, transition: { duration: motionTokens.duration.exit } }}
                  transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
                >
                  <p className="flex items-center gap-2 text-[13px] font-semibold text-white/75">
                    <span className={cn('inline-block h-2.5 w-2.5 rounded-full', slide.country === 'id' ? 'bg-[#E8304A]' : 'bg-[#6FA8FF]')} aria-hidden="true" />
                    {slide.country === 'id' ? 'Indonesia' : t('hero.usa')}
                    <span aria-hidden="true">/</span>
                    <span>{slide.place}</span>
                  </p>
                  <p className="mt-1 font-display text-2xl text-white md:text-[28px]">{pick(slide.name)}</p>
                  {near.length > 0 && (
                    <p className="mt-1 text-sm text-white/75">
                      {t('hero.nearby')}{' '}
                      {near.map((c, k) => (
                        <span key={c.id}>
                          {k > 0 && ', '}
                          <Link to={`/chapters?state=${c.stateId}&chapter=${c.id}`} className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                            {c.chapterName}
                          </Link>
                        </span>
                      ))}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1" role="group" aria-label={t('hero.slides')}>
                {heroSlides.map((s, k) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => go(k)}
                    aria-label={t('hero.goTo', { n: k + 1, total: n, name: pick(s.name) })}
                    aria-current={k === i ? 'true' : undefined}
                    className="group flex h-8 items-center"
                  >
                    <span className={cn('relative block h-[3px] overflow-hidden rounded-full bg-white/30 transition-[width] duration-300', k === i ? 'w-10' : 'w-3 group-hover:bg-white/60')}>
                      {k === i && (
                        <span
                          key={`${i}-${paused}`}
                          className="absolute inset-0 origin-left rounded-full bg-white"
                          style={{ animation: paused ? 'none' : `slideProgress ${SLIDE_MS}ms linear forwards`, transform: paused ? 'scaleX(1)' : undefined }}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setUserPaused((v) => !v)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/15"
                aria-label={paused ? t('hero.play') : t('hero.pause')}
                aria-pressed={userPaused}
              >
                <PauseIcon paused={paused} />
              </button>
              <a href={p.page} target="_blank" rel="noopener noreferrer" className="hidden max-w-[220px] truncate text-[11px] text-white/60 hover:text-white xl:block">
                {t('photo.credit', { who: p.artist, lic: p.license })}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

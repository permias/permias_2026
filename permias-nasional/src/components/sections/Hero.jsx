import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Button } from '../ui/Button.jsx';
import { cn } from '../../utils/cn.js';
import { sectionImages } from '../../data/siteMedia.js';

const heroPlaceholders = [
  'https://placehold.co/640x400/CE1126/FFFFFF?text=Campus+life',
  'https://placehold.co/640x400/1A1A1A/FFFFFF?text=Community',
  'https://placehold.co/640x400/333333/FFFFFF?text=Leadership',
];

export function Hero() {
  const { t } = useLanguage();
  const title = t('home.hero.title');
  const words = useMemo(() => title.split(' '), [title]);
  const headlineDoneMs = words.length * 80;
  const subDelayMs = headlineDoneMs + 400;

  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden bg-brand-charcoal">
      {/* Animated flag-inspired layers (replaces GIF) */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -inset-[20%] origin-center animate-flag-wave bg-[#CE1126]"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 48%, 0 62%)',
          }}
          aria-hidden
        />
        <div
          className="absolute -inset-[20%] origin-center animate-flag-wave bg-white"
          style={{
            clipPath: 'polygon(0 58%, 100% 44%, 100% 100%, 0 100%)',
            animationDelay: '0.4s',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay dark:opacity-20"
          style={{ backgroundImage: `url(${sectionImages.borobudur})` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-black/40 mix-blend-multiply dark:from-black/70"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-30 mix-blend-soft-light dark:opacity-50"
          style={{
            backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(206,17,38,0.35) 100%)',
            backgroundSize: '200% 200%',
            animation: 'hero-shimmer 12s ease infinite',
          }}
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-content flex-col justify-center px-4 pb-24 pt-28 sm:px-6 lg:min-h-[88vh] lg:px-8 lg:pb-32 lg:pt-36">
        <div className="relative max-w-3xl space-y-4 text-white">
          <span
            className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-0 rounded-2xl bg-gradient-to-br from-[#CE1126]/35 via-white/15 to-transparent opacity-90 blur-2xl dark:from-[#CE1126]/25 dark:via-white/10"
            aria-hidden
          />
          <p className="relative z-10 text-sm font-bold uppercase tracking-[0.2em] text-white/80">{t('home.hero.orgline')}</p>
          <p className="relative z-10 font-display text-2xl font-extrabold leading-snug tracking-tight sm:text-3xl md:text-4xl">
            {t('home.hero.lead')}
          </p>
          <p className="relative z-10 text-base leading-relaxed text-white/90 sm:text-lg">{t('home.hero.mission')}</p>
        </div>

        <p
          className="mt-12 font-extrabold uppercase text-white [text-shadow:0_2px_32px_rgba(0,0,0,0.35)] lg:mt-14"
          style={{
            fontSize: 'clamp(2.25rem, calc(5.5vw + 1rem), 5.75rem)',
            lineHeight: 1.05,
            letterSpacing: '0.1em',
          }}
        >
          PERMIAS NASIONAL
        </p>
        <h1 className="mt-6 max-w-5xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl sm:mt-7 lg:text-7xl lg:mt-8 xl:text-8xl">
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className={cn('mr-[0.25em] inline-block opacity-0')}
              style={{
                animation: 'heroWord 0.55s ease-out forwards',
                animationDelay: `${i * 80}ms`,
              }}
            >
              {word}
            </span>
          ))}
        </h1>
        <p
          className="mt-8 max-w-3xl text-xl leading-relaxed text-white/90 opacity-0 sm:text-2xl md:text-3xl"
          style={{
            animation: 'heroSub 0.6s ease-out forwards',
            animationDelay: `${subDelayMs}ms`,
          }}
        >
          {t('home.hero.sub')}
        </p>

        <div
          className="mt-12 grid gap-4 opacity-0 sm:grid-cols-3 lg:mt-14"
          style={{ animation: 'heroSub 0.6s ease-out forwards', animationDelay: `${subDelayMs + 40}ms` }}
        >
          {heroPlaceholders.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="h-36 w-full rounded-2xl border border-white/20 object-cover shadow-lg sm:h-40 md:h-44"
              loading="lazy"
            />
          ))}
        </div>

        <div
          className="mt-10 flex flex-wrap gap-4 opacity-0 lg:mt-12"
          style={{ animation: 'heroSub 0.6s ease-out forwards', animationDelay: `${subDelayMs + 120}ms` }}
        >
          <Button
            as="a"
            href="https://groups.google.com/g/permias-nasional"
            target="_blank"
            rel="noopener noreferrer"
            className="!px-10 !py-4 !text-base md:!text-lg"
          >
            {t('home.hero.ctaMilis')}
          </Button>
          <Button
            as={Link}
            to="/chapters"
            variant="ghost"
            className="!border-white/40 !bg-white/10 !px-10 !py-4 !text-base !text-white hover:!bg-white/20 md:!text-lg"
          >
            {t('home.hero.cta2')}
          </Button>
        </div>
      </div>
    </section>
  );
}

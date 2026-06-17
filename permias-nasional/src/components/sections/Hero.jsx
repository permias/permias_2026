import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Button } from '../ui/Button.jsx';
import { sectionImages } from '../../data/siteMedia.js';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="site-gradient pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-content gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8 lg:py-24">
        <div className="animate-fade-up space-y-5">
          <p className="section-eyebrow">{t('home.hero.orgline')}</p>
          <h1 className="text-balance font-display text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            {t('home.hero.lead')}
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">{t('home.hero.sub')}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button
              as="a"
              href="https://groups.google.com/g/permias-nasional"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              {t('home.hero.ctaMilis')}
            </Button>
            <Button as={Link} to="/chapters" variant="ghost" size="lg">
              {t('home.hero.cta2')}
            </Button>
            <Button as="a" href="#register" variant="outline" size="lg">
              {t('home.register.cta')}
            </Button>
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:100ms] lg:justify-self-end">
          <div
            className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-brand-red/20 via-brand-red/5 to-transparent blur-2xl"
            aria-hidden
          />
          <img
            src={sectionImages.goldenGate}
            alt=""
            className="relative aspect-[5/4] w-full max-w-lg rounded-3xl border border-border object-cover shadow-soft-lg lg:ml-auto"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}

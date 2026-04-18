import { useLanguage } from '../../context/LanguageContext.jsx';
import { Card } from '../ui/Card.jsx';
import { ScrollReveal } from '../ui/ScrollReveal.jsx';

const cards = [
  {
    titleKey: 'home.what.community',
    descKey: 'home.what.community.desc',
    imageUrl: 'https://placehold.co/800x480/CE1126/FFFFFF?text=Community',
  },
  {
    titleKey: 'home.what.resources',
    descKey: 'home.what.resources.desc',
    imageUrl: 'https://placehold.co/800x480/1A1A1A/FFFFFF?text=Resources',
  },
  {
    titleKey: 'home.what.events',
    descKey: 'home.what.events.desc',
    imageUrl: 'https://placehold.co/800x480/333333/FFFFFF?text=Events',
  },
];

export function WhatIsPermias() {
  const { t } = useLanguage();

  return (
    <section className="border-y border-brand-charcoal/10 bg-neutral-50 py-24 dark:border-white/10 dark:bg-black/30 md:py-28">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{t('home.what.title')}</h2>
            <p className="mt-6 text-xl leading-relaxed text-brand-charcoal/80 dark:text-white/80 md:text-2xl">
              {t('home.what.sub')}
            </p>
          </div>
        </ScrollReveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6 lg:mt-16">
          {cards.map((c, i) => (
            <ScrollReveal key={c.titleKey} staggerIndex={i}>
              <Card className="h-full overflow-hidden border-brand-charcoal/10 p-0 dark:border-white/10">
                <img src={c.imageUrl} alt="" className="h-52 w-full object-cover md:h-56" loading="lazy" />
                <div className="p-6 md:p-8">
                  <h3 className="font-display text-2xl font-bold md:text-[1.75rem]">{t(c.titleKey)}</h3>
                  <p className="mt-4 text-base leading-relaxed text-brand-charcoal/80 dark:text-white/80 md:text-lg">
                    {t(c.descKey)}
                  </p>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

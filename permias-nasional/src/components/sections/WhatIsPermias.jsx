import { useLanguage } from '../../context/LanguageContext.jsx';
import { sectionImages } from '../../data/siteMedia.js';
import { Card } from '../ui/Card.jsx';
import { ScrollReveal } from '../ui/ScrollReveal.jsx';

const cards = [
  {
    titleKey: 'home.what.community',
    descKey: 'home.what.community.desc',
    imageUrl: sectionImages.goldenGate,
  },
  {
    titleKey: 'home.what.resources',
    descKey: 'home.what.resources.desc',
    imageUrl: sectionImages.visaPassport,
  },
  {
    titleKey: 'home.what.events',
    descKey: 'home.what.events.desc',
    imageUrl: sectionImages.mountRushmore,
  },
];

export function WhatIsPermias() {
  const { t } = useLanguage();

  return (
    <section className="border-y border-border bg-muted py-20 md:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {t('home.what.title')}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">{t('home.what.sub')}</p>
          </div>
        </ScrollReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-14">
          {cards.map((c, i) => (
            <ScrollReveal key={c.titleKey} staggerIndex={i}>
              <Card hover className="h-full overflow-hidden p-0">
                <img src={c.imageUrl} alt="" className="h-48 w-full object-cover md:h-52" loading="lazy" />
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold">{t(c.titleKey)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{t(c.descKey)}</p>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

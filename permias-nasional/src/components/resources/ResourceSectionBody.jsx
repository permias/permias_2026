import { VisaTimeline } from './VisaTimeline.jsx';
import { Card } from '../ui/Card.jsx';
import { ScrollReveal } from '../ui/ScrollReveal.jsx';
import { sectionImages } from '../../data/siteMedia.js';
import { cn } from '../../utils/cn.js';

function cardDescription(card, lang) {
  if (!card.description) return '';
  return typeof card.description === 'string' ? card.description : card.description[lang] ?? card.description.en ?? '';
}

function cardSubtitle(card, lang) {
  if (!card.subtitle) return '';
  return typeof card.subtitle === 'string' ? card.subtitle : card.subtitle[lang] ?? card.subtitle.en ?? '';
}

export function ResourceSectionBody({ sec, lang, t }) {
  return (
    <div>
      {sec.id === 'visa' && <div id="visaprocess" className="scroll-mt-32" aria-hidden tabIndex={-1} />}
      {sec.id === 'embassies' && (
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-charcoal/80 dark:text-white/80">{t('resources.embassies.intro')}</p>
      )}
      {sec.id === 'visa' && (
        <>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-charcoal/80 dark:text-white/80">{t('resources.visa.intro')}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <img
              src={sectionImages.mountRushmore}
              alt=""
              className="h-48 w-full rounded-2xl border border-brand-charcoal/10 object-cover shadow-sm md:h-56 dark:border-white/10"
              loading="lazy"
            />
            <img
              src={sectionImages.visaPassport}
              alt=""
              className="h-48 w-full rounded-2xl border border-brand-charcoal/10 object-cover object-center shadow-sm md:h-56 dark:border-white/10"
              loading="lazy"
            />
          </div>
          <p className="mt-4 text-sm font-semibold text-brand-charcoal/90 dark:text-white/90">{t('resources.visa.caption')}</p>
          <div className="mt-6 rounded-2xl border border-brand-charcoal/10 bg-neutral-50 p-6 dark:border-white/10 dark:bg-black/30">
            <VisaTimeline />
          </div>
        </>
      )}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {sec.cards.map((card, ci) => (
          <ScrollReveal key={`${sec.id}-${card.title}-${ci}`} staggerIndex={ci % 4}>
            <Card className="h-full overflow-hidden border-brand-charcoal/10 p-0 dark:border-white/10">
              {card.image && (
                <img src={card.image} alt="" className="h-40 w-full object-cover sm:h-44" loading="lazy" />
              )}
              <div className="p-6">
                {cardSubtitle(card, lang) && (
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-red">{cardSubtitle(card, lang)}</p>
                )}
                <h3 className="mt-1 font-display text-lg font-bold">{card.title}</h3>
                {cardDescription(card, lang) && (
                  <p className="mt-2 text-sm text-brand-charcoal/75 dark:text-white/75">{cardDescription(card, lang)}</p>
                )}
                {card.address && (
                  <p className="mt-2 text-xs text-brand-charcoal/60 dark:text-white/60">
                    <span className="font-semibold text-brand-charcoal/80 dark:text-white/80">{t('resources.card.address')}:</span> {card.address}
                  </p>
                )}
                {card.phone && (
                  <p className="mt-1 text-xs">
                    <span className="font-semibold text-brand-charcoal/80 dark:text-white/80">{t('resources.card.contact')}:</span>{' '}
                    <span className="font-semibold text-brand-red">{card.phone}</span>
                  </p>
                )}
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('mt-4 inline-flex text-sm font-bold text-brand-red underline-offset-4 hover:underline')}
                >
                  {t('resources.card.website')}: {card.href.replace(/^https?:\/\//, '').split('/')[0]} ↗
                </a>
              </div>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

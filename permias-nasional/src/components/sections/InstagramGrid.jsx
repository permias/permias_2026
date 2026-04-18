import { Button } from '../ui/Button.jsx';
import { ScrollReveal } from '../ui/ScrollReveal.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * Placeholder Instagram grid.
 * Swap this section for Instagram Basic Display API:
 * 1) Create FB app + Instagram product
 * 2) Exchange short-lived token server-side
 * 3) Fetch GET graph.instagram.com/me/media?fields=...
 * 4) Map media URLs into this card layout
 */
const placeholderImages = [
  'https://placehold.co/600x600/CE1126/FFFFFF?text=Post+1',
  'https://placehold.co/600x600/1A1A1A/FFFFFF?text=Post+2',
  'https://placehold.co/600x600/333333/FFFFFF?text=Post+3',
  'https://placehold.co/600x600/CE1126/FFFFFF?text=Post+4',
  'https://placehold.co/600x600/1A1A1A/FFFFFF?text=Post+5',
  'https://placehold.co/600x600/333333/FFFFFF?text=Post+6',
];

export function InstagramGrid({ headingKey = 'events.ig.title' }) {
  const { t } = useLanguage();

  return (
    <section className="border-t border-brand-charcoal/10 bg-neutral-50 py-20 dark:border-white/10 dark:bg-black/40 md:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{t(headingKey)}</h2>
            <p className="mt-2 text-base text-brand-charcoal/65 dark:text-white/65 md:text-lg">@permias.nasional</p>
          </ScrollReveal>
          <ScrollReveal staggerIndex={1}>
            <Button
              as="a"
              href="https://www.instagram.com/permias.nasional/"
              target="_blank"
              rel="noopener noreferrer"
              className="!px-8 !py-3 !text-base md:!text-lg"
            >
              {t('events.ig.follow')}
            </Button>
          </ScrollReveal>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {placeholderImages.map((src, i) => (
            <ScrollReveal key={src} staggerIndex={i}>
              <article className="overflow-hidden rounded-2xl border border-brand-charcoal/10 bg-white shadow-sm dark:border-white/10 dark:bg-surface-card">
                <div className="relative aspect-square overflow-hidden">
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-xs text-white md:text-sm">
                    <p className="line-clamp-2 font-semibold">National spotlight {i + 1}</p>
                    <p className="mt-1 text-[11px] text-white/85 md:text-xs">1.{i + 1}k likes · 42 comments</p>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

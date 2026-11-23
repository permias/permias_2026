import { VisaTimeline } from './VisaTimeline.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { photo } from '../../data/photos.js';
import { IconArrowUpRight } from '../ui/Icons.jsx';

const text = (v, lang) => (!v ? '' : typeof v === 'string' ? v : (v[lang] ?? v.en ?? ''));
const host = (u) => u.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

/** One guide's body: an intro (and the F-1 timeline for visas), then every link as a card with its facts. */
export function ResourceSectionBody({ sec, lang, t }) {
  return (
    <div>
      {sec.id === 'embassies' && <p className="lede max-w-[62ch]">{t('resources.embassies.intro')}</p>}
      {sec.id === 'visa' && (
        <>
          <div id="visaprocess" className="scroll-mt-32" tabIndex={-1} />
          <p className="lede max-w-[62ch]">{t('resources.visa.intro')}</p>
          <div className="mt-8 rounded-[28px] border border-border bg-surface p-6 md:p-8">
            <VisaTimeline />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t('resources.visa.caption')}</p>
        </>
      )}
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {sec.cards.map((card, ci) => {
          const p = card.photo ? photo(card.photo) : null;
          return (
            <Reveal as="li" key={`${sec.id}-${card.title}-${ci}`} delay={Math.min(ci % 4, 8) * 0.06} className="flex flex-col overflow-hidden rounded-[24px] border border-border bg-surface">
              {p && (
                <figure className="relative">
                  <img src={p.small} alt={p.alt} width="800" height="400" loading="lazy" className="photo-grade aspect-[2/1] w-full object-cover" />
                  <figcaption className="absolute bottom-2 right-2 max-w-[80%] truncate rounded-full bg-black/45 px-2 py-0.5 text-[11px] text-white/90 backdrop-blur">
                    <a href={p.page} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      {p.artist}, {p.license}
                    </a>
                  </figcaption>
                </figure>
              )}
              <div className="flex flex-1 flex-col p-6">
                {text(card.subtitle, lang) && <p className="text-sm font-semibold text-merah">{text(card.subtitle, lang)}</p>}
                <h3 className="font-sans mt-1 text-[19px] font-semibold leading-snug text-ink">{card.title}</h3>
                {text(card.description, lang) && <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">{text(card.description, lang)}</p>}
                {(card.address || card.phone) && (
                  <dl className="mt-4 grid gap-2 border-t border-border pt-4 text-[15px]">
                    {card.address && (
                      <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
                        <dt className="text-muted-foreground">{t('resources.card.address')}</dt>
                        <dd className="text-ink">{card.address}</dd>
                      </div>
                    )}
                    {card.phone && (
                      <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3">
                        <dt className="text-muted-foreground">{t('resources.card.contact')}</dt>
                        <dd>
                          <a href={`tel:${card.phone.replace(/[^+\d]/g, '')}`} className="link-quiet font-semibold text-ink tabular">
                            {card.phone}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                )}
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-auto inline-flex min-h-[44px] items-center gap-2 self-start pt-5 text-[15px] font-semibold text-ink"
                >
                  <span className="underline decoration-ink/25 underline-offset-4 transition-colors group-hover:decoration-merah">{host(card.href)}</span>
                  <IconArrowUpRight className="h-4 w-4 text-merah transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}

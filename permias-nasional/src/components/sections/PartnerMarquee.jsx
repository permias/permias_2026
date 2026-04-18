import { useLanguage } from '../../context/LanguageContext.jsx';
import { marqueeItems } from '../../data/partners.js';
import { ScrollReveal } from '../ui/ScrollReveal.jsx';

export function PartnerMarquee() {
  const { t } = useLanguage();
  const doubled = [...marqueeItems, ...marqueeItems];

  return (
    <section className="border-y border-brand-charcoal/10 bg-brand-charcoal py-12 text-white dark:border-white/10 md:py-14">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="mb-8 text-center text-sm font-bold uppercase tracking-[0.25em] text-brand-red md:text-base">
            {t('home.marquee.title')}
          </p>
        </ScrollReveal>
      </div>
      <div className="group relative overflow-hidden">
        <div className="partner-marquee-track flex w-max gap-4 group-hover:[animation-play-state:paused]">
          {doubled.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="flex h-16 min-w-[200px] items-center rounded-full border border-white/15 bg-white/5 px-5 text-base font-semibold md:h-[4.25rem] md:min-w-[220px] md:text-lg"
            >
              <img
                src={`https://placehold.co/96x96/CE1126/FFFFFF?text=${encodeURIComponent(item.initials)}`}
                alt=""
                className="mr-3 h-11 w-11 shrink-0 rounded-full object-cover md:h-12 md:w-12"
                loading="lazy"
              />
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes partner-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .partner-marquee-track {
          animation: partner-marquee 40s linear infinite;
        }
        .partner-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

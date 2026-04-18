import { visaStages } from '../../data/resources.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { ScrollReveal } from '../ui/ScrollReveal.jsx';

export function VisaTimeline() {
  const { lang } = useLanguage();

  return (
    <ol className="relative grid gap-4 border-l-2 border-brand-red/30 pl-6 md:grid-cols-4 md:border-l-0 md:border-t-2 md:pl-0 md:pt-8">
      {visaStages.map((stage, i) => (
        <ScrollReveal key={stage.id} staggerIndex={i} className="relative md:pt-2">
          <span className="absolute -left-[29px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red md:-top-2 md:left-0 md:h-4 md:w-4" aria-hidden />
          <p className="text-xs font-bold uppercase tracking-wide text-brand-red">{stage.id.toUpperCase()}</p>
          <p className="mt-1 font-display text-sm font-bold">{stage.title[lang] ?? stage.title.en}</p>
          <p className="mt-2 text-sm text-brand-charcoal/75 dark:text-white/70">{stage.body[lang] ?? stage.body.en}</p>
        </ScrollReveal>
      ))}
    </ol>
  );
}

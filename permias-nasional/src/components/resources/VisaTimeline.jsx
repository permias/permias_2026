import { visaStages } from '../../data/resources.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Reveal } from '../ui/Reveal.jsx';

/** The F-1 path as an ordered sequence (a real sequence, so the steps are numbered). */
export function VisaTimeline() {
  const { lang } = useLanguage();
  return (
    <ol className="grid gap-6 md:grid-cols-4 md:gap-5">
      {visaStages.map((stage, i) => (
        <Reveal as="li" key={stage.id} delay={Math.min(i, 8) * 0.07} className="border-l border-border pl-5 md:border-l-0 md:border-t md:pl-0 md:pt-6">
          <p className="font-display text-[34px] leading-none text-ink tabular">{i + 1}</p>
          <p className="mt-2 text-[17px] font-semibold leading-snug text-ink">{stage.title[lang] ?? stage.title.en}</p>
          <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">{stage.body[lang] ?? stage.body.en}</p>
        </Reveal>
      ))}
    </ol>
  );
}

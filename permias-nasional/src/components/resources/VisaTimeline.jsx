import { visaStages } from '../../data/resources.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Reveal } from '../ui/Reveal.jsx';

/** The F-1 path as an ordered sequence (a real sequence, so the steps are numbered). */
export function VisaTimeline() {
  const { lang } = useLanguage();
  return (
    <ol className="grid gap-6 md:grid-cols-4 md:gap-5">
      {visaStages.map((stage, i) => (
        <Reveal as="li" key={stage.id} delay={Math.min(i, 8) * 0.07} className="relative border-l-2 border-merah/25 pl-5 md:border-l-0 md:border-t-2 md:pl-0 md:pt-6">
          <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-[3px] border-background bg-merah md:-top-[9px] md:left-0" aria-hidden="true" />
          <p className="font-display text-[34px] leading-none text-merah tabular">{i + 1}</p>
          <p className="mt-2 text-[17px] font-semibold leading-snug text-ink">{stage.title[lang] ?? stage.title.en}</p>
          <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">{stage.body[lang] ?? stage.body.en}</p>
        </Reveal>
      ))}
    </ol>
  );
}

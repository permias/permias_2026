import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useCountUp } from '../../hooks/useCountUp.js';
import { ScrollReveal } from '../ui/ScrollReveal.jsx';

function StatCounter({ label, target, prefix = '', suffix = '' }) {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setEnabled(true);
        });
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const value = useCountUp(target, { duration: 1500, enabled });

  return (
    <div ref={ref} className="rounded-2xl border border-brand-charcoal/10 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-surface-card md:p-10">
      <p className="font-display text-5xl font-extrabold tracking-tight text-brand-red sm:text-6xl lg:text-7xl">
        {prefix}
        {value}
        {suffix}
      </p>
      <p className="mt-3 text-base font-semibold uppercase tracking-wide text-brand-charcoal/75 dark:text-white/75 md:text-lg">
        {label}
      </p>
    </div>
  );
}

export function Stats() {
  const { t } = useLanguage();
  const items = [
    { label: t('home.stats.chapters'), target: 90, suffix: '+' },
    { label: t('home.stats.members'), target: 3000, suffix: '+' },
    { label: t('home.stats.years'), target: 15, suffix: '+' },
    { label: t('home.stats.scholarships'), target: 500, prefix: '$', suffix: 'K+' },
  ];

  return (
    <section className="border-y border-brand-charcoal/10 bg-white py-20 dark:border-white/10 dark:bg-surface-dark md:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <ScrollReveal key={s.label} staggerIndex={i}>
              <StatCounter label={s.label} target={s.target} prefix={s.prefix} suffix={s.suffix} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

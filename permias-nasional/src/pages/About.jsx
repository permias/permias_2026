import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { milestones } from '../data/about.js';
import { teamDepartments } from '../data/team.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { ScrollReveal } from '../components/ui/ScrollReveal.jsx';

function MilestoneCard({ m, index, lang }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setOn(true);
        });
      },
      { threshold: 0.45, rootMargin: '0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      style={{
        animationDelay: `${index * 60}ms`,
        opacity: on ? 1 : 0,
        transform: on ? 'scale(1)' : 'scale(0.96)',
        transition: 'opacity 0.45s ease-out, transform 0.45s ease-out',
      }}
      className="min-w-[280px] max-w-xs snap-center rounded-2xl border border-brand-charcoal/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-surface-card"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">{m.year}</p>
      <h3 className="mt-2 font-display text-xl font-bold">{m.title[lang]}</h3>
      <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/75 dark:text-white/75">{m.desc[lang]}</p>
    </article>
  );
}

function OrgNode({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border-2 border-brand-red/40 bg-brand-red/10 px-4 py-3 text-center text-sm font-bold text-brand-charcoal dark:text-white ${className}`}
    >
      {children}
    </div>
  );
}

function OrgConnector({ className = '' }) {
  return <div className={`w-0.5 bg-brand-red ${className}`} aria-hidden />;
}

export function About() {
  const { lang, t } = useLanguage();
  const location = useLocation();
  const directorates = teamDepartments.filter((d) => d.id !== 'executive');

  useEffect(() => {
    if (location.pathname !== '/about/sejarah') return;
    window.requestAnimationFrame(() => {
      document.getElementById('sejarah')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [location.pathname]);

  return (
    <>
      <Seo title="About PERMIAS | PERMIAS Nasional" description="History, mission, vision, and leadership structure of PERMIAS Nasional." path="/about" />
      <div className="border-b border-brand-charcoal/10 bg-white py-14 dark:border-white/10 dark:bg-surface-dark">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t('about.title')}</h1>
            <p className="mt-4 max-w-3xl text-lg text-brand-charcoal/75 dark:text-white/75">{t('about.sub')}</p>
          </ScrollReveal>
        </div>
      </div>

      <section id="sejarah" className="scroll-mt-36 border-b border-brand-charcoal/10 bg-neutral-50 py-12 dark:border-white/10 dark:bg-black/30">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-display text-2xl font-bold">Timeline</h2>
            <p className="mt-2 text-sm text-brand-charcoal/60 dark:text-white/60">Scroll or drag sideways to explore milestones.</p>
          </ScrollReveal>
          <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
            {milestones.map((m, i) => (
              <MilestoneCard key={m.year} m={m} index={i} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid gap-8 md:grid-cols-2">
            <blockquote className="rounded-2xl border-l-4 border-brand-red bg-white p-8 shadow-sm dark:bg-surface-card">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-red">{t('about.mission')}</p>
              <p className="mt-4 font-display text-xl font-bold leading-snug">{t('about.mission.body')}</p>
            </blockquote>
            <blockquote className="rounded-2xl border-l-4 border-brand-red bg-white p-8 shadow-sm dark:bg-surface-card">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-red">{t('about.vision')}</p>
              <p className="mt-4 font-display text-xl font-bold leading-snug">{t('about.vision.body')}</p>
            </blockquote>
          </div>
        </ScrollReveal>

        <ScrollReveal staggerIndex={1}>
          <h2 className="font-display text-2xl font-bold">{t('about.chart.title')}</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-brand-charcoal/10 bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-surface-card">
            <div className="mx-auto flex min-w-[min(100%,720px)] max-w-4xl flex-col items-center">
              <OrgNode className="min-w-[11rem] border-brand-red bg-brand-red/15">{t('about.chart.president')}</OrgNode>
              <OrgConnector className="h-6" />
              <OrgNode className="min-w-[11rem]">{t('about.chart.vicePresident')}</OrgNode>
              <OrgConnector className="h-6" />
              <div className="w-full max-w-5xl border-t-2 border-brand-red pt-6">
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {directorates.map((dept) => (
                    <li key={dept.id}>
                      <OrgNode className="h-full w-full text-xs leading-snug sm:text-sm">{t(dept.titleKey)}</OrgNode>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}

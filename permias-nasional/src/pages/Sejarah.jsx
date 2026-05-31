import { Link } from 'react-router-dom';
import {
  sejarahActivities,
  sejarahFormation,
  sejarahMission,
  sejarahVision,
} from '../data/sejarah.js';
import { SUPPORT_EMAIL } from '../data/contactEmails.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { ScrollReveal } from '../components/ui/ScrollReveal.jsx';

export function Sejarah() {
  const { lang, t } = useLanguage();

  return (
    <>
      <Seo
        title="Sejarah Kami | PERMIAS Nasional"
        description="History, vision, mission, and national programming of PERMIAS Nasional since 1961."
        path="/about/sejarah"
      />

      <div className="border-b border-brand-charcoal/10 bg-white py-14 dark:border-white/10 dark:bg-surface-dark">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t('sejarah.title')}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-brand-charcoal/75 dark:text-white/75">
              {t('sejarah.intro')}
            </p>
          </ScrollReveal>
        </div>
      </div>

      <section className="border-b border-brand-charcoal/10 bg-neutral-50 py-14 dark:border-white/10 dark:bg-black/30">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{sejarahFormation.title[lang]}</h2>
            <p className="mt-2 text-lg font-semibold text-brand-red">{sejarahFormation.lead[lang]}</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-charcoal/80 dark:text-white/80">
              {sejarahFormation.paragraphs.map((p) => (
                <p key={p.en}>{p[lang]}</p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-content space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{t('sejarah.visionMission')}</h2>
          <p className="mt-2 max-w-3xl text-sm text-brand-charcoal/65 dark:text-white/65">{t('sejarah.visionMission.sub')}</p>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-2">
          <ScrollReveal staggerIndex={1}>
            <article className="h-full rounded-2xl border border-brand-charcoal/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-surface-card">
              <h3 className="text-xs font-bold uppercase tracking-wide text-brand-red">{sejarahVision.title[lang]}</h3>
              <ul className="mt-4 space-y-4 text-sm leading-relaxed text-brand-charcoal/80 dark:text-white/80">
                {sejarahVision.items.map((item) => (
                  <li key={item.en} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden />
                    <span>{item[lang]}</span>
                  </li>
                ))}
              </ul>
            </article>
          </ScrollReveal>

          <ScrollReveal staggerIndex={2}>
            <article className="h-full rounded-2xl border border-brand-charcoal/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-surface-card">
              <h3 className="text-xs font-bold uppercase tracking-wide text-brand-red">{sejarahMission.title[lang]}</h3>
              <ul className="mt-4 space-y-4 text-sm leading-relaxed text-brand-charcoal/80 dark:text-white/80">
                {sejarahMission.items.map((item) => (
                  <li key={item.en} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden />
                    <span>{item[lang]}</span>
                  </li>
                ))}
              </ul>
            </article>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-t border-brand-charcoal/10 bg-neutral-50 py-14 dark:border-white/10 dark:bg-black/30">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{t('sejarah.activities')}</h2>
            <p className="mt-2 max-w-3xl text-sm text-brand-charcoal/65 dark:text-white/65">{t('sejarah.activities.sub')}</p>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {sejarahActivities.map((item, i) => (
              <ScrollReveal key={item.title.en} staggerIndex={i}>
                <article className="h-full rounded-2xl border border-brand-charcoal/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-surface-card">
                  <h3 className="font-display text-lg font-bold">{item.title[lang]}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/75 dark:text-white/75">{item.desc[lang]}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-14 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{t('sejarah.partners')}</h2>
          <p className="mt-3 max-w-2xl text-brand-charcoal/75 dark:text-white/75">{t('sejarah.partners.sub')}</p>
          <Link
            to="/partners"
            className="mt-6 inline-flex font-bold text-brand-red underline-offset-4 hover:underline"
          >
            {t('sejarah.partners.cta')} →
          </Link>
          <ul className="mt-8 space-y-2 text-sm text-brand-charcoal/80 dark:text-white/80">
            <li>
              <span className="font-semibold">{t('sejarah.partners.mailingList')}</span>{' '}
              <a
                href="https://groups.google.com/g/permias-nasional"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-red underline-offset-4 hover:underline"
              >
                groups.google.com/g/permias-nasional
              </a>
            </li>
            <li>
              <span className="font-semibold">{t('sejarah.partners.contact')}</span>{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-brand-red underline-offset-4 hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </li>
          </ul>
        </ScrollReveal>
      </section>
    </>
  );
}

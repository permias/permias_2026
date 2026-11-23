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
import { PAGE_PHOTOS } from '../data/photos.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';

export function Sejarah() {
  const { lang, t } = useLanguage();

  return (
    <>
      <Seo
        title="Sejarah Kami | PERMIAS Nasional"
        description="History, vision, mission, and national programming of PERMIAS Nasional since 1961."
        path="/about/sejarah"
      />

      <PageHeader image={PAGE_PHOTOS.sejarah} title={t('sejarah.title')} description={t('sejarah.intro')} />

      <section className="border-b border-ink/10 bg-neutral-50 py-14 dark:border-white/10 dark:bg-black/30">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{sejarahFormation.title[lang]}</h2>
            <p className="mt-2 text-lg font-semibold text-merah">{sejarahFormation.lead[lang]}</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/80 dark:text-white/80">
              {sejarahFormation.paragraphs.map((p) => (
                <p key={p.en}>{p[lang]}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-content space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{t('sejarah.visionMission')}</h2>
          <p className="mt-2 max-w-3xl text-sm text-ink/65 dark:text-white/65">{t('sejarah.visionMission.sub')}</p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2">
          <Reveal delay={Math.min(1, 8) * 0.06}>
            <article className="h-full rounded-2xl border border-ink/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-surface">
              <h3 className="text-xs font-bold text-merah">{sejarahVision.title[lang]}</h3>
              <ul className="mt-4 space-y-4 text-sm leading-relaxed text-ink/80 dark:text-white/80">
                {sejarahVision.items.map((item) => (
                  <li key={item.en} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-merah" aria-hidden />
                    <span>{item[lang]}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal delay={Math.min(2, 8) * 0.06}>
            <article className="h-full rounded-2xl border border-ink/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-surface">
              <h3 className="text-xs font-bold text-merah">{sejarahMission.title[lang]}</h3>
              <ul className="mt-4 space-y-4 text-sm leading-relaxed text-ink/80 dark:text-white/80">
                {sejarahMission.items.map((item) => (
                  <li key={item.en} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-merah" aria-hidden />
                    <span>{item[lang]}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-neutral-50 py-14 dark:border-white/10 dark:bg-black/30">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{t('sejarah.activities')}</h2>
            <p className="mt-2 max-w-3xl text-sm text-ink/65 dark:text-white/65">{t('sejarah.activities.sub')}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {sejarahActivities.map((item, i) => (
              <Reveal key={item.title.en} delay={Math.min(i, 8) * 0.06}>
                <article className="h-full rounded-2xl border border-ink/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-surface">
                  <h3 className="font-display text-lg font-bold">{item.title[lang]}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75 dark:text-white/75">{item.desc[lang]}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-14 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{t('sejarah.partners')}</h2>
          <p className="mt-3 max-w-2xl text-ink/75 dark:text-white/75">{t('sejarah.partners.sub')}</p>
          <Link
            to="/partners"
            className="mt-6 inline-flex font-bold text-merah underline-offset-4 hover:underline"
          >
            {t('sejarah.partners.cta')} →
          </Link>
          <ul className="mt-8 space-y-2 text-sm text-ink/80 dark:text-white/80">
            <li>
              <span className="font-semibold">{t('sejarah.partners.mailingList')}</span>{' '}
              <a
                href="https://groups.google.com/g/permias-nasional"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-merah underline-offset-4 hover:underline"
              >
                groups.google.com/g/permias-nasional
              </a>
            </li>
            <li>
              <span className="font-semibold">{t('sejarah.partners.contact')}</span>{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-merah underline-offset-4 hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </li>
          </ul>
        </Reveal>
      </section>
    </>
  );
}

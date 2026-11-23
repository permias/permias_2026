import { useMemo } from 'react';
import { teamDepartments } from '../data/team.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { pageTabTitle } from '../utils/seo.js';
import { Reveal } from '../components/ui/Reveal.jsx';
import { PAGE_PHOTOS } from '../data/photos.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';

function OrgNode({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border-2 border-merah/40 bg-merah/10 px-4 py-3 text-center text-sm font-bold text-ink dark:text-white ${className}`}
    >
      {children}
    </div>
  );
}

function OrgConnector({ className = '' }) {
  return <div className={`w-0.5 bg-merah ${className}`} aria-hidden />;
}

export function About() {
  const { t } = useLanguage();
  const directorates = useMemo(() => teamDepartments.filter((d) => d.id !== 'executive'), []);

  return (
    <>
      <Seo title={pageTabTitle('About PERMIAS')} description="History, mission, vision, and leadership structure of PERMIAS Nasional." path="/about" />
      <PageHeader image={PAGE_PHOTOS.about} title={t('about.title')} description={t('about.sub')} />

      <section className="mx-auto max-w-content space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-8 md:grid-cols-2">
            <blockquote className="rounded-2xl border-l-4 border-merah bg-white p-8 shadow-sm dark:bg-surface">
              <p className="text-xs font-bold text-merah">{t('about.mission')}</p>
              <p className="mt-4 font-display text-xl font-bold leading-snug">{t('about.mission.body')}</p>
            </blockquote>
            <blockquote className="rounded-2xl border-l-4 border-merah bg-white p-8 shadow-sm dark:bg-surface">
              <p className="text-xs font-bold text-merah">{t('about.vision')}</p>
              <p className="mt-4 font-display text-xl font-bold leading-snug">{t('about.vision.body')}</p>
            </blockquote>
          </div>
        </Reveal>

        <Reveal delay={Math.min(1, 8) * 0.06}>
          <h2 className="font-display text-2xl font-bold">{t('about.chart.title')}</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-surface">
            <div className="mx-auto flex min-w-[min(100%,720px)] max-w-4xl flex-col items-center">
              <OrgNode className="min-w-[11rem] border-merah bg-merah/15">{t('about.chart.president')}</OrgNode>
              <OrgConnector className="h-6" />
              <OrgNode className="min-w-[11rem]">{t('about.chart.vicePresident')}</OrgNode>
              <OrgConnector className="h-6" />
              <div className="w-full max-w-5xl border-t-2 border-merah pt-6">
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
        </Reveal>
      </section>
    </>
  );
}

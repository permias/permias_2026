import { Link } from 'react-router-dom';
import { resourceSections } from '../data/resources.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo, pageTabTitle } from '../components/Seo.jsx';
import { ScrollReveal } from '../components/ui/ScrollReveal.jsx';
import { Card } from '../components/ui/Card.jsx';

export function ResourcesIndex() {
  const { t, lang } = useLanguage();

  return (
    <>
      <Seo
        title={pageTabTitle('Student Resources')}
        description="Embassies, visa pathways, scholarships, careers, research, entrepreneurship, and cultural programs."
        path="/resources"
      />
      <div className="border-b border-brand-charcoal/10 bg-white py-14 dark:border-white/10 dark:bg-surface-dark">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t('resources.title')}</h1>
            <p className="mt-4 max-w-3xl text-lg text-brand-charcoal/75 dark:text-white/75">{t('resources.sub')}</p>
            <p className="mt-3 text-sm text-brand-charcoal/60 dark:text-white/60">{t('resources.index.hint')}</p>
          </ScrollReveal>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceSections.map((sec, i) => (
            <ScrollReveal key={sec.id} staggerIndex={i % 6}>
              <Link to={`/resources/${sec.id}`} className="block h-full">
                <Card className="h-full border-brand-charcoal/10 transition hover:border-brand-red/50 dark:border-white/10">
                  <h2 className="font-display text-xl font-bold">{sec.title[lang] ?? sec.title.en}</h2>
                  <p className="mt-2 text-sm font-semibold text-brand-red">{t('resources.index.open')} →</p>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </>
  );
}

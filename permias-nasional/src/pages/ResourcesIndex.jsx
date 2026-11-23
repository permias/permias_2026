import { Link } from 'react-router-dom';
import { resourceSections } from '../data/resources.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { pageTabTitle } from '../utils/seo.js';
import { PAGE_PHOTOS } from '../data/photos.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
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
      <PageHeader image={PAGE_PHOTOS.resources} title={t('resources.title')} description={t('resources.sub')}>
        <p className="mt-3 text-sm text-muted-foreground">{t('resources.index.hint')}</p>
      </PageHeader>

      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceSections.map((sec, i) => (
            <Reveal key={sec.id} delay={Math.min(i % 6, 8) * 0.06}>
              <Link to={`/resources/${sec.id}`} className="block h-full">
                <Card className="h-full border-ink/10 transition hover:border-merah/50 dark:border-white/10">
                  <h2 className="font-display text-xl font-bold">{sec.title[lang] ?? sec.title.en}</h2>
                  <p className="mt-2 text-sm font-semibold text-merah">{t('resources.index.open')} →</p>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}

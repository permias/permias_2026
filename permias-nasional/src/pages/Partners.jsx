import { partners } from '../data/partners.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { pageTabTitle } from '../utils/seo.js';
import { Card } from '../components/ui/Card.jsx';
import { PAGE_PHOTOS } from '../data/photos.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';

export function Partners() {
  const { t } = useLanguage();

  return (
    <>
      <Seo title={pageTabTitle('Partners')} description="Government, cultural, academic, and community partners of PERMIAS Nasional." path="/partners" />
      <PageHeader image={PAGE_PHOTOS.partners} title={t('partners.title')} description={t('partners.sub')} />

      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i % 5, 8) * 0.06}>
              <Card className="flex h-full flex-col border-ink/10 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-merah/10 text-lg font-black text-merah">{p.initials}</div>
                  <div>
                    <span className="inline-flex rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold text-ink/70 dark:bg-white/10 dark:text-white/80">
                      {p.type}
                    </span>
                    <h2 className="mt-1 font-display text-lg font-bold">{p.name}</h2>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm text-ink/75 dark:text-white/75">{p.description}</p>
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full border-2 border-merah bg-transparent px-6 py-2 text-sm font-semibold text-merah transition-all duration-150 hover:bg-merah hover:text-white dark:text-white"
                >
                  {t('partners.visit')}
                </a>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}

import { Link } from 'react-router-dom';
import { resourceSections } from '../data/resources.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { pageTabTitle } from '../utils/seo.js';
import { PAGE_PHOTOS } from '../data/photos.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { PhotoTile, SectionHead } from '../components/ui/Section.jsx';
import { IconArrowRight } from '../components/ui/Icons.jsx';
import { GUIDE_NOTES } from '../data/guideNotes.js';
import { cn } from '../utils/cn.js';

const FIRST = ['visa', 'embassies'];

/** Guides: the two most-used guides as large photo tiles, the rest as tiles, then an index of every guide. */
export function ResourcesIndex() {
  const { t, pick } = useLanguage();
  const lead = FIRST.map((id) => resourceSections.find((s) => s.id === id)).filter(Boolean);
  const rest = resourceSections.filter((s) => !FIRST.includes(s.id));
  const count = (s) => pick({ en: `${s.cards.length} links`, id: `${s.cards.length} tautan` });

  return (
    <>
      <Seo title={pageTabTitle('Student Resources')} description="Embassies, visa pathways, scholarships, careers, research, entrepreneurship, and cultural programs." path="/resources" />
      <PageHeader image={PAGE_PHOTOS.resources} title={t('resources.title')} description={t('resources.sub')} />

      <section className="container-x mt-16 md:mt-24" aria-labelledby="rs-start">
        <SectionHead id="rs-start" word="Mulai di sini" title={pick({ en: 'Most read by new students', id: 'Paling sering dibaca mahasiswa baru' })} />
        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          {lead.map((s, i) => (
            <PhotoTile
              key={s.id}
              to={`/resources/${s.id}`}
              image={PAGE_PHOTOS[s.id]}
              size={i === 0 ? 'lg' : 'md'}
              className={cn(i === 1 && 'lg:min-h-[520px]')}
              title={pick(s.title)}
              sub={pick(GUIDE_NOTES[s.id])}
              links={[pick({ en: 'Open the guide', id: 'Buka panduan' }), count(s)]}
            />
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((s) => (
            <PhotoTile key={s.id} to={`/resources/${s.id}`} image={PAGE_PHOTOS[s.id]} size="sm" title={pick(s.title)} sub={pick(GUIDE_NOTES[s.id])} links={[count(s)]} />
          ))}
        </div>
      </section>

      <section className="container-x page-pad mt-20 md:mt-28" aria-labelledby="rs-index">
        <SectionHead id="rs-index" word="Indeks" title={pick({ en: 'Every guide', id: 'Semua panduan' })} />
        <Reveal as="ul" className="mt-8 divide-y divide-border border-y border-border">
          {resourceSections.map((s) => (
            <li key={s.id}>
              <Link to={`/resources/${s.id}`} className="group grid items-baseline gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:gap-8">
                <span className="font-display text-[26px] leading-tight text-ink transition-colors group-hover:text-merah">{pick(s.title)}</span>
                <span className="text-[16px] text-muted-foreground">{pick(GUIDE_NOTES[s.id])}</span>
                <span className="hidden items-center gap-2 text-sm font-semibold text-ink/70 sm:inline-flex">
                  {count(s)}
                  <IconArrowRight className="h-4 w-4 text-merah transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </section>
    </>
  );
}

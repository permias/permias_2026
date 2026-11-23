import { useMemo, useState } from 'react';
import { Link, NavLink, Navigate, useParams } from 'react-router-dom';
import { resourceSections } from '../data/resources.js';
import { GUIDE_NOTES } from '../data/guideNotes.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { pageTabTitle } from '../utils/seo.js';
import { ResourceSectionBody } from '../components/resources/ResourceSectionBody.jsx';
import { PAGE_PHOTOS } from '../data/photos.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { IconArrowRight, IconSearch } from '../components/ui/Icons.jsx';
import { cn } from '../utils/cn.js';

const VALID_IDS = new Set(resourceSections.map((s) => s.id));

/** One guide: a sticky index of all guides beside the cards, with a filter for this guide's links. */
export function ResourceTopic() {
  const { topicId: raw } = useParams();
  const topicId = raw === 'visaprocess' ? 'visa' : raw;
  const { t, lang, pick } = useLanguage();
  const [q, setQ] = useState('');
  const sec = useMemo(() => resourceSections.find((s) => s.id === topicId), [topicId]);

  const cards = useMemo(() => {
    if (!sec) return [];
    const query = q.trim().toLowerCase();
    if (!query) return sec.cards;
    return sec.cards.filter((c) => {
      const desc = typeof c.description === 'string' ? c.description : `${c.description?.en ?? ''} ${c.description?.id ?? ''}`;
      return `${c.title} ${desc} ${(c.keywords || []).join(' ')}`.toLowerCase().includes(query);
    });
  }, [sec, q]);

  if (!topicId || !VALID_IDS.has(topicId)) return <Navigate to="/resources" replace />;
  const idx = resourceSections.findIndex((s) => s.id === topicId);
  const next = resourceSections[(idx + 1) % resourceSections.length];

  return (
    <>
      <Seo title={pageTabTitle(pick(sec.title))} description={pick(GUIDE_NOTES[sec.id]) || t('resources.sub')} path={`/resources/${topicId}`} />
      <PageHeader image={PAGE_PHOTOS[sec.id] || PAGE_PHOTOS.resources} title={pick(sec.title)} description={pick(GUIDE_NOTES[sec.id])} compact />

      <div className="container-x page-pad mt-12 grid gap-10 md:mt-16 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav aria-label={pick({ en: 'All guides', id: 'Semua panduan' })}>
            <p className="hidden font-display text-xl italic text-merah lg:block" lang="id">
              Panduan
            </p>
            <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:mt-3 lg:block lg:space-y-0.5 lg:px-0">
              {resourceSections.map((s) => (
                <li key={s.id} className="shrink-0">
                  <NavLink
                    to={`/resources/${s.id}`}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-[44px] items-center whitespace-nowrap rounded-full border px-4 text-[15px] font-semibold transition-colors duration-150 lg:whitespace-normal lg:rounded-[12px] lg:border-0 lg:px-3',
                        isActive ? 'border-ink bg-ink text-mist lg:bg-ink/[0.06] lg:text-ink lg:dark:bg-white/10' : 'border-border text-ink/70 hover:text-ink lg:hover:bg-ink/[0.04]',
                      )
                    }
                  >
                    {pick(s.title)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="mb-10 flex min-h-[52px] max-w-xl items-center gap-2 rounded-[14px] border border-ink/15 bg-surface px-4 focus-within:border-merah/60 focus-within:shadow-[0_0_0_4px_rgb(var(--merah)/0.12)]">
            <IconSearch className="h-5 w-5 shrink-0 text-ink/50" />
            <label htmlFor="topic-q" className="sr-only">
              {t('resources.search')}
            </label>
            <input id="topic-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('resources.search')} className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink/45" />
          </div>
          {q.trim() && cards.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-ink/20 p-10 text-center">
              <p className="font-display text-2xl text-ink">{t('search.empty')}</p>
              <button type="button" onClick={() => setQ('')} className="mt-4 min-h-[44px] rounded-[12px] px-4 text-[15px] font-semibold text-merah hover:bg-merah/5">
                {pick({ en: 'Clear the filter', id: 'Hapus filter' })}
              </button>
            </div>
          ) : (
            <ResourceSectionBody sec={{ ...sec, cards }} lang={lang} t={t} />
          )}

          <Link to={`/resources/${next.id}`} className="group mt-16 flex items-center justify-between gap-6 rounded-[24px] border border-border p-6 transition-[border-color,background-color] duration-150 hover:border-ink/25 hover:bg-ink/[0.02]">
            <span>
              <span className="block text-sm text-muted-foreground">{pick({ en: 'Next guide', id: 'Panduan berikutnya' })}</span>
              <span className="mt-1 block font-display text-[28px] leading-tight text-ink">{pick(next.title)}</span>
            </span>
            <IconArrowRight className="h-5 w-5 shrink-0 text-merah transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </>
  );
}

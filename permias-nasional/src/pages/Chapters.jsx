import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useSearchParams } from 'react-router-dom';
import { chapters, chaptersByStateId, REGIONS } from '../data/chapters.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo, pageTabTitle } from '../components/Seo.jsx';
import { USMap } from '../components/chapters/USMap.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { ScrollReveal } from '../components/ui/ScrollReveal.jsx';
import { cn } from '../utils/cn.js';
import { resolveAssetUrl } from '../utils/site.js';

function ChapterCard({ chapter, visitLabel }) {
  const igHandle = chapter.instagram?.replace('@', '');

  return (
    <article className="overflow-hidden rounded-2xl border border-brand-charcoal/10 bg-neutral-50/80 dark:border-white/10 dark:bg-black/20">
      <div className="flex gap-3 p-4">
        <img
          src={resolveAssetUrl(chapter.logoUrl)}
          alt=""
          className="h-14 w-14 shrink-0 rounded-xl border border-brand-charcoal/10 object-cover dark:border-white/10"
        />
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold leading-snug">{chapter.chapterName}</h3>
          <p className="mt-0.5 text-xs text-brand-charcoal/65 dark:text-white/65">{chapter.university}</p>
          <p className="mt-1 text-xs font-semibold text-brand-charcoal/80 dark:text-white/80">
            {chapter.city}, {chapter.state}
          </p>
        </div>
      </div>
      <div className="space-y-2 border-t border-brand-charcoal/8 px-4 py-3 dark:border-white/8">
        {chapter.instagram && (
          <p className="text-xs">
            <span className="text-brand-charcoal/55 dark:text-white/55">Instagram · </span>
            <a
              className="font-semibold text-brand-red hover:underline"
              href={`https://instagram.com/${igHandle}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {chapter.instagram}
            </a>
          </p>
        )}
        {chapter.email && (
          <p className="truncate text-xs">
            <span className="text-brand-charcoal/55 dark:text-white/55">Email · </span>
            <a className="font-semibold text-brand-red hover:underline" href={`mailto:${chapter.email}`}>
              {chapter.email}
            </a>
          </p>
        )}
        <Button
          as="a"
          href={chapter.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 w-full !py-2.5 text-xs sm:text-sm"
        >
          {visitLabel}
        </Button>
      </div>
    </article>
  );
}

function ChapterStatePanel({ selectedStateId, selectedList, onClose, fill = false, className }) {
  const { t } = useLanguage();
  const stateLabel = selectedList[0]?.state ?? selectedStateId?.toUpperCase() ?? '—';
  const countLabel = t('chapters.sidebar.count').replace('{n}', String(selectedList.length));

  return (
    <div className={cn('flex flex-col', fill && 'min-h-0 flex-1', className)}>
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-brand-charcoal/10 px-5 py-4 dark:border-white/10">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-red">
            {selectedStateId ? selectedStateId.toUpperCase() : '—'}
          </p>
          <h2 className="font-display text-xl font-bold leading-tight">
            {t('chapters.sidebar.title')} {stateLabel}
          </h2>
          {selectedList.length > 0 && (
            <p className="mt-1 text-sm text-brand-charcoal/60 dark:text-white/60">{countLabel}</p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            className="rounded-full border border-brand-charcoal/10 p-2 text-brand-charcoal transition hover:border-brand-red/30 hover:text-brand-red dark:border-white/10 dark:text-white"
            onClick={onClose}
            aria-label="Close chapter list"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <div
        className={cn(
          'overflow-y-auto overscroll-y-contain px-5 py-4',
          fill ? 'min-h-0 flex-1' : 'max-h-[min(62dvh,calc(100dvh-14rem))]',
        )}
      >
        {selectedList.length === 0 ? (
          <p className="rounded-xl border border-dashed border-brand-charcoal/15 px-4 py-8 text-center text-sm text-brand-charcoal/70 dark:border-white/15 dark:text-white/70">
            {t('chapters.sidebar.empty')}
          </p>
        ) : (
          <div className="space-y-3">
            {selectedList.map((c) => (
              <ChapterCard key={c.id} chapter={c} visitLabel={t('chapters.visit')} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChapterMobileDrawer({ open, selectedStateId, selectedList, onClose }) {
  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close chapter list"
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[1px] transition-opacity lg:hidden"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Chapter list"
        className={cn(
          'fixed inset-x-0 bottom-0 z-[110] flex max-h-[min(88dvh,calc(100dvh-5rem))] flex-col rounded-t-3xl border-t border-brand-charcoal/10 bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.18)] transition-transform duration-300 dark:border-white/10 dark:bg-surface-card lg:hidden',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="flex shrink-0 justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-brand-charcoal/20 dark:bg-white/20" aria-hidden />
        </div>
        <ChapterStatePanel
          selectedStateId={selectedStateId}
          selectedList={selectedList}
          onClose={onClose}
        />
      </aside>
    </>,
    document.body,
  );
}

export function Chapters() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedStateId = searchParams.get('state')?.toLowerCase() || '';
  const [hoveredStateId, setHoveredStateId] = useState(null);
  const [region, setRegion] = useState('');
  const [q, setQ] = useState('');

  const setSelectedState = (id) => {
    if (id) setSearchParams({ state: id });
    else setSearchParams({});
  };

  useEffect(() => {
    const el = document.getElementById('chapters-map');
    if (searchParams.get('state') && el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedStateId) return undefined;
    const mq = window.matchMedia('(max-width: 1023px)');
    if (!mq.matches) return undefined;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selectedStateId]);

  const byState = useMemo(() => chaptersByStateId(), []);
  const selectedList = selectedStateId ? byState[selectedStateId] || [] : [];

  const filteredGrid = useMemo(() => {
    return chapters.filter((c) => {
      if (region && c.region !== region) return false;
      if (!q.trim()) return true;
      const hay = `${c.chapterName} ${c.university} ${c.city} ${c.state}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [region, q]);

  return (
    <>
      <Seo
        title={pageTabTitle('Find a Chapter')}
        description="Interactive map and directory of PERMIAS chapters across the United States."
        path="/chapters"
      />
      <PageHeader title={t('chapters.title')} description={t('chapters.sub')}>
        <p className="mt-3 text-base font-medium text-brand-red">{t('chapters.register.line')}</p>
        <div className="mt-6">
          <Button as={Link} to="/chapters/register">
            {t('chapters.register')}
          </Button>
        </div>
      </PageHeader>

      <div id="chapters-map" className="relative mx-auto max-w-content scroll-mt-36 px-4 py-10 sm:px-6 lg:scroll-mt-32 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
          <ScrollReveal>
            <Card className="overflow-hidden p-4 dark:border-white/10">
              <USMap
                selectedStateId={selectedStateId}
                hoveredStateId={hoveredStateId}
                onHover={setHoveredStateId}
                onSelect={(id) => setSelectedState(id)}
              />
            </Card>
          </ScrollReveal>

          <aside
            className="hidden lg:flex lg:sticky lg:top-32 lg:max-h-[calc(100vh-8rem)] lg:flex-col lg:overflow-hidden lg:rounded-2xl lg:border lg:border-brand-charcoal/10 lg:bg-white lg:shadow-sm dark:lg:border-white/10 dark:lg:bg-surface-card"
            aria-label={t('chapters.sidebar.title')}
          >
            {selectedStateId ? (
              <ChapterStatePanel fill selectedStateId={selectedStateId} selectedList={selectedList} />
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
                  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                    <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" strokeLinejoin="round" />
                    <path d="M9 4v14M15 6v14" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="font-display text-lg font-bold">{t('chapters.sidebar.title')}</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/65 dark:text-white/65">
                  {t('chapters.sidebar.hint')}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>

      <ChapterMobileDrawer
        open={Boolean(selectedStateId)}
        selectedStateId={selectedStateId}
        selectedList={selectedList}
        onClose={() => setSelectedState('')}
      />

      <section className="border-t border-brand-charcoal/10 bg-neutral-50 py-14 dark:border-white/10 dark:bg-black/30">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('chapters.search')} className="md:max-w-md" />
            <label className="flex items-center gap-2 text-sm font-semibold">
              <span>{t('chapters.filterRegion')}</span>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="rounded-xl border border-brand-charcoal/15 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-surface-card dark:text-white"
              >
                <option value="">{t('chapters.allRegions')}</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGrid.map((c, i) => (
              <ScrollReveal key={c.id} staggerIndex={i % 6}>
                <Card className="group h-full border-brand-charcoal/10 transition duration-150 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-lg dark:border-white/10">
                  <div className="flex gap-4">
                    <img src={resolveAssetUrl(c.logoUrl)} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-display text-lg font-bold">{c.chapterName}</h3>
                      <p className="text-xs text-brand-charcoal/60 dark:text-white/60">{c.university}</p>
                      <p className="mt-1 text-xs font-semibold">
                        {c.city}, {c.state}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {c.instagram && (
                      <a className="rounded-full bg-black/5 px-3 py-1 font-semibold dark:bg-white/10" href={`https://instagram.com/${c.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                        IG
                      </a>
                    )}
                    {c.line && (
                      <span className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/10">LINE</span>
                    )}
                    {c.whatsapp && (
                      <a className="rounded-full bg-black/5 px-3 py-1 font-semibold dark:bg-white/10" href={c.whatsapp} target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                    )}
                  </div>
                  <Button as="a" href={c.website} target="_blank" rel="noopener noreferrer" className="mt-4 w-full !py-2 text-sm">
                    {t('chapters.visit')}
                  </Button>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

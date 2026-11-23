import { useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { chapters, formatDistance, getStatesDropdown, instagramUrl, nearestChapters, REGION_LABELS, REGIONS, stateCount } from '../data/chapters.js';
import { campusName, isRegional, REGION_TONE } from '../lib/regionTone.js';
import { motionTokens } from '../lib/motion.js';
import { projectToMap } from '../utils/mapProjection.js';
import { buildSearchIndex, searchIndex } from '../utils/searchIndex.js';
import { pageTabTitle } from '../utils/seo.js';
import { cn } from '../utils/cn.js';
import { Seo } from '../components/Seo.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { ChapterMap } from '../components/chapters/ChapterMap.jsx';
import { IconArrowRight, IconArrowUpRight, IconChevronDown, IconInstagram, IconLocate, IconSearch } from '../components/ui/Icons.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { ChapterLogo } from '../components/chapters/ChapterLogo.jsx';
import { chapterPath } from '../lib/chapterInfo.js';

const sorted = [...chapters].sort((a, b) => campusName(a).localeCompare(campusName(b)));

function DetailCard({ c, onClose }) {
  const { t, pick } = useLanguage();
  const tone = REGION_TONE[c.region];
  return (
    <motion.article
      key={c.id}
      initial={{ opacity: 0, x: -motionTokens.distance.lg }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, transition: { duration: motionTokens.duration.exit } }}
      transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
      className="rounded-[22px] border border-ink/15 bg-surface p-6 shadow-[0_24px_60px_-36px_rgba(19,35,63,.6)]"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-4">
        <ChapterLogo c={c} size={56} />
        <p className={cn('mr-auto mt-1 flex items-center gap-2 text-sm font-semibold', tone.text)}>
          <span className={cn('h-2 w-2 rounded-full', tone.dot)} aria-hidden="true" />
          {pick(REGION_LABELS[c.region])}
          <span className="text-muted-foreground">/ {isRegional(c) ? t('dir.kindCity') : t('dir.kindCampus')}</span>
        </p>
        <button type="button" onClick={onClose} className="-m-2 flex h-10 w-10 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink" aria-label={t('chapters.closeDetail')}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <h2 className="mt-3 font-display text-[32px] leading-tight text-ink">{campusName(c)}</h2>
      <p className="mt-1 text-lg font-medium text-ink/85">{c.chapterName}</p>
      <p className="text-muted-foreground">
        {c.city}, {c.state}
      </p>
      {c.description && <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-ink/80">{pick(c.description)}</p>}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to={chapterPath(c)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-merah px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.25)] transition-[background-color,transform] duration-150 hover:bg-[#B50F21] active:scale-[0.97]"
        >
          {t('chapters.openPage')}
          <IconArrowRight className="h-4 w-4" />
        </Link>
        {c.instagram && (
          <a
            href={instagramUrl(c.instagram)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-ink px-4 text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-merah active:scale-[0.97] dark:bg-white dark:text-[#0B1424] dark:hover:bg-merah dark:hover:text-white"
          >
            <IconInstagram className="h-4 w-4" />
            {c.instagram}
          </a>
        )}
        {c.website && (
          <a
            href={c.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border border-ink/15 px-4 text-sm font-semibold text-ink transition-[background-color,transform] duration-150 hover:bg-ink/5 active:scale-[0.97]"
          >
            {t('chapters.website')}
            <IconArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
      {c.sources?.length > 0 && (
        <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
          {c.status === 'verified' ? t('chapters.verified') : t('chapters.unverified')}{' '}
          {c.sources.map((s, k) => (
            <a key={s} href={s} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
              {k > 0 && ' '}[{k + 1}]
            </a>
          ))}
        </p>
      )}
    </motion.article>
  );
}

/**
 * Chapters: the map (zooms into the chosen state) beside a filterable directory.
 * URL params: state, chapter, q, region, near=1. Location stays on the device.
 */
export function Chapters() {
  const { t, lang, pick } = useLanguage();
  const [params, setParams] = useSearchParams();
  const stateId = params.get('state') || '';
  const chapterId = params.get('chapter') || '';
  const q = params.get('q') || '';
  const region = params.get('region') || '';
  const near = params.get('near') === '1';
  const geo = useGeolocation();
  const states = getStatesDropdown();
  const index = useMemo(() => buildSearchIndex(lang).filter((i) => i.category === 'chapters'), [lang]);
  const listRef = useRef(null);
  const { request: requestGeo } = geo;

  useEffect(() => {
    if (near) requestGeo();
  }, [near, requestGeo]);

  const set = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };

  const distances = useMemo(
    () => (geo.coords ? Object.fromEntries(nearestChapters(geo.coords.lat, geo.coords.lng, chapters.length).map((x) => [x.id, x.km])) : null),
    [geo.coords],
  );
  const userPoint = useMemo(() => {
    if (!geo.coords) return null;
    const p = projectToMap(geo.coords.lat, geo.coords.lng);
    return p ? { mapX: p.mapX ?? p.x ?? p[0], mapY: p.mapY ?? p.y ?? p[1] } : null;
  }, [geo.coords]);

  const results = useMemo(() => {
    let list = sorted;
    if (q.trim()) {
      const rank = new Map(searchIndex(q, index, 200).map((h, k) => [h.id, k]));
      list = list.filter((c) => rank.has(c.id)).sort((a, b) => rank.get(a.id) - rank.get(b.id));
    }
    if (stateId) list = list.filter((c) => c.stateId === stateId);
    if (region) list = list.filter((c) => c.region === region);
    if (distances) list = [...list].sort((a, b) => distances[a.id] - distances[b.id]);
    return list;
  }, [q, index, stateId, region, distances]);

  // search results and the selected chapter fly the map to where they are
  const focus = useMemo(() => {
    if (chapterId) return chapters.filter((c) => c.id === chapterId);
    if (q.trim() && results.length > 0 && results.length <= 15) return results;
    return undefined;
  }, [chapterId, q, results]);
  const highlight = useMemo(() => (q || region ? new Set(results.map((c) => c.id)) : undefined), [q, region, results]);
  const selected = chapters.find((c) => c.id === chapterId);
  const stateName = states.find((s) => s.id === stateId)?.label;

  return (
    <>
      <Seo title={pageTabTitle(t('chapters.title'))} description={t('chapters.metaDesc')} path="/chapters" />
      <PageHeader image="campus-stanford" title={t('chapters.title')} description={t('chapters.pageSub', { n: chapters.length, s: stateCount })} />

      <section className="container-x mt-10 md:mt-14" aria-label={t('chapters.title')}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start">
          {/* map column */}
          <div className="lg:sticky lg:top-24">
            <Reveal x={-24} className="rounded-[28px] border border-border bg-surface p-3 shadow-[0_30px_80px_-50px_rgba(19,35,63,.55)] sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-3">
                <p className="font-display text-2xl text-ink" aria-live="polite">
                  {selected ? `${selected.city}, ${selected.state}` : focus ? `“${q.trim()}”` : stateName || t('chapters.allUs')}
                </p>
                {(stateId || focus) && (
                  <button type="button" onClick={() => set({ state: '', chapter: '', q: '' })} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-ink/15 px-3.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5">
                    {t('chapters.zoomOut')}
                  </button>
                )}
              </div>
              <ChapterMap
                selectedState={stateId}
                selectedChapter={chapterId}
                focus={focus}
                highlight={highlight}
                userPoint={userPoint}
                onSelectState={(id) => set({ state: id, chapter: '' })}
                onSelectCluster={(items) => {
                  if (items.length === 1) set({ state: items[0].stateId, chapter: items[0].id });
                  else set({ state: items[0].stateId, chapter: '' });
                  listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              />
              <ul className="mt-3 flex flex-wrap gap-2 px-1">
                {REGIONS.map((r) => (
                  <li key={r}>
                    <button
                      type="button"
                      aria-pressed={region === r}
                      onClick={() => set({ region: region === r ? '' : r })}
                      className={cn(
                        'inline-flex min-h-[40px] items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97]',
                        region === r ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-[#0B1424]' : 'border-border text-ink/80 hover:border-ink/30 hover:text-ink',
                      )}
                    >
                      <span className={cn('h-2 w-2 rounded-full', REGION_TONE[r].dot)} aria-hidden="true" />
                      {pick(REGION_LABELS[r])}
                    </button>
                  </li>
                ))}
              </ul>
            </Reveal>
            <AnimatePresence mode="wait">{selected && <div className="mt-5"><DetailCard c={selected} onClose={() => set({ chapter: '' })} /></div>}</AnimatePresence>
          </div>

          {/* directory column */}
          <div ref={listRef} className="scroll-mt-24">
            <div className="grid gap-3">
              <div className="flex min-h-[54px] items-center gap-2 rounded-[14px] border border-ink/15 bg-surface px-4 focus-within:border-merah/60 focus-within:shadow-[0_0_0_4px_rgb(var(--merah)/0.12)]">
                <IconSearch className="h-5 w-5 shrink-0 text-ink/50" />
                <label htmlFor="chapters-q" className="sr-only">
                  {t('dir.searchLabel')}
                </label>
                <input
                  id="chapters-q"
                  type="search"
                  value={q}
                  onChange={(e) => set({ q: e.target.value })}
                  placeholder={t('dir.searchPh')}
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink/45"
                />
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                <div className="relative">
                  <label htmlFor="chapters-state" className="sr-only">
                    {t('home.finder.select')}
                  </label>
                  <select
                    id="chapters-state"
                    value={stateId}
                    onChange={(e) => set({ state: e.target.value, chapter: '' })}
                    className="h-[54px] w-full appearance-none rounded-[14px] border border-ink/15 bg-surface pl-4 pr-10 text-base text-ink outline-none focus:border-merah/60"
                  >
                    <option value="" className="bg-white text-[#13233F]">
                      {t('dir.allStates')}
                    </option>
                    {states.map((s) => (
                      <option key={s.id} value={s.id} className="bg-white text-[#13233F]">
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/55" />
                </div>
                <button
                  type="button"
                  onClick={() => (near ? requestGeo() : set({ near: '1' }))}
                  className="inline-flex h-[54px] items-center gap-2 rounded-[14px] border border-ink/15 px-4 text-[15px] font-semibold text-ink transition-[background-color,transform] duration-150 hover:bg-ink/5 active:scale-[0.97]"
                >
                  <IconLocate className="h-5 w-5 text-merah" />
                  <span className="hidden sm:inline">{geo.status === 'asking' ? t('home.finder.locating') : t('home.finder.near')}</span>
                  <span className="sr-only sm:hidden">{t('home.finder.near')}</span>
                </button>
              </div>
              {['denied', 'error', 'unavailable'].includes(geo.status) && (
                <p className="text-sm text-merah" role="alert">
                  {t(`home.finder.geo.${geo.status}`)}
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-b border-border pb-3">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {t('dir.count', { shown: results.length, n: chapters.length })}
              </p>
              {(q || stateId || region || near) && (
                <button type="button" onClick={() => setParams({}, { replace: true })} className="min-h-[40px] text-sm font-semibold text-merah hover:underline">
                  {t('dir.reset')}
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="mt-6 rounded-[18px] bg-ink/[0.03] p-8 text-center">
                <p className="font-display text-2xl text-ink">{t('dir.emptyTitle')}</p>
                <p className="mt-2 text-muted-foreground">{t('dir.emptySub')}</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {results.map((c, k) => {
                  const on = c.id === chapterId;
                  const tone = REGION_TONE[c.region];
                  return (
                    <motion.li
                      key={c.id}
                      initial={{ opacity: 0, x: k < 10 ? -motionTokens.distance.md : 0 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth, delay: Math.min(k, 10) * 0.03 }}
                      data-testid="chapter-row"
                    >
                      <button
                        type="button"
                        onClick={() => set({ state: c.stateId, chapter: c.id })}
                        aria-pressed={on}
                        className={cn(
                          'group flex w-full items-center gap-4 rounded-[14px] px-3 py-4 text-left transition-[background-color,transform] duration-150 active:scale-[0.99]',
                          on ? 'bg-merah/[0.07]' : 'hover:bg-ink/[0.035]',
                        )}
                      >
                        <span className={cn('h-10 w-1 shrink-0 rounded-full', tone.dot)} aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-[21px] leading-tight text-ink">{campusName(c)}</span>
                          <span className="block truncate text-sm text-muted-foreground">
                            {c.chapterName} / {c.city}, {c.state}
                          </span>
                        </span>
                        {distances && <span className="shrink-0 text-sm font-semibold tabular text-ink/70">{formatDistance(distances[c.id], lang)}</span>}
                        <IconArrowRight className={cn('h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1', on ? 'text-merah' : 'text-ink/35')} />
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            )}

            <div className="mt-8 rounded-[22px] bg-ink p-6 text-white dark:bg-white/[0.06]">
              <p className="font-display text-2xl">{t('home.join.title')}</p>
              <p className="mt-2 text-white/75">{t('home.join.sub')}</p>
              <Link to="/chapters/register" className="mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-[12px] bg-merah px-5 font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#a90d26] active:scale-[0.97]">
                {t('chapters.register')}
                <IconArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { useId, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useGeolocation } from '../../hooks/useGeolocation.js';
import { chapters, formatDistance, getStatesDropdown, instagramUrl, nearestChapters, REGION_LABELS, REGIONS } from '../../data/chapters.js';
import { motionTokens } from '../../lib/motion.js';
import { buildSearchIndex, fold, searchIndex } from '../../utils/searchIndex.js';
import { cn } from '../../utils/cn.js';
import { IconArrowRight, IconChevronDown, IconInstagram, IconLocate, IconMap, IconSearch } from '../ui/Icons.jsx';
import { Spinner } from '../ui/Button.jsx';
import { campusName, isRegional } from '../../lib/campus.js';

const letterOf = (c) => fold(campusName(c)).charAt(0).toUpperCase();
const sorted = [...chapters].sort((a, b) => campusName(a).localeCompare(campusName(b)));
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const PAGE = 12;

function ChapterCard({ c, index, distance }) {
  const { t, pick } = useLanguage();
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, x: index < 8 ? -motionTokens.distance.lg : 0 }}
      animate={{ opacity: 1, x: 0, transition: { duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth, delay: Math.min(index, 8) * 0.035 } }}
      exit={{ opacity: 0, transition: { duration: motionTokens.duration.exit } }}
      data-testid="chapter-card"
    >
      <div className="flex h-full flex-col rounded-[18px] border border-border bg-surface p-5 transition-colors duration-200 hover:border-ink/25">
        <p className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
          {pick(REGION_LABELS[c.region])}
          {distance != null && <span className="tabular">/ {distance}</span>}
        </p>
        <h3 className="mt-3 font-display text-[22px] leading-tight text-ink">{campusName(c)}</h3>
        <p className="mt-1 text-[16px] font-medium text-ink/80">{c.chapterName}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {c.city}, {c.state}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          <Link
            to={`/chapters?state=${c.stateId}&chapter=${c.id}`}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[10px] border border-border px-3 text-sm font-semibold text-ink transition-colors duration-150 hover:border-ink/30"
          >
            <IconMap className="h-4 w-4" />
            {t('dir.onMap')}
          </Link>
          {c.instagram && (
            <a
              href={instagramUrl(c.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[10px] border border-border px-3 text-sm font-medium text-ink/80 transition-colors hover:border-ink/30 hover:text-ink"
              aria-label={t('dir.instagramOf', { name: c.chapterName })}
            >
              <IconInstagram className="h-4 w-4" />
              {c.instagram}
            </a>
          )}
        </div>
      </div>
    </motion.li>
  );
}

/**
 * The chapter directory, right under the slideshow: search, state (with the fixed "Go to map" finder),
 * region, campus vs city chapters, an A to Z bar and a result grid. Everything filters live.
 */
export function ChapterDirectory() {
  const { t, lang, pick } = useLanguage();
  const navigate = useNavigate();
  const ids = useId();
  const [q, setQ] = useState('');
  const [stateId, setStateId] = useState('');
  const [region, setRegion] = useState('');
  const [kind, setKind] = useState('all');
  const [letter, setLetter] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState('');
  const geo = useGeolocation();
  const states = getStatesDropdown();
  const index = useMemo(() => buildSearchIndex(lang).filter((i) => i.category === 'chapters'), [lang]);

  const distances = useMemo(() => {
    if (!geo.coords) return null;
    return Object.fromEntries(nearestChapters(geo.coords.lat, geo.coords.lng, chapters.length).map((x) => [x.id, x.km]));
  }, [geo.coords]);

  const results = useMemo(() => {
    let list = sorted;
    if (q.trim()) {
      const hits = searchIndex(q, index, 200).map((h) => h.id);
      const rank = new Map(hits.map((id, k) => [id, k]));
      list = list.filter((c) => rank.has(c.id)).sort((a, b) => rank.get(a.id) - rank.get(b.id));
    }
    if (stateId) list = list.filter((c) => c.stateId === stateId);
    if (region) list = list.filter((c) => c.region === region);
    if (kind !== 'all') list = list.filter((c) => (kind === 'city' ? isRegional(c) : !isRegional(c)));
    if (letter) list = list.filter((c) => letterOf(c) === letter);
    if (distances) list = [...list].sort((a, b) => distances[a.id] - distances[b.id]);
    return list;
  }, [q, index, stateId, region, kind, letter, distances]);

  const lettersWith = useMemo(() => new Set(sorted.map(letterOf)), []);
  const shown = showAll ? results : results.slice(0, PAGE);
  const filtered = q || stateId || region || kind !== 'all' || letter || distances;

  const reset = () => {
    setQ('');
    setStateId('');
    setRegion('');
    setKind('all');
    setLetter('');
    setError('');
  };

  const goState = (e) => {
    e.preventDefault();
    if (!stateId) {
      setError(t('home.finder.pickFirst'));
      return;
    }
    navigate(`/chapters?state=${stateId}`);
  };

  return (
    <section id="cari-chapter" className="relative z-10 scroll-mt-24" aria-labelledby={`${ids}-title`}>
      <div className="container-x -mt-16 md:-mt-24">
        <div className="rounded-[28px] border border-border bg-surface p-5 shadow-soft sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-display text-[22px] text-muted-foreground">{t('dir.word')}</p>
              <h2 id={`${ids}-title`} className="mt-1 display-lg text-ink">
                {t('home.finder.title')}
              </h2>
              <p className="mt-3 max-w-[60ch] text-[17px] leading-relaxed text-muted-foreground">{t('dir.sub', { n: chapters.length })}</p>
            </div>
            <button
              type="button"
              onClick={() => geo.request()}
              className="inline-flex min-h-[48px] shrink-0 items-center gap-2 self-start rounded-[12px] border border-ink/15 px-4 text-[15px] font-semibold text-ink transition-[background-color,transform] duration-150 hover:bg-ink/[0.04] active:scale-[0.97] lg:self-auto"
            >
              {geo.status === 'asking' ? <Spinner className="h-5 w-5 text-accent" /> : <IconLocate className="h-5 w-5 text-accent" />}
              {geo.status === 'asking' ? t('home.finder.locating') : distances ? t('dir.sortedByDistance') : t('home.finder.near')}
            </button>
          </div>
          {['denied', 'error', 'unavailable'].includes(geo.status) && (
            <p className="mt-3 text-sm text-accent" role="alert">
              {t(`home.finder.geo.${geo.status}`)}
            </p>
          )}

          {/* controls */}
          <div className="mt-7 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="flex min-h-[54px] items-center gap-2 rounded-[14px] border border-ink/15 bg-surface px-4 focus-within:border-accent/60 focus-within:ring-4 focus-within:ring-accent/10">
              <IconSearch className="h-5 w-5 shrink-0 text-ink/50" />
              <label htmlFor={`${ids}-q`} className="sr-only">
                {t('dir.searchLabel')}
              </label>
              <input
                id={`${ids}-q`}
                type="search"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setLetter('');
                }}
                placeholder={t('dir.searchPh')}
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink/45"
              />
            </div>
            <form onSubmit={goState} className="flex gap-2" noValidate>
              <div className="relative min-w-0 flex-1">
                <label htmlFor="chapter-state" className="sr-only">
                  {t('home.finder.select')}
                </label>
                <select
                  id="chapter-state"
                  value={stateId}
                  onChange={(e) => {
                    setStateId(e.target.value);
                    setError('');
                  }}
                  className="h-[54px] w-full appearance-none rounded-[14px] border border-ink/15 bg-surface pl-4 pr-10 text-base text-ink outline-none focus:border-accent/60 focus:ring-4 focus:ring-accent/10"
                  aria-invalid={error ? 'true' : undefined}
                  aria-describedby={error ? `${ids}-err` : undefined}
                >
                  <option value="" className="bg-white text-night">
                    {t('dir.allStates')}
                  </option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id} className="bg-white text-night">
                      {s.label}
                    </option>
                  ))}
                </select>
                <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/55" />
              </div>
              <button
                type="submit"
                className="inline-flex h-[54px] shrink-0 items-center gap-2 rounded-[14px] bg-accent px-5 text-[15px] font-semibold text-on-accent transition-[background-color,transform] duration-150 hover:bg-accent/90 active:scale-[0.97]"
              >
                {t('home.finder.go')}
                <IconArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
          {error && (
            <p id={`${ids}-err`} className="mt-2 text-sm font-medium text-accent" role="alert">
              {error}
            </p>
          )}

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label={t('chapters.filterRegion')}>
              {['', ...REGIONS].map((r) => {
                const on = region === r;
                return (
                  <button
                    key={r || 'all'}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setRegion(r)}
                    className={cn(
                      'inline-flex min-h-[40px] items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97]',
                      on ? 'border-ink bg-ink text-background' : 'border-border text-ink/80 hover:border-ink/30 hover:text-ink',
                    )}
                  >
                    {r ? pick(REGION_LABELS[r]) : t('dir.allRegions')}
                  </button>
                );
              })}
            </div>
            <div className="flex rounded-full bg-ink/[0.05] p-1" role="group" aria-label={t('dir.kind')}>
              {[
                ['all', t('dir.kindAll')],
                ['campus', t('dir.kindCampus')],
                ['city', t('dir.kindCity')],
              ].map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={kind === v}
                  onClick={() => setKind(v)}
                  className={cn(
                    'min-h-[36px] rounded-full px-3.5 text-sm font-semibold transition-[background-color,color] duration-150',
                    kind === v ? 'bg-surface text-ink shadow-soft' : 'text-ink/65 hover:text-ink',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* A to Z */}
          <nav className="-mx-1 mt-4 overflow-x-auto pb-1" aria-label={t('dir.az')}>
            <ul className="flex min-w-max gap-0.5 px-1">
              {LETTERS.map((L) => {
                const has = lettersWith.has(L);
                return (
                  <li key={L}>
                    <button
                      type="button"
                      disabled={!has}
                      aria-pressed={letter === L}
                      onClick={() => {
                        setLetter(letter === L ? '' : L);
                        setQ('');
                      }}
                      className={cn(
                        'h-10 w-9 rounded-[10px] text-[15px] font-semibold tabular transition-[background-color,color] duration-150',
                        letter === L ? 'bg-accent text-on-accent' : has ? 'text-ink/80 hover:bg-ink/[0.06] hover:text-ink' : 'cursor-default text-ink/25',
                      )}
                    >
                      {L}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {t('dir.count', { shown: shown.length, n: results.length })}
            </p>
            {filtered && (
              <button type="button" onClick={reset} className="min-h-[40px] text-sm font-semibold text-accent underline-offset-4 hover:underline">
                {t('dir.reset')}
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="mt-6 rounded-[18px] bg-ink/[0.03] p-8 text-center">
              <p className="font-display text-2xl text-ink">{t('dir.emptyTitle')}</p>
              <p className="mt-2 text-muted-foreground">{t('dir.emptySub')}</p>
              <Link to="/chapters/register" className="mt-4 inline-flex min-h-[44px] items-center gap-2 font-semibold text-accent">
                {t('chapters.register')}
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence initial={false} mode="popLayout">
                {shown.map((c, k) => (
                  <ChapterCard key={c.id} c={c} index={k} distance={distances ? formatDistance(distances[c.id], lang) : null} />
                ))}
              </AnimatePresence>
            </ul>
          )}

          {results.length > PAGE && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="inline-flex min-h-[48px] items-center rounded-[12px] border border-ink/15 px-5 text-[15px] font-semibold text-ink transition-[background-color,transform] duration-150 hover:bg-ink/[0.04] active:scale-[0.97]"
              >
                {showAll ? t('dir.showLess') : t('dir.showAll', { n: results.length })}
              </button>
              <Link
                to="/chapters"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-[12px] px-4 text-[15px] font-semibold text-accent transition-transform duration-150 active:scale-[0.97]"
              >
                {t('dir.fullMap')}
                <IconArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

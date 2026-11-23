import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useUi } from '../../context/UiContext.jsx';
import { buildSearchIndex, searchIndex } from '../../utils/searchIndex.js';
import { motionTokens } from '../../lib/motion.js';
import { Sheet } from '../ui/Sheet.jsx';
import { IconArrowRight, IconBook, IconCalendar, IconClose, IconInfo, IconLocate, IconMap, IconPin, IconSearch, IconUsers } from '../ui/Icons.jsx';
import { cn } from '../../utils/cn.js';

const GROUP_ORDER = ['places', 'chapters', 'events', 'resources', 'team', 'pages'];
const GROUP_ICON = { places: IconPin, chapters: IconMap, events: IconCalendar, resources: IconBook, team: IconUsers, pages: IconInfo };
const SUGGESTIONS = {
  en: ['Boston', 'California', 'UCLA', 'scholarships', 'visa', 'embassy', 'Seattle', 'webinar'],
  id: ['Boston', 'California', 'UCLA', 'beasiswa', 'visa', 'kedutaan', 'Seattle', 'webinar'],
};

function Highlighted({ text, ranges }) {
  if (!ranges?.length) return text;
  const parts = [];
  let i = 0;
  ranges.forEach(([a, b], k) => {
    if (a > i) parts.push(text.slice(i, a));
    parts.push(
      <mark key={k} className="rounded-[4px] bg-merah/15 px-0.5 text-inherit">
        {text.slice(a, b)}
      </mark>,
    );
    i = b;
  });
  parts.push(text.slice(i));
  return parts;
}

export function SearchPalette() {
  const { t, lang } = useLanguage();
  const { overlay, closeOverlay, searchSeed } = useUi();
  const open = overlay === 'search';
  return (
    <Sheet open={open} onClose={closeOverlay} labelledBy="search-title" variant="center" panelClassName="max-w-[680px]">
      {open && <SearchBody key={searchSeed} seed={searchSeed} t={t} lang={lang} onClose={closeOverlay} />}
    </Sheet>
  );
}

function SearchBody({ seed, t, lang, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listId = useId();
  const [q, setQ] = useState(seed || '');
  const dq = useDeferredValue(q);
  const [active, setActive] = useState(0);
  const index = useMemo(() => buildSearchIndex(lang), [lang]);
  const results = useMemo(() => searchIndex(dq, index, 36), [dq, index]);

  // keep groups in a stable order, cap each group so places/chapters don't drown the rest
  const grouped = useMemo(() => {
    const g = {};
    for (const r of results) (g[r.category] ||= []).push(r);
    return GROUP_ORDER.filter((k) => g[k]?.length).map((k) => ({ key: k, items: g[k].slice(0, k === 'chapters' ? 8 : 5) }));
  }, [results]);
  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const go = (href) => {
    onClose();
    navigate(href);
  };

  const onKeyDown = (e) => {
    if (!flat.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % flat.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + flat.length) % flat.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const r = flat[Math.min(active, flat.length - 1)];
      if (r) go(r.href);
    }
  };

  useEffect(() => {
    document.getElementById(`${listId}-opt-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, listId]);

  const offsets = grouped.reduce((acc, g, gi) => [...acc, gi === 0 ? 0 : acc[gi - 1] + grouped[gi - 1].items.length], []);
  return (
    <div className="flex max-h-[min(78vh,720px)] flex-col">
      <h2 id="search-title" className="sr-only">
        {t('search.title')}
      </h2>
      <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4 dark:border-white/10">
        <IconSearch className="h-5 w-5 shrink-0 text-ink/60" />
        <label htmlFor="site-search" className="sr-only">
          {t('search.placeholder')}
        </label>
        <input
          id="site-search"
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={t('search.placeholder')}
          autoComplete="off"
          spellCheck="false"
          role="combobox"
          aria-expanded={flat.length > 0}
          aria-controls={listId}
          aria-activedescendant={flat.length ? `${listId}-opt-${active}` : undefined}
          className="min-w-0 flex-1 bg-transparent text-[17px] font-medium text-ink outline-none placeholder:text-ink/50"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ('');
              inputRef.current?.focus();
            }}
            className="rounded-full p-2 text-ink/60 hover:bg-ink/5 hover:text-ink"
            aria-label={t('search.clear')}
          >
            <IconClose className="h-4 w-4" />
          </button>
        )}
        <button type="button" onClick={onClose} className="rounded-control px-2.5 py-1.5 text-sm font-semibold text-ink/70 hover:bg-ink/5 hover:text-ink">
          {t('search.cancel')}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2">
        {!q.trim() && (
          <div className="p-3">
            <button
              type="button"
              onClick={() => go('/chapters?near=1')}
              className="flex w-full items-center gap-3 rounded-[18px] bg-white/70 p-3 text-left transition-colors hover:bg-white dark:bg-white/5 dark:hover:bg-white/10"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-merah text-white">
                <IconLocate className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold text-ink">{t('search.near')}</span>
                <span className="block text-sm text-muted-foreground">{t('search.near.sub')}</span>
              </span>
            </button>
            <p className="mt-5 px-1 text-sm font-semibold text-muted-foreground">{t('search.try')}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS[lang].map((s) => (
                <button key={s} type="button" className="chip" onClick={() => setQ(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {q.trim() && !flat.length && (
          <div className="px-4 py-10 text-center">
            <p className="font-semibold text-ink">{t('search.empty.title', { q: q.trim() })}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('search.empty.sub')}</p>
          </div>
        )}

        <ul id={listId} role="listbox" aria-label={t('search.title')}>
          <AnimatePresence initial={false}>
            {grouped.map((g, gi) => {
              const GIcon = GROUP_ICON[g.key];
              return (
                <li key={g.key} role="presentation" className="pb-1">
                  <p className="px-3 pb-1 pt-3 text-[13px] font-semibold text-muted-foreground" role="presentation">
                    {t(`search.groups.${g.key}`)}
                  </p>
                  <ul role="group" aria-label={t(`search.groups.${g.key}`)}>
                    {g.items.map((r, ri) => {
                      const i = offsets[gi] + ri;
                      const isActive = i === active;
                      return (
                        <motion.li
                          key={r.id}
                          id={`${listId}-opt-${i}`}
                          role="option"
                          aria-selected={isActive}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, transition: { duration: motionTokens.duration.instant } }}
                          transition={{ duration: motionTokens.duration.fast }}
                          onMouseMove={() => setActive(i)}
                          onClick={() => go(r.href)}
                          className={cn(
                            'flex cursor-pointer items-center gap-3 rounded-[16px] px-3 py-2.5',
                            isActive ? 'bg-white shadow-[0_4px_14px_-6px_rgba(15,27,45,.25)] dark:bg-white/10' : '',
                          )}
                        >
                          <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]', isActive ? 'bg-merah text-white' : 'bg-ink/[0.06] text-ink/70 dark:bg-white/10')}>
                            <GIcon className="h-[18px] w-[18px]" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold text-ink">
                              <Highlighted text={r.title} ranges={r.ranges} />
                            </span>
                            {r.subtitle && <span className="block truncate text-sm text-muted-foreground">{r.subtitle}</span>}
                          </span>
                          {isActive && <IconArrowRight className="h-4 w-4 shrink-0 text-ink/50" />}
                        </motion.li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
      <div className="hidden items-center gap-4 border-t border-ink/10 px-5 py-2.5 text-xs text-muted-foreground sm:flex dark:border-white/10">
        <span>
          <kbd className="rounded bg-ink/10 px-1.5 py-0.5 font-sans">↑</kbd> <kbd className="rounded bg-ink/10 px-1.5 py-0.5 font-sans">↓</kbd> {t('search.kbd.move')}
        </span>
        <span>
          <kbd className="rounded bg-ink/10 px-1.5 py-0.5 font-sans">Enter</kbd> {t('search.kbd.open')}
        </span>
        <span>
          <kbd className="rounded bg-ink/10 px-1.5 py-0.5 font-sans">Esc</kbd> {t('search.kbd.close')}
        </span>
        <span className="ml-auto tabular">{q.trim() ? t('search.count', { n: results.length }) : ''}</span>
      </div>
    </div>
  );
}

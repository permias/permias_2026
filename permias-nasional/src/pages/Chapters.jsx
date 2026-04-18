import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { chapters, chaptersByStateId, REGIONS } from '../data/chapters.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo, pageTabTitle } from '../components/Seo.jsx';
import { USMap } from '../components/chapters/USMap.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { ScrollReveal } from '../components/ui/ScrollReveal.jsx';
import { cn } from '../utils/cn.js';

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
      <div className="border-b border-brand-charcoal/10 bg-white py-14 dark:border-white/10 dark:bg-surface-dark">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t('chapters.title')}</h1>
            <p className="mt-4 max-w-3xl text-lg text-brand-charcoal/75 dark:text-white/75">{t('chapters.sub')}</p>
            <p className="mt-2 text-base font-semibold text-brand-red">{t('chapters.register.line')}</p>
            <div className="mt-6">
              <Button as="a" href="https://forms.gle/bx9bQx9eRBDgLTy57" target="_blank" rel="noopener noreferrer">
                {t('chapters.register')}
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div id="chapters-map" className="relative mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
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
            className={cn(
              'fixed inset-y-0 right-0 z-40 w-full max-w-sm transform border-l border-brand-charcoal/10 bg-white shadow-2xl transition-transform duration-300 dark:border-white/10 dark:bg-surface-card lg:static lg:z-0 lg:max-w-none lg:translate-x-0 lg:border lg:shadow-none',
              selectedStateId ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
            )}
            aria-label={t('chapters.sidebar.title')}
          >
            <div className="flex h-full flex-col overflow-y-auto p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-lg font-bold">
                  {t('chapters.sidebar.title')} {selectedStateId ? selectedStateId.toUpperCase() : '—'}
                </h2>
                <button
                  type="button"
                  className="rounded-lg px-2 py-1 text-sm font-semibold text-brand-red lg:hidden"
                  onClick={() => setSelectedState('')}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {selectedList.length === 0 && (
                  <p className="text-sm text-brand-charcoal/70 dark:text-white/70">{t('chapters.sidebar.empty')}</p>
                )}
                {selectedList.map((c) => (
                  <div key={c.id} className="rounded-xl border border-brand-charcoal/10 p-4 text-sm dark:border-white/10">
                    <p className="font-display font-bold">{c.chapterName}</p>
                    <p className="text-xs text-brand-charcoal/60 dark:text-white/60">{c.university}</p>
                    <p className="mt-1 text-xs">
                      {c.city}, {c.state}
                    </p>
                    <p className="mt-2 text-xs">
                      IG:{' '}
                      <a className="font-semibold text-brand-red" href={`https://instagram.com/${c.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                        {c.instagram}
                      </a>
                    </p>
                    <p className="text-xs">
                      Email:{' '}
                      <a className="text-brand-red underline" href={`mailto:${c.email}`}>
                        {c.email}
                      </a>
                    </p>
                    <Button as="a" href={c.website} target="_blank" rel="noopener noreferrer" className="mt-3 w-full !py-2 text-xs">
                      {t('chapters.visit')}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
        {/* Mobile overlay when sidebar open */}
        {selectedStateId && (
          <button
            type="button"
            aria-label="Close chapter list"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSelectedState('')}
          />
        )}
      </div>

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
                    <img src={c.logoUrl} alt="" className="h-14 w-14 rounded-xl object-cover" />
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

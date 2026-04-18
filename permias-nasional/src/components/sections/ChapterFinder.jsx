import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatesDropdown } from '../../data/chapters.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Button } from '../ui/Button.jsx';
import { ScrollReveal } from '../ui/ScrollReveal.jsx';

export function ChapterFinder() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stateId, setStateId] = useState('');
  const options = getStatesDropdown();

  const go = () => {
    if (!stateId) return;
    navigate(`/chapters?state=${stateId}`);
  };

  return (
    <section className="bg-brand-red py-20 text-white md:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col gap-8 rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur md:flex-row md:items-end md:justify-between md:p-10 lg:p-12">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{t('home.finder.title')}</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">{t('home.finder.sub')}</p>
            </div>
            <div className="flex w-full flex-col gap-4 md:w-auto md:min-w-[280px] md:flex-row">
              <label className="sr-only" htmlFor="chapter-state">
                {t('home.finder.select')}
              </label>
              <select
                id="chapter-state"
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                className="w-full rounded-xl border border-white/30 bg-white/10 px-4 py-4 text-base font-semibold text-white outline-none md:min-w-[260px] md:text-lg"
              >
                <option value="">{t('home.finder.select')}</option>
                {options.map((o) => (
                  <option key={o.id} value={o.id} className="text-brand-charcoal">
                    {o.label} ({o.count})
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="ghost"
                className="!border-white !px-8 !py-4 !text-base !text-white hover:!bg-white/20 md:!text-lg"
                onClick={go}
              >
                {t('home.finder.go')}
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

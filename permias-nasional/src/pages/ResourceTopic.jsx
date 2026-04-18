import { useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { resourceSections } from '../data/resources.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { ResourceSectionBody } from '../components/resources/ResourceSectionBody.jsx';
import { Input } from '../components/ui/Input.jsx';
import { ScrollReveal } from '../components/ui/ScrollReveal.jsx';

const VALID_IDS = new Set(resourceSections.map((s) => s.id));

export function ResourceTopic() {
  const { topicId: raw } = useParams();
  const topicId = raw === 'visaprocess' ? 'visa' : raw;
  const { t, lang } = useLanguage();
  const [q, setQ] = useState('');

  const sec = useMemo(() => resourceSections.find((s) => s.id === topicId), [topicId]);

  const filteredCards = useMemo(() => {
    if (!sec) return null;
    const query = q.trim().toLowerCase();
    if (!query) return sec.cards;
    return sec.cards.filter((c) => {
      const desc =
        typeof c.description === 'string' ? c.description : `${c.description?.en ?? ''} ${c.description?.id ?? ''}`;
      const hay = `${c.title} ${desc} ${(c.keywords || []).join(' ')}`.toLowerCase();
      return hay.includes(query);
    });
  }, [sec, q]);

  if (!topicId || !VALID_IDS.has(topicId)) {
    return <Navigate to="/resources" replace />;
  }

  const section = sec ? { ...sec, cards: filteredCards ?? sec.cards } : null;

  return (
    <>
      <Seo
        title={`${section?.title[lang] ?? section?.title.en ?? 'Resources'} | PERMIAS Nasional`}
        description={t('resources.sub')}
        path={`/resources/${topicId}`}
      />
      <div className="border-b border-brand-charcoal/10 bg-white py-12 dark:border-white/10 dark:bg-surface-dark sm:py-14">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {section?.title[lang] ?? section?.title.en}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-brand-charcoal/75 dark:text-white/75">{t('resources.sub')}</p>
          </ScrollReveal>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('resources.search')} className="max-w-xl" />
        {section && (
          <div className="mt-10">
            {q.trim() && filteredCards?.length === 0 ? (
              <p className="text-sm text-brand-charcoal/65 dark:text-white/65">{t('search.empty')}</p>
            ) : (
              <ResourceSectionBody
                sec={{ ...section, cards: filteredCards ?? section.cards }}
                lang={lang}
                t={t}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

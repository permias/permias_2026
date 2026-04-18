import { useMemo, useState } from 'react';
import { posts } from '../data/posts.js';
import { formatDate } from '../utils/formatDate.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { ScrollReveal } from '../components/ui/ScrollReveal.jsx';
import { InstagramGrid } from '../components/sections/InstagramGrid.jsx';

function variant(type) {
  if (type === 'event') return 'event';
  if (type === 'opportunity') return 'opportunity';
  return 'announcement';
}

function label(t, type) {
  if (type === 'event') return t('badge.event');
  if (type === 'opportunity') return t('badge.opportunity');
  return t('badge.announcement');
}

export function Events() {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState('upcoming');

  const filtered = useMemo(() => {
    const now = new Date();
    return posts.filter((p) => {
      const d = new Date(p.date);
      if (tab === 'upcoming') return d >= now;
      if (tab === 'past') return d < now;
      return true;
    });
  }, [tab]);

  return (
    <>
      <Seo title="Events & Posts | PERMIAS Nasional" description="National events, announcements, and opportunities." path="/events" />
      <div className="border-b border-brand-charcoal/10 bg-white py-14 dark:border-white/10 dark:bg-surface-dark">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t('events.title')}</h1>
            <p className="mt-4 max-w-3xl text-lg text-brand-charcoal/75 dark:text-white/75">{t('events.sub')}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {['upcoming', 'past', 'all'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    tab === key ? 'bg-brand-red text-white' : 'bg-black/5 text-brand-charcoal dark:bg-white/10 dark:text-white'
                  }`}
                >
                  {t(`events.tab.${key}`)}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="mx-auto max-w-content space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        {filtered.map((post, i) => (
          <ScrollReveal key={post.id} staggerIndex={i % 5}>
            <Card className="overflow-hidden border-brand-charcoal/10 p-0 dark:border-white/10">
              <div className="grid gap-0 md:grid-cols-[280px_1fr]">
                <img src={post.imageUrl} alt="" className="h-48 w-full object-cover md:h-full" />
                <div className="p-6">
                  <Badge variant={variant(post.type)}>{label(t, post.type)}</Badge>
                  <h2 className="mt-3 font-display text-2xl font-bold">{post.title}</h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-charcoal/50 dark:text-white/50">
                    {formatDate(post.date, lang === 'id' ? 'id-ID' : 'en-US')} · {post.location}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-brand-charcoal/80 dark:text-white/80">{post.description}</p>
                  {post.externalLink && (
                    <Button as="a" href={post.externalLink} target="_blank" rel="noopener noreferrer" className="mt-6">
                      {t('events.rsvp')}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      <InstagramGrid headingKey="events.ig.title" />
    </>
  );
}

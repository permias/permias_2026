import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../data/posts.js';
import { formatDate } from '../utils/formatDate.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { pageTabTitle } from '../utils/seo.js';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { PAGE_PHOTOS } from '../data/photos.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { cn } from '../utils/cn.js';

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

function posterColumnClass(aspect) {
  if (aspect === 'portrait') return 'md:w-48 lg:w-56';
  if (aspect === 'square') return 'md:w-52 lg:w-60';
  return 'md:w-80 lg:w-96';
}

function EventPoster({ imageUrl, imageAspect = 'landscape' }) {
  return (
    <div
      className={cn(
        'flex w-full shrink-0 items-center justify-center bg-black/[0.03] dark:bg-white/[0.04]',
        posterColumnClass(imageAspect),
        imageAspect !== 'landscape' && 'p-3 md:p-4',
      )}
    >
      <img
        src={imageUrl}
        alt=""
        className={cn(
          'w-full',
          imageAspect === 'landscape' && 'aspect-video object-cover md:aspect-auto md:min-h-[11rem] md:object-cover lg:min-h-[12.5rem]',
          imageAspect === 'portrait' && 'max-h-72 object-contain sm:max-h-80 md:max-h-[22rem] md:min-h-[18rem]',
          imageAspect === 'square' && 'aspect-square max-h-72 object-contain md:max-h-none md:min-h-[14rem]',
        )}
        loading="lazy"
      />
    </div>
  );
}

export function Events() {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState('all');

  const filtered = useMemo(() => {
    const now = new Date();
    const list = posts.filter((p) => {
      const d = new Date(p.date);
      if (tab === 'upcoming') return d >= now;
      if (tab === 'past') return d < now;
      return true;
    });
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [tab]);

  return (
    <>
      <Seo title={pageTabTitle('Events & Posts')} description="National events, announcements, and opportunities." path="/events" />
      <PageHeader image={PAGE_PHOTOS.events} title={t('events.title')} description={t('events.sub')}>
        <div className="mt-8 flex flex-wrap gap-2">
          {['upcoming', 'past', 'all'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'rounded-lg border px-4 py-2 text-sm font-medium transition',
                tab === key
                  ? 'border-merah bg-merah text-white shadow-soft'
                  : 'border-border bg-card text-muted-foreground hover:border-merah/30 hover:text-foreground',
              )}
            >
              {t(`events.tab.${key}`)}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-content space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <p className="text-center text-ink/60 dark:text-white/60">{t('events.empty')}</p>
        ) : (
          filtered.map((post, i) => (
            <Reveal key={post.id} delay={Math.min(i % 5, 8) * 0.06}>
              <Card className="overflow-hidden border-ink/10 p-0 dark:border-white/10">
                <div className="grid gap-0 md:grid-cols-[auto_1fr]">
                  <EventPoster imageUrl={post.imageUrl} imageAspect={post.imageAspect} />
                  <div className="p-6">
                    <Badge variant={variant(post.type)}>{label(t, post.type)}</Badge>
                    <h2 className="mt-3 font-display text-2xl font-bold">{post.title}</h2>
                    <p className="mt-1 text-xs font-semibold text-ink/50 dark:text-white/50">
                      {formatDate(post.date, lang === 'id' ? 'id-ID' : 'en-US')} · {post.location}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-ink/80 dark:text-white/80">{post.description}</p>
                    {post.externalLink &&
                      (post.externalLink.startsWith('/') ? (
                        <Button as={Link} to={post.externalLink} className="mt-6">
                          {t('events.rsvp')}
                        </Button>
                      ) : (
                        <Button as="a" href={post.externalLink} target="_blank" rel="noopener noreferrer" className="mt-6">
                          {t('events.rsvp')}
                        </Button>
                      ))}
                  </div>
                </div>
              </Card>
            </Reveal>
          ))
        )}
        <Reveal>
          <div className="border-t border-ink/10 pt-10 text-center dark:border-white/10">
            <p className="text-ink/70 dark:text-white/70">{t('events.ig.more')}</p>
            <Button
              as="a"
              href="https://www.instagram.com/permias.nasional/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4"
            >
              {t('events.ig.follow')}
            </Button>
          </div>
        </Reveal>
      </div>
    </>
  );
}

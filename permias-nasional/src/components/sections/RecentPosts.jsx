import { Link } from 'react-router-dom';
import { getRecentPosts } from '../../data/posts.js';
import { formatDate } from '../../utils/formatDate.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Card } from '../ui/Card.jsx';
import { ScrollReveal } from '../ui/ScrollReveal.jsx';

function typeVariant(type) {
  if (type === 'event') return 'event';
  if (type === 'opportunity') return 'opportunity';
  return 'announcement';
}

function typeLabel(t, type) {
  if (type === 'event') return t('badge.event');
  if (type === 'opportunity') return t('badge.opportunity');
  return t('badge.announcement');
}

export function RecentPosts() {
  const { t, lang } = useLanguage();
  const recent = getRecentPosts(3);

  return (
    <section className="bg-white py-24 dark:bg-surface-dark md:py-28">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <ScrollReveal>
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{t('home.posts.title')}</h2>
          </ScrollReveal>
          <ScrollReveal staggerIndex={1}>
            <Link
              to="/events"
              className="text-base font-bold text-brand-red underline-offset-4 hover:underline md:text-lg"
            >
              {t('home.posts.more')}
            </Link>
          </ScrollReveal>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {recent.map((post, i) => (
            <ScrollReveal key={post.id} staggerIndex={i}>
              <Card className="flex h-full flex-col overflow-hidden p-0 dark:border-white/10">
                <img
                  src={post.imageUrl}
                  alt=""
                  className="h-52 w-full object-cover md:h-56"
                  loading="lazy"
                />
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <Badge variant={typeVariant(post.type)} className="!text-xs md:!text-sm">
                    {typeLabel(t, post.type)}
                  </Badge>
                  <h3 className="mt-4 font-display text-xl font-bold leading-snug md:text-2xl">{post.title}</h3>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-brand-charcoal/55 dark:text-white/55 md:text-base">
                    {formatDate(post.date, lang === 'id' ? 'id-ID' : 'en-US')}
                  </p>
                  <p className="mt-4 line-clamp-3 flex-1 text-base leading-relaxed text-brand-charcoal/80 dark:text-white/80 md:text-lg">
                    {post.description}
                  </p>
                  <Link
                    to="/events"
                    className="mt-5 text-base font-bold text-brand-red underline-offset-4 hover:underline md:text-lg"
                  >
                    {t('home.posts.read')}
                  </Link>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

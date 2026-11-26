import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { posts } from '../data/posts.js';
import { publicUrl } from '../utils/site.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { pageTabTitle } from '../utils/seo.js';
import { PAGE_PHOTOS } from '../data/photos.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { SectionHead } from '../components/ui/Section.jsx';
import { IconArrowUpRight, IconCalendar, IconInstagram, IconPin } from '../components/ui/Icons.jsx';
import { motionTokens, springs } from '../lib/motion.js';
import { cn } from '../utils/cn.js';

const TABS = ['upcoming', 'past', 'all'];

function useDate(lang) {
  const loc = lang === 'id' ? 'id-ID' : 'en-US';
  return (iso) => {
    const d = new Date(iso);
    return {
      day: d.toLocaleDateString(loc, { day: 'numeric' }),
      month: d.toLocaleDateString(loc, { month: 'short' }),
      monthYear: d.toLocaleDateString(loc, { month: 'long', year: 'numeric' }),
      weekday: d.toLocaleDateString(loc, { weekday: 'long' }),
      full: d.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    };
  };
}

function TabBar({ tab, setTab, t }) {
  return (
    <div role="group" aria-label={t('events.title')} className="glass-photo inline-flex rounded-full p-1">
      {TABS.map((key) => (
        <button
          key={key}
          type="button"
          aria-pressed={tab === key}
          onClick={() => setTab(key)}
          className={cn('relative flex min-h-[44px] items-center rounded-full text-[15px] font-semibold transition-colors duration-150', tab === key ? 'text-night' : 'text-white/90 hover:text-white')}
        >
          {tab === key ? (
            <motion.span layoutId="events-tab" className="flex min-h-[44px] items-center rounded-full bg-white px-5 shadow-soft" transition={springs.snappy}>
              {t(`events.tab.${key}`)}
            </motion.span>
          ) : (
            <span className="px-5">{t(`events.tab.${key}`)}</span>
          )}
        </button>
      ))}
    </div>
  );
}

function RsvpLink({ post, t, className }) {
  if (!post.externalLink) return null;
  return (
    <a
      href={post.externalLink}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border border-ink/15 px-4 text-[15px] font-semibold text-ink transition-[background-color,border-color,transform] duration-150 hover:border-ink/35 hover:bg-ink/[0.04] active:scale-[0.97]',
        className,
      )}
    >
      {t('events.rsvp')}
      <IconArrowUpRight className="h-4 w-4" />
    </a>
  );
}

/** Events: the latest programme as a feature, then an agenda grouped by month. */
export function Events() {
  const { t, lang, pick } = useLanguage();
  const [tab, setTab] = useState('all');
  const fmt = useDate(lang);
  const now = new Date();

  const sorted = useMemo(() => [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)), []);
  const upcoming = sorted.filter((p) => new Date(p.date) >= now).reverse();
  const list = tab === 'upcoming' ? upcoming : tab === 'past' ? sorted.filter((p) => new Date(p.date) < now) : sorted;
  const feature = upcoming[0] || sorted[0];
  const rest = tab === 'all' ? list.filter((p) => p.id !== feature.id) : list;

  const groups = [];
  for (const p of rest) {
    const key = fmt(p.date).monthYear;
    const g = groups.find((x) => x.key === key);
    if (g) g.items.push(p);
    else groups.push({ key, items: [p] });
  }

  const f = fmt(feature.date);
  const featureIsNext = upcoming[0]?.id === feature.id;

  return (
    <>
      <Seo title={pageTabTitle('Events & Posts')} description="National events, announcements, and opportunities." path="/events" />
      <PageHeader image={PAGE_PHOTOS.events} title={t('events.title')} description={t('events.sub')}>
        <TabBar tab={tab} setTab={setTab} t={t} />
      </PageHeader>

      {tab === 'all' ? (
        <section className="container-x mt-14 md:mt-20" aria-labelledby="ev-feature">
          <Reveal>
            <article className="grid overflow-hidden rounded-[32px] border border-border bg-surface md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="flex items-center justify-center bg-muted p-6 md:p-10">
                <img
                  src={feature.imageUrl}
                  alt={feature.title}
                  width="560"
                  height="700"
                  className="max-h-[460px] w-auto rounded-[16px] object-contain"
                />
              </div>
              <div className="flex flex-col p-6 md:p-10">
                <p className="font-display text-xl italic text-muted-foreground" lang="id">
                  {featureIsNext ? 'Acara berikutnya' : 'Acara terbaru'}
                </p>
                <div className="mt-6 flex items-end gap-4">
                  <span className="font-display text-[72px] leading-[0.8] text-ink tabular">{f.day}</span>
                  <span className="pb-1 text-[15px] leading-tight text-muted-foreground">
                    <span className="block font-semibold capitalize text-ink">{f.weekday}</span>
                    {f.monthYear}
                  </span>
                </div>
                <h2 id="ev-feature" className="mt-6 max-w-[24ch] font-display text-[clamp(1.75rem,1.3rem+1.4vw,2.6rem)] leading-[1.08] text-ink">
                  {feature.title}
                </h2>
                <p className="mt-3 flex items-center gap-2 text-[16px] text-muted-foreground">
                  <IconPin className="h-4 w-4 shrink-0" />
                  {feature.location}
                </p>
                <p className="mt-5 max-w-[56ch] text-[16px] leading-relaxed text-ink/80">{feature.description}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-8">
                  {feature.externalLink && (
                    <a
                      href={feature.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] items-center gap-2 rounded-[14px] bg-accent px-5 text-[15px] font-semibold text-on-accent transition-[background-color,transform] duration-150 hover:bg-accent/90 active:scale-[0.97]"
                    >
                      {t('events.rsvp')}
                      <IconArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        </section>
      ) : null}

      <section className="container-x mt-20 md:mt-28" aria-labelledby="ev-agenda">
        <SectionHead id="ev-agenda" word="Agenda" title={pick({ en: 'All programmes', id: 'Semua program' })} intro={pick({ en: 'Webinars, town halls and discussions run by the national board, newest first.', id: 'Webinar, town hall, dan diskusi yang diadakan pengurus nasional, terbaru lebih dulu.' })} />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: motionTokens.distance.sm }}
            animate={{ opacity: 1, y: 0, transition: { duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth } }}
            exit={{ opacity: 0, transition: { duration: motionTokens.duration.exit } }}
            className="mt-10"
          >
            {groups.length === 0 ? (
              <div className="rounded-[28px] border border-border p-10 text-center">
                <IconCalendar className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-4 font-display text-[26px] text-ink">{pick({ en: 'No upcoming events announced yet', id: 'Belum ada acara mendatang yang diumumkan' })}</p>
                <p className="mx-auto mt-2 max-w-[46ch] text-[16px] text-muted-foreground">
                  {pick({ en: 'New dates are posted on Instagram first. The past programmes below stay available.', id: 'Jadwal baru diumumkan lebih dulu di Instagram. Program sebelumnya tetap bisa dilihat.' })}
                </p>
                <button type="button" onClick={() => setTab('past')} className="mt-6 inline-flex min-h-[44px] items-center rounded-[12px] bg-ink px-5 text-[15px] font-semibold text-mist transition-[background-color,transform] duration-150 hover:bg-ink/85 active:scale-[0.97]">
                  {t('events.tab.past')}
                </button>
              </div>
            ) : (
              groups.map((g) => (
                <div key={g.key} className="grid gap-x-10 border-t border-border md:grid-cols-[200px_minmax(0,1fr)]">
                  <h3 className="pt-6 font-display text-2xl capitalize text-ink md:sticky md:top-24 md:self-start">{g.key}</h3>
                  <ul className="divide-y divide-border">
                    {g.items.map((p) => {
                      const d = fmt(p.date);
                      return (
                        <li key={p.id} id={p.id} className="grid scroll-mt-28 grid-cols-[64px_minmax(0,1fr)] gap-5 py-6 sm:grid-cols-[64px_minmax(0,1fr)_120px]">
                          <p className="text-center">
                            <span className="block font-display text-[40px] leading-none text-ink tabular">{d.day}</span>
                            <span className="mt-1 block text-sm capitalize text-muted-foreground">{d.month}</span>
                          </p>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-muted-foreground">{t(`badge.${p.type}`)}</p>
                            <h4 className="mt-1 font-display text-[24px] leading-[1.15] text-ink">{p.title}</h4>
                            <p className="mt-1.5 flex items-center gap-1.5 text-[16px] text-muted-foreground">
                              <IconPin className="h-4 w-4 shrink-0" />
                              {p.location}
                            </p>
                            <p className="mt-3 line-clamp-3 max-w-[64ch] text-[16px] leading-relaxed text-ink/80">{p.description}</p>
                            <RsvpLink post={p} t={t} className="mt-4" />
                          </div>
                          <img
                            src={p.imageUrl}
                            alt=""
                            width="120"
                            height="150"
                            loading="lazy"
                            className="media-outline hidden aspect-[4/5] w-full rounded-[14px] object-cover object-top sm:block"
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <section className="container-x page-pad mt-20 md:mt-28" aria-labelledby="ev-ig">
        <div className="grid items-center gap-10 rounded-[32px] bg-night p-6 text-white md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:p-12">
          <div>
            <p className="font-display text-xl italic text-white/70" lang="id">
              Ikuti kami
            </p>
            <h2 id="ev-ig" className="display-md mt-2 text-white">
              {t('events.ig.more')}
            </h2>
            <a
              href="https://www.instagram.com/permias.nasional/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-[14px] bg-white px-5 text-[15px] font-semibold text-night transition-[background-color,transform] duration-150 hover:bg-white/90 active:scale-[0.97]"
            >
              <IconInstagram className="h-[18px] w-[18px]" />
              @permias.nasional
            </a>
          </div>
          <ul className="grid grid-cols-3 gap-3">
            {['post-1', 'post-2', 'post-3'].map((n) => publicUrl(`/images/posts/${n}.png`)).map((src, i) => (
              <li key={src} className={cn(i === 1 && 'translate-y-6')}>
                <img src={src} alt="" width="300" height="375" loading="lazy" className="aspect-[4/5] w-full rounded-[18px] object-cover" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

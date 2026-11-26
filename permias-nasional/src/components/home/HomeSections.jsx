import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { getRecentPosts } from '../../data/posts.js';
import { partners } from '../../data/partners.js';
import { photo } from '../../data/photos.js';
import { chapterPath, featuredChapterPhotos } from '../../lib/chapterInfo.js';
import { formatDate } from '../../utils/formatDate.js';
import { cn } from '../../utils/cn.js';
import { NewsletterForm } from '../sections/NewsletterForm.jsx';
import { Badge } from '../ui/Badge.jsx';
import { IconArrowRight, IconArrowUpRight, IconInstagram } from '../ui/Icons.jsx';
import { Reveal, Stagger, StaggerItem } from '../ui/Reveal.jsx';

/** Section heading: an Indonesian word as the design element, then the heading, arriving left to right. */
function SectionHead({ id, word, title, sub, action }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <Reveal className="max-w-2xl">
        {word && (
          <p className="font-display text-[22px] text-muted-foreground" lang="id">
            {word}
          </p>
        )}
        <h2 id={id} className="display-lg mt-1 text-ink">
          {title}
        </h2>
        {sub && <p className="lede mt-3 max-w-[56ch]">{sub}</p>}
      </Reveal>
      {action && <Reveal delay={0.1}>{action}</Reveal>}
    </div>
  );
}

/** What PERMIAS does: one container, three columns, each a real photo and a real destination. */
export function WhatWeDo() {
  const { t } = useLanguage();
  const cols = [
    { to: '/chapters', title: t('home.what.community'), body: t('home.what.community.desc'), img: photo('berkeley-glade') },
    { to: '/resources', title: t('home.what.resources'), body: t('home.what.resources.desc'), img: photo('uw-suzzallo') },
    { to: '/events', title: t('home.what.events'), body: t('home.what.events.desc'), img: photo('dc-capitol') },
  ];
  return (
    <section className="container-x mt-24 md:mt-32" aria-labelledby="what-title">
      <SectionHead id="what-title" word="Keluarga" title={t('home.what.title')} sub={t('home.what.sub')} />
      <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
        {cols.map(({ to, title, body, img }, i) => (
          <StaggerItem key={to} index={i}>
            <Link to={to} className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-border bg-surface transition-colors duration-200 hover:border-ink/25">
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={img.small}
                  srcSet={img.srcSet}
                  sizes="(min-width: 768px) 400px, 100vw"
                  alt=""
                  width={img.w}
                  height={img.h}
                  loading="lazy"
                  className="photo-grade h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-[28px] leading-tight text-ink">{title}</h3>
                <p className="mt-2 flex-1 text-muted-foreground">{body}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-accent">
                  {t('home.what.open')}
                  <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/** Event posters on a mirrored (blurred self) backdrop, in a snap rail you can drag or scroll. */
export function EventsRail() {
  const { t, lang } = useLanguage();
  const list = getRecentPosts(6);
  const railRef = useRef(null);
  const scrollBy = (dir) => railRef.current?.scrollBy({ left: dir * railRef.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="mt-24 md:mt-32" aria-labelledby="events-title">
      <div className="container-x">
        <SectionHead
          id="events-title"
          word="Acara"
          title={t('home.posts.title')}
          sub={t('home.events.sub')}
          action={
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => scrollBy(-1)} className="hidden h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-surface text-ink transition-[background-color,transform] duration-150 hover:border-ink/40 active:scale-95 md:flex" aria-label={t('rail.prev')}>
                <IconArrowRight className="h-5 w-5 rotate-180" />
              </button>
              <button type="button" onClick={() => scrollBy(1)} className="hidden h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-surface text-ink transition-[background-color,transform] duration-150 hover:border-ink/40 active:scale-95 md:flex" aria-label={t('rail.next')}>
                <IconArrowRight className="h-5 w-5" />
              </button>
              <Link to="/events" className="inline-flex min-h-[48px] items-center gap-1.5 rounded-control px-3 font-semibold text-ink hover:bg-ink/5">
                {t('home.posts.more')}
              </Link>
            </div>
          }
        />
      </div>
      <ul
        ref={railRef}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 md:px-[max(32px,calc((100vw-1240px)/2+40px))]"
        aria-label={t('home.posts.title')}
      >
        {list.map((p, k) => (
          <Reveal as="li" key={p.id} delay={Math.min(k, 4) * 0.08} className="w-[78vw] max-w-[360px] shrink-0 snap-start sm:w-[340px]">
            <Link to={`/events#${p.id}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-muted">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  loading="lazy"
                  className="relative h-full w-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="px-1 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge>{t(`badge.${p.type}`)}</Badge>
                  <time dateTime={p.date}>{formatDate(p.date, lang === 'id' ? 'id-ID' : 'en-US')}</time>
                </div>
                <h3 className="mt-2 line-clamp-2 font-display text-[24px] leading-tight text-ink group-hover:underline group-hover:decoration-ink/30 group-hover:underline-offset-4">
                  {p.title}
                </h3>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

/** Moments: clean photos the chapters posted (no collages), in an asymmetric mosaic. */
export function Moments() {
  const { t, pick } = useLanguage();
  const shapes = ['col-span-2 row-span-2', 'row-span-2', 'col-span-2', '', ''];
  const tiles = featuredChapterPhotos(5).map(({ c, p }, k) => ({ src: p.src, w: p.w, h: p.h, alt: p.alt, label: c.chapterName, sub: `${c.city}, ${c.state}`, to: chapterPath(c), cls: shapes[k] }));
  return (
    <section className="container-x mt-24 md:mt-32" aria-labelledby="moments-title">
      <SectionHead
        id="moments-title"
        word="Cerita"
        title={pick({ en: 'From the chapters', id: 'Dari chapter-chapter' })}
        sub={pick({ en: 'Photos the chapters posted themselves, from welcome days to Indonesian nights on campus.', id: 'Foto yang diunggah sendiri oleh chapter, dari hari penyambutan hingga malam budaya Indonesia di kampus.' })}
        action={
          <a
            href="https://www.instagram.com/permias.nasional/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-control bg-ink px-5 font-semibold text-mist transition-transform duration-150 active:scale-[0.97]"
          >
            <IconInstagram className="h-5 w-5" />
            {t('events.ig.follow')}
          </a>
        }
      />
      <ul className="mt-10 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] md:grid-cols-4 md:gap-4">
        {tiles.map((tile) => (
          <li key={tile.label} className={cn('relative overflow-hidden rounded-[24px] bg-muted', tile.cls)}>
            <Link to={tile.to} className="group block h-full">
              <img
                src={tile.src}
                alt={tile.alt || ''}
                width={tile.w}
                height={tile.h}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <span className="absolute inset-x-0 bottom-0 flex h-1/2 flex-col justify-end bg-gradient-to-t from-black/70 to-black/0 px-4 pb-3">
                <span className="block truncate text-[15px] font-semibold text-white">{tile.label}</span>
                <span className="block truncate text-[13px] text-white/80">{tile.sub}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Partners as a quiet typographic index (no auto-scrolling strip). */
export function PartnersIndex() {
  const { t } = useLanguage();
  return (
    <section className="container-x mt-24 md:mt-32" aria-labelledby="partners-title">
      <SectionHead
        id="partners-title"
        word="Mitra"
        title={t('home.marquee.title')}
        sub={t('partners.sub')}
        action={
          <Link to="/partners" className="inline-flex min-h-[48px] items-center gap-1.5 rounded-control px-3 font-semibold text-ink hover:bg-ink/5">
            {t('sejarah.partners.cta')}
          </Link>
        }
      />
      <Stagger className="mt-8 grid grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((p, k) => (
          <StaggerItem key={p.id} index={k} className="border-b border-border">
            <a href={p.website} target="_blank" rel="noopener noreferrer" className="group flex min-h-[64px] items-center justify-between gap-4 py-4 pr-2 sm:pr-6">
              <span>
                <span className="block text-lg font-semibold text-ink">{p.name}</span>
                <span className="block text-sm text-muted-foreground">{p.type}</span>
              </span>
              <IconArrowUpRight className="h-5 w-5 shrink-0 text-ink/40 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </a>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/** Closing band: start a chapter + newsletter on a city photo, under the national motto. */
export function JoinBand() {
  const { t } = useLanguage();
  const p = photo('boston-skyline');
  return (
    <section className="mt-24 md:mt-32" aria-labelledby="join-title">
      <div className="relative isolate overflow-hidden bg-night">
        <img src={p.src} srcSet={p.srcSet} sizes="100vw" alt="" width={p.w} height={p.h} loading="lazy" className="photo-grade absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(18,19,21,.72),rgba(18,19,21,.88))]" aria-hidden="true" />
        <div className="container-x py-20 md:py-28">
          <Reveal>
            <p className="font-display text-[clamp(2.6rem,1.4rem+4.6vw,5.6rem)] leading-none text-white" lang="id">
              Bhinneka Tunggal Ika
            </p>
            <p className="mt-3 text-[16px] font-semibold text-white/80">{t('join.motto')}</p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Reveal delay={0.05} className="rounded-[24px] bg-white p-7 text-night md:p-9">
              <h2 id="join-title" className="font-display text-[34px] leading-tight">
                {t('home.join.title')}
              </h2>
              <p className="mt-3 max-w-[44ch] text-night/75">{t('home.join.sub')}</p>
              <Link
                to="/chapters/register"
                className="mt-6 inline-flex min-h-[52px] items-center gap-2 rounded-[12px] bg-accent px-6 font-semibold text-on-accent transition-[background-color,transform] duration-150 hover:bg-accent/90 active:scale-[0.97]"
              >
                {t('chapters.register')}
                <IconArrowRight className="h-5 w-5" />
              </Link>
            </Reveal>
            <Reveal delay={0.15} className="rounded-[24px] border border-white/15 bg-night/80 p-7 md:p-9">
              <h2 className="font-display text-[34px] leading-tight text-white">{t('home.newsletter.title')}</h2>
              <p className="mt-3 max-w-[44ch] text-white/80">{t('home.newsletter.sub')}</p>
              <NewsletterForm tone="dark" className="mt-6" />
            </Reveal>
          </div>
        </div>
        <a href={p.page} target="_blank" rel="noopener noreferrer" className="absolute bottom-3 right-4 rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white/80 hover:text-white">
          {t('photo.credit', { who: p.artist, lic: p.license })}
        </a>
      </div>
    </section>
  );
}

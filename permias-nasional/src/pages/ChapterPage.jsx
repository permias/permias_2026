import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { chapters, formatDistance, instagramUrl, REGION_LABELS } from '../data/chapters.js';
import { cardPhoto, chapterBySlug, chapterMedia, chapterPath, heroImage, nearbyChapters, placePhoto } from '../lib/chapterInfo.js';
import { campusName, isRegional } from '../lib/campus.js';
import { motionTokens } from '../lib/motion.js';
import { pageTabTitle } from '../utils/seo.js';
import { cn } from '../utils/cn.js';
import { Seo } from '../components/Seo.jsx';
import { ChapterMap } from '../components/chapters/ChapterMap.jsx';
import { ChapterLogo } from '../components/chapters/ChapterLogo.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { IconArrowRight, IconArrowUpRight, IconClose, IconGlobe, IconInstagram, IconMap } from '../components/ui/Icons.jsx';

const alpha = [...chapters].sort((a, b) => campusName(a).localeCompare(campusName(b)));

const host = (u) => {
  try {
    return new URL(u).hostname.replace(/^www\./, '');
  } catch {
    return u;
  }
};

const FIELD_LABELS = {
  chapterName: { en: 'Chapter name', id: 'Nama chapter' },
  universityFull: { en: 'Official name', id: 'Nama resmi' },
  instagram: { en: 'Instagram', id: 'Instagram' },
  region: { en: 'Region', id: 'Wilayah' },
  level: { en: 'Level', id: 'Tingkat' },
  city: { en: 'City', id: 'Kota' },
  state: { en: 'State', id: 'Negara bagian' },
  lat: { en: 'Map position', id: 'Posisi peta' },
  lng: null,
  website: { en: 'Website', id: 'Situs web' },
  description: { en: 'Description', id: 'Deskripsi' },
};

function Gallery({ c, photos }) {
  const { pick } = useLanguage();
  const ref = useRef(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open != null && !d.open) d.showModal();
    if (open == null && d.open) d.close();
  }, [open]);

  if (!photos.length) {
    const p = placePhoto(c);
    return (
      <div className="grid gap-6 rounded-[28px] border border-border bg-mist/60 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:p-8 dark:bg-white/[0.03]">
        <div>
          <p className="font-display text-[28px] leading-tight text-ink">{pick({ en: 'Photos from the chapter', id: 'Foto dari chapter' })}</p>
          <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed text-muted-foreground">
            {pick({
              en: `We have not added photos from ${c.chapterName} yet. Their latest events are on Instagram.`,
              id: `Foto dari ${c.chapterName} belum kami tambahkan. Kegiatan terbaru mereka ada di Instagram.`,
            })}
          </p>
          {c.instagram && (
            <a
              href={instagramUrl(c.instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-[12px] border border-ink/15 px-4 text-sm font-semibold text-ink transition-[background-color,border-color,transform] duration-150 hover:border-ink/30 hover:bg-ink/[0.04] active:scale-[0.97]"
            >
              <IconInstagram className="h-4 w-4" />
              {c.instagram}
            </a>
          )}
        </div>
        {p?.src && (
          <figure>
            <img src={p.small} srcSet={p.srcSet} sizes="(min-width: 768px) 560px, 100vw" alt={p.alt} width={p.w} height={p.h} loading="lazy" className="media-outline aspect-[3/2] w-full rounded-[20px] object-cover" />
            <figcaption className="mt-2 text-xs text-muted-foreground">
              {p.alt}.{' '}
              <a href={p.page} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
                {p.artist}, {p.license}
              </a>
            </figcaption>
          </figure>
        )}
      </div>
    );
  }

  if (photos.length === 1) {
    const ph = photos[0];
    return (
      <figure className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:items-end">
        <img src={ph.src} alt={ph.alt || c.chapterName} width={ph.w} height={ph.h} loading="lazy" className="media-outline max-h-[560px] w-full rounded-[24px] object-cover" />
        <figcaption className="pb-2">
          <p className="font-display text-[26px] leading-snug text-ink">{ph.alt}</p>
          {ph.source && (
            <a href={ph.source} target="_blank" rel="noopener noreferrer" className="link-quiet mt-3 inline-flex text-[15px] font-semibold text-ink">
              {pick({ en: 'Posted by the chapter on Instagram', id: 'Diunggah chapter di Instagram' })}
            </a>
          )}
        </figcaption>
      </figure>
    );
  }

  return (
    <>
      <ul className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4">
        {photos.slice(0, 7).map((ph, i) => (
          <li key={ph.src} className={cn(i === 0 && 'col-span-2 row-span-2')}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block h-full w-full overflow-hidden rounded-[20px] bg-ink/5"
              aria-label={pick({ en: `Enlarge photo: ${ph.alt || c.chapterName}`, id: `Perbesar foto: ${ph.alt || c.chapterName}` })}
            >
              <img src={ph.src} alt="" width={ph.w} height={ph.h} loading="lazy" className="media-outline h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" />
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={ref}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === ref.current && setOpen(null)}
        className="m-auto max-h-[92vh] max-w-[min(1100px,94vw)] overflow-visible rounded-[24px] bg-transparent p-0 backdrop:bg-night/80 backdrop:backdrop-blur-sm"
        aria-label={c.chapterName}
      >
        {open != null && photos[open] && (
          <figure className="relative">
            <img src={photos[open].src} alt={photos[open].alt || ''} className="max-h-[82vh] w-auto rounded-[24px] object-contain" />
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-white/85">
              <span>{photos[open].alt}</span>
              {photos[open].source && (
                <a href={photos[open].source} target="_blank" rel="noopener noreferrer" className="shrink-0 underline underline-offset-2 hover:text-white">
                  {pick({ en: 'Source', id: 'Sumber' })}: {host(photos[open].source)}
                </a>
              )}
            </figcaption>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75"
              aria-label={pick({ en: 'Close photo', id: 'Tutup foto' })}
            >
              <IconClose className="h-5 w-5" />
            </button>
          </figure>
        )}
      </dialog>
    </>
  );
}

/** One page per chapter: hero, story, links, photos, sources, nearby chapters and a mini map. */
export function ChapterPage() {
  const { slug } = useParams();
  const { t, pick, lang } = useLanguage();
  const c = chapterBySlug(slug);

  const near = useMemo(() => (c ? nearbyChapters(c, 4) : []), [c]);
  if (!c) return <Navigate to="/chapters" replace />;

  const media = chapterMedia(c);
  const hero = heroImage(c);
  const idx = alpha.findIndex((x) => x.id === c.id);
  const prev = alpha[(idx - 1 + alpha.length) % alpha.length];
  const next = alpha[(idx + 1) % alpha.length];
  const title = isRegional(c) ? c.chapterName : campusName(c);
  const sources = [...new Set([...(c.sources || []), ...Object.values(c.fieldSources || {}), ...(media.logo?.source ? [media.logo.source] : []), ...media.photos.map((p) => p.source).filter(Boolean)])];
  const fieldsBySource = (u) =>
    Object.entries(c.fieldSources || {})
      .filter(([k, v]) => v === u && FIELD_LABELS[k])
      .map(([k]) => pick(FIELD_LABELS[k]));

  const facts = [
    { k: pick({ en: 'Official name', id: 'Nama resmi' }), v: c.universityFull || c.university },
    { k: pick({ en: 'Chapter', id: 'Chapter' }), v: c.chapterName },
    { k: pick({ en: 'Level', id: 'Tingkat' }), v: c.level === 'University' ? pick({ en: 'Campus chapter', id: 'Chapter kampus' }) : c.level === 'Regional' ? pick({ en: 'City-wide chapter', id: 'Chapter tingkat kota' }) : c.level },
    { k: pick({ en: 'Official region', id: 'Wilayah resmi' }), v: c.officialRegion || pick(REGION_LABELS[c.region]) },
    { k: pick({ en: 'Location', id: 'Lokasi' }), v: `${c.city}, ${c.state}` },
  ];

  return (
    <>
      <Seo title={pageTabTitle(c.chapterName)} description={pick(c.description) || `${c.chapterName}, ${c.city}`} path={chapterPath(c)} />

      <section className="px-2 pt-2 sm:px-3 sm:pt-3">
        <div className="relative isolate flex min-h-[520px] overflow-hidden rounded-sheet bg-night md:min-h-[min(74vh,660px)]">
          <div className="absolute inset-0 -z-10">
            <motion.img
              src={hero.src}
              srcSet={hero.srcSet}
              sizes="100vw"
              alt=""
              width={hero.w}
              height={hero.h}
              fetchPriority="high"
              className="photo-grade h-full w-full object-cover"
              initial={{ scale: 1.04 }}
              animate={{ scale: 1 }}
              transition={{ duration: motionTokens.duration.crawl * 1.6, ease: motionTokens.easing.smooth }}
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(18,19,21,.45)_0%,rgba(18,19,21,.1)_32%,rgba(18,19,21,.85)_100%)]" aria-hidden="true" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(18,19,21,.55)_0%,rgba(18,19,21,0)_65%)]" aria-hidden="true" />

          <div className="container-x flex flex-col justify-end pb-8 pt-28 text-white md:pb-12">
            <nav aria-label={pick({ en: 'Breadcrumb', id: 'Navigasi remah' })} className="mb-6 text-sm text-white/80">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link to="/chapters" className="underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white">
                    {t('chapters.title')}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to={`/chapters?state=${c.stateId}`} className="underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white">
                    {c.state}
                  </Link>
                </li>
              </ol>
            </nav>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-5">
                <span className="hidden sm:block">
                  <ChapterLogo c={c} size={72} ring={false} className="ring-2 ring-white" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white/90">
                    {c.officialRegion || pick(REGION_LABELS[c.region])}
                    <span className="text-white/60">/ {isRegional(c) ? t('dir.kindCity') : t('dir.kindCampus')}</span>
                  </p>
                  <h1 className="display-lg mt-3 max-w-[18ch] text-white">{title}</h1>
                  <p className="mt-3 text-lg text-white/85">
                    {c.chapterName} / {c.city}, {c.state}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                {c.instagram && (
                  <a
                    href={instagramUrl(c.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-[14px] bg-white px-5 text-[15px] font-semibold text-night transition-[background-color,transform] duration-150 hover:bg-white/90 active:scale-[0.97]"
                  >
                    <IconInstagram className="h-[18px] w-[18px]" />
                    {c.instagram}
                  </a>
                )}
                {c.website && (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-photo inline-flex min-h-[48px] items-center gap-2 rounded-[14px] px-5 text-[15px] font-semibold transition-[background-color,transform] duration-150 hover:bg-white/25 active:scale-[0.97]"
                  >
                    <IconGlobe className="h-[18px] w-[18px]" />
                    {t('chapters.website')}
                  </a>
                )}
              </div>
            </div>
          </div>
          {!hero.own && hero.page && (
            <a href={hero.page} target="_blank" rel="noopener noreferrer" className="absolute right-4 top-20 hidden max-w-[40%] truncate rounded-full bg-black/35 px-2.5 py-1 text-[11px] text-white/85 backdrop-blur hover:text-white md:block">
              {hero.alt}. {t('photo.credit', { who: hero.artist, lic: hero.license })}
            </a>
          )}
        </div>
      </section>

      <section className="container-x mt-14 grid gap-10 md:mt-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          <p className="font-display text-xl italic text-muted-foreground">{pick({ en: 'Tentang chapter', id: 'Tentang chapter' })}</p>
          <p className="mt-4 max-w-[34ch] font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] leading-[1.15] text-ink">{pick(c.description)}</p>
          <dl className="mt-10 grid gap-x-8 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.k} className="border-t border-border py-4">
                <dt className="text-sm text-muted-foreground">{f.k}</dt>
                <dd className="mt-1 text-[16px] font-semibold text-ink">{f.v}</dd>
              </div>
            ))}
            <div className="border-t border-border py-4">
              <dt className="text-sm text-muted-foreground">{pick({ en: 'Links', id: 'Tautan' })}</dt>
              <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[16px] font-semibold">
                {c.instagram && (
                  <a href={instagramUrl(c.instagram)} target="_blank" rel="noopener noreferrer" className="link-quiet text-ink">
                    Instagram
                  </a>
                )}
                {c.website ? (
                  <a href={c.website} target="_blank" rel="noopener noreferrer" className="link-quiet text-ink">
                    {host(c.website)}
                  </a>
                ) : (
                  <span className="font-normal text-muted-foreground">{pick({ en: 'No website found', id: 'Situs web belum ditemukan' })}</span>
                )}
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal x={24} className="lg:pt-2">
          <div className="rounded-[28px] border border-border bg-surface p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3 px-2 pb-2 pt-1">
              <p className="font-display text-xl text-ink">{c.state}</p>
              <Link to={`/chapters?state=${c.stateId}&chapter=${c.id}`} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-ink/15 px-3.5 text-sm font-semibold text-ink transition-[background-color,transform] duration-150 hover:bg-ink/5 active:scale-[0.97]">
                <IconMap className="h-4 w-4" />
                {t('dir.fullMap')}
              </Link>
            </div>
            <ChapterMap selectedState={c.stateId} selectedChapter={c.id} label={pick({ en: `Map: ${c.chapterName} in ${c.state}`, id: `Peta: ${c.chapterName} di ${c.state}` })} />
          </div>
        </Reveal>
      </section>

      <section className="container-x mt-20 md:mt-28" aria-labelledby="ch-photos">
        <h2 id="ch-photos" className="display-md text-ink">
          {pick({ en: 'Photos', id: 'Foto' })}
        </h2>
        <div className="mt-6">
          <Gallery c={c} photos={media.photos} />
        </div>
      </section>

      {near.length > 0 && (
        <section className="container-x mt-20 md:mt-28" aria-labelledby="ch-near">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="ch-near" className="display-md text-ink">
              {pick({ en: 'Nearby chapters', id: 'Chapter terdekat' })}
            </h2>
            <Link to={`/chapters?state=${c.stateId}`} className="link-quiet text-[15px] font-semibold text-ink">
              {pick({ en: `All chapters in ${c.state}`, id: `Semua chapter di ${c.state}` })}
            </Link>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {near.map((n) => {
              return (
                <li key={n.id}>
                  <Link to={chapterPath(n)} className="group block h-full overflow-hidden rounded-[22px] border border-border bg-surface transition-colors duration-200 hover:border-ink/25">
                    <span className="relative block h-28 overflow-hidden bg-night">
                      <img src={cardPhoto(n)} alt="" width="400" height="112" loading="lazy" className="photo-grade h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
                      <span className="absolute -bottom-5 left-4 rounded-full ring-[3px] ring-surface">
                        <ChapterLogo c={n} size={44} ring={false} />
                      </span>
                    </span>
                    <span className="block px-4 pb-4 pt-7">
                      <span className="block text-[16px] font-semibold leading-tight text-ink">{n.chapterName}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {campusName(n)} / <span className="tabular">{formatDistance(n.km, lang)}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="container-x mt-20 md:mt-28" aria-labelledby="ch-sources">
        <div className="grid gap-8 border-t border-border pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <h2 id="ch-sources" className="font-display text-[28px] leading-tight text-ink">
              {pick({ en: 'Sources', id: 'Sumber' })}
            </h2>
            <p className="mt-3 max-w-[40ch] text-[16px] leading-relaxed text-muted-foreground">
              {c.status === 'verified'
                ? pick({ en: 'Checked against the official PERMIAS Nasional chapter list. Each line says which details come from where.', id: 'Dicocokkan dengan daftar chapter resmi PERMIAS Nasional. Setiap baris menyebut data mana yang berasal dari mana.' })
                : pick({ en: 'Not yet verified against the official list.', id: 'Belum dicocokkan dengan daftar resmi.' })}
              {media.checked && ` ${pick({ en: 'Photos checked', id: 'Foto diperiksa' })} ${new Date(media.checked).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'medium' })}.`}
            </p>
          </div>
          <ol className="divide-y divide-border">
            {sources.map((u, i) => {
              const fields = fieldsBySource(u);
              const isMedia = media.logo?.source === u || media.photos.some((p) => p.source === u);
              return (
                <li key={u} className="flex gap-4 py-3.5">
                  <span className="w-6 shrink-0 pt-0.5 text-sm tabular text-muted-foreground">{i + 1}</span>
                  <span className="min-w-0">
                    <a href={u} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 break-all text-[15px] font-semibold text-ink hover:text-accent">
                      {host(u)}
                      <IconArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
                    </a>
                    <span className="block text-sm text-muted-foreground">
                      {[...fields, ...(isMedia ? [pick({ en: 'Logo and photos', id: 'Logo dan foto' })] : [])].join(', ') || pick({ en: 'Reference', id: 'Rujukan' })}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <nav className="container-x page-pad mt-16 md:mt-20" aria-label={pick({ en: 'More chapters', id: 'Chapter lainnya' })}>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { c: prev, label: pick({ en: 'Previous chapter', id: 'Chapter sebelumnya' }), align: 'text-left' },
            { c: next, label: pick({ en: 'Next chapter', id: 'Chapter berikutnya' }), align: 'sm:text-right' },
          ].map(({ c: x, label, align }) => (
            <Link key={label} to={chapterPath(x)} className={cn('group rounded-[22px] border border-border p-5 transition-[border-color,background-color,transform] duration-150 hover:border-ink/25 hover:bg-ink/[0.02] active:scale-[0.99]', align)}>
              <span className="block text-sm text-muted-foreground">{label}</span>
              <span className="mt-1 inline-flex items-center gap-2 font-display text-2xl text-ink">
                {campusName(x)}
                <IconArrowRight className="h-4 w-4 text-accent transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

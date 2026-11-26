import { Link } from 'react-router-dom';
import { teamDepartments } from '../data/team.js';
import { chapters, stateCount } from '../data/chapters.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { pageTabTitle } from '../utils/seo.js';
import { Reveal } from '../components/ui/Reveal.jsx';
import { PAGE_PHOTOS, photo } from '../data/photos.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Credit, PhotoTile, SectionHead } from '../components/ui/Section.jsx';

/** About: who we are, mission and vision, how the board is organised, and where to go next. */
export function About() {
  const { t, pick } = useLanguage();
  const directorates = teamDepartments.filter((d) => d.id !== 'executive');
  const wide = photo('campus-columbia-low');

  const facts = [
    { v: '1961', k: pick({ en: 'Founded as a national association', id: 'Berdiri sebagai organisasi nasional' }) },
    { v: String(chapters.length), k: pick({ en: 'Campus and city chapters', id: 'Chapter kampus dan kota' }) },
    { v: `${stateCount} + DC`, k: pick({ en: 'States with a chapter', id: 'Negara bagian dengan chapter' }) },
  ];

  return (
    <>
      <Seo title={pageTabTitle('About PERMIAS')} description="History, mission, vision, and leadership structure of PERMIAS Nasional." path="/about" />
      <PageHeader image={PAGE_PHOTOS.about} title={t('about.title')} description={t('about.sub')} />

      <section className="container-x mt-16 grid gap-12 md:mt-24 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-20" aria-labelledby="ab-who">
        <Reveal>
          <p className="font-display text-xl italic text-muted-foreground" lang="id">
            Siapa kami
          </p>
          <h2 id="ab-who" className="mt-3 max-w-[22ch] font-display text-[clamp(2rem,1.4rem+2.2vw,3.4rem)] leading-[1.06] text-ink">
            {pick({ en: 'The national home of Indonesian student associations in the United States.', id: 'Rumah nasional bagi perhimpunan mahasiswa Indonesia di Amerika Serikat.' })}
          </h2>
          <p className="lede mt-6 max-w-[60ch]">
            {pick({
              en: 'PERMIAS Nasional connects campus and city chapters, so a student arriving in Seattle, Austin or Boston finds people who speak their language, and so chapters can share programmes, mentors and opportunities across the country.',
              id: 'PERMIAS Nasional menghubungkan chapter kampus dan kota, agar mahasiswa yang baru tiba di Seattle, Austin, atau Boston menemukan orang yang berbahasa sama, dan agar chapter dapat berbagi program, mentor, serta peluang di seluruh negeri.',
            })}
          </p>
        </Reveal>
        <Reveal x={24}>
          <dl className="divide-y divide-border border-y border-border">
            {facts.map((f) => (
              <div key={f.k} className="flex items-baseline justify-between gap-6 py-5">
                <dt className="text-[15px] text-muted-foreground">{f.k}</dt>
                <dd className="font-display text-[40px] leading-none text-ink tabular">{f.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            {pick({ en: 'Chapter counts from the official PERMIAS Nasional chapter list.', id: 'Jumlah chapter dari daftar chapter resmi PERMIAS Nasional.' })}
          </p>
        </Reveal>
      </section>

      <section className="container-x mt-20 md:mt-28" aria-label={`${t('about.mission')} / ${t('about.vision')}`}>
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            { label: t('about.mission'), body: t('about.mission.body'), word: 'Misi' },
            { label: t('about.vision'), body: t('about.vision.body'), word: 'Visi' },
          ].map((b, i) => (
            <Reveal key={b.label} delay={i * 0.08} className="flex flex-col rounded-[32px] border border-border bg-surface p-8 md:p-12">
              <h2 className="font-display text-xl italic text-muted-foreground" lang="id">
                {b.word}
              </h2>
              <p className="mt-6 font-display text-[clamp(1.5rem,1.2rem+1vw,2.1rem)] leading-[1.2] text-ink">{b.body}</p>
            </Reveal>
          ))}
        </div>
        {wide && (
          <Reveal className="mt-4">
            <img src={wide.src} srcSet={wide.srcSet} sizes="100vw" alt={wide.alt} width={wide.w} height={wide.h} loading="lazy" className="photo-grade media-outline h-[280px] w-full rounded-[32px] object-cover md:h-[420px]" />
            <Credit image="campus-columbia-low" className="mt-2" />
          </Reveal>
        )}
      </section>

      <section className="container-x mt-20 md:mt-28" aria-labelledby="ab-org">
        <SectionHead
          id="ab-org"
          word="Struktur"
          title={t('about.chart.title')}
          intro={pick({ en: 'A president and vice president lead five directorates. Every role is held by a student volunteer.', id: 'Ketua dan wakil ketua memimpin lima direktorat. Setiap peran dipegang mahasiswa relawan.' })}
        />
        <Reveal className="mt-12">
          <div className="flex flex-col items-center">
            <div className="rounded-[18px] bg-ink px-6 py-4 text-center text-mist">
              <p className="text-sm text-mist/70">{pick({ en: 'Executive', id: 'Pengurus inti' })}</p>
              <p className="font-display text-2xl">{t('about.chart.president')}</p>
            </div>
            <span className="h-8 w-px bg-ink/25" aria-hidden="true" />
            <div className="rounded-[18px] border border-ink/20 bg-surface px-6 py-4 text-center">
              <p className="font-display text-2xl text-ink">{t('about.chart.vicePresident')}</p>
            </div>
            <span className="h-8 w-px bg-ink/25" aria-hidden="true" />
          </div>
          <ul className="relative grid gap-3 border-t border-ink/25 pt-8 sm:grid-cols-2 lg:grid-cols-5">
            {directorates.map((d) => (
              <li key={d.id} className="relative">
                <span className="absolute -top-8 left-1/2 hidden h-8 w-px bg-ink/25 lg:block" aria-hidden="true" />
                <Link
                  to={`/team?d=${d.id}`}
                  className="group flex h-full flex-col rounded-[20px] border border-border bg-surface p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/25 active:scale-[0.99]"
                >
                  <span className="text-[17px] font-semibold leading-snug text-ink">{t(d.titleKey)}</span>
                  <span className="mt-auto pt-4 text-sm text-muted-foreground">
                    {pick({ en: `${d.members.length} members`, id: `${d.members.length} anggota` })}
                    <span className="ml-1 text-accent transition-transform duration-200 group-hover:translate-x-0.5">›</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="container-x page-pad mt-20 grid gap-4 md:mt-28 md:grid-cols-2 lg:grid-cols-3" aria-label={pick({ en: 'More about PERMIAS', id: 'Selengkapnya tentang PERMIAS' })}>
        <PhotoTile
          to="/about/sejarah"
          image="us-lincoln-reflecting"
          title={pick({ en: 'Our history', id: 'Sejarah kami' })}
          sub={pick({ en: 'Why a national association was founded in 1961.', id: 'Mengapa organisasi nasional didirikan pada 1961.' })}
          links={[pick({ en: 'Read the history', id: 'Baca sejarahnya' })]}
        />
        <PhotoTile to="/team" image="campus-uw-quad" title={t('team.title')} sub={pick({ en: 'The students who run PERMIAS Nasional this term.', id: 'Para mahasiswa pengurus PERMIAS Nasional periode ini.' })} links={[pick({ en: 'Meet the team', id: 'Kenali tim' })]} />
        <PhotoTile to="/partners" image="dc-indonesian-embassy" title={t('nav.partners')} sub={pick({ en: 'Embassy, consulates, scholarship and cultural partners.', id: 'Kedutaan, konsulat, mitra beasiswa, dan budaya.' })} links={[pick({ en: 'See partners', id: 'Lihat mitra' })]} className="md:col-span-2 lg:col-span-1" />
      </section>
    </>
  );
}

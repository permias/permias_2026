import { Link } from 'react-router-dom';
import { partners } from '../data/partners.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { pageTabTitle } from '../utils/seo.js';
import { PAGE_PHOTOS } from '../data/photos.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { SectionHead } from '../components/ui/Section.jsx';
import { IconArrowRight, IconArrowUpRight } from '../components/ui/Icons.jsx';

const GROUPS = [
  { type: 'Government', word: 'Pemerintah', title: { en: 'Embassy and consulates', id: 'Kedutaan dan konsulat' }, note: { en: 'Indonesian missions that serve students in every U.S. region.', id: 'Perwakilan Indonesia yang melayani mahasiswa di setiap wilayah AS.' } },
  { type: 'Academic', word: 'Akademik', title: { en: 'Scholarships and exchange', id: 'Beasiswa dan pertukaran' }, note: { en: 'Programmes that fund and support study in the United States.', id: 'Program yang mendanai dan mendukung studi di Amerika Serikat.' } },
  { type: 'Cultural', word: 'Budaya', title: { en: 'Culture', id: 'Budaya' }, note: { en: 'People-to-people ties between Indonesia and the United States.', id: 'Hubungan antarwarga Indonesia dan Amerika Serikat.' } },
  { type: 'Community', word: 'Komunitas', title: { en: 'Community', id: 'Komunitas' }, note: { en: 'Organisations we work with on events and student support.', id: 'Organisasi mitra untuk acara dan dukungan mahasiswa.' } },
];

const host = (u) => {
  try {
    return new URL(u).hostname.replace(/^www\./, '');
  } catch {
    return u;
  }
};

/** Partners grouped by kind, each a row with its own site link, and an invitation to partner. */
export function Partners() {
  const { t, pick } = useLanguage();
  const groups = GROUPS.map((g) => ({ ...g, items: partners.filter((p) => p.type === g.type) })).filter((g) => g.items.length);
  const known = new Set(GROUPS.map((g) => g.type));
  const other = partners.filter((p) => !known.has(p.type));
  if (other.length) groups.push({ type: 'Other', word: 'Lainnya', title: { en: 'Other partners', id: 'Mitra lainnya' }, note: null, items: other });

  return (
    <>
      <Seo title={pageTabTitle('Partners')} description="Government, cultural, academic, and community partners of PERMIAS Nasional." path="/partners" />
      <PageHeader image={PAGE_PHOTOS.partners} title={t('partners.title')} description={t('partners.sub')} />

      <div className="container-x mt-16 space-y-20 md:mt-24 md:space-y-28">
        {groups.map((g) => (
          <section key={g.type} className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16" aria-labelledby={`pt-${g.type}`}>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHead id={`pt-${g.type}`} word={g.word} title={pick(g.title)} intro={g.note ? pick(g.note) : undefined} />
            </div>
            <Reveal as="ul" x={24} className="divide-y divide-border border-y border-border">
              {g.items.map((p) => (
                <li key={p.id}>
                  <a href={p.website} target="_blank" rel="noopener noreferrer" className="group grid grid-cols-[56px_minmax(0,1fr)_auto] items-start gap-5 py-6">
                    <span className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-muted font-display text-[22px] text-ink" aria-hidden="true">
                      {p.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[26px] leading-tight text-ink">{p.name}</span>
                      <span className="mt-1.5 block max-w-[58ch] text-[16px] leading-relaxed text-muted-foreground">{p.description}</span>
                      <span className="mt-2 block text-sm font-semibold text-ink/70 group-hover:text-accent">{host(p.website)}</span>
                    </span>
                    <IconArrowUpRight className="mt-2 h-5 w-5 text-ink/35 transition-[color,transform] duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </a>
                </li>
              ))}
            </Reveal>
          </section>
        ))}
      </div>

      <section className="container-x page-pad mt-20 md:mt-28" aria-labelledby="pt-join">
        <Reveal className="flex flex-col items-start justify-between gap-6 rounded-[32px] border border-border bg-mist/70 p-8 md:flex-row md:items-end md:p-12 dark:bg-white/[0.03]">
          <div>
            <p className="font-display text-xl italic text-muted-foreground" lang="id">
              Bermitra
            </p>
            <h2 id="pt-join" className="display-md mt-2 max-w-[20ch] text-ink">
              {pick({ en: 'Work with 90 chapters at once', id: 'Bekerja sama dengan 90 chapter sekaligus' })}
            </h2>
            <p className="mt-3 max-w-[52ch] text-[17px] leading-relaxed text-muted-foreground">
              {pick({ en: 'Universities, missions and organisations reach Indonesian students across the country through the national board.', id: 'Universitas, perwakilan, dan organisasi menjangkau mahasiswa Indonesia di seluruh negeri melalui pengurus nasional.' })}
            </p>
          </div>
          <Link to="/contact" className="inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-[14px] bg-accent px-5 text-[15px] font-semibold text-on-accent transition-[background-color,transform] duration-150 hover:bg-accent/90 active:scale-[0.97]">
            {pick({ en: 'Contact the board', id: 'Hubungi pengurus' })}
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}

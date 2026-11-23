import { Link } from 'react-router-dom';
import { sejarahActivities, sejarahFormation, sejarahMission, sejarahVision } from '../data/sejarah.js';
import { SUPPORT_EMAIL } from '../data/contactEmails.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { PAGE_PHOTOS, photo } from '../data/photos.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { Credit, SectionHead } from '../components/ui/Section.jsx';
import { IconArrowRight, IconMail } from '../components/ui/Icons.jsx';

const ACTIVITY_PHOTOS = ['dc-indonesian-embassy', 'uw-suzzallo', 'berkeley-glade'];

/** Sejarah: the founding story as an editorial spread, vision and mission, and what PERMIAS runs today. */
export function Sejarah() {
  const { lang, t, pick } = useLanguage();

  return (
    <>
      <Seo title="Sejarah Kami | PERMIAS Nasional" description="History, vision, mission, and national programming of PERMIAS Nasional since 1961." path="/about/sejarah" />
      <PageHeader image={PAGE_PHOTOS.sejarah} title={t('sejarah.title')} description={t('sejarah.intro')} />

      <section className="container-x mt-16 grid gap-10 md:mt-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20" aria-labelledby="sj-formation">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="font-display text-[clamp(5rem,3rem+8vw,10rem)] leading-[0.85] text-merah tabular" aria-hidden="true">
              1961
            </p>
            <h2 id="sj-formation" className="display-md mt-6 text-ink">
              {sejarahFormation.title[lang]}
            </h2>
            <p className="mt-3 font-display text-xl italic text-ink/75">{sejarahFormation.lead[lang]}</p>
          </Reveal>
        </div>
        <Reveal x={24} className="prose-kaca text-ink/85">
          {sejarahFormation.paragraphs.map((p, i) => (
            <p key={p.en} className={i === 0 ? 'font-display text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] leading-[1.4] text-ink' : 'text-[18px]'}>
              {p[lang]}
            </p>
          ))}
        </Reveal>
      </section>

      <section className="container-x mt-20 md:mt-28" aria-labelledby="sj-vm">
        <SectionHead id="sj-vm" word="Visi & misi" title={t('sejarah.visionMission')} intro={t('sejarah.visionMission.sub')} />
        <div className="mt-10 grid gap-x-16 border-t border-border lg:grid-cols-2">
          {[sejarahVision, sejarahMission].map((block) => (
            <Reveal key={block.title.en} className="border-b border-border py-8 lg:border-b-0">
              <h3 className="font-display text-[32px] leading-tight text-ink">{block.title[lang]}</h3>
              <div className="mt-5 space-y-4">
                {block.items.map((item, i) => (
                  <p key={item.en} className={i === 0 ? 'text-[19px] leading-relaxed text-ink' : 'text-[16px] leading-relaxed text-muted-foreground'}>
                    {item[lang]}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x mt-20 md:mt-28" aria-labelledby="sj-act">
        <SectionHead id="sj-act" word="Kegiatan" title={t('sejarah.activities')} intro={t('sejarah.activities.sub')} />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {sejarahActivities.map((item, i) => {
            const p = photo(ACTIVITY_PHOTOS[i]);
            return (
              <Reveal as="li" key={item.title.en} delay={i * 0.07} className="flex flex-col overflow-hidden rounded-[28px] border border-border bg-surface">
                {p && <img src={p.small} alt={p.alt} width="800" height="533" loading="lazy" className="aspect-[3/2] w-full object-cover" />}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-[26px] leading-tight text-ink">{item.title[lang]}</h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">{item.desc[lang]}</p>
                  {p && <Credit image={ACTIVITY_PHOTOS[i]} className="mt-auto pt-5" />}
                </div>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <section className="container-x page-pad mt-20 md:mt-28" aria-labelledby="sj-partners">
        <Reveal className="grid gap-8 rounded-[32px] bg-[#13233F] p-8 text-white md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:p-12">
          <div>
            <p className="font-display text-xl italic text-[#F2B8C0]" lang="id">
              Bersama
            </p>
            <h2 id="sj-partners" className="display-md mt-2 text-white">
              {t('sejarah.partners')}
            </h2>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-white/80">{t('sejarah.partners.sub')}</p>
            <Link
              to="/partners"
              className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-[14px] bg-white px-5 text-[15px] font-semibold text-[#13233F] transition-[background-color,transform] duration-150 hover:bg-white/90 active:scale-[0.97]"
            >
              {t('sejarah.partners.cta')}
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <dl className="space-y-6 self-end">
            <div>
              <dt className="text-sm text-white/65">{t('sejarah.partners.mailingList')}</dt>
              <dd className="mt-1">
                <a href="https://groups.google.com/g/permias-nasional" target="_blank" rel="noopener noreferrer" className="inline-block break-all text-[17px] font-semibold text-white underline decoration-white/35 underline-offset-4 hover:decoration-white">
                  groups.google.com/g/permias-nasional
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/65">{t('sejarah.partners.contact')}</dt>
              <dd className="mt-1">
                <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex items-center gap-2 text-[17px] font-semibold text-white underline decoration-white/35 underline-offset-4 hover:decoration-white">
                  <IconMail className="h-4 w-4" />
                  {SUPPORT_EMAIL}
                </a>
              </dd>
            </div>
            <p className="text-sm text-white/60">{pick({ en: 'Content follows the official history page of PERMIAS Nasional.', id: 'Isi mengikuti halaman sejarah resmi PERMIAS Nasional.' })}</p>
          </dl>
        </Reveal>
      </section>
    </>
  );
}

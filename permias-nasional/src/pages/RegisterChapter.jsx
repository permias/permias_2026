import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { PAGE_PHOTOS } from '../data/photos.js';
import { chapters, stateCount } from '../data/chapters.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { ClubRegisterForm } from '../components/forms/ClubRegisterForm.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { CHAPTER_REGISTER_EMAIL } from '../data/contactEmails.js';

/** Register: what happens after you apply (a real sequence, numbered) beside the form. */
export function RegisterChapter() {
  const { t, pick } = useLanguage();
  const steps = [
    { title: { en: 'Send the form', id: 'Kirim formulir' }, body: { en: 'Tell us your club, campus or city and who leads it. It takes about three minutes.', id: 'Ceritakan klub, kampus atau kota, dan siapa ketuanya. Sekitar tiga menit.' } },
    { title: { en: 'The board gets in touch', id: 'Pengurus menghubungi Anda' }, body: { en: 'The national board replies by email, usually with a few questions about your club.', id: 'Pengurus nasional membalas lewat email, biasanya dengan beberapa pertanyaan tentang klub Anda.' } },
    { title: { en: 'Your chapter goes on the map', id: 'Chapter Anda masuk peta' }, body: { en: 'Once confirmed, your chapter gets a page, a pin on the map and a place in the national network.', id: 'Setelah dikonfirmasi, chapter Anda mendapat halaman, pin di peta, dan tempat di jaringan nasional.' } },
  ];

  return (
    <>
      <Seo title="Club Registration | PERMIAS Nasional" description="Register your student club with PERMIAS Nasional." path="/chapters/register" />
      <PageHeader image={PAGE_PHOTOS.register} title={t('chapterRegister.title')} description={t('chapterRegister.sub')} compact />

      <div className="container-x page-pad mt-12 grid gap-12 md:mt-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-display text-xl italic text-merah" lang="id">
            Bergabung
          </p>
          <h2 className="display-md mt-2 text-ink">{pick({ en: 'What happens next', id: 'Langkah selanjutnya' })}</h2>
          <ol className="mt-8 space-y-0">
            {steps.map((s, i) => (
              <li key={s.title.en} className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 border-t border-border py-6">
                <span className="font-display text-[40px] leading-none text-merah tabular">{i + 1}</span>
                <span>
                  <span className="block text-[18px] font-semibold text-ink">{pick(s.title)}</span>
                  <span className="mt-1.5 block text-[16px] leading-relaxed text-muted-foreground">{pick(s.body)}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="border-t border-border pt-6 text-[16px] leading-relaxed text-muted-foreground">
            {pick({
              en: `You join ${chapters.length} chapters in ${stateCount} states and Washington, DC. Questions first? Email `,
              id: `Anda bergabung dengan ${chapters.length} chapter di ${stateCount} negara bagian dan Washington, DC. Ada pertanyaan? Email `,
            })}
            <a href={`mailto:${CHAPTER_REGISTER_EMAIL}`} className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-merah">
              {CHAPTER_REGISTER_EMAIL}
            </a>{' '}
            {pick({ en: 'or browse the', id: 'atau lihat' })}{' '}
            <Link to="/chapters" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-merah">
              {pick({ en: 'chapter map', id: 'peta chapter' })}
            </Link>
            .
          </p>
        </Reveal>
        <Reveal x={24}>
          <ClubRegisterForm />
        </Reveal>
      </div>
    </>
  );
}

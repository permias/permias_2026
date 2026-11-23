import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { pageTabTitle } from '../utils/seo.js';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { PAGE_PHOTOS } from '../data/photos.js';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Reveal } from '../components/ui/Reveal.jsx';
import { SectionHead } from '../components/ui/Section.jsx';
import { AccordionItem } from '../components/ui/Accordion.jsx';
import { SocialIcon } from '../components/ui/SocialIcon.jsx';
import { IconArrowUpRight, IconCheck, IconMail } from '../components/ui/Icons.jsx';
import { SUPPORT_EMAIL } from '../data/contactEmails.js';
import { motionTokens } from '../lib/motion.js';

const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

const socials = [
  { id: 'instagram', href: 'https://www.instagram.com/permias.nasional/', label: 'Instagram', handle: '@permias.nasional' },
  { id: 'google-groups', href: 'https://groups.google.com/g/permias-nasional', label: 'Google Groups', handle: 'permias-nasional' },
  { id: 'linkedin', href: 'https://www.linkedin.com/company/permiasnasional', label: 'LinkedIn', handle: 'PERMIAS Nasional' },
  { id: 'facebook', href: 'https://www.facebook.com/permias.nasional', label: 'Facebook', handle: 'PERMIAS Nasional' },
  { id: 'youtube', href: 'https://www.youtube.com/channel/UCHjEGs027y3g--ZH5BCS7tw', label: 'YouTube', handle: 'PERMIAS Nasional' },
];

const faqKeys = [1, 2, 3, 4, 5, 6].map((n) => ({ q: `faq.q${n}`, a: `faq.a${n}` }));

const field = 'mt-1.5 w-full rounded-control border border-border bg-card px-4 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-150 focus:border-merah/50 focus:shadow-[0_0_0_4px_rgb(var(--merah)/0.12)]';

/** Contact: a form with honest states (the local API may be offline, so email is always offered), channels and FAQ. */
export function Contact() {
  const { t, pick } = useLanguage();
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t('contact.form.fallbackSubject'))}&body=${encodeURIComponent(form.message)}`;

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      setForm({ name: '', email: '', subject: 'general', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Seo title={pageTabTitle('Contact')} description="Reach the PERMIAS Nasional board for partnerships, media, and chapter support." path="/contact" />
      <PageHeader image={PAGE_PHOTOS.contact} title={t('contact.title')} description={t('contact.sub')} />

      <section className="container-x mt-16 grid gap-12 md:mt-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16" aria-labelledby="ct-form">
        <Reveal>
          <p className="font-display text-xl italic text-merah" lang="id">
            Tulis kepada kami
          </p>
          <h2 id="ct-form" className="display-md mt-2 text-ink">
            {pick({ en: 'Send the board a message', id: 'Kirim pesan ke pengurus' })}
          </h2>
          <form onSubmit={submit} className="mt-8 rounded-[28px] border border-border bg-surface p-6 shadow-[0_30px_70px_-50px_rgba(19,35,63,.5)] sm:p-8" noValidate={false}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-[15px] font-semibold text-ink" htmlFor="c-name">
                  {t('contact.form.name')}
                </label>
                <Input id="c-name" className="mt-1.5" required autoComplete="name" value={form.name} onChange={set('name')} />
              </div>
              <div>
                <label className="text-[15px] font-semibold text-ink" htmlFor="c-email">
                  {t('contact.form.email')}
                </label>
                <Input id="c-email" type="email" className="mt-1.5" required autoComplete="email" value={form.email} onChange={set('email')} />
              </div>
            </div>
            <div className="mt-5">
              <label className="text-[15px] font-semibold text-ink" htmlFor="c-subject">
                {t('contact.form.subject')}
              </label>
              <select id="c-subject" className={`${field} min-h-[48px]`} value={form.subject} onChange={set('subject')}>
                <option value="general">{t('contact.subject.general')}</option>
                <option value="chapter">{t('contact.subject.chapter')}</option>
                <option value="media">{t('contact.subject.media')}</option>
                <option value="partner">{t('contact.subject.partner')}</option>
              </select>
            </div>
            <div className="mt-5">
              <label className="text-[15px] font-semibold text-ink" htmlFor="c-msg">
                {t('contact.form.message')}
              </label>
              <textarea id="c-msg" required rows={6} className={`${field} py-3`} value={form.message} onChange={set('message')} />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button type="submit" loading={status === 'loading'}>
                {t('contact.form.submit')}
              </Button>
              <a href={mailto} className="link-quiet text-[15px] font-semibold text-ink">
                {pick({ en: 'Or write an email instead', id: 'Atau kirim email saja' })}
              </a>
            </div>
            <AnimatePresence mode="wait">
              {(status === 'success' || status === 'error') && (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, y: motionTokens.distance.xs }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: motionTokens.duration.exit } }}
                  role={status === 'error' ? 'alert' : 'status'}
                  className={
                    status === 'success'
                      ? 'mt-6 flex items-start gap-3 rounded-[16px] bg-teal/10 p-4 text-[15px] text-ink'
                      : 'mt-6 rounded-[16px] border border-merah/25 bg-merah/[0.05] p-4 text-[15px] leading-relaxed text-ink'
                  }
                >
                  {status === 'success' ? (
                    <>
                      <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                      {t('contact.form.success')}
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">{pick({ en: 'The message service is not reachable right now.', id: 'Layanan pesan sedang tidak dapat dihubungi.' })}</p>
                      <p className="mt-1 text-muted-foreground">
                        {pick({ en: 'Your text is still in the form. Send it by email and it reaches the same inbox:', id: 'Teks Anda masih ada di formulir. Kirim lewat email, tujuannya sama:' })}{' '}
                        <a href={mailto} className="font-semibold text-merah underline underline-offset-4">
                          {SUPPORT_EMAIL}
                        </a>
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Reveal>

        <Reveal x={24} className="lg:pt-[92px]">
          <h2 className="font-display text-[28px] leading-tight text-ink">{t('contact.direct')}</h2>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="group mt-4 flex items-center gap-4 rounded-[20px] bg-[#13233F] p-5 text-white transition-[background-color,transform] duration-150 hover:bg-[#1A2E52] active:scale-[0.99]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
              <IconMail className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm text-white/70">{pick({ en: 'Email the board', id: 'Email pengurus' })}</span>
              <span className="block truncate text-[17px] font-semibold">{SUPPORT_EMAIL}</span>
            </span>
          </a>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex min-h-[64px] items-center gap-4 py-3 transition-colors">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/[0.05] text-ink transition-colors group-hover:bg-merah group-hover:text-white dark:bg-white/10">
                    <SocialIcon id={s.id} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-semibold text-ink">{s.label}</span>
                    <span className="block truncate text-sm text-muted-foreground">{s.handle}</span>
                  </span>
                  <IconArrowUpRight className="h-4 w-4 text-ink/40 transition-[color,transform] duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-merah" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="container-x page-pad mt-20 md:mt-28" aria-labelledby="ct-faq">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <SectionHead id="ct-faq" word="Tanya jawab" title={pick({ en: 'Questions we hear often', id: 'Pertanyaan yang sering diajukan' })} />
          <Reveal x={24} className="border-t border-ink/10 dark:border-white/10">
            {faqKeys.map((f) => (
              <AccordionItem key={f.q} title={t(f.q)}>
                {t(f.a)}
              </AccordionItem>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}

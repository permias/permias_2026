import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo, pageTabTitle } from '../components/Seo.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { ScrollReveal } from '../components/ui/ScrollReveal.jsx';
import { AccordionItem } from '../components/ui/Accordion.jsx';
import { sectionImages } from '../data/siteMedia.js';

const socials = [
  {
    href: 'https://groups.google.com/g/permias-nasional',
    label: 'Google Groups',
    handle: 'groups.google.com/g/permias-nasional',
    followers: 'Mailing list',
  },
  { href: 'https://www.instagram.com/permias.nasional/', label: 'Instagram', handle: '@permias.nasional', followers: '48.2k followers' },
  { href: 'https://www.facebook.com/permias.nasional', label: 'Facebook', handle: 'PERMIAS Nasional', followers: '12.4k followers' },
  { href: 'https://www.linkedin.com/company/permiasnasional', label: 'LinkedIn', handle: 'PERMIAS Nasional', followers: '6.7k followers' },
  { href: 'https://www.youtube.com/channel/UCHjEGs027y3g--ZH5BCS7tw', label: 'YouTube', handle: 'PERMIAS Nasional', followers: '3.1k subscribers' },
];

const faqKeys = [1, 2, 3, 4, 5, 6].map((n) => ({ q: `faq.q${n}`, a: `faq.a${n}` }));

export function Contact() {
  const { t } = useLanguage();
  const [status, setStatus] = useState('idle');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' });

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setMsg(data.error || t('contact.form.error'));
        return;
      }
      setStatus('success');
      setMsg(t('contact.form.success'));
      setForm({ name: '', email: '', subject: 'general', message: '' });
    } catch {
      setStatus('error');
      setMsg(t('contact.form.error'));
    }
  };

  return (
    <>
      <Seo title={pageTabTitle('Contact')} description="Reach the PERMIAS Nasional board for partnerships, media, and chapter support." path="/contact" />
      <div className="border-b border-brand-charcoal/10 bg-white py-14 dark:border-white/10 dark:bg-surface-dark">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t('contact.title')}</h1>
            <p className="mt-4 max-w-3xl text-lg text-brand-charcoal/75 dark:text-white/75">{t('contact.sub')}</p>
          </ScrollReveal>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-10 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-center font-display text-2xl font-bold">{t('contact.channels.title')}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-brand-charcoal/80 dark:text-white/80">{t('contact.channels.intro')}</p>
          <img
            src={sectionImages.contactCards}
            alt=""
            className="mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-brand-charcoal/10 object-cover shadow-lg dark:border-white/10"
            loading="lazy"
          />
        </ScrollReveal>
      </div>

      <div className="border-y border-brand-charcoal/10 bg-neutral-50 py-10 dark:border-white/10 dark:bg-black/20">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-center font-display text-2xl font-bold">{t('contact.emergency.title')}</h2>
            <img
              src={sectionImages.emergencyMap}
              alt=""
              className="mx-auto mt-6 w-full max-w-4xl rounded-2xl border border-brand-charcoal/10 object-contain shadow-md dark:border-white/10"
              loading="lazy"
            />
          </ScrollReveal>
        </div>
      </div>

      <div className="mx-auto grid max-w-content gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <ScrollReveal>
          <form onSubmit={submit} className="space-y-4 rounded-2xl border border-brand-charcoal/10 bg-neutral-50 p-6 dark:border-white/10 dark:bg-surface-card">
            <div>
              <label className="text-sm font-semibold" htmlFor="c-name">
                {t('contact.form.name')}
              </label>
              <Input id="c-name" className="mt-1" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="c-email">
                {t('contact.form.email')}
              </label>
              <Input id="c-email" type="email" className="mt-1" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="c-subject">
                {t('contact.form.subject')}
              </label>
              <select
                id="c-subject"
                className="mt-1 w-full rounded-xl border border-brand-charcoal/15 bg-white px-4 py-3 text-sm dark:border-white/15 dark:bg-surface-dark dark:text-white"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                <option value="general">{t('contact.subject.general')}</option>
                <option value="chapter">{t('contact.subject.chapter')}</option>
                <option value="media">{t('contact.subject.media')}</option>
                <option value="partner">{t('contact.subject.partner')}</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="c-msg">
                {t('contact.form.message')}
              </label>
              <textarea
                id="c-msg"
                required
                rows={5}
                className="mt-1 w-full rounded-xl border border-brand-charcoal/15 bg-white px-4 py-3 text-sm outline-none dark:border-white/15 dark:bg-surface-dark dark:text-white"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? '…' : t('contact.form.submit')}
            </Button>
            {msg && <p className="text-sm font-semibold text-brand-red dark:text-white">{msg}</p>}
          </form>
        </ScrollReveal>

        <div className="space-y-8">
          <ScrollReveal staggerIndex={1}>
            <h2 className="font-display text-xl font-bold">{t('contact.direct')}</h2>
            <a href="mailto:info@permiasnasional.com" className="mt-2 block text-lg font-bold text-brand-red underline-offset-4 hover:underline">
              info@permiasnasional.com
            </a>
            <ul className="mt-6 space-y-4">
              {socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-brand-charcoal/10 bg-white p-3 transition hover:border-brand-red/40 dark:border-white/10 dark:bg-surface-card"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wide text-brand-red">{s.label}</p>
                    <p className="text-sm font-semibold">{s.handle}</p>
                    <p className="text-[11px] text-brand-charcoal/60 dark:text-white/60">{s.followers}</p>
                  </a>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal staggerIndex={2}>
            <h2 className="font-display text-xl font-bold">{t('contact.faq.title')}</h2>
            <div className="mt-4 rounded-2xl border border-brand-charcoal/10 bg-white px-4 dark:border-white/10 dark:bg-surface-card">
              {faqKeys.map((f) => (
                <AccordionItem key={f.q} title={t(f.q)}>
                  {t(f.a)}
                </AccordionItem>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal staggerIndex={3}>
            <h2 className="font-display text-xl font-bold">{t('contact.map.title')}</h2>
            <img
              src="https://placehold.co/800x400/1A1A1A/FFFFFF?text=USA+PERMIAS+Reach+%28placeholder+map%29"
              alt="Map of the United States highlighting PERMIAS chapter presence"
              className="mt-4 w-full rounded-2xl border border-brand-charcoal/10 object-cover dark:border-white/10"
            />
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo } from '../components/Seo.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { ScrollReveal } from '../components/ui/ScrollReveal.jsx';

const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

const initialForm = {
  orgName: '',
  school: '',
  cityState: '',
  presidentName: '',
  email: '',
  phone: '',
  website: '',
  instagram: '',
};

export function RegisterChapter() {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [msg, setMsg] = useState('');

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/chapter-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setMsg(data.error || t('chapterRegister.form.error'));
        return;
      }
      setStatus('success');
      setMsg(t('chapterRegister.form.success'));
      setForm(initialForm);
    } catch {
      setStatus('error');
      setMsg(t('chapterRegister.form.error'));
    }
  };

  return (
    <>
      <Seo
        title="Register a Chapter | PERMIAS Nasional"
        description="Submit your student organization to affiliate with PERMIAS Nasional."
        path="/chapters/register"
      />
      <div className="border-b border-brand-charcoal/10 bg-white py-14 dark:border-white/10 dark:bg-surface-dark">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-sm font-bold uppercase tracking-wide text-brand-red">{t('chapters.register')}</p>
            <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {t('chapterRegister.title')}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-brand-charcoal/75 dark:text-white/75">{t('chapterRegister.sub')}</p>
          </ScrollReveal>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <ScrollReveal>
          <form
            onSubmit={submit}
            className="mx-auto max-w-xl space-y-4 rounded-2xl border border-brand-charcoal/10 bg-neutral-50 p-6 shadow-sm dark:border-white/10 dark:bg-surface-card sm:p-8"
          >
            <div>
              <label className="text-sm font-semibold" htmlFor="cr-org">
                {t('chapterRegister.form.orgName')}
              </label>
              <Input id="cr-org" className="mt-1" required value={form.orgName} onChange={set('orgName')} />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="cr-school">
                {t('chapterRegister.form.school')}
              </label>
              <Input id="cr-school" className="mt-1" required value={form.school} onChange={set('school')} />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="cr-city">
                {t('chapterRegister.form.cityState')}
              </label>
              <Input
                id="cr-city"
                className="mt-1"
                required
                placeholder={t('chapterRegister.form.cityStatePlaceholder')}
                value={form.cityState}
                onChange={set('cityState')}
              />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="cr-president">
                {t('chapterRegister.form.president')}
              </label>
              <Input id="cr-president" className="mt-1" required value={form.presidentName} onChange={set('presidentName')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold" htmlFor="cr-email">
                  {t('chapterRegister.form.email')}
                </label>
                <Input id="cr-email" type="email" className="mt-1" required value={form.email} onChange={set('email')} />
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="cr-phone">
                  {t('chapterRegister.form.phone')}
                </label>
                <Input
                  id="cr-phone"
                  type="tel"
                  className="mt-1"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={set('phone')}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="cr-website">
                {t('chapterRegister.form.website')}
                <span className="ml-1 font-normal text-brand-charcoal/50 dark:text-white/50">
                  ({t('chapterRegister.form.optional')})
                </span>
              </label>
              <Input
                id="cr-website"
                type="url"
                className="mt-1"
                placeholder="https://"
                value={form.website}
                onChange={set('website')}
              />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="cr-ig">
                {t('chapterRegister.form.instagram')}
                <span className="ml-1 font-normal text-brand-charcoal/50 dark:text-white/50">
                  ({t('chapterRegister.form.optional')})
                </span>
              </label>
              <Input
                id="cr-ig"
                className="mt-1"
                placeholder="@chapterhandle"
                value={form.instagram}
                onChange={set('instagram')}
              />
            </div>

            <Button type="submit" className="w-full" disabled={status === 'loading' || status === 'success'}>
              {status === 'loading' ? '…' : t('chapterRegister.form.submit')}
            </Button>

            {msg && (
              <p
                className={`text-sm font-semibold ${status === 'success' ? 'text-green-700 dark:text-green-400' : 'text-brand-red dark:text-white'}`}
                role="status"
              >
                {msg}
              </p>
            )}

            <p className="text-center text-sm text-brand-charcoal/60 dark:text-white/60">
              <Link to="/chapters" className="font-semibold text-brand-red underline-offset-4 hover:underline">
                ← {t('chapterRegister.back')}
              </Link>
            </p>
          </form>
        </ScrollReveal>
      </div>
    </>
  );
}

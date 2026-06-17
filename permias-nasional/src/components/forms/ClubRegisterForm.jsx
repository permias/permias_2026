import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { CHAPTER_REGISTER_EMAIL } from '../../data/contactEmails.js';

const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

const initialForm = {
  orgName: '',
  school: '',
  cityState: '',
  fullName: '',
  email: '',
  phone: '',
  website: '',
  instagram: '',
};

export function ClubRegisterForm({ compact = false, showBackLink = false }) {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [msg, setMsg] = useState('');

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const fallbackMailto = `mailto:${CHAPTER_REGISTER_EMAIL}?subject=${encodeURIComponent(t('chapterRegister.form.fallbackSubject'))}`;

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/chapter-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, presidentName: form.fullName }),
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
    <form onSubmit={submit} className="surface-card space-y-4 p-6 sm:p-8">
      <p className="section-label">{t('chapterRegister.form.sectionContact')}</p>
      <div>
        <label className="text-sm font-medium" htmlFor={compact ? 'home-cr-fullname' : 'cr-fullname'}>
          {t('chapterRegister.form.fullName')}
        </label>
        <Input
          id={compact ? 'home-cr-fullname' : 'cr-fullname'}
          className="mt-1.5"
          required
          autoComplete="name"
          value={form.fullName}
          onChange={set('fullName')}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium" htmlFor={compact ? 'home-cr-email' : 'cr-email'}>
            {t('chapterRegister.form.email')}
          </label>
          <Input
            id={compact ? 'home-cr-email' : 'cr-email'}
            type="email"
            className="mt-1.5"
            required
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor={compact ? 'home-cr-phone' : 'cr-phone'}>
            {t('chapterRegister.form.phone')}
          </label>
          <Input
            id={compact ? 'home-cr-phone' : 'cr-phone'}
            type="tel"
            className="mt-1.5"
            required
            autoComplete="tel"
            placeholder="+1 555 123 4567"
            value={form.phone}
            onChange={set('phone')}
          />
        </div>
      </div>

      <p className="section-label pt-1">{t('chapterRegister.form.sectionOrg')}</p>
      <div>
        <label className="text-sm font-medium" htmlFor={compact ? 'home-cr-org' : 'cr-org'}>
          {t('chapterRegister.form.orgName')}
        </label>
        <Input
          id={compact ? 'home-cr-org' : 'cr-org'}
          className="mt-1.5"
          required
          value={form.orgName}
          onChange={set('orgName')}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium" htmlFor={compact ? 'home-cr-school' : 'cr-school'}>
            {t('chapterRegister.form.school')}
          </label>
          <Input
            id={compact ? 'home-cr-school' : 'cr-school'}
            className="mt-1.5"
            required
            value={form.school}
            onChange={set('school')}
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor={compact ? 'home-cr-city' : 'cr-city'}>
            {t('chapterRegister.form.cityState')}
          </label>
          <Input
            id={compact ? 'home-cr-city' : 'cr-city'}
            className="mt-1.5"
            required
            placeholder={t('chapterRegister.form.cityStatePlaceholder')}
            value={form.cityState}
            onChange={set('cityState')}
          />
        </div>
      </div>

      {!compact && (
        <>
          <div>
            <label className="text-sm font-medium" htmlFor="cr-website">
              {t('chapterRegister.form.website')}{' '}
              <span className="font-normal text-muted-foreground">({t('chapterRegister.form.optional')})</span>
            </label>
            <Input id="cr-website" type="url" className="mt-1.5" placeholder="https://" value={form.website} onChange={set('website')} />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="cr-ig">
              {t('chapterRegister.form.instagram')}{' '}
              <span className="font-normal text-muted-foreground">({t('chapterRegister.form.optional')})</span>
            </label>
            <Input id="cr-ig" className="mt-1.5" placeholder="@chapterhandle" value={form.instagram} onChange={set('instagram')} />
          </div>
        </>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={status === 'loading' || status === 'success'}>
        {status === 'loading' ? '…' : t('chapterRegister.form.submit')}
      </Button>

      {msg && (
        <p
          className={`text-sm font-medium ${status === 'success' ? 'text-green-700 dark:text-green-400' : 'text-brand-red'}`}
          role="status"
        >
          {msg}
        </p>
      )}

      {status === 'error' && (
        <p className="text-sm text-muted-foreground">
          {t('chapterRegister.form.fallback')}{' '}
          <a href={fallbackMailto} className="font-medium text-brand-red underline-offset-4 hover:underline">
            {CHAPTER_REGISTER_EMAIL}
          </a>
        </p>
      )}

      {showBackLink && (
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/chapters" className="font-medium text-brand-red underline-offset-4 hover:underline">
            ← {t('chapterRegister.back')}
          </Link>
        </p>
      )}
    </form>
  );
}

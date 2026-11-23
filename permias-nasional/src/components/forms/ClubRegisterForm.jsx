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
    <form onSubmit={submit} className="surface-card space-y-5 p-6 sm:p-8">
      <p className="font-display text-[22px] text-ink">{t('chapterRegister.form.sectionContact')}</p>
      <div>
        <label className="text-[15px] font-semibold text-ink" htmlFor={compact ? 'home-cr-fullname' : 'cr-fullname'}>
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
          <label className="text-[15px] font-semibold text-ink" htmlFor={compact ? 'home-cr-email' : 'cr-email'}>
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
          <label className="text-[15px] font-semibold text-ink" htmlFor={compact ? 'home-cr-phone' : 'cr-phone'}>
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

      <p className="border-t border-border pt-6 font-display text-[22px] text-ink">{t('chapterRegister.form.sectionOrg')}</p>
      <div>
        <label className="text-[15px] font-semibold text-ink" htmlFor={compact ? 'home-cr-org' : 'cr-org'}>
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
          <label className="text-[15px] font-semibold text-ink" htmlFor={compact ? 'home-cr-school' : 'cr-school'}>
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
          <label className="text-[15px] font-semibold text-ink" htmlFor={compact ? 'home-cr-city' : 'cr-city'}>
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
            <label className="text-[15px] font-semibold text-ink" htmlFor="cr-website">
              {t('chapterRegister.form.website')}{' '}
              <span className="font-normal text-muted-foreground">({t('chapterRegister.form.optional')})</span>
            </label>
            <Input id="cr-website" type="url" className="mt-1.5" placeholder="https://" value={form.website} onChange={set('website')} />
          </div>
          <div>
            <label className="text-[15px] font-semibold text-ink" htmlFor="cr-ig">
              {t('chapterRegister.form.instagram')}{' '}
              <span className="font-normal text-muted-foreground">({t('chapterRegister.form.optional')})</span>
            </label>
            <Input id="cr-ig" className="mt-1.5" placeholder="@chapterhandle" value={form.instagram} onChange={set('instagram')} />
          </div>
        </>
      )}

      <Button type="submit" className="w-full" size="lg" loading={status === 'loading'} disabled={status === 'success'}>
        {t('chapterRegister.form.submit')}
      </Button>

      {msg && (
        <div
          className={status === 'success' ? 'rounded-[14px] bg-teal/10 p-4 text-[15px] font-medium text-ink' : 'rounded-[14px] border border-merah/25 bg-merah/[0.05] p-4 text-[15px] leading-relaxed text-ink'}
          role={status === 'error' ? 'alert' : 'status'}
        >
          <p className="font-semibold">{msg}</p>
          {status === 'error' && (
            <p className="mt-1 text-muted-foreground">
              {t('chapterRegister.form.fallback')}{' '}
              <a href={fallbackMailto} className="font-semibold text-merah underline underline-offset-4">
                {CHAPTER_REGISTER_EMAIL}
              </a>
            </p>
          )}
        </div>
      )}

      {showBackLink && (
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/chapters" className="font-medium text-merah underline-offset-4 hover:underline">
            ← {t('chapterRegister.back')}
          </Link>
        </p>
      )}
    </form>
  );
}

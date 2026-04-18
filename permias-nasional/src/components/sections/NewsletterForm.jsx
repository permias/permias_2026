import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { cn } from '../../utils/cn.js';

export function NewsletterForm({ className = '' }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || t('home.newsletter.error'));
        return;
      }
      setStatus('success');
      setMessage(t('home.newsletter.success'));
      setEmail('');
    } catch {
      setStatus('error');
      setMessage(t('home.newsletter.error'));
    }
  };

  return (
    <form onSubmit={submit} className={cn('flex flex-col gap-3 sm:flex-row', className)}>
      <Input
        type="email"
        required
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('home.newsletter.placeholder')}
        aria-label={t('home.newsletter.placeholder')}
        disabled={status === 'loading'}
      />
      <Button type="submit" disabled={status === 'loading'} className="shrink-0">
        {status === 'loading' ? '…' : t('home.newsletter.submit')}
      </Button>
      {message && (
        <p className="w-full text-sm font-medium text-brand-red sm:col-span-full dark:text-white" role="status">
          {message}
        </p>
      )}
    </form>
  );
}

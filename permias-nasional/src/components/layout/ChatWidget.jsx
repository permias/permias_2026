import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { cn } from '../../utils/cn.js';

export function ChatWidget() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [reply, setReply] = useState('');

  const send = async () => {
    setReply('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          system:
            'You are a helpful assistant for PERMIAS Nasional. You help Indonesian students navigate life in the US — visas, academics, scholarships, and finding community.',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setReply(data.error || t('chat.todo'));
        return;
      }
      setReply(data.reply || '');
    } catch {
      setReply(t('chat.todo'));
    }
  };

  return (
    <>
      <button
        type="button"
        className="fixed bottom-6 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-white shadow-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        aria-label={t('chat.open')}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>

      <div
        className={cn(
          'fixed bottom-0 right-0 z-[58] flex h-[min(100%,480px)] w-full max-w-md translate-x-full flex-col border-l border-t border-brand-charcoal/10 bg-white shadow-2xl transition-transform duration-300 dark:border-white/10 dark:bg-surface-card sm:bottom-6 sm:right-6 sm:h-[420px] sm:rounded-2xl sm:border',
          open ? 'translate-x-0' : 'pointer-events-none',
        )}
        role="dialog"
        aria-label={t('chat.title')}
      >
        <div className="flex items-center justify-between border-b border-brand-charcoal/10 px-4 py-3 dark:border-white/10">
          <p className="font-display font-bold">{t('chat.title')}</p>
          <button type="button" className="rounded-full p-2 text-sm font-semibold" onClick={() => setOpen(false)} aria-label={t('search.close')}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm text-brand-charcoal/80 dark:text-white/80">
          <p className="rounded-xl bg-brand-red/5 p-3 text-xs dark:bg-white/5">{t('chat.todo')}</p>
          {reply && <p className="rounded-xl bg-black/5 p-3 text-xs dark:bg-white/10">{reply}</p>}
        </div>
        <div className="flex gap-2 border-t border-brand-charcoal/10 p-3 dark:border-white/10">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('chat.placeholder')}
            aria-label={t('chat.placeholder')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send();
            }}
          />
          <Button type="button" onClick={send} className="shrink-0 !px-4">
            {t('chat.send')}
          </Button>
        </div>
      </div>
    </>
  );
}

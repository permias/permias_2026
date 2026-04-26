import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { cn } from '../../utils/cn.js';

function nextId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ChatWidget() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

  const send = async () => {
    if (!String(text).trim() || loading) return;
    const userText = String(text).trim();
    setText('');

    const userId = nextId();
    setMessages((prev) => [...prev, { id: userId, role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          system:
            'You are a helpful assistant for PERMIAS Nasional. You help Indonesian students navigate life in the US — visas, academics, scholarships, and finding community. Be accurate and concise. If the user needs legal, immigration, or tax advice, remind them to confirm with a qualified professional (DSO, attorney, or tax advisor).',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: 'error', text: data.error || t('chat.todo') },
        ]);
        return;
      }
      const reply = data.reply || '';
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { id: nextId(), role: 'error', text: t('chat.todo') }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="fixed bottom-6 right-4 z-[52] flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-white shadow-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
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
          'fixed bottom-0 right-0 z-[52] flex h-[min(100%,480px)] w-full max-w-md translate-x-full flex-col border-l border-t border-brand-charcoal/10 bg-white shadow-2xl transition-transform duration-300 dark:border-white/10 dark:bg-surface-card sm:bottom-6 sm:right-6 sm:h-[420px] sm:rounded-2xl sm:border',
          open ? 'translate-x-0' : 'pointer-events-none',
        )}
        role="dialog"
        aria-label={t('chat.title')}
        aria-busy={loading}
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
          <p className="rounded-xl bg-brand-red/5 p-3 text-xs dark:bg-white/5">{t('chat.intro')}</p>
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                'flex w-full min-w-0',
                m.role === 'user' && 'justify-end',
                (m.role === 'assistant' || m.role === 'error') && 'justify-start',
              )}
            >
              <p
                className={cn(
                  'min-w-0 max-w-[min(85%,20rem)] rounded-xl p-3 text-xs',
                  'w-fit whitespace-pre-wrap break-words [text-wrap:pretty]',
                  m.role === 'user' && 'border border-brand-red/20 bg-brand-red/10 text-left dark:border-white/10 dark:bg-brand-red/20',
                  m.role === 'assistant' && 'bg-black/5 text-left dark:bg-white/10',
                  m.role === 'error' && 'border border-amber-500/30 bg-amber-500/10 text-left text-amber-900 dark:text-amber-100/90',
                )}
              >
                {m.text}
              </p>
            </div>
          ))}
          {loading && (
            <p className="text-xs text-brand-charcoal/50 dark:text-white/50" aria-live="polite">
              {t('chat.thinking')}
            </p>
          )}
        </div>
        <div className="flex gap-2 border-t border-brand-charcoal/10 p-3 dark:border-white/10">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('chat.placeholder')}
            aria-label={t('chat.placeholder')}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <Button type="button" onClick={send} disabled={loading} className="shrink-0 !px-4">
            {t('chat.send')}
          </Button>
        </div>
      </div>
    </>
  );
}

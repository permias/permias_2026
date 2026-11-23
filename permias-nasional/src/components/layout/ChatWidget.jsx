import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useUi } from '../../context/UiContext.jsx';
import { motionTokens, springs } from '../../lib/motion.js';
import { cn } from '../../utils/cn.js';
import { IconChat, IconClose, IconCollapse, IconExpand } from '../ui/Icons.jsx';

function nextId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const SYSTEM =
  'You are a helpful assistant for PERMIAS Nasional. You help Indonesian students navigate life in the US — visas, academics, scholarships, and finding community. Be accurate and concise. If the user needs legal, immigration, or tax advice, remind them to confirm with a qualified professional (DSO, attorney, or tax advisor).';

/**
 * AI assistant panel. Talks to `${VITE_API_BASE}/api/chat` (Flask backend, proxied in dev).
 * If the API is unreachable it says so and points to the guides instead of failing silently.
 */
export function ChatWidget() {
  const { t } = useLanguage();
  const { chatOpen: open, setChatOpen } = useUi();
  const [fullscreen, setFullscreen] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

  useEffect(() => {
    if (!open) return undefined;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (e) => e.key === 'Escape' && setChatOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, setChatOpen]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (e) => {
    e?.preventDefault();
    const userText = text.trim();
    if (!userText || loading) return;
    setText('');
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: userText }]);
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, system: SYSTEM }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status >= 500) setOffline(true);
        setMessages((prev) => [...prev, { id: nextId(), role: 'error', text: data.error || t('chat.todo') }]);
        return;
      }
      setOffline(false);
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', text: data.reply || '' }]);
    } catch {
      setOffline(true);
      setMessages((prev) => [...prev, { id: nextId(), role: 'error', text: t('chat.todo') }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="chat-fab"
            type="button"
            className="glass fixed bottom-[max(22px,calc(env(safe-area-inset-bottom)+8px))] right-5 z-[59] hidden h-14 w-14 items-center justify-center rounded-[20px] text-ink md:flex"
            aria-label={t('chat.open')}
            onClick={() => setChatOpen(true)}
            initial={{ opacity: 0, scale: motionTokens.scale.press }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: motionTokens.scale.press, transition: { duration: motionTokens.duration.exit } }}
            whileTap={{ scale: motionTokens.scale.press }}
          >
            <IconChat className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section
            key="chat"
            role="dialog"
            aria-label={t('chat.title')}
            aria-busy={loading}
            className={cn(
              'glass fixed z-[95] flex flex-col overflow-hidden',
              fullscreen
                ? 'inset-2 rounded-[28px] sm:inset-6'
                : 'inset-x-2 bottom-2 top-[18vh] rounded-[28px] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[560px] sm:w-[400px]',
            )}
            style={{ transformOrigin: '100% 100%' }}
            initial={{ opacity: 0, scale: motionTokens.scale.press, y: motionTokens.distance.md }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: springs.snappy }}
            exit={{ opacity: 0, scale: motionTokens.scale.subtle, transition: { duration: motionTokens.duration.exit } }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-merah text-white">
                  <IconChat className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base" style={{ letterSpacing: '-0.01em' }}>
                    {t('chat.title')}
                  </h2>
                  <p className="text-xs text-muted-foreground">{offline ? t('chat.status.offline') : t('chat.status.beta')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="hidden h-10 w-10 items-center justify-center rounded-full text-ink/70 hover:bg-ink/5 hover:text-ink sm:flex"
                  onClick={() => setFullscreen((f) => !f)}
                  aria-label={fullscreen ? t('chat.exitFullscreen') : t('chat.fullscreen')}
                >
                  {fullscreen ? <IconCollapse className="h-5 w-5" /> : <IconExpand className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 hover:bg-ink/5 hover:text-ink"
                  onClick={() => {
                    setChatOpen(false);
                    setFullscreen(false);
                  }}
                  aria-label={t('chat.close')}
                >
                  <IconClose className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-[15px]" aria-live="polite">
              <p className="rounded-[16px] bg-ink/[0.05] p-3 text-[13px] leading-relaxed text-muted-foreground dark:bg-white/5">{t('chat.intro')}</p>
              {messages.map((m) => (
                <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <p
                    className={cn(
                      'max-w-[85%] whitespace-pre-wrap break-words rounded-[18px] px-3.5 py-2.5',
                      m.role === 'user' && 'rounded-br-[6px] bg-merah text-white',
                      m.role === 'assistant' && 'rounded-bl-[6px] bg-white text-ink dark:bg-white/10',
                      m.role === 'error' && 'rounded-bl-[6px] border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100',
                    )}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
              {offline && (
                <p className="text-sm text-muted-foreground">
                  {t('chat.offline.help')}{' '}
                  <Link to="/resources" className="link-quiet font-semibold text-ink" onClick={() => setChatOpen(false)}>
                    {t('dock.resources')}
                  </Link>
                </p>
              )}
              {loading && <p className="text-sm text-muted-foreground">{t('chat.thinking')}</p>}
            </div>

            <form onSubmit={send} className="flex gap-2 border-t border-ink/10 p-3 dark:border-white/10">
              <label htmlFor="chat-input" className="sr-only">
                {t('chat.placeholder')}
              </label>
              <input
                id="chat-input"
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('chat.placeholder')}
                disabled={loading}
                className="min-h-[48px] min-w-0 flex-1 rounded-control border border-ink/10 bg-white/80 px-4 text-ink outline-none placeholder:text-ink/45 focus:border-merah/40 dark:bg-white/5"
              />
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="min-h-[48px] shrink-0 rounded-control bg-merah px-4 font-semibold text-white transition-[transform,opacity] duration-150 active:scale-[0.97] disabled:opacity-50"
              >
                {t('chat.send')}
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

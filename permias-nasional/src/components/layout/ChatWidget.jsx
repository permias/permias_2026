import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useUi } from '../../context/UiContext.jsx';
import { motionTokens, springs } from '../../lib/motion.js';
import { publicUrl } from '../../utils/site.js';
import { cn } from '../../utils/cn.js';
import { IconArrowRight, IconChat, IconClose, IconCollapse, IconExpand } from '../ui/Icons.jsx';

function nextId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const SYSTEM =
  'You are a helpful assistant for PERMIAS Nasional. You help Indonesian students navigate life in the US — visas, academics, scholarships, and finding community. Be accurate and concise. If the user needs legal, immigration, or tax advice, remind them to confirm with a qualified professional (DSO, attorney, or tax advisor).';

// Suggested questions; each also names the page that answers it, used when the assistant is offline.
const SUGGESTIONS = [
  { q: { en: 'How do I keep my F-1 status?', id: 'Bagaimana menjaga status F-1?' }, to: '/resources/visa', page: { en: 'Visa guide', id: 'Panduan visa' } },
  { q: { en: 'Which scholarships fund study in the U.S.?', id: 'Beasiswa apa untuk kuliah di AS?' }, to: '/resources/scholarships', page: { en: 'Scholarships', id: 'Beasiswa' } },
  { q: { en: 'Is there a chapter near my campus?', id: 'Adakah chapter di dekat kampus saya?' }, to: '/chapters?near=1', page: { en: 'Chapter map', id: 'Peta chapter' } },
  { q: { en: 'How do I reach the Indonesian consulate?', id: 'Bagaimana menghubungi KJRI?' }, to: '/resources/embassies', page: { en: 'Embassy and consulates', id: 'Kedutaan dan konsulat' } },
];

const OFFLINE_LINKS = [...SUGGESTIONS, { to: '/contact', page: { en: 'Email the board', id: 'Email pengurus' } }];

function TypingDots({ label }) {
  return (
    <div className="flex justify-start" role="status" aria-label={label}>
      <span className="flex items-center gap-1 rounded-[18px] rounded-bl-[6px] bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,27,45,.06)] dark:bg-white/10">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-ink/45"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: motionTokens.duration.crawl, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
          />
        ))}
      </span>
    </div>
  );
}

function OfflineCard({ pick, onNavigate }) {
  return (
    <div className="rounded-[20px] border border-ink/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.06]">
      <p className="text-[15px] font-semibold text-ink">{pick({ en: 'The assistant is offline on this preview', id: 'Asisten sedang offline di pratinjau ini' })}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {pick({
          en: 'Its answer service is not running here, so it cannot reply yet. These pages answer the questions students ask most:',
          id: 'Layanan jawabannya belum berjalan di sini, jadi belum bisa membalas. Halaman berikut menjawab pertanyaan yang paling sering diajukan:',
        })}
      </p>
      <ul className="mt-3 grid gap-1">
        {OFFLINE_LINKS.map((l) => (
          <li key={l.to}>
            <Link to={l.to} onClick={onNavigate} className="group flex min-h-[40px] items-center justify-between gap-3 rounded-[12px] px-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-ink/[0.05] dark:hover:bg-white/10">
              {pick(l.page)}
              <IconArrowRight className="h-4 w-4 text-merah transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Assistant panel, in the dock's glass. Talks to `${VITE_API_BASE}/api/chat` (Flask, proxied in dev).
 * It checks once whether the service answers; when it does not, it says so plainly and offers the pages instead.
 */
export function ChatWidget() {
  const { t, pick, lang } = useLanguage();
  const { chatOpen: open, setChatOpen } = useUi();
  const [fullscreen, setFullscreen] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('unknown'); // unknown | checking | online | offline
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const fabRef = useRef(null);
  const apiBase = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

  const close = useCallback(() => {
    setChatOpen(false);
    setFullscreen(false);
    requestAnimationFrame(() => fabRef.current?.focus());
  }, [setChatOpen]);

  // one light reachability check per session: an empty POST gets 400 from a live service without running the model
  const probed = useRef(false);
  useEffect(() => {
    if (!open || probed.current) return;
    probed.current = true;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    queueMicrotask(() => setStatus((s) => (s === 'unknown' ? 'checking' : s)));
    fetch(`${apiBase}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}', signal: ctrl.signal })
      // only our Flask service answers an empty message with a JSON 400 ("Missing or empty message field.")
      .then(async (res) => {
        const body = res.status === 400 && (res.headers.get('content-type') || '').includes('json') ? await res.json().catch(() => null) : null;
        const live = Boolean(body && typeof body.error === 'string' && /message/i.test(body.error));
        setStatus((s) => (s === 'checking' || s === 'unknown' ? (live ? 'online' : 'offline') : s));
      })
      .catch(() => setStatus((s) => (s === 'checking' || s === 'unknown' ? 'offline' : s)))
      .finally(() => clearTimeout(timer));
  }, [open, apiBase]);

  useEffect(() => {
    if (!open) return undefined;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  // follow the conversation; the welcome and offline card stay in view until there is one
  useEffect(() => {
    if (!messages.length && !loading) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const offlineReply = (userText) => {
    const hit = SUGGESTIONS.find((s) => s.q.en === userText || s.q.id === userText);
    return {
      id: nextId(),
      role: 'offline',
      text: pick({ en: 'I cannot answer while the assistant service is offline.', id: 'Saya belum bisa menjawab selama layanan asisten offline.' }),
      link: hit ? { to: hit.to, label: pick(hit.page) } : { to: '/resources', label: pick({ en: 'Student guides', id: 'Panduan mahasiswa' }) },
    };
  };

  const ask = async (userText) => {
    if (!userText || loading) return;
    setText('');
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: userText }]);
    if (status === 'offline') {
      setMessages((prev) => [...prev, offlineReply(userText)]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, system: SYSTEM, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw new Error(String(res.status));
      setStatus('online');
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', text: data.reply }]);
    } catch {
      setStatus('offline');
      setMessages((prev) => [...prev, offlineReply(userText)]);
    } finally {
      setLoading(false);
    }
  };

  const statusLine = {
    unknown: t('chat.status.beta'),
    checking: pick({ en: 'Connecting…', id: 'Menghubungkan…' }),
    online: t('chat.status.beta'),
    offline: t('chat.status.offline'),
  }[status];

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="chat-fab"
            ref={fabRef}
            type="button"
            className="glass sheen fixed bottom-[max(22px,calc(env(safe-area-inset-bottom)+8px))] right-5 z-[59] hidden h-14 w-14 items-center justify-center rounded-[20px] text-ink transition-[box-shadow] duration-150 hover:shadow-[0_18px_40px_-18px_rgba(15,27,45,.55)] md:flex"
            aria-label={t('chat.open')}
            onClick={() => setChatOpen(true)}
            initial={{ opacity: 0, scale: motionTokens.scale.press }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: motionTokens.scale.press, transition: { duration: motionTokens.duration.exit } }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: motionTokens.scale.press }}
          >
            <IconChat className="relative z-[2] h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section
            key="chat"
            role="dialog"
            aria-modal="false"
            aria-labelledby="chat-title"
            aria-busy={loading}
            className={cn(
              'glass fixed z-[95] flex flex-col overflow-hidden bg-white/[0.86] dark:bg-[#16223A]/[0.9]',
              fullscreen ? 'inset-2 rounded-[28px] sm:inset-6' : 'inset-x-2 bottom-2 top-[14vh] rounded-[28px] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[600px] sm:max-h-[calc(100vh-110px)] sm:w-[408px]',
            )}
            style={{ transformOrigin: '100% 100%' }}
            initial={{ opacity: 0, scale: motionTokens.scale.press, y: motionTokens.distance.md }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: springs.snappy }}
            exit={{ opacity: 0, scale: motionTokens.scale.subtle, transition: { duration: motionTokens.duration.exit } }}
          >
            <header className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-3 dark:border-white/10">
              <div className="flex min-w-0 items-center gap-3">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white shadow-[0_1px_2px_rgba(15,27,45,.12)]">
                  <img src={publicUrl('/images/brand/emblem-red.png')} alt="" width="24" height="26" className="h-[26px] w-6" />
                  <span
                    className={cn(
                      'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-[#16223A]',
                      status === 'online' ? 'bg-emerald-500' : status === 'offline' ? 'bg-amber-500' : 'bg-ink/30',
                    )}
                    aria-hidden="true"
                  />
                </span>
                <div className="min-w-0">
                  <h2 id="chat-title" className="truncate font-sans text-[16px] font-semibold text-ink">
                    {t('chat.title')}
                  </h2>
                  <p className="truncate text-[13px] text-muted-foreground" aria-live="polite">
                    {statusLine}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="hidden h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink active:scale-95 sm:flex"
                  onClick={() => setFullscreen((f) => !f)}
                  aria-label={fullscreen ? t('chat.exitFullscreen') : t('chat.fullscreen')}
                >
                  {fullscreen ? <IconCollapse className="h-5 w-5" /> : <IconExpand className="h-5 w-5" />}
                </button>
                <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink active:scale-95" onClick={close} aria-label={t('chat.close')}>
                  <IconClose className="h-5 w-5" />
                </button>
              </div>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 text-[15px]">
              <div className="rounded-[20px] bg-white/70 p-4 dark:bg-white/[0.06]">
                <p className="font-display text-[22px] leading-tight text-ink">{pick({ en: 'Halo! How can we help?', id: 'Halo! Ada yang bisa dibantu?' })}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t('chat.intro')}</p>
              </div>

              {status === 'offline' && messages.length === 0 && <OfflineCard pick={pick} onNavigate={close} />}

              {messages.length === 0 && (
                <div>
                  <p className="px-1 text-[13px] font-semibold text-muted-foreground">{pick({ en: 'Try asking', id: 'Coba tanyakan' })}</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <li key={s.to}>
                        <button
                          type="button"
                          onClick={() => ask(pick(s.q))}
                          className="min-h-[40px] rounded-full border border-ink/12 bg-white/70 px-3.5 py-2 text-left text-sm font-medium leading-snug text-ink transition-[background-color,border-color,transform] duration-150 hover:border-merah/40 hover:bg-white active:scale-[0.97] dark:border-white/15 dark:bg-white/[0.06] dark:hover:bg-white/10"
                        >
                          {pick(s.q)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div aria-live="polite" className="space-y-3">
                <AnimatePresence initial={false}>
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: motionTokens.distance.sm }}
                      animate={{ opacity: 1, y: 0, transition: { duration: motionTokens.duration.fast, ease: motionTokens.easing.smooth } }}
                      className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
                    >
                      {m.role === 'offline' ? (
                        <div className="max-w-[88%] rounded-[18px] rounded-bl-[6px] border border-amber-500/30 bg-amber-50 px-3.5 py-3 text-ink dark:bg-amber-500/10">
                          <p>{m.text}</p>
                          <Link to={m.link.to} onClick={close} className="mt-2 inline-flex min-h-[36px] items-center gap-1.5 font-semibold text-ink underline decoration-merah/50 underline-offset-4 hover:decoration-merah">
                            {pick({ en: 'Read', id: 'Baca' })}: {m.link.label}
                          </Link>
                        </div>
                      ) : (
                        <p
                          className={cn(
                            'max-w-[85%] whitespace-pre-wrap break-words rounded-[18px] px-3.5 py-2.5',
                            m.role === 'user' ? 'rounded-br-[6px] bg-merah text-white' : 'rounded-bl-[6px] bg-white text-ink shadow-[0_1px_2px_rgba(15,27,45,.06)] dark:bg-white/10',
                          )}
                        >
                          {m.text}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {loading && <TypingDots label={t('chat.thinking')} />}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(text.trim());
              }}
              className="flex gap-2 border-t border-ink/10 p-3 dark:border-white/10"
            >
              <label htmlFor="chat-input" className="sr-only">
                {t('chat.placeholder')}
              </label>
              <input
                id="chat-input"
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('chat.placeholder')}
                autoComplete="off"
                className="min-h-[48px] min-w-0 flex-1 rounded-control border border-ink/10 bg-white/85 px-4 text-base text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink/45 focus:border-merah/45 focus:shadow-[0_0_0_4px_rgb(var(--merah)/0.12)] dark:bg-white/[0.06]"
              />
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="min-h-[48px] shrink-0 rounded-control bg-merah px-4 font-semibold text-white transition-[transform,background-color,opacity] duration-150 hover:bg-[#B50F21] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100"
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

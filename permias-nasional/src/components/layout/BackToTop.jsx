import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export function BackToTop() {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      className="fixed bottom-24 right-4 z-[55] flex items-center gap-2 rounded-full border border-brand-charcoal/10 bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-brand-charcoal shadow-lg transition hover:border-brand-red/40 dark:border-white/10 dark:bg-surface-card dark:text-white md:bottom-8 md:text-base"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('backtop')}
    >
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {t('backtop')}
    </button>
  );
}

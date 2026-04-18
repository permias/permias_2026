import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Button } from '../ui/Button.jsx';

const KEY = 'permias_cookie_consent';

export function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(() => {
    try {
      return !window.localStorage.getItem(KEY);
    } catch {
      return true;
    }
  });

  const save = (value) => {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-[90] border-t border-brand-charcoal/10 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-surface-card sm:p-5"
    >
      <div className="mx-auto flex max-w-content flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-brand-charcoal dark:text-white">{t('cookie.text')}</p>
        <div className="flex gap-2">
          <Button type="button" variant="primary" className="!py-2" onClick={() => save('accepted')}>
            {t('cookie.accept')}
          </Button>
          <Button type="button" variant="ghost" className="!py-2 dark:border-white/20" onClick={() => save('declined')}>
            {t('cookie.decline')}
          </Button>
        </div>
      </div>
    </div>
  );
}

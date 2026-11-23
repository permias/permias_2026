import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { motionTokens, springs } from '../../lib/motion.js';
import { Button } from '../ui/Button.jsx';

const KEY = 'permias_cookie_consent';

/** Small glass notice that floats above the dock until answered. */
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

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          key="cookie"
          aria-label={t('cookie.label')}
          className="glass fixed inset-x-3 bottom-[calc(var(--dock-h)+30px+env(safe-area-inset-bottom))] z-[58] mx-auto flex max-w-[520px] flex-col gap-3 rounded-[22px] p-4 sm:flex-row sm:items-center"
          initial={{ opacity: 0, y: motionTokens.distance.lg }}
          animate={{ opacity: 1, y: 0, transition: { ...springs.gentle, delay: motionTokens.duration.crawl } }}
          exit={{ opacity: 0, y: motionTokens.distance.md, transition: { duration: motionTokens.duration.exit } }}
        >
          <p className="flex-1 text-sm text-ink">{t('cookie.text')}</p>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="dark" onClick={() => save('accepted')}>
              {t('cookie.accept')}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => save('declined')}>
              {t('cookie.decline')}
            </Button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

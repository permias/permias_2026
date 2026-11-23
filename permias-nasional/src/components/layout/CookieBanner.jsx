import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { motionTokens, springs } from '../../lib/motion.js';
import { Button } from '../ui/Button.jsx';

const KEY = 'permias_cookie_consent';

/** Compact glass notice: top-right under the header from md up (clear of hero controls, search fields and the dock);
 *  above the dock on phones, where the page gets matching bottom padding so nothing ends up beneath it. */
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
          className="glass fixed inset-x-3 bottom-[calc(var(--dock-h)+30px+env(safe-area-inset-bottom))] z-[58] flex flex-col gap-3 rounded-[22px] p-4 md:inset-x-auto md:bottom-auto md:right-4 md:top-[76px] md:w-[340px] md:rounded-[18px] md:p-3.5"
          initial={{ opacity: 0, y: motionTokens.distance.lg }}
          animate={{ opacity: 1, y: 0, transition: { ...springs.gentle, delay: motionTokens.duration.crawl } }}
          exit={{ opacity: 0, y: motionTokens.distance.md, transition: { duration: motionTokens.duration.exit } }}
        >
          <p className="text-[16px] leading-snug text-ink md:text-sm">{t('cookie.text')}</p>
          {/* phones: reserve the banner's height at the end of the page */}
          <style>{'@media (max-width: 767px) { body { padding-bottom: 150px; } }'}</style>
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

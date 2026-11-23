import { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { UiProvider } from '../../context/UiContext.jsx';
import { motionTokens } from '../../lib/motion.js';
import { TopBar } from './TopBar.jsx';
import { Dock } from './Dock.jsx';
import { SearchPalette } from './SearchPalette.jsx';
import { MoreSheet } from './MoreSheet.jsx';
import { Footer } from './Footer.jsx';
import { CookieBanner } from './CookieBanner.jsx';
import { ChatWidget } from './ChatWidget.jsx';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  const { t } = useLanguage();
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <MotionConfig reducedMotion="user">
      <UiProvider>
        <div className="relative min-h-screen overflow-x-clip bg-background">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-control focus:bg-merah focus:px-4 focus:py-3 focus:font-semibold focus:text-white"
          >
            {t('skip.main')}
          </a>
          <ScrollManager />
          <TopBar />
          <AnimatePresence mode="wait" initial={false}>
            <motion.main
              key={location.pathname}
              id="main-content"
              tabIndex={-1}
              className="outline-none"
              initial={{ opacity: 0, y: motionTokens.distance.sm }}
              animate={{ opacity: 1, y: 0, transition: { duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth } }}
              exit={{ opacity: 0, transition: { duration: motionTokens.duration.exit } }}
            >
              {outlet}
            </motion.main>
          </AnimatePresence>
          <Footer />
          <Dock />
          <SearchPalette />
          <MoreSheet />
          <CookieBanner />
          <ChatWidget />
        </div>
      </UiProvider>
    </MotionConfig>
  );
}

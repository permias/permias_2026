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

/** In-page anchors scroll after render; route changes scroll to top once the old page has faded out. */
function HashScroll() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
  }, [pathname, hash]);
  return null;
}

/** A thin red line that sweeps across the top on every route change. */
function RouteProgress({ routeKey }) {
  return (
    <AnimatePresence initial={false}>
      <motion.span
        key={routeKey}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-accent"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0, transition: { scaleX: { duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth }, opacity: { delay: motionTokens.duration.slow, duration: motionTokens.duration.fast } } }}
        exit={{ opacity: 0, transition: { duration: motionTokens.duration.instant } }}
      />
    </AnimatePresence>
  );
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
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-control focus:bg-accent focus:px-4 focus:py-3 focus:font-semibold focus:text-on-accent"
          >
            {t('skip.main')}
          </a>
          <HashScroll />
          <RouteProgress routeKey={location.pathname} />
          <TopBar />
          <AnimatePresence
            mode="wait"
            initial={false}
            onExitComplete={() => {
              if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          >
            <motion.main
              key={location.pathname}
              id="main-content"
              tabIndex={-1}
              className="outline-none"
              initial={{ opacity: 0, y: motionTokens.distance.md }}
              animate={{ opacity: 1, y: 0, transition: { duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth } }}
              exit={{ opacity: 0, y: -motionTokens.distance.xs, transition: { duration: motionTokens.duration.exit, ease: motionTokens.easing.sharp } }}
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

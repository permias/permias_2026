import { Outlet, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { SiteHeader } from './SiteHeader.jsx';
import { Navbar } from './Navbar.jsx';
import { PageSplash } from './PageSplash.jsx';
import { Footer } from './Footer.jsx';
import { CookieBanner } from './CookieBanner.jsx';
import { BackToTop } from './BackToTop.jsx';
import { ChatWidget } from './ChatWidget.jsx';

export function Layout() {
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white transition-colors duration-200 dark:bg-surface-dark">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-40 focus:z-[100] focus:rounded-lg focus:bg-brand-red focus:px-4 focus:py-2 focus:text-white sm:focus:top-36 lg:focus:top-32"
      >
        {t('skip.main')}
      </a>
      <header className="sticky top-0 z-50 border-b border-brand-charcoal/10 bg-white/95 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-surface-dark/95">
        <SiteHeader />
        <Navbar />
      </header>
      <PageSplash />
      <main
        key={location.pathname}
        id="main-content"
        className="animate-page-in outline-none motion-reduce:animate-none"
        tabIndex={-1}
      >
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
      <BackToTop />
      <ChatWidget />
    </div>
  );
}

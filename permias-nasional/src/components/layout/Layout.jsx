import { Outlet, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { SiteHeader } from './SiteHeader.jsx';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { CookieBanner } from './CookieBanner.jsx';
import { BackToTop } from './BackToTop.jsx';
import { ChatWidget } from './ChatWidget.jsx';

export function Layout() {
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-red focus:px-4 focus:py-2 focus:text-white"
      >
        {t('skip.main')}
      </a>
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <SiteHeader />
        <Navbar />
      </header>
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

import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * Horizontal strip at the very top: help + official email for issues.
 */
export function SiteHeader() {
  const { t } = useLanguage();

  return (
    <div className="border-b border-white/10 bg-brand-charcoal text-white dark:bg-black">
      <div className="mx-auto flex max-w-content flex-col items-center gap-2 px-4 py-2.5 text-center sm:flex-row sm:justify-between sm:text-left sm:px-6 lg:px-8">
        <p className="text-sm leading-snug md:text-base">
          <span className="font-semibold">{t('header.help')}</span>{' '}
          <span className="text-white/90">{t('header.help.sub')}</span>{' '}
          <a
            href="mailto:info@permiasnasional.com"
            className="font-semibold text-white underline decoration-white/50 underline-offset-2 transition hover:decoration-white"
          >
            info@permiasnasional.com
          </a>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
          <Link
            to="/contact"
            className="whitespace-nowrap rounded-md border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition hover:bg-white/20 md:text-sm"
          >
            {t('header.help.cta')}
          </Link>
        </div>
      </div>
    </div>
  );
}

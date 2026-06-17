import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { SUPPORT_EMAIL } from '../../data/contactEmails.js';

export function SiteHeader() {
  const { t } = useLanguage();

  return (
    <div className="border-b border-border bg-muted/60">
      <div className="mx-auto flex max-w-content flex-col items-center gap-2 px-4 py-2 text-center text-sm sm:flex-row sm:justify-between sm:text-left sm:px-6 lg:px-8">
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">{t('header.help')}</span>{' '}
          {t('header.help.sub')}{' '}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-medium text-brand-red underline-offset-2 transition hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-1 text-xs font-medium text-foreground transition hover:border-brand-red/30 hover:text-brand-red"
        >
          {t('header.help.cta')}
        </Link>
      </div>
    </div>
  );
}

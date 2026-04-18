import { Link } from 'react-router-dom';
import { partners } from '../../data/partners.js';
import { brand } from '../../data/siteMedia.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { NewsletterForm } from '../sections/NewsletterForm.jsx';

const social = [
  {
    labelKey: 'social.ig.title',
    href: 'https://www.instagram.com/permias.nasional/',
    handleKey: 'social.ig.handle',
  },
  {
    labelKey: 'social.fb.title',
    href: 'https://www.facebook.com/permias.nasional',
    handleKey: 'social.fb.handle',
  },
  {
    labelKey: 'social.li.title',
    href: 'https://www.linkedin.com/company/permiasnasional',
    handleKey: 'social.li.handle',
  },
  {
    labelKey: 'social.yt.title',
    href: 'https://www.youtube.com/channel/UCHjEGs027y3g--ZH5BCS7tw',
    handleKey: 'social.yt.handle',
  },
  {
    labelKey: 'social.gg.title',
    href: 'https://groups.google.com/g/permias-nasional',
    handleKey: 'social.gg.handle',
  },
  {
    labelKey: 'social.mail.title',
    href: 'mailto:info@permiasnasional.com',
    handleKey: 'social.mail.handle',
  },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-brand-charcoal/10 bg-brand-charcoal text-white transition-colors duration-200 dark:border-white/10 dark:bg-black">
      <div className="mx-auto max-w-content px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={brand.logoHorizontal}
                alt="PERMIAS Nasional"
                className="h-12 w-auto max-w-[200px] object-contain md:h-14 md:max-w-[240px]"
                width={240}
                height={52}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="mt-3 text-sm text-white/75">{t('footer.tagline')}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-red">{t('footer.partners')}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {partners.map((p) => (
                <li key={p.id}>
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 transition hover:text-white"
                  >
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-red">{t('footer.newsletter')}</p>
            <div className="mt-3">
              <NewsletterForm />
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-red">{t('home.connect.title')}</p>
            <ul className="mt-3 space-y-1.5 text-xs">
              {social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-white/75 transition hover:text-white">
                    <span className="font-semibold">{t(s.labelKey)}</span>
                    <span className="block text-[11px] text-white/55">{t(s.handleKey)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PERMIAS Nasional. {t('footer.rights')}</p>
          <Link to="/contact" className="text-white/80 underline-offset-4 hover:text-white hover:underline">
            {t('nav.contact')}
          </Link>
        </div>
      </div>
    </footer>
  );
}

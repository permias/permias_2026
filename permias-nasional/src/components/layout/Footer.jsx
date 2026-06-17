import { Link } from 'react-router-dom';
import { partners } from '../../data/partners.js';
import { socialLinks } from '../../data/socialLinks.js';
import { brand } from '../../data/siteMedia.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { NewsletterForm } from '../sections/NewsletterForm.jsx';
import { SocialIcon } from '../ui/SocialIcon.jsx';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-brand-charcoal text-white">
      <div className="mx-auto max-w-content px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <img
              src={brand.logoHorizontal}
              alt="PERMIAS Nasional"
              className="h-12 w-auto max-w-[200px] object-contain md:h-14"
              width={240}
              height={52}
              loading="lazy"
              decoding="async"
            />
            <p className="mt-3 text-sm leading-relaxed text-white/70">{t('footer.tagline')}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  {...(s.id === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="rounded-xl transition hover:scale-105 hover:opacity-90"
                  aria-label={t(s.titleKey)}
                  title={t(s.titleKey)}
                >
                  <SocialIcon id={s.id} className="h-10 w-10" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-ui text-sm font-semibold text-white/90">{t('footer.partners')}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {partners.map((p) => (
                <li key={p.id}>
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/75 transition hover:text-white"
                  >
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-ui text-sm font-semibold text-white/90">{t('footer.newsletter')}</p>
            <div className="mt-3">
              <NewsletterForm />
            </div>
          </div>

          <div>
            <p className="font-ui text-sm font-semibold text-white/90">{t('nav.contact')}</p>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              {socialLinks.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    {...(s.id === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                    className="inline-flex items-center gap-2 transition hover:text-white"
                  >
                    <SocialIcon id={s.id} className="h-6 w-6 shrink-0" />
                    <span>{t(s.handleKey)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PERMIAS Nasional. {t('footer.rights')}</p>
          <Link to="/contact" className="text-white/80 underline-offset-4 hover:text-white hover:underline">
            {t('nav.contact')}
          </Link>
        </div>
      </div>
    </footer>
  );
}

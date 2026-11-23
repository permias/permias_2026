import { Link } from 'react-router-dom';
import { socialLinks } from '../../data/socialLinks.js';
import { navResourceLinks } from '../../data/quickAccess.js';
import { SUPPORT_EMAIL } from '../../data/contactEmails.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { chapters, stateCount } from '../../data/chapters.js';
import { NewsletterForm } from '../sections/NewsletterForm.jsx';
import { SocialIcon } from '../ui/SocialIcon.jsx';
import { publicUrl } from '../../utils/site.js';

const EXPLORE = [
  { to: '/chapters', key: 'dock.chapters' },
  { to: '/events', key: 'nav.events' },
  { to: '/about', key: 'nav.about' },
  { to: '/about/sejarah', key: 'nav.dd.sejarah' },
  { to: '/team', key: 'nav.team' },
  { to: '/partners', key: 'nav.partners' },
  { to: '/contact', key: 'nav.contact' },
  { to: '/chapters/register', key: 'chapters.register' },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative mt-24 bg-[#0A1220] text-white">
      <div className="container-x pb-[calc(var(--dock-h)+56px)] pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="font-display text-[clamp(2rem,1.4rem+2vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              {t('footer.big', { n: chapters.length, s: stateCount })}
            </p>
            <p className="mt-4 max-w-sm text-white/70">{t('footer.tagline')}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  {...(s.id === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/[0.08] transition-[background-color,transform] duration-150 hover:bg-white/15 active:scale-95"
                  aria-label={t(s.titleKey)}
                >
                  <SocialIcon id={s.id} className="h-7 w-7" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <nav aria-label={t('footer.explore')}>
              <p className="text-sm font-semibold text-white/55">{t('footer.explore')}</p>
              <ul className="mt-3 space-y-2.5">
                {EXPLORE.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-white/85 transition-colors hover:text-white">
                      {t(l.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label={t('more.guides')}>
              <p className="text-sm font-semibold text-white/55">{t('more.guides')}</p>
              <ul className="mt-3 space-y-2.5">
                {navResourceLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-white/85 transition-colors hover:text-white">
                      {t(l.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="text-sm font-semibold text-white/55">{t('footer.newsletter')}</p>
              <p className="mt-3 text-sm text-white/70">{t('home.newsletter.sub')}</p>
              <div className="mt-3">
                <NewsletterForm tone="dark" />
              </div>
              <p className="mt-6 text-sm text-white/70">
                {t('header.help')}{' '}
                <a className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white" href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} PERMIAS Nasional. {t('footer.rights')}
          </p>
          <a href={publicUrl('/images/CREDITS.md')} className="text-white/70 underline decoration-white/25 underline-offset-4 hover:text-white">
            {t('footer.credits')}
          </a>
        </div>
      </div>
    </footer>
  );
}

import { useLanguage } from '../../context/LanguageContext.jsx';
import { ScrollReveal } from '../ui/ScrollReveal.jsx';
import { cn } from '../../utils/cn.js';

const items = [
  {
    key: 'ig',
    href: 'https://www.instagram.com/permias.nasional/',
    titleKey: 'social.ig.title',
    handleKey: 'social.ig.handle',
    descKey: 'social.ig.desc',
    iconWrap: 'from-pink-500 to-rose-700',
    icon: (
      <svg className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm5.75-3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
      </svg>
    ),
  },
  {
    key: 'fb',
    href: 'https://www.facebook.com/permias.nasional',
    titleKey: 'social.fb.title',
    handleKey: 'social.fb.handle',
    descKey: 'social.fb.desc',
    iconWrap: 'from-blue-600 to-blue-900',
    icon: (
      <svg className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M13 10h3l-1 3h-2v7h-3v-7H9v-3h2V9a3 3 0 0 1 3-3h2v4z" />
      </svg>
    ),
  },
  {
    key: 'li',
    href: 'https://www.linkedin.com/company/permiasnasional',
    titleKey: 'social.li.title',
    handleKey: 'social.li.handle',
    descKey: 'social.li.desc',
    iconWrap: 'from-sky-600 to-indigo-900',
    icon: (
      <svg className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M6.5 8.5h3V21h-3V8.5zM8 4a1.75 1.75 0 1 1 0 3.5A1.75 1.75 0 0 1 8 4zm4.5 4.5H16V21h-3v-6.5c0-1.5-.5-2.5-2-2.5s-2 1-2 2.5V21h-3V8.5z" />
      </svg>
    ),
  },
  {
    key: 'yt',
    href: 'https://www.youtube.com/channel/UCHjEGs027y3g--ZH5BCS7tw',
    titleKey: 'social.yt.title',
    handleKey: 'social.yt.handle',
    descKey: 'social.yt.desc',
    iconWrap: 'from-red-600 to-red-950',
    icon: (
      <svg className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C16 4.7 12 4.7 12 4.7s-4 0-6.9.4c-.4 0-1.3 0-2.1.9-.6.6-.8 2-.8 2S2 9.6 2 11.3v1.4C2 14.4 2.2 16 2.2 16s.2 1.4.8 2c.8.8 1.9.8 2.4.9 1.7.2 6.6.2 6.6.2s4 0 6.9-.4c.4 0 1.3 0 2.1-.9.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.4C22 9.6 21.8 8 21.8 8zM10 14.5v-5l5 2.5-5 2.5z" />
      </svg>
    ),
  },
  {
    key: 'gg',
    href: 'https://groups.google.com/g/permias-nasional',
    titleKey: 'social.gg.title',
    handleKey: 'social.gg.handle',
    descKey: 'social.gg.desc',
    iconWrap: 'from-blue-500 to-cyan-700',
    icon: (
      <svg className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
      </svg>
    ),
  },
  {
    key: 'mail',
    href: 'mailto:info@permiasnasional.com',
    titleKey: 'social.mail.title',
    handleKey: 'social.mail.handle',
    descKey: 'social.mail.desc',
    iconWrap: 'from-brand-red to-red-950',
    icon: (
      <svg className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M4 6h16v12H4V6zm2 2 6 4 6-4H6zm-2 8 6-4 6 4V8l-6 4-6-4v8z" />
      </svg>
    ),
  },
];

export function SocialHub() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Layered red / white gradients — full-bleed atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[#fff0f0] to-[#ffd6d6] dark:from-[#0a0a0a] dark:via-[#1a0a0a] dark:to-[#2d1010]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-1/4 top-0 h-[480px] w-[70%] rounded-full bg-gradient-to-r from-brand-red/25 to-transparent blur-3xl dark:from-brand-red/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[400px] w-[60%] rounded-full bg-gradient-to-l from-white/80 to-transparent blur-3xl dark:from-white/5"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(206,17,38,0.06)_50%,rgba(255,255,255,0)_100%)] dark:bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(206,17,38,0.12)_50%,rgba(0,0,0,0)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-brand-charcoal dark:text-white sm:text-6xl md:text-7xl">
            {t('home.connect.title')}
          </h2>
          <p className="mt-6 max-w-3xl text-xl font-medium leading-relaxed text-brand-charcoal/80 dark:text-white/85 md:text-2xl md:leading-relaxed">
            {t('home.connect.sub')}
          </p>
        </ScrollReveal>

        <div className="mt-14 flex flex-col gap-4 md:mt-16 md:gap-5">
          {items.map((item, i) => (
            <ScrollReveal key={item.key} staggerIndex={i}>
              <a
                href={item.href}
                {...(item.key === 'mail'
                  ? {}
                  : { target: '_blank', rel: 'noopener noreferrer' })}
                className={cn(
                  'group relative flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-white/95 via-red-50/70 to-white/90 px-5 py-5 shadow-[0_4px_40px_-12px_rgba(206,17,38,0.35)] ring-1 ring-red-100/80 transition duration-300',
                  'hover:from-red-50 hover:via-white hover:to-red-100/90 hover:shadow-[0_12px_48px_-12px_rgba(206,17,38,0.45)] hover:ring-red-200/90',
                  'dark:from-white/[0.07] dark:via-red-950/40 dark:to-white/[0.05] dark:ring-red-900/40 dark:hover:via-red-950/60',
                  'sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-6 md:px-8 md:py-7',
                )}
              >
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md md:h-14 md:w-14 md:rounded-2xl',
                    item.iconWrap,
                  )}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl font-bold tracking-tight text-brand-charcoal dark:text-white md:text-2xl">
                    {t(item.titleKey)}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-brand-red md:text-base">{t(item.handleKey)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/75 dark:text-white/80 md:text-base">
                    {t(item.descKey)}
                  </p>
                </div>
                <div className="hidden shrink-0 text-brand-red opacity-70 transition group-hover:translate-x-1 group-hover:opacity-100 sm:block">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

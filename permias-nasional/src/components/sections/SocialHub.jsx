import { useLanguage } from '../../context/LanguageContext.jsx';
import { socialLinks } from '../../data/socialLinks.js';
import { SocialIcon } from '../ui/SocialIcon.jsx';
import { ScrollReveal } from '../ui/ScrollReveal.jsx';
import { cn } from '../../utils/cn.js';

export function SocialHub() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden border-y border-border py-20 md:py-24">
      <div className="site-gradient pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{t('home.connect.title')}</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">{t('home.connect.sub')}</p>
        </ScrollReveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {socialLinks.map((item, i) => (
            <ScrollReveal key={item.id} staggerIndex={i}>
              <a
                href={item.href}
                {...(item.id === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                className={cn(
                  'group flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-sm',
                  'transition duration-300 hover:-translate-y-0.5 hover:border-brand-red/25 hover:shadow-soft-lg',
                )}
              >
                <SocialIcon id={item.id} className="h-11 w-11 shrink-0 rounded-xl shadow-sm" />
                <div className="min-w-0">
                  <p className="font-ui text-sm font-semibold text-foreground">{t(item.titleKey)}</p>
                  <p className="truncate text-sm text-muted-foreground">{t(item.handleKey)}</p>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useLanguage } from '../../context/LanguageContext.jsx';
import { instagramPosts } from '../../data/instagramPosts.js';
import { ScrollReveal } from '../ui/ScrollReveal.jsx';

export function StoriesSection() {
  const { t } = useLanguage();

  return (
    <section className="border-y border-brand-charcoal/10 bg-neutral-50 py-16 dark:border-white/10 dark:bg-black/20">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-center font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{t('home.stories.title')}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-brand-charcoal/75 dark:text-white/75">{t('home.stories.sub')}</p>
        </ScrollReveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {instagramPosts.map((item, i) => (
            <ScrollReveal key={item.id} staggerIndex={i % 4}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-2xl border border-brand-charcoal/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-lg dark:border-white/10 dark:bg-surface-card"
              >
                <div className="aspect-[4/5] overflow-hidden bg-black/5">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <p className="p-3 text-center text-xs font-bold uppercase tracking-wide text-brand-charcoal dark:text-white sm:text-sm">
                  {t(item.titleKey)}
                </p>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

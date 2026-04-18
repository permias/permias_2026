import { useLanguage } from '../../context/LanguageContext.jsx';
import { ScrollReveal } from '../ui/ScrollReveal.jsx';
import { NewsletterForm } from './NewsletterForm.jsx';

export function NewsletterSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-white py-20 dark:bg-surface-dark md:py-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="rounded-2xl border border-brand-charcoal/10 bg-neutral-50 p-8 dark:border-white/10 dark:bg-surface-card md:p-10 lg:p-12">
            <h2 className="font-display text-3xl font-extrabold md:text-4xl lg:text-5xl">{t('home.newsletter.title')}</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-charcoal/75 dark:text-white/75 md:text-xl">
              {t('home.newsletter.sub')}
            </p>
            <div className="mt-8 max-w-xl">
              <NewsletterForm className="[&_input]:!text-base [&_input]:md:!text-lg [&_button]:!text-base [&_button]:md:!text-lg" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { ClubRegisterForm } from '../forms/ClubRegisterForm.jsx';
import { ScrollReveal } from '../ui/ScrollReveal.jsx';
import { Button } from '../ui/Button.jsx';

export function HomeRegisterSection() {
  const { t } = useLanguage();

  return (
    <section id="register" className="relative overflow-hidden border-t border-border py-20 md:py-28">
      <div className="site-gradient pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-content gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16 lg:px-8">
        <ScrollReveal>
          <p className="section-eyebrow">{t('home.register.eyebrow')}</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('home.register.title')}
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">{t('home.register.sub')}</p>
          <Button as={Link} to="/contact" variant="ghost" className="mt-6">
            {t('home.register.contact')}
          </Button>
        </ScrollReveal>
        <ScrollReveal staggerIndex={1}>
          <ClubRegisterForm compact />
        </ScrollReveal>
      </div>
    </section>
  );
}

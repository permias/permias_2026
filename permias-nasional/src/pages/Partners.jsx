import { partners } from '../data/partners.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Seo, pageTabTitle } from '../components/Seo.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ScrollReveal } from '../components/ui/ScrollReveal.jsx';

export function Partners() {
  const { t } = useLanguage();

  return (
    <>
      <Seo title={pageTabTitle('Partners')} description="Government, cultural, academic, and community partners of PERMIAS Nasional." path="/partners" />
      <div className="border-b border-brand-charcoal/10 bg-white py-14 dark:border-white/10 dark:bg-surface-dark">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t('partners.title')}</h1>
            <p className="mt-4 max-w-3xl text-lg text-brand-charcoal/75 dark:text-white/75">{t('partners.sub')}</p>
          </ScrollReveal>
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((p, i) => (
            <ScrollReveal key={p.id} staggerIndex={i % 5}>
              <Card className="flex h-full flex-col border-brand-charcoal/10 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red/10 text-lg font-black text-brand-red">{p.initials}</div>
                  <div>
                    <span className="inline-flex rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-charcoal/70 dark:bg-white/10 dark:text-white/80">
                      {p.type}
                    </span>
                    <h2 className="mt-1 font-display text-lg font-bold">{p.name}</h2>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm text-brand-charcoal/75 dark:text-white/75">{p.description}</p>
                <Button as="a" href={p.website} target="_blank" rel="noopener noreferrer" className="mt-6 w-full !py-2 text-sm" variant="outline">
                  {t('partners.visit')}
                </Button>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </>
  );
}

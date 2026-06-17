import { ScrollReveal } from '../ui/ScrollReveal.jsx';
import { cn } from '../../utils/cn.js';

export function PageHeader({ eyebrow, title, description, children, className }) {
  return (
    <section className={cn('relative overflow-hidden border-b border-border bg-card page-mesh', className)}>
      <div className="relative mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <ScrollReveal>
          {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
          <h1 className="mt-4 text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>
          )}
          {children}
        </ScrollReveal>
      </div>
    </section>
  );
}

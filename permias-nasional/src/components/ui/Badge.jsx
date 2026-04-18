import { cn } from '../../utils/cn.js';

const variants = {
  event: 'bg-brand-red/10 text-brand-red dark:bg-brand-red/20 dark:text-white',
  announcement: 'bg-brand-charcoal/10 text-brand-charcoal dark:bg-white/10 dark:text-white',
  opportunity: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200',
  neutral: 'bg-black/5 text-brand-charcoal dark:bg-white/10 dark:text-white',
};

export function Badge({ className, variant = 'neutral', children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        variants[variant] ?? variants.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}

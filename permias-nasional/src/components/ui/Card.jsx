import { cn } from '../../utils/cn.js';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-brand-charcoal/10 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-white/10 dark:bg-surface-card',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

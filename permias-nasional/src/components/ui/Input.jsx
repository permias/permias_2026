import { cn } from '../../utils/cn.js';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-brand-charcoal/15 bg-white px-4 py-3 text-brand-charcoal shadow-inner outline-none transition dark:border-white/15 dark:bg-surface-dark dark:text-white',
        'placeholder:text-brand-charcoal/40 dark:placeholder:text-white/40',
        className,
      )}
      {...props}
    />
  );
}

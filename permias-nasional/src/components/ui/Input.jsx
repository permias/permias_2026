import { cn } from '../../utils/cn.js';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition',
        'placeholder:text-muted-foreground',
        'focus:border-brand-red/40 focus:ring-2 focus:ring-brand-red/10',
        'dark:bg-surface-card',
        className,
      )}
      {...props}
    />
  );
}

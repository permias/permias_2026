import { cn } from '../../utils/cn.js';

const variants = {
  event: 'bg-merah/10 text-merah',
  announcement: 'bg-ink/[0.07] text-ink',
  opportunity: 'bg-emerald-600/10 text-emerald-800 dark:text-emerald-300',
  neutral: 'bg-ink/[0.07] text-ink',
};

/** Small status label (sentence case). */
export function Badge({ className, variant = 'neutral', children }) {
  return (
    <span className={cn('inline-flex items-center rounded-[8px] px-2 py-0.5 text-[13px] font-semibold', variants[variant] ?? variants.neutral, className)}>
      {children}
    </span>
  );
}

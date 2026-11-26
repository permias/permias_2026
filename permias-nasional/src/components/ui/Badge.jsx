import { cn } from '../../utils/cn.js';

/** Small status label (sentence case), neutral grey. */
export function Badge({ className, children }) {
  return <span className={cn('inline-flex items-center rounded-[8px] bg-ink/[0.06] px-2 py-0.5 text-[13px] font-semibold text-ink', className)}>{children}</span>;
}

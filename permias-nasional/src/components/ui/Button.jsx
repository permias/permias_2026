import { createElement } from 'react';
import { cn } from '../../utils/cn.js';

export function Button({ as = 'button', className, variant = 'primary', children, ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:pointer-events-none disabled:opacity-50';
  const styles = {
    primary:
      'bg-brand-red text-white shadow-sm hover:scale-[1.04] hover:shadow-[0_0_0_3px_rgba(206,17,38,0.2)] active:scale-[0.99] dark:hover:shadow-[0_0_0_3px_rgba(206,17,38,0.35)]',
    ghost:
      'border border-brand-charcoal/15 bg-white text-brand-charcoal hover:border-brand-red/40 dark:border-white/15 dark:bg-surface-card dark:text-white',
    outline:
      'border-2 border-brand-red bg-transparent text-brand-red hover:bg-brand-red hover:text-white dark:text-white',
  };
  return createElement(as, { className: cn(base, styles[variant], className), ...props }, children);
}

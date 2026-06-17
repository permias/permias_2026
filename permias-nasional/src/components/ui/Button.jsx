import { createElement } from 'react';
import { cn } from '../../utils/cn.js';

export function Button({ as = 'button', className, variant = 'primary', size = 'md', children, ...props }) {
  const base =
    'font-ui inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red disabled:pointer-events-none disabled:opacity-50';
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const styles = {
    primary:
      'bg-brand-red text-white shadow-soft hover:bg-brand-red/90 hover:shadow-glow active:scale-[0.98]',
    ghost:
      'border border-border bg-card text-foreground hover:border-brand-red/30 hover:bg-muted dark:bg-surface-card',
    outline:
      'border border-brand-red/40 bg-transparent text-brand-red hover:bg-brand-red hover:text-white dark:text-white',
  };
  return createElement(
    as,
    { className: cn(base, sizes[size], styles[variant], className), ...props },
    children,
  );
}

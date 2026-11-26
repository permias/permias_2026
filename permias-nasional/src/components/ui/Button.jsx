import { createElement } from 'react';
import { cn } from '../../utils/cn.js';

/** Small spinner for loading buttons; inherits the text colour. */
export function Spinner({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-4 w-4 animate-spin', className)} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Buttons: radius 14 (controls), 44px+ targets.
 * States: hover (fine pointers), press scale(0.97), focus-visible ring, loading (spinner, aria-busy, inert), disabled.
 * primary = flag red, dark = ink, light = white over photos, glass = frosted, outline, ghost (quiet).
 */
export function Button({ as = 'button', className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }) {
  const base =
    'relative inline-flex select-none items-center justify-center gap-2 rounded-control font-semibold transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[rgb(var(--ring))] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 aria-disabled:cursor-not-allowed aria-disabled:opacity-50';
  const sizes = {
    sm: 'min-h-[40px] px-4 text-sm',
    md: 'min-h-[48px] px-5 text-[15px]',
    lg: 'min-h-[56px] px-6 text-base',
  };
  const styles = {
    primary:
      'bg-accent text-on-accent hover:bg-accent/90',
    dark: 'bg-ink text-mist hover:bg-ink/85',
    glass: 'glass text-ink hover:bg-white/80 dark:hover:bg-white/15',
    'glass-photo': 'glass-photo hover:bg-white/25',
    light: 'bg-white text-night hover:bg-white/90',
    outline: 'border border-ink/20 bg-transparent text-ink hover:border-ink/45 hover:bg-ink/[0.03]',
    ghost: 'bg-transparent text-ink hover:bg-ink/[0.06]',
  };
  const isButton = as === 'button';
  return createElement(
    as,
    {
      className: cn(base, sizes[size], styles[variant], className),
      ...(isButton ? { disabled: disabled || loading } : disabled ? { 'aria-disabled': true } : {}),
      'aria-busy': loading || undefined,
      ...props,
    },
    loading ? (
      <>
        <span className="invisible inline-flex items-center gap-2">{children}</span>
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      </>
    ) : (
      children
    ),
  );
}

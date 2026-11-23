import { createElement } from 'react';
import { cn } from '../../utils/cn.js';

/**
 * Buttons: radius 14 (controls), 44px min target, press = scale(0.97).
 * primary = flag red, dark = ink, glass = frosted (over photos/map), outline, ghost (quiet).
 */
export function Button({ as = 'button', className, variant = 'primary', size = 'md', children, ...props }) {
  const base =
    'inline-flex select-none items-center justify-center gap-2 rounded-control font-semibold transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50';
  const sizes = {
    sm: 'min-h-[40px] px-4 text-sm',
    md: 'min-h-[48px] px-5 text-[15px]',
    lg: 'min-h-[56px] px-6 text-base',
  };
  const styles = {
    primary:
      'bg-merah text-white shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_10px_24px_-12px_rgb(var(--merah)/0.9)] hover:bg-[#B50F21] dark:hover:bg-[#d8243a]',
    dark: 'bg-ink text-mist hover:bg-ink/90',
    glass: 'glass text-ink hover:bg-white/80 dark:hover:bg-white/15',
    'glass-photo': 'glass-photo hover:bg-white/25',
    light: 'bg-white text-[#0F1B2D] shadow-[0_10px_30px_-12px_rgba(0,0,0,.5)] hover:bg-white/90',
    outline: 'border border-ink/20 bg-transparent text-ink hover:border-ink/45',
    ghost: 'bg-transparent text-ink hover:bg-ink/[0.06]',
  };
  return createElement(as, { className: cn(base, sizes[size], styles[variant], className), ...props }, children);
}

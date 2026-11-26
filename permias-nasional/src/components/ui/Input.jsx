import { cn } from '../../utils/cn.js';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'min-h-[48px] w-full rounded-control border border-border bg-card px-4 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-150',
        'placeholder:text-muted-foreground/80',
        'focus:border-accent/50 focus:ring-4 focus:ring-accent/10',
        className,
      )}
      {...props}
    />
  );
}

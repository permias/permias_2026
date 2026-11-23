import { cn } from '../../utils/cn.js';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'min-h-[48px] w-full rounded-control border border-border bg-card px-4 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-150',
        'placeholder:text-muted-foreground/80',
        'focus:border-merah/50 focus:shadow-[0_0_0_4px_rgb(var(--merah)/0.12)]',
        className,
      )}
      {...props}
    />
  );
}

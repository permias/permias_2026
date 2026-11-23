import { cn } from '../../utils/cn.js';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('surface p-6', className)} {...props}>
      {children}
    </div>
  );
}

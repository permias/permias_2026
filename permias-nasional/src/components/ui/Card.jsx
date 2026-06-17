import { cn } from '../../utils/cn.js';

export function Card({ className, children, hover = false, ...props }) {
  return (
    <div className={cn(hover ? 'surface-card-hover' : 'surface-card', 'p-6', className)} {...props}>
      {children}
    </div>
  );
}

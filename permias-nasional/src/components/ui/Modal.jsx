import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn.js';

export function Modal({ open, onClose, children, className, labelledBy }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 px-4 py-10 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close overlay"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={cn(
          'relative z-[81] w-full max-w-3xl rounded-2xl border border-brand-charcoal/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-surface-card',
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

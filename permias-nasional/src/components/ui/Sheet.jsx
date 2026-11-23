import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { motionTokens, springs } from '../../lib/motion.js';
import { cn } from '../../utils/cn.js';

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal surface (role="dialog", aria-modal, focus trap, Esc, scroll lock, focus restore).
 * variant: 'center' (desktop palette) | 'dock' (springs up from the dock) | 'bottom' (mobile sheet)
 * An Esc close skips the exit animation (motion-patterns rule 10).
 */
export function Sheet({ open, onClose, labelledBy, label, variant = 'center', className, panelClassName, children, initialFocus }) {
  const panelRef = useRef(null);
  const restoreRef = useRef(null);
  const [keyboardClose, setKeyboardClose] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const id = requestAnimationFrame(() => {
      const el = initialFocus?.current || panelRef.current?.querySelector(FOCUSABLE) || panelRef.current;
      el?.focus({ preventScroll: true });
    });
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setKeyboardClose(true);
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = prevOverflow;
      const r = restoreRef.current;
      if (r && typeof r.focus === 'function') r.focus({ preventScroll: true });
    };
  }, [open, onClose, initialFocus]);

  const hidden =
    variant === 'center'
      ? { opacity: 0, scale: motionTokens.scale.press, y: motionTokens.distance.sm }
      : { opacity: 0, scale: motionTokens.scale.subtle, y: motionTokens.distance.xl };
  const panelVariants = {
    hidden,
    shown: { opacity: 1, scale: 1, y: 0, transition: springs.snappy },
    exit: (kb) => (kb ? { opacity: 0, transition: { duration: 0 } } : { ...hidden, transition: { duration: motionTokens.duration.exit } }),
  };
  const overlayVariants = {
    hidden: { opacity: 0 },
    shown: { opacity: 1, transition: { duration: motionTokens.duration.fast } },
    exit: (kb) => ({ opacity: 0, transition: { duration: kb ? 0 : motionTokens.duration.exit } }),
  };

  return createPortal(
    <AnimatePresence custom={keyboardClose} onExitComplete={() => setKeyboardClose(false)}>
      {open && (
        <div key="sheet" className={cn('fixed inset-0 z-[90]', className)}>
          <motion.div
            className="absolute inset-0 bg-[rgb(10_18_32/0.38)]"
            variants={overlayVariants}
            initial="hidden"
            animate="shown"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />
          <div
            className={cn(
              'pointer-events-none absolute inset-0 flex justify-center px-3',
              variant === 'center' && 'items-start pt-[10vh] sm:px-6',
              variant !== 'center' && 'items-end pb-[calc(var(--dock-h)+28px+env(safe-area-inset-bottom))]',
            )}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelledBy}
              aria-label={labelledBy ? undefined : label}
              tabIndex={-1}
              className={cn('glass pointer-events-auto relative w-full overflow-hidden rounded-sheet outline-none', panelClassName)}
              style={{ transformOrigin: variant === 'center' ? '50% 0%' : '50% 100%' }}
              variants={panelVariants}
              initial="hidden"
              animate="shown"
              exit="exit"
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

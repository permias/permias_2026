import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { brand } from '../../data/siteMedia.js';
import { cn } from '../../utils/cn.js';

/**
 * Brief brand splash on client-side navigations (official vertical logo).
 * Skips the first paint so the landing hero is not covered on cold load.
 */
export function PageSplash() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const skipFirst = useRef(true);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    setVisible(true);
    const id = window.setTimeout(() => setVisible(false), 380);
    return () => window.clearTimeout(id);
  }, [location.pathname]);

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 dark:bg-black/50',
        visible ? 'opacity-100' : 'opacity-0',
      )}
      aria-hidden
    >
      <div
        className={cn(
          'flex max-w-[min(90vw,280px)] flex-col items-center gap-3 rounded-3xl bg-white/95 px-10 py-8 shadow-2xl transition-transform duration-300 dark:bg-surface-card/95',
          visible ? 'scale-100' : 'scale-95',
        )}
      >
        <img
          src={brand.logoVertical}
          alt=""
          className="h-40 w-auto object-contain sm:h-44"
          width={200}
          height={220}
          decoding="async"
        />
        <span className="font-display text-xs font-bold uppercase tracking-[0.35em] text-brand-red">PERMIAS</span>
      </div>
    </div>
  );
}

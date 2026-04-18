import { useEffect, useRef } from 'react';

export function useIntersectionObserver(callback, options = {}) {
  const ref = useRef(null);
  const cbRef = useRef(callback);
  const { root = null, rootMargin = '0px 0px -10% 0px', threshold = 0.12 } = options;

  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver((entries) => cbRef.current(entries), {
      root,
      rootMargin,
      threshold,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [root, rootMargin, threshold]);

  return ref;
}

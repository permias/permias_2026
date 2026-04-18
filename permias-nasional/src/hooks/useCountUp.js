import { useCallback, useEffect, useRef, useState } from 'react';

function easeOutQuart(t) {
  return 1 - (1 - t) ** 4;
}

export function useCountUp(target, { duration = 1500, enabled } = {}) {
  const [value, setValue] = useState(0);
  const frame = useRef(null);
  const start = useRef(null);

  const run = useCallback(() => {
    const from = 0;
    const to = target;
    start.current = null;

    const step = (ts) => {
      if (start.current == null) start.current = ts;
      const elapsed = ts - start.current;
      const p = Math.min(1, elapsed / duration);
      const eased = easeOutQuart(p);
      setValue(Math.round(from + (to - from) * eased));
      if (p < 1) {
        frame.current = requestAnimationFrame(step);
      }
    };
    frame.current = requestAnimationFrame(step);
  }, [duration, target]);

  useEffect(() => {
    if (!enabled) return undefined;
    run();
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [enabled, run]);

  return value;
}

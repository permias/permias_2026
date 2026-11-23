import { useEffect, useRef } from 'react';
import { animate, useInView, useMotionValue, useTransform, motion } from 'motion/react';
import { prefersReducedMotion } from '../../lib/motion.js';

/**
 * Count-up once per page view (MOTION-SPEC: 700ms < 100, 1000ms < 10k). The final number is the accessible
 * label; animated digits are aria-hidden. Reduced motion shows the final value immediately.
 */
export function CountUp({ value, className, format = (n) => String(n) }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => format(Math.round(v)));

  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReducedMotion()) {
      mv.set(value);
      return undefined;
    }
    const duration = value < 100 ? 0.7 : value < 10000 ? 1 : 1.2;
    const controls = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] });
    const skip = () => controls.complete();
    window.addEventListener('wheel', skip, { once: true, passive: true });
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });
    return () => {
      controls.stop();
      window.removeEventListener('wheel', skip);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [inView, value, mv]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{format(value)}</span>
      <motion.span aria-hidden="true" className="tabular">
        {text}
      </motion.span>
    </span>
  );
}

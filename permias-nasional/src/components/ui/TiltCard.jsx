import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { prefersReducedMotion, springs } from '../../lib/motion.js';

const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Card that tilts a few degrees toward the pointer and lifts slightly (mouse only, never under reduced motion).
 * Transform-only, springs back on leave.
 */
export function TiltCard({ className, children, max = 4, lift = 4, ...rest }) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), springs.snappy);
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), springs.snappy);
  const y = useSpring(useTransform(hover, [0, 1], [0, -lift]), springs.snappy);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || !canHover() || prefersReducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    hover.set(1);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    hover.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, y, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

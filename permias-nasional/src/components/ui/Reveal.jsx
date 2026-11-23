import { createElement } from 'react';
import { motion } from 'motion/react';
import { motionTokens } from '../../lib/motion.js';

/*
 * Left-to-right reveal (Preston: "more fade-in, more left-to-right"). Plays once when scrolled into view.
 * Under reduced motion MotionConfig drops the x travel and keeps the opacity fade.
 */
const MOTION_TAGS = { div: motion.div, section: motion.section, li: motion.li, ul: motion.ul, p: motion.p, header: motion.header, article: motion.article, ol: motion.ol };

export function Reveal({ as = 'div', delay = 0, x = -motionTokens.distance.xl, className, children, ...rest }) {
  const Tag = MOTION_TAGS[as] || motion.div;
  return createElement(
    Tag,
    {
      className,
      initial: { opacity: 0, x },
      whileInView: { opacity: 1, x: 0 },
      viewport: { once: true, margin: '-60px' },
      transition: { duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay },
      ...rest,
    },
    children,
  );
}

const container = {
  hidden: {},
  shown: { transition: { staggerChildren: motionTokens.stagger.children, delayChildren: motionTokens.stagger.delay } },
};
const staggerItem = {
  hidden: { opacity: 0, x: -motionTokens.distance.lg },
  shown: { opacity: 1, x: 0, transition: { duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth } },
};

/** Container whose direct `StaggerItem` children arrive left to right, 70 ms apart (first 8 only). */
export function Stagger({ as = 'ul', className, children, ...rest }) {
  const Tag = MOTION_TAGS[as] || motion.ul;
  return createElement(
    Tag,
    { className, variants: container, initial: 'hidden', whileInView: 'shown', viewport: { once: true, margin: '-60px' }, ...rest },
    children,
  );
}

export function StaggerItem({ as = 'li', index = 0, className, children, ...rest }) {
  const Tag = MOTION_TAGS[as] || motion.li;
  // items past the 8th appear at once (MOTION-SPEC)
  return createElement(Tag, { className, variants: index < 8 ? staggerItem : undefined, ...rest }, children);
}

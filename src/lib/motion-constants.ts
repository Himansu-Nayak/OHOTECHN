import type { Transition, Variants } from 'motion/react';

/**
 * Standard, performant spring and ease transitions for subtle React UI interactions.
 * Respects 60fps/120fps refresh rates and avoids layout thrashing.
 */
export const transitions: Record<string, Transition> = {
  snappy: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  },
  gentle: {
    type: 'spring',
    stiffness: 260,
    damping: 24,
  },
  micro: {
    duration: 0.15,
    ease: [0.16, 1, 0.3, 1],
  },
  fade: {
    duration: 0.2,
    ease: 'easeInOut',
  },
};

/**
 * Common, accessible UI variants for dialogs, drawers, and dropdowns.
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    transition: transitions.micro,
  },
};

export const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.18,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

export const drawerVariants: Variants = {
  hidden: {
    x: '100%',
    opacity: 0.7,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: transitions.snappy,
  },
  exit: {
    x: '100%',
    opacity: 0.7,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const tabIndicatorTransition: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
};


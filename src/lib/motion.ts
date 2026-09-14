import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Centralized OHO TECH Motion Design Tokens & Configuration
 */
export const MOTION_TOKENS = {
  // Easing curves
  ease: {
    entrance: 'power3.out',
    transition: 'power2.inOut',
    crisp: 'expo.out',
    smooth: 'power1.out',
  },
  // Duration scales (seconds)
  duration: {
    micro: 0.2,
    fast: 0.35,
    medium: 0.65,
    deliberate: 0.85,
    slow: 1.2,
  },
  // Parallax scrubbing
  scrub: {
    responsive: 0.5,
    tight: 0.3,
    relaxed: 0.8,
  },
  // Distances (px)
  offset: {
    subtle: 16,
    standard: 28,
    pronounced: 44,
  },
  // Stagger intervals (seconds)
  stagger: {
    fast: 0.06,
    standard: 0.1,
    relaxed: 0.16,
  },
} as const;

/**
 * Check if the user has requested reduced motion.
 * Safely handles SSR / Node environments.
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Standardized ScrollTrigger preset options
 */
export const SCROLL_PRESETS = {
  entrance: {
    start: 'top 88%',
    toggleActions: 'play none none none',
    once: true,
  },
  sectionProgress: {
    start: 'top bottom',
    end: 'bottom top',
    scrub: MOTION_TOKENS.scrub.responsive,
  },
  parallax: {
    start: 'top bottom',
    end: 'bottom top',
    scrub: MOTION_TOKENS.scrub.responsive,
  },
} as const;

/**
 * Reusable entrance reveal for DOM elements
 */
export function createScrollReveal(
  target: gsap.DOMTarget,
  options?: {
    trigger?: gsap.DOMTarget;
    stagger?: number;
    y?: number;
    delay?: number;
    duration?: number;
    start?: string;
  }
) {
  if (isReducedMotion()) {
    gsap.set(target, { opacity: 1, y: 0 });
    return null;
  }

  const {
    trigger = target,
    stagger = MOTION_TOKENS.stagger.standard,
    y = MOTION_TOKENS.offset.standard,
    delay = 0,
    duration = MOTION_TOKENS.duration.deliberate,
    start = 'top 88%',
  } = options || {};

  return gsap.fromTo(
    target,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: MOTION_TOKENS.ease.entrance,
      clearProps: 'transform',
      scrollTrigger: {
        trigger,
        start,
        toggleActions: 'play none none none',
        once: true,
      },
    }
  );
}

/**
 * Reusable image scale reveal on scroll
 */
export function createImageScaleReveal(
  imageTarget: gsap.DOMTarget,
  triggerTarget: gsap.DOMTarget
) {
  if (isReducedMotion()) {
    gsap.set(imageTarget, { scale: 1, opacity: 1 });
    return null;
  }

  return gsap.fromTo(
    imageTarget,
    { scale: 1.08, opacity: 0.8 },
    {
      scale: 1,
      opacity: 1,
      duration: MOTION_TOKENS.duration.slow,
      ease: MOTION_TOKENS.ease.smooth,
      scrollTrigger: {
        trigger: triggerTarget,
        start: 'top 85%',
        end: 'center 40%',
        scrub: MOTION_TOKENS.scrub.relaxed,
      },
    }
  );
}

/**
 * Reusable scroll-driven parallax effect
 */
export function createParallax(
  target: gsap.DOMTarget,
  trigger: gsap.DOMTarget,
  distance: number = 36
) {
  if (isReducedMotion()) return null;

  return gsap.to(target, {
    y: distance,
    ease: 'none',
    scrollTrigger: {
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub: MOTION_TOKENS.scrub.responsive,
    },
  });
}

/**
 * Reusable magnetic cursor interaction on hover (desktop only)
 */
export function createMagnetic(
  element: HTMLElement,
  strength: number = 0.25
): () => void {
  if (typeof window === 'undefined' || isReducedMotion()) return () => {};

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;

    gsap.to(element, {
      x,
      y,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}

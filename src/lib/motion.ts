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

'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Vertical offset in pixels for the slide entrance (default: 24) */
  distance?: number;
  /** Legacy prop alias for distance */
  yOffset?: number;
  /** Direction to animate from: 'bottom' | 'top' | 'left' | 'right' (default: 'bottom') */
  from?: 'bottom' | 'top' | 'left' | 'right';
  /** Animation duration in seconds (default: 0.75) */
  duration?: number;
  /** Delay before animation starts in seconds (default: 0) */
  delay?: number;
  /** Whether to play only once (default: true) */
  once?: boolean;
  /** ScrollTrigger start position (default: 'top 88%') */
  triggerStart?: string;
  /** Optional className on the wrapper div */
  className?: string;
}

/**
 * ScrollReveal
 *
 * GSAP ScrollTrigger fade and slide reveal wrapper.
 * Uses GPU-accelerated transforms (opacity + transform).
 * Respects prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  distance = 24,
  yOffset,
  from = 'bottom',
  duration = 0.75,
  delay = 0,
  once = true,
  triggerStart = 'top 88%',
  className = '',
  ...props
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const actualDistance = yOffset ?? distance;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Skip animation for reduced-motion users
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1, x: 0, y: 0 });
      return;
    }

    let initialX = 0;
    let initialY = 0;

    switch (from) {
      case 'top':
        initialY = -actualDistance;
        break;
      case 'left':
        initialX = -actualDistance;
        break;
      case 'right':
        initialX = actualDistance;
        break;
      case 'bottom':
      default:
        initialY = actualDistance;
        break;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, x: initialX, y: initialY },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          willChange: 'opacity, transform',
          onComplete: () => {
            gsap.set(el, { clearProps: 'willChange' });
          },
          scrollTrigger: {
            trigger: el,
            start: triggerStart,
            toggleActions: once
              ? 'play none none none'
              : 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [actualDistance, from, duration, delay, once, triggerStart]);

  return (
    <div ref={containerRef} className={className} {...props}>
      {children}
    </div>
  );
}

export default ScrollReveal;

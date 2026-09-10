'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Vertical offset in pixels for the slide-up entrance (default: 30) */
  yOffset?: number;
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
 * A reusable scroll-triggered reveal component.
 * Fades in and slides up when the element enters the viewport.
 * 
 * Uses only GPU-friendly properties (opacity + transform).
 * Respects prefers-reduced-motion by rendering content immediately.
 * Properly cleans up GSAP context on unmount.
 */
export function ScrollReveal({
  children,
  yOffset = 24,
  duration = 0.7,
  delay = 0,
  once = true,
  triggerStart = 'top 90%',
  className = '',
  ...props
}: ScrollRevealProps & React.HTMLAttributes<HTMLDivElement>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Skip animation for reduced-motion users
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: yOffset },
        {
          opacity: 1,
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
  }, [yOffset, duration, delay, once, triggerStart]);

  return (
    <div ref={containerRef} className={className} {...props}>
      {children}
    </div>
  );
}

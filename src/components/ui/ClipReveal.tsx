'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_TOKENS, isReducedMotion } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ClipRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Duration in seconds (default: 0.85) */
  duration?: number;
  /** Delay in seconds (default: 0) */
  delay?: number;
  /** Trigger start position (default: 'top 88%') */
  triggerStart?: string;
  className?: string;
}

/**
 * ClipReveal
 * Editorial mask/clip reveal wrapper for headlines and statements.
 * Uses GPU-accelerated clip-path and opacity transitions.
 */
export function ClipReveal({
  children,
  duration = MOTION_TOKENS.duration.deliberate,
  delay = 0,
  triggerStart = 'top 88%',
  className = '',
  ...props
}: ClipRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isReducedMotion()) {
      gsap.set(el, { opacity: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 20,
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        },
        {
          opacity: 1,
          y: 0,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration,
          delay,
          ease: MOTION_TOKENS.ease.entrance,
          scrollTrigger: {
            trigger: el,
            start: triggerStart,
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [duration, delay, triggerStart]);

  return (
    <div ref={containerRef} className={className} {...props}>
      {children}
    </div>
  );
}

export default ClipReveal;

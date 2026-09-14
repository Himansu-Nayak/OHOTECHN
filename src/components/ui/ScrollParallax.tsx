'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_TOKENS, isReducedMotion } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Vertical travel distance in pixels (default: 32) */
  speed?: number;
  /** Direction of parallax: 'up' | 'down' (default: 'up') */
  direction?: 'up' | 'down';
  /** Scrub smoothness factor (default: 0.5) */
  scrub?: number | boolean;
  className?: string;
}

/**
 * Reusable ScrollParallax component for subtle depth motion.
 * Automatically respects prefers-reduced-motion.
 */
export function ScrollParallax({
  children,
  speed = 32,
  direction = 'up',
  scrub = MOTION_TOKENS.scrub.responsive,
  className = '',
  ...props
}: ScrollParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const target = targetRef.current;
    if (!container || !target) return;

    if (isReducedMotion()) {
      gsap.set(target, { y: 0 });
      return;
    }

    const yStart = direction === 'up' ? speed : -speed;
    const yEnd = direction === 'up' ? -speed : speed;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        target,
        { y: yStart },
        {
          y: yEnd,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [speed, direction, scrub]);

  return (
    <div ref={containerRef} className={`relative overflow-visible ${className}`} {...props}>
      <div ref={targetRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}

export default ScrollParallax;

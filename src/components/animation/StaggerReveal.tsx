'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StaggerRevealProps {
  children: React.ReactNode;
  /** CSS selector for the child elements to stagger (default: ':scope > *') */
  selector?: string;
  /** Stagger delay between each child in seconds (default: 0.1) */
  stagger?: number;
  /** Vertical offset in pixels (default: 25) */
  yOffset?: number;
  /** Animation duration per element in seconds (default: 0.65) */
  duration?: number;
  /** Delay before the stagger sequence begins (default: 0) */
  delay?: number;
  /** ScrollTrigger start position (default: 'top 88%') */
  triggerStart?: string;
  /** Optional className on the wrapper div */
  className?: string;
}

/**
 * StaggerReveal
 * 
 * Animates direct children (or matched selector) with a staggered
 * fade-up entrance when the container enters the viewport.
 * 
 * Perfect for card grids, lists, and grouped content.
 * Uses only GPU-friendly properties (opacity + transform).
 */
export function StaggerReveal({
  children,
  selector = ':scope > *',
  stagger = 0.08,
  yOffset = 20,
  duration = 0.6,
  delay = 0,
  triggerStart = 'top 90%',
  className = '',
  ...props
}: StaggerRevealProps & React.HTMLAttributes<HTMLDivElement>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Skip animation for reduced-motion users
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const targets = el.querySelectorAll(selector);
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const targets = el.querySelectorAll(selector);
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: yOffset },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger,
          ease: 'power3.out',
          willChange: 'opacity, transform',
          onComplete: () => {
            gsap.set(targets, { clearProps: 'willChange' });
          },
          scrollTrigger: {
            trigger: el,
            start: triggerStart,
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [selector, stagger, yOffset, duration, delay, triggerStart]);

  return (
    <div ref={containerRef} className={className} {...props}>
      {children}
    </div>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SplitLineTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
}

/**
 * SplitLineText
 *
 * Recreates the iconic text illumination effect from unitedcarriers.com:
 * The gradient progress is scrubbed directly by GSAP ScrollTrigger as the line
 * enters the viewport.
 */
export function SplitLineText({
  children,
  className = '',
  as: Component = 'p',
}: SplitLineTextProps) {
  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const tween = gsap.fromTo(
      el,
      {
        '--bg-progress': 0,
      },
      {
        '--bg-progress': 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 45%',
          scrub: 0.5,
        },
      }
    );

    return () => {
      if (tween.scrollTrigger) {
        tween.scrollTrigger.kill();
      }
      tween.kill();
    };
  }, []);

  return (
    <Component
      // @ts-expect-error - Polymorphic ref
      ref={elRef}
      className={`split-line-p font-medium transition-colors ${className}`}
    >
      {children}
    </Component>
  );
}

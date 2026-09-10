'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxElementProps {
  children: React.ReactNode;
  /** Vertical parallax shift in pixels (default: -30, negative = moves up as user scrolls down) */
  yShift?: number;
  /** Optional className */
  className?: string;
}

/**
 * ParallaxElement
 * 
 * Applies a subtle scroll-linked vertical parallax translation
 * to its children. Designed for decorative background elements only.
 * 
 * Does NOT move text, buttons, or interactive elements.
 * Uses only GPU-friendly transform property.
 * Disabled for reduced-motion users.
 */
export function ParallaxElement({
  children,
  yShift = -30,
  className = '',
  ...props
}: ParallaxElementProps & React.HTMLAttributes<HTMLDivElement>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Skip parallax for reduced-motion users
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Skip on touch devices (parallax adds no value, costs battery)
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 0 },
        {
          y: yShift,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [yShift]);

  return (
    <div ref={containerRef} className={className} {...props}>
      {children}
    </div>
  );
}

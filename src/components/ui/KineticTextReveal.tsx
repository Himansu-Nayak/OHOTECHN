'use client';

import * as React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface KineticTextRevealProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  stagger?: number;
  duration?: number;
  delay?: number;
}

export function KineticTextReveal({
  children,
  className = '',
  as: Component = 'h2',
  stagger = 0.04,
  duration = 0.75,
  delay = 0,
}: KineticTextRevealProps) {
  const containerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const words = el.querySelectorAll<HTMLElement>('.kinetic-word-inner');
    if (!words.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          yPercent: 110,
          opacity: 0,
          rotateX: 30,
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration,
          stagger,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [duration, stagger, delay]);

  const words = children.split(' ');

  return (
    // @ts-expect-error - Polymorphic ref
    <Component ref={containerRef} className={`inline-block overflow-hidden ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.26em] align-top">
          <span className="kinetic-word-inner inline-block will-change-transform transform-gpu">
            {word}
          </span>
        </span>
      ))}
    </Component>
  );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import SplitType from 'split-type';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface TextRevealProps {
  children: React.ReactNode;
  /** HTML tag to render (default: 'div') */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div' | 'span';
  /** Split by 'lines', 'words', or 'lines,words' (default: 'lines') */
  splitType?: 'lines' | 'words' | 'chars' | 'lines,words';
  /** Stagger delay between lines/words in seconds (default: 0.035) */
  stagger?: number;
  /** Animation duration in seconds (default: 0.85) */
  duration?: number;
  /** ScrollTrigger start position (default: 'top 82%') */
  triggerStart?: string;
  /** Whether the reveal is triggered by scroll or immediately on load (default: false = scroll) */
  immediate?: boolean;
  /** Initial delay before playing in seconds (default: 0) */
  delay?: number;
  /** Custom CSS classes */
  className?: string;
}

/**
 * Splits text into lines/words with overflow masking for scroll-triggered reveals.
 */
export function TextReveal({
  children,
  as: Component = 'div',
  splitType = 'lines',
  stagger = 0.035,
  duration = 0.85,
  triggerStart = 'top 82%',
  immediate = false,
  delay = 0,
  className = '',
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const el = containerRef.current;
    let split: SplitType | null = null;

    try {
      // 1. Split DOM into lines/words
      split = new SplitType(el, {
        types: splitType as 'lines' | 'words' | 'chars',
        tagName: 'span',
      });

      const targets = splitType.includes('words') ? split.words : split.lines;

      if (!targets || targets.length === 0) return;

      // 2. Wrap each line/word in an overflow-hidden wrapper to prevent CLS and provide a clean mask
      targets.forEach((target) => {
        target.style.display = 'inline-block';
        target.style.verticalAlign = 'top';
        target.style.willChange = 'transform, opacity';
        
        // Wrap with parent overflow hidden line box if not already wrapped
        if (!target.parentElement?.classList.contains('split-line-mask')) {
          const wrapper = document.createElement('span');
          wrapper.className = 'split-line-mask inline-block overflow-hidden align-top leading-[inherit]';
          target.parentNode?.insertBefore(wrapper, target);
          wrapper.appendChild(target);
        }
      });

      // 3. GSAP Kinetic fromTo animation
      const animConfig: gsap.TweenVars = {
        yPercent: 0,
        opacity: 1,
        duration,
        stagger,
        delay,
        ease: 'power4.out',
        clearProps: 'willChange',
      };

      if (!immediate) {
        animConfig.scrollTrigger = {
          trigger: el,
          start: triggerStart,
          toggleActions: 'play none none none',
          once: true,
        };
      }

      gsap.fromTo(
        targets,
        { yPercent: 110, opacity: 0 },
        animConfig
      );
    } catch {
      // Fallback gracefully if splitting fails
    }

    return () => {
      if (split) {
        split.revert();
      }
    };
  }, [mounted, splitType, stagger, duration, triggerStart, immediate, delay]);

  return (
    <Component
      ref={containerRef as unknown as React.Ref<never>}
      className={className}
    >
      {children}
    </Component>
  );
}

export default TextReveal;

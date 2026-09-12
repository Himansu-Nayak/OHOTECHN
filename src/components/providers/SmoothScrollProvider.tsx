'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScrollProvider
 * 
 * Initializes Lenis smooth scrolling and syncs with GSAP ScrollTrigger.
 * 
 * Safety:
 * - Disabled on mobile/touch devices to preserve native momentum scrolling
 * - Disabled when prefers-reduced-motion is active
 * - Smoothly handles anchor links (#section) with sticky header offset
 * - Properly cleans up on unmount (prevents memory leaks in dev/HMR)
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced-motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis with responsive settings
    const lenis = new Lenis({
      duration: 1.1,            // Smooth but responsive
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll events with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Connect Lenis to GSAP's animation frame ticker
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Initial ScrollTrigger layout recalibration
    const refreshTimer1 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    const refreshTimer2 = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      }).catch(() => {});
    }

    // Smoothly scroll to in-page anchor links with sticky header offset
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        try {
          const targetEl = document.querySelector(href);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl as HTMLElement, { offset: -90 });
          }
        } catch {
          // Ignore invalid selector
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      clearTimeout(refreshTimer1);
      clearTimeout(refreshTimer2);
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}

'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Expose lenis on window for debugging and programmatic triggers
    (window as any).lenis = lenis;

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Initial layout calibration
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      }).catch(() => {});
    }

    // Smoothly scroll to in-page anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        try {
          const targetEl = document.querySelector(href);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl as HTMLElement, { offset: -80 });
          }
        } catch {
          // Ignore invalid selector
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      clearTimeout(refreshTimer);
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return <>{children}</>;
}

'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollContextValue {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement | number, options?: Parameters<Lenis['scrollTo']>[1]) => void;
  isReducedMotion: boolean;
}

const ScrollContext = createContext<ScrollContextValue>({
  lenis: null,
  scrollTo: () => {},
  isReducedMotion: false,
});

export function useLenis() {
  return useContext(ScrollContext);
}

interface ScrollProviderProps {
  children: React.ReactNode;
}

/**
 * ScrollProvider
 * 
 * 14islands Scroll Architecture Principle:
 * ONE scroll authority app-wide. Lenis handles smooth virtual scrolling,
 * feeds GSAP ScrollTrigger updates, and is driven directly by GSAP's ticker.
 * Nothing else in the app free-runs on a secondary RAF scroll loop.
 */
export function ScrollProvider({ children }: ScrollProviderProps) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsReducedMotion(prefersReducedMotion);

    if (prefersReducedMotion) {
      return;
    }

    // 1. Single Lenis Instance app-wide
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.35,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // 2. Wire ScrollTrigger to update synchronously on every Lenis scroll tick
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Drive Lenis solely from GSAP ticker with lagSmoothing(0)
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // 4. Calibrate triggers once DOM and fonts are ready
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready
        .then(() => {
          ScrollTrigger.refresh();
        })
        .catch(() => {});
    }

    // 5. In-page smooth anchor routing
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
      lenisRef.current = null;
      setLenisInstance(null);
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  const scrollTo = (target: string | HTMLElement | number, options?: Parameters<Lenis['scrollTo']>[1]) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else if (typeof window !== 'undefined') {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <ScrollContext.Provider value={{ lenis: lenisInstance, scrollTo, isReducedMotion }}>
      {children}
    </ScrollContext.Provider>
  );
}

export default ScrollProvider;

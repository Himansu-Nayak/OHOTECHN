'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
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
 * Single scroll authority: synchronizes Lenis virtual scroll with GSAP ScrollTrigger ticker.
 */
export function ScrollProvider({ children }: ScrollProviderProps) {
  const pathname = usePathname();
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Instant scroll-to-top on route change without lag
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.location.hash) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
      ScrollTrigger.refresh();
    }
  }, [pathname]);

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

    // 5. In-page instant anchor routing for internal sections
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;

      // Extract target hash selector if it targets the current page
      let targetSelector = '';
      if (href.startsWith('#') && href.length > 1) {
        targetSelector = href;
      } else if (anchor.hash && anchor.hash.length > 1) {
        const isSameOrigin = !anchor.origin || anchor.origin === window.location.origin;
        const isSamePath = !anchor.pathname || anchor.pathname === window.location.pathname;
        if (isSameOrigin && isSamePath) {
          targetSelector = anchor.hash;
        }
      }

      if (targetSelector) {
        try {
          const targetEl = document.querySelector(targetSelector);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl as HTMLElement, {
              offset: -80,
              immediate: true,
            });
            if (window.history.pushState) {
              window.history.pushState(null, '', targetSelector);
            }
            ScrollTrigger.update();
          }
        } catch {
          // Ignore invalid selector
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Jump immediately if URL already contains a hash on mount
    if (typeof window !== 'undefined' && window.location.hash) {
      try {
        const initialEl = document.querySelector(window.location.hash);
        if (initialEl) {
          requestAnimationFrame(() => {
            lenis.scrollTo(initialEl as HTMLElement, { offset: -80, immediate: true });
            ScrollTrigger.update();
          });
        }
      } catch {
        // Ignore invalid selector
      }
    }

    const handleHashChange = () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        try {
          const targetEl = document.querySelector(window.location.hash);
          if (targetEl) {
            lenis.scrollTo(targetEl as HTMLElement, { offset: -80, immediate: true });
            ScrollTrigger.update();
          }
        } catch {
          // Ignore invalid selector
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      clearTimeout(refreshTimer);
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('hashchange', handleHashChange);
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
      const behavior = options?.immediate ? 'auto' : 'smooth';
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior });
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

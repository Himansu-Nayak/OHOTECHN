'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { isReducedMotion } from '@/lib/motion';

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (typeof window === 'undefined' || isReducedMotion()) return;

    if (timerRef.current) clearInterval(timerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    setIsVisible(true);
    setProgress(25);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 65) return prev + 15;
        if (prev < 85) return prev + 4;
        if (prev < 95) return prev + 1;
        return prev;
      });
    }, 120);
  };

  const completeProgress = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setProgress(100);

    resetTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      resetTimerRef.current = setTimeout(() => {
        setProgress(0);
      }, 200);
    }, 200);
  };

  // Listen to route changes
  useEffect(() => {
    completeProgress();
  }, [pathname, searchParams]);

  // Intercept click on internal links and popstate
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Ignore external, anchor links, modified clicks, download links, new tab links
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        targetAttr === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if it is an internal route that differs from current path
      try {
        const targetUrl = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (
          targetUrl.origin === currentUrl.origin &&
          (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search)
        ) {
          startProgress();
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    const handlePopState = () => {
      startProgress();
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
      if (timerRef.current) clearInterval(timerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page Navigation Progress"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[999999] pointer-events-none overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all ease-out"
        style={{
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
          transitionDuration: progress === 100 ? '150ms' : '250ms',
        }}
      />
    </div>
  );
}

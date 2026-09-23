'use client';

import { useSyncExternalStore } from 'react';
import { isReducedMotion } from '@/lib/motion';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getSnapshot(): boolean {
  return isReducedMotion();
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * React hook to reactively track prefers-reduced-motion media query
 * Built with useSyncExternalStore for hydration safety and zero-cascading renders.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

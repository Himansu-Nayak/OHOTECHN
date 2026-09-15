'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export type SceneId = 
  | 'hero' 
  | 'brand' 
  | 'services' 
  | 'work' 
  | 'technology' 
  | 'company' 
  | 'director' 
  | 'cta' 
  | 'finale';

export interface PointerState {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
  targetNormalizedX: number;
  targetNormalizedY: number;
}

export interface MotionContextValue {
  scrollProgress: number;
  scrollVelocity: number;
  scrollDirection: number;
  pointer: PointerState;
  activeScene: SceneId;
  activeServiceIndex: number;
  activeServiceAccent: string;
  isWebGLSupported: boolean;
  isReducedMotion: boolean;
  setActiveScene: (scene: SceneId) => void;
  setActiveServiceIndex: (idx: number) => void;
  setActiveServiceAccent: (accent: string) => void;
}

const defaultPointer: PointerState = {
  x: 0,
  y: 0,
  normalizedX: 0,
  normalizedY: 0,
  targetNormalizedX: 0,
  targetNormalizedY: 0,
};

const MotionContext = createContext<MotionContextValue>({
  scrollProgress: 0,
  scrollVelocity: 0,
  scrollDirection: 1,
  pointer: defaultPointer,
  activeScene: 'hero',
  activeServiceIndex: 0,
  activeServiceAccent: '#10b981',
  isWebGLSupported: true,
  isReducedMotion: false,
  setActiveScene: () => {},
  setActiveServiceIndex: () => {},
  setActiveServiceAccent: () => {},
});

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(1);
  const [pointer, setPointer] = useState<PointerState>(defaultPointer);
  const [activeScene, setActiveScene] = useState<SceneId>('hero');
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [activeServiceAccent, setActiveServiceAccent] = useState('#10b981');
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const pointerRef = useRef<PointerState>(defaultPointer);
  const rafRef = useRef<number | null>(null);

  // Check reduced motion & WebGL capabilities deterministically on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsReducedMotion(prefersReduced);

    // Detect WebGL capability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsWebGLSupported(Boolean(gl));
    } catch {
      setIsWebGLSupported(false);
    }
  }, []);

  // Pointer interpolation engine for smooth WebGL shader distortion & magnetic responsiveness
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      const winW = window.innerWidth || 1;
      const winH = window.innerHeight || 1;
      const targetNormX = (e.clientX / winW) * 2 - 1;
      const targetNormY = -(e.clientY / winH) * 2 + 1;

      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.targetNormalizedX = targetNormX;
      pointerRef.current.targetNormalizedY = targetNormY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth Lerp loop for pointer via GSAP ticker
    const lerpLoop = () => {
      const p = pointerRef.current;
      const ease = 0.08;
      p.normalizedX += (p.targetNormalizedX - p.normalizedX) * ease;
      p.normalizedY += (p.targetNormalizedY - p.normalizedY) * ease;

      setPointer({ ...p });
    };

    gsap.ticker.add(lerpLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.ticker.remove(lerpLoop);
    };
  }, []);

  // Sync scroll metrics with Lenis / ScrollTrigger via ScrollTrigger listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateScrollMetrics = () => {
      const lenis = (window as unknown as { lenis?: { progress?: number; velocity?: number; direction?: number } }).lenis;
      if (lenis) {
        setScrollProgress(lenis.progress || 0);
        setScrollVelocity(lenis.velocity || 0);
        setScrollDirection(lenis.direction || 1);
      } else {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const currentProgress = docH > 0 ? window.scrollY / docH : 0;
        setScrollProgress(currentProgress);
      }
    };

    ScrollTrigger.addEventListener('scrollEnd', updateScrollMetrics);
    const tickerUpdate = () => {
      updateScrollMetrics();
    };
    gsap.ticker.add(tickerUpdate);

    return () => {
      ScrollTrigger.removeEventListener('scrollEnd', updateScrollMetrics);
      gsap.ticker.remove(tickerUpdate);
    };
  }, []);

  return (
    <MotionContext.Provider
      value={{
        scrollProgress,
        scrollVelocity,
        scrollDirection,
        pointer,
        activeScene,
        activeServiceIndex,
        activeServiceAccent,
        isWebGLSupported,
        isReducedMotion,
        setActiveScene,
        setActiveServiceIndex,
        setActiveServiceAccent,
      }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion() {
  return useContext(MotionContext);
}

'use client';

import React, { useEffect, useState, useRef } from 'react';

export function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Disable for touch devices or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check for interactive targets under cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        const projectCard = target.closest('[data-cursor-text]');
        const isClickable = target.closest('a, button, [role="button"], input, select');

        if (projectCard) {
          const text = projectCard.getAttribute('data-cursor-text') || 'VIEW';
          setCursorText(text);
          setIsHovered(true);
        } else if (isClickable) {
          setCursorText('');
          setIsHovered(true);
        } else {
          setCursorText('');
          setIsHovered(false);
        }
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    // Smooth lerp for outer ring via GSAP ticker
    const renderLoop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    gsap.ticker.add(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      gsap.ticker.remove(renderLoop);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Precision Center Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-emerald-400 pointer-events-none shadow-[0_0_10px_rgba(16,185,129,0.8)] will-change-transform"
      />

      {/* Smooth Trailing Follower Ring / Interactive Pill */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 pointer-events-none rounded-full border transition-all duration-200 flex items-center justify-center font-mono font-bold tracking-widest text-[9px] uppercase will-change-transform ${
          cursorText
            ? '-ml-8 -mt-8 w-16 h-16 bg-emerald-500/90 text-black border-emerald-400 backdrop-blur-sm shadow-2xl scale-110'
            : isHovered
            ? '-ml-5 -mt-5 w-10 h-10 bg-white/10 border-emerald-400 scale-125'
            : '-ml-3.5 -mt-3.5 w-7 h-7 border-emerald-500/40 bg-emerald-500/5'
        }`}
      >
        {cursorText && <span className="animate-in fade-in zoom-in-75 duration-150">{cursorText}</span>}
      </div>
    </div>
  );
}

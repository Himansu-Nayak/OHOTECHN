'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * MagneticCursor
 *
 * Awwwards-tier custom interactive cursor inspired by unitedcarriers.com:
 * - Smooth lerped trailing motion
 * - Contextual hover states (links, buttons, 3D canvases, custom [data-cursor] badges)
 * - Automatically disabled on touch / mobile devices
 * - Respects prefers-reduced-motion
 */
export function MagneticCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorBadgeRef = useRef<HTMLDivElement>(null);

  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0)
    ) {
      setIsTouch(true);
      return;
    }

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instant update for the central dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      // Inspect target under cursor
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const text = cursorTarget.getAttribute('data-cursor');
        setCursorText(text || null);
        setIsExpanded(true);
        setIsHovered(true);
      } else if (target.closest('a, button, [role="button"], input, textarea, select')) {
        setCursorText(null);
        setIsExpanded(false);
        setIsHovered(true);
      } else {
        setCursorText(null);
        setIsExpanded(false);
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth Lerp loop for the trailing ring
    const render = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (isTouch) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[99999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Precision Center Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full pointer-events-none will-change-transform shadow-[0_0_8px_rgba(16,185,129,0.8)]"
      />

      {/* Trailing Responsive Ring / Badge Container */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none will-change-transform flex items-center justify-center transition-all duration-200 ease-out ${
          isExpanded
            ? 'w-24 h-24 bg-neutral-900/90 border border-emerald-500/40 backdrop-blur-md rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : isHovered
            ? 'w-12 h-12 border border-emerald-400/60 bg-emerald-500/10 rounded-full'
            : 'w-8 h-8 border border-white/25 rounded-full'
        }`}
      >
        {cursorText && (
          <span
            ref={cursorBadgeRef}
            className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase text-center px-2 select-none animate-in fade-in zoom-in-90 duration-150"
          >
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}

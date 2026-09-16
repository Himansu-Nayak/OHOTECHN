'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';

export function CustomCursor() {
  const cursorContainerRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible && cursorContainerRef.current) {
        isVisible = true;
        cursorContainerRef.current.style.opacity = '1';
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check for interactive targets under cursor
      const target = e.target as HTMLElement | null;
      if (target) {
        const projectCard = target.closest('[data-cursor-text]');
        const isClickable = target.closest('a, button, [role="button"], input, select, .cursor-pointer');

        if (projectCard) {
          const text = projectCard.getAttribute('data-cursor-text') || 'EXPLORE';
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
      isVisible = false;
      if (cursorContainerRef.current) {
        cursorContainerRef.current.style.opacity = '0';
      }
    };

    const onTouchStart = () => {
      // Hide custom cursor on mobile touch interaction
      isVisible = false;
      if (cursorContainerRef.current) {
        cursorContainerRef.current.style.opacity = '0';
      }
    };

    // Smooth lerp for outer follower ring via GSAP ticker
    const renderLoop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    gsap.ticker.add(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchstart', onTouchStart);
      gsap.ticker.remove(renderLoop);
    };
  }, []);

  return (
    <div
      id="custom-cursor"
      ref={cursorContainerRef}
      style={{ opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden transition-opacity duration-150"
    >
      {/* Precision Center Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2.5 h-2.5 rounded-full bg-emerald-400 pointer-events-none shadow-[0_0_12px_rgba(16,185,129,0.9)] will-change-transform"
      />

      {/* Smooth Trailing Follower with Arrow Icon */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 pointer-events-none rounded-full border transition-all duration-200 flex items-center justify-center font-mono font-bold tracking-widest text-[10px] uppercase will-change-transform ${
          cursorText
            ? '-ml-12 -mt-6 px-3.5 py-1.5 bg-emerald-500 text-black border-emerald-400 backdrop-blur-md shadow-[0_0_25px_rgba(16,185,129,0.6)] scale-110'
            : isHovered
            ? '-ml-5 -mt-5 w-10 h-10 bg-emerald-500/25 border-emerald-400 text-emerald-400 scale-125 backdrop-blur-sm'
            : '-ml-4 -mt-4 w-8 h-8 border-emerald-500/50 bg-emerald-500/10'
        }`}
      >
        {cursorText ? (
          <span className="flex items-center gap-1.5 font-mono font-black text-black">
            <span>{cursorText}</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </span>
        ) : isHovered ? (
          <ArrowUpRight className="w-4 h-4 text-emerald-400 stroke-[2.5] animate-in fade-in duration-150" />
        ) : (
          <ArrowUpRight className="w-3 h-3 text-emerald-400/60 stroke-[2]" />
        )}
      </div>
    </div>
  );
}

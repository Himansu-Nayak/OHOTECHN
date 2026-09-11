'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export function PageTransitionOverlay() {
  const pathname = usePathname();
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    // Skip animation on first initial mount to avoid competing with SiteIntroLoader
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const overlay = overlayRef.current;
    const bar = barRef.current;
    const text = textRef.current;
    if (!overlay || !bar) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' }
    });

    tl.set(overlay, { display: 'flex', pointerEvents: 'auto', opacity: 1, scaleY: 0, transformOrigin: 'bottom center' })
      .set(bar, { scaleX: 0, transformOrigin: 'left center' })
      .set(text, { opacity: 0, y: 10 })
      .to(overlay, {
        scaleY: 1,
        duration: 0.38,
        ease: 'power4.inOut'
      })
      .to(text, {
        opacity: 1,
        y: 0,
        duration: 0.15,
        ease: 'power2.out'
      }, '-=0.15')
      .to(bar, {
        scaleX: 1,
        duration: 0.28,
        ease: 'power2.inOut'
      })
      .to(overlay, {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 0.4,
        ease: 'power4.inOut',
        delay: 0.05
      })
      .to(text, {
        opacity: 0,
        y: -10,
        duration: 0.15
      }, '-=0.35')
      .set(overlay, { display: 'none', pointerEvents: 'none' });

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[99998] hidden flex-col items-center justify-center bg-[#0d0d0e] text-white pointer-events-none select-none"
      style={{ transform: 'scaleY(0)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
        <div 
          ref={barRef} 
          className="h-full w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      <div ref={textRef} className="flex flex-col items-center gap-2 opacity-0">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-emerald-400">
            OHO TECH
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 tracking-wider">
          SYNCHRONIZING SYSTEM STATE...
        </span>
      </div>
    </div>
  );
}

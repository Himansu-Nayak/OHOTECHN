'use client';

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

/**
 * SiteIntroLoader
 *
 * Awwwards-tier initial preloader inspired by unitedcarriers.com:
 * - High-speed percentage counter with smooth easing (0 -> 100%)
 * - Global cloud network node coordinates
 * - Hexadecimal cryptographic telemetry hash stream
 * - Upward split-curtain curtain lift on complete
 * - Respects prefers-reduced-motion & session storage to only play on initial entry
 */
export function SiteIntroLoader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client initial session
    const hasSeenLoader = sessionStorage.getItem('oho_loader_seen');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasSeenLoader || prefersReducedMotion) {
      setShouldRender(false);
      return;
    }

    const duration = 1600;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const easeVal = 1 - Math.pow(1 - rawProgress, 3);
      const currentPercent = Math.floor(easeVal * 100);

      setProgress(currentPercent);

      if (rawProgress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setIsLoaded(true);
        sessionStorage.setItem('oho_loader_seen', 'true');

        // GSAP Upward Curtain Wipe
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.85,
            ease: 'power4.inOut',
            onComplete: () => {
              setShouldRender(false);
            },
          });
        }
      }
    };

    requestAnimationFrame(updateCounter);
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999999] bg-[#090a0f] text-white flex flex-col justify-between p-6 sm:p-12 select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Background Cyber Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Top Status Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-xs text-neutral-300 font-bold uppercase tracking-widest">
            OHO TECH // GLOBAL CLOUD HYDRATION
          </span>
        </div>

        <div className="font-mono text-xs text-neutral-500 uppercase tracking-widest hidden sm:block">
          INIT // CLUSTER NODE [01]
        </div>
      </div>

      {/* Center Global Network Nodes & Title */}
      <div className="relative z-10 max-w-4xl mx-auto text-center w-full my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          HYPERSCALE SOFTWARE ARCHITECTURE
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase mb-6">
          Engineering The Future
        </h1>

        {/* Global Node Hubs */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-mono text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            INDIA HQ [20.59°N]
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            SAN FRANCISCO [37.77°N]
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            LONDON [51.50°N]
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            SINGAPORE [1.35°N]
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            TOKYO [35.67°N]
          </span>
        </div>
      </div>

      {/* Bottom Progress Bar & Counter */}
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <div className="flex items-end justify-between mb-3 font-mono">
          <span className="text-xs text-neutral-400 tracking-wider">
            LOADING ASSETS &amp; 3D SPATIAL CANVAS
          </span>
          <span className="text-3xl sm:text-5xl font-black text-emerald-400">
            {progress}%
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(16,185,129,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

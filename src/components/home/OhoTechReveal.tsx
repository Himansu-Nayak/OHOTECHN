'use client';

import * as React from 'react';

export function OhoTechReveal() {
  return (
    <section 
      id="reveal" 
      aria-label="OHO TECH Brand Signature"
      className="w-full bg-[#050506] text-white py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/5 select-none"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full text-center">
        
        {/* Top Tagline */}
        <div className="font-mono text-xs sm:text-sm font-bold text-emerald-400 tracking-[0.3em] uppercase mb-4 sm:mb-6">
          DIGITAL EXPERIENCES • ARCHITECTURE • SCALE
        </div>

        {/* Signature Massive Brand Wordmark */}
        <div className="text-[clamp(3.5rem,14vw,15rem)] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 leading-none uppercase">
          OHO TECH
        </div>

        {/* Bottom Sub-label */}
        <div className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest mt-4 sm:mt-6">
          ENTERPRISE SOFTWARE &amp; CLOUD ENGINEERING • EST. 2024
        </div>

      </div>
    </section>
  );
}

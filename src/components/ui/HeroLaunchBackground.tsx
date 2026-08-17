'use client';

import * as React from 'react';
import NextImage from 'next/image';

export function HeroLaunchBackground() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900 shadow-xl">
      <div className="relative aspect-[21/9] min-h-[320px] max-h-[460px] w-full">
        <NextImage
          src="/hero_tech_ecosystem.jpg"
          alt="OHO TECHN Digital Infrastructure & Engineering Systems"
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover object-center transition-transform duration-700 hover:scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span className="font-semibold tracking-wide uppercase text-[11px] text-slate-200">
              Integrated Digital Infrastructure Platform
            </span>
          </div>
          <div className="text-slate-300 font-mono text-[11px]">
            Engineering & Infrastructure Solutions
          </div>
        </div>
      </div>
    </div>
  );
}

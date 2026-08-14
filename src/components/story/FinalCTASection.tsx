'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function FinalCTASection() {
  return (
    <section className="max-w-[1536px] w-full mx-auto mb-16 bg-[#0d0d0e] text-white border-2 border-slate-700 rounded-[32px] sm:rounded-[44px] p-10 sm:p-16 lg:p-20 text-center shadow-2xl relative overflow-hidden grid-pattern-dark" id="final-cta">
      
      {/* Ambient Backdrop Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-sky-300 font-mono text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          LET'S BUILD SOMETHING
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5">
          Have an idea? Let's make it real.
        </h2>

        {/* Description */}
        <p className="text-slate-300 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Whether you need software, a website, a mobile application, or help growing your digital presence, tell us what you're looking to achieve.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/get-quote"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white hover:bg-sky-400 text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl group hover:scale-105"
          >
            <span>Get a Quote</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all border border-white/20 hover:scale-105"
          >
            <span>Talk to an Expert →</span>
          </Link>
        </div>

        {/* Copyright Footer */}
        <p className="text-xs font-mono text-slate-500 mt-12">
          © {new Date().getFullYear()} OHO TECH. Software Engineering &amp; Digital Growth Studio.
        </p>

      </div>

    </section>
  );
}

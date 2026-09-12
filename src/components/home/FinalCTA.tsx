'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  PhoneCall, 
  Mail, 
  Calculator, 
  ShieldCheck,
  Clock
} from 'lucide-react';

interface FinalCTAProps {
  onOpenEstimate?: () => void;
}

export function FinalCTA({ onOpenEstimate }: FinalCTAProps) {
  return (
    <section 
      id="cta" 
      className="w-full bg-[#0a0a0b] text-white py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(16,185,129,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-6 sm:mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>START YOUR TECHNICAL TRANSFORMATION</span>
        </div>

        {/* 3-Line Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.92] uppercase mb-6 sm:mb-8">
          <span className="block">LET&apos;S BUILD</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            SOMETHING
          </span>
          <span className="block">GREAT.</span>
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-lg lg:text-xl text-slate-300 font-normal max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">
          From full enterprise custom platforms to mission-critical system modernizations, partner with OHO TECH to architect software that scales effortlessly.
        </p>

        {/* Responsive Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-12 sm:mb-16 w-full max-w-md sm:max-w-none mx-auto">
          <Link
            id="cta-get-quote"
            href="/get-quote"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2"
          >
            <span>Get a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {onOpenEstimate && (
            <button
              id="cta-calculate-estimate"
              onClick={onOpenEstimate}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center backdrop-blur-md flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Instant Cost Estimate</span>
            </button>
          )}

          <Link
            id="cta-book-demo"
            href="/book-demo"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent hover:bg-white/5 border border-white/20 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center"
          >
            Book a Demo
          </Link>
        </div>

        {/* Direct Contact & Compliance Footer Strip: 1 col on mobile, 3 cols on tablet/desktop */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#141416]/90 border border-white/15 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-[10px] text-slate-400 uppercase">DIRECT PHONE</div>
                <a href="tel:+919937012345" className="font-mono text-xs sm:text-sm font-bold text-white hover:text-emerald-400 transition-colors">
                  +91 99370 12345
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-[10px] text-slate-400 uppercase">CONSULTATION INBOX</div>
                <a href="mailto:contact@ohotech.com" className="font-mono text-xs sm:text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                  contact@ohotech.com
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-mono text-[10px] text-slate-400 uppercase">AVAILABILITY</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-white">
                  Mon – Sat, 9am – 8pm IST
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

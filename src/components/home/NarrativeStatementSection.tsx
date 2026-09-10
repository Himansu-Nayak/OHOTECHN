'use client';

import React from 'react';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { FlippingText } from '@/components/ui/FlippingText';
import { SplitLineText } from '@/components/ui/SplitLineText';

/**
 * NarrativeStatementSection
 * 
 * Signature typographic narrative statement inspired directly by unitedcarriers.com:
 * - Stark architectural split typography ("WE BUILD SOFTWARE. WE OWN THE ARCHITECTURE.")
 * - Two-paragraph executive narrative with high-contrast text styling
 * - Capsule outline CTA button with FlippingText micro-interaction
 * - Monospace micro-caption baseline
 */
export function NarrativeStatementSection() {
  return (
    <section className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 bg-[#0a0b0e] text-white border-2 border-slate-800 rounded-[28px] sm:rounded-[44px] p-6 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden grid-pattern-dark">
      {/* Ambient Emerald Studio Spotlights */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Massive Architectural Wordmark */}
        <div className="lg:col-span-6 space-y-2 select-none">
          <ScrollReveal yOffset={25} duration={0.7}>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] text-slate-500 uppercase">
              WE BUILD SOFTWARE.
            </div>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] text-white uppercase mt-1">
              WE OWN THE ARCHITECTURE.
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: 2-Paragraph Narrative & Capsule Button */}
        <div className="lg:col-span-6 space-y-6">
          <ScrollReveal yOffset={20} duration={0.65} delay={0.15}>
            <p className="text-sm sm:text-lg font-medium text-slate-200 leading-relaxed">
              With every digital system engineered under one roof and one accountable engineering team, your software ecosystem scales the way your business demands: predictably, securely, and without excuses.
            </p>
          </ScrollReveal>

          <ScrollReveal yOffset={20} duration={0.65} delay={0.25}>
            <p className="text-xs sm:text-base text-slate-400 leading-relaxed">
              That means zero finger-pointing between vendors. Zero delays lost in external handoffs. Just one dedicated full-stack team, accountable from system architecture to production high-concurrency deployment.
            </p>
          </ScrollReveal>

          <ScrollReveal yOffset={15} duration={0.55} delay={0.35}>
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                href="/about"
                data-cursor="ABOUT"
                className="px-6 py-3 rounded-full border border-white/30 hover:border-emerald-400 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                <FlippingText text="LEARN MORE ABOUT US" />
              </Link>

              <span className="font-mono text-[11px] text-slate-500 uppercase tracking-widest">
                From complex systems, precision scales
              </span>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}

export default NarrativeStatementSection;

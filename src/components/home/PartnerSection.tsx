'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Tilt3D } from '@/components/ui/Tilt3D';

export function PartnerSection() {
  const partnerTypes = [
    { title: 'Technology Partners', desc: 'Co-develop enterprise software modules and integrate custom APIs.', emoji: '💻' },
    { title: 'Agencies & Studios', desc: 'Expand your service scope by offering software & mobile engineering.', emoji: '🏢' },
    { title: 'System Integrators', desc: 'Implement OHO TECH ERP & retail solutions for client deployments.', emoji: '🤝' },
    { title: 'Channel Partners', desc: 'Distribute ready software products across regional business markets.', emoji: '👥' },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-16 bg-white border-2 border-slate-300 rounded-[28px] sm:rounded-[44px] p-4 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden" id="partner-with-us">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column */}
        <ScrollReveal yOffset={25} duration={0.7} className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>PARTNER WITH US 🤝</span>
          </div>

          <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-4">
            Grow together with OHO TECH.
          </h2>

          <p className="text-sm sm:text-lg text-slate-600 font-normal leading-relaxed mb-6 max-w-xl">
            We collaborate with agencies, developers, system integrators, and business partners to deliver high-impact digital solutions.
          </p>

          <Link
            href="/partner"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md group hover:scale-[1.02]"
          >
            <span>Become a Partner</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>

        {/* Right Column: Inner Dark Console Container */}
        <div className="lg:col-span-7 bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[24px] sm:rounded-[36px] p-4 sm:p-8 shadow-2xl relative overflow-hidden grid-pattern-dark">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {partnerTypes.map((partner, idx) => {
              return (
                <ScrollReveal key={idx} delay={idx * 0.08} yOffset={20} duration={0.6}>
                  <Tilt3D maxTilt={4} scale={1.01} className="h-full">
                    <div className="h-full p-6 rounded-3xl bg-[#141416] border border-white/10 hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all group backdrop-blur-xl">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition-transform">
                        {partner.emoji}
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5 group-hover:text-emerald-400 transition-colors">
                        <span>{partner.emoji}</span>
                        <span>{partner.title}</span>
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{partner.desc}</p>
                    </div>
                  </Tilt3D>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

      </div>

    </section>
  );
}

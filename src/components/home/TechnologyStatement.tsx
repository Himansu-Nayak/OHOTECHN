'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function TechnologyStatement() {
  return (
    <section className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 px-4 sm:px-8 lg:px-12 py-12 sm:py-20 bg-white border-2 border-slate-200/80 rounded-[28px] sm:rounded-[44px] shadow-sm relative overflow-hidden">
      
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        
        {/* Category Pill */}
        <ScrollReveal yOffset={15} duration={0.6}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>ENGINEERING PHILOSOPHY</span>
          </div>
        </ScrollReveal>

        {/* Massive Editorial Headline */}
        <ScrollReveal yOffset={25} duration={0.75} delay={0.1}>
          <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.12] mb-8">
            Technology should not create complexity.{' '}
            <span className="text-emerald-600 block sm:inline">It should remove it.</span>
          </h2>
        </ScrollReveal>

        {/* Split Editorial Narrative */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 pt-6 border-t border-slate-200/80">
          
          <ScrollReveal yOffset={20} duration={0.65} delay={0.15} className="md:col-span-6">
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              At OHO TECH, we treat every software architecture as a long-term commercial asset. From enterprise ERP modules to mobile apps and custom APIs, our systems are engineered for zero-friction maintainability and seamless real-time operations.
            </p>
          </ScrollReveal>

          <ScrollReveal yOffset={20} duration={0.65} delay={0.25} className="md:col-span-6 flex flex-col justify-between">
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-4">
              We eliminate technical debt by decoupling monolithic systems into resilient microservices, automating routine pipelines, and giving business leaders direct control over their operational data.
            </p>
            
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0d0d0e] hover:text-emerald-600 transition-colors uppercase font-mono tracking-wider group"
            >
              <span>Explore Our Engineering Principles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
}

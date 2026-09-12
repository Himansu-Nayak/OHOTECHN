'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ArrowRight
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function EditorialAboutSection() {
  return (
    <section id="about" className="w-full py-20 sm:py-28 px-6 sm:px-10 lg:px-16 bg-[#0a0a0b] relative">
      <div className="max-w-7xl mx-auto">
      
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
        
        {/* Left Column: Editorial Manifesto */}
        <div className="lg:col-span-7">
          <ScrollReveal yOffset={15} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ABOUT OHO TECH</span>
            </div>
          </ScrollReveal>

          <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6 uppercase">
              Engineering Digital Foundations for Enterprise Growth.
            </h2>
          </ScrollReveal>

          <ScrollReveal yOffset={18} duration={0.65} delay={0.15}>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-4">
              OHO TECH was established to bridge the gap between complex software engineering and pragmatic business operations. We build resilient digital platforms, ERP systems, and automated growth engines that help companies operate with clarity and speed.
            </p>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal mb-8">
              Headquartered with a focus on enterprise-grade reliability, our cross-functional team combines full-stack architects, product designers, and growth engineers to deliver software that produces measurable operational value from day one.
            </p>
          </ScrollReveal>

          <ScrollReveal yOffset={15} duration={0.6} delay={0.2}>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 font-mono shadow-lg"
              >
                <span>Read Company Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/careers"
                className="px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-extrabold text-xs uppercase tracking-wider transition-all font-mono border border-white/10"
              >
                Join Our Engineering Team
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Key Principles Card */}
        <div className="lg:col-span-5 bg-[#0d0d0e] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-2">
              FOUNDATIONAL ETHOS
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6">
              Who We Are • What We Believe • What We Build
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-colors">
                <div className="text-xs font-bold text-white mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Who We Are
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">01 / IDENTITY</span>
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  A high-velocity software engineering studio founded by Japabandhu Kampa, delivering bespoke digital platforms and cloud enterprise systems.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors">
                <div className="text-xs font-bold text-white mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    What We Believe
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">02 / BELIEF</span>
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  We believe technology should eliminate operational friction, not add it. High data integrity, modular microservices, and 100% intellectual property ownership.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition-colors">
                <div className="text-xs font-bold text-white mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    What We Build
                  </span>
                  <span className="text-[10px] font-mono text-amber-400">03 / PRODUCTS</span>
                </div>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  Turnkey SaaS platforms (ERP, Healthcare EMR, Fintech), scalable APIs, and bespoke custom applications engineered for mission-critical reliability.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      </div>
    </section>
  );
}

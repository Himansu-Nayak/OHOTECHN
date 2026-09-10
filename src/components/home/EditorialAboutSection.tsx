'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ArrowRight, 
  Sparkles, 
  Code2, 
  Users, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function EditorialAboutSection() {
  return (
    <section id="about" className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 px-4 sm:px-8 lg:px-12 py-12 sm:py-20 bg-white border-2 border-slate-200/80 rounded-[28px] sm:rounded-[44px] shadow-sm relative overflow-hidden">
      
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
        
        {/* Left Column: Editorial Manifesto */}
        <div className="lg:col-span-7">
          <ScrollReveal yOffset={15} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>ABOUT OHO TECH</span>
            </div>
          </ScrollReveal>

          <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0d0d0e] tracking-tight leading-tight sm:leading-[1.1] mb-6">
              Engineering Digital Foundations for Enterprise Growth.
            </h2>
          </ScrollReveal>

          <ScrollReveal yOffset={18} duration={0.65} delay={0.15}>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal mb-4">
              OHO TECH was established to bridge the gap between complex software engineering and pragmatic business operations. We build resilient digital platforms, ERP systems, and automated growth engines that help companies operate with clarity and speed.
            </p>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal mb-8">
              Headquartered with a focus on enterprise-grade reliability, our cross-functional team combines full-stack architects, product designers, and growth engineers to deliver software that produces measurable operational value from day one.
            </p>
          </ScrollReveal>

          <ScrollReveal yOffset={15} duration={0.6} delay={0.2}>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="px-7 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 font-mono shadow-md"
              >
                <span>Read Company Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/careers"
                className="px-7 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0d0d0e] font-extrabold text-xs uppercase tracking-wider transition-all font-mono"
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
              CORE PILLARS
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-6">
              Our Engineering Standards
            </h3>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-white mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Pragmatic Architecture
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  We avoid unnecessary technical complexity and engineer solutions for maintainability and direct business utility.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-white mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Transparent Collaboration
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Direct developer-to-client communication with sprint demos, shared code repositories, and clear milestones.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-white mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Continuous Long-Term Support
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Production monitoring, security patches, and scalable version upgrades as your operations expand.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}

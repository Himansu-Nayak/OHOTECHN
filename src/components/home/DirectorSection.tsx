'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Quote, 
  Terminal, 
  PhoneCall
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Tilt3D } from '@/components/ui/Tilt3D';

export function DirectorSection() {
  return (
    <section 
      id="director" 
      className="w-full py-20 sm:py-28 px-6 sm:px-10 lg:px-16 bg-[#0d0d0e] text-white relative overflow-hidden grid-pattern-dark"
    >
      <div className="max-w-7xl mx-auto relative">
      {/* Ambient Subtle Radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(16,185,129,0.06),transparent_75%)] pointer-events-none" />

      {/* Top Section Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-10 sm:mb-14">
        <ScrollReveal yOffset={15} duration={0.6}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
            <User className="w-3.5 h-3.5" />
            <span>FOUNDER &amp; EXECUTIVE LEADERSHIP</span>
          </div>
        </ScrollReveal>

        <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-[1.1] mb-4">
            Built by Founder Leadership &amp; Technical Precision.
          </h2>
          <p className="text-xs sm:text-base text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Direct founder oversight powering custom software architecture, high-availability digital platforms, and commercial growth.
          </p>
        </ScrollReveal>
      </div>

      {/* Main Founder Spotlight Card */}
      <div className="relative z-10 max-w-5xl mx-auto mb-10 sm:mb-12">
        <ScrollReveal yOffset={24} duration={0.7} delay={0.15}>
          <Tilt3D maxTilt={3} scale={1.01}>
            <div className="bg-[#14151a] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden hover:border-white/20 transition-all duration-300">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
                
                {/* Left Column: Founder Portrait & Badges */}
                <div className="lg:col-span-4 flex flex-col items-center text-center">
                  <div className="relative mb-5 group">
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-500 to-sky-400 p-1.5 shadow-[0_0_35px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform duration-500">
                      <div className="w-full h-full rounded-full bg-[#0d0d0e] relative overflow-hidden border-2 border-[#0d0d0e]">
                        <NextImage
                          src="/japabandhu_kampa.jpeg"
                          alt="Japabandhu Kampa - Founder & Director OHO TECH"
                          width={240}
                          height={240}
                          className="w-full h-full object-cover object-top"
                          priority
                        />
                      </div>
                    </div>
                    
                    <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#0d0d0e] border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Japabandhu Kampa
                  </h3>
                  
                  <p className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mt-1">
                    Founder &amp; Managing Director
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/10 w-full flex flex-col gap-2">
                    <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Direct Executive Governance</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Founder Vision & Architectural Ethos */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                    <Quote className="w-3.5 h-3.5" />
                    <span>Executive Statement</span>
                  </div>

                  <h4 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
                    {"\"We don't build software to add friction. We engineer systems that eliminate operational bottlenecks and scale reliably.\""}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Under the leadership of Founder &amp; Director Japabandhu Kampa, OHO TECH operates with a strict engineering ethos: every software product, custom platform, and digital solution is architected with rigorous data integrity, clean modular microservices, and measurable commercial value.
                  </p>

                  {/* 3 Core Competencies Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1">01 • ARCHITECTURE</span>
                      <span className="text-xs font-bold text-white block">Enterprise Systems</span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">Scalable multi-tenant databases &amp; APIs</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[10px] font-mono text-sky-400 font-bold block mb-1">02 • PRODUCTS</span>
                      <span className="text-xs font-bold text-white block">Turnkey Platforms</span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">ERP, Healthcare EMR, Fintech &amp; Retail</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[10px] font-mono text-amber-400 font-bold block mb-1">03 • COLLABORATION</span>
                      <span className="text-xs font-bold text-white block">Direct Oversight</span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">Milestone transparency &amp; full IP transfer</span>
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                    <Link
                      href="/book-demo"
                      className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2 font-mono"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Book Director Strategy Call</span>
                    </Link>

                    <Link
                      href="/about"
                      className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider transition-all border border-white/15 inline-flex items-center gap-2 font-mono"
                    >
                      <span>Read Full Company Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

              </div>

            </div>
          </Tilt3D>
        </ScrollReveal>
      </div>

      {/* Developer Engineering Ecosystem Bar */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal yOffset={15} duration={0.6} delay={0.25}>
          <div className="bg-[#101217] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Developer Control Studio &amp; Engineering Portal</span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                    Developer Portal
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full-stack engineering led by Himansu Nayak (MCA) • API keys, RBAC controls, and telemetry sandbox.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href="/developer"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-md"
              >
                <span>Launch Dev Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all border border-white/10"
              >
                Engineering Bio
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>

      </div>
    </section>
  );
}

export default DirectorSection;

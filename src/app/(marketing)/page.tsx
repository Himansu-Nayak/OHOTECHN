'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  ArrowRight,
  CheckCircle2,
  Quote,
  ShieldCheck,
  User,
  Sparkles,
} from 'lucide-react';
import { HeroLaunchBackground } from '@/components/ui/HeroLaunchBackground';
import { SolutionsSection } from '@/components/solutions/SolutionsSection';
import { ServicesSection } from '@/components/services/ServicesSection';
import { ProcessSection } from '@/components/home/ProcessSection';
import { WhyChooseSection } from '@/components/home/WhyChooseSection';

export default function StreamlinedStudioPage() {
  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-6 pt-4 px-2 sm:px-4 lg:px-6 selection:bg-[#0d0d0e] selection:text-white">
      
      {/* ── SECTION 01: HERO & INTERACTIVE STUDIO SHOWCASE ── */}
      <section className="max-w-[1536px] w-full mx-auto mb-10 bg-[#fafafa] border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-6 sm:p-12 lg:p-16 shadow-sm pt-24 sm:pt-32 text-center relative overflow-hidden grid-pattern-light" id="hero">
        
        {/* Executive Category Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          ENTERPRISE SOFTWARE STUDIO &amp; DIGITAL GROWTH ENGINE
        </div>

        {/* High-Impact Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto mb-6 text-[#0d0d0e] leading-[1.06]">
          Architecting high-performance software systems &amp; <span className="text-emerald-600">growth engines.</span>
        </h1>

        {/* Crisp Subheadline */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
          Custom enterprise applications, mobile platforms, and customer acquisition engines — engineered for operational clarity and long-term scale.
        </p>

        {/* Dual Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <Link
            id="hero-get-quote"
            href="/get-quote"
            className="px-8 py-4 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg hover:scale-105"
          >
            Get a Quote →
          </Link>

          <Link
            id="hero-book-demo"
            href="/book-demo"
            className="px-8 py-4 rounded-full bg-[#ebebe8] hover:bg-[#e2e2de] text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all hover:scale-105"
          >
            Book a Demo
          </Link>
        </div>

        {/* Micro Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono font-semibold text-slate-500 mb-12">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Custom Scoping &amp; Architecture</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Enterprise Security SLA</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dedicated Engineering Team</span>
          </span>
        </div>

        {/* Studio Showcase Canvas */}
        <div className="w-full">
          <HeroLaunchBackground />
        </div>

      </section>

      {/* ── SECTION 02: WHAT WE BUILD & GROW (SERVICES & INDUSTRY SOLUTIONS) ── */}
      <ServicesSection />

      <SolutionsSection />

      {/* ── SECTION 03: WHY CHOOSE OHO TECH (DIFFERENTIATORS) ── */}
      <WhyChooseSection />

      {/* ── SECTION 04: 5-PHASE DELIVERY ROADMAP ── */}
      <ProcessSection />

      {/* ── SECTION 05: FOUNDER LEADERSHIP & DIRECT QUOTE CTA ── */}
      <section className="max-w-[1536px] w-full mx-auto mb-16 bg-[#0d0d0e] text-white border border-black/20 rounded-[32px] sm:rounded-[44px] p-8 sm:p-16 lg:p-20 shadow-2xl relative overflow-hidden grid-pattern-dark" id="cta">
        
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider mb-4">
                <User className="w-3.5 h-3.5" />
                FOUNDER LEADERSHIP &amp; DIRECT CONSULTATION
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Ready to build your digital platform?
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
                Direct leadership from Founder Jagabandhu Kampa to deliver reliable, high-performance software tailored to your goals.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/get-quote"
                className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl hover:scale-105"
              >
                Get a Quote →
              </Link>
              <Link
                href="/book-demo"
                className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold border border-white/15 transition-all"
              >
                Book a Demo
              </Link>
            </div>
          </div>

          {/* Founder Profile & Quote Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Founder Profile */}
            <div className="lg:col-span-5">
              <div className="bg-[#141416] border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                    Founder &amp; Director
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Direct Leadership</span>
                  </div>
                </div>

                <div className="relative mb-6 text-center flex flex-col items-center">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-500 to-amber-400 p-1 shadow-2xl relative group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-[#0d0d0e] relative overflow-hidden border-2 border-[#0d0d0e]">
                      <NextImage
                        src="/jagabandhu_kampa.jpeg"
                        alt="Jagabandhu Kampa - Founder & Director OHO TECH"
                        width={250}
                        height={250}
                        className="w-full h-full object-cover object-top"
                        priority
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Jagabandhu Kampa
                  </h3>
                  <p className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mt-1">
                    Founder &amp; Director, OHO TECH
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Architecting Custom Software, Business Systems &amp; Digital Growth Strategies
                  </p>
                </div>
              </div>
            </div>

            {/* Founder Quote */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="bg-[#141416] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl relative">
                <Quote className="w-10 h-10 text-emerald-500/30 mb-4" />
                <p className="text-lg sm:text-xl font-medium text-slate-200 leading-relaxed italic">
                  &quot;At OHO TECH, our mission is to deliver straightforward, high-performance software engineering for businesses. We build digital systems that provide real operational clarity across healthcare, education, retail, and enterprise sectors.&quot;
                </p>
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">Jagabandhu Kampa</div>
                    <div className="text-xs font-mono text-slate-400">Founder &amp; Director</div>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                  >
                    <span>Talk to Founder</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  User,
  Quote,
  ShieldCheck,
  Building2,
  Layers,
  Sparkles,
  ExternalLink,
  Cpu,
  Globe2,
  Lock,
  Workflow,
  Headphones,
  ChevronRight,
  Users,
  Handshake,
  Briefcase,
} from 'lucide-react';
import { HeroLaunchBackground } from '@/components/ui/HeroLaunchBackground';
import { ProcessSection } from '@/components/home/ProcessSection';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { StaggerReveal } from '@/components/animation/StaggerReveal';
import { ParallaxElement } from '@/components/animation/ParallaxElement';
import { ScrollFrameSequence } from '@/components/ui/ScrollFrameSequence';
import { Tilt3D } from '@/components/ui/Tilt3D';
import { MetricsTelemetryRibbon } from '@/components/home/MetricsTelemetryRibbon';
import { HorizontalServicesShowcase } from '@/components/home/HorizontalServicesShowcase';
import { TechMarqueeStream } from '@/components/home/TechMarqueeStream';
import { CaseStudiesShowcase } from '@/components/home/CaseStudiesShowcase';
import { ClientTestimonialsCarousel } from '@/components/home/ClientTestimonialsCarousel';
import { EnterpriseFAQSection } from '@/components/home/EnterpriseFAQSection';

export default function WideStudioPage() {

  const whyCapabilities = [
    {
      title: 'Business-Focused Engineering',
      desc: 'Software structured around real operational metrics, efficiency gains, and business growth.',
      icon: Cpu,
    },
    {
      title: 'Modern Full-Stack Technology',
      desc: 'Engineered using Next.js, React, Node.js, TypeScript, and cloud-native architecture.',
      icon: Code2,
    },
    {
      title: 'Scalable Architecture',
      desc: 'Built for high availability, zero downtime, and high-concurrency traffic demands.',
      icon: Layers,
    },
    {
      title: 'Secure Development',
      desc: 'Role-based access control, data encryption, and compliance-ready security standards.',
      icon: Lock,
    },
    {
      title: 'API & System Integration',
      desc: 'Seamless REST/GraphQL integrations linking custom platforms with existing tools.',
      icon: Workflow,
    },
    {
      title: 'Long-Term SLA Support',
      desc: 'Dedicated technical maintenance, continuous updates, and SLA-backed partner support.',
      icon: Headphones,
    },
  ];

  const partnerTypes = [
    {
      title: 'Technology Partners',
      desc: 'Co-develop enterprise SaaS modules, APIs, and cloud infrastructure.',
      icon: Code2,
    },
    {
      title: 'Agencies & Studios',
      desc: 'Extend your service scope with dedicated full-stack software development.',
      icon: Building2,
    },
    {
      title: 'System Integrators',
      desc: 'Deploy OHO TECH ERP & management systems for enterprise clients.',
      icon: Handshake,
    },
    {
      title: 'Channel Partners',
      desc: 'Distribute turnkey software products across regional commercial markets.',
      icon: Users,
    },
  ];

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-8 pt-2 sm:pt-4 px-3 sm:px-4 lg:px-6 selection:bg-[#0d0d0e] selection:text-white overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          01. HERO SECTION (LOCKED & PRESERVED 100% UNCHANGED FOR DESKTOP)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1536px] w-full mx-auto mb-8 sm:mb-10 bg-[#fafafa] border-2 border-slate-300 rounded-[28px] sm:rounded-[44px] px-3.5 sm:px-6 py-6 sm:p-12 lg:p-16 shadow-sm pt-20 sm:pt-32 text-center relative overflow-hidden grid-pattern-light" id="hero">
        
        {/* Category Pill — staggered entrance element 1 */}
        <ScrollReveal yOffset={18} duration={0.6} delay={0.05}>
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#f0f0eb] border border-black/10 text-[#0d0d0e] font-mono text-[9.5px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-5 shadow-xs max-w-full leading-tight">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Software, Digital Solutions &amp; Business Growth</span>
          </div>
        </ScrollReveal>

        {/* Clear Headline — staggered entrance element 2 */}
        <ScrollReveal yOffset={22} duration={0.7} delay={0.15}>
          <h1 className="text-2xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto mb-4 sm:mb-5 text-[#0d0d0e] leading-tight sm:leading-[1.08]">
            We build software, digital platforms and growth solutions for businesses.
          </h1>
        </ScrollReveal>

        {/* Clear Subheadline — staggered entrance element 3 */}
        <ScrollReveal yOffset={18} duration={0.65} delay={0.25}>
          <p className="text-xs sm:text-lg lg:text-xl text-slate-600 font-normal max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Custom software development, mobile applications, web platforms, and digital growth strategies tailored to your operational goals.
          </p>
        </ScrollReveal>

        {/* Dual Primary CTAs — staggered entrance element 4 */}
        <ScrollReveal yOffset={12} duration={0.55} delay={0.35}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full max-w-md sm:max-w-none mx-auto">
            <Link
              id="hero-get-quote"
              href="/get-quote"
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.99] text-center"
            >
              Get a Quote →
            </Link>

            <Link
              id="hero-book-demo"
              href="/book-demo"
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-[#ebebe8] hover:bg-[#e2e2de] text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.99] text-center"
            >
              Book a Demo
            </Link>
          </div>
        </ScrollReveal>

        {/* Full Width Hero Artwork Container — staggered entrance element 5 */}
        <ScrollReveal yOffset={15} duration={0.7} delay={0.4}>
          <Tilt3D maxTilt={6} scale={1.01} className="w-full">
            <HeroLaunchBackground />
          </Tilt3D>
        </ScrollReveal>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          01.5 3D CANVAS TURNTABLE SEQUENCE (SIGNATURE AWARDS MOMENT)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1536px] w-full mx-auto mb-8 sm:mb-12 rounded-[28px] sm:rounded-[44px] overflow-hidden border-2 border-slate-900 shadow-2xl">
        <ScrollFrameSequence
          totalFrames={72}
          folderPath="/sequence/hero"
          filePrefix="frame_"
          fileExtension="webp"
          pinHeight="250%"
        />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          01.55 INFINITE TECH STACK MARQUEE
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1536px] w-full mx-auto mb-8 sm:mb-12 rounded-[24px] sm:rounded-[36px] overflow-hidden shadow-xl">
        <TechMarqueeStream />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          01.6 LIVE METRICS & TELEMETRY RIBBON
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 rounded-[28px] sm:rounded-[44px] overflow-hidden border border-white/10 shadow-2xl">
        <MetricsTelemetryRibbon />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          01.7 HORIZONTAL PINNED SOFTWARE SHOWCASE (UNITED CARRIERS RHYTHM)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 rounded-[28px] sm:rounded-[44px] overflow-hidden border border-white/10 shadow-2xl">
        <HorizontalServicesShowcase />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          01.8 SELECTED ENTERPRISE CASE STUDIES
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 rounded-[28px] sm:rounded-[44px] overflow-hidden border border-white/10 shadow-2xl">
        <CaseStudiesShowcase />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          02. SECTION 1 — 5-PHASE SOFTWARE ENGINEERING ROADMAP
          ───────────────────────────────────────────────────────────── */}
      <ProcessSection />

      {/* ─────────────────────────────────────────────────────────────
          03. SECTION 2 — PARTNER / GROW TOGETHER
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 bg-white border-2 border-slate-300 rounded-[28px] sm:rounded-[44px] p-4 sm:p-12 lg:p-16 shadow-sm relative overflow-hidden" id="partner-with-us">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Left Column — scroll reveal */}
          <ScrollReveal yOffset={30} duration={0.7} className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
              <Handshake className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>PARTNER ECOSYSTEM</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0d0d0e] tracking-tight leading-tight sm:leading-[1.08] mb-3 sm:mb-4">
              Grow together with OHO TECH.
            </h2>

            <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed mb-5 sm:mb-6 max-w-xl">
              We collaborate with agencies, developers, system integrators, and business partners to deliver high-impact digital solutions and expand commercial scope.
            </p>

            <Link
              href="/partner"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md group hover:scale-[1.02] text-center"
            >
              <span>Become a Partner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>

          {/* Right Column: Dark Technical Console Card */}
          <div className="lg:col-span-7 bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[24px] sm:rounded-[36px] p-4 sm:p-8 shadow-2xl relative overflow-hidden grid-pattern-dark">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* 2 x 2 Partner Cards Grid — clean staggered cascade */}
            <StaggerReveal selector=":scope > div" stagger={0.08} yOffset={20} duration={0.6} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 relative z-10">
              {partnerTypes.map((partner) => {
                const IconComponent = partner.icon;
                return (
                  <div 
                    key={partner.title}
                    className="p-4 sm:p-5 rounded-2xl bg-[#141416] border border-white/10 hover:border-emerald-400/60 transition-all group backdrop-blur-xl"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                      {partner.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {partner.desc}
                    </p>
                  </div>
                );
              })}
            </StaggerReveal>
          </div>

        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          04. SECTION 3 — WHY OHO TECHN (COMPACT CAPABILITIES GRID)
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 bg-white border-2 border-slate-300 rounded-[28px] sm:rounded-[44px] p-4 sm:p-12 lg:p-16 shadow-sm relative overflow-hidden" id="why-oho-tech">
        
        {/* Section Header — scroll reveal */}
        <ScrollReveal yOffset={25} duration={0.7}>
          <div className="max-w-3xl mb-6 sm:mb-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>WHY OHO TECHN</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0d0d0e] tracking-tight leading-tight sm:leading-[1.08] mb-2 sm:mb-3">
              Engineered for enterprise scale and long-term value.
            </h2>

            <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed">
              We combine modular software engineering with data-driven strategy to help companies operate efficiently and scale sustainably.
            </p>
          </div>
        </ScrollReveal>

        {/* Inner Dark Console Card */}
        <div className="bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[24px] sm:rounded-[36px] p-4 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden grid-pattern-dark">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* 6 Compact Capability Cards Grid — clean staggered cascade */}
          <StaggerReveal selector=":scope > div" stagger={0.07} yOffset={20} duration={0.55} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 relative z-10">
            {whyCapabilities.map((diff) => {
              const IconComponent = diff.icon;
              return (
                <div
                  key={diff.title}
                  className="p-4 sm:p-5 rounded-2xl bg-[#141416] border border-white/10 hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col justify-between group backdrop-blur-xl"
                >
                  <div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shrink-0">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 sm:mb-2 group-hover:text-emerald-400 transition-colors">
                      {diff.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {diff.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-white/10 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>OHO TECH Core Differentiator</span>
                  </div>
                </div>
              );
            })}
          </StaggerReveal>

          <div className="mt-6 sm:mt-8 pt-4 border-t border-white/10 flex justify-end">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider group"
            >
              <span>Explore Detailed Capabilities &amp; Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          05. SECTION 4 — SERVICES & SOLUTIONS PREVIEW
          ───────────────────────────────────────────────────────────── */}
      <StaggerReveal selector=":scope > div" stagger={0.12} yOffset={25} duration={0.7} className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Core Services Preview */}
        <div className="bg-white border-2 border-slate-300 rounded-[28px] p-5 sm:p-8 flex flex-col justify-between shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
              <Code2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>CORE OFFERINGS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#0d0d0e] tracking-tight mb-2">
              Technology &amp; Digital Growth Services
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 sm:mb-6">
              From web platforms and mobile apps to API engines and growth marketing strategies tailored for operational scaling.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center justify-between px-4 sm:px-5 py-3 rounded-xl bg-[#fafafa] hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-mono font-bold text-[#0d0d0e] hover:text-emerald-700 transition-all group"
          >
            <span>Explore All 15 Core Services</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </div>

        {/* Industry Solutions Preview */}
        <div className="bg-white border-2 border-slate-300 rounded-[28px] p-5 sm:p-8 flex flex-col justify-between shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
              <Layers className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>INDUSTRY VERTICALS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#0d0d0e] tracking-tight mb-2">
              Solutions by Industry
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 sm:mb-6">
              Tailored software ecosystems for Healthcare HMS, Education ERPs, Retail POS, Microfinance, Real Estate, and Fleet operations.
            </p>
          </div>
          <Link
            href="/solutions"
            className="inline-flex items-center justify-between px-4 sm:px-5 py-3 rounded-xl bg-[#fafafa] hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs font-mono font-bold text-[#0d0d0e] hover:text-sky-700 transition-all group"
          >
            <span>View All Industry Solutions</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </div>

      </StaggerReveal>

      {/* ─────────────────────────────────────────────────────────────
          06. SECTION 5 — TURNKEY PRODUCTS FAST ACCESS HUB
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16">
        <ScrollReveal yOffset={30} duration={0.75}>
          <div className="w-full p-5 sm:p-10 lg:p-12 rounded-[28px] sm:rounded-[36px] bg-[#0d0d0e] text-white border border-black shadow-xl relative flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-8 overflow-hidden">
            {/* Parallax decorative glow — moves slightly on scroll */}
            <ParallaxElement yShift={-20} className="absolute top-0 right-0 w-96 h-96 pointer-events-none">
              <div className="w-full h-full bg-emerald-500/10 rounded-full blur-3xl" />
            </ParallaxElement>
            <div className="relative z-10 flex-1 min-w-0 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider mb-3.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>READY-TO-DEPLOY TURNKEY SOFTWARE</span>
              </div>
              <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2.5 sm:mb-3 leading-snug">
                Test Drive Live Software Environments Right Now.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                School Management, Hospital HMS, University ERP, HR &amp; Payroll, Gym POS, Pathology Lab, Real Estate Booking, Dental Clinic, Microfinance CRM &amp; more—complete with live demo URLs and instant access credentials.
              </p>
            </div>
            <div className="relative z-10 shrink-0 w-full md:w-auto pt-2 md:pt-0">
              <Link
                href="/products"
                className="w-full md:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg hover:scale-105 inline-flex items-center justify-center gap-2 text-center whitespace-nowrap"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          05.5 EXECUTIVE TESTIMONIALS & REVIEWS
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 rounded-[28px] sm:rounded-[44px] overflow-hidden border border-white/10 shadow-2xl">
        <ClientTestimonialsCarousel />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          05.6 ENTERPRISE TECHNICAL FAQ
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 rounded-[28px] sm:rounded-[44px] overflow-hidden border border-white/10 shadow-2xl">
        <EnterpriseFAQSection />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          07. SECTION 6 — FOUNDER LEADERSHIP SPOTLIGHT
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 bg-[#0d0d0e] text-white border border-black/20 rounded-[28px] sm:rounded-[44px] p-5 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden grid-pattern-dark" id="founder">
        
        {/* Glow Accents */}
        <ParallaxElement yShift={-15} className="absolute -top-24 -right-24 w-80 h-80 pointer-events-none">
          <div className="w-full h-full bg-emerald-500/10 rounded-full blur-3xl" />
        </ParallaxElement>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          
          {/* Pill + Heading + Subtext — staggered reveal */}
          <ScrollReveal yOffset={25} duration={0.7}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>FOUNDER LEADERSHIP</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-[1.1] mb-2 sm:mb-3">
              Built by Founder Leadership &amp; Technical Precision
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              Direct founder oversight powering custom software architecture, digital systems, and commercial growth.
            </p>
          </ScrollReveal>

          {/* Prominent, Larger Single Founder Profile Card — scroll reveal */}
          <ScrollReveal yOffset={30} duration={0.75} delay={0.15}>
            <div className="max-w-2xl mx-auto bg-[#141416] border border-white/15 rounded-3xl p-5 sm:p-8 shadow-2xl hover:border-emerald-500/50 transition-all text-center sm:text-left flex flex-col sm:flex-row items-center gap-5 sm:gap-6 mb-6 sm:mb-8 group">
              
              {/* Larger Avatar Block */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-500 to-amber-400 p-1 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-full bg-[#0d0d0e] relative overflow-hidden border-2 border-[#0d0d0e]">
                    <NextImage
                      src="/japabandhu_kampa.jpeg"
                      alt="Japabandhu Kampa - Founder & Director OHO TECH"
                      width={200}
                      height={200}
                      className="w-full h-full object-cover object-top"
                      priority
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0d0d0e] border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              {/* Detailed Founder Bio */}
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Founder &amp; Managing Director</span>
                </div>

                <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  Japabandhu Kampa
                </h3>

                <p className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                  Founder &amp; Director, OHO TECH
                </p>

                <p className="text-xs sm:text-sm text-slate-300 mt-2 sm:mt-2.5 leading-relaxed">
                  Architecting Custom Software Applications, Enterprise Business Systems &amp; Digital Growth Strategies tailored for operational scale.
                </p>

                <div className="mt-3 sm:mt-4 pt-3 border-t border-white/10 flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    Direct Founder Oversight
                  </span>
                </div>
              </div>

            </div>
          </ScrollReveal>

          <ScrollReveal yOffset={15} duration={0.6} delay={0.3}>
            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0d0d0e] font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.99] group text-center"
            >
              <span>Meet the Team &amp; Read Our Full Story</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </ScrollReveal>

        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          08. SECTION 7 — FINAL CALL TO ACTION
          ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1536px] w-full mx-auto bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[28px] sm:rounded-[44px] p-5 sm:p-14 lg:p-16 text-center shadow-2xl relative overflow-hidden grid-pattern-dark" id="final-cta">
        <ScrollReveal yOffset={24} duration={0.7}>
          <div className="relative z-10 max-w-2xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3.5 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>READY TO BUILD?</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2 sm:mb-3 leading-tight">
              Have a software idea or need a ready solution?
            </h2>

            <p className="text-xs sm:text-base text-slate-300 mb-6 sm:mb-8 leading-relaxed">
              Tell us what you need. We&apos;ll help you choose the right path.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
              <Link
                href="/get-quote"
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-white hover:bg-emerald-400 text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.99] text-center"
              >
                Get a Quote →
              </Link>

              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.99] text-center"
              >
                Explore Products
              </Link>

              <Link
                href="/book-demo"
                className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 border border-white/20 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.99] text-center"
              >
                Book a Demo
              </Link>
            </div>

            <p className="text-[10px] sm:text-[11px] font-mono text-slate-500 mt-8 sm:mt-10">
              © {new Date().getFullYear()} OHO TECH. Software Engineering &amp; Turnkey Digital Solutions.
            </p>

          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}

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
} from 'lucide-react';
import { ArchitectureDiagram } from '@/components/home/ArchitectureDiagram';
import { HeroLaunchBackground } from '@/components/ui/HeroLaunchBackground';
import { StrategicPillarsSection } from '@/components/home/StrategicPillarsSection';
import { SolutionsSection } from '@/components/solutions/SolutionsSection';
import { ServicesSection } from '@/components/services/ServicesSection';
import { ServiceStoryTimeline } from '@/components/story/ServiceStoryTimeline';
import { ProcessSection } from '@/components/home/ProcessSection';
import { WhyChooseSection } from '@/components/home/WhyChooseSection';
import { PartnerSection } from '@/components/home/PartnerSection';
import { FinalCTASection } from '@/components/story/FinalCTASection';

export default function WideStudioPage() {
  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-6 pt-4 px-2 sm:px-4 lg:px-6 selection:bg-[#0d0d0e] selection:text-white">
      
      {/* ── 01. HERO SECTION ── */}
      <section className="max-w-[1536px] w-full mx-auto mb-10 bg-[#fafafa] border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-6 sm:p-12 lg:p-16 shadow-sm pt-24 sm:pt-32 text-center relative overflow-hidden grid-pattern-light" id="hero">
        
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0f0eb] border border-black/10 text-[#0d0d0e] font-mono text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Software, Digital Solutions &amp; Business Growth
        </div>

        {/* Clear Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto mb-6 text-[#0d0d0e] leading-[1.06]">
          We build software, digital platforms and growth solutions for businesses.
        </h1>

        {/* Clear Subheadline */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal max-w-2xl mx-auto mb-8 leading-relaxed">
          Custom software development, mobile applications, web platforms, and digital growth strategies tailored to your operational goals.
        </p>

        {/* Dual Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
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

        {/* Full Width Hero Artwork Container */}
        <div className="w-full">
          <HeroLaunchBackground />
        </div>

      </section>

      {/* ── ABOUT OHO TECH & STRATEGIC DIRECTION ── */}
      <section className="max-w-[1536px] w-full mx-auto mb-16 bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm" id="about-intro">
        
        {/* Section Header */}
        <div className="max-w-4xl mb-10 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            ABOUT OHO TECH &amp; STRATEGIC DIRECTION 🏗️
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-5">
            Engineering precision meets data-driven growth.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            OHO TECH is an enterprise technology studio delivering custom software applications, digital platforms, and customer acquisition strategies tailored to your operational business goals.
          </p>
        </div>

        {/* High Visibility Architecture Diagram */}
        <ArchitectureDiagram />

        {/* Interactive Scrollable Strategic Direction Pillars */}
        <StrategicPillarsSection />

        {/* Bottom Directional Bar */}
        <div className="bg-[#fafafa] border-2 border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono font-bold text-slate-700">
            <span className="flex items-center gap-2 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Goal-Oriented Software
            </span>
            <span className="flex items-center gap-2 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Clean Code Architecture
            </span>
            <span className="flex items-center gap-2 text-amber-600">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Direct Founder Leadership
            </span>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider group shrink-0"
          >
            <span>Learn More About Us</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </section>

      {/* ── 03. CORE OFFERINGS (CORE SERVICES) ── */}
      <ServicesSection />

      {/* ── 04. SOLUTIONS BY INDUSTRY ── */}
      <SolutionsSection />

      {/* ── 05. FEATURED TECHNOLOGY SOLUTIONS WE BUILD ── */}
      <section className="max-w-[1536px] w-full mx-auto mb-16 bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm" id="featured-solutions">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-200/80">
          <div>
            <div className="inline-block text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest mb-3">
              TECHNOLOGY SOLUTIONS WE BUILD
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] tracking-tight">
              Enterprise Solution Concepts
            </h2>
          </div>
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider group"
          >
            <span>View All Solution Concepts</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Clean Solution Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="p-8 rounded-3xl bg-[#fafafa] border-2 border-slate-200 hover:border-slate-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider mb-2">Healthcare</div>
              <h3 className="text-xl font-bold text-[#0d0d0e] mb-3 group-hover:text-emerald-600 transition-colors">Hospital Management &amp; EMR System</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Centralized hospital administration, outpatient/inpatient management, lab reporting, and pharmacy billing.
              </p>
            </div>
            <Link href="/solutions/healthcare" className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 inline-flex items-center gap-1">
              <span>View Healthcare Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-[#fafafa] border-2 border-slate-200 hover:border-slate-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-2">Education</div>
              <h3 className="text-xl font-bold text-[#0d0d0e] mb-3 group-hover:text-amber-600 transition-colors">Education &amp; Campus Management System</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Multi-campus university management, student admissions, online examination, and automated fee collection.
              </p>
            </div>
            <Link href="/solutions/education" className="text-xs font-bold text-slate-800 group-hover:text-amber-600 inline-flex items-center gap-1">
              <span>View Education Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-[#fafafa] border-2 border-slate-200 hover:border-slate-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider mb-2">Retail &amp; Commerce</div>
              <h3 className="text-xl font-bold text-[#0d0d0e] mb-3 group-hover:text-emerald-600 transition-colors">Retail POS &amp; Inventory Management System</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                High-speed retail billing, multi-store stock tracking, supplier reordering, and automated GST invoicing.
              </p>
            </div>
            <Link href="/solutions/retail-ecommerce" className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 inline-flex items-center gap-1">
              <span>View Retail Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-[#fafafa] border-2 border-slate-200 hover:border-slate-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider mb-2">Finance &amp; Banking</div>
              <h3 className="text-xl font-bold text-[#0d0d0e] mb-3 group-hover:text-emerald-600 transition-colors">NBFC &amp; Loan Management System</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Loan origination workflows, borrower verification, automated EMI recovery schedules, and audit reporting.
              </p>
            </div>
            <Link href="/solutions/finance-nbfc" className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 inline-flex items-center gap-1">
              <span>View Finance Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-[#fafafa] border-2 border-slate-200 hover:border-slate-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-2">Fitness &amp; Wellness</div>
              <h3 className="text-xl font-bold text-[#0d0d0e] mb-3 group-hover:text-amber-600 transition-colors">Fitness &amp; Club Management System</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Membership scheduling, biometric turnstile integrations, trainer assignments, and automated billing.
              </p>
            </div>
            <Link href="/solutions/salon-spa-fitness" className="text-xs font-bold text-slate-800 group-hover:text-amber-600 inline-flex items-center gap-1">
              <span>View Fitness Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-[#fafafa] border-2 border-slate-200 hover:border-slate-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider mb-2">Logistics</div>
              <h3 className="text-xl font-bold text-[#0d0d0e] mb-3 group-hover:text-emerald-600 transition-colors">Warehouse &amp; Dispatch Logistics System</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Consignment dispatch tracking, fleet operations, warehouse barcode scanning, and delivery updates.
              </p>
            </div>
            <Link href="/solutions/logistics-transport" className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 inline-flex items-center gap-1">
              <span>View Logistics Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </section>

      {/* ── 06. SERVICE CAPABILITIES ROADMAP TIMELINE ── */}
      <ServiceStoryTimeline />

      {/* ── 07. HOW WE WORK (5-STEP PROCESS) ── */}
      <ProcessSection />

      {/* ── 08. WHY OHO TECH (DIFFERENTIATORS) ── */}
      <WhyChooseSection />

      {/* ── 09. PARTNER WITH US ── */}
      <PartnerSection />

      {/* ── 10. ABOUT US & FOUNDER LEADERSHIP ── */}
      <section className="max-w-[1536px] w-full mx-auto mb-16 bg-[#0d0d0e] text-white border border-black/20 rounded-[32px] sm:rounded-[44px] p-8 sm:p-16 lg:p-20 shadow-2xl relative overflow-hidden grid-pattern-dark" id="founder">
        
        {/* Glow Accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider mb-4">
                <User className="w-3.5 h-3.5" />
                Leadership &amp; Engineering Philosophy
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                About Us &amp; Founder Leadership
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
                Technical excellence and clear communication to deliver reliable software solutions across industry verticals.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider group"
            >
              <span>Explore Full Story</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Main Founder Card & Bio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Founder Profile Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#141416] border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                
                {/* Top Founder Label */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                    Founder &amp; Director
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Direct Leadership</span>
                  </div>
                </div>

                {/* Avatar / Portrait Block */}
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

                {/* Founder Info */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Jagabandhu Kampa
                  </h3>
                  <p className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mt-1">
                    Founder &amp; Director
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Architecting Custom Software, Business Systems &amp; Digital Growth Strategies
                  </p>
                </div>

                {/* Contact Action Buttons */}
                <div className="flex items-center justify-center gap-3">
                  <Link
                    href="/contact"
                    className="flex-1 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0d0d0e] font-extrabold text-xs text-center uppercase tracking-wider transition-all shadow-md"
                  >
                    Contact Founder
                  </Link>
                  <Link
                    href="/about"
                    className="py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs text-center font-bold border border-white/10 transition-all"
                  >
                    About Us
                  </Link>
                </div>

              </div>
            </div>

            {/* Right: Founder Quote */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              
              <div className="bg-[#141416] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl relative">
                <Quote className="w-10 h-10 text-emerald-500/30 mb-4" />
                <p className="text-lg sm:text-xl font-medium text-slate-200 leading-relaxed italic">&quot;At OHO TECH, our mission is to deliver straightforward, high-performance software engineering for businesses. Under Jagabandhu Kampa&apos;s leadership, we build digital systems that provide real operational clarity across healthcare, education, retail, and enterprise sectors.&quot;</p>
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">Jagabandhu Kampa</div>
                    <div className="text-xs font-mono text-slate-400">Founder &amp; Director, OHO TECH</div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" /> Direct Leadership
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ── FULL 2-COLUMN EXPANDED SPOTLIGHT: HIMANSU NAYAK (FULL-STACK DEVELOPER) ── */}
          <div className="mt-16 pt-16 border-t border-white/10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider mb-6">
              <User className="w-3.5 h-3.5" />
              Core Engineering Team Spotlight
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Profile Card */}
              <div className="lg:col-span-5">
                <div className="bg-[#141416] border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all text-center">
                  
                  {/* Top Status Badges */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                      Full-Stack Developer
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>MCA Graduate</span>
                    </div>
                  </div>

                  {/* Avatar Portrait Block */}
                  <div className="relative mb-6 text-center flex flex-col items-center">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-500 to-amber-400 p-1 shadow-2xl relative group-hover:scale-105 transition-transform duration-300">
                      <div className="w-full h-full rounded-full bg-[#0d0d0e] relative overflow-hidden border-2 border-[#0d0d0e]">
                        <NextImage
                          src="/himansu_nayak.png"
                          alt="Himansu Nayak - Full-Stack Developer OHO TECH"
                          width={250}
                          height={250}
                          className="w-full h-full object-cover object-top"
                          priority
                        />
                      </div>
                    </div>
                  </div>

                  {/* Info Block */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Himansu Nayak
                    </h3>
                    <p className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mt-1">
                      Full-Stack Developer (MCA)
                    </p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Architecting Scalable Web Applications, API Engines &amp; Responsive Digital Products
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-3">
                    <Link
                      href="/contact"
                      className="flex-1 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0d0d0e] font-extrabold text-xs text-center uppercase tracking-wider transition-all shadow-md"
                    >
                      Connect Developer
                    </Link>
                    <Link
                      href="/services"
                      className="py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs text-center font-bold border border-white/10 transition-all"
                    >
                      View Stack
                    </Link>
                  </div>

                </div>
              </div>

              {/* Right Column: Detailed Narrative & Engineering Highlights */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="bg-[#141416] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl relative">
                  <Quote className="w-10 h-10 text-emerald-500/30 mb-4" />
                  <p className="text-lg sm:text-xl font-medium text-slate-200 leading-relaxed italic mb-6">
                    &quot;Building clean, scalable full-stack applications with exceptional user experiences and robust backend performance across OHO TECH products.&quot;
                  </p>
                  
                  <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    <p>
                      <strong className="text-white font-semibold">Himansu Nayak</strong> holds a <strong className="text-emerald-300 font-semibold">Master of Computer Applications (MCA)</strong> degree and serves as a core Full-Stack Developer at OHO TECH, leading end-to-end web product development.
                    </p>
                    <p>
                      He specializes in modern full-stack technologies including React, Next.js, TypeScript, Tailwind CSS, Node.js, and database engineering. Himansu drives the design and implementation of responsive user interfaces, high-performance customer portals, and enterprise software solutions.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" /> MCA Degree Qualified
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400">
                      <Code2 className="w-3.5 h-3.5" /> Full-Stack Core Lead
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* ── 10. FINAL CALL TO ACTION ── */}
      <FinalCTASection />

    </div>
  );
}

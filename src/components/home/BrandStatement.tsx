'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Package, 
  Code2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Smartphone,
  Server,
  Layers,
  Key,
  ExternalLink
} from 'lucide-react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function BrandStatement() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const cardLeftRef = React.useRef<HTMLDivElement>(null);
  const cardRightRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Coordinated entrance for the dual business engine cards
      if (cardLeftRef.current && cardRightRef.current) {
        gsap.fromTo(
          [cardLeftRef.current, cardRightRef.current],
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="brand-statement"
      aria-label="OHO TECH Business Model Overview"
      className="w-full bg-[#0a0a0d] text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-white/5"
    >
      {/* Background Subtle Radial Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TWO WAYS TO WORK WITH OHO TECH</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase mb-4 sm:mb-6">
            Software Products
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              &amp; Custom Engineering.
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Whether you need ready-to-deploy commercial software platforms or bespoke digital product development, OHO TECH delivers production-grade systems engineered for enterprise scale.
          </p>
        </div>

        {/* Dual Business Engines Grid: 2 Distinct Paths */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Engine A: Software Products (Buy Software) */}
          <div 
            ref={cardLeftRef}
            className="rounded-3xl bg-[#111216] border border-white/10 hover:border-sky-500/40 p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-sky-500/20 transition-all" />

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 font-mono text-xs">
                <span className="text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-4 h-4" /> ENGINE 01 // READY TO DEPLOY
                </span>
                <span className="text-slate-400 text-[10px] uppercase">
                  DIRECT LICENSING
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-3 group-hover:text-sky-300 transition-colors">
                Commercial Software Products
              </h3>

              <p className="text-sm text-slate-300 font-normal leading-relaxed mb-6">
                Purchase pre-engineered, battle-tested software systems directly through our website. Deploy on your own cloud VPS or on-premises with single-tenant data isolation and perpetual or subscription licensing.
              </p>

              {/* 4 Real Product Categories */}
              <div className="space-y-2.5 mb-8 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Hospital EMR &amp; Clinical Management Systems</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Multi-Campus University &amp; School ERP Platforms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Retail POS &amp; Omnichannel Inventory Suites</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Double-Entry Financial Accounting &amp; GST Ledgers</span>
                </div>
              </div>

              {/* Trust Badge Specs Strip */}
              <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-black/40 border border-white/5 font-mono mb-8 text-center text-xs">
                <div>
                  <div className="text-xs font-bold text-white">100%</div>
                  <div className="text-[9px] text-slate-400 uppercase mt-0.5">Isolated Tenant</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-sky-400">Node-Locked</div>
                  <div className="text-[9px] text-slate-400 uppercase mt-0.5">Key Licensing</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Free Setup</div>
                  <div className="text-[9px] text-slate-400 uppercase mt-0.5">Cloud Deploy</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/products"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>EXPLORE ALL SOFTWARE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all text-center"
              >
                View Licensing &amp; Plans
              </Link>
            </div>
          </div>

          {/* Engine B: Custom Software Engineering (Build With Us) */}
          <div 
            ref={cardRightRef}
            className="rounded-3xl bg-[#111216] border border-white/10 hover:border-emerald-500/40 p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 font-mono text-xs">
                <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" /> ENGINE 02 // CUSTOM SYSTEMS
                </span>
                <span className="text-slate-400 text-[10px] uppercase">
                  BESPOKE STUDIO
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-3 group-hover:text-emerald-300 transition-colors">
                Software &amp; Digital Engineering
              </h3>

              <p className="text-sm text-slate-300 font-normal leading-relaxed mb-6">
                Commission OHO TECH to architect, design, and develop bespoke digital systems from scratch. We build high-throughput web applications, native Android/iOS mobile ecosystems, APIs, and AI workflow automations.
              </p>

              {/* 4 Core Service Deliverables */}
              <div className="space-y-2.5 mb-8 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom Enterprise Platforms &amp; Operational Dashboards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Native Android (Kotlin) &amp; iOS (Swift) Mobile Engineering</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>High-Performance Web Applications (React 19 &amp; Next.js 16)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cloud DevOps, Automated CI/CD &amp; 24/7 Enterprise SLAs</span>
                </div>
              </div>

              {/* Trust Badge Specs Strip */}
              <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-black/40 border border-white/5 font-mono mb-8 text-center text-xs">
                <div>
                  <div className="text-xs font-bold text-white">100%</div>
                  <div className="text-[9px] text-slate-400 uppercase mt-0.5">Code Ownership</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-400">Zero Lock-In</div>
                  <div className="text-[9px] text-slate-400 uppercase mt-0.5">Open Standards</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">99.99%</div>
                  <div className="text-[9px] text-slate-400 uppercase mt-0.5">Enterprise SLA</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>START A PROJECT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all text-center"
              >
                Explore 7 Core Services
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default BrandStatement;

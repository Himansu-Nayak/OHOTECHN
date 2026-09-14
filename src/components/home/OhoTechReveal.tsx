'use client';

import * as React from 'react';
import NextImage from 'next/image';
import { Sparkles, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const BRAND_PILLARS = [
  {
    code: '01 / ARCHITECTURE',
    label: 'Enterprise Scale',
    desc: 'Zero-downtime distributed systems & modern microservices.',
    icon: Cpu,
  },
  {
    code: '02 / SOVEREIGNTY',
    label: '100% Code Ownership',
    desc: 'Complete IP transfer with zero vendor lock-in or licensing trap.',
    icon: ShieldCheck,
  },
  {
    code: '03 / VELOCITY',
    label: 'High-Impact Delivery',
    desc: 'Sub-millisecond execution powering commercial acceleration.',
    icon: Sparkles,
  },
];

export function OhoTechReveal() {
  const containerRef = React.useRef<HTMLElement>(null);
  const wordmarkRef = React.useRef<HTMLDivElement>(null);
  const logoCardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    const wordmark = wordmarkRef.current;
    const logoCard = logoCardRef.current;
    if (!container || !wordmark) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Scroll-driven scale and opacity reveal
      gsap.fromTo(
        wordmark,
        { scale: 0.92, opacity: 0.7, y: 25 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            end: 'center 50%',
            scrub: 0.6,
          },
        }
      );

      if (logoCard) {
        gsap.fromTo(
          logoCard,
          { y: 30, opacity: 0.8 },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 75%',
              end: 'center 45%',
              scrub: 0.6,
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      id="reveal" 
      aria-label="OHO TECH Brand Signature"
      className="w-full bg-[#050608] text-white pt-24 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none border-t border-white/5"
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(16,185,129,0.14),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[170px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        
        {/* Brand Chapter Sub-header */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-8 sm:mb-12">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SIGNATURE DIGITAL ENGINEERING AGENCY</span>
        </div>

        {/* Official Brand Emblem Badge Card */}
        <div 
          ref={logoCardRef}
          className="mb-8 sm:mb-12 group"
        >
          <div className="bg-white/95 hover:bg-white p-4 sm:p-6 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.25)] border-2 border-white/30 inline-flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <NextImage
              src="/OHO_TECH_LOGO.png"
              alt="OHO TECH Brand Logo"
              width={260}
              height={80}
              priority
              quality={100}
              unoptimized
              className="h-10 sm:h-14 lg:h-16 w-auto object-contain"
            />
          </div>
        </div>

        {/* Signature Massive Brand Wordmark */}
        <div 
          ref={wordmarkRef}
          className="w-full my-4 sm:my-6 overflow-hidden"
        >
          <h1 className="text-[clamp(3.75rem,15vw,17.5rem)] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-500 leading-[0.88] uppercase select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
            OHO TECH
          </h1>
        </div>

        {/* Narrative Thesis */}
        <p className="font-mono text-xs sm:text-sm lg:text-base text-slate-300 uppercase tracking-[0.2em] max-w-2xl mx-auto mt-4 mb-12 sm:mb-16 leading-relaxed">
          STRATEGY • DESIGN • ENGINEERING • ENTERPRISE SCALE
        </p>

        {/* 3 Brand Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl mb-12 sm:mb-16 text-left">
          {BRAND_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-[#0e1014]/90 border border-white/10 hover:border-emerald-500/40 hover:bg-[#12141a] transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    {pillar.code}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
                  {pillar.label}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer Destination Connector Pill */}
        <div className="inline-flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span>DESTINATION // CORPORATE ECOSYSTEM &amp; SERVICES DIRECTORY</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 rotate-90" />
        </div>

      </div>

      {/* Seamless bottom transition gradient into Footer.tsx (#07080c) */}
      <div className="absolute bottom-0 inset-x-0 h-28 sm:h-36 bg-gradient-to-t from-[#07080c] to-transparent pointer-events-none z-20" />
    </section>
  );
}

export default OhoTechReveal;

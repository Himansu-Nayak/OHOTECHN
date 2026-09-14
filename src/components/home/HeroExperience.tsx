'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Globe,
  Terminal,
  Compass
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TELEMETRY_PILLS = [
  { label: 'SYSTEM', val: 'DISTRIBUTED MULTI-TENANT', accent: 'text-emerald-400', border: 'border-emerald-500/30' },
  { label: 'STACK', val: 'NEXT.JS 16 • REACT 19 • EDGE', accent: 'text-cyan-400', border: 'border-cyan-500/30' },
  { label: 'LATENCY', val: '< 18ms EDGE ROUTE', accent: 'text-emerald-400', border: 'border-emerald-500/30' },
  { label: 'STATUS', val: 'PRODUCTION ACTIVE 99.99%', accent: 'text-amber-400', border: 'border-amber-500/30' },
];

export function HeroExperience() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineLine1Ref = useRef<HTMLDivElement>(null);
  const headlineLine2Ref = useRef<HTMLDivElement>(null);
  const headlineLine3Ref = useRef<HTMLDivElement>(null);
  const editorialTextRef = useRef<HTMLDivElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);
  const telemetryGridRef = useRef<HTMLDivElement>(null);

  const [activeTelemetry, setActiveTelemetry] = React.useState<number>(0);

  // Cycle telemetry highlights
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveTelemetry((prev) => (prev + 1) % TELEMETRY_PILLS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // GSAP Entrance & Scroll-Driven Kinetic Typography
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // Context for easy cleanup
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Reduced-motion: Keep static at rest
        gsap.set([
          headlineLine1Ref.current,
          headlineLine2Ref.current,
          headlineLine3Ref.current,
          editorialTextRef.current,
          ctaGroupRef.current,
          previewCardRef.current,
          telemetryGridRef.current,
        ], { opacity: 1, y: 0, x: 0 });
        return;
      }

      // 1. Subtle Entrance Stagger Timeline
      const entranceTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      entranceTl
        .fromTo(
          [headlineLine1Ref.current, headlineLine2Ref.current, headlineLine3Ref.current],
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.12, clearProps: 'transform' }
        )
        .fromTo(
          editorialTextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.45'
        )
        .fromTo(
          ctaGroupRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          previewCardRef.current,
          { opacity: 0, y: 30, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          telemetryGridRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        );

      // 2. Scroll-Driven Typography Kinetic Movement (14islands Inspired)
      if (!isMobile && containerRef.current) {
        // Line 1 drifts subtly left
        if (headlineLine1Ref.current) {
          gsap.to(headlineLine1Ref.current, {
            x: -36,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            }
          });
        }

        // Line 2 drifts subtly right
        if (headlineLine2Ref.current) {
          gsap.to(headlineLine2Ref.current, {
            x: 36,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            }
          });
        }

        // Preview Card subtle parallax depth
        if (previewCardRef.current) {
          gsap.to(previewCardRef.current, {
            y: 48,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
            }
          });
        }
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="hero" 
      aria-label="OHO TECH Hero Experience"
      className="relative w-full min-h-[92vh] lg:min-h-[98vh] flex flex-col justify-between bg-[#0a0a0b] text-white px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 overflow-hidden border-b border-white/5"
    >
      {/* Editorial Ambient Glow & Depth Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(16,185,129,0.14),transparent_75%)] pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Grid Lines Overlay for Editorial Precision */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-between flex-1">
        
        {/* Top Editorial Index & Studio Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-12 pt-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
              01 // STUDIO INDEX
            </span>
            <span className="hidden sm:inline font-mono text-xs text-slate-400 uppercase tracking-widest">
              OHO TECH • DIGITAL ENGINEERING &amp; DESIGN
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="uppercase tracking-wider">SYSTEM ACTIVE • GLOBAL EDGE</span>
          </div>
        </div>

        {/* Main Editorial Hero Core */}
        <div className="my-auto py-4 sm:py-8">
          
          {/* Studio Brand Stamp */}
          <div className="font-mono text-xs sm:text-sm font-bold text-emerald-400 tracking-[0.3em] uppercase mb-4 sm:mb-6">
            OHO TECH STUDIO
          </div>

          {/* Oversized Kinetic Headline (14islands Inspired Display Typography) */}
          <div className="space-y-1 sm:space-y-2 mb-8 sm:mb-12 select-none">
            
            {/* Line 01: DIGITAL TECHNOLOGY */}
            <div 
              ref={headlineLine1Ref}
              className="will-change-transform text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[-0.04em] text-white leading-[0.88] uppercase"
            >
              DIGITAL TECHNOLOGY
            </div>

            {/* Line 02: DESIGN × ENGINEERING */}
            <div 
              ref={headlineLine2Ref}
              className="will-change-transform text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 leading-[0.88] uppercase flex flex-wrap items-center gap-x-3 sm:gap-x-6"
            >
              <span>DESIGN</span>
              <span className="text-white/40 font-mono text-3xl sm:text-5xl lg:text-7xl font-light">×</span>
              <span>ENGINEERING</span>
            </div>

            {/* Line 03: INNOVATION. */}
            <div 
              ref={headlineLine3Ref}
              className="will-change-transform text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[-0.04em] text-white leading-[0.88] uppercase"
            >
              INNOVATION.
            </div>

          </div>

          {/* Editorial Grid: Sub-copy, CTAs, and Visual Architecture Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            
            {/* Left: Editorial Statement & Actions */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              
              <div ref={editorialTextRef} className="mb-8">
                <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
                  We are a multidisciplinary digital engineering and design studio. We architect and build resilient enterprise software, high-concurrency cloud systems, and automated growth platforms for high-growth organizations.
                </p>
              </div>

              {/* Action Buttons */}
              <div ref={ctaGroupRef} className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full max-w-md sm:max-w-none">
                <Link
                  id="hero-get-quote"
                  href="/get-quote"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2 group"
                >
                  <span>Get a Quote</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  id="hero-book-demo"
                  href="/book-demo"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center backdrop-blur-md"
                >
                  Book a Demo
                </Link>
              </div>

            </div>

            {/* Right: Tactile Glassmorphic Architecture Visual Card */}
            <div className="lg:col-span-5">
              <div 
                ref={previewCardRef}
                className="w-full rounded-2xl sm:rounded-3xl bg-[#141416]/95 border border-white/15 p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
              >
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 font-mono text-[11px]">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SYSTEM TOPOLOGY SPEC</span>
                  </div>
                  <span className="text-emerald-400 font-bold">100% SOVEREIGN</span>
                </div>

                {/* Embedded High-Resolution Graphic / Architecture Asset */}
                <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden mb-4 border border-white/10 bg-black/60">
                  <Image
                    src="/images/3d-software-dev.jpg"
                    alt="OHO TECH Engineering Architecture"
                    fill
                    className="object-cover object-center opacity-85 hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-transparent opacity-90" />
                  
                  {/* Floating Overlay Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-white/90 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10">
                    <span className="text-emerald-400 font-bold">NODE: CLOUD RUNTIME</span>
                    <span>15K REQ/S THROUGHPUT</span>
                  </div>
                </div>

                {/* Sub-spec list */}
                <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-400">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[9px] uppercase text-slate-400">ISOLATION</div>
                    <div className="text-white font-bold truncate">CONTAINER MESH</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[9px] uppercase text-slate-400">GOVERNANCE</div>
                    <div className="text-emerald-400 font-bold truncate">CRYPTOGRAPHIC RBAC</div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Bottom Editorial Telemetry Strip: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
        <div 
          ref={telemetryGridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-8 sm:pt-12 border-t border-white/10"
        >
          {TELEMETRY_PILLS.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 sm:p-4 rounded-xl bg-[#121316]/90 border transition-all duration-300 ${
                activeTelemetry === idx 
                  ? `${item.border} bg-white/[0.04] shadow-lg shadow-emerald-500/5` 
                  : 'border-white/10'
              }`}
            >
              <div className="font-mono text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                {item.label}
              </div>
              <div className={`font-mono text-xs sm:text-sm font-bold ${item.accent} truncate`}>
                {item.val}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

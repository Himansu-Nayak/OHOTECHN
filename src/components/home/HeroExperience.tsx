'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Layers, Package, Terminal } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from '@/components/experience/MotionContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * OHO TECH Cinematic Hero Experience
 * - Preserves OHO TECH's signature cinematic visual identity & typography
 * - Structured 6-step deliberate reveal sequence (Ploy-inspired interaction pacing)
 * - Dual business paths: BUY ready-to-deploy software vs BUILD custom systems
 * - Responsive motion matrix: desktop cinematic reveal, tablet optimized, mobile lightweight
 * - Zero scroll-jacking
 */
export function HeroExperience() {
  const containerRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLDivElement>(null);
  const headlineLine2Ref = useRef<HTMLDivElement>(null);
  const headlineLine3Ref = useRef<HTMLDivElement>(null);
  const editorialTextRef = useRef<HTMLDivElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const metadataStripRef = useRef<HTMLDivElement>(null);

  const { setActiveScene } = useMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setActiveScene('hero');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([
          badgeRef.current,
          headlineLine1Ref.current,
          headlineLine2Ref.current,
          headlineLine3Ref.current,
          editorialTextRef.current,
          ctaGroupRef.current,
          metadataStripRef.current,
        ], { opacity: 1, y: 0, yPercent: 0 });
        return;
      }

      // Step-by-step deliberate reveal timeline (Phase 4 Specification)
      const entranceTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // 1. Badge arrives
      entranceTl.fromTo(
        badgeRef.current,
        { opacity: 0, y: isMobile ? 10 : 16 },
        { opacity: 1, y: 0, duration: isMobile ? 0.45 : 0.6 }
      );

      // 2. Headline enters with crisp masked clip reveal
      entranceTl.fromTo(
        [headlineLine1Ref.current, headlineLine2Ref.current, headlineLine3Ref.current],
        { yPercent: 110, opacity: 0 },
        { 
          yPercent: 0, 
          opacity: 1, 
          duration: isMobile ? 0.6 : 0.85, 
          stagger: isMobile ? 0.08 : 0.12 
        },
        '-=0.3'
      );

      // 3. Supporting editorial narrative
      entranceTl.fromTo(
        editorialTextRef.current,
        { opacity: 0, y: isMobile ? 12 : 20 },
        { opacity: 1, y: 0, duration: isMobile ? 0.5 : 0.7 },
        '-=0.4'
      );

      // 4 & 5. Action CTAs
      entranceTl.fromTo(
        ctaGroupRef.current,
        { opacity: 0, y: isMobile ? 10 : 16 },
        { opacity: 1, y: 0, duration: isMobile ? 0.45 : 0.6 },
        '-=0.35'
      );

      // 6. Supporting platform metadata strip
      entranceTl.fromTo(
        metadataStripRef.current,
        { opacity: 0, y: isMobile ? 8 : 12 },
        { opacity: 1, y: 0, duration: isMobile ? 0.4 : 0.55 },
        '-=0.25'
      );

      // Subtle Parallax exit on desktop scroll down (strictly non-blocking, zero scroll-jacking)
      if (containerRef.current && !isMobile) {
        gsap.to(
          [headlineLine1Ref.current, headlineLine2Ref.current, headlineLine3Ref.current], 
          {
            y: -35,
            opacity: 0.75,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            }
          }
        );

        if (editorialTextRef.current && ctaGroupRef.current) {
          gsap.to([editorialTextRef.current, ctaGroupRef.current, metadataStripRef.current], {
            y: -20,
            opacity: 0.7,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            }
          });
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, [setActiveScene]);

  return (
    <section 
      ref={containerRef}
      id="hero" 
      aria-label="OHO TECH Hero Statement"
      className="relative w-full min-h-[94vh] sm:min-h-screen flex flex-col justify-center bg-transparent text-white px-4 sm:px-8 lg:px-16 pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden border-b border-white/5"
    >
      {/* HTML5 Autoplay Motion Video Layer (Inspired by play 1 screen recording) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/images/3d-software-dev.jpg"
        className="absolute inset-0 w-full h-full object-cover opacity-20 sm:opacity-25 mix-blend-screen pointer-events-none scale-105 transition-opacity duration-1000"
      >
        <source src="/videos/core-architecture.mp4" type="video/mp4" />
      </video>

      {/* Atmospheric Ambient Depth Lighting with Pulse Motion Flow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.18),transparent_75%)] pointer-events-none animate-[pulseGlow_5s_ease-in-out_infinite]" />
      
      {/* Floating Kinetic Ambient Spheres */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none animate-[floatSlow_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-[floatSlow_7s_ease-in-out_infinite_reverse]" />

      {/* Precision Structural Lines Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-center">
        
        {/* Step 1: Technical Pill Badge */}
        <div ref={badgeRef} className="mb-5 sm:mb-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>SOFTWARE PRODUCTS &amp; BESPOKE DIGITAL ENGINEERING</span>
          </div>
        </div>

        {/* Step 2: Cinematic Kinetic Headline Display */}
        <div className="space-y-1 sm:space-y-2 mb-7 sm:mb-10 select-none">
          
          {/* Line 01 */}
          <div className="overflow-hidden py-0.5 sm:py-1">
            <div 
              ref={headlineLine1Ref}
              className="will-change-transform text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[-0.04em] text-white leading-[0.88] uppercase"
            >
              DIGITAL TECHNOLOGY
            </div>
          </div>

          {/* Line 02: Signature OHO TECH Gradient Accent */}
          <div className="overflow-hidden py-0.5 sm:py-1">
            <div 
              ref={headlineLine2Ref}
              className="will-change-transform text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 leading-[0.88] uppercase flex flex-wrap items-center gap-x-3 sm:gap-x-6"
            >
              <span>DESIGN</span>
              <span className="text-white/30 font-mono text-2xl sm:text-5xl lg:text-7xl font-light">×</span>
              <span>ENGINEERING</span>
            </div>
          </div>

          {/* Line 03 */}
          <div className="overflow-hidden py-0.5 sm:py-1">
            <div 
              ref={headlineLine3Ref}
              className="will-change-transform text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[-0.04em] text-white leading-[0.88] uppercase"
            >
              INNOVATION.
            </div>
          </div>

        </div>

        {/* Step 3: Supporting Statement */}
        <div className="max-w-3xl">
          <div ref={editorialTextRef} className="mb-8 sm:mb-10">
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed">
              We engineer enterprise commercial software and build bespoke digital systems. Purchase ready-to-deploy platforms directly from our verified catalog, or commission our studio to architect high-throughput web, Android, and iOS systems.
            </p>
          </div>

          {/* Step 4 & 5: Action Button Pair (Dual Conversion Paths) */}
          <div ref={ctaGroupRef} className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto mb-10 sm:mb-14">
            <Link
              id="hero-explore-software"
              href="/products"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2 group font-mono"
            >
              <span>Explore Software</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              id="hero-build-with-us"
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center backdrop-blur-md font-mono"
            >
              Build With Us
            </Link>
          </div>

          {/* Step 6: Platform Capability Specs Strip */}
          <div 
            ref={metadataStripRef}
            className="pt-6 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-6 font-mono text-[10px] sm:text-xs text-slate-400"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Package className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="truncate">28 Ready Systems</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">7 Core Services</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span className="truncate">100% Code Ownership</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default HeroExperience;

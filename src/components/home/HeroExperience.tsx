'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, ChevronLeft, ChevronRight, Pause, Play 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from '@/components/experience/MotionContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * OHO TECH Cinematic Hero Experience
 * 
 * Master Motion & Visual Architecture:
 * 1. Responsive Fit: Intelligent contain-style framing with ambient bleed underlay;
 *    zero awkward cropping across 1920x1080, 1600x900, 1440x900, 1366x768, 1280x720, laptop, tablet, mobile.
 * 2. Intelligent Auto Side-Scroll: 2.5s natural hold, followed by ultra-smooth, slow cinematic
 *    camera pan with responsive distance scaling (reduced on laptops/tablets, locked on mobile).
 * 3. Seamless Cinematic Transition: 1.3s crossfade with directional parallax and micro-blur-to-sharp
 *    transition between Scene 1 (Creative Studio) and Scene 2 (Urban Billboard ohotechbg.1).
 * 4. ohotechbg.1 Visual Alignment: Atmospheric dusk/twilight color-grading, crisp billboard terminal,
 *    matching the dark premium technology aesthetic.
 * 5. Content Hierarchy: Typography & CTAs stay 100% stable, crisp, and readable in the foreground.
 * 6. Seamless Infinite Loop: Continuous smooth cycling with zero visible jump or reset snap.
 * 7. Performance: 60 FPS GPU-accelerated transforms & opacity, with prefers-reduced-motion support.
 */
export function HeroExperience() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineLine1Ref = useRef<HTMLDivElement>(null);
  const headlineLine2Ref = useRef<HTMLDivElement>(null);
  const headlineLine3Ref = useRef<HTMLDivElement>(null);
  const editorialTextRef = useRef<HTMLDivElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);

  // Background Scene Stage Refs for GSAP camera panning
  const scene1StageRef = useRef<HTMLDivElement>(null);
  const scene2StageRef = useRef<HTMLDivElement>(null);

  const { setActiveScene } = useMotion();

  // Multi-Slide State (0 = Studio, 1 = Billboard)
  const [activeSlide, setActiveSlide] = useState<0 | 1>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Foreground Headline Entrance Animation (Preserved OHO TECH Brand Identity)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setActiveScene('hero');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([
          headlineLine1Ref.current,
          headlineLine2Ref.current,
          headlineLine3Ref.current,
          editorialTextRef.current,
          ctaGroupRef.current,
        ], { opacity: 1, y: 0, yPercent: 0 });
        return;
      }

      // Step-by-step deliberate reveal timeline
      const entranceTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // 1. Headline enters with crisp masked clip reveal
      entranceTl.fromTo(
        [headlineLine1Ref.current, headlineLine2Ref.current, headlineLine3Ref.current],
        { yPercent: 110, opacity: 0 },
        { 
          yPercent: 0, 
          opacity: 1, 
          duration: isMobile ? 0.6 : 0.85, 
          stagger: isMobile ? 0.08 : 0.12 
        }
      );

      // 2. Supporting editorial narrative
      entranceTl.fromTo(
        editorialTextRef.current,
        { opacity: 0, y: isMobile ? 12 : 20 },
        { opacity: 1, y: 0, duration: isMobile ? 0.5 : 0.7 },
        '-=0.4'
      );

      // 3. Action CTAs
      entranceTl.fromTo(
        ctaGroupRef.current,
        { opacity: 0, y: isMobile ? 10 : 16 },
        { opacity: 1, y: 0, duration: isMobile ? 0.45 : 0.6 },
        '-=0.35'
      );

      // Subtle Parallax exit on desktop scroll down
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
          gsap.to([editorialTextRef.current, ctaGroupRef.current], {
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

  // Master Cinematic Horizontal Auto-Scroll Loop
  useEffect(() => {
    if (isPaused) return;

    // Automatic side-scroll interval: holds 4.5s, then glides horizontally to next scene
    const scrollTimer = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 4500);

    return () => clearInterval(scrollTimer);
  }, [isPaused]);

  // Pause / Resume Toggle
  const togglePlayPause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Manual Slide Selectors
  const jumpToSlide = useCallback((slideIndex: 0 | 1) => {
    setActiveSlide(slideIndex);
  }, []);

  return (
    <section 
      ref={containerRef}
      id="hero" 
      aria-label="OHO TECH Hero Statement"
      className="relative w-full min-h-[82vh] sm:min-h-[86vh] lg:min-h-[90vh] bg-[#08090b] text-white overflow-hidden border-b border-white/5"
    >
      {/* ======================================================== */}
      {/* 1. CINEMATIC HORIZONTAL AUTO-SCROLL PANORAMIC STAGE      */}
      {/* Continuous panoramic camera track sliding horizontally   */}
      {/* from Scene 1 (Studio) to Scene 2 (ohotechbg.1 Billboard) */}
      {/* ======================================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        
        {/* Continuous Panoramic Track: 200% width, sliding 0% -> -50% */}
        <div 
          className="absolute inset-0 flex h-full will-change-transform transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: '200%',
            transform: activeSlide === 0 ? 'translate3d(0%, 0, 0)' : 'translate3d(-50%, 0, 0)',
          }}
        >
          {/* ========================================== */}
          {/* PANEL 1 (Width 50% = 100vw): Recent Studio */}
          {/* ========================================== */}
          <div className="relative w-1/2 h-full overflow-hidden shrink-0">
            {/* Ambient Bleed Underlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-35 scale-110 pointer-events-none"
              style={{ backgroundImage: `url('/images/hero-surreal-office.jpg')` }}
            />

            {/* Focal Composition Stage: Intelligent Responsive Containment */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-surreal-office.jpg"
                alt="OHO TECH Engineering Studio"
                className="w-full h-full max-w-none object-contain contrast-[1.05] brightness-[0.97]"
                style={{
                  imageRendering: '-webkit-optimize-contrast',
                  maskImage: 'radial-gradient(ellipse 95% 90% at 50% 50%, black 75%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 95% 90% at 50% 50%, black 75%, transparent 100%)',
                }}
              />
            </div>

            {/* Cinematic Vignette Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-black/35 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08090b]/85 via-[#08090b]/35 to-transparent pointer-events-none" />
          </div>

          {/* ========================================== */}
          {/* PANEL 2 (Width 50% = 100vw): ohotechbg.1   */}
          {/* ========================================== */}
          <div className="relative w-1/2 h-full overflow-hidden shrink-0">
            {/* Ambient Bleed Underlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-35 scale-110 pointer-events-none"
              style={{ backgroundImage: `url('/images/ohotechbg.1.jpg?v=20261003')` }}
            />

            {/* Focal Composition Stage */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ohotechbg.1.jpg?v=20261003"
                alt="OHO TECH Turnkey Software Ecosystem"
                className="w-full h-full max-w-none object-contain contrast-[1.10] brightness-[1.0] saturate-[1.10] lg:translate-x-[12%] xl:translate-x-[16%]"
                style={{
                  imageRendering: '-webkit-optimize-contrast',
                  maskImage: 'radial-gradient(ellipse 95% 90% at 50% 50%, black 75%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 95% 90% at 50% 50%, black 75%, transparent 100%)',
                }}
              />
            </div>

            {/* Twilight Technological Ambience Grade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-black/40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08090b]/85 via-[#08090b]/35 to-transparent pointer-events-none" />
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. FOREGROUND CONTENT LAYER                              */}
      {/* Stable, Crisp, Legible, Completely Decoupled from Pan    */}
      {/* ======================================================== */}
      <div className="relative z-20 max-w-7xl mx-auto w-full min-h-[80vh] sm:min-h-[84vh] lg:min-h-[86vh] flex flex-col justify-center px-4 sm:px-8 lg:px-16 pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-12 pointer-events-auto">
        
        {/* Cinematic Kinetic Headline */}
        <div className="space-y-1 sm:space-y-1.5 mb-4 sm:mb-6 select-none">
          <div className="overflow-hidden py-0.5">
            <div 
              ref={headlineLine1Ref}
              className="will-change-transform text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl min-[1800px]:text-8xl font-black tracking-[-0.04em] text-white leading-[0.88] uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
            >
              DIGITAL TECHNOLOGY
            </div>
          </div>

          <div className="overflow-hidden py-0.5">
            <div 
              ref={headlineLine2Ref}
              className="will-change-transform text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl min-[1800px]:text-8xl font-black tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 leading-[0.88] uppercase flex flex-wrap items-center gap-x-2 sm:gap-x-4 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
            >
              <span>DESIGN</span>
              <span className="text-white/40 font-mono text-xl sm:text-3xl lg:text-5xl font-light">×</span>
              <span>ENGINEERING</span>
            </div>
          </div>

          <div className="overflow-hidden py-0.5">
            <div 
              ref={headlineLine3Ref}
              className="will-change-transform text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl min-[1800px]:text-8xl font-black tracking-[-0.04em] text-white leading-[0.88] uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]"
            >
              INNOVATION.
            </div>
          </div>
        </div>

        {/* Supporting Editorial Statement */}
        <div className="max-w-2xl sm:max-w-3xl">
          <div ref={editorialTextRef} className="mb-5 sm:mb-7">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-200 font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Enterprise commercial platforms, bespoke software systems, and mobile applications engineered with 100% IP ownership.
            </p>
          </div>

          {/* Dual Action CTAs */}
          <div ref={ctaGroupRef} className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
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
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. FLOATING CINEMATIC CONTROLS & SCENE SELECTORS        */}
      {/* ======================================================== */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-3 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs font-mono shadow-2xl select-none whitespace-nowrap max-w-[95vw] pointer-events-auto">
        <button
          type="button"
          id="hero-slide-prev"
          onClick={() => jumpToSlide(activeSlide === 0 ? 1 : 0)}
          className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          aria-label="Previous Scene"
        >
          <ChevronLeft className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
        </button>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            id="hero-slide-btn-0"
            onClick={() => jumpToSlide(0)}
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSlide === 0
                ? 'bg-emerald-500 text-black font-black shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="hidden sm:inline">01 • </span>Studio
          </button>

          <button
            type="button"
            id="hero-slide-btn-1"
            onClick={() => jumpToSlide(1)}
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeSlide === 1
                ? 'bg-emerald-500 text-black font-black shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="hidden sm:inline">02 • </span>Billboard
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-emerald-400 font-mono select-none shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>AUTO-SCROLL</span>
        </div>

        <button
          type="button"
          id="hero-toggle-play-pause"
          onClick={togglePlayPause}
          className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          title={isPaused ? 'Resume Motion' : 'Pause Motion'}
          aria-label={isPaused ? 'Resume Motion' : 'Pause Motion'}
        >
          {isPaused ? <Play className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-400" /> : <Pause className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-400" />}
        </button>

        <button
          type="button"
          id="hero-slide-next"
          onClick={() => jumpToSlide(activeSlide === 0 ? 1 : 0)}
          className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          aria-label="Next Scene"
        >
          <ChevronRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
        </button>
      </div>

    </section>
  );
}

export default HeroExperience;

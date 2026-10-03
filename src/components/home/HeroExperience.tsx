'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from '@/components/experience/MotionContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * OHO TECH Cinematic Hero Experience
 * 
 * Precision Architecture:
 * 1. Edge-to-Edge Panoramic Canvas: 100% viewport coverage across all resolutions
 *    (1920x1080, 1600x900, 1440x900, 1366x768, 1280x720, laptops, tablets, mobile)
 *    with zero black side bars, zero empty gaps, and zero awkward letterboxing.
 * 2. Ultra-High-Definition Imagery: Native 4K/4.5K photography rendered via Next.js
 *    optimized Image component with quality={100}, priority preloading, and object-cover fit.
 * 3. Seamless Automatic Side-Scroll: Continuous, autonomous horizontal glide between
 *    Scene 1 (Studio) and Scene 2 (Billboard) with smooth cubic-bezier easing.
 * 4. Zero Unwanted Marker UI: Internalized animation state with no user-facing controls,
 *    dots, labels, or arrows obscuring the composition.
 * 5. Preserved Typography & Brand Identity: Masked headline entrance, stable foreground,
 *    and responsive action CTAs.
 */
export function HeroExperience() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineLine1Ref = useRef<HTMLDivElement>(null);
  const headlineLine2Ref = useRef<HTMLDivElement>(null);
  const headlineLine3Ref = useRef<HTMLDivElement>(null);
  const editorialTextRef = useRef<HTMLDivElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);

  const { setActiveScene } = useMotion();

  // Autonomous Multi-Scene Transition State (0 = Studio, 1 = Billboard)
  const [activeSlide, setActiveSlide] = useState<0 | 1>(0);

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

  // Master Autonomous Horizontal Auto-Scroll Loop (Internal State, Zero UI Controls)
  useEffect(() => {
    // 5-second hold per scene, then smooth panoramic glide
    const scrollTimer = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);

    return () => clearInterval(scrollTimer);
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
      {/* Seamless edge-to-edge coverage, zero side bars           */}
      {/* ======================================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        
        {/* Continuous Panoramic Track: 200% width, sliding 0% -> -50% */}
        <div 
          className="absolute inset-0 flex h-full will-change-transform transition-transform duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: '200%',
            transform: activeSlide === 0 ? 'translate3d(0%, 0, 0)' : 'translate3d(-50%, 0, 0)',
          }}
        >
          {/* ========================================== */}
          {/* SCENE 1 (Width 50% = 100vw): Studio 4K     */}
          {/* ========================================== */}
          <div className="relative w-1/2 h-full overflow-hidden shrink-0">
            {/* Native 4K Studio Image with Edge-to-Edge Coverage */}
            <Image
              src="/images/hero-surreal-office.jpg"
              alt="OHO TECH Engineering Studio"
              fill
              priority
              quality={100}
              sizes="100vw"
              className="object-cover object-center contrast-[1.04] brightness-[0.98]"
            />

            {/* Cinematic Gradient Overlays for High-Contrast Headline Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent pointer-events-none" />
          </div>

          {/* ========================================== */}
          {/* SCENE 2 (Width 50% = 100vw): Billboard 4.5K*/}
          {/* ========================================== */}
          <div className="relative w-1/2 h-full overflow-hidden shrink-0">
            {/* High-Definition 4.5K Urban Billboard with Edge-to-Edge Coverage */}
            <Image
              src="/images/ohotechbg.1.jpg"
              alt="OHO TECH Turnkey Software Ecosystem"
              fill
              priority
              quality={100}
              sizes="100vw"
              className="object-cover object-center contrast-[1.06] brightness-[1.0]"
            />

            {/* Cinematic Gradient Overlays for High-Contrast Headline Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-black/35 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent pointer-events-none" />
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

    </section>
  );
}

export default HeroExperience;

'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotion } from '@/components/experience/MotionContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * HeroExperience (14islands Restraint Architecture)
 * 
 * - Full-bleed visual backdrop powered by the global Three.js WebGL canvas.
 * - Single focal opening statement: Oversized kinetic display headline revealed line-by-line.
 * - Zero dashboard chips, zero telemetry pills, zero preview cards competing for attention.
 */
export function HeroExperience() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineLine1Ref = useRef<HTMLDivElement>(null);
  const headlineLine2Ref = useRef<HTMLDivElement>(null);
  const headlineLine3Ref = useRef<HTMLDivElement>(null);
  const editorialTextRef = useRef<HTMLDivElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);

  const { setActiveScene } = useMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;

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
        ], { opacity: 1, y: 0, x: 0 });
        return;
      }

      // 1. Line-by-Line Masked Entrance Reveal (14islands Signature Opening)
      const entranceTl = gsap.timeline({
        defaults: { ease: 'power4.out' }
      });

      entranceTl
        .fromTo(
          [headlineLine1Ref.current, headlineLine2Ref.current, headlineLine3Ref.current],
          { yPercent: 115, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.12 }
        )
        .fromTo(
          [editorialTextRef.current, ctaGroupRef.current],
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' },
          '-=0.5'
        );

      // 2. Subtle Parallax Exit on Scroll Down
      if (containerRef.current && !isMobile) {
        gsap.to([headlineLine1Ref.current, headlineLine2Ref.current, headlineLine3Ref.current], {
          y: -40,
          opacity: 0.7,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
            onEnter: () => setActiveScene('hero'),
            onEnterBack: () => setActiveScene('hero'),
          }
        });

        if (editorialTextRef.current && ctaGroupRef.current) {
          gsap.to([editorialTextRef.current, ctaGroupRef.current], {
            y: -25,
            opacity: 0.6,
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

    return () => ctx.revert();
  }, [setActiveScene]);

  return (
    <section 
      ref={containerRef}
      id="hero" 
      aria-label="OHO TECH Hero Statement"
      className="relative w-full min-h-screen flex flex-col justify-center bg-transparent text-white px-5 sm:px-8 lg:px-16 py-24 sm:py-32 overflow-hidden border-b border-white/5"
    >
      {/* Editorial Ambient Depth Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.12),transparent_75%)] pointer-events-none" />
      
      {/* Precision Structural Lines */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-center">
        
        {/* Monolithic Kinetic Headline (14islands Oversized Display Typography) */}
        <div className="space-y-1 sm:space-y-2 mb-8 sm:mb-12 select-none">
          
          {/* Line 01 */}
          <div className="overflow-hidden py-1">
            <div 
              ref={headlineLine1Ref}
              className="will-change-transform text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[-0.04em] text-white leading-[0.88] uppercase"
            >
              DIGITAL TECHNOLOGY
            </div>
          </div>

          {/* Line 02 */}
          <div className="overflow-hidden py-1">
            <div 
              ref={headlineLine2Ref}
              className="will-change-transform text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 leading-[0.88] uppercase flex flex-wrap items-center gap-x-3 sm:gap-x-6"
            >
              <span>DESIGN</span>
              <span className="text-white/30 font-mono text-3xl sm:text-5xl lg:text-7xl font-light">×</span>
              <span>ENGINEERING</span>
            </div>
          </div>

          {/* Line 03 */}
          <div className="overflow-hidden py-1">
            <div 
              ref={headlineLine3Ref}
              className="will-change-transform text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-[-0.04em] text-white leading-[0.88] uppercase"
            >
              INNOVATION.
            </div>
          </div>

        </div>

        {/* Editorial Sub-copy & Action Row */}
        <div className="max-w-3xl">
          <div ref={editorialTextRef} className="mb-8 sm:mb-10">
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed">
              We are a multidisciplinary digital engineering and design studio. We architect and build resilient enterprise software, high-concurrency cloud systems, and automated growth platforms for high-growth organizations.
            </p>
          </div>

          {/* Action Button Pair */}
          <div ref={ctaGroupRef} className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
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

      </div>
    </section>
  );
}

export default HeroExperience;

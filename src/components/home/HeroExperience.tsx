'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { useMotion } from '@/components/experience/MotionContext';

/**
 * Modern Hero Experience inspired by Ploy.ai & modern SaaS aesthetics:
 * - Clean editorial sans typography (natural title case, tight tracking)
 * - Lightweight fluid entrance without scroll-hijacking
 * - Clear dual business paths (Explore Software vs Build With Us)
 */
export function HeroExperience() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const editorialTextRef = useRef<HTMLDivElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);

  const { setActiveScene } = useMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setActiveScene('hero');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Fast, lightweight entrance animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
      gsap.fromTo(
        editorialTextRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power2.out' }
      );
      gsap.fromTo(
        ctaGroupRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.25, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [setActiveScene]);

  return (
    <section 
      ref={containerRef}
      id="hero" 
      aria-label="OHO TECH Overview"
      className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center bg-transparent text-white px-5 sm:px-8 lg:px-16 pt-32 pb-20 sm:py-36 overflow-hidden border-b border-white/5"
    >
      {/* Subtle modern radial ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none" />
      
      {/* Precision 1px grid */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col justify-center">
        
        {/* Modern Pill Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-xs font-semibold tracking-wide w-fit">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Software Products &amp; Custom Digital Engineering</span>
        </div>

        {/* Clean Modern Editorial Sans Headline */}
        <div className="max-w-4xl mb-6">
          <h1 
            ref={headlineRef}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.035em] text-white leading-[1.04]"
          >
            Digital systems, designed &amp; engineered{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              for production scale.
            </span>
          </h1>
        </div>

        {/* Editorial Sub-copy & Action Row */}
        <div className="max-w-2xl">
          <div ref={editorialTextRef} className="mb-8 sm:mb-10">
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              We build enterprise software products and engineer custom digital platforms. Buy ready-to-deploy software directly from our catalog, or partner with us to design and develop bespoke web, Android, and iOS systems.
            </p>
          </div>

          {/* Action Button Pair: Buy Software vs Build With Us */}
          <div ref={ctaGroupRef} className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            <Link
              id="hero-explore-software"
              href="/products"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-lg hover:shadow-emerald-500/20 text-center flex items-center justify-center gap-2 group"
            >
              <span>Explore Software</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              id="hero-build-with-us"
              href="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 text-center"
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

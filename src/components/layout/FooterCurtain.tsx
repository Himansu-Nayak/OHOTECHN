'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * FooterCurtain
 *
 * Signature Awwwards-style giant wordmark curtain reveal.
 * Sits at the footer baseline, revealing a massive architectural "OHO TECH"
 * typography with ambient emerald studio glow and interactive links as user
 * scrolls to the bottom of the page.
 */
export function FooterCurtain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set([text, badgeRef.current], { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        text,
        {
          yPercent: 40,
          opacity: 0.2,
          scale: 0.94,
          letterSpacing: '-0.06em',
        },
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          letterSpacing: '-0.04em',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 95%',
            end: 'bottom bottom',
            scrub: 1,
          },
        }
      );

      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              end: 'bottom 95%',
              scrub: 1,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#07080c] pt-16 pb-8 border-t border-white/5 select-none"
    >
      {/* Ambient Emerald Studio Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[250px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-10 lg:px-16 relative z-10">
        {/* Top Floating Tagline / Action Row */}
        <div
          ref={badgeRef}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-12 border-b border-white/10 pb-6 text-xs text-slate-400 font-mono"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white font-bold tracking-wider uppercase">
              Bespoke Software • Enterprise Growth
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/get-quote"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-bold group"
            >
              <span>Start A Project</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/contact"
              className="hover:text-white transition-colors"
            >
              Contact Engineering
            </Link>
          </div>
        </div>

        {/* Massive Curtain Wordmark */}
        <div className="overflow-hidden py-4 text-center">
          <h2
            ref={textRef}
            className="text-[14vw] sm:text-[15vw] lg:text-[16vw] font-black leading-[0.82] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600/30 uppercase will-change-transform"
          >
            OHO TECH
          </h2>
        </div>
      </div>
    </div>
  );
}

export default FooterCurtain;

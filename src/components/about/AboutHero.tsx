'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Layers, 
  Users, 
  CheckCircle2,
  Activity
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STATS = [
  { label: 'Years of Technical Innovation', value: '5+', detail: 'Proven track record of engineering delivery' },
  { label: 'Enterprise Systems Engineered', value: '100+', detail: 'Production EMR, ERP, POS & cloud platforms' },
  { label: 'Specialized Industry Verticals', value: '13', detail: 'Tailored domain architectures across sectors' },
  { label: 'Audience & Commercial Reach', value: '670M+', detail: 'High-impact organic & performance campaigns' },
];

export function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion()) return;
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Headline masked line reveal
      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll('.hero-line');
        gsap.fromTo(
          lines,
          { opacity: 0, yPercent: 110 },
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.95,
            stagger: 0.12,
            ease: 'power4.out',
            delay: 0.1,
          }
        );
      }

      // 2. Image container parallax
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.08, opacity: 0.8 },
          {
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 85%',
              end: 'bottom 40%',
              scrub: 0.8,
            },
          }
        );
      }

      // 3. Stats stagger
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={containerRef} className="relative mb-16 sm:mb-24">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/3 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-8 sm:mb-10 font-mono text-xs text-slate-400 flex items-center gap-2">
        <Link href="/" className="hover:text-emerald-400 transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-emerald-400 font-bold">ABOUT OHO TECH</span>
      </nav>

      {/* Category Capsule */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-6">
        <Building2 className="w-3.5 h-3.5" />
        <span>ABOUT OHO TECH • COMPANY &amp; LEADERSHIP</span>
      </div>

      {/* Main Headline */}
      <h1 
        ref={headlineRef}
        className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight leading-[1.02] uppercase mb-8"
      >
        <span className="block overflow-hidden py-1">
          <span className="hero-line block will-change-transform">Engineering Digital Sovereignty.</span>
        </span>
        <span className="block overflow-hidden py-1">
          <span className="hero-line block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 will-change-transform">
            Built For Lasting Impact.
          </span>
        </span>
      </h1>

      {/* Lead Narrative */}
      <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-4xl mb-12">
        Under the leadership of Founder &amp; Director Japabandhu Kampa, OHO TECH engineers high-performance enterprise software platforms, bespoke digital architectures, and omnichannel growth engines with 100% code sovereignty and zero vendor lock-in.
      </p>

      {/* Visual Editorial Showcase Hero Photo */}
      <div className="relative w-full h-72 sm:h-96 md:h-[460px] rounded-3xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl mb-14 group">
        <div ref={imageRef} className="relative w-full h-full">
          <Image
            src="/hero_workspace_editorial.jpg"
            alt="OHO TECH Engineering Studio & Technology Lab"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover object-center opacity-85 transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-black/30 to-transparent" />

        {/* Floating Watermark Badges */}
        <div className="absolute top-5 left-5 flex items-center gap-2 font-mono text-xs text-white px-3.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 shadow-xl">
          <span className="text-emerald-400 font-bold">OHO TECH</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-200">STRATEGY × DESIGN × TECHNOLOGY</span>
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-slate-300 px-4 py-2.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/15 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white tracking-wider">FOUNDED ON TECHNICAL EXCELLENCE</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            BHUBANESWAR // HYBRID DISTRIBUTED ENGINEERING
          </div>
        </div>
      </div>

      {/* 4 Verified Stats Grid */}
      <div 
        ref={statsRef}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-[#121316]/90 border border-white/10 shadow-2xl font-mono"
      >
        {STATS.map((stat, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center flex flex-col justify-between">
            <div className="text-3xl sm:text-5xl font-black text-emerald-400 mb-1">
              {stat.value}
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div className="text-[10px] text-slate-400 font-sans leading-tight">
                {stat.detail}
              </div>
            </div>
          </div>
        ))}
      </div>

    </header>
  );
}

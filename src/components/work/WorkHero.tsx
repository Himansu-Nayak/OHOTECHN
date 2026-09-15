'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  FolderGit2, 
  ShieldCheck, 
  Server, 
  Zap, 
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WorkProject } from '@/config/work';
import { isReducedMotion } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface WorkHeroProps {
  project: WorkProject;
}

export function WorkHero({ project }: WorkHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion()) return;
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Headline masked entrance
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, yPercent: 110 },
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.95,
            ease: 'power4.out',
            delay: 0.1,
          }
        );
      }

      // 2. Parallax and image scale reveal on scroll
      if (imageInnerRef.current && imageWrapperRef.current) {
        gsap.fromTo(
          imageInnerRef.current,
          { scale: 1.12, opacity: 0.8 },
          {
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: imageWrapperRef.current,
              start: 'top 85%',
              end: 'bottom 40%',
              scrub: 0.8,
            },
          }
        );

        gsap.fromTo(
          imageWrapperRef.current,
          { y: -15 },
          {
            y: 25,
            ease: 'none',
            scrollTrigger: {
              trigger: imageWrapperRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.0,
            },
          }
        );
      }

      // 3. Stagger specs strip
      if (specsRef.current) {
        gsap.fromTo(
          specsRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.3,
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={containerRef} className="relative mb-16 sm:mb-24">
      {/* Ambient Radial Accent Aura */}
      <div 
        className="absolute -top-10 -right-10 sm:-right-20 w-80 sm:w-[650px] h-80 sm:h-[650px] rounded-full blur-[180px] pointer-events-none opacity-25 transition-opacity"
        style={{ backgroundColor: project.accent }}
      />
      <div className="absolute top-1/2 left-0 w-72 sm:w-[480px] h-72 sm:h-[480px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Navigation Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 sm:mb-10 font-mono text-xs text-slate-400 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-emerald-400 transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/work" className="hover:text-emerald-400 transition-colors">SELECTED WORK</Link>
        <span>/</span>
        <span className="text-emerald-400 font-bold truncate max-w-xs">{project.title}</span>
      </nav>

      {/* Back to Work Archive Link */}
      <div className="mb-8">
        <Link 
          href="/work" 
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO ALL CASE STUDIES</span>
        </Link>
      </div>

      {/* Hero Badge Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>CASE STUDY // PROJECT {project.number}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
            {project.industry}
          </span>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300">
            {project.clientArchetype}
          </span>
        </div>
      </div>

      {/* Category Subtitle */}
      <div className="text-xs sm:text-sm font-mono font-bold text-slate-400 tracking-[0.2em] uppercase mb-3">
        {project.category}
      </div>

      {/* Main Headline with Typography Movement */}
      <div className="overflow-hidden py-1 mb-6">
        <h1 
          ref={headlineRef}
          className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.06] uppercase will-change-transform"
        >
          {project.title}
        </h1>
      </div>

      {/* Executive Summary */}
      <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-4xl mb-10">
        {project.summary}
      </p>

      {/* Hero Image Showcase with Scale Reveal & Parallax */}
      <div 
        ref={imageWrapperRef}
        className="relative w-full h-72 sm:h-96 md:h-[440px] lg:h-[500px] rounded-3xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl mb-12 group"
      >
        <div ref={imageInnerRef} className="relative w-full h-full">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
            className="object-cover object-center opacity-90 transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-transparent to-black/30" />

        {/* Floating Spec Watermark Badges */}
        <div className="absolute top-5 left-5 flex items-center gap-2 font-mono text-[11px] text-white px-3.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 shadow-xl">
          <span className="text-emerald-400 font-bold">SYSTEM // 0{project.number}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-200">{project.subtitle}</span>
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-slate-300 px-4 py-2.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/15 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white tracking-wider">STATUS: PRODUCTION ARCHITECTURE</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            {project.quickSpecs.deploymentTopology}
          </div>
        </div>
      </div>

      {/* Quick Specs 4-Column Strip */}
      <div 
        ref={specsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6 rounded-3xl bg-[#111216]/90 border border-white/10 shadow-xl font-mono text-xs"
      >
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase mb-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>OPERATIONAL DOMAIN</span>
          </div>
          <div className="text-white font-bold leading-snug">{project.quickSpecs.domain}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase mb-1">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>TOPOLOGY &amp; SYNC</span>
          </div>
          <div className="text-white font-bold leading-snug">{project.quickSpecs.deploymentTopology}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>SECURITY STANDARDS</span>
          </div>
          <div className="text-white font-bold leading-snug">{project.quickSpecs.securityStandard}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>TARGET THROUGHPUT</span>
          </div>
          <div className="text-emerald-400 font-bold leading-snug">{project.quickSpecs.targetThroughput}</div>
        </div>
      </div>

    </header>
  );
}

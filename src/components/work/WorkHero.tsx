'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ArrowUpRight,
  Layers, 
  Server, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WorkProject } from '@/config/work';
import { isReducedMotion } from '@/lib/motion';
import { TextReveal } from '@/components/ui/TextReveal';

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

  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion()) return;
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Headline masked entrance
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            delay: 0.1,
          }
        );
      }

      // 2. Parallax scale reveal on scroll
      if (imageInnerRef.current && imageWrapperRef.current) {
        gsap.fromTo(
          imageInnerRef.current,
          { scale: 1.08 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: imageWrapperRef.current,
              start: 'top 85%',
              end: 'bottom 20%',
              scrub: 0.8,
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={containerRef} className="relative mb-16 sm:mb-24 pt-4 sm:pt-8">
      {/* Top Breadcrumb & Archive Return */}
      <div className="flex items-center justify-between gap-4 mb-8 sm:mb-12 pb-6 border-b border-white/10 font-mono text-xs text-slate-400">
        <Link 
          href="/work" 
          className="inline-flex items-center gap-2 hover:text-white transition-colors group text-slate-300 font-semibold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO WORK</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold uppercase tracking-wider">
            PROJECT {project.number}
          </span>
          <span className="text-white/20">/</span>
          <span className="text-slate-300 uppercase tracking-widest hidden sm:inline-block">
            {project.industry}
          </span>
        </div>
      </div>

      {/* Editorial Meta Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 font-mono text-xs border-b border-white/10 pb-8">
        <div>
          <div className="text-slate-500 uppercase tracking-widest mb-1 text-[10px]">INDUSTRY</div>
          <div className="text-white font-bold">{project.industry}</div>
        </div>
        <div>
          <div className="text-slate-500 uppercase tracking-widest mb-1 text-[10px]">CLIENT TYPE</div>
          <div className="text-white font-bold">{project.clientArchetype}</div>
        </div>
        <div>
          <div className="text-slate-500 uppercase tracking-widest mb-1 text-[10px]">DOMAIN</div>
          <div className="text-white font-bold">{project.quickSpecs.domain}</div>
        </div>
        <div>
          <div className="text-slate-500 uppercase tracking-widest mb-1 text-[10px]">ARCHITECTURE</div>
          <div className="text-emerald-400 font-bold">{project.quickSpecs.deploymentTopology}</div>
        </div>
      </div>

      {/* Main Massive Editorial Title with Kinetic Word Reveal */}
      <div className="mb-10 sm:mb-14">
        <TextReveal 
          as="h1"
          splitType="words"
          immediate={true}
          stagger={0.045}
          duration={0.95}
          className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight leading-[0.98] uppercase will-change-transform"
        >
          {project.title}
        </TextReveal>
      </div>

      {/* Full-Bleed Media Frame (Flat 1px Hairline Border) */}
      <div 
        ref={imageWrapperRef}
        className="relative w-full aspect-[16/9] overflow-hidden border border-white/10 bg-[#111216] mb-12 group"
      >
        <div ref={imageInnerRef} className="relative w-full h-full">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1440px) 95vw, 1440px"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Minimal Hairline Corner Tag */}
        <div className="absolute top-4 left-4 font-mono text-[10px] text-white px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-white/10">
          <span className="text-emerald-400 font-bold">SYSTEM // 0{project.number}</span>
          <span className="mx-2 text-white/30">•</span>
          <span className="text-slate-300 uppercase tracking-wider">{project.subtitle}</span>
        </div>

        <div className="absolute bottom-4 right-4 font-mono text-[10px] text-slate-300 px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-white/10 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold uppercase tracking-wider">PRODUCTION VERIFIED</span>
        </div>
      </div>

      {/* Editorial Split Row: Statement & Narrative Lead */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start pt-6 pb-12 border-b border-white/10">
        <div className="lg:col-span-7">
          <TextReveal
            as="h2"
            splitType="words"
            triggerStart="top 85%"
            stagger={0.02}
            duration={0.8}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug"
          >
            {project.summary}
          </TextReveal>
        </div>
        <div className="lg:col-span-5 space-y-5 text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
          <p>{project.introduction.overview}</p>
          <p className="text-slate-400 text-xs sm:text-sm">{project.introduction.context}</p>
          <div className="pt-3">
            <a 
              href="#solution"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
            >
              <span>EXPLORE ARCHITECTURE BLUEPRINT</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
export default WorkHero;

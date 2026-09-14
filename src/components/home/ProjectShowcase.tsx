'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, CheckCircle2, Layers, Terminal, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ProjectData {
  id: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  keyDeliverables: string[];
  technologies: string[];
  image: string;
  href: string;
  accent: string;
}

interface ProjectShowcaseProps {
  project: ProjectData;
  index: number;
  priorityImage?: boolean;
}

export function ProjectShowcase({ project, index, priorityImage = false }: ProjectShowcaseProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 1;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isMobile) return;
    if (!cardRef.current || !imageContainerRef.current) return;

    const ctx = gsap.context(() => {
      // Subtle parallax on image container
      gsap.to(imageContainerRef.current, {
        y: 32,
        ease: 'none',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="w-full rounded-2xl sm:rounded-3xl bg-[#121316]/95 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
    >
      {/* Background Accent Glow */}
      <div 
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[130px] pointer-events-none opacity-20"
        style={{ backgroundColor: project.accent }}
      />

      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
        isEven ? 'lg:grid-flow-dense' : ''
      }`}>
        
        {/* Visual Showcase Side */}
        <div 
          ref={imageContainerRef}
          className={`lg:col-span-6 w-full ${isEven ? 'lg:col-start-7' : ''}`}
        >
          <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-xl group">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              loading={priorityImage ? 'eager' : 'lazy'}
              priority={priorityImage}
              className="object-cover object-center opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-transparent to-transparent opacity-80" />

            {/* Floating Index Tag */}
            <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[10px] sm:text-xs text-white px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/15">
              <span className="text-emerald-400 font-bold">PROJECT {project.number}</span>
              <span className="text-slate-400">•</span>
              <span className="uppercase tracking-wider text-slate-300">{project.category}</span>
            </div>

            {/* Bottom Overlay Label */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-slate-300 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10">
              <span className="truncate">VERIFIED DEPLOYMENT ARCHITECTURE</span>
              <span className="text-emerald-400 font-bold shrink-0 ml-2">PRODUCTION READY</span>
            </div>
          </div>
        </div>

        {/* Narrative & Technical Spec Side */}
        <div className={`lg:col-span-6 flex flex-col justify-between ${
          isEven ? 'lg:col-start-1' : ''
        }`}>
          <div>
            {/* Top Category Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-3">
              <Terminal className="w-3 h-3" />
              <span>{project.category}</span>
            </div>

            {/* Subtitle & Title */}
            <div className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {project.subtitle}
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-4">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Key Deliverables List */}
            <div className="mb-6 space-y-2">
              <div className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                CORE SYSTEM DELIVERABLES
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.keyDeliverables.map((item, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Stack Pills */}
            <div className="mb-8">
              <div className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                ARCHITECTURE STACK
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.technologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[10px] sm:text-[11px] text-slate-300 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Link Button */}
          <Link
            href={project.href}
            className="w-full sm:w-auto inline-flex items-center justify-between gap-3 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-black border border-white/20 hover:border-emerald-500 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 group/btn"
          >
            <span>EXPLORE PLATFORM ARCHITECTURE</span>
            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}

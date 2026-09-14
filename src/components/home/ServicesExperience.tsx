'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Server, 
  Cpu, 
  Layers, 
  Smartphone, 
  Database, 
  Palette, 
  ArrowUpRight, 
  ArrowRight,
  Boxes,
  Activity,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceData {
  id: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  accent: string;
  icon: React.ElementType;
  specs: { label: string; value: string }[];
  technologies: string[];
  image: string;
}

const SERVICES_DATA: ServiceData[] = [
  {
    id: 'cloud',
    number: '01',
    category: 'INFRASTRUCTURE',
    title: 'Distributed Cloud Architecture',
    subtitle: 'HIGH-AVAILABILITY MULTI-REGION TOPOLOGY',
    description: 'High-availability multi-region cloud topologies with zero single-point-of-failure, automated edge failover, and sovereign data isolation.',
    href: '/services/cloud-infrastructure',
    accent: '#10b981',
    icon: Server,
    specs: [
      { label: 'AVAILABILITY', value: '99.999%' },
      { label: 'GLOBAL LATENCY', value: '< 12ms' },
      { label: 'THROUGHPUT', value: '500K+ RPS' },
    ],
    technologies: ['Multi-Region Mesh', 'Terraform', 'Kubernetes', 'Edge DNS'],
    image: '/images/3d-enterprise-node.jpg',
  },
  {
    id: 'ai',
    number: '02',
    category: 'INTELLIGENCE',
    title: 'Neural AI & Tensor Systems',
    subtitle: 'CUSTOM LLMS & VECTOR PIPELINES',
    description: 'Custom fine-tuned large language models, enterprise vector databases, and real-time predictive telemetry pipelines for business automation.',
    href: '/services/ai-ml-solutions',
    accent: '#06b6d4',
    icon: Cpu,
    specs: [
      { label: 'INFERENCE SPEED', value: '40ms TTFT' },
      { label: 'CONTEXT WINDOW', value: '128K' },
      { label: 'ACCURACY', value: '99.4%' },
    ],
    technologies: ['Vector DB', 'PyTorch Engine', 'pgvector', 'Real-time Telemetry'],
    image: '/images/3d-software-dev.jpg',
  },
  {
    id: 'web',
    number: '03',
    category: 'FULL-STACK',
    title: 'Enterprise Web Platforms',
    subtitle: 'HIGH-CONCURRENCY REACT 19 ENGINES',
    description: 'Next-generation high-concurrency web engines built on React 19, Next.js App Router, and serverless edge functions for global scale.',
    href: '/services/web-development',
    accent: '#3b82f6',
    icon: Layers,
    specs: [
      { label: 'LIGHTHOUSE', value: '100 / 100' },
      { label: 'FIRST PAINT', value: '0.4s' },
      { label: 'SSR CACHE HIT', value: '98.2%' },
    ],
    technologies: ['Next.js 16', 'React 19', 'Turbopack', 'Tailwind CSS 4'],
    image: '/hero_workspace_editorial.jpg',
  },
  {
    id: 'mobile',
    number: '04',
    category: 'ECOSYSTEM',
    title: 'Native Mobile Engineering',
    subtitle: '120 FPS IOS & ANDROID APPS',
    description: 'Fluid 120 FPS iOS and Android ecosystems engineered with native Swift, Kotlin, and cross-platform offline synchronization.',
    href: '/services/mobile-apps',
    accent: '#8b5cf6',
    icon: Smartphone,
    specs: [
      { label: 'FRAME RATE', value: '120 FPS' },
      { label: 'CRASH-FREE', value: '99.98%' },
      { label: 'OFFLINE MODE', value: 'ACTIVE' },
    ],
    technologies: ['Swift Native', 'Kotlin Multiplatform', 'Offline Sync', 'Biometric Auth'],
    image: '/images/3d-digital-growth.jpg',
  },
  {
    id: 'erp',
    number: '05',
    category: 'ENTERPRISE',
    title: 'Distributed ERP & Ledger',
    subtitle: 'MISSION-CRITICAL RESOURCE SYSTEMS',
    description: 'Mission-critical enterprise resource planning systems with cryptographic audit trails and real-time multi-branch inventory synchronization.',
    href: '/services/erp-systems',
    accent: '#f59e0b',
    icon: Database,
    specs: [
      { label: 'ACID AUDIT', value: '100%' },
      { label: 'CONCURRENCY', value: '100K USERS' },
      { label: 'RECOVERY TIME', value: '< 1 SEC' },
    ],
    technologies: ['PostgreSQL', 'Immutable Ledger', 'Role RBAC', 'Automated Sync'],
    image: '/images/3d-enterprise-node.jpg',
  },
  {
    id: 'uiux',
    number: '06',
    category: 'DESIGN & SPATIAL',
    title: 'Spatial UI/UX & Design Systems',
    subtitle: 'PRECISION INTERFACE ARCHITECTURE',
    description: 'Precision human-computer interface design systems, high-density telemetry dashboards, and interactive multi-brand design tokens.',
    href: '/services/ui-ux-design',
    accent: '#ec4899',
    icon: Palette,
    specs: [
      { label: 'WCAG AAA', value: 'COMPLIANT' },
      { label: 'TOKENS', value: '800+ SYSTEM' },
      { label: 'USABILITY', value: '98.8 SCORE' },
    ],
    technologies: ['Design Tokens', 'Figma Variables', 'A11y Compliant', 'Micro-Interactions'],
    image: '/hero_launch_artwork.png',
  },
];

export function ServicesExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinTrackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMobileOrReduced, setIsMobileOrReduced] = useState<boolean>(false);

  const activeService = SERVICES_DATA[activeIndex] || SERVICES_DATA[0];
  const ActiveIcon = activeService.icon;

  // Detect Mobile or Reduced-Motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkState = () => {
      const isMobile = window.innerWidth < 1024;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsMobileOrReduced(isMobile || prefersReduced);
    };

    checkState();
    window.addEventListener('resize', checkState);
    return () => window.removeEventListener('resize', checkState);
  }, []);

  // GSAP ScrollTrigger Pinning & Sequential Activation for Desktop
  useEffect(() => {
    if (typeof window === 'undefined' || isMobileOrReduced) return;
    if (!sectionRef.current || !pinTrackRef.current) return;

    const totalSteps = SERVICES_DATA.length;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * (totalSteps * 0.75)}`,
        pin: pinTrackRef.current,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          // Calculate active step based on progress
          const rawIndex = Math.floor(progress * totalSteps);
          const nextIndex = Math.min(totalSteps - 1, Math.max(0, rawIndex));
          setActiveIndex(nextIndex);
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [isMobileOrReduced]);

  // Handle Manual/Keyboard Selection
  const handleSelectService = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="services" 
      aria-label="OHO TECH Core Engineering Services"
      className="w-full bg-[#0a0a0b] text-white relative overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 right-10 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Track Container */}
      <div 
        ref={pinTrackRef}
        className="w-full min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24"
      >
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
                <Boxes className="w-3.5 h-3.5" />
                <span>CAPABILITY ECOSYSTEM // 04</span>
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase">
                Core Engineering Services
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                SCROLL OR SELECT TO EXPLORE
              </span>
              <div className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                0{activeIndex + 1} / 0{SERVICES_DATA.length}
              </div>
            </div>
          </div>

          {/* Desktop & Tablet: Interactive Typography-Led Sequential Split Stage */}
          <div className="hidden lg:grid grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Typography-Led Sequential Services List */}
            <div className="col-span-7 flex flex-col gap-3">
              {SERVICES_DATA.map((service, idx) => {
                const isActive = activeIndex === idx;
                const ItemIcon = service.icon;

                return (
                  <div
                    key={service.id}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isActive 
                        ? 'bg-[#14151a] border-emerald-500/40 shadow-2xl ring-1 ring-emerald-500/30' 
                        : 'bg-[#0f1013]/60 border-white/5 hover:border-white/15 hover:bg-[#121317]'
                    }`}
                  >
                    {/* Typographic Header Button */}
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`service-panel-${service.id}`}
                      onClick={() => handleSelectService(idx)}
                      className="w-full text-left p-5 sm:p-6 flex items-center justify-between group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    >
                      <div className="flex items-center gap-4 sm:gap-6">
                        <span className={`font-mono text-sm sm:text-base font-bold transition-colors ${
                          isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'
                        }`}>
                          {service.number}
                        </span>

                        <span className={`text-xl sm:text-2xl lg:text-3xl tracking-tight transition-all duration-300 uppercase ${
                          isActive 
                            ? 'font-black text-white scale-[1.02] origin-left' 
                            : 'font-semibold text-slate-300 group-hover:text-white'
                        }`}>
                          {service.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold transition-all ${
                          isActive 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-white/5 text-slate-400 border border-white/10'
                        }`}>
                          {service.category}
                        </span>

                        <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
                          isActive ? 'rotate-90 text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                        }`} />
                      </div>
                    </button>

                    {/* Active Expanded Drawer (Smooth reveal with clipping/specs) */}
                    {isActive && (
                      <div 
                        id={`service-panel-${service.id}`}
                        className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/10 space-y-5 animate-in fade-in duration-300"
                      >
                        {/* Description */}
                        <p className="text-sm text-slate-300 leading-relaxed font-normal">
                          {service.description}
                        </p>

                        {/* 3 Performance Specs Grid */}
                        <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
                          {service.specs.map((spec, sIdx) => (
                            <div key={sIdx} className="text-left">
                              <div className="font-mono text-[9px] text-slate-400 uppercase tracking-wider truncate">
                                {spec.label}
                              </div>
                              <div className="font-mono text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                                {spec.value}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Technology Pills & Action Link Row */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                          <div className="flex flex-wrap gap-1.5">
                            {service.technologies.map((tech, tIdx) => (
                              <span 
                                key={tIdx}
                                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[10px] text-slate-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          <Link
                            href={service.href}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 group/link"
                          >
                            <span>EXPLORE CAPABILITY</span>
                            <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column: Visual Stage / Active Canvas Showcase */}
            <div className="col-span-5 sticky top-28">
              <div className="w-full rounded-2xl sm:rounded-3xl bg-[#14151a] border border-white/15 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                
                {/* Visual Stage Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5 font-mono text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <ActiveIcon className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold">{activeService.category} SPECIFICATION</span>
                  </div>
                  <span className="text-emerald-400 font-bold">100% PRODUCTION READY</span>
                </div>

                {/* 3D Visual Asset Canvas */}
                <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden mb-5 border border-white/10 bg-black/60">
                  <Image
                    src={activeService.image}
                    alt={activeService.title}
                    fill
                    className="object-cover object-center opacity-85 transition-transform duration-700 hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14151a] via-transparent to-transparent opacity-90" />
                  
                  {/* Floating Overlay Pill */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-white/90 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10">
                    <span className="text-emerald-400 font-bold">CAPABILITY // {activeService.number}</span>
                    <span>{activeService.title}</span>
                  </div>
                </div>

                {/* Active Subtitle & Summary */}
                <div className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {activeService.subtitle}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {activeService.title}
                </h3>

                {/* Direct Capability Link */}
                <Link
                  href={activeService.href}
                  className="w-full py-3 px-5 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/10 hover:border-emerald-500 font-mono text-xs font-bold text-slate-300 transition-all duration-200 flex items-center justify-between group/btn"
                >
                  <span>VIEW DETAILED ARCHITECTURE</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>

              </div>
            </div>

          </div>

          {/* Mobile & Small Tablet: Responsive Vertical Sequence */}
          <div className="lg:hidden flex flex-col gap-4">
            {SERVICES_DATA.map((service, idx) => {
              const isOpen = activeIndex === idx;
              const ItemIcon = service.icon;

              return (
                <div
                  key={service.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'bg-[#14151a] border-emerald-500/40 shadow-xl ring-1 ring-emerald-500/30' 
                      : 'bg-[#0f1013] border-white/10'
                  }`}
                >
                  {/* Card Header Accordion Trigger */}
                  <button
                    type="button"
                    onClick={() => setActiveIndex(isOpen ? -1 : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="font-mono text-sm font-bold text-emerald-400">
                        {service.number}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                        {service.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 font-mono text-[9px] text-slate-300 font-bold uppercase">
                        {service.category}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-90 text-emerald-400' : 'text-slate-500'
                      }`} />
                    </div>
                  </button>

                  {/* Expanded Content Drawer */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-white/10 space-y-4 animate-in fade-in duration-200">
                      <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                        {service.description}
                      </p>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/40 border border-white/5">
                        {service.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="text-center">
                            <div className="font-mono text-[8px] text-slate-400 uppercase truncate">
                              {spec.label}
                            </div>
                            <div className="font-mono text-[11px] font-bold text-white truncate mt-0.5">
                              {spec.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1.5">
                        {service.technologies.map((tech, tIdx) => (
                          <span 
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-mono text-[9px] text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Link */}
                      <Link
                        href={service.href}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between"
                      >
                        <span>EXPLORE CAPABILITY</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

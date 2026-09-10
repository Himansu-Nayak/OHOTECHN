'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Cpu, Layers, Server, Smartphone, Database, Palette } from 'lucide-react';
import { Tilt3D } from '@/components/ui/Tilt3D';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceShowcaseItem {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  image: string;
  href: string;
  accent: string;
  icon: React.ElementType;
  specs: { label: string; value: string }[];
}

const SHOWCASE_ITEMS: ServiceShowcaseItem[] = [
  {
    id: 'cloud',
    number: '01',
    category: 'INFRASTRUCTURE',
    title: 'Distributed Cloud Architecture',
    description: 'High-availability multi-region cloud topologies with zero single-point-of-failure and automated edge failover.',
    image: '/images/3d/cloud-engine-3d.webp',
    href: '/services/cloud-infrastructure',
    accent: '#10b981',
    icon: Server,
    specs: [
      { label: 'AVAILABILITY', value: '99.999%' },
      { label: 'GLOBAL LATENCY', value: '< 12ms' },
      { label: 'THROUGHPUT', value: '500K+ RPS' },
    ],
  },
  {
    id: 'ai',
    number: '02',
    category: 'INTELLIGENCE',
    title: 'Neural AI & Tensor Systems',
    description: 'Custom fine-tuned large language models, enterprise vector databases, and real-time predictive telemetry pipelines.',
    image: '/images/3d/ai-neural-mesh-3d.webp',
    href: '/services/ai-ml-solutions',
    accent: '#06b6d4',
    icon: Cpu,
    specs: [
      { label: 'INFERENCE SPEED', value: '40ms TTFT' },
      { label: 'CONTEXT WINDOW', value: '128K' },
      { label: 'ACCURACY', value: '99.4%' },
    ],
  },
  {
    id: 'web',
    number: '03',
    category: 'FULL-STACK',
    title: 'Enterprise Web Platforms',
    description: 'Next-generation high-concurrency web engines built on React 19, Next.js App Router, and serverless edge functions.',
    image: '/images/3d/web-platform-3d.webp',
    href: '/services/web-development',
    accent: '#3b82f6',
    icon: Layers,
    specs: [
      { label: 'LIGHTHOUSE', value: '100 / 100' },
      { label: 'FIRST CONTENTFUL PAINT', value: '0.4s' },
      { label: 'SSR CACHE HIT', value: '98.2%' },
    ],
  },
  {
    id: 'mobile',
    number: '04',
    category: 'ECOSYSTEM',
    title: 'Native Mobile Engineering',
    description: 'Fluid 120 FPS iOS and Android ecosystems engineered with native Swift, Kotlin, and cross-platform native pipelines.',
    image: '/images/3d/mobile-ecosystem-3d.webp',
    href: '/services/mobile-apps',
    accent: '#8b5cf6',
    icon: Smartphone,
    specs: [
      { label: 'FRAME RATE', value: '120 FPS' },
      { label: 'CRASH-FREE USERS', value: '99.98%' },
      { label: 'OFFLINE MODE', value: 'ACTIVE' },
    ],
  },
  {
    id: 'erp',
    number: '05',
    category: 'ENTERPRISE',
    title: 'Distributed ERP & Ledger',
    description: 'Mission-critical enterprise resource planning systems with cryptographic audit trails and real-time inventory synchronization.',
    image: '/images/3d/enterprise-erp-3d.webp',
    href: '/services/erp-systems',
    accent: '#f59e0b',
    icon: Database,
    specs: [
      { label: 'TRANSACTION DRIFT', value: '0.00%' },
      { label: 'SYNC LATENCY', value: '< 25ms' },
      { label: 'AUDIT COMPLIANCE', value: 'SOC-2 / ISO' },
    ],
  },
  {
    id: 'design',
    number: '06',
    category: 'SPATIAL',
    title: 'Spatial UI/UX & Design Systems',
    description: 'Awwwards-tier micro-interaction architecture, dynamic token libraries, and immersive 44px rounded studio card design.',
    image: '/images/3d/ui-ux-design-3d.webp',
    href: '/services/ui-ux-design',
    accent: '#ec4899',
    icon: Palette,
    specs: [
      { label: 'CURVATURE', value: '44px LUXURY' },
      { label: 'ACCESSIBILITY', value: 'WCAG AAA' },
      { label: 'DESIGN TOKENS', value: '60+ TOKENS' },
    ],
  },
];

export function HorizontalServicesShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth;
      return -(trackWidth - window.innerWidth + 120);
    };

    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 0.8,
        start: 'top top',
        end: () => `+=${Math.max(track.scrollWidth - window.innerWidth, 1500)}`,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      if (tween.scrollTrigger) {
        tween.scrollTrigger.kill();
      }
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="max-w-[1536px] w-full mx-auto mb-8 sm:mb-12 bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[28px] sm:rounded-[44px] py-12 sm:py-20 overflow-hidden z-20 shadow-2xl relative"
    >
      {/* Background Cyber Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ENGINEERING HORIZON // 6 CORE VERTICALS
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white uppercase">
            Architectural <span className="text-neutral-400">Capabilities</span>
          </h2>
        </div>
        <p className="text-neutral-400 text-sm md:text-base max-w-md font-mono">
          Explore our end-to-end software engineering ecosystem engineered for global scale, zero latency, and absolute fault tolerance.
        </p>
      </div>

      {/* Horizontal Pinned Track */}
      <div
        ref={trackRef}
        className="flex gap-8 px-6 md:px-12 w-max will-change-transform relative z-10"
      >
        {SHOWCASE_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="w-[85vw] max-w-[580px] shrink-0"
              data-cursor="EXPLORE"
            >
              <Tilt3D maxTilt={4}>
                <div className="relative group bg-[#14171f] border border-white/10 rounded-[36px] overflow-hidden p-8 flex flex-col justify-between h-[560px] shadow-[0_30px_70px_rgba(0,0,0,0.6)] hover:border-emerald-500/50 transition-colors duration-500">
                  {/* Subtle Accent Glow */}
                  <div
                    className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-15 filter blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-30"
                    style={{ background: item.accent }}
                  />

                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
                          {item.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-white tracking-widest">
                          [{item.number} {'//'} 06]
                        </span>
                      </div>
                    </div>

                    <Link
                      href={item.href}
                      className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-400 transition-all duration-300"
                    >
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>

                  {/* 3D Visual Preview */}
                  <div className="relative w-full h-56 my-4 rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 85vw, 580px"
                    />
                  </div>

                  {/* Body Content */}
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-neutral-400 text-xs md:text-sm line-clamp-2 mb-6">
                      {item.description}
                    </p>

                    {/* Technical Specs Footer */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
                      {item.specs.map((spec, idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="text-[9px] font-mono text-neutral-500 tracking-wider uppercase">
                            {spec.label}
                          </span>
                          <span className="text-xs font-mono font-bold text-white mt-0.5">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Tilt3D>
            </div>
          );
        })}
      </div>
    </section>
  );
}

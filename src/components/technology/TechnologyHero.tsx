'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Workflow, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Database, 
  Sparkles, 
  ArrowRight,
  Activity,
  Server,
  Lock,
  ArrowDown
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function TechnologyHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion()) return;
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Headline reveal
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 35, clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
          {
            opacity: 1,
            y: 0,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 0.9,
            ease: 'power3.out',
            delay: 0.1,
          }
        );
      }

      // 2. Badges stagger
      if (badgesRef.current) {
        gsap.fromTo(
          badgesRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.35,
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={containerRef} className="relative mb-16 sm:mb-24 pb-12 border-b border-white/10">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-emerald-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-8 sm:mb-10 font-mono text-xs text-slate-400 flex items-center gap-2">
        <Link href="/" className="hover:text-emerald-400 transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-emerald-400 font-bold">TECHNOLOGY &amp; AI ARCHITECTURE</span>
      </nav>

      {/* Badge Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-6">
        <Workflow className="w-3.5 h-3.5" />
        <span>DISTRIBUTED SYSTEMS • CLOUD MESH • AI AUTOMATION</span>
      </div>

      {/* Large Typography Headline */}
      <h1 
        ref={headlineRef}
        className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tight leading-[1.02] uppercase mb-8"
      >
        <span>Technology Foundation.</span>
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
          Deterministic &amp; Resilient.
        </span>
      </h1>

      {/* Lead Paragraph */}
      <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-4xl mb-10">
        A comprehensive technical specification of OHO TECH&apos;s architectural runtimes: high-throughput microservices, sovereign relational persistence, pragmatic enterprise AI pipelines, and zero-trust security governance.
      </p>

      {/* Quick Action Navigation Strip */}
      <div className="flex flex-wrap items-center gap-4 mb-12 font-mono text-xs">
        <a
          href="#tech-matrix"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider transition-all shadow-lg"
        >
          <span>EXPLORE 10-DOMAIN MATRIX</span>
          <ArrowDown className="w-4 h-4" />
        </a>

        <a
          href="#ai-experience"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold uppercase tracking-wider transition-all"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>INSPECT AI &amp; AUTOMATION ENGINE</span>
        </a>
      </div>

      {/* 4 Architectural Pillar Highlights */}
      <div 
        ref={badgesRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 font-mono text-xs"
      >
        <div className="p-4 rounded-2xl bg-[#111216]/90 border border-white/10 flex items-start gap-3">
          <Layers className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-white font-bold mb-0.5">Decoupled Boundaries</div>
            <div className="text-[11px] text-slate-400">Autonomous microservices &amp; zero single point of failure</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#111216]/90 border border-white/10 flex items-start gap-3">
          <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-white font-bold mb-0.5">Sub-Millisecond Sync</div>
            <div className="text-[11px] text-slate-400">Asynchronous AMQP &amp; Redis Pub/Sub event streaming</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#111216]/90 border border-white/10 flex items-start gap-3">
          <Database className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-white font-bold mb-0.5">Strict ACID Persistence</div>
            <div className="text-[11px] text-slate-400">PostgreSQL row-level locking &amp; zero ledger imbalances</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#111216]/90 border border-white/10 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-white font-bold mb-0.5">100% Code Sovereignty</div>
            <div className="text-[11px] text-slate-400">Full source code ownership with zero vendor lock-in</div>
          </div>
        </div>
      </div>

    </header>
  );
}

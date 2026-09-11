'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Layers, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Server, 
  Activity 
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function LayeredParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerBackRef = useRef<HTMLDivElement>(null);
  const layerMid1Ref = useRef<HTMLDivElement>(null);
  const layerMid2Ref = useRef<HTMLDivElement>(null);
  const layerFrontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const layerBack = layerBackRef.current;
    const layerMid1 = layerMid1Ref.current;
    const layerMid2 = layerMid2Ref.current;
    const layerFront = layerFrontRef.current;

    if (!container || !layerBack || !layerMid1 || !layerMid2 || !layerFront) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Layer 0: Deep background ambient glow (slowest / slight positive lag)
      gsap.fromTo(
        layerBack,
        { y: 30 },
        {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      // Layer 1: Background circuit / server stack nodes (moderate scrub)
      gsap.fromTo(
        layerMid1,
        { y: 60 },
        {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );

      // Layer 2: Main center architecture engine card (standard scrub)
      gsap.fromTo(
        layerMid2,
        { y: 90 },
        {
          y: -130,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );

      // Layer 3: Foreground floating telemetry badges (fastest scrub)
      gsap.fromTo(
        layerFront,
        { y: 120 },
        {
          y: -190,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.8,
          },
        }
      );
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="parallax-architecture"
      ref={containerRef}
      aria-label="Multi-Layered Spatial Architecture and Distributed Compute Visualization"
      className="w-full bg-[#0a0a0b] text-[#e8e8e6] py-24 sm:py-36 px-6 sm:px-10 lg:px-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 relative z-40">
          <ScrollReveal yOffset={15} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>SPATIAL COMPUTING // MULTI-LAYER TOPOLOGY</span>
            </div>
          </ScrollReveal>

          <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase mb-4">
              Layered By Design. <span className="text-emerald-400">Resilient by Default.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
              Every system we engineer is separated into autonomous operational strata—preventing failure propagation and guaranteeing uninterrupted business continuity.
            </p>
          </ScrollReveal>
        </div>

        {/* 3D Stacked Parallax Stage Container */}
        <div className="relative w-full min-h-[580px] sm:min-h-[640px] flex items-center justify-center">
          
          {/* ── LAYER 0: Ambient Radial Mesh (Deep Z-0) ── */}
          <div
            ref={layerBackRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
          >
            <div className="w-[600px] sm:w-[800px] h-[350px] sm:h-[450px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-cyan-600/15 rounded-full blur-[140px]" />
            <div 
              className="absolute inset-0 opacity-[0.06] rounded-3xl"
              style={{
                backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
          </div>

          {/* ── LAYER 1: Background Distributed Server Stack Nodes (Z-10) ── */}
          <div
            ref={layerMid1Ref}
            className="absolute inset-x-0 top-6 sm:top-10 flex justify-between items-center px-4 sm:px-12 pointer-events-none z-10 opacity-70"
          >
            {/* Left Node Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md max-w-[220px] sm:max-w-[260px] hidden md:block">
              <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 font-bold mb-2">
                <Server className="w-3.5 h-3.5" />
                <span>ANYCAST EDGE NODE</span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Region: AP-SOUTH-1 (Mumbai Core)
              </p>
              <div className="mt-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LATENCY: 4.2ms</span>
              </div>
            </div>

            {/* Right Node Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md max-w-[220px] sm:max-w-[260px] hidden md:block">
              <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 font-bold mb-2">
                <Database className="w-3.5 h-3.5" />
                <span>POSTGRES ACID SHARD</span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                WAL Mirrored Replication
              </p>
              <div className="mt-2 text-[10px] font-mono text-cyan-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>SYNC: 100% IN-LOCK</span>
              </div>
            </div>
          </div>

          {/* ── LAYER 2: Central Holographic Architecture Engine (Z-20) ── */}
          <div
            ref={layerMid2Ref}
            className="relative z-20 w-full max-w-3xl mx-auto p-6 sm:p-10 rounded-3xl bg-[#121318]/90 border border-white/15 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    OHO High-Throughput Kernel
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    EVENT-DRIVEN ASYNCHRONOUS PIPELINE
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                <Activity className="w-3.5 h-3.5" />
                <span>ACTIVE PIPELINE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  CONCURRENCY LIMIT
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono block">
                  100k+ REQ/S
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Zero-lock contention</span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  FAULT TOLERANCE
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono block">
                  SELF-HEALING
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Sub-second recovery</span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  SECURITY MODEL
                </span>
                <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono block">
                  ZERO-TRUST
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">mTLS 1.3 encrypted</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
              <div className="text-xs text-slate-400 font-mono">
                Engineered for enterprise scale, fintech compliance, and continuous data audit.
              </div>
              <Link
                href="/solutions"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shrink-0"
              >
                <span>Inspect Blueprints</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ── LAYER 3: Foreground Floating Telemetry Badges (Z-30) ── */}
          <div
            ref={layerFrontRef}
            className="absolute inset-x-0 -bottom-6 sm:-bottom-8 flex justify-center items-center pointer-events-none z-30"
          >
            <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 px-4 py-2.5 rounded-full bg-[#161822]/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl text-xs font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>CRYPTOGRAPHIC AUDIT PASSED</span>
              </div>
              <span className="text-white/20 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Zap className="w-3.5 h-3.5" />
                <span>SLA 99.99% GUARANTEED</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

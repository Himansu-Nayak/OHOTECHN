'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Database, Layers, Globe } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { FlippingText } from '@/components/ui/FlippingText';
import { Tilt3D } from '@/components/ui/Tilt3D';

export function CinematicHero() {
  const [activeTelemetry, setActiveTelemetry] = React.useState<number>(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveTelemetry((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const telemetryData = [
    { label: 'SYSTEM STATE', val: 'PRODUCTION ACTIVE', color: 'text-emerald-400' },
    { label: 'CONCURRENCY', val: 'MULTI-TENANT HYBRID', color: 'text-cyan-400' },
    { label: 'DATA LATENCY', val: '< 18ms EDGE ROUTE', color: 'text-emerald-400' },
    { label: 'DEPLOYED PLATFORMS', val: 'ERP • EMR • FINTECH', color: 'text-amber-400' },
  ];

  return (
    <section 
      id="hero" 
      className="relative w-full min-h-screen flex flex-col justify-center bg-[#0a0a0b] text-white px-6 sm:px-10 lg:px-16 py-20 sm:py-28 overflow-hidden"
    >
      {/* Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Top Status Capsule */}
        <ScrollReveal yOffset={16} duration={0.6} delay={0.05}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>ENTERPRISE TECHNOLOGY PLATFORM</span>
          </div>
        </ScrollReveal>

        {/* Main Brand & Headline */}
        <ScrollReveal yOffset={24} duration={0.7} delay={0.15}>
          <div className="font-mono text-xs sm:text-sm font-bold text-emerald-400 tracking-[0.25em] uppercase mb-4">
            OHO TECH
          </div>
          <h1 className="text-[clamp(2.5rem,7vw,8rem)] font-black tracking-tighter text-white leading-[0.95] mb-8 uppercase">
            Building digital systems that move business forward.
          </h1>
        </ScrollReveal>

        {/* Subtitle / Value Proposition */}
        <ScrollReveal yOffset={18} duration={0.65} delay={0.25}>
          <p className="text-sm sm:text-lg lg:text-xl text-slate-300 font-normal max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            We architect and engineer scalable software products, cloud enterprise platforms, custom business systems, and automated digital growth engines.
          </p>
        </ScrollReveal>

        {/* Dual Primary CTAs (Preserving working routes) */}
        <ScrollReveal yOffset={14} duration={0.55} delay={0.35}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-10 sm:mb-14 w-full max-w-md sm:max-w-none mx-auto">
            <Link
              id="hero-get-quote"
              href="/get-quote"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] active:translate-y-0 active:scale-[0.99] text-center group"
            >
              <span className="inline-flex items-center gap-2">
                <FlippingText text="Get a Quote" />
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              id="hero-book-demo"
              href="/book-demo"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.99] text-center backdrop-blur-md"
            >
              <FlippingText text="Book a Demo" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Interactive Living Digital Infrastructure Visual */}
        <ScrollReveal yOffset={20} duration={0.7} delay={0.45}>
          <Tilt3D maxTilt={4} scale={1.01} className="w-full">
            <div className="rounded-2xl sm:rounded-3xl bg-[#141416]/90 border border-white/15 p-4 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden text-left">
              
              {/* Telemetry Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="font-mono text-xs text-slate-400 ml-2">oho_core_engine // v4.2.0</span>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-slate-400 hidden sm:inline">TELEMETRY:</span>
                  <span className={`font-bold transition-colors duration-300 ${telemetryData[activeTelemetry].color}`}>
                    {telemetryData[activeTelemetry].label}: {telemetryData[activeTelemetry].val}
                  </span>
                </div>
              </div>

              {/* Central Infrastructure Schematics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                
                {/* Node 1: Client Interfaces */}
                <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">NODE 01</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                    Client Interfaces
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Next.js Web Platforms, Native iOS/Android apps, and real-time operator portals.
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Latency: 12ms avg
                  </div>
                </div>

                {/* Node 2: Core Business Logic & APIs */}
                <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">NODE 02</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    Microservice Gateway
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Distributed Spring Boot &amp; Node microservices, modular ERP workflows, and secure REST/gRPC.
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Throughput: 15k req/s
                  </div>
                </div>

                {/* Node 3: Data & Cloud Infrastructure */}
                <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                      <Database className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">NODE 03</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                    Persistence &amp; Cloud
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    High-availability PostgreSQL clusters, encrypted object storage, and automated backup nodes.
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Uptime: High-Availability Cluster
                  </div>
                </div>

              </div>

            </div>
          </Tilt3D>
        </ScrollReveal>

      </div>
    </section>
  );
}

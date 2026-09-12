'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Database, Layers, Globe, ShieldCheck, Terminal, Cpu, Activity } from 'lucide-react';

export function HeroExperience() {
  const [activeMetric, setActiveMetric] = React.useState<number>(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const telemetryData = [
    { label: 'SYSTEM STATE', val: 'PRODUCTION ACTIVE', color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'CONCURRENCY', val: 'MULTI-TENANT HYBRID', color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { label: 'DATA LATENCY', val: '< 18ms EDGE ROUTE', color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'DEPLOYED STACKS', val: 'ERP • EMR • FINTECH', color: 'text-amber-400', border: 'border-amber-500/30' },
  ];

  return (
    <section 
      id="hero" 
      className="relative w-full min-h-[90vh] lg:min-h-[95vh] flex flex-col justify-center bg-[#0a0a0b] text-white px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 overflow-hidden"
    >
      {/* Structural ambient backdrops */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-72 sm:w-96 lg:w-[600px] h-72 sm:h-96 lg:h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-64 sm:w-80 lg:w-[500px] h-64 sm:h-80 lg:h-[500px] bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Top Status Capsule */}
        <div className="flex justify-center sm:justify-start mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>ENTERPRISE TECHNOLOGY PLATFORM</span>
          </div>
        </div>

        {/* Main Brand & Headline */}
        <div className="text-center sm:text-left mb-8 sm:mb-10">
          <div className="font-mono text-xs sm:text-sm font-bold text-emerald-400 tracking-[0.25em] uppercase mb-3 sm:mb-4">
            OHO TECH
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter text-white leading-[0.92] uppercase">
            <span className="block">WE BUILD</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              DIGITAL
            </span>
            <span className="block">EXPERIENCES.</span>
          </h1>
        </div>

        {/* Value Proposition & Action Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12 sm:mb-16">
          <div className="lg:col-span-7">
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed text-center sm:text-left">
              We architect and engineer scalable software products, cloud enterprise platforms, custom business systems, and automated digital growth engines.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-row items-center justify-center lg:justify-end gap-3.5 sm:gap-4 w-full">
            <Link
              id="hero-get-quote"
              href="/get-quote"
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              id="hero-book-demo"
              href="/book-demo"
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center backdrop-blur-md"
            >
              Book a Demo
            </Link>
          </div>
        </div>

        {/* Responsive Telemetry / Live Infrastructure Dashboard Card */}
        <div className="w-full rounded-2xl sm:rounded-3xl bg-[#141416]/95 border border-white/15 p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Card Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="font-mono text-[11px] sm:text-xs text-slate-400 ml-2 font-medium">
                oho-mesh // live-telemetry-feed
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-emerald-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>GATEWAY ACTIVE (SSL/TLS 1.3)</span>
            </div>
          </div>

          {/* 4-Item Responsive Telemetry Grid: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-4 sm:my-6">
            {telemetryData.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 sm:p-4 rounded-xl bg-black/40 border transition-all duration-200 ${
                  activeMetric === idx ? `${item.border} bg-white/[0.04]` : 'border-white/5'
                }`}
              >
                <div className="font-mono text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                  {item.label}
                </div>
                <div className={`font-mono text-xs sm:text-sm font-bold ${item.color}`}>
                  {item.val}
                </div>
              </div>
            ))}
          </div>

          {/* Structural Code & Architecture Preview Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-white/10 font-mono text-[11px] sm:text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Runtime: Next.js 16 App Router + Turbopack</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">Database: PostgreSQL + Vector Hybrid Index</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Auth &amp; Governance: Cryptographic Role RBAC</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

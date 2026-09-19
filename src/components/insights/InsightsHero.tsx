'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, Cpu, Layers, ShieldCheck, Code2 } from 'lucide-react';
import gsap from 'gsap';
import { isReducedMotion } from '@/lib/motion';

const INSIGHT_METRICS = [
  { label: 'Technical Whitepapers', value: '08', detail: 'In-depth distributed systems notes' },
  { label: 'Architectural Domains', value: '07', detail: 'From FinTech ledgers to Healthcare EMR' },
  { label: 'Code Invariants', value: '100%', detail: 'Strict ACID & mathematical balance' },
  { label: 'Marketing Hype', value: '0%', detail: 'Peer-reviewed engineering blueprints' },
];

export function InsightsHero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion()) return;

    const ctx = gsap.context(() => {
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

      if (metricsRef.current) {
        gsap.fromTo(
          metricsRef.current.children,
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
    });

    return () => ctx.revert();
  }, []);

  return (
    <header className="mb-14 sm:mb-20">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-8 sm:mb-10 font-mono text-xs text-slate-400 flex items-center gap-2">
        <Link href="/" className="hover:text-emerald-400 transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-emerald-400 font-bold">ENGINEERING INSIGHTS &amp; JOURNAL</span>
      </nav>

      {/* Category Capsule */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-6">
        <BookOpen className="w-3.5 h-3.5" />
        <span>TECHNICAL WHITEPAPERS • SYSTEM DESIGN • 08 PUBLICATIONS</span>
      </div>

      {/* Main Headline */}
      <h1 
        ref={headlineRef}
        className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.04] uppercase mb-6"
      >
        <span className="block overflow-hidden py-1">
          <span className="hero-line block will-change-transform">Engineering Insights</span>
        </span>
        <span className="block overflow-hidden py-1">
          <span className="hero-line block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 will-change-transform">
            System Design &amp; Architecture.
          </span>
        </span>
      </h1>

      {/* Lead Narrative */}
      <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mb-12">
        Technical whitepapers, distributed systems design patterns, and high-concurrency production notes authored by OHO TECH engineers and leadership.
      </p>

      {/* Verified Metrics Strip */}
      <div 
        ref={metricsRef}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-[#111216]/90 border border-white/10 shadow-2xl"
      >
        {INSIGHT_METRICS.map((metric, idx) => (
          <div key={idx} className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black font-mono text-white tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {metric.value}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight">
              {metric.label}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {metric.detail}
            </div>
          </div>
        ))}
      </div>
    </header>
  );
}

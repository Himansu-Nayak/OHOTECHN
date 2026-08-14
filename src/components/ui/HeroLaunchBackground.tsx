'use client';

import * as React from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import {
  Stethoscope,
  GraduationCap,
  ShoppingBag,
  Cpu,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Layers,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroLaunchBackground() {
  const [activeSolution, setActiveSolution] = React.useState<number>(0);

  const solutions = [
    {
      id: 'healthcare',
      title: 'Hospital Management & EMR',
      tag: 'HEALTHCARE SOLUTION',
      icon: Stethoscope,
      accent: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      badgeBg: 'bg-sky-500',
      description: 'Centralized OPD/IPD, Electronic Health Records, Pathology Labs & Pharmacy Billing.',
      features: ['EMR Patient History', 'Lab & Pharmacy Integration', 'GST Invoicing'],
    },
    {
      id: 'education',
      title: 'Education & Campus Management',
      tag: 'EDUCATION SOLUTION',
      icon: GraduationCap,
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      badgeBg: 'bg-amber-500',
      description: 'Multi-campus university ERP, student admissions, fee automation & online proctored exams.',
      features: ['Multi-Campus ERP', 'Online Fee Gateway', 'Proctored Exam Engine'],
    },
    {
      id: 'retail',
      title: 'Retail POS & Inventory Management',
      tag: 'RETAIL & COMMERCE',
      icon: ShoppingBag,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      badgeBg: 'bg-emerald-500',
      description: 'High-speed retail counter billing, multi-store stock synchronization & barcode inventory.',
      features: ['Fast GST Counter Billing', 'Multi-Store Inventory Sync', 'Barcode Scanner API'],
    },
    {
      id: 'custom',
      title: 'Bespoke Enterprise Software & Apps',
      tag: 'CUSTOM PLATFORMS',
      icon: Cpu,
      accent: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      badgeBg: 'bg-sky-400',
      description: 'Custom web applications, workflow automation tools, and native iOS/Android mobile apps.',
      features: ['Tailored Workflow Engine', 'Cross-Platform Mobile Apps', 'Dedicated Support'],
    },
  ];

  return (
    <div className="w-full relative rounded-3xl sm:rounded-[36px] overflow-hidden border-2 border-slate-300 bg-[#0c0d0e] shadow-2xl group selection:bg-sky-500 selection:text-white">
      
      {/* ── 1. BACKGROUND EDITORIAL WORKSPACE IMAGE WITH DRAMATIC LIGHTING OVERLAY ── */}
      <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[580px] overflow-hidden">
        <NextImage
          src="/hero_workspace_editorial.jpg"
          alt="OHO TECH Engineering Team & Technology Studio Workspace"
          fill
          priority
          className="object-cover object-center brightness-[0.72] contrast-[1.08] group-hover:scale-[1.015] transition-transform duration-700 ease-out"
        />
        
        {/* Subtle Dark Gradient Overlay for High Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d0e] via-[#0c0d0e]/60 to-[#0c0d0e]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0c0d0e]/30 to-[#0c0d0e]/80 pointer-events-none" />
      </div>

      {/* ── 2. OVERLAY HEADER BAR (STUDIO BADGE & SOLUTION SELECTORS) ── */}
      <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-6 z-20 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0c0d0e]/80 backdrop-blur-xl border border-white/20 text-white font-mono text-xs font-bold shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
          <span>OHO TECH Technology Studio</span>
          <span className="text-slate-400 font-normal border-l border-white/20 pl-2 hidden sm:inline">Solutions We Build</span>
        </div>

        {/* Interactive Solution Selector Pills */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-[#0c0d0e]/85 backdrop-blur-xl border border-white/20 shadow-lg">
          {solutions.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveSolution(idx)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-mono font-bold transition-all duration-300 flex items-center gap-1.5",
                activeSolution === idx
                  ? "bg-white text-[#0c0d0e] shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.id.toUpperCase()}</span>
            </button>
          ))}
        </div>

      </div>

      {/* ── 3. HERO OVERLAY CONTENT: ACTIVE FEATURED SOLUTION CARD SHOWCASE ── */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 z-20">
        
        {/* Solution Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {solutions.map((sol, index) => {
            const Icon = sol.icon;
            const isActive = activeSolution === index;

            return (
              <div
                key={sol.id}
                onClick={() => setActiveSolution(index)}
                className={cn(
                  "p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer backdrop-blur-xl border flex flex-col justify-between group/card",
                  isActive
                    ? "bg-[#0c0d0e]/95 border-sky-400 shadow-2xl ring-2 ring-sky-400/30 scale-[1.02]"
                    : "bg-[#0c0d0e]/75 hover:bg-[#0c0d0e]/90 border-white/15 hover:border-white/30"
                )}
              >
                <div>
                  {/* Card Header Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                      sol.accent
                    )}>
                      {sol.tag}
                    </span>
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                      isActive ? "bg-white text-[#0c0d0e]" : "bg-white/10 text-white"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm sm:text-base font-extrabold text-white mb-1.5 leading-snug group-hover/card:text-sky-300 transition-colors">
                    {sol.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
                    {sol.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="pt-2.5 border-t border-white/10 space-y-1">
                  {sol.features.slice(0, 2).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Directive Bar */}
        <div className="bg-[#0c0d0e]/90 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-mono font-semibold text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Custom Enterprise Systems
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Hospital, School &amp; Retail Solutions
            </span>
            <span className="flex items-center gap-2 hidden lg:flex">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Digital Growth &amp; App Development
            </span>
          </div>

          <Link
            href="/solutions"
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-sky-400 text-[#0c0d0e] font-extrabold text-xs uppercase tracking-wider transition-all shadow-md group shrink-0"
          >
            <span>Explore All OHO TECH Solutions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

    </div>
  );
}

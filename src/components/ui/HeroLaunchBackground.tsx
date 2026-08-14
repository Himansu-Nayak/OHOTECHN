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
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroLaunchBackground() {
  const [activeSolution, setActiveSolution] = React.useState<number>(0);

  const solutions = [
    {
      id: 'custom-software',
      title: 'Custom Software Development',
      tag: 'BESPOKE SOFTWARE',
      icon: Cpu,
      accent: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      description: 'Tailored enterprise software, automated operational workflows, and API integrations.',
      features: ['Custom Workflow Automation', 'Modular Microservices', 'Enterprise Security'],
    },
    {
      id: 'healthcare',
      title: 'Hospital & Healthcare EMR',
      tag: 'HEALTHCARE ERP',
      icon: Stethoscope,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'Centralized OPD/IPD management, EMR patient records, pathology labs & pharmacy billing.',
      features: ['EMR Medical Records', 'Pathology & Lab Integration', 'GST Pharmacy Billing'],
    },
    {
      id: 'education',
      title: 'Education & Campus ERP',
      tag: 'EDUCATION CLOUD',
      icon: GraduationCap,
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description: 'Multi-campus university ERP, student admissions, online fee collection & exams.',
      features: ['Multi-Campus Operations', 'Online Fee Gateway', 'Proctored Exam Engine'],
    },
    {
      id: 'retail',
      title: 'Retail POS & Inventory Engine',
      tag: 'RETAIL COMMERCE',
      icon: ShoppingBag,
      accent: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      description: 'High-speed retail counter billing, multi-store stock sync, and barcode inventory control.',
      features: ['Fast GST Counter Billing', 'Multi-Store Inventory Sync', 'Barcode Scanner Integration'],
    },
  ];

  return (
    <div className="w-full relative rounded-3xl sm:rounded-[36px] overflow-hidden border-2 border-slate-300 bg-[#0c0d0e] shadow-2xl group selection:bg-sky-500 selection:text-white">
      
      {/* ── 1. LUXURY IPAD SHOWCASE PHOTO DISPLAYING OHO TECH WEBSITE UI ── */}
      <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[600px] overflow-hidden">
        <NextImage
          src="/hero_ipad_mockup_ohotech.jpg"
          alt="OHO TECH Website UI Showcase on Tablet Device - Software, Digital Solutions & Business Growth"
          fill
          priority
          quality={85}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          className="object-cover object-center brightness-[0.95] contrast-[1.03] group-hover:scale-[1.015] transition-transform duration-700 ease-out"
        />
        
        {/* Subtle Dark Gradient Foot Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d0e] via-[#0c0d0e]/40 to-transparent pointer-events-none" />
      </div>

      {/* ── 2. TOP HEADER BADGE ── */}
      <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-6 z-20 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0c0d0e]/85 backdrop-blur-xl border border-white/20 text-white font-mono text-xs font-bold shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
          <span>OHO TECH Platform Solutions</span>
          <span className="text-slate-400 font-normal border-l border-white/20 pl-2.5 hidden sm:inline">Software • Web • Mobile • Growth</span>
        </div>

        {/* Live Indicator */}
        <div className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c0d0e]/80 backdrop-blur-xl border border-white/15 text-slate-300 font-mono text-[11px]">
          <span>Enterprise Studio</span>
          <span className="text-sky-400 font-bold">• Active Production</span>
        </div>

      </div>

      {/* ── 3. BOTTOM OVERLAY SHOWCASE: OHO TECH SOLUTIONS CARDS ── */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 z-20">
        
        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {solutions.map((sol, index) => {
            const Icon = sol.icon;
            const isActive = activeSolution === index;

            return (
              <div
                key={sol.id}
                onClick={() => setActiveSolution(index)}
                className={cn(
                  "p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer backdrop-blur-2xl border flex flex-col justify-between group/card",
                  isActive
                    ? "bg-[#0c0d0e]/95 border-sky-400 shadow-2xl ring-2 ring-sky-400/30 scale-[1.02]"
                    : "bg-[#0c0d0e]/80 hover:bg-[#0c0d0e]/95 border-white/15 hover:border-white/30"
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
        <div className="bg-[#0c0d0e]/90 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-mono font-semibold text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Bespoke Software &amp; Mobile Apps
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Hospital, Campus &amp; Retail Systems
            </span>
            <span className="flex items-center gap-2 hidden lg:flex">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Data-Driven Growth Strategies
            </span>
          </div>

          <Link
            href="/solutions"
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-sky-400 text-[#0c0d0e] font-extrabold text-xs uppercase tracking-wider transition-all shadow-md group shrink-0"
          >
            <span>View All OHO TECH Solutions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

    </div>
  );
}

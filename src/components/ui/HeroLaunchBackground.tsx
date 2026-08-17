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
  Play,
  Pause,
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroLaunchBackground() {
  const [activeSolution, setActiveSolution] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);

  const solutions = React.useMemo(() => [
    {
      id: 'custom-software',
      title: 'Bespoke Software & Mobile Apps',
      tag: 'ENTERPRISE CORE',
      emoji: '⚙️',
      icon: Cpu,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'Custom microservices, automated workflows, and high-volume API integrations engineered for long-term operational scale.',
      features: ['Automated Workflow Engine', 'Modular Microservices', 'Enterprise Security'],
      image: '/hero_ipad_mockup_ohotech.jpg',
      badge: 'Interactive Demo • Custom Architecture',
    },
    {
      id: 'healthcare',
      title: 'Hospital & IVF Healthcare EMR',
      tag: 'HEALTHCARE ERP',
      emoji: '🏥',
      icon: Stethoscope,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'Centralized OPD/IPD administration, IVF fertility cycle tracking, laboratory automation, and GST pharmacy billing.',
      features: ['IVF Cycle & EMR Records', 'Pathology & Lab Integration', 'GST Pharmacy Billing'],
      image: '/ecosystem_healthcare.png',
      badge: 'HIPAA Compliant • Hospital Suite',
    },
    {
      id: 'education',
      title: 'Education & Campus ERP',
      tag: 'EDUCATION CLOUD',
      emoji: '🎓',
      icon: GraduationCap,
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description: 'Multi-campus university administration, automated student admissions, fee collection gateways, and proctored exam management.',
      features: ['Multi-Campus Operations', 'Online Fee Gateway', 'Proctored Exam Engine'],
      image: '/ecosystem_education.png',
      badge: 'Multi-Campus • University Platform',
    },
    {
      id: 'retail',
      title: 'Retail POS & Inventory Engine',
      tag: 'RETAIL COMMERCE',
      emoji: '🛒',
      icon: ShoppingBag,
      accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      description: 'High-speed retail counter billing, multi-store inventory synchronization, supplier reordering, and automated GST reporting.',
      features: ['Fast GST Counter Billing', 'Multi-Store Inventory Sync', 'Barcode Scanner Control'],
      image: '/hero_tech_ecosystem.jpg',
      badge: 'High-Speed Billing • Omni-Channel',
    },
  ], []);

  // Automatic Showcase Switcher: Cycles every 4 seconds when playing
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveSolution((prev) => (prev + 1) % solutions.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, solutions.length]);

  const currentSol = solutions[activeSolution];

  return (
    <div className="w-full relative rounded-3xl sm:rounded-[36px] overflow-hidden border-2 border-slate-300 bg-[#0c0d0e] shadow-2xl group selection:bg-emerald-500 selection:text-white">
      
      {/* ── 1. STUDIO WINDOW CONTROL BAR ── */}
      <div className="bg-[#141518] border-b border-white/10 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-white">
        
        {/* macOS Traffic Light Dots & Window Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10 text-xs font-mono text-slate-400">
            <span className="text-emerald-400 font-bold">OHO TECH Studio</span>
            <span>/</span>
            <span className="text-slate-200 font-semibold">{currentSol.title}</span>
          </div>
        </div>

        {/* Studio Interactive Control Pills */}
        <div className="flex items-center gap-2.5">
          {/* Active Solution Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{currentSol.badge}</span>
          </div>

          {/* Autoplay Switcher Toggle Button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isPlaying ? 'Pause Auto-Switching' : 'Enable Auto-Switching'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">AUTOPLAY ON</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">PAUSED</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 2. UNOBSTRUCTED HIGH-DEFINITION SHOWCASE CANVAS ── */}
      <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[480px] overflow-hidden bg-[#070809]">
        
        {/* Active Solution Graphics Showcase */}
        {solutions.map((sol, index) => (
          <div
            key={sol.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              index === activeSolution ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            )}
          >
            <NextImage
              src={sol.image}
              alt={`OHO TECH ${sol.title} Interface Showcase`}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-cover object-center brightness-[0.92] contrast-[1.03] transition-transform duration-1000 group-hover:scale-[1.02]"
            />
            
            {/* Subtle Vignette Gradient for Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d0e] via-transparent to-[#0c0d0e]/30 pointer-events-none" />

            {/* Clean Floating Badge (Top Left Corner) */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 pointer-events-none">
              <div className="px-4 py-2 rounded-2xl bg-[#0c0d0e]/85 backdrop-blur-xl border border-white/15 text-white font-mono text-xs font-bold flex items-center gap-2.5 shadow-xl">
                <span className="text-lg">{sol.emoji}</span>
                <div>
                  <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-extrabold">{sol.tag}</div>
                  <div className="text-xs font-bold text-white leading-tight">{sol.title}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. STRUCTURED SOLUTION CAPABILITY TABS (GRID BELOW CANVAS) ── */}
      <div className="p-4 sm:p-6 bg-[#0c0d0e] border-t border-white/10">
        
        {/* Solution Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          {solutions.map((sol, index) => {
            const Icon = sol.icon;
            const isActive = activeSolution === index;

            return (
              <div
                key={sol.id}
                onClick={() => {
                  setActiveSolution(index);
                  setIsPlaying(false);
                }}
                className={cn(
                  "p-4 rounded-2xl transition-all duration-300 cursor-pointer border flex flex-col justify-between group/card relative overflow-hidden",
                  isActive
                    ? "bg-[#16181d] border-emerald-400/80 shadow-[0_0_25px_rgba(16,185,129,0.2)] ring-1 ring-emerald-400/40"
                    : "bg-[#111215] hover:bg-[#16181d] border-white/10 hover:border-white/25"
                )}
              >
                {/* Active Indicator Top Line */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 animate-pulse" />
                )}

                <div>
                  {/* Icon & Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={cn(
                      "text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider",
                      sol.accent
                    )}>
                      {sol.tag}
                    </span>
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                      isActive ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/40" : "bg-white/10 text-white"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-extrabold text-white mb-1.5 leading-snug group-hover/card:text-emerald-300 transition-colors flex items-center gap-1.5">
                    <span>{sol.emoji}</span>
                    <span className="truncate">{sol.title}</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
                    {sol.description}
                  </p>
                </div>

                {/* Feature Bullet Points */}
                <div className="pt-2 border-t border-white/10 space-y-1">
                  {sol.features.slice(0, 2).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 4. ENTERPRISE TRUST & CAPABILITIES FOOTER BAR ── */}
        <div className="bg-[#141519] border border-white/10 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono font-medium text-slate-300">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Custom Microservices</span>
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Enterprise-Grade Security</span>
            </span>
            <span className="flex items-center gap-2 hidden sm:flex">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>99.9% Uptime SLA</span>
            </span>
          </div>

          <Link
            href="/solutions"
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-emerald-400 text-[#0c0d0e] font-extrabold text-xs uppercase tracking-wider transition-all shadow-md group shrink-0"
          >
            <span>Explore All Solutions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

    </div>
  );
}

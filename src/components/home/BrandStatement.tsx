'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Lock,
  GitBranch
} from 'lucide-react';

interface ArchPillar {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  tag: string;
  metric: string;
}

const ARCH_PILLARS: ArchPillar[] = [
  {
    id: 'decoupled',
    number: '01',
    title: 'Decoupled Service Boundaries',
    subtitle: 'MODULAR ARCHITECTURE',
    description: 'We isolate domain logic into autonomous microservices to eliminate cascading failures, ensure zero single-point-of-failure, and allow rapid feature iteration.',
    icon: Layers,
    tag: 'FAULT ISOLATION',
    metric: 'ZERO DOWNTIME RELEASES',
  },
  {
    id: 'realtime',
    number: '02',
    title: 'Real-Time Stream Processing',
    subtitle: 'HIGH-THROUGHPUT PIPELINES',
    description: 'Sub-millisecond event-driven pipelines powered by asynchronous message queues and in-memory caches for instantaneous enterprise state synchronization.',
    icon: Cpu,
    tag: 'LOW LATENCY',
    metric: '< 18ms DATA PROPAGATION',
  },
  {
    id: 'cloud-mesh',
    number: '03',
    title: 'Distributed Cloud Mesh',
    subtitle: 'EDGE & MULTI-REGION',
    description: 'Global infrastructure topologies deployed across containerized clusters with automated horizontal autoscaling and intelligent edge request routing.',
    icon: Database,
    tag: 'ELASTIC SCALE',
    metric: '99.99% GUARANTEED SLA',
  },
  {
    id: 'security',
    number: '04',
    title: 'Zero-Trust Security & Audit',
    subtitle: 'ENTERPRISE GOVERNANCE',
    description: 'Every endpoint, database query, and user session is validated with strict cryptographic tokens, role-based authorization, and immutable audit logs.',
    icon: ShieldCheck,
    tag: 'CRYPTOGRAPHIC AUDIT',
    metric: 'SOC-2 COMPLIANT POSTURE',
  },
];

const COMMERCIAL_OUTCOMES = [
  {
    icon: GitBranch,
    label: '100% CODE OWNERSHIP',
    desc: 'You receive complete source code, deployment scripts, and intellectual property rights with zero proprietary lock-in.',
  },
  {
    icon: Zap,
    label: 'ZERO-FRICTION SCALE',
    desc: 'Modular architectures designed to scale from initial rollout to hundreds of thousands of concurrent users effortlessly.',
  },
  {
    icon: Lock,
    label: 'DIRECT DATA CONTROL',
    desc: 'Your business intelligence stays on your dedicated infrastructure with full sovereign data governance.',
  },
];

export function BrandStatement() {
  const [activePillar, setActivePillar] = React.useState<number>(0);

  return (
    <section 
      id="brand-statement"
      className="w-full bg-[#0c0d11] text-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background Subtle Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(16,185,129,0.12),transparent_75%)] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CORE METHODOLOGY &amp; PHILOSOPHY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase mb-4 sm:mb-6">
            <span className="block">Strategy</span>
            <span className="text-emerald-400 font-mono text-2xl sm:text-4xl my-1 sm:my-2 block">×</span>
            <span className="block">Design</span>
            <span className="text-cyan-400 font-mono text-2xl sm:text-4xl my-1 sm:my-2 block">×</span>
            <span className="block">Technology</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            We bridge the chasm between commercial ambition and technical execution through rigorous engineering principles, enterprise resilience, and modern software architecture.
          </p>
        </div>

        {/* 4 Architectural Pillars Grid: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {ARCH_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isSelected = activePillar === idx;
            return (
              <div
                key={pillar.id}
                onClick={() => setActivePillar(idx)}
                className={`p-6 sm:p-7 rounded-2xl sm:rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#16171d] border-emerald-500/40 shadow-xl ring-1 ring-emerald-500/30'
                    : 'bg-[#121318]/80 border-white/10 hover:border-white/20 hover:bg-[#14151b]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {pillar.number}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2">
                    {pillar.subtitle}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-[10px] sm:text-[11px] text-slate-400 uppercase">
                    {pillar.tag}
                  </span>
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold text-emerald-400">
                    {pillar.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Commercial Outcomes Grid: 1 col on mobile, 3 cols on tablet/desktop */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#141416]/90 border border-white/15 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {COMMERCIAL_OUTCOMES.map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-start text-left">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shrink-0">
                    <ItemIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm sm:text-base font-mono font-bold text-white tracking-wider uppercase mb-2">
                    {item.label}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

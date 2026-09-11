'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Workflow, 
  Database, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

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
    label: '100% CODE OWNERSHIP',
    desc: 'You receive complete source code, deployment scripts, and intellectual property rights with zero proprietary lock-in.',
  },
  {
    label: 'ZERO-FRICTION SCALE',
    desc: 'Modular architectures designed to scale from initial rollout to hundreds of thousands of concurrent users effortlessly.',
  },
  {
    label: 'DIRECT DATA CONTROL',
    desc: 'Your business intelligence stays on your dedicated infrastructure with full sovereign data governance.',
  },
];

export function TechnologyStatement() {
  const [activePillar, setActivePillar] = React.useState<number>(0);

  return (
    <section 
      id="technology-statement"
      className="w-full bg-[#0c0d11] text-white py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden"
    >
      {/* Background Architectural Mesh & Subtle Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(16,185,129,0.12),transparent_75%)] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Precision Technical Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* ── STAGE 1: THE ENGINEERING PHILOSOPHY ── */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-20">
          
          {/* Category Capsule */}
          <ScrollReveal yOffset={14} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-slate-200 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>OHO ENGINEERING PHILOSOPHY // HOW WE THINK</span>
            </div>
          </ScrollReveal>

          {/* Large Editorial Headline */}
          <ScrollReveal yOffset={22} duration={0.7} delay={0.1}>
            <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-6">
              Technology should not create complexity.{' '}
              <span className="text-emerald-400 block sm:inline">It should remove it.</span>
            </h2>
          </ScrollReveal>

          {/* Editorial Narrative */}
          <ScrollReveal yOffset={18} duration={0.65} delay={0.2}>
            <p className="text-sm sm:text-lg text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
              At OHO TECH, we treat every software system as a long-term commercial asset. We engineer digital infrastructure that simplifies business operations, automates critical workflows, and delivers uninterrupted computational reliability.
            </p>
          </ScrollReveal>
        </div>

        {/* ── STAGE 2: HOW TECHNOLOGY BECOMES LIVING SYSTEMS ── */}
        <div className="mb-14 sm:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-[0.2em] block mb-1">
                SYSTEM DECOMPOSITION
              </span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                Four Pillars of Resilient Architecture
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Deterministic Engineering • Zero Latency Overhead
            </span>
          </div>

          {/* 4 Pillars Interactive Architectural Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {ARCH_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isSelected = activePillar === idx;
              return (
                <div
                  key={pillar.id}
                  onClick={() => setActivePillar(idx)}
                  className={`relative p-6 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isSelected 
                      ? 'bg-[#141720] border-emerald-500/60 shadow-[0_15px_40px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30' 
                      : 'bg-[#101217]/80 border-white/10 hover:border-white/20 hover:bg-[#14161d]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-slate-300 border border-white/10'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                          {pillar.subtitle}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white">
                          {pillar.title}
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full shrink-0">
                      [{pillar.number}]
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {pillar.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] font-mono">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Workflow className="w-3.5 h-3.5 text-emerald-400" />
                      {pillar.tag}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {pillar.metric}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── STAGE 3: COMMERCIAL TRANSLATION (HOW SYSTEMS SERVE BUSINESS) ── */}
        <div className="p-6 sm:p-10 rounded-3xl bg-[#141720]/90 border border-white/15 mb-12 shadow-xl backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                VALUE CONVERSION
              </span>
              <h4 className="text-lg sm:text-2xl font-bold text-white">
                From Clean Code to Enterprise Velocity
              </h4>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase font-mono tracking-wider group"
            >
              <span>Read Full Architecture Whitepaper</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {COMMERCIAL_OUTCOMES.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── STAGE 4: SEAMLESS TRANSITION CONDUIT INTO SERVICES ── */}
        <div className="text-center pt-2 flex flex-col items-center justify-center">
          <div className="inline-flex flex-col items-center gap-2 group cursor-pointer">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-400 group-hover:text-emerald-400 transition-colors">
              SYSTEMS IN PRACTICE // EXPLORE 6 CORE SERVICE VERTICALS
            </span>
            <ChevronDown className="w-4 h-4 text-emerald-400 animate-bounce" />
          </div>
        </div>

      </div>
    </section>
  );
}

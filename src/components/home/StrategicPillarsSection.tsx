'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Cpu,
  Globe,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Layers,
  Code2,
} from 'lucide-react';

interface PillarItem {
  id: string;
  direction: string;
  title: string;
  description: string;
  icon: React.ElementType;
  accentColor: 'emerald' | 'cyan' | 'amber' | 'indigo';
  features: string[];
}

const PILLARS: PillarItem[] = [
  {
    id: 'bespoke-software',
    direction: 'DIRECTION 01',
    title: 'Bespoke Software Engineering',
    description:
      'Tailored software applications engineered around exact client operational workflows rather than rigid off-the-shelf templates.',
    icon: Cpu,
    accentColor: 'emerald',
    features: ['Custom Architecture', 'Workflow Automation', 'API & Integration'],
  },
  {
    id: 'web-mobile-platforms',
    direction: 'DIRECTION 02',
    title: 'Web & Mobile Platforms',
    description:
      'High-performance web applications, customer portals, and native mobile apps designed for daily user productivity.',
    icon: Globe,
    accentColor: 'cyan',
    features: ['Fluid Responsive UI', 'Cross-Platform Sync', 'Sub-Second Latency'],
  },
  {
    id: 'digital-growth',
    direction: 'DIRECTION 03',
    title: 'Digital Growth Engine',
    description:
      'Data-focused search engine optimization, Google & Meta advertising campaigns, and strategic brand positioning.',
    icon: TrendingUp,
    accentColor: 'amber',
    features: ['Targeted Acquisition', 'Conversion Optimization', 'Performance Analytics'],
  },
  {
    id: 'long-term-scalability',
    direction: 'DIRECTION 04',
    title: 'Long-Term Scalability',
    description:
      'Modular software infrastructure and technical support ensuring your digital products scale cleanly as your business expands.',
    icon: ShieldCheck,
    accentColor: 'indigo',
    features: ['Modular Microservices', 'Continuous Support', 'High Availability'],
  },
];

const ACCENT_STYLES = {
  emerald: {
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-slate-950',
    glow: 'hover:shadow-emerald-500/10 hover:border-emerald-500/40',
    topBar: 'from-emerald-500/80 via-emerald-400 to-emerald-500/80',
    checkColor: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
  },
  cyan: {
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 group-hover:bg-cyan-400 group-hover:text-slate-950',
    glow: 'hover:shadow-cyan-500/10 hover:border-cyan-500/40',
    topBar: 'from-cyan-500/80 via-cyan-400 to-cyan-500/80',
    checkColor: 'text-cyan-400',
    dotColor: 'bg-cyan-400',
  },
  amber: {
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30 group-hover:bg-amber-400 group-hover:text-slate-950',
    glow: 'hover:shadow-amber-500/10 hover:border-amber-500/40',
    topBar: 'from-amber-500/80 via-amber-400 to-amber-500/80',
    checkColor: 'text-amber-400',
    dotColor: 'bg-amber-400',
  },
  indigo: {
    badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 group-hover:bg-indigo-400 group-hover:text-slate-950',
    glow: 'hover:shadow-indigo-500/10 hover:border-indigo-500/40',
    topBar: 'from-indigo-500/80 via-indigo-400 to-indigo-500/80',
    checkColor: 'text-indigo-400',
    dotColor: 'bg-indigo-400',
  },
};

export function StrategicPillarsSection() {
  return (
    <div className="w-full">
      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          const style = ACCENT_STYLES[pillar.accentColor];

          return (
            <div
              key={pillar.id}
              className={`group relative rounded-3xl bg-gradient-to-b from-[#131b2e] via-[#0d1424] to-[#090d18] border border-slate-800/90 ${style.glow} transition-all duration-300 p-7 flex flex-col justify-between overflow-hidden shadow-xl hover:-translate-y-1.5`}
            >
              {/* Top Solid Accent Highlight Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.topBar} opacity-80 group-hover:opacity-100 transition-opacity`}
              />

              {/* Top Info & Icon Block */}
              <div>
                {/* Header Row: Direction Badge + Icon Pod */}
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border shadow-xs ${style.badgeBg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dotColor}`} />
                    {pillar.direction}
                  </span>

                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300 shadow-md ${style.iconBg}`}
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white tracking-tight leading-snug mb-3 group-hover:text-white transition-colors">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
                  {pillar.description}
                </p>
              </div>

              {/* Feature Highlights Footer */}
              <div className="pt-5 border-t border-slate-800/80 space-y-2.5 mt-auto">
                {pillar.features.map((feature, fIdx) => (
                  <div
                    key={fIdx}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#080d1a]/80 border border-slate-800/80 text-[11px] font-mono text-slate-200 group-hover:border-slate-700/80 transition-colors"
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${style.checkColor}`} />
                    <span className="font-semibold tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Solid Command Banner Bar */}
      <div className="bg-gradient-to-r from-[#0d1424] via-[#11192e] to-[#0d1424] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-2xl">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono font-bold">
          <span className="flex items-center gap-2.5 text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Goal-Oriented Software
          </span>

          <span className="flex items-center gap-2.5 text-cyan-400 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Clean Code Architecture
          </span>

          <span className="flex items-center gap-2.5 text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Direct Founder Leadership
          </span>
        </div>

        <Link
          href="/about"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] shrink-0"
        >
          <span>Learn More About Us</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

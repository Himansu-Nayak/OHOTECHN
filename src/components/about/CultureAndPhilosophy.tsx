'use client';

import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Code2, 
  HeartHandshake, 
  Zap, 
  Layers, 
  Users, 
  CheckCircle2,
  Lock
} from 'lucide-react';

export function CultureAndPhilosophy() {
  const values = [
    {
      num: '01',
      title: 'Technical Precision & Craftsmanship',
      subtitle: 'ZERO-COMPROMISE RUNTIMES',
      desc: 'We treat software as mission-critical civil infrastructure. Every database query, state mutation, and API contract is engineered for sub-second execution, strict ACID compliance, and zero runtime crashes.',
      icon: Code2,
      accent: '#10b981'
    },
    {
      num: '02',
      title: '100% Code Sovereignty',
      subtitle: 'ZERO PROPRIETARY LOCK-IN',
      desc: 'Our clients receive full Git source code repositories, container manifests, and database migrations. You retain complete sovereignty over your intellectual property and data assets forever.',
      icon: Lock,
      accent: '#06b6d4'
    },
    {
      num: '03',
      title: 'Radical Transparency & SLA Backing',
      subtitle: 'DIRECT ARCHITECT ACCESS',
      desc: 'We eliminate sales middlemen. Clients collaborate directly with our lead system architects. Every milestone is backed by transparent commitments, predictable timelines, and rigorous documentation.',
      icon: ShieldCheck,
      accent: '#3b82f6'
    },
    {
      num: '04',
      title: 'Integrated Commercial Velocity',
      subtitle: 'CODE × MARKET REACH',
      desc: 'Clean architecture exists to power commercial growth. We couple robust backend systems with omnichannel growth engines, search optimization, and performance campaigns that reach hundreds of millions.',
      icon: Zap,
      accent: '#f59e0b'
    }
  ];

  const culturePillars = [
    {
      title: 'Domain Immersion',
      desc: 'Our engineers don’t just write code behind closed doors; we study real hospital ward rounds, retail checkout counters, and university exam branches to understand physical friction points.'
    },
    {
      title: 'Peer Architecture Reviews',
      desc: 'Every schema migration, microservice boundary, and security policy undergoes rigorous peer scrutiny to eliminate technical debt before deployment.'
    },
    {
      title: 'Long-Term Partnership',
      desc: 'We measure our success not by software handover, but by how reliably our platforms scale years after initial launch.'
    }
  ];

  return (
    <section className="mb-20 sm:mb-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>03 • VALUES &amp; CULTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Philosophy &amp; Principles
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md">
          The foundational beliefs that guide our engineering choices, team culture, and client relationships.
        </p>
      </div>

      {/* 4 Core Values Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {values.map((v, idx) => {
          const VIcon = v.icon;
          return (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-[#111216]/90 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl relative overflow-hidden group"
            >
              {/* Corner Glow */}
              <div 
                className="absolute -top-24 -right-24 w-52 h-52 rounded-full blur-[110px] pointer-events-none opacity-15 group-hover:opacity-30 transition-opacity"
                style={{ backgroundColor: v.accent }}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    PRINCIPLE • {v.num}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                    <VIcon className="w-4 h-4" />
                  </div>
                </div>

                <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
                  {v.subtitle}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-3 font-sans">
                  {v.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {v.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 font-mono text-[10px] text-slate-400 uppercase flex items-center justify-between">
                <span>COMMITMENT • SLA GUARANTEED</span>
                <span className="text-emerald-400 font-bold">100% VERIFIED</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Developer Culture Strip */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#14151a] border border-white/15 shadow-2xl">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
          <Users className="w-4 h-4" />
          <span>ENGINEERING CULTURE &amp; CRAFT</span>
        </div>

        <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight mb-6 font-sans">
          How Our Engineers Think &amp; Work
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {culturePillars.map((cp, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="font-mono text-xs font-bold text-white uppercase flex items-center gap-2">
                <span className="text-emerald-400">0{idx + 1} •</span>
                <span>{cp.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {cp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

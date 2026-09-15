'use client';

import React from 'react';
import Image from 'next/image';
import { 
  History, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  TrendingUp, 
  Layers, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export function CompanyStory() {
  const storyMilestones = [
    {
      year: 'THE FOUNDING INSIGHT',
      title: 'Breaking The Proprietary Lock-In Trap',
      desc: 'Enterprises were trapped between rigid, expensive legacy software that refused to integrate and fragile freelance patches that crashed under load. OHO TECH was founded to engineer battle-tested software systems delivered with 100% client code ownership.',
      icon: ShieldCheck
    },
    {
      year: 'THE DUAL-ENGINE ARCHITECTURE',
      title: 'Software Engineering × Commercial Growth',
      desc: 'Clean code alone is insufficient without market velocity. We established our dual-pillar model: pairing high-throughput distributed software platforms with data-driven performance marketing campaigns that have generated over 670M+ reach.',
      icon: TrendingUp
    },
    {
      year: 'TURNKEY PLATFORM ECOSYSTEM',
      title: '13 Specialized Industry Solutions',
      desc: 'From OPD/IPD Hospital EMR and Multi-Campus University ERP to Offline-First Retail POS and Hotel PropertyOS, we engineered modular software foundations that deploy rapidly without starting from scratch.',
      icon: Cpu
    }
  ];

  return (
    <section className="mb-20 sm:mb-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            <span>01 // ORIGINS &amp; EVOLUTION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            The OHO TECH Story
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md">
          How a commitment to deterministic engineering and code sovereignty became an ecosystem spanning 13 industries.
        </p>
      </div>

      {/* Main Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
        
        {/* Left 7 Columns: Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <div className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed space-y-4">
            <p>
              OHO TECH was established by <strong className="text-white font-bold">Japabandhu Kampa</strong> with a single clear directive: to engineer high-performance digital tools and turnkey software applications that deliver tangible business metrics.
            </p>
            <p className="text-slate-400">
              In traditional software development, organizations are constantly subjected to vendor lock-in, opaque pricing models, and architectures that degrade as concurrency grows. OHO TECH set out to establish a transparent, SLA-backed alternative where clients receive complete intellectual property ownership, rigorous architectural documentation, and direct access to lead system engineers.
            </p>
            <p>
              Today, OHO TECH powers critical daily workflows for multi-department hospitals, state universities, retail networks, and boutique luxury resorts while running performance digital growth campaigns reaching hundreds of millions of consumers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-[#111216] border border-white/10 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-bold block mb-0.5">Zero Proprietary Lock-In</span>
                <span className="text-slate-400 text-[11px]">Full Git repos, Dockerfiles &amp; DB schemas handed over</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#111216] border border-white/10 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-bold block mb-0.5">SLA-Backed Production</span>
                <span className="text-slate-400 text-[11px]">Guaranteed uptime, sub-second latency budgets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Studio Photo Showcase */}
        <div className="lg:col-span-5">
          <div className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl group">
            <Image
              src="/oho_tech_dev_team_background.png"
              alt="OHO TECH Software Engineering & Studio Environment"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono">
              <div className="text-emerald-400 font-bold mb-0.5">OHO TECH STUDIO LABS</div>
              <div className="text-slate-300 text-[11px]">Where high-concurrency systems &amp; spatial UI meet</div>
            </div>
          </div>
        </div>

      </div>

      {/* 3 Pillars Progression Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {storyMilestones.map((item, idx) => {
          const ItemIcon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-[#121316]/90 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4 font-mono text-xs">
                  <span className="text-emerald-400 font-bold">{item.year}</span>
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                    <ItemIcon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg font-black text-white tracking-tight mb-2 font-sans">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 font-mono text-[10px] text-slate-400 uppercase">
                CORE OPERATIONAL DIRECTIVE // 0{idx + 1}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}

'use client';

import * as React from 'react';
import { Target, Globe, Sliders, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function WhyChooseSection() {
  const differentiators = [
    {
      title: 'Solutions Built Around Requirements',
      desc: 'We design software that adapts to your operational workflows rather than forcing your team into rigid templates.',
      icon: Target,
      tag: 'Tailored Workflows',
      color: 'emerald',
    },
    {
      title: 'Technology & Growth Under One Roof',
      desc: 'We combine custom engineering with data-driven marketing strategy so your digital products attract active users.',
      icon: Globe,
      tag: 'Integrated Execution',
      color: 'cyan',
    },
    {
      title: 'Modular & Adaptable Systems',
      desc: 'Our applications are structured to evolve cleanly as your business expands into new markets and capabilities.',
      icon: Sliders,
      tag: 'Future-Proof Code',
      color: 'amber',
    },
    {
      title: 'Usability & Long-Term Scalability',
      desc: 'We focus on intuitive UI design for high daily productivity backed by clean, maintainable software architecture.',
      icon: ShieldCheck,
      tag: 'Enterprise Reliability',
      color: 'indigo',
    },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-16 bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm" id="why-oho-tech">
      
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          WHY OHO TECH
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-4">
          Built for long-term business value.
        </h2>

        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          We combine bespoke software engineering with growth strategy to help companies operate efficiently and scale sustainably.
        </p>
      </div>

      {/* 4 Solid Premium Differentiators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {differentiators.map((diff, idx) => {
          const Icon = diff.icon;
          return (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-gradient-to-b from-[#131b2e] via-[#0d1424] to-[#090d18] border border-slate-800 text-white shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 shadow-md">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 uppercase tracking-wider">
                    {diff.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  {diff.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed max-w-lg mb-6">
                  {diff.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Engineered for Performance</span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}

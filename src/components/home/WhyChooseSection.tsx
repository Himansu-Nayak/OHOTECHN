'use client';

import * as React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function WhyChooseSection() {
  const differentiators = [
    {
      title: 'Solutions Built Around Requirements',
      desc: 'We design software that adapts to your operational workflows rather than forcing your team into rigid templates.',
      emoji: '🎯',
    },
    {
      title: 'Technology & Growth Under One Roof',
      desc: 'We combine custom engineering with data-driven marketing strategy so your digital products attract active users.',
      emoji: '🌐',
    },
    {
      title: 'Modular & Adaptable Systems',
      desc: 'Our applications are structured to evolve cleanly as your business expands into new markets and capabilities.',
      emoji: '⚙️',
    },
    {
      title: 'Usability & Long-Term Scalability',
      desc: 'We focus on intuitive UI design for high daily productivity backed by clean, maintainable software architecture.',
      emoji: '🛡️',
    },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-16 bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden" id="why-oho-tech">
      
      {/* Outer Section Header */}
      <div className="max-w-3xl mb-12 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          WHY OHO TECH 🛡️
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-4">
          Built for long-term business value.
        </h2>

        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          We combine bespoke software engineering with growth strategy to help companies operate efficiently and scale sustainably.
        </p>
      </div>

      {/* Inner Dark Console Card */}
      <div className="bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 shadow-2xl relative overflow-hidden grid-pattern-dark">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 4 Differentiators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
          {differentiators.map((diff, idx) => {
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#141416] border border-white/10 hover:border-emerald-400/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all duration-300 flex flex-col justify-between group backdrop-blur-xl"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                    {diff.emoji}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                    <span>{diff.emoji}</span>
                    <span>{diff.title}</span>
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                    {diff.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>OHO TECH Core Differentiator</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}

'use client';

import * as React from 'react';
import { Target, Layers, Sliders, ShieldCheck } from 'lucide-react';

export function WhyChooseSection() {
  const differentiators = [
    {
      title: 'Solutions Built Around Requirements',
      desc: 'We design software that adapts to your operational workflows rather than forcing your team into rigid templates.',
      icon: Target,
    },
    {
      title: 'Technology & Growth Under One Roof',
      desc: 'We combine custom engineering with data-driven marketing strategy so your digital products attract active users.',
      icon: Layers,
    },
    {
      title: 'Modular & Adaptable Systems',
      desc: 'Our applications are structured to evolve cleanly as your business expands into new markets and capabilities.',
      icon: Sliders,
    },
    {
      title: 'Usability & Long-Term Scalability',
      desc: 'We focus on intuitive UI design for high daily productivity backed by clean, maintainable software architecture.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-16 bg-[#fafafa] border border-slate-200/80 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm" id="why-oho-tech">
      
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-4">
          08 / WHY OHO TECH
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-4">
          Built for long-term business value.
        </h2>

        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          We combine bespoke software engineering with growth strategy to help companies operate efficiently and scale sustainably.
        </p>
      </div>

      {/* 4 Differentiators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {differentiators.map((diff, idx) => {
          const Icon = diff.icon;
          return (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-slate-400 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-[#0d0d0e] mb-3">
                  {diff.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                  {diff.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}

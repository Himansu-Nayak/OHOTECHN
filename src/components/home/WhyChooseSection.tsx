'use client';

import * as React from 'react';

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
    <section className="max-w-[1536px] w-full mx-auto mb-16 bg-[#fafafa] border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm" id="why-oho-tech">
      
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-block text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest mb-4">
          08 / WHY OHO TECH 🛡️
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
          return (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border-2 border-slate-200 hover:border-emerald-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                  {diff.emoji}
                </div>

                <h3 className="text-xl font-bold text-[#0d0d0e] mb-3 flex items-center gap-2">
                  <span>{diff.emoji}</span>
                  <span>{diff.title}</span>
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
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

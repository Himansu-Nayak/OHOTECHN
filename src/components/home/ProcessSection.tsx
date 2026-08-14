'use client';

import * as React from 'react';

export function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      desc: 'Understand business requirements, target audience, and operational goals.',
      emoji: '🔍',
    },
    {
      num: '02',
      title: 'Plan',
      desc: 'Define the right technical approach, system architecture, and project scope.',
      emoji: '🧭',
    },
    {
      num: '03',
      title: 'Design & Build',
      desc: 'Engineer the software, design user interfaces, and perform quality testing.',
      emoji: '💻',
    },
    {
      num: '04',
      title: 'Launch',
      desc: 'Deploy the solution to live production servers with seamless transition.',
      emoji: '🚀',
    },
    {
      num: '05',
      title: 'Support & Improve',
      desc: 'Provide ongoing technical support, system maintenance, and enhancements.',
      emoji: '🔄',
    },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-16 bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm" id="how-we-work">
      
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-block text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest mb-4">
          07 / HOW WE WORK ⚡
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-4">
          A clear, structured delivery process.
        </h2>

        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
          We follow a transparent end-to-end methodology from initial discovery to long-term operational support.
        </p>
      </div>

      {/* 5 Process Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {steps.map((step) => {
          return (
            <div
              key={step.num}
              className="p-6 rounded-3xl bg-[#fafafa] border-2 border-slate-200 hover:border-emerald-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="w-9 h-9 rounded-xl bg-[#0d0d0e] text-white flex items-center justify-center font-mono text-xs font-bold">
                    {step.num}
                  </span>
                  <span className="text-2xl group-hover:scale-110 transition-transform">{step.emoji}</span>
                </div>

                <h3 className="text-base font-bold text-[#0d0d0e] mb-2 flex items-center gap-1.5">
                  <span>{step.emoji}</span>
                  <span>{step.title}</span>
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}

'use client';

import * as React from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export function ProcessSection() {
  const steps = [
    {
      num: '01',
      phase: 'PHASE 01',
      title: 'Discover',
      subtitle: 'Business Requirements & Goals',
      desc: 'Understand operational workflows, business goals, target user personas, and technical constraints.',
      emoji: '🔍',
      deliverable: 'PRD & Scope Blueprint',
    },
    {
      num: '02',
      phase: 'PHASE 02',
      title: 'Plan',
      subtitle: 'System Architecture & UX',
      desc: 'Define system architecture, microservices data models, tech stack selection, and wireframe prototypes.',
      emoji: '🧭',
      deliverable: 'System Architecture Doc',
    },
    {
      num: '03',
      phase: 'PHASE 03',
      title: 'Design & Build',
      subtitle: 'Agile Code & Integration',
      desc: 'Engineer custom software, craft atomic UI design systems, build APIs, and perform automated QA testing.',
      emoji: '💻',
      deliverable: 'Production Ready Build',
    },
    {
      num: '04',
      phase: 'PHASE 04',
      title: 'Launch',
      subtitle: 'Production Server Deployment',
      desc: 'Deploy software to cloud infrastructure with zero-downtime transition, SSL, and monitoring.',
      emoji: '🚀',
      deliverable: 'Live Production SLA',
    },
    {
      num: '05',
      phase: 'PHASE 05',
      title: 'Support & Scale',
      subtitle: 'Continuous Maintenance',
      desc: 'Provide ongoing technical support, system updates, analytics tracking, and feature scaling.',
      emoji: '🔄',
      deliverable: '24/7 SLA Support',
    },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-16 bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden" id="how-we-work">
      
      {/* Outer Section Header */}
      <div className="max-w-4xl mb-12 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          DELIVERY METHODOLOGY ROADMAP ⚡
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-4">
          5-Phase Software Engineering Roadmap.
        </h2>

        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-3xl">
          We follow a transparent 5-phase software delivery roadmap from initial requirements discovery to live deployment and long-term scaling.
        </p>
      </div>

      {/* Inner Dark Console Card */}
      <div className="bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 shadow-2xl relative overflow-hidden grid-pattern-dark">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Horizontal Connected Roadmap Track (Desktop Only) */}
        <div className="hidden lg:block relative mb-12 px-6 z-10">
          {/* Continuous Horizontal Gradient Track Line */}
          <div className="w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 rounded-full shadow-[0_0_12px_#10b981]" />

          {/* 5 Milestone Node Badges Positioned Along Track */}
          <div className="flex items-center justify-between -mt-5 relative z-10 px-4">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#141416] text-white border-2 border-emerald-400 font-mono text-xs font-black flex items-center justify-center shadow-lg">
                  {s.num}
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden xl:flex items-center text-emerald-400 text-xs font-mono font-bold">
                    <span>➔</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5 Connected Process Steps Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
          {steps.map((step, idx) => {
            return (
              <div
                key={step.num}
                className="p-6 sm:p-7 rounded-3xl bg-[#141416] border border-white/10 hover:border-emerald-400/60 transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl relative overflow-hidden backdrop-blur-xl"
              >
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div>
                  {/* Step Top Header: Number Pill & Emoji */}
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono text-xs font-black">
                        {step.num}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {step.phase}
                      </span>
                    </div>

                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                      {step.emoji}
                    </span>
                  </div>

                  {/* Step Title & Subtitle */}
                  <h3 className="text-lg font-extrabold text-white mb-1 flex items-center gap-1.5 group-hover:text-emerald-400 transition-colors">
                    <span>{step.emoji}</span>
                    <span>{step.title}</span>
                  </h3>

                  <div className="text-[11px] font-mono text-emerald-400 font-semibold mb-3">
                    {step.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {step.desc}
                  </p>
                </div>

                {/* Deliverable Badge Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <div className="flex items-center gap-1.5 text-slate-200 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{step.deliverable}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Roadmap Summary Bar */}
        <div className="mt-10 bg-[#18181c] text-white rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs sm:text-sm font-mono text-slate-200 font-semibold">
              ESTIMATED PROJECT TIMELINE: 4 TO 12 WEEKS DEPENDING ON SCOPE
            </span>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <span>AGILE ROADMAP METHODOLOGY</span>
            <span>⚡</span>
          </div>
        </div>

      </div>

    </section>
  );
}

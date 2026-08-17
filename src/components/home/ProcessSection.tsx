'use client';

import * as React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Search,
  Compass,
  Code2,
  Rocket,
  RefreshCw,
} from 'lucide-react';

export function ProcessSection() {
  const steps = [
    {
      num: '01',
      phase: 'PHASE 01',
      title: 'Discover',
      subtitle: 'Requirements & Scope',
      desc: 'Understand operational workflows, business goals, target user personas, and technical constraints.',
      icon: Search,
      deliverable: 'PRD & Scope Blueprint',
      color: 'emerald',
    },
    {
      num: '02',
      phase: 'PHASE 02',
      title: 'Plan',
      subtitle: 'Architecture & UX',
      desc: 'Define system architecture, microservices data models, tech stack selection, and wireframe prototypes.',
      icon: Compass,
      deliverable: 'Architecture Doc',
      color: 'cyan',
    },
    {
      num: '03',
      phase: 'PHASE 03',
      title: 'Design & Build',
      subtitle: 'Agile Engineering',
      desc: 'Engineer custom software, craft atomic UI design systems, build APIs, and perform automated QA testing.',
      icon: Code2,
      deliverable: 'Production Build',
      color: 'sky',
    },
    {
      num: '04',
      phase: 'PHASE 04',
      title: 'Launch',
      subtitle: 'Server Deployment',
      desc: 'Deploy software to cloud infrastructure with zero-downtime transition, SSL, and monitoring.',
      icon: Rocket,
      deliverable: 'Live Production SLA',
      color: 'amber',
    },
    {
      num: '05',
      phase: 'PHASE 05',
      title: 'Support & Scale',
      subtitle: '24/7 SLA Support',
      desc: 'Provide ongoing technical support, system updates, analytics tracking, and feature scaling.',
      icon: RefreshCw,
      deliverable: 'Continuous Support',
      color: 'indigo',
    },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-16 bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden" id="how-we-work">
      
      {/* Section Header */}
      <div className="max-w-4xl mb-16 text-left">
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

      {/* Horizontal Connected Roadmap Track (Desktop Only) */}
      <div className="hidden lg:block relative mb-12 px-6">
        <div className="w-full h-2 bg-gradient-to-r from-emerald-500 via-cyan-500 via-sky-500 via-amber-500 to-indigo-500 rounded-full shadow-[0_0_12px_#10b981]" />

        {/* 5 Milestone Node Badges Positioned Along Track */}
        <div className="flex items-center justify-between -mt-5 relative z-10 px-4">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0d0d0e] text-white border-2 border-emerald-400 font-mono text-xs font-black flex items-center justify-center shadow-lg">
                {s.num}
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden xl:flex items-center text-slate-400 text-xs font-mono font-bold">
                  <span>➔</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5 Connected Process Steps Roadmap Grid (Solid Dark Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;

          return (
            <div
              key={step.num}
              className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#131b2e] via-[#0d1424] to-[#090d18] border border-slate-800 text-white shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Highlight Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-80 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Step Top Header: Number Pill & Icon Pod */}
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 text-white flex items-center justify-center font-mono text-xs font-bold shadow-md">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {step.phase}
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                </div>

                {/* Step Title & Subtitle */}
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-white transition-colors">
                  {step.title}
                </h3>

                <div className="text-[11px] font-mono text-emerald-400 font-semibold mb-3">
                  {step.subtitle}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
                  {step.desc}
                </p>
              </div>

              {/* Deliverable Badge Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{step.deliverable}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Roadmap Summary Bar */}
      <div className="mt-12 bg-gradient-to-r from-[#0d1424] via-[#11192e] to-[#0d1424] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-mono text-slate-200 font-semibold">
            ESTIMATED PROJECT TIMELINE: 4 TO 12 WEEKS DEPENDING ON SCOPE
          </span>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
          <span>AGILE ROADMAP METHODOLOGY</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

    </section>
  );
}

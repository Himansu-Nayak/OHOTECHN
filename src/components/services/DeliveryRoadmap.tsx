'use client';

import * as React from 'react';
import { Search, Palette, Code2, Rocket, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhaseStep {
  step: string;
  title: string;
  desc: string;
  timeframe: string;
  deliverables: string;
  icon: React.ElementType;
}

const steps: PhaseStep[] = [
  {
    step: '01',
    title: 'Discovery & Planning',
    desc: 'Analyzing technical requirements, audit goals, and mapping core architecture.',
    timeframe: 'Phase 01 • Week 1',
    deliverables: 'Architecture Map & Spec Audit',
    icon: Search,
  },
  {
    step: '02',
    title: 'Design & Strategy',
    desc: 'Crafting UI/UX prototypes, HTML5 & CSS3 design systems, and interactive UI component workflows.',
    timeframe: 'Phase 02 • Weeks 2 - 3',
    deliverables: 'HTML5 & CSS3 UI Layouts',
    icon: Palette,
  },
  {
    step: '03',
    title: 'Agile Execution',
    desc: 'Building high-performance codebases powered by JavaScript, React, and Next.js with continuous integration.',
    timeframe: 'Phase 03 • Weeks 4 - 6',
    deliverables: 'JavaScript & React Builds',
    icon: Code2,
  },
  {
    step: '04',
    title: 'QA & Production Launch',
    desc: 'Comprehensive end-to-end testing, cloud server deployment, performance tuning, and handoff.',
    timeframe: 'Phase 04 • Week 7+',
    deliverables: 'Live Deployment & Support',
    icon: Rocket,
  },
];

export function DeliveryRoadmap() {
  const [activeStep, setActiveStep] = React.useState<number>(0);

  return (
    <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm mb-10 overflow-hidden relative" id="service-process">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-2">
            DELIVERY METHODOLOGY
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] tracking-tight">
            How We Execute &amp; Deliver
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-700 bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span>4-PHASE STRUCTURED ROADMAP</span>
        </div>
      </div>

      {/* Desktop Horizontal Roadmap Track (lg screen) */}
      <div className="hidden lg:block relative my-8">
        {/* Main Horizontal Progress Connecting Line */}
        <div className="absolute top-12 left-[8%] right-[8%] h-1 bg-slate-200 rounded-full z-0">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* 4 Milestone Roadmap Steps Grid */}
        <div className="grid grid-cols-4 gap-6 relative z-10">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;

            return (
              <div
                key={index}
                onMouseEnter={() => setActiveStep(index)}
                onClick={() => setActiveStep(index)}
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* Node Circle along horizontal roadmap line */}
                <div
                  className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md border-2 mb-6 relative',
                    isActive
                      ? 'bg-sky-600 text-white border-sky-400 scale-110 shadow-sky-500/30 ring-4 ring-sky-500/20'
                      : isCompleted
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : 'bg-white text-slate-500 border-slate-300 group-hover:border-sky-400 group-hover:text-sky-600'
                  )}
                >
                  <Icon className="w-7 h-7 transition-transform group-hover:scale-110" />

                  {/* Step Badge Pill floating top-right of node */}
                  <span className={cn(
                    'absolute -top-3 -right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-xs',
                    isActive ? 'bg-slate-900 text-white border-slate-700' : 'bg-white text-slate-700 border-slate-200'
                  )}>
                    {item.step}
                  </span>
                </div>

                {/* Card Container */}
                <div
                  className={cn(
                    'w-full p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between min-h-[220px]',
                    isActive
                      ? 'bg-white border-sky-500 shadow-xl ring-2 ring-sky-500/10 -translate-y-2'
                      : 'bg-[#fafafa] border-slate-200 hover:border-slate-300 hover:bg-white'
                  )}
                >
                  <div>
                    <span className="text-[11px] font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md inline-block mb-3 border border-sky-200">
                      {item.timeframe}
                    </span>

                    <h3 className="text-base font-extrabold text-[#0d0d0e] mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>

                  {/* Deliverables Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] font-mono font-semibold text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{item.deliverables}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile & Tablet Vertical Connected Roadmap (sm / md screen) */}
      <div className="lg:hidden relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8 my-6">
        {steps.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeStep;

          return (
            <div
              key={index}
              onClick={() => setActiveStep(index)}
              className="relative group cursor-pointer"
            >
              {/* Vertical Node Indicator */}
              <div
                className={cn(
                  'absolute -left-[37px] sm:-left-[45px] top-1.5 w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 shadow-md',
                  isActive
                    ? 'bg-sky-600 text-white border-sky-400 scale-110 shadow-sky-500/30'
                    : 'bg-white text-slate-600 border-slate-300'
                )}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              {/* Milestone Content Card */}
              <div
                className={cn(
                  'p-6 rounded-3xl border-2 transition-all duration-300',
                  isActive
                    ? 'bg-white border-sky-500 shadow-xl'
                    : 'bg-[#fafafa] border-slate-200'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                    PHASE {item.step} • {item.timeframe}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-[#0d0d0e] mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.desc}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-mono font-semibold text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item.deliverables}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

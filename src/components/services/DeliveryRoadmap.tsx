'use client';

import * as React from 'react';
import { Search, Palette, Code2, Rocket, ArrowRight, Check, Play, Pause, ChevronLeft, ChevronRight, Clock, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhaseStep {
  step: string;
  title: string;
  desc: string;
  timeframe: string;
  deliverables: string;
  icon: React.ElementType;
  highlights: string[];
}

const steps: PhaseStep[] = [
  {
    step: '01',
    title: 'Discovery & Planning',
    desc: 'Analyzing technical requirements, audit goals, stakeholder expectations, and mapping core architecture.',
    timeframe: 'Phase 01 • Week 1',
    deliverables: 'Architecture Map & Spec Audit',
    icon: Search,
    highlights: [
      'Requirements gathering & technical constraint audit',
      'User story mapping & database schema specification',
      'System boundary & integration point definition',
    ],
  },
  {
    step: '02',
    title: 'Design & Strategy',
    desc: 'Crafting UI/UX wireframes, atomic design systems, and responsive interface workflows.',
    timeframe: 'Phase 02 • Weeks 2 - 3',
    deliverables: 'Design Systems & UI Spec',
    icon: Palette,
    highlights: [
      'High-fidelity interactive prototype creation',
      'Design token definition (colors, typography, grid)',
      'Accessibility (WCAG) & multi-device optimization',
    ],
  },
  {
    step: '03',
    title: 'Agile Execution',
    desc: 'Building high-performance full-stack applications with React, Next.js, Spring Boot & microservices.',
    timeframe: 'Phase 03 • Weeks 4 - 6',
    deliverables: 'Full-Stack Production Builds',
    icon: Code2,
    highlights: [
      'Modular frontend component & API integration',
      'Automated unit & integration test coverage',
      'Secure authentication & role-based permissions',
    ],
  },
  {
    step: '04',
    title: 'QA & Production Launch',
    desc: 'Comprehensive end-to-end testing, cloud server deployment, performance tuning, and 24/7 handoff.',
    timeframe: 'Phase 04 • Week 7+',
    deliverables: 'Live Deployment & Support',
    icon: Rocket,
    highlights: [
      'Zero-downtime cloud infrastructure deployment',
      'Real-time error tracking & telemetry setup',
      'Post-launch SLA support & continuous updates',
    ],
  },
];

export function DeliveryRoadmap() {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);

  // Auto-advance slideshow timer
  React.useEffect(() => {
    if (!isPlaying || isHovered) return;

    const intervalTime = 50;
    const totalTime = 4000;
    const increment = (intervalTime / totalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((current) => (current + 1) % steps.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, activeStep]);

  const handleSelectStep = (idx: number) => {
    setActiveStep(idx);
    setProgress(0);
  };

  const handleNextStep = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
    setProgress(0);
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
    setProgress(0);
  };

  const currentStep = steps[activeStep];
  const CurrentIcon = currentStep.icon;

  return (
    <section
      className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-6 sm:p-14 lg:p-16 shadow-sm mb-10 overflow-hidden relative"
      id="service-process"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Tour Play/Pause Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-2">
            DELIVERY METHODOLOGY ⚡
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] tracking-tight">
            How We Execute &amp; Deliver
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-sky-600 text-white text-xs font-mono font-bold transition-all shadow-md"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-sky-400" />
                <span>PAUSE TOUR</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                <span>PLAY TOUR</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
            <button
              onClick={handlePrevStep}
              className="p-1.5 rounded-full hover:bg-white text-slate-700 hover:text-sky-600 transition-colors"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextStep}
              className="p-1.5 rounded-full hover:bg-white text-slate-700 hover:text-sky-600 transition-colors"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Horizontal Roadmap Track (lg screen) */}
      <div className="hidden lg:block relative my-8">
        {/* Main Horizontal Progress Connecting Line */}
        <div className="absolute top-12 left-[10%] right-[10%] h-1.5 bg-slate-200 rounded-full z-0 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_#0284c7]"
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
                onClick={() => handleSelectStep(index)}
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* Node Circle along horizontal roadmap line */}
                <div
                  className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md border-2 mb-6 relative',
                    isActive
                      ? 'bg-sky-600 text-white border-sky-400 scale-110 shadow-sky-500/40 ring-4 ring-sky-500/20'
                      : isCompleted
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : 'bg-white text-slate-500 border-slate-300 group-hover:border-sky-400 group-hover:text-sky-600 group-hover:scale-105'
                  )}
                >
                  <Icon className="w-7 h-7 transition-transform group-hover:scale-110" />

                  {/* Step Badge Pill floating top-right of node */}
                  <span
                    className={cn(
                      'absolute -top-3 -right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-xs',
                      isActive ? 'bg-slate-900 text-white border-slate-700' : 'bg-white text-slate-700 border-slate-200'
                    )}
                  >
                    {item.step}
                  </span>
                </div>

                {/* Card Container */}
                <div
                  className={cn(
                    'w-full p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between min-h-[230px] relative overflow-hidden',
                    isActive
                      ? 'bg-white border-sky-500 shadow-xl ring-2 ring-sky-500/10 -translate-y-2'
                      : 'bg-[#fafafa] border-slate-200 hover:border-slate-300 hover:bg-white hover:-translate-y-1'
                  )}
                >
                  {/* Step Active Progress Bar */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-sky-100">
                      <div
                        className="h-full bg-sky-500 transition-all duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

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

      {/* Deep-Dive Milestone Inspector Console */}
      <div className="mt-8 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <CurrentIcon className="w-6 h-6 text-sky-400 shrink-0" />
            <div>
              <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-wider block">
                ACTIVE PHASE SPECIFICATION • {currentStep.timeframe}
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white">
                {currentStep.title}
              </h4>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 font-mono text-xs text-sky-300 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Target Output: {currentStep.deliverables}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentStep.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200">
              <FileCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile & Tablet Vertical Connected Roadmap (sm / md screen) */}
      <div className="lg:hidden relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8 my-8">
        {steps.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeStep;

          return (
            <div
              key={index}
              onClick={() => handleSelectStep(index)}
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

'use client';

import * as React from 'react';
import { Search, Palette, Code2, Rocket, ArrowRight, Check, Play, Pause, ChevronLeft, ChevronRight, Clock, FileCheck, Sparkles, Workflow, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhaseStep {
  step: string;
  title: string;
  desc: string;
  timeframe: string;
  deliverables: string;
  icon: LucideIcon;
  highlights: string[];
}

const steps: PhaseStep[] = [
  {
    step: '01',
    title: 'Discovery & System Topology Audit',
    desc: 'Analyzing technical constraints, latency budgets, concurrency requirements, stakeholder SLAs, and mapping domain boundaries.',
    timeframe: 'Phase 01 • Week 1',
    deliverables: 'Architecture Specification & Threat Model',
    icon: Search,
    highlights: [
      'Technical constraint audit & concurrency target profiling',
      'Database schema decomposition & row-level security mapping',
      'Protocol boundary & external API integration contracts',
    ],
  },
  {
    step: '02',
    title: 'Design Systems & Interface Engineering',
    desc: 'Crafting spatial UI/UX systems, atomic tokens, low-latency client state caches, and WCAG AAA compliant interaction flows.',
    timeframe: 'Phase 02 • Weeks 2 - 3',
    deliverables: 'Design Tokens & Interactive Prototypes',
    icon: Palette,
    highlights: [
      'High-fidelity interactive prototype verification',
      'Design token definition (semantic variables, responsive typography)',
      'Fluid 120 FPS interaction & reduced-motion fallbacks',
    ],
  },
  {
    step: '03',
    title: 'Deterministic Agile Execution',
    desc: 'Building high-throughput services with Next.js 16, Go microservices, strict ACID persistence, and automated test pipelines.',
    timeframe: 'Phase 03 • Weeks 4 - 6',
    deliverables: 'Full-Stack Production Builds & APIs',
    icon: Code2,
    highlights: [
      'Decoupled microservice containers & gRPC message bus',
      'Automated regression suites & cryptographic lock validation',
      'Zero-trust authentication & role-based access controls',
    ],
  },
  {
    step: '04',
    title: 'QA, Hardening & Zero-Downtime Launch',
    desc: 'End-to-end chaos engineering, multi-region cluster provisioning, real-time Prometheus telemetry, and sovereign handoff.',
    timeframe: 'Phase 04 • Week 7+',
    deliverables: 'Live Cloud Deployment & 24/7 SLA Telemetry',
    icon: Rocket,
    highlights: [
      'Multi-region blue-green rolling deployment switchover',
      'Real-time distributed tracing & Grafana health monitors',
      '100% source code handover & ongoing enterprise SLA',
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
      className="bg-[#111216]/95 text-white border border-white/10 rounded-3xl p-6 sm:p-12 lg:p-14 shadow-2xl mb-12 overflow-hidden relative"
      id="service-process"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header with Tour Play/Pause Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <Workflow className="w-3.5 h-3.5" />
            <span>DELIVERY METHODOLOGY // 04 PHASES</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
            How We Engineer &amp; Deliver
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/10 text-white text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400" />
                <span>PAUSE TOUR</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span>PLAY TOUR</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            <button
              onClick={handlePrevStep}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextStep}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Horizontal Roadmap Track */}
      <div className="hidden lg:block relative my-8">
        {/* Main Horizontal Progress Connecting Line */}
        <div className="absolute top-12 left-[10%] right-[10%] h-1 bg-white/10 rounded-full z-0 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_#10b981]"
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
                {/* Node Circle */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md border mb-6 relative',
                    isActive
                      ? 'bg-emerald-500 text-black border-emerald-400 scale-110 shadow-emerald-500/40 ring-4 ring-emerald-500/20'
                      : isCompleted
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                      : 'bg-[#16171d] text-slate-400 border-white/10 group-hover:border-emerald-400/50 group-hover:text-white group-hover:scale-105'
                  )}
                >
                  <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />

                  {/* Step Badge Pill */}
                  <span
                    className={cn(
                      'absolute -top-2.5 -right-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-xs',
                      isActive ? 'bg-black text-emerald-400 border-emerald-500/50' : 'bg-white/5 text-slate-300 border-white/10'
                    )}
                  >
                    {item.step}
                  </span>
                </div>

                {/* Card Container */}
                <div
                  className={cn(
                    'w-full p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[220px] relative overflow-hidden',
                    isActive
                      ? 'bg-[#181920] border-emerald-500/60 shadow-xl ring-1 ring-emerald-500/30 -translate-y-1'
                      : 'bg-[#121317] border-white/10 hover:border-white/20 hover:bg-[#15161c]'
                  )}
                >
                  {/* Step Active Progress Bar */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-950">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded inline-block mb-2.5 border border-emerald-500/30 uppercase">
                      {item.timeframe}
                    </span>

                    <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {item.desc}
                    </p>
                  </div>

                  {/* Deliverables Footer */}
                  <div className="pt-2.5 border-t border-white/10 flex items-center gap-2 text-[10px] font-mono font-semibold text-slate-400">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{item.deliverables}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Milestone Inspector Console */}
      <div className="mt-8 bg-black/70 text-white rounded-2xl p-6 border border-white/10 shadow-xl relative overflow-hidden font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-3">
            <CurrentIcon className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                ACTIVE PHASE PROTOCOL • {currentStep.timeframe}
              </span>
              <h4 className="text-base sm:text-lg font-black text-white">
                {currentStep.title}
              </h4>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Target: {currentStep.deliverables}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentStep.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile & Tablet Vertical Connected Roadmap */}
      <div className="lg:hidden relative pl-6 border-l border-white/10 space-y-6 my-6">
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
                  'absolute -left-[35px] top-1.5 w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 shadow-md',
                  isActive
                    ? 'bg-emerald-500 text-black border-emerald-400 scale-110 shadow-emerald-500/30'
                    : 'bg-[#14151a] text-slate-400 border-white/10'
                )}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Milestone Content Card */}
              <div
                className={cn(
                  'p-5 rounded-2xl border transition-all duration-300',
                  isActive
                    ? 'bg-[#16171d] border-emerald-500/50 shadow-xl'
                    : 'bg-[#111216] border-white/10'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    PHASE {item.step} • {item.timeframe}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {item.desc}
                </p>

                <div className="pt-2.5 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
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

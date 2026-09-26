'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  Clock,
  ChevronRight,
  ChevronLeft,
  Zap,
  Code2,
  Rocket,
  Search,
  Compass,
  RotateCcw,
  FileCheck2,
} from 'lucide-react';

const steps = [
  {
    num: '01',
    phase: 'PHASE 01',
    title: 'Discover',
    subtitle: 'Business Requirements & Scope',
    desc: 'Deep-dive audit into operational workflows, business goals, target user personas, and technical constraints.',
    emoji: '🔍',
    icon: Search,
    duration: 'Week 1',
    deliverable: 'PRD & Scope Blueprint',
    highlights: [
      'Stakeholder alignment & business goal mapping',
      'Technical feasibility & architectural constraint audit',
      'User persona journeys & feature scope specification',
    ],
    techStack: ['PRD Specification', 'User Flow Mapping', 'System Audit', 'Figma'],
  },
  {
    num: '02',
    phase: 'PHASE 02',
    title: 'Plan',
    subtitle: 'System Architecture & UX',
    desc: 'Define robust system architecture, database data models, microservices, tech stack, and interactive wireframes.',
    emoji: '🧭',
    icon: Compass,
    duration: 'Weeks 2 - 3',
    deliverable: 'System Architecture Doc',
    highlights: [
      'Database schema (ERD) & REST/GraphQL API contract design',
      'Atomic UI design system & high-fidelity prototypes',
      'Cloud infrastructure, security policies & DevOps blueprint',
    ],
    techStack: ['Prisma ORM', 'Next.js 16', 'Tailwind v4', 'ERD Diagrams'],
  },
  {
    num: '03',
    phase: 'PHASE 03',
    title: 'Design & Build',
    subtitle: 'Agile Code & Integration',
    desc: 'Engineer custom software with clean code standards, atomic UI components, APIs, and continuous QA testing.',
    emoji: '💻',
    icon: Code2,
    duration: 'Weeks 4 - 8',
    deliverable: 'Production Ready Build',
    highlights: [
      'Modular full-stack frontend & backend engineering',
      'CI/CD pipeline integration with automated linting & unit tests',
      'API endpoint integration & state management setup',
    ],
    techStack: ['React 19', 'TypeScript', 'Node.js', 'Jest / Cypress'],
  },
  {
    num: '04',
    phase: 'PHASE 04',
    title: 'Launch',
    subtitle: 'Production Server Deployment',
    desc: 'Deploy software to high-availability cloud infrastructure with zero-downtime transition, SSL, and live telemetry.',
    emoji: '🚀',
    icon: Rocket,
    duration: 'Week 9',
    deliverable: 'Live Production SLA',
    highlights: [
      'Zero-downtime deployment with blue/green server switching',
      'SSL certificates, custom domain DNS routing & CDN cache tuning',
      'Real-time server telemetry, error tracking & security firewall',
    ],
    techStack: ['Vercel Cloud', 'AWS / Cloudflare', 'Sentry', 'Datadog'],
  },
  {
    num: '05',
    phase: 'PHASE 05',
    title: 'Support & Scale',
    subtitle: 'Continuous Maintenance',
    desc: 'Provide ongoing technical support, system updates, performance optimizations, and agile feature expansion.',
    emoji: '🔄',
    icon: RotateCcw,
    duration: 'Ongoing 24/7',
    deliverable: '24/7 SLA Support',
    highlights: [
      '24/7 server health monitoring & auto-scaling triggers',
      'Scheduled security patches, database tuning & dependency updates',
      'Continuous feature iteration & analytics performance tracking',
    ],
    techStack: ['24/7 SLA', 'Auto-scaling', 'Security Audits', 'Analytics'],
  },
];

import { TextReveal } from '@/components/ui/TextReveal';

export function ProcessSection() {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);

  // Auto-advance slideshow timer
  React.useEffect(() => {
    if (!isPlaying || isHovered) return;

    const intervalTime = 50; // 50ms tick
    const totalTime = 4000; // 4 seconds per step
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
  const StepIcon = currentStep.icon;

  return (
    <section 
      id="process" 
      aria-label="5-Phase Software Engineering Roadmap"
      className="w-full bg-[#0a0a0b] text-white py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/5"
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="max-w-4xl mb-12 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENGINEERING ROADMAP • 5 PHASES</span>
          </div>

          <TextReveal as="h2" splitType="words" className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.035em] leading-[1.1] mb-4">
            5-Phase Software Engineering Roadmap
          </TextReveal>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-3xl">
            A transparent, end-to-end software delivery methodology—from initial discovery to live production launch and continuous 24/7 scaling.
          </p>
        </div>

        {/* Inner Dark Console Card Container */}
        <div 
          className="bg-[#121316] text-white border border-white/10 rounded-none p-5 sm:p-8 lg:p-10 relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >

          {/* Top Control Bar: Step Indicator & Auto-Play Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
              <span className="text-emerald-400 font-bold">
                PHASE 0{activeStep + 1} / 05
              </span>
              <span>—</span>
              <span>{steps[activeStep].title}</span>
            </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-500/20 text-white hover:text-emerald-300 border border-white/15 hover:border-emerald-500/40 text-xs font-mono font-bold transition-all"
              title={isPlaying ? 'Pause Auto-Play' : 'Play Interactive Tour'}
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

            {/* Quick Navigation Buttons */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
              <button
                onClick={handlePrevStep}
                className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Previous Phase"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextStep}
                className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Next Phase"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Laser Progress Line Track (Desktop Only) */}
        <div className="hidden lg:block relative mb-10 px-4 z-10">
          {/* Base Track */}
          <div className="w-full h-2 bg-slate-800 rounded-full relative overflow-hidden shadow-inner">
            {/* Active Laser Progress Fill */}
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_#10b981]"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* 5 Node Badges along the Laser Track */}
          <div className="flex items-center justify-between -mt-5 relative z-10 px-2">
            {steps.map((s, idx) => {
              const isActive = idx === activeStep;
              const isPast = idx < activeStep;

              return (
                <button
                  key={s.num}
                  onClick={() => handleSelectStep(idx)}
                  className={`group relative flex flex-col items-center focus:outline-none transition-all duration-300`}
                >
                  <div
                    className={`w-9 h-9 rounded-full font-mono text-xs font-black flex items-center justify-center transition-all duration-300 shadow-lg border-2 ${
                      isActive
                        ? 'bg-emerald-400 text-slate-950 border-white scale-125 shadow-[0_0_20px_rgba(16,185,129,0.8)] ring-4 ring-emerald-500/30'
                        : isPast
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/80 hover:scale-110'
                        : 'bg-[#141416] text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white hover:scale-105'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className={`text-[10px] font-mono font-bold mt-2 uppercase transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}>
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5 Phase Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 relative z-10 mb-8">
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;

            return (
              <div
                key={step.num}
                onClick={() => handleSelectStep(idx)}
                className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden backdrop-blur-xl border ${
                  isActive
                    ? 'bg-[#18181c] border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)] -translate-y-1.5'
                    : 'bg-[#141416] border-white/10 hover:border-emerald-400/50 hover:bg-[#18181c] hover:-translate-y-1'
                }`}
              >
                {/* Active Top Progress Bar for Current Step */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-950">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-75 ease-linear shadow-[0_0_8px_#10b981]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Subtle Ambient Background Glow on Active */}
                {isActive && (
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
                )}

                <div>
                  {/* Step Header: Number & Phase */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-6 h-6 rounded-lg font-mono text-[11px] font-black flex items-center justify-center shrink-0 border transition-all ${
                        isActive
                          ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {step.num}
                      </span>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isActive ? 'text-emerald-300 font-extrabold' : 'text-slate-400'
                      }`}>
                        {step.phase}
                      </span>
                    </div>

                    <span className={`text-xl transition-transform duration-300 ${
                      isActive ? 'scale-125' : 'group-hover:scale-110'
                    }`}>
                      {step.emoji}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className={`text-base font-extrabold mb-1 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-white group-hover:text-emerald-300'
                  }`}>
                    {step.title}
                  </h3>

                  <div className="text-[11px] font-mono text-emerald-400/90 font-semibold mb-2">
                    {step.subtitle}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {step.desc}
                  </p>
                </div>

                {/* Card Deliverable Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <div className="flex items-center gap-1.5 text-slate-200 font-bold min-w-0">
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-emerald-400' : 'text-emerald-500/70'
                    }`} />
                    <span className="truncate">{step.deliverable}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Active Phase Deep-Dive Console Inspector ── */}
        <div className="relative z-10 bg-[#121215] border border-emerald-500/30 rounded-2xl p-5 sm:p-7 shadow-2xl transition-all duration-500 animate-fade-in">
          {/* Terminal Window Header Controls */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-300 ml-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                PHASE 0{activeStep + 1} SPECIFICATIONS &amp; METHODOLOGY
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-400">
              <Clock className="w-3 h-3" />
              <span>DURATION: {currentStep.duration}</span>
            </div>
          </div>

          {/* Console Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Key Activities & Execution Highlights */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 text-white font-extrabold text-lg">
                <StepIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{currentStep.title} Phase Execution Plan</span>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentStep.desc}
              </p>

              <div className="pt-2">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                  Key Technical Activities &amp; Outcomes:
                </span>
                <ul className="space-y-2">
                  {currentStep.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Tech Stack & Primary Deliverable */}
            <div className="lg:col-span-5 bg-[#18181c] border border-white/10 rounded-xl p-4 sm:p-5 space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                  PRIMARY MILESTONE DELIVERABLE
                </span>
                <div className="flex items-center gap-2 text-sm font-extrabold text-white bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{currentStep.deliverable}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  TOOLS &amp; METHODOLOGY STACK
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentStep.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[11px] font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Method Summary Bar */}
        <div className="mt-6 sm:mt-8 bg-[#18181c] text-white rounded-xl p-3.5 sm:p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-mono text-slate-200 font-semibold leading-tight">
              AGILE METHODOLOGY • ESTIMATED TOTAL TIMELINE: 4 TO 12 WEEKS
            </span>
          </div>
          <Link
            href="/get-quote"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider shrink-0 transition-all hover:translate-x-1"
          >
            <span>Start Delivery Plan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        </div>
      </div>
    </section>
  );
}

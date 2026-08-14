'use client';

import * as React from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import {
  Stethoscope,
  GraduationCap,
  ShoppingBag,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Play,
  Pause,
  Tv,
  Lock,
  Activity,
  Layers,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroLaunchBackground() {
  const [activeSolution, setActiveSolution] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
  const [videoSeconds, setVideoSeconds] = React.useState<number>(14);

  const solutions = React.useMemo(() => [
    {
      id: 'custom-software',
      title: 'Custom Software Development',
      tag: 'BESPOKE SOFTWARE',
      emoji: '🛠️',
      icon: Cpu,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'Tailored enterprise software, automated operational workflows, and API integrations.',
      features: ['Custom Workflow Automation', 'Modular Microservices', 'Enterprise Security'],
    },
    {
      id: 'healthcare',
      title: 'Hospital & IVF Healthcare EMR',
      tag: 'HEALTHCARE ERP',
      emoji: '🏥',
      icon: Stethoscope,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'OPD/IPD management, IVF fertility cycle tracking, pathology labs & pharmacy billing.',
      features: ['IVF Cycle & EMR Records', 'Pathology & Lab Integration', 'GST Pharmacy Billing'],
    },
    {
      id: 'education',
      title: 'Education & Campus ERP',
      tag: 'EDUCATION CLOUD',
      emoji: '🎓',
      icon: GraduationCap,
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description: 'Multi-campus university ERP, student admissions, online fee collection & exams.',
      features: ['Multi-Campus Operations', 'Online Fee Gateway', 'Proctored Exam Engine'],
    },
    {
      id: 'retail',
      title: 'Retail POS & Inventory Engine',
      tag: 'RETAIL COMMERCE',
      emoji: '🛒',
      icon: ShoppingBag,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'High-speed retail counter billing, multi-store stock sync, and barcode inventory control.',
      features: ['Fast GST Counter Billing', 'Multi-Store Inventory Sync', 'Barcode Scanner Integration'],
    },
  ], []);

  // Automatic Video Loop: Cycles activeSolution every 3.5 seconds continuously
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveSolution((prev) => (prev + 1) % solutions.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPlaying, solutions.length]);

  // Video Time Counter Interval
  React.useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setVideoSeconds((prev) => (prev >= 180 ? 0 : prev + 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `0${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full relative rounded-3xl sm:rounded-[36px] overflow-hidden border-2 border-slate-300 bg-[#0c0d0e] shadow-2xl group selection:bg-emerald-500 selection:text-white">
      
      {/* ── 1. LUXURY TABLET DEMO STREAM DISPLAY (LIVE MOTION VIDEO DISPLAY) ── */}
      <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[600px] overflow-hidden">
        
        {/* Background Base Mockup Photo */}
        <NextImage
          src="/hero_ipad_mockup_ohotech.jpg"
          alt="OHO TECH Website UI Showcase on Tablet Device"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          className="object-cover object-center brightness-[0.9] contrast-[1.05]"
        />

        {/* ── DYNAMIC LIVE AUTO-SCROLLING SCREEN INSIDE THE TABLET ── */}
        <div className="absolute top-[18%] left-[16%] right-[16%] bottom-[12%] z-10 bg-[#0d0d0e]/95 text-white rounded-2xl border-2 border-slate-700/80 shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl">
          
          {/* Simulated Browser URL Bar */}
          <div className="bg-[#141416] border-b border-white/10 px-3 py-2 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>

            <div className="flex-1 max-w-md mx-auto bg-black/40 border border-white/10 rounded-lg px-3 py-0.5 text-[10px] font-mono text-slate-300 flex items-center gap-2">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">https://ohotech.com/live-solution-demo/{solutions[activeSolution].id}</span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>LIVE SCREEN</span>
            </div>
          </div>

          {/* DYNAMIC SCROLLING PAGE CONTENT MATCHING ACTIVE SOLUTION */}
          <div className="flex-1 p-4 sm:p-6 overflow-hidden relative">
            
            {/* Auto-Scrolling Animated Screen Container */}
            <div className={cn(
              "space-y-4 transition-all duration-700 ease-out",
              isPlaying ? "animate-pulse" : ""
            )}>
              
              {/* Screen Top Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{solutions[activeSolution].emoji}</span>
                  <h4 className="text-sm font-mono font-black text-white uppercase tracking-wider">
                    {solutions[activeSolution].title}
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  Slide {activeSolution + 1} of 04
                </span>
              </div>

              {/* Dynamic Screen Body Preview */}
              {activeSolution === 0 && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300">Custom Microservices Engine</span>
                    <span className="text-emerald-400 text-[10px]">Running 99.99%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300">Automated Workflow Pipelines</span>
                    <span className="text-amber-400 text-[10px]">Active Sync</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300">REST &amp; GraphQL API Gateway</span>
                    <span className="text-teal-400 text-[10px]">Protected</span>
                  </div>
                </div>
              )}

              {activeSolution === 1 && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                    <span className="text-emerald-300">IVF Fertility Cycle &amp; EMR Tracking</span>
                    <span className="text-emerald-400 text-[10px]">Active Records</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300">OPD / IPD Patient Queue &amp; Beds</span>
                    <span className="text-emerald-400 text-[10px]">Live Sync</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300">Pathology Lab &amp; Pharmacy GST Billing</span>
                    <span className="text-teal-400 text-[10px]">Connected</span>
                  </div>
                </div>
              )}

              {activeSolution === 2 && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                    <span className="text-amber-300">Multi-Campus University ERP</span>
                    <span className="text-amber-400 text-[10px]">3 Campuses Active</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300">Student Online Fee Collection</span>
                    <span className="text-emerald-400 text-[10px]">Gateway Live</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300">Proctored Examination Core</span>
                    <span className="text-teal-400 text-[10px]">Ready</span>
                  </div>
                </div>
              )}

              {activeSolution === 3 && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                    <span className="text-emerald-300">Retail POS Barcode Counter Billing</span>
                    <span className="text-emerald-400 text-[10px]">Sub-Second Checkout</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300">Multi-Store Inventory Stock Sync</span>
                    <span className="text-emerald-400 text-[10px]">Auto Balance</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300">GST Invoice Generator &amp; Returns</span>
                    <span className="text-teal-400 text-[10px]">Compliance Ready</span>
                  </div>
                </div>
              )}

            </div>

            {/* Live Video Motion Scanner Light across the screen */}
            {isPlaying && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="w-full h-16 bg-gradient-to-b from-transparent via-emerald-400/25 to-transparent transform -translate-y-full animate-[scan_3s_linear_infinite]" />
              </div>
            )}

          </div>

          {/* Screen Bottom Controls Footer */}
          <div className="bg-[#141416] border-t border-white/10 px-4 py-2 flex items-center justify-between text-[10px] font-mono text-slate-400 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE AUTOMATED SCREEN FLOW</span>
            </span>
            <span className="text-emerald-400 font-bold">AUTOPLAY ACTIVE</span>
          </div>

        </div>

        {/* Video HUD Overlay: Live Stream HUD Bar */}
        <div className="absolute top-6 left-6 z-20 pointer-events-none flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-[#0c0d0e]/90 backdrop-blur-md border border-emerald-500/40 text-white font-mono text-[11px] font-bold flex items-center gap-2 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-400 font-black">REC</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-400">{formatTime(videoSeconds)} / 03:00</span>
          </div>

          {/* Equalizer Waveform Animation */}
          {isPlaying && (
            <div className="hidden sm:flex items-center gap-1 bg-[#0c0d0e]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_100ms]" />
              <span className="w-1 h-4 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_200ms]" />
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_300ms]" />
              <span className="w-1 h-5 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_150ms]" />
            </div>
          )}
        </div>
        
        {/* Subtle Dark Gradient Foot Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d0e] via-[#0c0d0e]/40 to-transparent pointer-events-none" />
      </div>

      {/* ── 2. TOP HEADER BADGE WITH LIVE VIDEO STREAM CONTROLS ── */}
      <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-6 z-20 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0c0d0e]/85 backdrop-blur-xl border border-white/20 text-white font-mono text-xs font-bold shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shadow-sm shadow-emerald-400/50" />
          <span>OHO TECH Platform Solutions</span>
          <span className="text-slate-400 font-normal border-l border-white/20 pl-2.5 hidden sm:inline">Software • Web • Mobile • Growth</span>
        </div>

        {/* Live Auto-Play Stream Badge & Play/Pause Controls */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c0d0e]/85 backdrop-blur-xl border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold shadow-lg">
            <Tv className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">🔴 LIVE STREAM DISPLAY</span>
            <span>• 60 FPS AUTOPLAY</span>
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-1.5 rounded-full bg-[#0c0d0e]/85 backdrop-blur-xl border border-white/20 text-white hover:text-emerald-400 flex items-center gap-2 text-xs font-mono font-bold transition-colors shadow-lg"
            title={isPlaying ? 'Pause Demo Stream' : 'Play Demo Stream'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>PLAY STREAM</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* ── 3. BOTTOM OVERLAY SHOWCASE: LIVE AUTO-PLAYING SOLUTIONS CARDS ── */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-6 z-20">
        
        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {solutions.map((sol, index) => {
            const Icon = sol.icon;
            const isActive = activeSolution === index;

            return (
              <div
                key={sol.id}
                onClick={() => {
                  setActiveSolution(index);
                  setIsPlaying(false);
                }}
                className={cn(
                  "p-4 sm:p-5 rounded-2xl transition-all duration-500 cursor-pointer backdrop-blur-2xl border flex flex-col justify-between group/card relative overflow-hidden",
                  isActive
                    ? "bg-[#0c0d0e]/95 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/40 scale-[1.02]"
                    : "bg-[#0c0d0e]/80 hover:bg-[#0c0d0e]/95 border-white/15 hover:border-white/30"
                )}
              >
                {/* Live Video Animated Progress Line on Active Card */}
                {isActive && isPlaying && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 animate-[progress_3.5s_linear_infinite]" />
                )}

                <div>
                  {/* Card Header Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
                      sol.accent
                    )}>
                      {sol.tag}
                    </span>
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                      isActive ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/50" : "bg-white/10 text-white"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm sm:text-base font-extrabold text-white mb-1.5 leading-snug group-hover/card:text-emerald-300 transition-colors flex items-center gap-1.5">
                    <span>{sol.emoji}</span>
                    <span>{sol.title}</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
                    {sol.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="pt-2.5 border-t border-white/10 space-y-1">
                  {sol.features.slice(0, 2).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Directive Bar */}
        <div className="bg-[#0c0d0e]/90 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-mono font-semibold text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Bespoke Software &amp; Mobile Apps
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Hospital, Campus &amp; Retail Systems
            </span>
            <span className="flex items-center gap-2 hidden lg:flex">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Data-Driven Growth Strategies
            </span>
          </div>

          <Link
            href="/solutions"
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-emerald-400 text-[#0c0d0e] font-extrabold text-xs uppercase tracking-wider transition-all shadow-md group shrink-0"
          >
            <span>View All OHO TECH Solutions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Truck, 
  Ship, 
  Plane, 
  Building2, 
  Code2, 
  Cpu, 
  Globe2, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Zap, 
  Clock, 
  Compass, 
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type JourneyTrack = 'logistics' | 'software';

interface JourneyStage {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  tagline: string;
  transportMode: string;
  softwareMode: string;
  description: string;
  logisticsMetrics: { label: string; value: string; detail: string }[];
  softwareMetrics: { label: string; value: string; detail: string }[];
  technicalFeatures: string[];
  vehicleIcon: React.ElementType;
  techIcon: React.ElementType;
  accentColor: string;
}

const STAGES: JourneyStage[] = [
  {
    id: 'stage-1',
    stepNumber: '01',
    title: 'Origin Loading & Fleet Dispatch',
    subtitle: 'GROUND HAUL // ARCHITECTURE BLUEPRINT',
    tagline: 'Initial consolidation, route planning, and foundational system design',
    transportMode: 'Heavy Electric Freight Semi-Truck',
    softwareMode: 'Domain Modeling & API Contract Blueprint',
    description: 'At the origin hub, smart sensors scan and secure the standardized cargo container onto high-efficiency inland transport. In digital engineering, this maps to rigorous requirement decomposition, relational schema design, and modular service boundaries.',
    logisticsMetrics: [
      { label: 'Payload Capacity', value: '38,000 KG', detail: 'Gross container load' },
      { label: 'Fleet Optimization', value: '99.2% ON-TIME', detail: 'Dynamic GPS routing' },
      { label: 'IoT Telemetry', value: '4G/5G LIVE', detail: 'Continuous vibration & temp' }
    ],
    softwareMetrics: [
      { label: 'Schema Design', value: 'ACID STRICT', detail: 'Zero-anomaly relational flow' },
      { label: 'API Contract', value: 'OpenAPI 3.1', detail: 'Type-safe gRPC & REST' },
      { label: 'Security Model', value: 'Zero-Trust', detail: 'RBAC & mTLS 1.3 enforced' }
    ],
    technicalFeatures: [
      'Automated weigh-station bypass & digital bill of lading',
      'Dynamic telemetry streaming via MQTT edge gateway',
      'Immutable cryptographic package audit trail'
    ],
    vehicleIcon: Truck,
    techIcon: Code2,
    accentColor: 'from-amber-500/20 to-emerald-500/20',
  },
  {
    id: 'stage-2',
    stepNumber: '02',
    title: 'Maritime Terminal & Deep-Sea Vessel',
    subtitle: 'OCEAN FREIGHT // CORE HIGH-THROUGHPUT ENGINE',
    tagline: 'Intercontinental heavy transit and resilient distributed database clustering',
    transportMode: 'Post-Panamax Container Vessel & Gantry Crane',
    softwareMode: 'High-Throughput Microservices & Event Stream Engine',
    description: 'Automated electric gantry cranes transfer the cargo container from truck chassis to ocean mega-vessel for cross-continental voyage. In software, this represents our asynchronous event-driven pipelines handling heavy compute workloads and high-throughput transaction queues.',
    logisticsMetrics: [
      { label: 'Vessel Capacity', value: '18,500 TEU', detail: 'Ultra large container ship' },
      { label: 'Customs Pre-Clearance', value: '100% DIGITAL', detail: 'EDI automated clearance' },
      { label: 'Sea Lane Routing', value: 'ECO-STEAMING', detail: '18% fuel carbon reduction' }
    ],
    softwareMetrics: [
      { label: 'Throughput Peak', value: '100k+ REQ/S', detail: 'Zero-lock concurrent queues' },
      { label: 'Data Sharding', value: 'WAL Mirrored', detail: 'Multi-AZ Postgres replicas' },
      { label: 'Fault Recovery', value: '< 450ms', detail: 'Automated failover pods' }
    ],
    technicalFeatures: [
      'Automated gantry crane optical character container recognition',
      'Real-time satellite AIS vessel positioning telemetry',
      'Maritime customs compliance and digital EDI manifest sync'
    ],
    vehicleIcon: Ship,
    techIcon: Cpu,
    accentColor: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    id: 'stage-3',
    stepNumber: '03',
    title: 'Aviation Freight & Supersonic Cloud Orbit',
    subtitle: 'AIR FREIGHT // GLOBAL EDGE CDN LAUNCH',
    tagline: 'Time-critical international air express and sub-18ms multi-region cloud edge',
    transportMode: 'Wide-Body Long-Range Cargo Aircraft',
    softwareMode: 'Multi-Region Global Anycast Edge Network',
    description: 'For high-priority consignments, containers are loaded into wide-body cargo jets for rapid international trans-oceanic flight. In software engineering, this maps to instant global edge network deployment across Mumbai, Singapore, Frankfurt, and North America.',
    logisticsMetrics: [
      { label: 'Air Speed Cruise', value: 'MACH 0.84', detail: '540 knots ground speed' },
      { label: 'Global Dispatch', value: '< 24 HOURS', detail: 'Cross-continental transit' },
      { label: 'Altitude Stability', value: '38,000 FT', detail: 'Pressurized climate deck' }
    ],
    softwareMetrics: [
      { label: 'Edge Latency', value: '< 18ms', detail: 'AP-South & Global POPs' },
      { label: 'Anycast DNS', value: '100% Uptime', detail: 'BGP automated routing' },
      { label: 'DDoS Shield', value: 'Tbps Scale', detail: 'Layer 3/4/7 scrubbed' }
    ],
    technicalFeatures: [
      'IATA e-Freight certified paperless airway bills',
      'Satellite real-time flight telemetry & turbulence mitigation',
      'Express tarmac priority transfer & customs pre-screening'
    ],
    vehicleIcon: Plane,
    techIcon: Globe2,
    accentColor: 'from-purple-500/20 to-indigo-500/20',
  },
  {
    id: 'stage-4',
    stepNumber: '04',
    title: 'Smart Destination Hub & Mission Ops',
    subtitle: 'LAST-MILE FULFILLMENT // 24/7 PRODUCTION SLA',
    tagline: 'Final automated sorting, client delivery, and continuous autonomic telemetry',
    transportMode: 'Autonomous Distribution Hub & Fleet Handover',
    softwareMode: 'Continuous Production Reliability & Autonomic Telemetry',
    description: 'The container reaches the automated distribution hub where robotic sorters and electric last-mile vans finalize client handover with biometric proof of delivery. In software, this represents our 24/7 mission control dock, 99.99% SLA guarantee, and continuous monitoring.',
    logisticsMetrics: [
      { label: 'Proof of Delivery', value: '100% VERIFIED', detail: 'Cryptographic digital sign' },
      { label: 'SLA Achievement', value: '99.98% ON-TIME', detail: 'Guaranteed delivery window' },
      { label: 'Last-Mile Fleet', value: 'ZERO EMISSION', detail: '100% electric delivery van' }
    ],
    softwareMetrics: [
      { label: 'Production SLA', value: '99.99% UP', detail: 'Continuous active clusters' },
      { label: 'Observability', value: 'OpenTelemetry', detail: 'Live distributed tracing' },
      { label: 'Incident Response', value: '< 5 MIN', detail: 'Automated pager alert' }
    ],
    technicalFeatures: [
      'Automated robotic sorting facility with optical routing',
      'Biometric cryptographic chain-of-custody confirmation',
      'Seamless automated ERP invoice & receipt settlement'
    ],
    vehicleIcon: Building2,
    techIcon: ShieldCheck,
    accentColor: 'from-emerald-500/20 to-teal-500/20',
  },
];

export function BusinessRoadmapJourney() {
  const [activeStage, setActiveStage] = React.useState<number>(0);
  const [track, setTrack] = React.useState<JourneyTrack>('logistics');
  const containerRef = React.useRef<HTMLElement>(null);
  const progressBarRef = React.useRef<HTMLDivElement>(null);

  // Auto progression on scroll entry
  React.useEffect(() => {
    const container = containerRef.current;
    const bar = progressBarRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 70%',
        end: 'bottom 20%',
        onUpdate: (self) => {
          const progress = self.progress;
          if (bar) {
            bar.style.width = `${Math.min(100, Math.max(5, progress * 100))}%`;
          }
          const stageIndex = Math.min(
            STAGES.length - 1,
            Math.floor(progress * STAGES.length)
          );
          setActiveStage(stageIndex);
        },
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  const current = STAGES[activeStage];
  const CurrentVehicleIcon = current.vehicleIcon;
  const CurrentTechIcon = current.techIcon;

  return (
    <section
      id="business-roadmap"
      ref={containerRef}
      aria-label="Multimodal Business Journey and Digital Engineering Roadmap"
      className="w-full bg-[#0a0a0b] text-[#e8e8e6] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden border-t border-white/10"
    >
      {/* Dynamic Ambient Glow matching active stage */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-emerald-600/10 via-cyan-600/10 to-blue-600/10 rounded-full blur-[150px] pointer-events-none transition-all duration-700" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <ScrollReveal yOffset={15} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
              <Compass className="w-3.5 h-3.5" />
              <span>END-TO-END MULTIMODAL JOURNEY // BUSINESS &amp; TECHNICAL ROADMAP</span>
            </div>
          </ScrollReveal>

          <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase mb-4">
              From Source to Global Scale. <span className="text-emerald-400">Engineered Every Mile.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
              Follow the journey of enterprise assets through multi-modal freight logistics (Truck → Ocean Vessel → Cargo Jet → Smart Hub) and its parallel in digital system engineering.
            </p>
          </ScrollReveal>

          {/* Perspective Mode Switcher */}
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-white/5 border border-white/10 mt-8 backdrop-blur-md">
            <button
              onClick={() => setTrack('logistics')}
              className={`px-4 sm:px-6 py-2 rounded-full font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                track === 'logistics'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>LOGISTICS &amp; MULTIMODAL FREIGHT</span>
            </button>
            <button
              onClick={() => setTrack('software')}
              className={`px-4 sm:px-6 py-2 rounded-full font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                track === 'software'
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>DIGITAL SYSTEM ENGINEERING</span>
            </button>
          </div>
        </div>

        {/* ── INTERACTIVE JOURNEY TIMELINE TRACK ── */}
        <div className="relative mb-12 sm:mb-16">
          
          {/* Base Track Rail */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2 hidden md:block rounded-full" />
          
          {/* Active Animated Progress Line */}
          <div
            ref={progressBarRef}
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 -translate-y-1/2 hidden md:block rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(52,211,153,0.6)]"
            style={{ width: `${((activeStage + 1) / STAGES.length) * 100}%` }}
          />

          {/* 4 Milestone Stage Selectors */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10">
            {STAGES.map((s, idx) => {
              const Icon = track === 'logistics' ? s.vehicleIcon : s.techIcon;
              const isActive = idx === activeStage;
              const isPassed = idx <= activeStage;

              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStage(idx)}
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                    isActive
                      ? 'bg-[#14161f] border-emerald-500/60 shadow-xl shadow-emerald-500/10 scale-[1.02]'
                      : isPassed
                      ? 'bg-white/[0.03] border-white/15 text-slate-300 hover:bg-white/5'
                      : 'bg-white/[0.01] border-white/5 text-slate-500 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-white/5 text-slate-400 border border-white/5 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs font-bold">
                      STAGE {s.stepNumber}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-1">
                      {s.title}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-1 line-clamp-1">
                      {track === 'logistics' ? s.transportMode : s.softwareMode}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* ── STAGE DETAIL SPOTLIGHT STAGE ── */}
        <div className="bg-[#101218]/90 border border-white/15 rounded-3xl p-6 sm:p-10 lg:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Stage Visual Focal & Dynamic Animation */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl bg-[#08090d] border border-white/10 relative overflow-hidden min-h-[340px]">
              
              {/* Radial Center Light */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15),transparent_70%)]" />

              {/* Animated Vehicle / Architecture Transit Display */}
              <div className="relative z-10 flex flex-col items-center text-center">
                
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/10 to-blue-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_40px_rgba(16,185,129,0.25)] animate-pulse">
                  {track === 'logistics' ? (
                    <CurrentVehicleIcon className="w-12 h-12" />
                  ) : (
                    <CurrentTechIcon className="w-12 h-12" />
                  )}
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs text-emerald-400 font-bold mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{track === 'logistics' ? current.transportMode : current.softwareMode}</span>
                </div>

                <p className="text-xs text-slate-400 font-mono max-w-xs">
                  {current.tagline}
                </p>
              </div>

              {/* Decorative Transit Pulse Trail */}
              <div className="absolute bottom-4 inset-x-8 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-white/5 pt-2">
                <span>STAGE {current.stepNumber} // IN-TRANSIT</span>
                <span className="text-emerald-400">TELEMETRY ACTIVE</span>
              </div>
            </div>

            {/* Right Column: Stage Narrative, Technical Breakdown & Metrics */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-2">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{current.subtitle}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                  {current.title}
                </h3>

                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  {current.description}
                </p>
              </div>

              {/* 3 Telemetry Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {(track === 'logistics' ? current.logisticsMetrics : current.softwareMetrics).map((m, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                      {m.label}
                    </span>
                    <span className="text-lg sm:text-xl font-black text-white font-mono block">
                      {m.value}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {m.detail}
                    </span>
                  </div>
                ))}
              </div>

              {/* Key Technical Features Checklist */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  EXECUTION PROTOCOL &amp; VERIFICATION
                </span>
                {current.technicalFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Link
                  href="/solutions"
                  className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
                >
                  <span>Explore Architecture Solutions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => {
                    const next = (activeStage + 1) % STAGES.length;
                    setActiveStage(next);
                  }}
                  className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold transition-all border border-white/10 flex items-center gap-2 cursor-pointer"
                >
                  <span>Next Stage [0{((activeStage + 1) % STAGES.length) + 1}]</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

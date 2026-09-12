'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Server, 
  Cpu, 
  Layers, 
  Smartphone, 
  Database, 
  Palette, 
  ArrowUpRight, 
  CheckCircle2,
  Boxes
} from 'lucide-react';

interface ServiceItem {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  href: string;
  accent: string;
  icon: React.ElementType;
  specs: { label: string; value: string }[];
}

const SERVICES: ServiceItem[] = [
  {
    id: 'cloud',
    number: '01',
    category: 'INFRASTRUCTURE',
    title: 'Distributed Cloud Architecture',
    description: 'High-availability multi-region cloud topologies with zero single-point-of-failure and automated edge failover.',
    href: '/services/cloud-infrastructure',
    accent: '#10b981',
    icon: Server,
    specs: [
      { label: 'AVAILABILITY', value: '99.999%' },
      { label: 'GLOBAL LATENCY', value: '< 12ms' },
      { label: 'THROUGHPUT', value: '500K+ RPS' },
    ],
  },
  {
    id: 'ai',
    number: '02',
    category: 'INTELLIGENCE',
    title: 'Neural AI & Tensor Systems',
    description: 'Custom fine-tuned large language models, enterprise vector databases, and real-time predictive telemetry pipelines.',
    href: '/services/ai-ml-solutions',
    accent: '#06b6d4',
    icon: Cpu,
    specs: [
      { label: 'INFERENCE SPEED', value: '40ms TTFT' },
      { label: 'CONTEXT WINDOW', value: '128K' },
      { label: 'ACCURACY', value: '99.4%' },
    ],
  },
  {
    id: 'web',
    number: '03',
    category: 'FULL-STACK',
    title: 'Enterprise Web Platforms',
    description: 'Next-generation high-concurrency web engines built on React 19, Next.js App Router, and serverless edge functions.',
    href: '/services/web-development',
    accent: '#3b82f6',
    icon: Layers,
    specs: [
      { label: 'LIGHTHOUSE', value: '100 / 100' },
      { label: 'FIRST PAINT', value: '0.4s' },
      { label: 'SSR CACHE HIT', value: '98.2%' },
    ],
  },
  {
    id: 'mobile',
    number: '04',
    category: 'ECOSYSTEM',
    title: 'Native Mobile Engineering',
    description: 'Fluid 120 FPS iOS and Android ecosystems engineered with native Swift, Kotlin, and cross-platform native pipelines.',
    href: '/services/mobile-apps',
    accent: '#8b5cf6',
    icon: Smartphone,
    specs: [
      { label: 'FRAME RATE', value: '120 FPS' },
      { label: 'CRASH-FREE', value: '99.98%' },
      { label: 'OFFLINE MODE', value: 'ACTIVE' },
    ],
  },
  {
    id: 'erp',
    number: '05',
    category: 'ENTERPRISE',
    title: 'Distributed ERP & Ledger',
    description: 'Mission-critical enterprise resource planning systems with cryptographic audit trails and real-time inventory synchronization.',
    href: '/services/erp-systems',
    accent: '#f59e0b',
    icon: Database,
    specs: [
      { label: 'ACID AUDIT', value: '100%' },
      { label: 'CONCURRENCY', value: '100K USERS' },
      { label: 'RECOVERY TIME', value: '< 1 SEC' },
    ],
  },
  {
    id: 'uiux',
    number: '06',
    category: 'EXPERIENCE',
    title: 'Digital Experience & UI/UX',
    description: 'Precision human-computer interface design systems, high-density telemetry dashboards, and interactive design languages.',
    href: '/services/ui-ux-design',
    accent: '#ec4899',
    icon: Palette,
    specs: [
      { label: 'WCAG AAA', value: 'COMPLIANT' },
      { label: 'TOKENS', value: '800+ SYSTEM' },
      { label: 'USABILITY', value: '98.8 SCORE' },
    ],
  },
];

export function ServicesExperience() {
  return (
    <section 
      id="services" 
      className="w-full bg-[#0a0a0b] text-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
              <Boxes className="w-3.5 h-3.5" />
              <span>CAPABILITY ECOSYSTEM</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase">
              Core Engineering Services
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300 font-normal max-w-md leading-relaxed">
            Full-lifecycle technical delivery spanning cloud architecture, intelligent AI models, high-performance web engines, and enterprise software systems.
          </p>
        </div>

        {/* 6 Services Responsive Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#141416]/90 border border-white/10 hover:border-emerald-500/40 hover:bg-[#18181b] transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {service.number}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 font-mono text-[9px] sm:text-[10px] text-slate-300 tracking-wider uppercase font-bold">
                        {service.category}
                      </span>
                    </div>

                    <div 
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-emerald-500/40 transition-all duration-200"
                      style={{ color: service.accent }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-emerald-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Technical Specs Mini-Grid */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-black/40 border border-white/5 mb-6">
                    {service.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="text-center">
                        <div className="font-mono text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider truncate">
                          {spec.label}
                        </div>
                        <div className="font-mono text-[10px] sm:text-xs font-bold text-white truncate mt-0.5">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Service Link */}
                <Link
                  href={service.href}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/10 hover:border-emerald-500 font-mono text-xs font-bold text-slate-300 transition-all duration-200 flex items-center justify-between group/btn"
                >
                  <span>EXPLORE CAPABILITY</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

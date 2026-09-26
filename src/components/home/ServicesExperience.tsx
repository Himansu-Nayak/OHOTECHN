'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Server, 
  Cpu, 
  Layers, 
  Smartphone, 
  Database, 
  Palette, 
  ArrowRight,
  Boxes,
  CheckCircle2,
  ShieldCheck,
  LifeBuoy,
  ChevronDown,
  LucideIcon
} from 'lucide-react';

interface ServiceData {
  id: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  accent: string;
  icon: LucideIcon;
  specs: { label: string; value: string }[];
  technologies: string[];
  image: string;
}

const SERVICES_DATA: ServiceData[] = [
  {
    id: 'software',
    number: '01',
    category: 'Custom Software',
    title: 'Custom Software & Enterprise Platforms',
    subtitle: 'BESPOKE BUSINESS ENGINES & APIS',
    description: 'Bespoke business platforms, operational admin dashboards, role-based workflows, and scalable backends tailored to eliminate company friction.',
    href: '/services/custom-software-development',
    accent: '#10b981',
    icon: Database,
    specs: [
      { label: 'Code Ownership', value: '100% Sovereign IP' },
      { label: 'Architecture', value: 'Clean Microservices' },
      { label: 'SLA Standard', value: '99.99% Availability' },
    ],
    technologies: ['Java 21', 'Spring Boot 4', 'PostgreSQL', 'Redis', 'Docker'],
    image: '/images/3d-software-dev.jpg',
  },
  {
    id: 'web',
    number: '02',
    category: 'Web Platforms',
    title: 'Enterprise Web Applications',
    subtitle: 'HIGH-CONCURRENCY REACT 19 ENGINES',
    description: 'Next-generation high-concurrency web engines built on React 19, Next.js 16 App Router, and edge functions for global scale.',
    href: '/services/web-development',
    accent: '#06b6d4',
    icon: Layers,
    specs: [
      { label: 'Lighthouse Score', value: '100 / 100 Speed' },
      { label: 'First Paint', value: '< 0.4s Edge FCP' },
      { label: 'SSR Performance', value: 'Instant Hydration' },
    ],
    technologies: ['Next.js 16', 'React 19', 'Turbopack', 'Tailwind CSS 4'],
    image: '/hero_workspace_editorial.jpg',
  },
  {
    id: 'mobile',
    number: '03',
    category: 'Mobile Apps',
    title: 'Native Mobile Engineering',
    subtitle: '120 FPS IOS & ANDROID APPS',
    description: 'Fluid 120 FPS iOS and Android ecosystems engineered with native Swift, Kotlin, offline SQLite sync, and full App Store & Play Store deployment.',
    href: '/services/mobile-app-development',
    accent: '#8b5cf6',
    icon: Smartphone,
    specs: [
      { label: 'Frame Rate', value: '120 FPS ProMotion' },
      { label: 'Offline Engine', value: 'SQLite / Room Sync' },
      { label: 'Publishing', value: 'Store Guaranteed' },
    ],
    technologies: ['Kotlin', 'Swift & SwiftUI', 'SQLite Sync', 'Play Store & APNs'],
    image: '/hero_ipad_mockup_ohotech.jpg',
  },
  {
    id: 'uiux',
    number: '04',
    category: 'UI/UX Design',
    title: 'Spatial UI/UX & Design Systems',
    subtitle: 'PRECISION HUMAN-COMPUTER INTERFACES',
    description: 'Precision human-computer interface design systems, high-density telemetry dashboards, and interactive multi-brand design tokens.',
    href: '/services/ui-ux-design',
    accent: '#ec4899',
    icon: Palette,
    specs: [
      { label: 'Accessibility', value: 'WCAG AAA Compliant' },
      { label: 'Design Tokens', value: '800+ Atomic Units' },
      { label: 'Usability Index', value: 'Zero Friction UX' },
    ],
    technologies: ['Design Tokens', 'Figma Prototyping', 'WCAG AAA', 'Tailwind CSS'],
    image: '/hero_launch_artwork.png',
  },
  {
    id: 'ai',
    number: '05',
    category: 'AI & Automation',
    title: 'Neural AI & Workflow Pipelines',
    subtitle: 'ENTERPRISE RAG & VECTOR SEARCH',
    description: 'Custom fine-tuned large language models, enterprise vector databases (pgvector), automated document OCR, and background trigger bots.',
    href: '/services/ai-automation',
    accent: '#3b82f6',
    icon: Cpu,
    specs: [
      { label: 'Data Privacy', value: '100% Tenant Isolated' },
      { label: 'Retrieval Speed', value: 'Sub-50ms HNSW' },
      { label: 'Automation SLA', value: 'Deterministic Output' },
    ],
    technologies: ['Python', 'pgvector', 'PostgreSQL', 'LangChain', 'FastAPI'],
    image: '/images/3d-enterprise-node.jpg',
  },
  {
    id: 'cloud',
    number: '06',
    category: 'Cloud & DevOps',
    title: 'Distributed Cloud Architecture',
    subtitle: 'MULTI-REGION TOPOLOGY & AUTOMATION',
    description: 'High-availability multi-region cloud topologies with zero single-point-of-failure, automated GitHub Actions pipelines, and 24/7 SLA telemetry.',
    href: '/services/cloud-devops',
    accent: '#f59e0b',
    icon: Server,
    specs: [
      { label: 'Cloud SLA', value: '99.999% Availability' },
      { label: 'Deployment', value: 'Zero-Downtime Blue/Green' },
      { label: 'Disaster Recovery', value: '< 1 Minute Failover' },
    ],
    technologies: ['Docker', 'Kubernetes', 'GitHub Actions', 'Terraform', 'Nginx'],
    image: '/images/3d-enterprise-node.jpg',
  },
  {
    id: 'support',
    number: '07',
    category: '24/7 Maintenance',
    title: 'Enterprise SLAs & Operations',
    subtitle: 'CONTINUOUS MONITORING & PATCHES',
    description: 'Round-the-clock technical operations, real-time Sentry/Prometheus telemetry, automated database backups, and scheduled security vulnerability audits.',
    href: '/services/maintenance-support',
    accent: '#10b981',
    icon: LifeBuoy,
    specs: [
      { label: 'Incident Response', value: '< 15 Min SLA' },
      { label: 'Monitoring', value: '24/7/365 Real-Time' },
      { label: 'Security Audits', value: 'Monthly Zero-Day Scans' },
    ],
    technologies: ['Prometheus', 'Grafana', 'Sentry', 'Automated Backups', '24/7 Escalation'],
    image: '/images/3d-software-dev.jpg',
  },
];

export function ServicesExperience() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(SERVICES_DATA[0].id);

  const activeService = SERVICES_DATA[activeIndex] || SERVICES_DATA[0];
  const ActiveIcon = activeService.icon;

  const toggleMobileAccordion = (id: string) => {
    setExpandedMobileId(prev => (prev === id ? null : id));
  };

  return (
    <section 
      id="services" 
      aria-label="OHO TECH Core Engineering Services"
      className="w-full bg-[#0a0a0d] text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-white/5"
    >
      {/* Background Subtle Accent */}
      <div 
        className="absolute top-1/3 right-10 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-15 transition-colors duration-500"
        style={{ backgroundColor: activeService.accent }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Section Header: Restored Cinematic Visual Identity */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
              <Boxes className="w-3.5 h-3.5" />
              <span>CORE ENGINEERING CAPABILITIES</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-[-0.04em] leading-[1.02] uppercase mb-2">
              Custom Software
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                &amp; Digital Engineering.
              </span>
            </h2>
          </div>
          
          <div className="max-w-md text-left md:text-right">
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-4">
              If OHO TECH doesn&apos;t already have what you need, OHO TECH can build it. Commission our studio for mission-critical software.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider group"
            >
              <span>Explore All 7 Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ── DESKTOP & TABLET INTERACTIVE CAPABILITY SYSTEM ── */}
        <div className="hidden md:block">
          {/* Interactive Tab Navigation Rail */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {SERVICES_DATA.map((service, idx) => {
              const isActive = activeIndex === idx;
              const Icon = service.icon;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`px-4 py-2.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-white text-black border-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                  <span>{service.number} // {service.category}</span>
                </button>
              );
            })}
          </div>

          {/* Active Service Showcase Card */}
          <div className="rounded-3xl bg-[#111216] border border-white/10 p-8 lg:p-12 shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Content Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="font-bold text-emerald-400">CAPABILITY {activeService.number}</span>
                  <span>•</span>
                  <span className="uppercase tracking-wider">{activeService.subtitle}</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-white tracking-[-0.03em] leading-tight uppercase">
                  {activeService.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                  {activeService.description}
                </p>

                {/* Technologies Tag Cloud */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {activeService.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Specs Metric Row */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-center">
                  {activeService.specs.map((spec, sIdx) => (
                    <div key={sIdx}>
                      <div className="text-sm sm:text-base font-bold text-white">{spec.value}</div>
                      <div className="text-[10px] text-slate-400 uppercase mt-0.5">{spec.label}</div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Link
                    href={`/contact?service=${activeService.href.replace('/services/', '')}`}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>START A PROJECT</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href={activeService.href}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all text-center"
                  >
                    View Specifications
                  </Link>
                </div>
              </div>

              {/* Right Visual Image Column */}
              <div className="lg:col-span-5">
                <div className="relative h-72 sm:h-80 lg:h-96 w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl group">
                  <Image
                    src={activeService.image}
                    alt={activeService.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111216]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-bold">{activeService.category}</span>
                    <span className="text-emerald-400 font-semibold">Production Ready</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── MOBILE PROGRESSIVE ACCORDION CARDS (Phase 10: Mobile tap -> expands) ── */}
        <div className="md:hidden space-y-4">
          {SERVICES_DATA.map((service) => {
            const isExpanded = expandedMobileId === service.id;
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded ? 'bg-[#121318] border-emerald-500/50 shadow-xl' : 'bg-[#111216] border-white/10'
                }`}
              >
                {/* Accordion Header Trigger */}
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion(service.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isExpanded ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-white/5 text-slate-400 border-white/10'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                        {service.number} // {service.category}
                      </div>
                      <h4 className="text-base font-bold text-white truncate">
                        {service.title}
                      </h4>
                    </div>
                  </div>

                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180 text-emerald-400' : ''
                  }`} />
                </button>

                {/* Expanded Content Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-white/5 space-y-4 animate-fade-in">
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {service.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {service.technologies.slice(0, 4).map((tech, tIdx) => (
                        <span key={tIdx} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Specs Metric Strip */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-center text-xs">
                      {service.specs.map((spec, sIdx) => (
                        <div key={sIdx}>
                          <div className="text-xs font-bold text-white truncate">{spec.value}</div>
                          <div className="text-[9px] text-slate-400 uppercase mt-0.5 truncate">{spec.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center gap-3 pt-2">
                      <Link
                        href={`/contact?service=${service.href.replace('/services/', '')}`}
                        className="flex-1 py-3 rounded-full bg-emerald-500 text-black text-center font-mono font-bold text-xs uppercase tracking-wider"
                      >
                        Start Project
                      </Link>
                      <Link
                        href={service.href}
                        className="flex-1 py-3 rounded-full bg-white/5 border border-white/15 text-white text-center font-mono font-bold text-xs uppercase tracking-wider"
                      >
                        Specs
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default ServicesExperience;

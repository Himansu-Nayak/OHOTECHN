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
    subtitle: 'Bespoke Business Workflows & APIs',
    description: 'Bespoke business platforms, operational admin dashboards, role-based workflows, and scalable backends tailored to eliminate company friction.',
    href: '/services/custom-software-development',
    accent: '#10b981',
    icon: Database,
    specs: [
      { label: 'Code Ownership', value: '100% IP' },
      { label: 'Architecture', value: 'Microservices' },
      { label: 'SLA Standard', value: '99.99%' },
    ],
    technologies: ['Java 21', 'Spring Boot 4', 'PostgreSQL', 'Redis', 'Docker'],
    image: '/images/3d-software-dev.jpg',
  },
  {
    id: 'web',
    number: '02',
    category: 'Web Platforms',
    title: 'Enterprise Web Platforms',
    subtitle: 'High-Concurrency React 19 Engines',
    description: 'Next-generation high-concurrency web engines built on React 19, Next.js 16 App Router, and edge functions for global scale.',
    href: '/services/web-development',
    accent: '#06b6d4',
    icon: Layers,
    specs: [
      { label: 'Lighthouse', value: '100 / 100' },
      { label: 'First Paint', value: '< 0.4s FCP' },
      { label: 'SSR Cache Hit', value: '98.2%' },
    ],
    technologies: ['Next.js 16', 'React 19', 'Turbopack', 'Tailwind CSS 4'],
    image: '/hero_workspace_editorial.jpg',
  },
  {
    id: 'mobile',
    number: '03',
    category: 'Mobile Apps',
    title: 'Native Mobile Engineering',
    subtitle: '120 FPS iOS & Android Apps',
    description: 'Fluid 120 FPS iOS and Android ecosystems engineered with native Swift, Kotlin, offline SQLite sync, and full App Store & Play Store deployment.',
    href: '/services/mobile-app-development',
    accent: '#8b5cf6',
    icon: Smartphone,
    specs: [
      { label: 'Frame Rate', value: '120 FPS Fluid' },
      { label: 'Offline Sync', value: 'SQLite / Room' },
      { label: 'Deployment', value: 'Stores Ready' },
    ],
    technologies: ['Kotlin', 'Swift & SwiftUI', 'SQLite Sync', 'Play Store & APNs'],
    image: '/hero_ipad_mockup_ohotech.jpg',
  },
  {
    id: 'uiux',
    number: '04',
    category: 'UI/UX Design',
    title: 'Spatial UI/UX & Design Systems',
    subtitle: 'Precision Interface Architecture',
    description: 'Precision human-computer interface design systems, high-density telemetry dashboards, and interactive multi-brand design tokens.',
    href: '/services/ui-ux-design',
    accent: '#ec4899',
    icon: Palette,
    specs: [
      { label: 'Accessibility', value: 'WCAG AAA' },
      { label: 'Design Tokens', value: '800+' },
      { label: 'Usability', value: 'Frictionless' },
    ],
    technologies: ['Design Tokens', 'Figma Prototyping', 'WCAG AAA', 'Tailwind CSS'],
    image: '/hero_launch_artwork.png',
  },
  {
    id: 'ai',
    number: '05',
    category: 'AI & Automation',
    title: 'Neural AI & Tensor Systems',
    subtitle: 'Enterprise RAG & Vector Pipelines',
    description: 'Custom fine-tuned large language models, enterprise vector databases (pgvector), automated document OCR, and background trigger bots.',
    href: '/services/ai-automation',
    accent: '#3b82f6',
    icon: Cpu,
    specs: [
      { label: 'Data Privacy', value: 'Private Isolated' },
      { label: 'Retrieval', value: 'Sub-50ms HNSW' },
      { label: 'Automation', value: 'Deterministic' },
    ],
    technologies: ['Python', 'pgvector', 'PostgreSQL', 'LangChain', 'FastAPI'],
    image: '/images/3d-enterprise-node.jpg',
  },
  {
    id: 'cloud',
    number: '06',
    category: 'Cloud & DevOps',
    title: 'Distributed Cloud Architecture',
    subtitle: 'Multi-Region Topology & CI/CD',
    description: 'High-availability multi-region cloud topologies with zero single-point-of-failure, automated GitHub Actions pipelines, and 24/7 SLA telemetry.',
    href: '/services/cloud-devops',
    accent: '#f59e0b',
    icon: Server,
    specs: [
      { label: 'Availability', value: '99.999% SLA' },
      { label: 'Deployment', value: 'Zero-Downtime' },
      { label: 'Failover', value: '< 1 Minute' },
    ],
    technologies: ['Docker', 'Kubernetes', 'GitHub Actions', 'Terraform', 'Nginx'],
    image: '/images/3d-enterprise-node.jpg',
  },
];

export function ServicesExperience() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeService = SERVICES_DATA[activeIndex] || SERVICES_DATA[0];
  const ActiveIcon = activeService.icon;

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
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold tracking-wide mb-4">
              <Boxes className="w-3.5 h-3.5" />
              <span>Bespoke Engineering Services</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Custom software &amp; digital engineering
            </h2>
          </div>
          
          <div className="max-w-md text-left md:text-right">
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-3">
              If OHO TECH doesn&apos;t already have what you need, OHO TECH can build it.
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

        {/* Interactive Tab Navigation Rail (Instant Click & Hover Switch) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {SERVICES_DATA.map((service, idx) => {
            const isActive = activeIndex === idx;
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`px-4 py-2.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                <span>{service.category}</span>
              </button>
            );
          })}
        </div>

        {/* Active Service Showcase Card (Split Stage - Instant Responsive Layout) */}
        <div className="rounded-3xl bg-[#111216] border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span className="font-bold text-emerald-400">{activeService.number}</span>
                <span>•</span>
                <span className="uppercase tracking-wider">{activeService.subtitle}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
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
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={activeService.href}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-xs uppercase tracking-wider transition-all text-center"
                >
                  View Specifications
                </Link>
              </div>
            </div>

            {/* Right Visual Image Column */}
            <div className="lg:col-span-5">
              <div className="relative h-64 sm:h-80 lg:h-96 w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl group">
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
    </section>
  );
}

export default ServicesExperience;

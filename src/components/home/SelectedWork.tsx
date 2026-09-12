'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  FolderGit2, 
  ArrowUpRight, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Building2, 
  GraduationCap, 
  BadgeDollarSign, 
  Truck
} from 'lucide-react';

interface ProjectItem {
  id: string;
  projectNumber: string;
  category: string;
  title: string;
  subtitle: string;
  summary: string;
  href: string;
  accent: string;
  icon: React.ElementType;
  specs: { label: string; value: string }[];
  tags: string[];
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'project-01',
    projectNumber: 'PROJECT 01',
    category: 'HEALTHCARE & TELEMEDICINE',
    title: 'Enterprise Multi-Specialty Health Network',
    subtitle: 'HIGH-CONCURRENCY EMR & TELEHEALTH ENGINE',
    summary: 'Engineered a zero-downtime clinical management platform with real-time patient synchronization, sub-millisecond lab telemetry, and strict cryptographic record compliance.',
    href: '/solutions/healthcare',
    accent: '#10b981',
    icon: Building2,
    specs: [
      { label: 'UPTIME SLA', value: '99.999%' },
      { label: 'DATA LATENCY', value: '< 14ms' },
      { label: 'CAPACITY', value: '250K+ RECORDS' },
    ],
    tags: ['React 19', 'Next.js App Router', 'PostgreSQL', 'WebSockets', 'HIPAA Ready'],
  },
  {
    id: 'project-02',
    projectNumber: 'PROJECT 02',
    category: 'HIGHER EDUCATION & INSTITUTIONS',
    title: 'Centurion University Enterprise ERP',
    subtitle: 'MULTI-CAMPUS CLOUD MANAGEMENT PLATFORM',
    summary: 'Architected a distributed institutional platform serving students and faculty with automated burst-scaling during peak examination windows and unified financial operations.',
    href: '/solutions/education',
    accent: '#06b6d4',
    icon: GraduationCap,
    specs: [
      { label: 'CONCURRENT USERS', value: '50K+ PEAK' },
      { label: 'EXAM UPTIME', value: '100.0%' },
      { label: 'BURST LATENCY', value: '< 22ms' },
    ],
    tags: ['Distributed Cloud', 'Multi-Tenant', 'Automated Scale', 'Role RBAC'],
  },
  {
    id: 'project-03',
    projectNumber: 'PROJECT 03',
    category: 'FINANCIAL SERVICES & FINTECH',
    title: 'Commercial Capital & Payment Suite',
    subtitle: 'HIGH-THROUGHPUT TRANSACTION PIPELINE',
    summary: 'Built an event-driven payment clearance and risk modeling system with immutable cryptographic audit trails and automated ledger reconciliation.',
    href: '/solutions/fintech',
    accent: '#3b82f6',
    icon: BadgeDollarSign,
    specs: [
      { label: 'SETTLEMENT SPEED', value: '< 12ms' },
      { label: 'VOLUME', value: '5M+ TX / MO' },
      { label: 'COMPLIANCE', value: 'SOC-2 READY' },
    ],
    tags: ['Event-Driven', 'Kafka Streams', 'Audit Ledger', 'Cryptographic Token'],
  },
  {
    id: 'project-04',
    projectNumber: 'PROJECT 04',
    category: 'SUPPLY CHAIN & LOGISTICS',
    title: 'Global MachShip Fleet Corridor',
    subtitle: 'REAL-TIME TELEMETRY & ROUTE MESH',
    summary: 'Engineered an edge IoT fleet management platform tracking commercial cargo across multi-modal transport hubs with dynamic automated dispatching.',
    href: '/solutions/logistics',
    accent: '#8b5cf6',
    icon: Truck,
    specs: [
      { label: 'ACTIVE FLEET', value: '15K+ ASSETS' },
      { label: 'TELEMETRY RELIABILITY', value: '99.98%' },
      { label: 'EDGE SYNC', value: '< 18ms' },
    ],
    tags: ['Edge Workers', 'IoT Telemetry', 'Geo-Fencing', 'Vector Maps'],
  },
];

export function SelectedWork() {
  return (
    <section 
      id="selected-work" 
      className="w-full bg-[#0d0d10] text-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>CASE ARCHIVE &amp; VERIFIED SYSTEMS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase">
              Selected Work
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300 font-normal max-w-md leading-relaxed">
            Exemplary software deployments engineered for commercial scale, high concurrency, and resilient cloud performance.
          </p>
        </div>

        {/* 4 Projects Grid: 1 col on mobile, 2 cols on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {PROJECTS.map((project) => {
            const Icon = project.icon;
            return (
              <div
                key={project.id}
                className="group p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-[#141416]/95 border border-white/10 hover:border-emerald-500/40 hover:bg-[#18181b] transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Project Top Bar */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {project.projectNumber}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                        • {project.category}
                      </span>
                    </div>

                    <div 
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
                      style={{ color: project.accent }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Subtitle & Title */}
                  <div className="font-mono text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {project.subtitle}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3 group-hover:text-emerald-400 transition-colors">
                    {project.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-6">
                    {project.summary}
                  </p>

                  {/* Technical Specs 3-Column Grid */}
                  <div className="grid grid-cols-3 gap-2.5 py-3.5 px-3.5 rounded-xl bg-black/40 border border-white/5 mb-6">
                    {project.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="text-center">
                        <div className="font-mono text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider truncate">
                          {spec.label}
                        </div>
                        <div className="font-mono text-[11px] sm:text-xs font-bold text-white truncate mt-0.5">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-8">
                    {project.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[10px] text-slate-300 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Explore Case Study CTA */}
                <Link
                  href={project.href}
                  className="w-full py-3 px-5 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/10 hover:border-emerald-500 font-mono text-xs font-bold text-slate-300 transition-all duration-200 flex items-center justify-between group/btn"
                >
                  <span>VIEW ARCHITECTURE SPEC</span>
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

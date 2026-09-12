'use client';

import * as React from 'react';
import { 
  Cloud, 
  Database, 
  Cpu, 
  Layers, 
  Server, 
  Workflow, 
  Globe, 
  Sparkles, 
  Terminal,
  Lock,
  FileCheck2,
  Stethoscope,
  GraduationCap,
  ShoppingBag,
  Landmark,
  Truck,
  CheckCircle2,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface PartnerItem {
  id: string;
  name: string;
  tier: string;
  badge: string;
  metric: string;
  icon: React.ElementType;
}

interface PartnerCategory {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  partners: PartnerItem[];
}

const PARTNER_CATEGORIES: PartnerCategory[] = [
  {
    id: 'cloud-platforms',
    title: 'Cloud & Infrastructure Stack',
    subtitle: 'CORE COMPUTE & MANAGED PLATFORMS',
    tag: 'INFRASTRUCTURE',
    partners: [
      { id: 'aws', name: 'Amazon Web Services', tier: 'CLOUD COMPUTE', badge: 'VPC & S3', metric: 'Multi-AZ', icon: Cloud },
      { id: 'gcp', name: 'Google Cloud Platform', tier: 'KUBERNETES GKE', badge: 'Container Engine', metric: 'Cloud Run', icon: Globe },
      { id: 'azure', name: 'Microsoft Azure', tier: 'ENTERPRISE APPS', badge: 'Identity & Auth', metric: 'App Services', icon: Server },
      { id: 'pg', name: 'PostgreSQL Database', tier: 'RELATIONAL CORE', badge: 'ACID Sharding', metric: 'WAL Replicas', icon: Database },
      { id: 'redis', name: 'Redis Cache Layer', tier: 'IN-MEMORY STORE', badge: 'Fast Invalidation', metric: '<2ms Latency', icon: Cpu },
      { id: 'docker', name: 'Docker & OCI Runtime', tier: 'STANDARDIZED OPS', badge: 'Microservices', metric: 'Zero Drift', icon: Layers },
    ]
  },
  {
    id: 'industries-served',
    title: 'Industries & Domain Systems',
    subtitle: 'ENGINEERED APPLICATION DOMAINS',
    tag: 'DOMAINS SERVED',
    partners: [
      { id: 'ind-1', name: 'Healthcare & Clinical Systems', tier: 'EMR & PATIENT FLOW', badge: 'Hospital OS', metric: 'HL7 Workflows', icon: Stethoscope },
      { id: 'ind-2', name: 'Higher Education & Academics', tier: 'CAMPUS LMS CORE', badge: 'Student Portals', metric: 'Fee Ledgers', icon: GraduationCap },
      { id: 'ind-3', name: 'Retail & Multi-Store Commerce', tier: 'POS & INVENTORY', badge: 'Catalog Engine', metric: 'Live SKU Sync', icon: ShoppingBag },
      { id: 'ind-4', name: 'Financial & Accounting Tools', tier: 'DOUBLE-ENTRY LEDGER', badge: 'Billing & Invoicing', metric: 'Audit Trails', icon: Landmark },
      { id: 'ind-5', name: 'Logistics & Fleet Dispatch', tier: 'TELEMETRY & ROUTING', badge: 'Asset Tracking', metric: 'Milestone Ops', icon: Truck },
      { id: 'ind-6', name: 'Diagnostic Labs & MedTech', tier: 'SAMPLE PROCESSING', badge: 'Automated Reports', metric: 'Secure Access', icon: Lock },
    ]
  },
  {
    id: 'engineering-practices',
    title: 'Engineering Practices & Protocols',
    subtitle: 'DEVELOPMENT INTEGRITY & SECURITY PROTOCOLS',
    tag: 'STANDARDS & BEST PRACTICES',
    partners: [
      { id: 'sec-1', name: 'Security-First Architecture', tier: 'ACCESS CONTROL', badge: 'Defense-in-Depth', metric: 'mTLS & RBAC', icon: Lock },
      { id: 'sec-2', name: 'Data Privacy Principles', tier: 'ENCRYPTION AT REST', badge: 'Zero Data Retention', metric: 'AES-256 GCM', icon: FileCheck2 },
      { id: 'sec-3', name: 'Secure Payment Workflows', tier: 'TOKENIZED GATEWAYS', badge: 'PCI Architecture', metric: 'TLS 1.3 Strict', icon: CheckCircle2 },
      { id: 'sec-4', name: 'Strict TypeScript Integrity', tier: 'COMPILE-TIME SAFETY', badge: 'Static Type Check', metric: 'Strict Nulls', icon: Terminal },
      { id: 'sec-5', name: 'Modern Full-Stack Next.js', tier: 'EDGE COMPATIBLE', badge: 'React Server Comp', metric: '<25ms TTFB', icon: Workflow },
      { id: 'sec-6', name: 'Continuous System Telemetry', tier: 'OBSERVABILITY & LOGS', badge: 'Health Monitoring', metric: '24/7 Metrics', icon: Cpu },
    ]
  }
];

export function PartnerTrustGrid() {
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const filteredCategories = activeCategory === 'all' 
    ? PARTNER_CATEGORIES 
    : PARTNER_CATEGORIES.filter(c => c.id === activeCategory);

  return (
    <section
      id="partners-matrix"
      aria-label="Technology Stack and Industry Solutions Matrix"
      className="w-full bg-[#0a0a0b] text-[#e8e8e6] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 border-y border-white/10 relative overflow-hidden"
    >
      {/* Ambient background lightings */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <ScrollReveal yOffset={15} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TECHNOLOGY ECOSYSTEM &amp; DOMAIN MATRIX</span>
            </div>
          </ScrollReveal>

          <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-tight mb-4">
              Modern Stack. <span className="text-slate-400">Proven Architecture.</span>
            </h2>
            <p className="text-xs sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Our engineering foundation leverages proven cloud infrastructure, rigorous security practices, and custom software systems across enterprise domains.
            </p>
          </ScrollReveal>

          {/* Category Filter Pills */}
          <ScrollReveal yOffset={15} duration={0.6} delay={0.15}>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-200 uppercase ${
                  activeCategory === 'all'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                All Domains ({PARTNER_CATEGORIES.reduce((acc, c) => acc + c.partners.length, 0)})
              </button>
              {PARTNER_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-200 uppercase ${
                    activeCategory === cat.id
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat.tag} ({cat.partners.length})
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Categorized Matrix Grids */}
        <div className="space-y-12 sm:space-y-16">
          {filteredCategories.map((category) => (
            <div key={category.id} className="space-y-4">
              
              {/* Category Subheader Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">
                    {category.title}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest hidden md:inline-block">
                    // {category.subtitle}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                    {category.partners.length} Capabilities
                  </span>
                </div>
              </div>

              {/* Static Grid Matrix (2 cols on mobile, 3 on tablet, 6 on desktop) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {category.partners.map((partner) => {
                  const IconComponent = partner.icon;
                  return (
                    <div
                      key={partner.id}
                      className="group relative p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between min-h-[140px] sm:min-h-[160px] overflow-hidden cursor-default shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.12)] hover:-translate-y-0.5"
                    >
                      {/* 4-Corner Anchor Points / Technical Brackets */}
                      <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-emerald-400 transition-colors pointer-events-none" />
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-emerald-400 transition-colors pointer-events-none" />
                      <span className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 border-b border-l border-white/20 group-hover:border-emerald-400 transition-colors pointer-events-none" />
                      <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-b border-r border-white/20 group-hover:border-emerald-400 transition-colors pointer-events-none" />

                      {/* Top Row: Icon & Status Label */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-emerald-500/10 border border-white/10 group-hover:border-emerald-500/30 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-all duration-300">
                          <IconComponent className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <span className="text-[9px] font-mono font-bold text-slate-400 group-hover:text-emerald-400 transition-colors uppercase">
                          {partner.badge}
                        </span>
                      </div>

                      {/* Middle: Partner / Capability Name */}
                      <div className="my-auto">
                        <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors line-clamp-2">
                          {partner.name}
                        </h4>
                      </div>

                      {/* Bottom Row: Metadata Tier & Metric */}
                      <div className="pt-2 mt-2 border-t border-white/5 group-hover:border-white/10 flex items-center justify-between text-[9px] font-mono transition-colors">
                        <span className="text-slate-400 group-hover:text-slate-300 font-semibold truncate max-w-[55%]">
                          {partner.tier}
                        </span>
                        <span className="text-emerald-400 font-bold tracking-wider shrink-0">
                          {partner.metric}
                        </span>
                      </div>

                      {/* Background Illumination Sweep on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/0 via-emerald-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Assurance Bar (Clean, unasserted technical governance) */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">
                Direct Technical Governance &amp; Modular Code Ownership
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                Engineered with modern best practices, zero hidden dependencies, and full source access.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              ENTERPRISE SOFTWARE INTEGRITY
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Cloud, 
  Database, 
  Cpu, 
  Layers, 
  Server, 
  Workflow, 
  Globe, 
  Sparkles, 
  Terminal 
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface PartnerItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  icon: React.ElementType;
}

const TECH_PARTNERS: PartnerItem[] = [
  { id: 'aws', name: 'Amazon Web Services', category: 'CLOUD MESH', badge: 'APN ADVANCED', icon: Cloud },
  { id: 'gcp', name: 'Google Cloud Platform', category: 'COMPUTE', badge: 'KUBERNETES', icon: Globe },
  { id: 'azure', name: 'Microsoft Azure', category: 'ENTERPRISE', badge: 'FEDERATION', icon: Server },
  { id: 'pg', name: 'PostgreSQL Relational', category: 'DATABASE', badge: 'ACID SHARDS', icon: Database },
  { id: 'redis', name: 'Redis Distributed Cache', category: 'IN-MEMORY', badge: 'SUB-MS SLA', icon: Cpu },
  { id: 'docker', name: 'Docker Container Core', category: 'CONTAINERS', badge: 'OCI COMPLIANT', icon: Layers },
  { id: 'next', name: 'Next.js 16 App Router', category: 'EDGE FRONTEND', badge: 'REACT 19', icon: Workflow },
  { id: 'ts', name: 'TypeScript Strict Core', category: 'TYPE SAFETY', badge: 'ZERO REGRESSION', icon: Terminal },
];

const ENTERPRISE_CLIENTS: PartnerItem[] = [
  { id: 'c1', name: 'Apex Multi-Specialty Hospital', category: 'HEALTHCARE', badge: '250-BED EMR', icon: ShieldCheck },
  { id: 'c2', name: 'Centurion University Network', category: 'EDUCATION', badge: '6,500+ STUDENTS', icon: Globe },
  { id: 'c3', name: 'Nexus Omni-Retail Chain', category: 'COMMERCE', badge: '40k+ SKUS', icon: Layers },
  { id: 'c4', name: 'FinTrack Commercial Capital', category: 'FINTECH', badge: 'DOUBLE-ENTRY LEDGER', icon: Database },
  { id: 'c5', name: 'Global Fleet & Cargo MachShip', category: 'LOGISTICS', badge: 'ANYCAST DISPATCH', icon: Server },
  { id: 'c6', name: 'BioCare IVF & Clinical Labs', category: 'MEDTECH', badge: 'HL7 COMPLIANT', icon: Cpu },
  { id: 'c7', name: 'UrbanCraft Hospitality Core', category: 'PMS ENGINE', badge: 'MULTI-PROPERTY', icon: Workflow },
  { id: 'c8', name: 'State Skill Development Mission', category: 'GOV-TECH', badge: 'SECURE PORTAL', icon: Sparkles },
];

export function PartnerLogosMarquee() {
  return (
    <section
      id="partners-marquee"
      aria-label="Enterprise Technology Partners and Client Deployments"
      className="w-full bg-[#0a0a0b] text-[#e8e8e6] py-16 sm:py-24 overflow-hidden border-y border-white/10 relative"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[250px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mb-10 text-center">
        <ScrollReveal yOffset={15} duration={0.6}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENTERPRISE ECOSYSTEM &amp; VERIFIED DEPLOYMENTS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Trusted by Industry Pioneers. <span className="text-slate-400">Powered by Modern Infra.</span>
          </h2>
        </ScrollReveal>
      </div>

      {/* Row 1: Technology Ecosystem (Scrolling Left) */}
      <div className="relative w-full overflow-hidden marquee-track py-3">
        {/* Edge gradient masks */}
        <div className="absolute left-0 inset-y-0 w-16 sm:w-32 bg-gradient-to-r from-[#0a0a0b] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-16 sm:w-32 bg-gradient-to-l from-[#0a0a0b] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-left flex gap-4 sm:gap-6">
          {[...TECH_PARTNERS, ...TECH_PARTNERS, ...TECH_PARTNERS].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`tech-${idx}`}
                className="flex items-center gap-3.5 px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 group cursor-default shrink-0 opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
              >
                <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-emerald-500/10 border border-white/10 group-hover:border-emerald-500/30 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 group-hover:text-emerald-400 uppercase block">
                    {item.category} {'//'} {item.badge}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    {item.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2: Client Deployments (Scrolling Right) */}
      <div className="relative w-full overflow-hidden marquee-track py-3 mt-2">
        {/* Edge gradient masks */}
        <div className="absolute left-0 inset-y-0 w-16 sm:w-32 bg-gradient-to-r from-[#0a0a0b] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-16 sm:w-32 bg-gradient-to-l from-[#0a0a0b] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-right flex gap-4 sm:gap-6">
          {[...ENTERPRISE_CLIENTS, ...ENTERPRISE_CLIENTS, ...ENTERPRISE_CLIENTS].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`client-${idx}`}
                className="flex items-center gap-3.5 px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group cursor-default shrink-0 opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
              >
                <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-cyan-500/10 border border-white/10 group-hover:border-cyan-500/30 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 group-hover:text-cyan-400 uppercase block">
                    {item.category} {'//'} {item.badge}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    {item.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import * as React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Activity, 
  Database, 
  Workflow, 
  CheckCircle2
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface TrustPillar {
  title: string;
  badge: string;
  description: string;
  specs: string;
  icon: React.ElementType;
}

const trustPillars: TrustPillar[] = [
  {
    title: 'Multi-Tenant Data Isolation',
    badge: 'SECURITY & PRIVACY',
    description: 'Every enterprise organization operates within strictly isolated database schemas with zero cross-tenant visibility or data contamination risk.',
    specs: 'Row-Level Security & Encrypted Keys',
    icon: Lock
  },
  {
    title: 'High-Availability Architecture',
    badge: 'OPERATIONAL RESILIENCE',
    description: 'Containerized services with automated health checks, self-healing pod restarts, and load-balanced gateway routing for continuous business uptime.',
    specs: 'Redundant Production SLA',
    icon: Activity
  },
  {
    title: 'Automated Continuous Backups',
    badge: 'DATA PROTECTION',
    description: 'Automated point-in-time PostgreSQL database snapshots encrypted with AES-256 and mirrored to secure off-site cloud storage buckets.',
    specs: 'Automated Snapshot Verification',
    icon: Database
  },
  {
    title: 'Modular Full-Stack Codebases',
    badge: 'ENGINEERING HYGIENE',
    description: 'Clean microservice contracts, strictly typed TypeScript frontends, and comprehensive automated test suites preventing regressions before production deploy.',
    specs: 'Strict TypeScript & Zero Lints',
    icon: Workflow
  }
];

export function TrustProofSection() {
  return (
    <section id="trust-proof" className="w-full py-20 sm:py-28 px-6 sm:px-10 lg:px-16 bg-[#0a0a0b] relative">
      <div className="max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="max-w-3xl mb-12 sm:mb-16 pb-6 border-b border-white/10">
        <ScrollReveal yOffset={15} duration={0.6}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ENTERPRISE TRUST &amp; COMPLIANCE</span>
          </div>
        </ScrollReveal>

        <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4 uppercase">
            Built for Real-World Business Workflows.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
            Our engineering standards prioritize data integrity, deterministic business logic, and transparent architecture you can rely on indefinitely.
          </p>
        </ScrollReveal>
      </div>

      {/* 2 x 2 Trust Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {trustPillars.map((tp, idx) => {
          const Icon = tp.icon;
          return (
            <ScrollReveal key={tp.title} yOffset={20} duration={0.6} delay={idx * 0.08}>
              <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#111113] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {tp.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {tp.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-6">
                    {tp.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{tp.specs}</span>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      </div>
    </section>
  );
}

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
    <section id="trust-proof" className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 px-4 sm:px-8 lg:px-12 py-12 sm:py-16 bg-white border-2 border-slate-200/80 rounded-[28px] sm:rounded-[44px] shadow-sm relative overflow-hidden">
      
      {/* Header */}
      <div className="max-w-3xl mb-10 sm:mb-14">
        <ScrollReveal yOffset={15} duration={0.6}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ENTERPRISE TRUST &amp; COMPLIANCE</span>
          </div>
        </ScrollReveal>

        <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0d0d0e] tracking-tight leading-tight sm:leading-[1.1] mb-3">
            Built for Real-World Business Workflows.
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed">
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
              <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#fafafa] border-2 border-slate-200/80 hover:border-slate-400/80 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {tp.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#0d0d0e] mb-2">
                    {tp.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
                    {tp.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-xs font-mono font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{tp.specs}</span>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

    </section>
  );
}

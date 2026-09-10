'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface CaseStudy {
  id: string;
  tag: string;
  title: string;
  industry: string;
  problem: string;
  approach: string;
  system: string;
  result: string;
  specs: string[];
}

const verifiedCaseStudies: CaseStudy[] = [
  {
    id: 'hospital-management',
    tag: 'HEALTHCARE INFRASTRUCTURE',
    title: 'Hospital EMR & Clinical Workflow Digitalization',
    industry: 'Healthcare & Clinical Services',
    problem: 'Fragmented paper records, disjointed pharmacy inventory, and doctor appointment bottlenecks across multi-floor clinical facilities.',
    approach: 'Engineered a unified HealthOS deployment with centralized patient EMR, real-time bed allocation, and automated pharmacy dispensary queues.',
    system: 'Spring Boot microservices, PostgreSQL relational database, Next.js doctor console, and offline-resilient local sync nodes.',
    result: 'Streamlined patient throughput, eliminated manual prescription paperwork, and established 100% audit compliance for clinical records.',
    specs: ['Unified EMR Records', 'Zero-Latency Pharmacy Sync', 'Role-Based Doctor Portals']
  },
  {
    id: 'campus-erp',
    tag: 'EDUCATION & CONTINUUM',
    title: 'Multi-Campus Institutional ERP & Examination Engine',
    industry: 'Education & Vocational Skill Development',
    problem: 'Manual fee reconciliation errors, complex multi-branch student records, and uncoordinated examination grading workflows.',
    approach: 'Implemented SchoolCloud ERP with automated online fee collection, biometric attendance integrations, and digital exam evaluation portals.',
    system: 'Multi-tenant cloud architecture, automated payment gateway webhooks, SMS dispatchers, and mobile student/parent portals.',
    result: 'Automated 100% of fee reconciliation, enabled instant report card generation, and gave administration unified visibility across all branches.',
    specs: ['Multi-Campus Isolation', 'Automated Fee Ledgers', 'Parent Mobile Portal']
  },
  {
    id: 'retail-ledger',
    tag: 'COMMERCIAL POS & RETAIL',
    title: 'Distributed Omnichannel POS & Warehouse Inventory Ledger',
    industry: 'Retail & Multi-Outlet Commerce',
    problem: 'Stock discrepancies between physical retail stores and central warehouse, with slow peak-hour POS checkout terminals.',
    approach: 'Architected RetailPOS with sub-second thermal barcode billing, real-time store-to-warehouse synchronization, and automated re-order thresholds.',
    system: 'Edge POS client with offline SQLite cache, central PostgreSQL master, and automated vendor purchase order triggers.',
    result: 'Eliminated stockouts, reduced checkout queues to under 3 seconds per customer, and established real-time consolidated GST sales reporting.',
    specs: ['Sub-Second Barcode Scan', 'Offline POS Fallback', 'Automated Stock Triggers']
  }
];

export function VerifiedCaseStudies() {
  return (
    <section id="case-studies" className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 px-4 sm:px-8 lg:px-12 py-12 sm:py-16 bg-white border-2 border-slate-200/80 rounded-[28px] sm:rounded-[44px] shadow-sm relative overflow-hidden">
      
      {/* Header */}
      <div className="max-w-3xl mb-10 sm:mb-14">
        <ScrollReveal yOffset={15} duration={0.6}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>DEPLOYMENT CASE STUDIES</span>
          </div>
        </ScrollReveal>

        <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0d0d0e] tracking-tight leading-tight sm:leading-[1.1] mb-3">
            Proven Engineering in Action.
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed">
            Real enterprise transformations structured through precise architectural execution, from root operational bottleneck to measured business outcome.
          </p>
        </ScrollReveal>
      </div>

      {/* Case Study Cards Stack */}
      <div className="space-y-6 sm:space-y-8">
        {verifiedCaseStudies.map((cs, idx) => (
          <ScrollReveal key={cs.id} yOffset={25} duration={0.7} delay={idx * 0.1}>
            <div className="rounded-2xl sm:rounded-3xl border-2 border-slate-200/80 bg-[#fafafa] p-6 sm:p-10 hover:border-slate-400/80 transition-all duration-300">
              
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-200">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold uppercase tracking-wider">
                  {cs.tag}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {cs.industry}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#0d0d0e] tracking-tight mb-6">
                {cs.title}
              </h3>

              {/* 4-Phase Deployment Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-6">
                
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-wider mb-1">
                    01 // THE CHALLENGE
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {cs.problem}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider mb-1">
                    02 // THE APPROACH
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {cs.approach}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-wider mb-1">
                    03 // ARCHITECTURE
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {cs.system}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-wider mb-1">
                    04 // OUTCOME
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {cs.result}
                  </p>
                </div>

              </div>

              {/* Specs and Quote Action */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {cs.specs.map((spec) => (
                    <span key={spec} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {spec}
                    </span>
                  ))}
                </div>

                <Link
                  href="/get-quote"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0d0d0e] hover:text-emerald-600 font-mono uppercase tracking-wider transition-colors"
                >
                  <span>Build a Similar Solution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </ScrollReveal>
        ))}
      </div>

    </section>
  );
}

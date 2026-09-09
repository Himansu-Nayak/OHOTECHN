'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, CheckCircle2, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Tilt3D } from '@/components/ui/Tilt3D';

interface CaseStudy {
  id: string;
  tag: string;
  title: string;
  client: string;
  industry: string;
  metrics: { label: string; value: string }[];
  description: string;
  image: string;
  href: string;
  accent: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'healthcare-emr',
    tag: 'HEALTHCARE INFRASTRUCTURE',
    title: 'Hospital HMS & Telehealth Matrix',
    client: 'Apex Health Network',
    industry: 'Healthcare & Clinical Services',
    metrics: [
      { label: 'PATIENT THROUGHPUT', value: '+340%' },
      { label: 'RECORD ACCESS LATENCY', value: '< 15ms' },
      { label: 'HIPAA COMPLIANCE', value: '100%' },
    ],
    description: 'Unified multi-facility electronic medical records, real-time doctor scheduling, and automated pharmacy dispensary with offline-first synchronization.',
    image: '/images/3d/cloud-engine-3d.webp',
    href: '/solutions/hospital-healthcare-management',
    accent: '#10b981',
  },
  {
    id: 'retail-pos-ledger',
    tag: 'DISTRIBUTED COMMERCE',
    title: 'Omnichannel POS & Inventory Ledger',
    client: 'Vanguard Retail Holdings',
    industry: 'Multi-Outlet Retail & E-Commerce',
    metrics: [
      { label: 'ANNUAL GMV PROCESSED', value: '$840M+' },
      { label: 'INVENTORY DRIFT', value: '0.00%' },
      { label: 'CHECKOUT TIME', value: '1.2s' },
    ],
    description: 'High-concurrency point-of-sale terminal software with real-time warehouse inventory synchronization and automatic WhatsApp invoice dispatch.',
    image: '/images/3d/enterprise-erp-3d.webp',
    href: '/solutions/retail-supermarket-pos-billing',
    accent: '#f59e0b',
  },
  {
    id: 'ai-growth-engine',
    tag: 'NEURAL PREDICTION',
    title: 'Predictive Marketing & Customer Engine',
    client: 'Stratum Digital',
    industry: 'Financial Services & SaaS',
    metrics: [
      { label: 'CUSTOMER CAC REDUCTION', value: '-46%' },
      { label: 'CONVERSION UPLIFT', value: '+218%' },
      { label: 'MONTHLY ACTIVE USERS', value: '4.8M' },
    ],
    description: 'Deep neural embeddings analyzing high-frequency user telemetry to dynamically orchestrate multi-channel automated campaigns and personalized onboarding.',
    image: '/images/3d/ai-neural-mesh-3d.webp',
    href: '/services/ai-ml-solutions',
    accent: '#06b6d4',
  },
];

export function CaseStudiesShowcase() {
  return (
    <section className="relative w-full bg-[#0d0d0e] text-white py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-y border-white/10 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              DEPLOYMENT PORTFOLIO // PROVEN IMPACT
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase">
              Selected <span className="text-neutral-400">Case Studies</span>
            </h2>
          </div>

          <p className="text-neutral-400 text-sm max-w-md font-mono">
            Measurable operational throughput, revenue velocity, and zero-downtime reliability engineered for tier-1 enterprises.
          </p>
        </div>

        {/* Case Studies Cards Stack */}
        <div className="space-y-12">
          {CASE_STUDIES.map((study, idx) => (
            <ScrollReveal key={study.id} yOffset={30} duration={0.7} delay={idx * 0.1}>
              <div data-cursor="CASE STUDY">
                <Tilt3D maxTilt={3}>
                  <div className="relative group bg-[#13161f] border border-white/10 rounded-[36px] overflow-hidden p-6 sm:p-10 lg:p-12 hover:border-emerald-500/40 transition-all duration-500 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                      {/* Left: Info Column */}
                      <div className="lg:col-span-6 flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-mono text-xs font-bold text-emerald-400 tracking-widest uppercase">
                              [{study.tag}]
                            </span>
                            <span className="text-xs font-mono text-neutral-500">
                              0{idx + 1} // 03
                            </span>
                          </div>

                          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3 group-hover:text-emerald-400 transition-colors">
                            {study.title}
                          </h3>

                          <div className="flex items-center gap-2 mb-4 text-xs font-mono text-neutral-400">
                            <span>CLIENT: {study.client}</span>
                            <span>•</span>
                            <span>{study.industry}</span>
                          </div>

                          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8">
                            {study.description}
                          </p>
                        </div>

                        <div>
                          {/* Metrics Grid */}
                          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 mb-6">
                            {study.metrics.map((m, mIdx) => (
                              <div key={mIdx} className="flex flex-col">
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                                  {m.label}
                                </span>
                                <span className="text-base sm:text-xl font-mono font-black text-white mt-1">
                                  {m.value}
                                </span>
                              </div>
                            ))}
                          </div>

                          <Link
                            href={study.href}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-emerald-500 hover:text-black border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 group/btn"
                          >
                            <span>EXPLORE ARCHITECTURE</span>
                            <ArrowUpRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>

                      {/* Right: 3D Visual Box */}
                      <div className="lg:col-span-6 relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-black/50 border border-white/10">
                        <Image
                          src={study.image}
                          alt={study.title}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#13161f] via-transparent to-transparent opacity-60 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </Tilt3D>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

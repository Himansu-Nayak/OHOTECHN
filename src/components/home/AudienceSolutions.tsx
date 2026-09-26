'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Rocket, 
  Landmark, 
  Store, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface Segment {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  summary: string;
  deliverables: string[];
  specs: { label: string; value: string }[];
  ctaText: string;
  ctaHref: string;
  activeBg: string;
  activeText: string;
  activeSubtext: string;
  activeBorder: string;
}

const SEGMENTS: Segment[] = [
  {
    id: 'enterprise',
    badge: 'MISSION CRITICAL // TIER 1',
    title: 'ENTERPRISE & HEALTHCARE',
    tagline: 'Multi-tenant high-availability systems with strict regulatory compliance.',
    summary: 'Tailored for hospitals, multi-branch corporations, and large-scale enterprises that require custom ERPs, EMRs, and microservice meshes with 24/7 dedicated engineering support.',
    deliverables: [
      'Multi-tenant database schema with dedicated tenant data isolation',
      'HIPAA, ISO 27001, and SOC2 compliant architecture & audit logs',
      'Dedicated VPC deployment with zero-trust networking',
      'Guaranteed 99.99% uptime SLA with 15-minute emergency response',
      'Full source code transfer with 100% intellectual property rights'
    ],
    specs: [
      { label: 'DEPLOYMENT', value: 'Dedicated AWS / GCP / On-Prem' },
      { label: 'SLA TIER', value: 'Tier 1 Enterprise (24/7)' },
      { label: 'CONCURRENCY', value: '100,000+ Concurrent Users' }
    ],
    ctaText: 'REQUEST ENTERPRISE BRIEFING',
    ctaHref: '/contact?segment=enterprise',
    activeBg: 'bg-emerald-400',
    activeText: 'text-black',
    activeSubtext: 'text-neutral-800',
    activeBorder: 'border-emerald-300'
  },
  {
    id: 'startups',
    badge: 'RAPID SCALE // VELOCITY',
    title: 'HIGH-GROWTH TECH STARTUPS',
    tagline: 'From day-zero architecture to series-A scale without technical debt.',
    summary: 'Engineered for venture-backed founders and technology companies needing high-velocity development, modern UI/UX, and robust API foundations that scale from 1 to 1M users.',
    deliverables: [
      'Next.js 16 + Spring Boot microservice foundation',
      'Automated CI/CD pipelines with preview environments',
      'Scalable PostgreSQL + Redis caching layer',
      'Integrated payment gateways (Stripe, Razorpay, Escrow)',
      'Clean modular architecture ready for investor code audits'
    ],
    specs: [
      { label: 'TIME TO MARKET', value: '4 to 8 Weeks MVP' },
      { label: 'INFRASTRUCTURE', value: 'Elastic Auto-Scaling' },
      { label: 'TECH STACK', value: 'Next.js, Spring Boot, PostgreSQL' }
    ],
    ctaText: 'ACCELERATE YOUR PRODUCT',
    ctaHref: '/contact?segment=startup',
    activeBg: 'bg-cyan-400',
    activeText: 'text-black',
    activeSubtext: 'text-neutral-800',
    activeBorder: 'border-cyan-300'
  },
  {
    id: 'public-sector',
    badge: 'GOVERNANCE & SOVEREIGNTY',
    title: 'PUBLIC SECTOR & INSTITUTIONS',
    tagline: 'Sovereign data hosting, high accessibility, and rock-solid reliability.',
    summary: 'Built for universities, government agencies, and institutional bodies requiring air-gapped or localized deployments, multi-lingual support, and accessible citizen portals.',
    deliverables: [
      'In-country sovereign data localization compliance',
      'Granular multi-level role-based access control (RBAC)',
      'Immutable audit logging for regulatory scrutiny',
      'WCAG 2.1 AAA accessibility and responsive design',
      'Offline-first and low-bandwidth sync capabilities'
    ],
    specs: [
      { label: 'COMPLIANCE', value: 'GovTech & Data Sovereignty' },
      { label: 'ACCESSIBILITY', value: 'WCAG 2.1 AAA Compliant' },
      { label: 'AUDIT LOGGING', value: 'Cryptographically Verifiable' }
    ],
    ctaText: 'INITIATE INSTITUTIONAL DIALOGUE',
    ctaHref: '/contact?segment=institutional',
    activeBg: 'bg-amber-400',
    activeText: 'text-black',
    activeSubtext: 'text-neutral-800',
    activeBorder: 'border-amber-300'
  },
  {
    id: 'smes',
    badge: 'COMMERCIAL ADOPTION',
    title: 'COMMERCIAL SMES & BUSINESSES',
    tagline: 'Pre-built, production-tested software ready for instant activation.',
    summary: 'For growing businesses seeking ready-to-deploy business software without million-dollar upfront costs—from POS and billing to inventory management and customer portals.',
    deliverables: [
      'Instant access to 28+ tested commercial software products',
      'Pre-configured accounting, billing, and tax integrations',
      'Comprehensive onboarding with staff training sessions',
      'Managed cloud hosting with automated daily backups',
      'Lifetime or recurring flexible licensing options'
    ],
    specs: [
      { label: 'DEPLOYMENT TIME', value: 'Under 24 Hours' },
      { label: 'PRICING', value: 'Fixed Price / Transparent' },
      { label: 'SUPPORT', value: 'Standard Business SLA' }
    ],
    ctaText: 'EXPLORE READY PRODUCTS',
    ctaHref: '/products',
    activeBg: 'bg-purple-400',
    activeText: 'text-black',
    activeSubtext: 'text-neutral-800',
    activeBorder: 'border-purple-300'
  }
];

export function AudienceSolutions() {
  const [activeSegmentId, setActiveSegmentId] = React.useState<string>('enterprise');

  return (
    <section className="relative py-24 sm:py-32 bg-[#08090b] border-t border-white/10 overflow-hidden">
      
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 w-[550px] h-[550px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Context */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OPERATING SCALE MATCH</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-[0.95] mb-6">
                BUILT FOR TEAMS <br />
                THAT SHIP, MEASURE, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  AND WIN.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-8">
                Whether deploying a fault-tolerant multi-hospital healthcare platform, launching a high-growth SaaS startup, or automating commercial business operations, OHO TECH delivers architecture tailored to your operating scale.
              </p>

              {/* Guarantees Box */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-mono text-slate-200">100% Code Ownership & Zero Vendor Lock-in</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-mono text-slate-200">Direct Founder & Senior Architect Governance</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-mono text-slate-200">Enterprise SLA Runtimes with Guaranteed Uptime</span>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
              >
                <span>CONSULT AN ARCHITECT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Iconic High-Contrast Accordion (Inspired by play 1 screen recording 00:36 - 00:46) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-4"
          >
            {SEGMENTS.map((seg) => {
              const isSelected = seg.id === activeSegmentId;

              return (
                <motion.div
                  key={seg.id}
                  layout
                  transition={{ layout: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
                  onClick={() => setActiveSegmentId(seg.id)}
                  className={`rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isSelected
                      ? `${seg.activeBg} ${seg.activeBorder} shadow-2xl scale-[1.01]`
                      : 'bg-[#0d0f12]/90 border-white/10 hover:border-white/25 hover:bg-[#121419]'
                  }`}
                >
                  {/* Header Row */}
                  <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isSelected 
                          ? 'bg-black text-white shadow-md' 
                          : 'bg-white/5 text-slate-400 border border-white/10'
                      }`}>
                        {seg.id === 'enterprise' && <Building2 className="w-5 h-5" />}
                        {seg.id === 'startups' && <Rocket className="w-5 h-5" />}
                        {seg.id === 'public-sector' && <Landmark className="w-5 h-5" />}
                        {seg.id === 'smes' && <Store className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-[10px] font-bold tracking-wider uppercase ${
                            isSelected ? 'text-black/80' : 'text-emerald-400'
                          }`}>
                            {seg.badge}
                          </span>
                        </div>
                        <h3 className={`text-base sm:text-xl font-black uppercase tracking-tight ${
                          isSelected ? 'text-black' : 'text-white'
                        }`}>
                          {seg.title}
                        </h3>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <motion.div 
                        animate={{ rotate: isSelected ? 90 : 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-black/15 text-black' : 'text-slate-500'
                        }`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Expanded Body Content with Smooth Spring Height */}
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-black/10">
                          <p className={`text-xs sm:text-sm leading-relaxed mb-5 font-medium ${seg.activeSubtext}`}>
                            {seg.summary}
                          </p>

                          {/* Technical Specs Strip */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-black/10 border border-black/10 mb-5 font-mono">
                            {seg.specs.map((sp, idx) => (
                              <div key={idx} className="p-2">
                                <div className="text-[10px] text-black/70 font-semibold uppercase">{sp.label}</div>
                                <div className="text-xs font-bold text-black mt-0.5">{sp.value}</div>
                              </div>
                            ))}
                          </div>

                          {/* Deliverable Checkmarks */}
                          <div className="space-y-2 mb-6">
                            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-black/80 mb-2">
                              KEY DELIVERABLES & GUARANTEES:
                            </div>
                            {seg.deliverables.map((item, idx) => (
                              <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="flex items-start gap-2.5 text-xs text-black/90 font-medium"
                              >
                                <ShieldCheck className="w-4 h-4 text-black mt-0.5 shrink-0" />
                                <span>{item}</span>
                              </motion.div>
                            ))}
                          </div>

                          {/* Action CTA with High Contrast Inversion */}
                          <div className="pt-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
                            <span className="text-xs text-black/80 font-mono font-medium">
                              Direct founder-level architecture consultation
                            </span>
                            <Link
                              href={seg.ctaHref}
                              className="px-6 py-3 rounded-xl bg-black hover:bg-neutral-900 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-lg shadow-black/20 hover:scale-[1.02]"
                            >
                              <span>{seg.ctaText}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </motion.div>

        </div>

      </div>
    </section>
  );
}

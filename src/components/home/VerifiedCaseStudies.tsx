'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Server, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  ChevronRight,
  ExternalLink,
  Zap,
  Activity,
  Info
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface CaseStudy {
  id: string;
  tag: string;
  category: string;
  title: string;
  industry: string;
  clientProfile: string;
  challenge: string;
  approach: string;
  architectureBlueprint: {
    frontend: string;
    services: string;
    database: string;
    infrastructure: string;
  };
  metrics: { label: string; value: string; detail: string }[];
  deliverables: string[];
  systemVerdict: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'healthcare-emr',
    tag: 'CLINICAL ARCHITECTURE',
    category: 'Healthcare Systems',
    title: 'Multi-Department Hospital EMR & Clinical Workflow Engine',
    industry: 'Healthcare & Clinical Informatics',
    clientProfile: 'Tertiary Care Hospital & Super-Specialty Clinic Archetype',
    challenge: 'Paper-based patient intake, disconnected pharmacy billing, and diagnostic report delays across hospital departments.',
    approach: 'Engineered an event-driven HealthOS architecture unifying electronic medical records, real-time bed management, and barcode specimen tracking.',
    architectureBlueprint: {
      frontend: 'Next.js Clinical Consoles // Cross-Platform Tablet Portals',
      services: 'Asynchronous Go & Node.js Services // HL7 / FHIR Data Adapters',
      database: 'PostgreSQL Relational Core + Redis Cache Cluster',
      infrastructure: 'Containerized Deployment // Isolated On-Premise & Cloud Sync'
    },
    metrics: [
      { label: 'Patient Triage Workflow', value: 'Sub-4 Min Goal', detail: 'Illustrative intake-to-consultation benchmark target' },
      { label: 'Pharmacy Ledger Accuracy', value: 'High Precision', detail: 'Target batch dispensing & stock sync' },
      { label: 'Audit Trail Reliability', value: 'Complete', detail: 'Digital clinical records for compliance reviews' }
    ],
    deliverables: [
      'Role-Based Doctor & Reception Consoles',
      'Sub-Second Pharmacy Barcode Billing',
      'IPD / OPD Ward Bed Management Grid',
      'Automated Diagnostic Lab Dispatch'
    ],
    systemVerdict: 'Designed to digitize prescription paperwork, establish zero-latency pharmacy ledger updates, and reduce OPD patient wait times.'
  },
  {
    id: 'campus-erp',
    tag: 'ACADEMIC INFRASTRUCTURE',
    category: 'Educational Institutions',
    title: 'Distributed Multi-Campus ERP, Fee Ledger & Academic Platform',
    industry: 'University & Higher Education Systems',
    clientProfile: 'Multi-Campus Institution & Academic Network Archetype',
    challenge: 'Manual fee reconciliation bottlenecks, desynchronized multi-branch student academic histories, and delayed grade sheet publication.',
    approach: 'Implemented an integrated Campus ERP architecture with automated payment gateway webhooks, biometric sync, and online examination pipelines.',
    architectureBlueprint: {
      frontend: 'React Web Admin // PWA Student Portal // Mobile Companion Apps',
      services: 'Stateless Node.js Services // Background Job Queues // SMS Dispatcher',
      database: 'PostgreSQL with Read Replicas // Redis Session Cache',
      infrastructure: 'Cloud Container Service // Global Edge CDN'
    },
    metrics: [
      { label: 'Fee Ledger Reconciliation', value: 'Real-Time Goal', detail: 'Target automated ledger balance via payment webhooks' },
      { label: 'Batch Grade Processing', value: 'Sub-3s Target', detail: 'Illustrative batch grade compilation benchmark' },
      { label: 'Portal Accessibility', value: '24/7 Target', detail: 'High-availability architecture target' }
    ],
    deliverables: [
      'Multi-Branch Tenant Isolation Engine',
      'Automated Bank Webhook Fee Reconciliation',
      'Biometric & RFID Attendance Integration',
      'Self-Service Student Transcript Generator'
    ],
    systemVerdict: 'Designed to unify institutional operations across multiple campuses into a centralized administrative control center with automated financial governance.'
  },
  {
    id: 'retail-omnichannel',
    tag: 'COMMERCE INFRASTRUCTURE',
    category: 'Commercial Retail',
    title: 'Omnichannel POS & Central Warehouse Inventory Sync Architecture',
    industry: 'High-Volume Retail & Distribution Chains',
    clientProfile: 'Multi-Store Retail Chain & Warehouse Distribution Archetype',
    challenge: 'Stock discrepancies between physical store counters and central warehouse depot, peak-hour checkout queues, and stockout bottlenecks.',
    approach: 'Architected RetailPOS with an offline-first local edge database, real-time depot sync, thermal barcode scanning, and low-stock reorder triggers.',
    architectureBlueprint: {
      frontend: 'Desktop Terminal Interface // Web Master Admin',
      services: 'High-Throughput REST APIs // WebSocket Sync Daemon',
      database: 'Central PostgreSQL Master // Local Edge Cache',
      infrastructure: 'Dockerized Microservices // Encrypted Local Data Stores'
    },
    metrics: [
      { label: 'Barcode Processing Goal', value: '< 200ms Goal', detail: 'Illustrative checkout latency performance target' },
      { label: 'Inventory Drift Prevention', value: 'Real-Time Goal', detail: 'Target stock synchronization across store counters' },
      { label: 'Offline Resilience', value: 'Fail-Safe Mode', detail: 'Local transaction queueing architecture during network outage' }
    ],
    deliverables: [
      'Offline-First Local Terminal Billing Engine',
      'Depot Reorder & Low-Stock Notification Daemon',
      'Multi-Store Consolidated Tax & GST Ledger',
      'Supplier Purchase Order Automation'
    ],
    systemVerdict: 'Engineered to prevent stockout discrepancies across multi-location stores, achieve sub-second counter checkouts, and secure uninterrupted offline operation.'
  },
  {
    id: 'fintech-ledger',
    tag: 'FINANCIAL CORE',
    category: 'Financial Technology',
    title: 'Double-Entry Accounting Ledger & Loan Disbursal Engine',
    industry: 'Fintech & Commercial Billing Systems',
    clientProfile: 'Commercial Finance & Billing Platform Archetype',
    challenge: 'Manual credit underwriting lag, fragmented payment gateway statements, and error-prone monthly loan installment reconciliations.',
    approach: 'Engineered an immutable double-entry ledger architecture with automated KYC verification webhooks, payment schedules, and dynamic delinquency alerts.',
    architectureBlueprint: {
      frontend: 'Next.js Credit Underwriter Portal // Client Loan Mobile App',
      services: 'Go Financial Transaction Engine // Kafka Message Bus',
      database: 'PostgreSQL with Row-Level Security // Redis Lock Manager',
      infrastructure: 'Private Cloud VPC // KMS Encrypted Storage'
    },
    metrics: [
      { label: 'Underwriting Verification', value: 'Automated Target', detail: 'Design target for automated document parsing' },
      { label: 'Payment Reconciliation', value: 'Sub-Minute Target', detail: 'Target automated bank statement reconciliation' },
      { label: 'Ledger Audit Integrity', value: 'Strict ACID', detail: 'Cryptographic transaction balancing target' }
    ],
    deliverables: [
      'Automated KYC Verification Flow',
      'Double-Entry Accounting Ledger Engine',
      'Automated Payment Schedule & Reminders Daemon',
      'Field Collection Management Application'
    ],
    systemVerdict: 'Designed to accelerate underwriting cycles, automate installment tracking, and establish bank-grade audit reliability.'
  }
];

export function VerifiedCaseStudies() {
  const [activeStudyId, setActiveStudyId] = React.useState<string>(CASE_STUDIES[0].id);

  const activeStudy = React.useMemo(() => {
    return CASE_STUDIES.find(cs => cs.id === activeStudyId) || CASE_STUDIES[0];
  }, [activeStudyId]);

  return (
    <section 
      id="case-studies"
      role="region"
      aria-label="OHO TECH Architecture Case Studies and Solution Blueprints"
      className="w-full bg-[#0a0a0b] text-[#e8e8e6] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b border-white/10">
          <div className="max-w-3xl">
            <ScrollReveal yOffset={15} duration={0.6}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>REPRESENTATIVE SYSTEM BLUEPRINTS // ARCHITECTURAL SOLUTIONS</span>
              </div>
            </ScrollReveal>

            <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4 uppercase">
                Architecture Blueprints.
              </h2>
              <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
                Illustrative technical blueprints demonstrating how OHO TECH designs modular software architectures for common industry bottlenecks.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal yOffset={15} duration={0.6} delay={0.2}>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono uppercase tracking-wider transition-all duration-200 shadow-lg shrink-0"
            >
              <span>Consult On Architecture</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>

        {/* Master-Detail Interactive Case Study Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Case Study Selector Tabs */}
          <div className="lg:col-span-4 space-y-3">
            {CASE_STUDIES.map((study, idx) => {
              const isActive = study.id === activeStudyId;
              return (
                <button
                  key={study.id}
                  onClick={() => setActiveStudyId(study.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 relative group cursor-pointer ${
                    isActive 
                      ? 'bg-white/10 border-emerald-500/50 shadow-lg shadow-emerald-500/5 text-white' 
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className={isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      [0{idx + 1}] // {study.tag}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  
                  <h4 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug mb-1">
                    {study.title}
                  </h4>
                  
                  <p className="text-xs text-slate-400 line-clamp-1 font-mono">
                    {study.category}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Architecture Showcase */}
          <div className="lg:col-span-8 bg-[#111113] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            {/* Prominent Architectural Target Disclosure Banner */}
            <div className="mb-6 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <Info className="w-4 h-4 shrink-0" />
                <span>Architectural Reference Model // Benchmark Targets (Illustrative)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline-block uppercase">
                Design Target
              </span>
            </div>

            {/* Header / Tag */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10 mb-6">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                  {activeStudy.category} {'//'} {activeStudy.tag}
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                  {activeStudy.title}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
                {activeStudy.clientProfile}
              </span>
            </div>

            {/* Challenge & Approach */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                <h5 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>The Operational Problem</span>
                </h5>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeStudy.challenge}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <h5 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>The Engineered Solution</span>
                </h5>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeStudy.approach}
                </p>
              </div>
            </div>

            {/* Architecture Stack Blueprint */}
            <div className="mb-8 p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Architecture Blueprint Breakdown</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">FRONTEND LAYER</span>
                  <span className="text-slate-200 font-bold">{activeStudy.architectureBlueprint.frontend}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">SERVICE LAYER</span>
                  <span className="text-slate-200 font-bold">{activeStudy.architectureBlueprint.services}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">DATABASE CORE</span>
                  <span className="text-slate-200 font-bold">{activeStudy.architectureBlueprint.database}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-slate-400 block text-[10px]">INFRASTRUCTURE</span>
                  <span className="text-slate-200 font-bold">{activeStudy.architectureBlueprint.infrastructure}</span>
                </div>
              </div>
            </div>

            {/* Metrics Impact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {activeStudy.metrics.map((metric, mIdx) => (
                <div key={mIdx} className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight block">
                    {metric.value}
                  </span>
                  <span className="text-xs font-bold text-white block mt-1">
                    {metric.label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">
                    {metric.detail}
                  </span>
                </div>
              ))}
            </div>

            {/* System Verdict & Key Deliverables */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  DESIGN OUTCOME TARGET
                </span>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  {activeStudy.systemVerdict}
                </p>
              </div>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase shrink-0"
              >
                <span>Consult On This Architecture</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

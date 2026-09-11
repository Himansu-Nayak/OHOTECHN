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
  Activity
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
    tag: 'CLINICAL OPERATING SYSTEM',
    category: 'Healthcare & Hospitals',
    title: 'Multi-Floor Hospital EMR & Real-time Clinical Workflow System',
    industry: 'Healthcare & Clinical Diagnostics',
    clientProfile: '250-Bed Tertiary Care Hospital & Super-Specialty Clinic Group',
    challenge: 'Paper-based patient intake, disconnected pharmacy billing, and critical diagnostic report delays across 8 hospital departments.',
    approach: 'Engineered an event-driven HealthOS platform unifying EMR, real-time bed allocation, automated drug dispensing queues, and barcode specimen tracking.',
    architectureBlueprint: {
      frontend: 'Next.js 16 Doctor & Nurse Consoles // Flutter Tablet Apps',
      services: 'Go & Node.js Asynchronous Microservices // HL7 / FHIR Gateway',
      database: 'PostgreSQL Relational Core + Redis Cache Cluster',
      infrastructure: 'Docker Containers // Isolated On-Premise & Cloud Sync'
    },
    metrics: [
      { label: 'Patient Triage Speed', value: '+340%', detail: 'Intake to consultation reduced to under 4 minutes' },
      { label: 'Pharmacy Billing Accuracy', value: '100%', detail: 'Zero inventory mismatch across 40,000+ SKU batches' },
      { label: 'Audit & Compliance SLA', value: '100%', detail: 'Instant digital clinical records for state healthcare audit' }
    ],
    deliverables: [
      'Role-Based Doctor & Reception Portals',
      'Sub-Second Pharmacy Thermal Barcode Billing',
      'IPD / OPD Ward Bed Management Grid',
      'Automated SMS & WhatsApp Lab Report Dispatch'
    ],
    systemVerdict: 'Eliminated manual prescription paperwork, established zero-latency pharmacy ledger updates, and reduced OPD patient wait times by 68%.'
  },
  {
    id: 'campus-erp',
    tag: 'EDUCATION & MULTI-CAMPUS CORE',
    category: 'Educational Institutions',
    title: 'Distributed Multi-Campus ERP, Fee Ledger & Examination Platform',
    industry: 'University & Vocational Campus Network',
    clientProfile: 'Multi-Campus Institution with 6,500+ Enrolled Students & 400 Faculty',
    challenge: 'Manual fee reconciliation errors, desynchronized multi-branch student academic histories, and delayed grade sheet publication cycles.',
    approach: 'Implemented SchoolCloud ERP with automated payment gateway reconciliation, biometric faculty sync, and high-concurrency online examination evaluation.',
    architectureBlueprint: {
      frontend: 'React Web Admin // PWA Student Portal // Android/iOS Mobile Apps',
      services: 'Stateless Node.js Services // BullMQ Job Queues // SMS Dispatcher',
      database: 'PostgreSQL with Read Replicas // Redis Session Store',
      infrastructure: 'AWS Elastic Container Service // Cloudflare CDN'
    },
    metrics: [
      { label: 'Fee Reconciliation SLA', value: 'Instant', detail: '100% automated ledger updates via payment webhooks' },
      { label: 'Report Card Generation', value: 'Sub-3s', detail: 'Batch grade computation across all semester streams' },
      { label: 'Parent Engagement Rate', value: '94%', detail: 'Live mobile updates on attendance, fees, and marks' }
    ],
    deliverables: [
      'Multi-Branch Tenant Isolation Engine',
      'Automated Bank Webhook Fee Reconciliation',
      'Biometric & RFID Attendance Integration',
      'Self-Service Student Transcript Generator'
    ],
    systemVerdict: 'Unified institutional operations across all physical campuses into a centralized administrative command center with automated financial governance.'
  },
  {
    id: 'retail-omnichannel',
    tag: 'RETAIL POS & WAREHOUSE',
    category: 'Commercial Retail',
    title: 'Omnichannel POS & Central Warehouse Inventory Sync Engine',
    industry: 'High-Volume Retail & Distribution Chains',
    clientProfile: '14 Multi-Store Retail Outlets & Central Distribution Depot',
    challenge: 'Stock discrepancies between physical store shelves and central depot, severe peak-hour checkout bottlenecks, and lost sales from out-of-stock items.',
    approach: 'Architected RetailPOS with an offline-first SQLite edge engine, real-time depot inventory sync, thermal barcode scanning, and automated purchase triggers.',
    architectureBlueprint: {
      frontend: 'Electron & React Desktop Terminal // Web Master Admin',
      services: 'Fastify High-Throughput REST APIs // WebSocket Sync Daemon',
      database: 'Central PostgreSQL Master // Local SQLite Edge DB',
      infrastructure: 'High-Availability Cloud Server // Local Store Edge Fallback'
    },
    metrics: [
      { label: 'POS Checkout Velocity', value: '< 3.2s', detail: 'Barcode scan to printed GST receipt per customer' },
      { label: 'Inventory Drift Reduction', value: '99.4%', detail: 'Real-time stock synchronization across all stores' },
      { label: 'Offline Resiliency', value: '100%', detail: 'Continuous billing even during store broadband outages' }
    ],
    deliverables: [
      'Offline-First Thermal Billing Terminal',
      'Multi-Warehouse Re-order Trigger Engine',
      'Automated GST E-Invoicing & B2B Ledgers',
      'Supplier Purchase Order & GRN Automation'
    ],
    systemVerdict: 'Ensured 100% billing continuity during internet outages, eliminated store inventory mismatch, and boosted checkout efficiency by over 200%.'
  },
  {
    id: 'fintech-lending',
    tag: 'FINANCIAL TRANSACTION CORE',
    category: 'Fintech & Micro-Credit',
    title: 'Digital Micro-Credit Origination & Automated EMI Loan Engine',
    industry: 'Financial Technology & Credit Cooperatives',
    clientProfile: 'Non-Banking Financial Institution with 18,000+ Active Borrowers',
    challenge: 'Slow manual credit appraisal, fragmented loan installment collection records, and high default risk due to delayed overdue notifications.',
    approach: 'Built a compliant credit management platform with automated borrower KYC verification, algorithmic credit assessment, and automated NACH/UPI mandate debits.',
    architectureBlueprint: {
      frontend: 'React Commercial Loan Dashboard // Field Agent Android App',
      services: 'Python Financial Calculation Core // Node.js Payment Webhooks',
      database: 'PostgreSQL ACID Ledger // Redis Distributed Lock',
      infrastructure: 'PCI-DSS Compliant VPC // Encrypted Data at Rest (AES-256)'
    },
    metrics: [
      { label: 'Loan Approval Cycle', value: '12 Mins', detail: 'Reduced from 3 business days to automated verification' },
      { label: 'On-Time EMI Recovery', value: '+42%', detail: 'Automated UPI payment reminders and auto-debit triggers' },
      { label: 'Ledger Audit Balance', value: '100.00%', detail: 'Double-entry cryptographic transaction verification' }
    ],
    deliverables: [
      'Instant Aadhaar & PAN KYC Verification Flow',
      'Double-Entry Cryptographic Accounting Ledger',
      'Automated Overdue Penalty & Dunning Engine',
      'Field Agent Geotagged Collection Application'
    ],
    systemVerdict: 'Accelerated loan turnaround to under 15 minutes, automated 100% of installment tracking, and established bank-grade audit reliability.'
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
      aria-label="OHO TECH Verified Architecture Case Studies and Enterprise Deployments"
      className="w-full bg-[#0a0a0b] text-[#e8e8e6] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b border-white/10">
          <div className="max-w-3xl">
            <ScrollReveal yOffset={15} duration={0.6}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>DEPLOYED SYSTEMS BLUEPRINT // CASE STUDIES</span>
              </div>
            </ScrollReveal>

            <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4 uppercase">
                Proven Engineering in Action.
              </h2>
              <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
                Real enterprise transformations structured through precise architectural execution, from root operational bottleneck to measured business outcome.
              </p>
            </ScrollReveal>
          </div>

          {/* Global CTA */}
          <div className="shrink-0">
            <Link
              href="/get-quote"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:-translate-y-0.5"
            >
              <span>Request System Blueprint</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Interactive Case Study Category Filter Navigation */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8 pb-4 border-b border-white/5">
          {CASE_STUDIES.map((cs) => {
            const isActive = cs.id === activeStudyId;
            return (
              <button
                key={cs.id}
                onClick={() => setActiveStudyId(cs.id)}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-black' : 'bg-slate-600'}`} />
                <span>{cs.category}</span>
              </button>
            );
          })}
        </div>

        {/* Active Case Study Master Blueprint Presentation */}
        <div className="bg-[#111113] border border-white/10 rounded-3xl p-6 sm:p-10 transition-all duration-300">
          
          {/* Top Metadata Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] font-bold uppercase tracking-wider">
                {activeStudy.tag}
              </span>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                Client Profile: {activeStudy.clientProfile}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>VERIFIED PRODUCTION DEPLOYMENT</span>
            </div>
          </div>

          {/* Case Study Title */}
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-8">
            {activeStudy.title}
          </h3>

          {/* Challenge vs Engineered Approach (2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-red-500/20">
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-red-400 uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>01 // THE ROOT OPERATIONAL CHALLENGE</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {activeStudy.challenge}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-emerald-500/20">
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>02 // THE ENGINEERED SYSTEM SOLUTION</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {activeStudy.approach}
              </p>
            </div>

          </div>

          {/* Architectural Blueprint Matrix (4 Layers) */}
          <div className="mb-8 p-6 rounded-2xl bg-[#0a0a0b] text-white border border-white/10">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  DEPLOYED ARCHITECTURAL TOPOLOGY
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">PROD READY // ACID COMPLIANT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[9px] uppercase text-slate-400 block mb-1">CLIENT INTERFACES</span>
                <span className="text-white font-bold">{activeStudy.architectureBlueprint.frontend}</span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[9px] uppercase text-slate-400 block mb-1">SERVICES &amp; LOGIC</span>
                <span className="text-white font-bold">{activeStudy.architectureBlueprint.services}</span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[9px] uppercase text-slate-400 block mb-1">DATA &amp; CACHE PERSISTENCE</span>
                <span className="text-white font-bold">{activeStudy.architectureBlueprint.database}</span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[9px] uppercase text-slate-400 block mb-1">DEPLOYMENT &amp; INFRA</span>
                <span className="text-white font-bold">{activeStudy.architectureBlueprint.infrastructure}</span>
              </div>
            </div>
          </div>

          {/* Verifiable Operational Metrics Grid */}
          <div className="mb-8">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>MEASURED OPERATIONAL IMPACT &amp; ROI</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeStudy.metrics.map((m, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-2">
                    {m.label}
                  </span>
                  <span className="text-3xl font-black text-white tracking-tight block mb-2">
                    {m.value}
                  </span>
                  <span className="text-xs text-slate-400 font-normal">
                    {m.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables & Bottom Verdict Strip */}
          <div className="pt-6 border-t border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 font-bold">
                CORE DELIVERABLE MODULES
              </span>
              <div className="flex flex-wrap gap-2">
                {activeStudy.deliverables.map((del, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-white/5 text-slate-300 text-xs font-medium border border-white/5">
                    {del}
                  </span>
                ))}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <Link
                href={`/solutions`}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
              >
                <span>Explore All Solutions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

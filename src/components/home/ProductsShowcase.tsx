'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Stethoscope, 
  Briefcase, 
  ShoppingBag, 
  Truck,
  ShieldCheck,
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Cpu,
  Database,
  Lock,
  Activity
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Tilt3D } from '@/components/ui/Tilt3D';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  badge: string;
  tagline: string;
  desc: string;
  keyCapabilities: string[];
  specs: { label: string; val: string }[];
  stack: string[];
  demoSlug: string;
  icon: React.ElementType;
}

const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'schoolcloud-erp',
    name: 'SchoolCloud ERP & Academic Continuum',
    category: 'Education & Institutional Systems',
    categorySlug: 'education',
    badge: 'FLAGSHIP EDUCATION',
    tagline: 'Multi-campus institutional governance platform',
    desc: 'Unified academic ecosystem integrating digital admissions, biometric attendance, automated fee ledger calculations, online grading, and parent portal communications.',
    keyCapabilities: [
      'Automated multi-head fee calculation with instantaneous receipt generation',
      'Digital examination workflow engine with customizable grading rubrics',
      'Vocational accreditation and skill mission compliance tracking'
    ],
    specs: [
      { label: 'Architecture', val: 'Multi-Tenant RBAC' },
      { label: 'Throughput', val: 'Sub-second Fee Audit' },
      { label: 'Security', val: 'Encrypted Records' }
    ],
    stack: ['Next.js', 'Spring Boot', 'PostgreSQL', 'Redis'],
    demoSlug: 'school-management-software',
    icon: Building2
  },
  {
    id: 'healthos-emr',
    name: 'HealthOS Clinical Informatics & EMR',
    category: 'Healthcare & Clinical Informatics',
    categorySlug: 'healthcare',
    badge: 'HEALTHCARE CORE',
    tagline: 'High-availability hospital & clinical operations engine',
    desc: 'Comprehensive clinical operations software featuring real-time OPD/IPD queue orchestration, role-isolated electronic health records, automated pharmacy dispensing, and lab analyzer integration.',
    keyCapabilities: [
      'Zero-lag OPD queue triage and electronic patient medical timeline',
      'Automated pharmacy stock deduction with batch expiry enforcement',
      'Diagnostic analyzer interface with automated secure SMS reports'
    ],
    specs: [
      { label: 'Privacy', val: 'Role-Isolated EMR' },
      { label: 'Sync Speed', val: '< 50ms Real-Time' },
      { label: 'Billing Engine', val: 'GST & TPA Ready' }
    ],
    stack: ['React', 'Node.js', 'PostgreSQL', 'mTLS'],
    demoSlug: 'hospital-management-software',
    icon: Stethoscope
  },
  {
    id: 'fincore-nbfc',
    name: 'FinCore Microfinance & Loan Ledger',
    category: 'Fintech & Lending Infrastructure',
    categorySlug: 'fintech',
    badge: 'FINANCIAL LEDGER',
    tagline: 'ACID-compliant loan origination and servicing suite',
    desc: 'Specialized ledger infrastructure for NBFCs and credit cooperatives. Handles loan origination, automated EMI amortization schedules, collateral valuation, and field agent mobile collection sync.',
    keyCapabilities: [
      'Deterministic daily/monthly EMI calculation & automated penalty rules',
      'Field agent offline mobile sync with tamper-evident digital receipts',
      'Real-time NPA categorization and automated audit trail generation'
    ],
    specs: [
      { label: 'Ledger Engine', val: 'ACID Transactional' },
      { label: 'Audit Trail', val: 'Immutable Log' },
      { label: 'Field Sync', val: 'Offline-First' }
    ],
    stack: ['FastAPI', 'PostgreSQL', 'Docker', 'JWT'],
    demoSlug: 'finance-nbfc',
    icon: Briefcase
  },
  {
    id: 'retailpos-omni',
    name: 'Omnichannel RetailPOS & Inventory Ledger',
    category: 'Retail & Commercial Operations',
    categorySlug: 'retail',
    badge: 'RETAIL MATRIX',
    tagline: 'High-speed multi-store billing & inventory synchronization',
    desc: 'Rapid thermal barcode billing terminal software integrated with multi-warehouse inventory telemetry, automated vendor purchase orders, and GST tax filing reports.',
    keyCapabilities: [
      'Sub-3s thermal barcode checkout with offline cache resilience',
      'Multi-store centralized stock synchronization and low-stock triggers',
      'Integrated customer loyalty ledger and GST-ready sales tax reports'
    ],
    specs: [
      { label: 'Billing Latency', val: '< 3s / Transaction' },
      { label: 'Store Sync', val: 'Central Mesh' },
      { label: 'Hardware', val: 'Thermal / POS Ready' }
    ],
    stack: ['Electron', 'React', 'SQLite', 'WebSockets'],
    demoSlug: 'retail-pos-software',
    icon: ShoppingBag
  },
  {
    id: 'machship-logistics',
    name: 'MachShip Multimodal Fleet & Freight ERP',
    category: 'Supply Chain & Logistics',
    categorySlug: 'logistics',
    badge: 'SUPPLY CHAIN',
    tagline: 'Multimodal freight routing and warehouse dispatch engine',
    desc: 'Enterprise logistics management orchestrating road, sea, and air freight legs, dock appointment scheduling, automated bill-of-lading generation, and real-time shipment GPS telemetry.',
    keyCapabilities: [
      'Multimodal consignment tracking across truck, maritime, and air legs',
      'Automated route optimization and digital proof of delivery (e-POD)',
      'Real-time fuel telemetry, driver settlement, and dispatch scheduling'
    ],
    specs: [
      { label: 'Telemetry', val: 'Real-Time GPS' },
      { label: 'Routing', val: 'Multimodal Intermodal' },
      { label: 'Dispatch', val: 'Automated Queue' }
    ],
    stack: ['Go', 'PostGIS', 'Kafka', 'Next.js'],
    demoSlug: 'custom-software-development',
    icon: Truck
  },
  {
    id: 'govconnect-workflow',
    name: 'GovConnect Public Sector Workflow Platform',
    category: 'Enterprise Governance',
    categorySlug: 'governance',
    badge: 'GOV TECH',
    tagline: 'Transparent citizen grievance and multi-tier approval workflow',
    desc: 'High-security citizen engagement and departmental grievance tracking portal with multi-level hierarchical escalation, Aadhaar verification integration, and automated SMS notifications.',
    keyCapabilities: [
      'Hierarchical ticket routing with SLA countdown triggers and auto-escalation',
      'Role-based departmental dashboards with immutable action history',
      'Bilingual citizen web interface with automated status updates'
    ],
    specs: [
      { label: 'SLA Tracking', val: 'Automated Escalation' },
      { label: 'Security', val: 'Zero-Trust RBAC' },
      { label: 'Access', val: 'Bilingual / Web' }
    ],
    stack: ['Java Spring', 'React', 'PostgreSQL', 'Redis'],
    demoSlug: 'custom-software-development',
    icon: ShieldCheck
  }
];

const CATEGORY_TABS = [
  { id: 'all', label: 'ALL PLATFORMS' },
  { id: 'education', label: 'EDUCATION' },
  { id: 'healthcare', label: 'HEALTHCARE' },
  { id: 'fintech', label: 'FINTECH' },
  { id: 'retail', label: 'RETAIL' },
  { id: 'logistics', label: 'LOGISTICS' }
];

export function ProductsShowcase() {
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const filteredProducts = React.useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS_DATA;
    return PRODUCTS_DATA.filter((p) => p.categorySlug === activeCategory);
  }, [activeCategory]);

  return (
    <section 
      id="products" 
      role="region"
      aria-label="OHO TECH Enterprise Products and Turnkey Platforms"
      className="w-full py-20 sm:py-28 px-6 sm:px-10 lg:px-16 bg-[#0a0a0b] text-[#e8e8e6] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-0 right-1/3 w-[500px] h-[300px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[250px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-14 pb-6 border-b border-white/10">
          <div>
            <ScrollReveal yOffset={14} duration={0.6}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>ENTERPRISE PLATFORMS // MODULAR APPLICATION SUITE</span>
              </div>
            </ScrollReveal>

            <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase">
                Mission-Critical Software. <span className="text-neutral-400">Architected for Scale.</span>
              </h2>
            </ScrollReveal>

            <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl font-mono mt-3 leading-relaxed">
              Turnkey digital platforms engineered for high concurrency, ACID transaction consistency, and enterprise governance across core industry verticals.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento Grid Matrix of Platforms */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => {
            const Icon = prod.icon;
            return (
              <ScrollReveal key={prod.id} yOffset={20} duration={0.6}>
                <Tilt3D maxTilt={4} scale={1.01} className="h-full">
                  <div className="h-full rounded-2xl sm:rounded-3xl bg-[#121316]/90 border border-white/15 p-6 sm:p-7 hover:border-emerald-500/50 hover:bg-[#16181d] transition-all duration-300 flex flex-col justify-between group shadow-xl relative overflow-hidden">
                    
                    {/* Subtle top corner tech bracket */}
                    <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity">
                      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                    </div>

                    <div>
                      {/* Card Top Strip */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-200">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                            {prod.badge}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          DEPLOYMENT READY
                        </span>
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-1 group-hover:text-emerald-300 transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mb-4">
                        {prod.tagline}
                      </p>

                      <p className="text-xs text-slate-300 font-normal leading-relaxed mb-5 line-clamp-3">
                        {prod.desc}
                      </p>

                      {/* Technical Specifications Matrix */}
                      <div className="grid grid-cols-3 gap-2 mb-5">
                        {prod.specs.map((s) => (
                          <div key={s.label} className="p-2 rounded-lg bg-white/5 border border-white/10 text-center">
                            <span className="text-[9px] font-mono text-slate-400 block uppercase truncate">
                              {s.label}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-white block truncate">
                              {s.val}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Key Capability Highlights */}
                      <div className="space-y-2 mb-6">
                        {prod.keyCapabilities.slice(0, 2).map((cap, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 font-normal">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Bottom Strip: Stack Tags & Link */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {prod.stack.slice(0, 3).map((stk) => (
                          <span key={stk} className="px-2 py-0.5 rounded bg-white/5 text-[9.5px] font-mono text-slate-300 border border-white/10">
                            {stk}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/products#${prod.id}`}
                        className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform shrink-0"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>
                </Tilt3D>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom Fast Action Banner */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#121316] border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white block">
                Custom Enterprise Platform Requirements?
              </span>
              <span className="text-xs text-slate-400 font-mono">
                OHO TECH provides bespoke platform customization, on-premise installation, and private cloud deployments.
              </span>
            </div>
          </div>

          <Link
            href="/get-quote"
            className="px-6 py-3 rounded-xl bg-white hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shrink-0 inline-flex items-center gap-2"
          >
            <span>Request Architecture Blueprint</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default ProductsShowcase;


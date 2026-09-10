'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Stethoscope, 
  Briefcase, 
  ShoppingBag, 
  Factory, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  badge: string;
  desc: string;
  keyCapabilities: string[];
  metrics: { label: string; val: string }[];
  demoSlug: string;
  icon: React.ElementType;
}

const realProducts: ProductItem[] = [
  {
    id: 'schoolcloud-erp',
    name: 'SchoolCloud ERP & Vocational Continuum',
    category: 'Education & Institutional Systems',
    categorySlug: 'education',
    badge: 'FLAGSHIP EDUCATION',
    desc: 'End-to-end institutional management encompassing digital admissions, biometric student attendance, automated fee ledger calculations, online examinations, and parent-teacher communication portals.',
    keyCapabilities: [
      'Automated fee collection with instant receipt generation',
      'Digital examination & automated grading engine',
      'State skill mission & vocational accreditation tracking'
    ],
    metrics: [
      { label: 'Module Count', val: '18 Modules' },
      { label: 'Role Access', val: 'Multi-Role' },
      { label: 'Compliance', val: 'CBSE / State' }
    ],
    demoSlug: 'school-management-software',
    icon: Building2
  },
  {
    id: 'healthos-emr',
    name: 'HealthOS Hospital Management & EMR',
    category: 'Healthcare & Clinical Informatics',
    categorySlug: 'healthcare',
    badge: 'HEALTHCARE CORE',
    desc: 'Comprehensive clinical operations software featuring OPD/IPD queues, electronic medical records (EMR), automated pharmacy dispensing, pathology lab integration, and bed allocation telemetry.',
    keyCapabilities: [
      'Unified electronic health records with secure role access',
      'Real-time pharmacy stock & batch expiry tracking',
      'Diagnostic lab analyzer integration & automated SMS reports'
    ],
    metrics: [
      { label: 'OPD Flow', val: '< 2min Queue' },
      { label: 'EMR Privacy', val: 'HIPAA Compliant' },
      { label: 'Billing Engine', val: 'GST & TPA Ready' }
    ],
    demoSlug: 'hospital-management-software',
    icon: Stethoscope
  },
  {
    id: 'fincore-nbfc',
    name: 'FinCore Microfinance & Loan Ledger',
    category: 'Fintech & Lending Infrastructure',
    categorySlug: 'finance-nbfc',
    badge: 'FINANCIAL LEDGER',
    desc: 'Specialized financial ledger software for NBFCs and credit cooperatives. Handles loan origination, automated EMI amortization schedules, collateral management, and field collection sync.',
    keyCapabilities: [
      'Automated daily/monthly EMI calculation & penalty rules',
      'Field agent mobile collection sync with instant receipts',
      'Comprehensive NPA tracking & balance sheet audits'
    ],
    metrics: [
      { label: 'Ledger Precision', val: 'ACID Compliant' },
      { label: 'EMI Schedules', val: 'Automated' },
      { label: 'Audit Trail', val: '100% Immutable' }
    ],
    demoSlug: 'finance-nbfc',
    icon: Briefcase
  },
  {
    id: 'retailpos-omni',
    name: 'Omnichannel RetailPOS & Inventory Ledger',
    category: 'Retail & Commercial Operations',
    categorySlug: 'retail-ecommerce',
    badge: 'RETAIL SUITE',
    desc: 'High-speed barcode billing terminal software integrated with multi-store warehouse inventory, supplier purchase orders, GST tax filing reports, and loyalty program management.',
    keyCapabilities: [
      'Ultra-fast thermal barcode billing with offline fallback',
      'Multi-store centralized inventory synchronization',
      'Automatic re-order threshold triggers & vendor PO generation'
    ],
    metrics: [
      { label: 'Billing Speed', val: '< 3s / Invoice' },
      { label: 'Barcode Sync', val: 'Sub-second' },
      { label: 'Store Sync', val: 'Real-Time' }
    ],
    demoSlug: 'retail-pos-software',
    icon: ShoppingBag
  }
];

export function ProductsShowcase() {
  return (
    <section id="products" className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 px-4 sm:px-8 lg:px-12 py-12 sm:py-16 bg-white border-2 border-slate-200/80 rounded-[28px] sm:rounded-[44px] shadow-sm relative overflow-hidden">
      
      {/* Section Header */}
      <div className="max-w-3xl mb-10 sm:mb-14">
        <ScrollReveal yOffset={15} duration={0.6}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>ENTERPRISE PRODUCTS &amp; PLATFORMS</span>
          </div>
        </ScrollReveal>

        <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0d0d0e] tracking-tight leading-tight sm:leading-[1.1] mb-3">
            Turnkey Software Built for Scale.
          </h2>
          <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed">
            Proven enterprise software systems engineered for hospitals, universities, financial institutions, and retail operations.
          </p>
        </ScrollReveal>
      </div>

      {/* Large Immersive Product Panels */}
      <div className="space-y-6 sm:space-y-8">
        {realProducts.map((prod) => {
          const Icon = prod.icon;
          return (
            <ScrollReveal key={prod.id} yOffset={25} duration={0.7}>
              <div className="rounded-2xl sm:rounded-3xl border-2 border-slate-200/80 bg-[#fafafa] p-6 sm:p-10 hover:border-slate-400/80 transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                  
                  {/* Left Column: Product Info & Actions */}
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold uppercase tracking-wider">
                        {prod.badge}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {prod.category}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-3xl font-black text-[#0d0d0e] tracking-tight mb-3">
                      {prod.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                      {prod.desc}
                    </p>

                    {/* Capabilities Checklist */}
                    <div className="space-y-2 mb-6">
                      {prod.keyCapabilities.map((cap) => (
                        <div key={cap} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action CTAs */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/products?category=${prod.categorySlug}`}
                        className="px-6 py-2.5 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm inline-flex items-center gap-2"
                      >
                        <span>Explore Product</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href="/get-quote"
                        className="px-6 py-2.5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-[#0d0d0e] font-extrabold text-xs uppercase tracking-wider transition-all duration-200"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Technical Specs Card */}
                  <div className="lg:col-span-5 bg-[#0d0d0e] text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-emerald-400" />
                        <span className="font-mono text-xs text-slate-300 font-bold">SYSTEM SPECIFICATIONS</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">READY</span>
                    </div>

                    <div className="space-y-3 mb-4">
                      {prod.metrics.map((m) => (
                        <div key={m.label} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-xs text-slate-400 font-mono">{m.label}</span>
                          <span className="text-xs font-bold text-white font-mono">{m.val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Deployment: Cloud or On-Premise</span>
                      <span className="text-emerald-400">Instant Provision</span>
                    </div>
                  </div>

                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

    </section>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Package, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Key, 
  Server, 
  Activity, 
  GraduationCap, 
  Store, 
  Building2, 
  ShoppingCart,
  Users,
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { TextReveal } from '@/components/ui/TextReveal';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const PRODUCT_CATEGORIES = [
  { name: 'Hospital & Clinical EMR', icon: Activity, href: '/products?category=2', count: 'OPD / IPD / Lab / Pharmacy' },
  { name: 'University & Campus ERP', icon: GraduationCap, href: '/products?category=1', count: 'Fees / Exams / LMS / Portal' },
  { name: 'Retail & Multi-Store POS', icon: Store, href: '/products?category=4', count: 'Barcode / Inventory / GST' },
  { name: 'Financial Accounting & Ledger', icon: Building2, href: '/products?category=3', count: 'Double-Entry / Tax / Audit' },
  { name: 'E-Commerce Storefront Engine', icon: ShoppingCart, href: '/products?category=4', count: 'Cart / Payment / Catalog' },
  { name: 'Business Enterprise & HRMS', icon: Users, href: '/products?category=3', count: 'Payroll / Roles / Attendance' },
];

const DEPLOYMENT_CYCLE = [
  { step: '01', title: 'Discover', desc: 'Browse 28+ pre-engineered enterprise applications.' },
  { step: '02', title: 'Evaluate', desc: 'Test interactive live demos and inspect technical specs.' },
  { step: '03', title: 'Buy', desc: 'Instant checkout with perpetual or subscription licenses.' },
  { step: '04', title: 'Deploy', desc: 'Turnkey installation on your private cloud or on-premise VPS.' },
];

export function ProductDiscoveryBanner() {
  return (
    <section 
      id="product-discovery" 
      aria-label="OHO TECH Turnkey Software Product Discovery"
      className="w-full bg-[#0a0a0d] text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/5"
    >
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b border-white/10">
          <div>
            <ScrollReveal yOffset={15} duration={0.6}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
                <Package className="w-3.5 h-3.5" />
                <span>COMMERCIAL SOFTWARE CATALOG • 28 READY SYSTEMS</span>
              </div>
            </ScrollReveal>

            <TextReveal as="h2" splitType="words" className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.035em] leading-[1.1]">
              Software, ready to deploy.
            </TextReveal>
          </div>
          
          <div className="max-w-md text-left md:text-right">
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-4">
              Explore our catalog of 28 pre-built enterprise platforms. Test live interactive demos, license directly through our store, and deploy within hours.
            </p>
            <div className="flex items-center gap-4 justify-start md:justify-end">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 font-mono text-xs text-sky-400 hover:text-sky-300 font-bold uppercase tracking-wider group"
              >
                <span>Explore All Software</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-slate-600 font-mono text-xs">•</span>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-white font-bold uppercase tracking-wider"
              >
                <span>View Licensing</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 6 Category Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {PRODUCT_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                href={cat.href}
                className="bg-[#121318] border border-white/10 hover:border-sky-500/60 rounded-3xl p-6 transition-all duration-300 group hover:shadow-[0_0_25px_rgba(56,189,248,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-sky-400 flex items-center justify-center mb-4 group-hover:bg-sky-500/20 group-hover:border-sky-500/40 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {cat.count}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono font-bold text-sky-400">
                  <span>View Software</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* 4-Step Turnkey Deployment Flow: Discover → Evaluate → Buy → Deploy */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-black/40 border border-white/10">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-6 text-center font-bold">
            THE OHO TECH SOFTWARE ACQUISITION CYCLE
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEPLOYMENT_CYCLE.map((cycle, idx) => (
              <div key={idx} className="relative">
                <div className="text-lg font-bold text-sky-400 font-mono mb-1.5 flex items-center gap-2">
                  <span>{cycle.step}</span>
                  <span className="text-white/20">/</span>
                  <span className="text-white">{cycle.title}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {cycle.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Value Proposition Callout Box */}
        <div className="bg-gradient-to-r from-[#0f1118] via-[#121524] to-[#0f1118] border border-sky-500/30 rounded-[32px] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> 100% Single-Tenant Isolation
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                <Key className="w-4 h-4" /> Cryptographic Node-Locking
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                <Server className="w-4 h-4" /> Free Cloud &amp; VPS Deployment
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Every software package includes perpetual or subscription licensing, automated PostgreSQL database schema migrations, and turnkey installation support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>EXPLORE ALL SOFTWARE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <span>VIEW LICENSING</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ProductDiscoveryBanner;

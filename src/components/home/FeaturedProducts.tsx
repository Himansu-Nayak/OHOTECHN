'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { ArrowRight, Check, Eye, ShieldCheck, Sparkles, ShoppingBag, ExternalLink, Zap } from 'lucide-react';
import { softwareDemos } from '@/config/demos';
import { ProductQuickViewModal, isValidLiveDemoUrl } from '@/components/products/ProductQuickViewModal';
import { Product } from '@/config/industries';
import { formatInr } from '@/utils/cartUtils';

interface FeaturedProductItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  demoSlug: string;
  features: string[];
}

const FEATURED_PRODUCTS: FeaturedProductItem[] = [
  {
    id: 1,
    name: 'School Management Software',
    category: 'Education',
    price: 35000,
    description: 'Complete K-12 school administration, student attendance, fee receipts, report cards, and parent portal.',
    image: '/ecosystem_education.png',
    demoSlug: 'school-management-software',
    features: ['Student & Teacher Portals', 'Automated Fee Invoices', 'Exam & Report Card Engine', 'Multi-Device Licensing'],
  },
  {
    id: 6,
    name: 'Hospital Management Software (HMS)',
    category: 'Healthcare',
    price: 75000,
    description: 'Comprehensive healthcare operations covering OPD/IPD, EMR records, doctor schedules, pharmacy, and lab billing.',
    image: '/ecosystem_healthcare.png',
    demoSlug: 'hospital-management-software',
    features: ['OPD & IPD Workflows', 'EMR & Diagnostic Lab', 'Pharmacy Inventory & Billing', 'HL7/FHIR Standards Ready'],
  },
  {
    id: 15,
    name: 'Retail POS & Billing Software',
    category: 'Retail & POS',
    price: 29000,
    description: 'High-speed barcode billing, multi-store inventory synchronization, supplier ledger, and GST-compliant invoices.',
    image: '/images/3d-enterprise-node.jpg',
    demoSlug: 'retail-pos-billing-software',
    features: ['Fast Barcode Scanner Sync', 'GST Invoice Generator', 'Multi-Store Stock Balance', 'Offline-First Billing Engine'],
  },
  {
    id: 19,
    name: 'Multi-Vendor E-Commerce Portal',
    category: 'E-Commerce',
    price: 75000,
    description: 'Enterprise marketplace platform with seller payout engine, product catalog management, and payment gateway.',
    image: '/images/3d-software-dev.jpg',
    demoSlug: 'multi-vendor-e-commerce-portal',
    features: ['Vendor Management Dashboard', 'Commission & Payout Engine', 'Customer Checkout & Cart', 'Live Shipment Tracking'],
  },
  {
    id: 11,
    name: 'Enterprise HRMS & Payroll',
    category: 'ERP & HR',
    price: 55000,
    description: 'Biometric machine integration, leave workflows, salary slip generation, tax deductions, and compliance tracking.',
    image: '/images/3d-enterprise-node.jpg',
    demoSlug: 'enterprise-hrms-payroll',
    features: ['Biometric Sync Integration', 'Automated Payroll & Slips', 'Leave & Attendance Approval', 'Statutory Tax Compliance'],
  },
  {
    id: 23,
    name: 'Real Estate CRM & Booking Engine',
    category: 'Services & Booking',
    price: 59000,
    description: 'Property listing catalog, automated lead distribution, site visit scheduling, and buyer agreement automation.',
    image: '/images/3d-digital-growth.jpg',
    demoSlug: 'real-estate-crm-booking-engine',
    features: ['Lead Capture & Allocation', 'Interactive Unit Availability', 'Site Visit Scheduling', 'Payment Schedule Milestones'],
  },
];

export function FeaturedProducts() {
  const [activeQuickViewProduct, setActiveQuickViewProduct] = React.useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<string>('software');

  const openQuickView = (item: FeaturedProductItem) => {
    const matchedDemo = softwareDemos.find(
      (d) => d.slug === item.demoSlug || d.title.toLowerCase().includes(item.name.toLowerCase())
    );

    const rawDemoUrl = matchedDemo?.mainDemoUrl || matchedDemo?.frontendUrl || matchedDemo?.accounts?.[0]?.url;
    const validDemoUrl = isValidLiveDemoUrl(rawDemoUrl) ? rawDemoUrl : undefined;

    const prodObj: Product = {
      id: item.id,
      name: item.name,
      slug: matchedDemo?.slug || item.demoSlug,
      shortDescription: item.description,
      demoUrl: validDemoUrl,
      features: matchedDemo?.features || item.features,
      adminCredentials: {
        email: matchedDemo?.accounts?.[0]?.email || 'admin@demo.ohotech.com',
        password: matchedDemo?.accounts?.[0]?.password || 'Admin@12345',
      },
    };

    setActiveQuickViewProduct(prodObj);
    setActiveCategory(item.category);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1536px] mx-auto text-[#0d0d0e]" id="featured-products">
      
      {/* Section Header */}
      <div className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 mb-10 shadow-sm relative overflow-hidden grid-pattern-light">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              TURNKEY SOFTWARE SUITES &amp; PRODUCTION MODULES
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0d0d0e] mb-4 leading-tight">
              Featured Software Products Ready for Deployment
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Explore turnkey cloud applications tested for enterprise workload. Evaluate with live interactive admin test-drives, or purchase perpetual source code rights backed by 24/7 SLA.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md group"
            >
              <span>Explore All 28 Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {FEATURED_PRODUCTS.map((prod) => {
          return (
            <div
              key={prod.id}
              className="bg-white border-2 border-slate-300 hover:border-emerald-500 rounded-[32px] p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-xl relative overflow-hidden group"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5 bg-[#0d0d0e]">
                  <NextImage
                    src={prod.image}
                    alt={prod.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e]/90 via-[#0d0d0e]/30 to-transparent pointer-events-none" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="text-[10px] font-mono font-extrabold px-3 py-1 rounded-full bg-[#0d0d0e]/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md uppercase tracking-wider shadow-sm">
                      {prod.category}
                    </span>
                    <span className="text-[10px] font-mono text-white/80 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      PROD-0{prod.id}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-extrabold text-[#0d0d0e] mb-2 leading-tight group-hover:text-emerald-700 transition-colors">
                  {prod.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                  {prod.description}
                </p>

                {/* Verified Capabilities */}
                <div className="space-y-1.5 mb-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  {prod.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Guarantee Pill */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs mb-5">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Starting Price</div>
                    <div className="text-lg font-black text-[#0d0d0e]">{formatInr(prod.price)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Licensing</div>
                    <div className="text-xs font-extrabold text-emerald-600 flex items-center gap-1 justify-end">
                      <ShieldCheck className="w-3.5 h-3.5" /> Perpetual
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <button
                  onClick={() => openQuickView(prod)}
                  className="w-full py-3 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0d0d0e] font-extrabold text-xs uppercase tracking-wider text-center transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Test-Drive Live Demo</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/products/${prod.id}`}
                    className="py-2.5 px-3 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-[10px] uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1"
                  >
                    <span>View Plans</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <Link
                    href={`/get-quote?product=${encodeURIComponent(prod.name)}`}
                    className="py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-[10px] uppercase tracking-wider transition-all text-center truncate"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      {activeQuickViewProduct && (
        <ProductQuickViewModal
          product={activeQuickViewProduct}
          industrySlug={activeCategory}
          onClose={() => setActiveQuickViewProduct(null)}
        />
      )}
    </section>
  );
}

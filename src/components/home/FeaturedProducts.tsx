'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { ArrowRight, Check, Eye, ShieldCheck, Sparkles, ShoppingBag, ExternalLink, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { softwareDemos } from '@/config/demos';
import { ProductQuickViewModal, isValidLiveDemoUrl } from '@/components/products/ProductQuickViewModal';
import { Product } from '@/config/industries';
import { formatInr } from '@/utils/cartUtils';
import { getProductsApi } from '@/api/products';
import { ProductDto } from '@/api/types';

interface FallbackProductItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  demoSlug: string;
  features: string[];
}

const VERIFIED_FALLBACK_PRODUCTS: FallbackProductItem[] = [
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
  const [products, setProducts] = React.useState<ProductDto[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = React.useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<string>('software');

  const fetchFeaturedProducts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProductsApi(0, 6);
      if (res.success && res.data?.content && res.data.content.length > 0) {
        setProducts(res.data.content);
      } else {
        // Fallback to verified catalog
        setProducts(
          VERIFIED_FALLBACK_PRODUCTS.map((f) => ({
            id: f.id,
            name: f.name,
            description: f.description,
            price: f.price,
            stock: 99,
            imageUrl: f.image,
            categoryName: f.category,
            active: true,
          }))
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      // Fallback on error to ensure smooth UX
      setProducts(
        VERIFIED_FALLBACK_PRODUCTS.map((f) => ({
          id: f.id,
          name: f.name,
          description: f.description,
          price: f.price,
          stock: 99,
          imageUrl: f.image,
          categoryName: f.category,
          active: true,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const openQuickView = (prod: ProductDto) => {
    const matchedDemo = softwareDemos.find(
      (d) =>
        d.id === prod.id ||
        d.title.toLowerCase().trim() === prod.name.toLowerCase().trim() ||
        prod.name.toLowerCase().includes(d.title.toLowerCase()) ||
        d.title.toLowerCase().includes(prod.name.toLowerCase())
    );

    const rawDemoUrl = matchedDemo?.mainDemoUrl || matchedDemo?.frontendUrl || matchedDemo?.accounts?.[0]?.url;
    const validDemoUrl = isValidLiveDemoUrl(rawDemoUrl) ? rawDemoUrl : undefined;

    const fallbackMatch = VERIFIED_FALLBACK_PRODUCTS.find((f) => f.id === prod.id);

    const prodObj: Product = {
      id: prod.id,
      name: prod.name,
      slug: matchedDemo?.slug || fallbackMatch?.demoSlug || `prod-${prod.id}`,
      shortDescription: prod.description,
      demoUrl: validDemoUrl,
      features: matchedDemo?.features || fallbackMatch?.features || [
        'Single-Tenant Cloud Isolation',
        'Cryptographic Hardware Licensing',
        'Role-Based Access Control',
        'Automated Invoice Generation',
      ],
      adminCredentials: {
        email: matchedDemo?.accounts?.[0]?.email || 'admin@demo.ohotech.com',
        password: matchedDemo?.accounts?.[0]?.password || 'Admin@12345',
      },
    };

    setActiveQuickViewProduct(prodObj);
    setActiveCategory(prod.categoryName || 'software');
  };

  const getImageForProduct = (prod: ProductDto) => {
    if (prod.imageUrl && prod.imageUrl.startsWith('/')) return prod.imageUrl;
    const fallbackMatch = VERIFIED_FALLBACK_PRODUCTS.find((f) => f.id === prod.id);
    if (fallbackMatch?.image) return fallbackMatch.image;

    const cat = (prod.categoryName || '').toLowerCase();
    if (cat.includes('educat')) return '/ecosystem_education.png';
    if (cat.includes('health') || cat.includes('hms')) return '/ecosystem_healthcare.png';
    if (cat.includes('retail') || cat.includes('pos')) return '/images/3d-enterprise-node.jpg';
    if (cat.includes('commerc')) return '/images/3d-software-dev.jpg';
    return '/images/3d-digital-growth.jpg';
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1536px] mx-auto text-[#0d0d0e]" id="featured-products">
      
      {/* Section Header */}
      <div className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 mb-10 shadow-sm relative overflow-hidden grid-pattern-light">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              FEATURED SOFTWARE SOLUTIONS
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0d0d0e] mb-4 leading-tight">
              Enterprise Software Ready for Deployment
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Explore turnkey cloud applications tested for enterprise workload. Evaluate with live interactive admin test-drives, or purchase perpetual source code rights backed by 24/7 SLA.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md group"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-slate-200 rounded-[32px] p-6 animate-pulse space-y-4 shadow-xs"
            >
              <div className="w-full h-48 bg-slate-100 rounded-2xl" />
              <div className="h-6 bg-slate-100 rounded-xl w-3/4" />
              <div className="h-4 bg-slate-100 rounded-lg w-full" />
              <div className="h-4 bg-slate-100 rounded-lg w-2/3" />
              <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100" />
              <div className="h-12 bg-slate-100 rounded-full w-full" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-8 shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-extrabold text-[#0d0d0e] mb-2">No Featured Products Available</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            The catalog is temporarily undergoing index synchronization. You can explore the full solutions suite.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => fetchFeaturedProducts()}
              className="px-5 py-2.5 rounded-full bg-[#0d0d0e] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Load</span>
            </button>
            <Link
              href="/products"
              className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((prod) => {
            const imageSrc = getImageForProduct(prod);
            const matchedDemo = softwareDemos.find(
              (d) =>
                d.id === prod.id ||
                d.title.toLowerCase().trim() === prod.name.toLowerCase().trim() ||
                prod.name.toLowerCase().includes(d.title.toLowerCase()) ||
                d.title.toLowerCase().includes(prod.name.toLowerCase())
            );
            const hasValidDemo = matchedDemo ? isValidLiveDemoUrl(matchedDemo.mainDemoUrl || matchedDemo.frontendUrl || matchedDemo.accounts?.[0]?.url) : false;

            const fallbackMatch = VERIFIED_FALLBACK_PRODUCTS.find((f) => f.id === prod.id);
            const features = matchedDemo?.features || fallbackMatch?.features || [
              'Cryptographic Key Licensing',
              'Single-Tenant Cloud Database',
              'Multi-Device Activation Limits',
              '24/7 Priority SLA & Updates',
            ];

            return (
              <div
                key={prod.id}
                className="bg-white border-2 border-slate-300 hover:border-emerald-500 rounded-[32px] p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-xl relative overflow-hidden group"
              >
                <div>
                  {/* Visual Image Header */}
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5 bg-[#0d0d0e]">
                    <NextImage
                      src={imageSrc}
                      alt={prod.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e]/90 via-[#0d0d0e]/30 to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="text-[10px] font-mono font-extrabold px-3 py-1 rounded-full bg-[#0d0d0e]/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md uppercase tracking-wider shadow-sm">
                        {prod.categoryName || 'Software Suite'}
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
                    {features.slice(0, 3).map((f, i) => (
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
                      <div className="text-lg font-black text-[#0d0d0e]">{formatInr(prod.price || 29000)}</div>
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
                  {hasValidDemo ? (
                    <button
                      type="button"
                      onClick={() => openQuickView(prod)}
                      className="w-full py-3 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0d0d0e] font-extrabold text-xs uppercase tracking-wider text-center transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Test-Drive Live Demo</span>
                    </button>
                  ) : (
                    <Link
                      href={`/products/${prod.id}`}
                      className="w-full py-3 px-4 rounded-full bg-slate-900 hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider text-center transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <span>Explore Software Specs</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/products/${prod.id}`}
                      className="py-2.5 px-3 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-[10px] uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1 min-h-[40px]"
                    >
                      <span>View Plans</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>

                    <Link
                      href={`/get-quote?product=${encodeURIComponent(prod.name)}`}
                      className="py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-[10px] uppercase tracking-wider transition-all text-center truncate min-h-[40px] flex items-center justify-center"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

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

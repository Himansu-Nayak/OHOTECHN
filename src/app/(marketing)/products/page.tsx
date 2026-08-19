'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { ArrowRight, Check, Copy, ExternalLink, Key, Search, ShieldCheck, Sparkles, MonitorPlay, ShoppingBag, Loader2, AlertCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { softwareDemos } from '@/config/demos';
import { cn } from '@/lib/utils';
import { getProductsApi } from '@/api/products';
import { ProductDto } from '@/api/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ProductQuickViewModal } from '@/components/products/ProductQuickViewModal';
import { Product } from '@/config/industries';

export default function ProductsCatalogPage() {
  const { addToCart, loading: cartLoading } = useCart();
  const { showToast } = useToast();

  const [products, setProducts] = React.useState<ProductDto[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Pagination & Search
  const [page, setPage] = React.useState<number>(0);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [totalElements, setTotalElements] = React.useState<number>(0);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  
  // Quick View Modal state
  const [activeQuickViewProduct, setActiveQuickViewProduct] = React.useState<Product | null>(null);
  const [activeQuickViewCategory, setActiveQuickViewCategory] = React.useState<string>('software');

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch backend products
  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProductsApi(page, 9, debouncedSearch);
      if (res.success && res.data && res.data.content && res.data.content.length > 0) {
        setProducts(res.data.content);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      } else {
        // Fallback default products
        setProducts(getFallbackProducts());
        setTotalPages(1);
        setTotalElements(28);
      }
    } catch (err: any) {
      console.warn('Backend products fetch failed, rendering turnkey fallback product catalog:', err?.message);
      setProducts(getFallbackProducts());
      setTotalPages(1);
      setTotalElements(28);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'education', label: 'Education' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'erp', label: 'ERP & HR' },
    { id: 'retail', label: 'Retail & POS' },
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'services', label: 'Services & Booking' },
  ];

  const handleAddToCart = async (productId: number) => {
    await addToCart(productId, 1);
  };

  const getProductImage = (product: ProductDto) => {
    if (product.imageUrl && product.imageUrl.startsWith('/') && !product.imageUrl.endsWith('LOGO.png')) {
      return product.imageUrl;
    }
    const name = product.name.toLowerCase();
    if (name.includes('school') || name.includes('college') || name.includes('university') || name.includes('lms') || name.includes('education')) {
      return '/ecosystem_education.png';
    }
    if (name.includes('hospital') || name.includes('clinic') || name.includes('health') || name.includes('pathology') || name.includes('ivf') || name.includes('pharmacy')) {
      return '/ecosystem_healthcare.png';
    }
    if (name.includes('pos') || name.includes('retail') || name.includes('grocery') || name.includes('jewellery') || name.includes('garments') || name.includes('billing')) {
      return '/images/3d-enterprise-node.jpg';
    }
    if (name.includes('growth') || name.includes('seo') || name.includes('marketing') || name.includes('ad')) {
      return '/images/3d-digital-growth.jpg';
    }
    return '/images/3d-software-dev.jpg';
  };

  const openQuickView = (productDto: ProductDto) => {
    const matchedDemo = softwareDemos.find((d) => d.title.toLowerCase().includes(productDto.name.toLowerCase()) || productDto.name.toLowerCase().includes(d.title.toLowerCase()));
    
    const prodObj: Product = {
      name: productDto.name,
      slug: matchedDemo?.slug || productDto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: productDto.description || 'Enterprise-ready turnkey software module.',
      demoUrl: matchedDemo?.mainDemoUrl || matchedDemo?.frontendUrl || matchedDemo?.accounts[0]?.url,
      features: matchedDemo?.features || ['Admin & User Role Portals', 'Automated Database Workflows', 'RESTful API Integration', 'SLA SLA Support'],
      adminCredentials: {
        email: matchedDemo?.accounts[0]?.email || 'admin@demo.ohotech.com',
        password: matchedDemo?.accounts[0]?.password || 'Admin@12345',
      },
    };

    setActiveQuickViewProduct(prodObj);
    setActiveQuickViewCategory(productDto.serviceType || productDto.categoryName || 'software');
  };

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="products-catalog-main">
        
        {/* Header Hero Section */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm text-center mb-10 relative overflow-hidden grid-pattern-light" id="products-hero">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              TURNKEY SOFTWARE PRODUCTS &amp; ENTERPRISE SOLUTIONS ⚡
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0d0d0e] mb-6 leading-[1.08]">
              Software Products &amp; Live Solution Catalog
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal max-w-3xl mx-auto leading-relaxed">
              Explore turnkey cloud applications, ERP systems, and enterprise software solutions backed by live API integrations and custom deployment support.
            </p>
          </div>
        </section>

        {/* 3-Step Buyer Journey Banner */}
        <section className="bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 mb-10 shadow-2xl relative overflow-hidden grid-pattern-dark">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                HOW PURCHASING WORKS AT OHO TECH
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Evaluate First. Pay Only When Fully Satisfied.
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                We provide full admin test-drive access before any payment so you can verify every feature first.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono shrink-0 max-w-2xl">
              <div className="p-3.5 rounded-2xl bg-[#141416] border border-white/10">
                <span className="text-emerald-400 font-extrabold block mb-1">1. Test-Drive</span>
                <p className="text-[11px] text-slate-300">Click "Quick View" to copy 1-click admin credentials and test live demo.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#141416] border border-white/10">
                <span className="text-emerald-400 font-extrabold block mb-1">2. Review</span>
                <p className="text-[11px] text-slate-300">Explore admin panels &amp; workflows to confirm exact suitability.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#141416] border border-white/10">
                <span className="text-emerald-400 font-extrabold block mb-1">3. Purchase</span>
                <p className="text-[11px] text-slate-300">Pay to receive full source code &amp; production deployment SLA.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-6 sm:p-8 shadow-sm mb-10" id="products-filter-section">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by title or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all border-2",
                    selectedCategory === cat.id
                      ? "bg-[#0d0d0e] text-white border-[#0d0d0e] shadow-sm"
                      : "bg-[#fafafa] text-slate-700 border-slate-200 hover:border-slate-400"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-500">
            <span>
              {loading ? 'Loading catalog...' : `Displaying ${products.length} of ${totalElements} Cloud Products`}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Production SLA &amp; 1-Click Demo Ready
            </span>
          </div>

        </section>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-slate-200 rounded-[32px] p-7 animate-pulse space-y-4"
              >
                <div className="h-44 bg-slate-100 rounded-2xl w-full" />
                <div className="h-6 bg-slate-100 rounded-lg w-3/4" />
                <div className="h-4 bg-slate-100 rounded-lg w-full" />
                <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100" />
              </div>
            ))}
          </div>
        ) : (
          /* Products Grid */
          <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 lg:p-14 shadow-sm" id="products-grid-section">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const priceFormatted = new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                }).format(product.price || 35000);

                const prodImg = getProductImage(product);

                return (
                  <div
                    key={product.id}
                    className="bg-[#fafafa] border-2 border-slate-200 hover:border-emerald-500 rounded-[32px] p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl relative overflow-hidden group"
                  >
                    <div>
                      {/* Product Header Image Visual Card */}
                      <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5 bg-[#0d0d0e]">
                        <NextImage
                          src={prodImg}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e]/90 via-[#0d0d0e]/30 to-transparent pointer-events-none" />

                        {/* Top Badges Overlaid on Image */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                          <span className="text-[10px] font-mono font-extrabold px-3 py-1 rounded-full bg-[#0d0d0e]/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md uppercase tracking-wider shadow-sm">
                            {product.serviceType || product.categoryName || 'Software Module'}
                          </span>
                          <span className="text-[10px] font-mono text-white/80 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                            #PROD-0{product.id}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-extrabold text-[#0d0d0e] mb-2 leading-tight group-hover:text-emerald-700 transition-colors">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed mb-5 line-clamp-3">
                        {product.description}
                      </p>

                      {/* Price & Stock Badge */}
                      <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                        <div>
                          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Starting Price</div>
                          <div className="text-lg font-black text-[#0d0d0e]">{priceFormatted}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Availability</div>
                          <div className="text-xs font-extrabold text-emerald-600 flex items-center gap-1 justify-end">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            In Stock ({product.stock || 50})
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="relative z-10 pt-4 border-t border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openQuickView(product)}
                          className="flex-1 py-3 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0d0d0e] font-extrabold text-xs uppercase tracking-wider text-center transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Test-Drive Quick View</span>
                        </button>

                        <button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={cartLoading}
                          className="py-3 px-3.5 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-mono font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-50"
                          aria-label="Add to cart"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>

                      <Link
                        href={`/get-quote?product=${encodeURIComponent(product.name)}`}
                        className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-slate-100 text-slate-800 font-mono font-bold text-[11px] uppercase tracking-wider border border-slate-300 transition-all block text-center"
                      >
                        Request Commercial Quote →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 pt-8 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <div className="text-xs font-mono font-bold text-slate-600">
                  Page {page + 1} of {totalPages}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </section>
        )}

      </main>

      {/* Quick View Modal */}
      {activeQuickViewProduct && (
        <ProductQuickViewModal
          product={activeQuickViewProduct}
          industrySlug={activeQuickViewCategory}
          onClose={() => setActiveQuickViewProduct(null)}
        />
      )}
    </div>
  );
}

function getFallbackProducts(): ProductDto[] {
  return [
    { id: 1, name: 'School Management Software', description: 'Complete school administration, attendance, fees, report cards, and parent portal.', price: 35000, serviceType: 'Education', stock: 50, active: true },
    { id: 2, name: 'University Management System', description: 'Multi-campus university operations, research, course catalog, and accreditation tracking.', price: 99000, serviceType: 'Education', stock: 50, active: true },
    { id: 3, name: 'Hospital Management Software (HMS)', description: 'OPD/IPD, EMR, Doctor schedules, Pharmacy, Diagnostic Lab, and Billing.', price: 75000, serviceType: 'Healthcare', stock: 50, active: true },
    { id: 4, name: 'IVF & Fertility Clinic Software', description: 'IVF cycle tracking, embryology lab management, follicle monitoring, and fertility EMR.', price: 85000, serviceType: 'Healthcare', stock: 50, active: true },
    { id: 5, name: 'Enterprise HRMS & Payroll', description: 'Attendance, biometric sync, leave workflows, salary slips, and tax compliance.', price: 55000, serviceType: 'ERP & HR', stock: 50, active: true },
    { id: 6, name: 'Retail POS & Billing Software', description: 'Fast barcode billing, inventory management, multi-store stock sync, and GST invoices.', price: 29000, serviceType: 'Retail & POS', stock: 50, active: true },
    { id: 7, name: 'Multi-Vendor E-Commerce Portal', description: 'Custom marketplace platform, vendor payout engine, product catalog, and payment gateway.', price: 75000, serviceType: 'E-Commerce', stock: 50, active: true },
    { id: 8, name: 'Real Estate CRM & Booking Engine', description: 'Property listing portal, lead allocation, site visit scheduling, and buyer agreements.', price: 59000, serviceType: 'Services & Booking', stock: 50, active: true },
    { id: 9, name: 'Gym & Fitness Club Software', description: 'Member attendance, biometric integration, subscription renewal alerts, and trainer schedule.', price: 22000, serviceType: 'Services & Booking', stock: 50, active: true },
  ];
}

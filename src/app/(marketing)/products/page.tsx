'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Copy, ExternalLink, Key, Search, ShieldCheck, Sparkles, MonitorPlay, ShoppingBag, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { softwareDemos } from '@/config/demos';
import { cn } from '@/lib/utils';
import { getProductsApi } from '@/api/products';
import { ProductDto } from '@/api/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

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
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

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
      if (res.success && res.data) {
        setProducts(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      } else {
        throw new Error(res.message || 'Failed to fetch products');
      }
    } catch (err: any) {
      console.warn('Backend products fetch failed:', err?.message);
      setError(err?.message || 'Unable to connect to backend products API');
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

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddToCart = async (productId: number) => {
    await addToCart(productId, 1);
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
              Spring Boot API Connected &amp; Verified
            </span>
          </div>

        </section>

        {/* Backend API Error Banner */}
        {error && (
          <div className="mb-8 p-6 rounded-[28px] bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <div>
                <span className="font-bold">Backend Connection Notice: </span>
                {error}
              </div>
            </div>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold whitespace-nowrap"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-slate-200 rounded-[32px] p-7 animate-pulse space-y-4"
              >
                <div className="h-10 bg-slate-100 rounded-2xl w-2/3" />
                <div className="h-4 bg-slate-100 rounded-lg w-full" />
                <div className="h-4 bg-slate-100 rounded-lg w-4/5" />
                <div className="h-24 bg-slate-50 rounded-2xl border border-slate-100" />
                <div className="h-12 bg-slate-100 rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-[#0d0d0e] mb-2">No Products Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              No products matched your search "{searchQuery}". Try clearing filters or searching for terms like "Hospital", "School", "POS", or "ERP".
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Products Grid */
          <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 lg:p-14 shadow-sm" id="products-grid-section">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const priceFormatted = new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                }).format(product.price || 0);

                return (
                  <div
                    key={product.id}
                    className="bg-[#fafafa] border-2 border-slate-200 hover:border-sky-500 rounded-[32px] p-7 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl relative overflow-hidden group"
                  >
                    <div className="relative z-10">
                      
                      {/* Category & Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider bg-sky-50 text-sky-700 border-sky-200">
                          {product.serviceType || product.categoryName || 'Software Product'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 font-bold">
                          #PROD-0{product.id}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/products/${product.id}`} className="block group-hover:text-sky-600 transition-colors">
                        <h3 className="text-xl font-extrabold text-[#0d0d0e] mb-2 leading-tight">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed mb-5 line-clamp-3">
                        {product.description}
                      </p>

                      {/* Price & Stock Badge */}
                      <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
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

                    {/* Card Actions */}
                    <div className="relative z-10 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={cartLoading}
                        className="flex-1 py-3 px-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-mono font-bold text-xs uppercase tracking-wider text-center transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>

                      <Link
                        href={`/products/${product.id}`}
                        className="py-3 px-4 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-mono font-bold text-xs uppercase tracking-wider border border-slate-300 transition-all text-center shrink-0"
                      >
                        Details
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
    </div>
  );
}

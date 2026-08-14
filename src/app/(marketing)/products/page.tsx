'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Search, Sparkles } from 'lucide-react';
import { industries } from '@/config/industries';
import { cn } from '@/lib/utils';

export default function ProductsCatalogPage() {
  const [selectedIndustry, setSelectedIndustry] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const allProducts = React.useMemo(() => {
    return industries.flatMap((ind) =>
      ind.products.map((prod) => ({
        ...prod,
        industryName: ind.name,
        industrySlug: ind.slug,
      }))
    );
  }, []);

  const filteredProducts = allProducts.filter((product) => {
    const matchesIndustry = selectedIndustry === 'all' || product.industrySlug === selectedIndustry;
    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.industryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="products-catalog-main">
        
        {/* Header Hero Section */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm text-center mb-10 relative overflow-hidden grid-pattern-light" id="products-hero">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              OHO TECH SOFTWARE CATALOG
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0d0d0e] mb-6 leading-[1.08]">
              Ready-to-Deploy Software Solutions
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              Explore customizable software products and ERP modules across 13 industry verticals. Available for cloud deployment or custom enterprise installation.
            </p>
          </div>
        </section>

        {/* Search & Filter Bar Section */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-6 sm:p-8 shadow-sm mb-10" id="products-filter-section">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products (e.g. Hospital ERP, POS, LMS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            {/* Verticals Filter Pills */}
            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
              <button
                onClick={() => setSelectedIndustry('all')}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all border-2",
                  selectedIndustry === 'all'
                    ? "bg-[#0d0d0e] text-white border-[#0d0d0e] shadow-sm"
                    : "bg-[#fafafa] text-slate-700 border-slate-200 hover:border-slate-400"
                )}
              >
                All Verticals ({allProducts.length})
              </button>

              {industries.map((ind) => (
                <button
                  key={ind.slug}
                  onClick={() => setSelectedIndustry(ind.slug)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all border-2",
                    selectedIndustry === ind.slug
                      ? "bg-[#0d0d0e] text-white border-[#0d0d0e] shadow-sm"
                      : "bg-[#fafafa] text-slate-700 border-slate-200 hover:border-slate-400"
                  )}
                >
                  {ind.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Showing {filteredProducts.length} software solutions</span>
            <span className="text-sky-600 font-bold">Cloud &amp; Perpetual Licensing Available</span>
          </div>

        </section>

        {/* Products Showcase Grid */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm mb-10" id="products-grid-section">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={`${product.industrySlug}-${product.slug}`}
                className="p-8 bg-[#fafafa] border-2 border-slate-200 hover:border-sky-500 rounded-3xl transition-all duration-300 flex flex-col justify-between hover:shadow-lg group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                      {product.industryName}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  </div>

                  <h3 className="text-xl font-bold text-[#0d0d0e] mb-3 group-hover:text-sky-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <Link
                    href="/book-demo"
                    className="px-5 py-2 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md"
                  >
                    Book Demo
                  </Link>

                  <Link
                    href={`/solutions/${product.industrySlug}`}
                    className="text-xs font-bold text-slate-800 hover:text-sky-600 flex items-center gap-1 group/link"
                  >
                    <span>Architecture</span>
                    <ArrowRight className="w-3.5 h-3.5 group-link-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* Bottom CTA Section */}
        <section className="bg-[#0d0d0e] text-white border-2 border-slate-700 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-16 text-center shadow-2xl relative overflow-hidden" id="products-cta">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Need custom feature adaptations?</h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto">
              All 65+ software products can be customized to match your precise organizational workflows or integrated with legacy systems.
            </p>
            <Link
              href="/get-quote"
              className="px-8 py-4 rounded-full bg-white hover:bg-sky-400 text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg inline-flex items-center gap-2"
            >
              <span>Request Customization Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

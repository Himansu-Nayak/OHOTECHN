'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Search, Filter, ShieldCheck, Zap } from 'lucide-react';
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
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen grid-pattern-light selection:bg-[#0d0d0e] selection:text-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 bg-[#ebebe8] px-3 py-1 rounded-full border border-black/5">
            Turnkey Software Catalog
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0d0d0e] mt-4 mb-4">
            65+ Ready-Made Software Products
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Instantly deployable enterprise software solutions across 13 industry verticals. Available for SaaS subscriptions or perpetual licensing.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="launch-card p-4 mb-10 bg-white border border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products (e.g. Hospital ERP, POS, LMS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#f7f7f5] border border-black/5 text-xs text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          {/* Industry Filter Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            <button
              onClick={() => setSelectedIndustry('all')}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all",
                selectedIndustry === 'all'
                  ? "bg-[#0d0d0e] text-white shadow-sm"
                  : "bg-[#ebebe8] text-slate-700 hover:bg-[#e2e2de]"
              )}
            >
              All Verticals ({allProducts.length})
            </button>

            {industries.map((ind) => (
              <button
                key={ind.slug}
                onClick={() => setSelectedIndustry(ind.slug)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all",
                  selectedIndustry === ind.slug
                    ? "bg-[#0d0d0e] text-white shadow-sm"
                    : "bg-[#ebebe8] text-slate-700 hover:bg-[#e2e2de]"
                )}
              >
                {ind.name}
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Showing {filteredProducts.length} software products</span>
          <span>Instant SaaS Cloud Deployment</span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={`${product.industrySlug}-${product.slug}`}
              className="launch-card p-6 bg-white border border-black/5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    {product.industryName}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500 stroke-white" />
                </div>

                <h3 className="text-lg font-extrabold text-[#0d0d0e] mb-2 group-hover:text-teal-600 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {product.shortDescription}
                </p>
              </div>

              <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                <Link
                  href="/book-demo"
                  className="px-4 py-2 rounded-full bg-[#0d0d0e] text-white font-extrabold text-xs hover:bg-slate-800 transition-colors"
                >
                  Book Demo
                </Link>

                <Link
                  href={`/solutions/${product.industrySlug}`}
                  className="text-xs font-mono font-bold text-slate-500 hover:text-black flex items-center gap-1 group/link"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3 group-link-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 launch-card p-8 sm:p-12 bg-[#0d0d0e] text-white text-center rounded-3xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-black mb-3">Need custom feature adaptations?</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            All our 65+ products can be tailored to match your precise organizational workflows or deployed under white-label branding.
          </p>
          <Link
            href="/get-quote"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-teal-400 transition-colors"
          >
            <span>Request Customization Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

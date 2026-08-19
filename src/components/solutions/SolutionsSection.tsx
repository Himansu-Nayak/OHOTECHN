'use client';

import * as React from 'react';
import Link from 'next/link';
import { industries, Industry } from '@/config/industries';
import { IndustrySelector } from './IndustrySelector';
import { FeaturedIndustry } from './FeaturedIndustry';
import { SolutionCard } from './SolutionCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export function SolutionsSection() {
  const [selectedIndustry, setSelectedIndustry] = React.useState<Industry>(industries[0]);

  // Max 3 featured products
  const featuredProducts = selectedIndustry.products.slice(0, 3);

  return (
    <section
      className="max-w-[1536px] w-full mx-auto mb-16 bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-2xl relative overflow-hidden grid-pattern-dark"
      id="solutions"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Section Header */}
      <div className="max-w-3xl mb-14 text-left relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          COMPLETE SOFTWARE ECOSYSTEM
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-5">
          65+ Software Solutions.<br />
          <span className="text-emerald-400 font-bold">One Technology Partner.</span>
        </h2>

        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          Explore ready-to-deploy and customizable software solutions built for businesses across 13 industries.
        </p>
      </div>

      {/* 2. Horizontal Industry Selector */}
      <IndustrySelector
        industries={industries}
        selectedIndustry={selectedIndustry}
        onSelectIndustry={setSelectedIndustry}
      />

      {/* 3. Featured Industry Area */}
      <FeaturedIndustry industry={selectedIndustry} />

      {/* 4. Featured Product Cards (Max 3) */}
      <div className="mb-10 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            FEATURED {selectedIndustry.name.toUpperCase()} PRODUCTS ({featuredProducts.length} OF {selectedIndustry.products.length})
          </h4>
          <span className="text-xs font-mono text-emerald-400">
            SaaS &amp; Perpetual License
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <SolutionCard
              key={product.slug}
              product={product}
              industrySlug={selectedIndustry.slug}
            />
          ))}
        </div>
      </div>

      {/* 5. View All Link Below Products */}
      <div className="pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
        <p className="text-xs text-slate-400 font-medium hidden sm:block">
          Need custom feature modifications or multi-branch deployment?
        </p>

        <Link
          href={`/solutions/${selectedIndustry.slug}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors group"
        >
          <span>Explore all {selectedIndustry.name} Solutions</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

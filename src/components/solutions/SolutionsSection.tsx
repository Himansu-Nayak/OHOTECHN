'use client';

import * as React from 'react';
import Link from 'next/link';
import { industries, Industry } from '@/config/industries';
import { IndustrySelector } from './IndustrySelector';
import { FeaturedIndustry } from './FeaturedIndustry';
import { SolutionCard } from './SolutionCard';
import { ArrowRight } from 'lucide-react';

export function SolutionsSection() {
  const [selectedIndustry, setSelectedIndustry] = React.useState<Industry>(industries[0]);

  // Max 3 featured products
  const featuredProducts = selectedIndustry.products.slice(0, 3);

  return (
    <section
      className="max-w-[1536px] w-full mx-auto mb-12 bg-[#fafafa] border border-slate-200/80 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden"
      id="solutions"
    >
      {/* 1. Section Header */}
      <div className="max-w-3xl mb-14 text-left">
        <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-4">
          COMPLETE SOFTWARE ECOSYSTEM
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-5">
          65+ Software Solutions.<br />
          <span className="text-sky-600 font-bold">One Technology Partner.</span>
        </h2>

        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
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
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            FEATURED {selectedIndustry.name.toUpperCase()} PRODUCTS ({featuredProducts.length} OF {selectedIndustry.products.length})
          </h4>
          <span className="text-xs font-mono text-slate-400">
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
      <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium hidden sm:block">
          Need custom feature modifications or multi-branch deployment?
        </p>

        <Link
          href={`/solutions/${selectedIndustry.slug}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0d0d0e] hover:text-teal-600 transition-colors group"
        >
          <span>Explore all {selectedIndustry.name} Solutions</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

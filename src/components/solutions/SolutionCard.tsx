'use client';

import * as React from 'react';
import Link from 'next/link';
import { Product } from '@/config/industries';
import { ArrowRight, Box } from 'lucide-react';

interface SolutionCardProps {
  product: Product;
  industrySlug: string;
}

export function SolutionCard({ product, industrySlug }: SolutionCardProps) {
  return (
    <Link
      href={`/solutions/${industrySlug}`}
      className="group block bg-white border border-slate-200/80 rounded-2xl p-7 hover:border-slate-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Top Row: Icon Badge & Optional Platform Tag */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#0d0d0e] group-hover:text-white text-[#0d0d0e] flex items-center justify-center transition-colors duration-200">
            <Box className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60 group-hover:border-slate-300 transition-colors">
            Turnkey Module
          </span>
        </div>

        {/* Product Name */}
        <h4 className="text-lg font-bold text-[#0d0d0e] mb-2 group-hover:text-teal-600 transition-colors duration-200">
          {product.name}
        </h4>

        {/* Short Description */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-6">
          {product.shortDescription}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-[#0d0d0e] transition-colors">
        <span>Explore Solution</span>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all duration-200" />
      </div>
    </Link>
  );
}

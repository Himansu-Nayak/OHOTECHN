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
      className="group block bg-[#141416] border border-white/10 rounded-2xl p-7 hover:border-emerald-400/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Top Row: Icon Badge & Optional Platform Tag */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-emerald-500 group-hover:text-[#0d0d0e] text-emerald-400 flex items-center justify-center transition-colors duration-200">
            <Box className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 group-hover:border-emerald-500/30 transition-colors">
            Turnkey Module
          </span>
        </div>

        {/* Product Name */}
        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors duration-200">
          {product.name}
        </h4>

        {/* Short Description */}
        <p className="text-sm text-slate-300 leading-relaxed line-clamp-2 mb-6">
          {product.shortDescription}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
        <span>Explore Solution</span>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-200" />
      </div>
    </Link>
  );
}

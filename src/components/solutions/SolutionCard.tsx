'use client';

import * as React from 'react';
import Link from 'next/link';
import { Product } from '@/config/industries';
import { ArrowRight, Cpu, Layers } from 'lucide-react';

interface SolutionCardProps {
  product: Product;
  industrySlug: string;
}

export function SolutionCard({ product, industrySlug }: SolutionCardProps) {
  return (
    <Link
      href={`/solutions/${industrySlug}`}
      className="group relative rounded-3xl bg-gradient-to-b from-[#131b2e] via-[#0d1424] to-[#090d18] border border-slate-800/90 text-white p-7 sm:p-8 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:border-cyan-500/40 hover:shadow-2xl"
    >
      {/* Top Subtle Cyan Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/80 via-cyan-400 to-cyan-500/80 opacity-80 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Top Row: Icon Badge & Turnkey Module Tag */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 flex items-center justify-center transition-all duration-300 shadow-md">
            <Cpu className="w-6 h-6 stroke-[2]" />
          </div>

          <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
            Turnkey Module
          </span>
        </div>

        {/* Product Name */}
        <h4 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors duration-200">
          {product.name}
        </h4>

        {/* Short Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-8 font-normal">
          {product.shortDescription}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-slate-400 group-hover:text-white transition-colors">
        <span>EXPLORE SOLUTION</span>
        <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-all duration-200" />
      </div>
    </Link>
  );
}

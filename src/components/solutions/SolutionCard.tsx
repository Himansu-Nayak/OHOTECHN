'use client';

import * as React from 'react';
import Link from 'next/link';
import { Product } from '@/config/industries';
import { ProductQuickViewModal } from '@/components/products/ProductQuickViewModal';
import { ArrowRight, Box, Eye } from 'lucide-react';

interface SolutionCardProps {
  product: Product;
  industrySlug: string;
}

export function SolutionCard({ product, industrySlug }: SolutionCardProps) {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <div className="group bg-[#141416] border border-white/10 rounded-2xl p-7 hover:border-emerald-400/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
        <div>
          {/* Top Row: Icon Badge & Quick View Button */}
          <div className="flex items-center justify-between mb-5">
            <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-emerald-500 group-hover:text-[#0d0d0e] text-emerald-400 flex items-center justify-center transition-colors duration-200">
              <Box className="w-5 h-5" />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-[#0d0d0e] text-slate-300 text-[11px] font-mono font-bold border border-white/10 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
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
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-slate-300">
          <button
            onClick={() => setShowModal(true)}
            className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] font-bold flex items-center gap-1"
          >
            <span>Live Credentials</span>
          </button>

          <Link
            href={`/solutions/${industrySlug}`}
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors group/btn"
          >
            <span>Explore Solution</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn:text-emerald-400 group-hover/btn:translate-x-1 transition-all duration-200" />
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {showModal && (
        <ProductQuickViewModal
          product={product}
          industrySlug={industrySlug}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

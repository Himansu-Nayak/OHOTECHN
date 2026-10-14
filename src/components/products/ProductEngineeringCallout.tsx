'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, Headphones, ArrowRight } from 'lucide-react';

export interface ProductEngineeringCalloutProps {
  productName: string;
}

export function ProductEngineeringCallout({ productName }: ProductEngineeringCalloutProps) {
  return (
    <div className="bg-[#0d0d0e] text-white rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3 h-3" /> DIRECT ARCHITECT ENGAGEMENT
        </div>
        <h3 className="text-2xl font-black tracking-tight mb-2">
          Need a customized enterprise rollout or data migration?
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Our core engineering team can configure dedicated VPS instances, integrate custom payment methods, or conduct an architecture review for your company.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
        <Link
          href="/support"
          className="px-5 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors text-center shadow-sm flex items-center justify-center gap-1.5"
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Support Desk</span>
        </Link>
        <Link
          href={`/get-quote?product=${encodeURIComponent(productName)}`}
          className="px-5 py-3 rounded-full bg-white hover:bg-sky-50 text-slate-900 font-mono font-bold text-xs uppercase tracking-wider transition-colors text-center shadow-sm flex items-center justify-center gap-1.5"
        >
          <span>Request Custom Quote</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

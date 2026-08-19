'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Layers, Code2, TrendingUp } from 'lucide-react';

export type CategoryFilter = 'all' | 'technology' | 'marketing';

interface ServicesCategorySwitcherProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  techCount: number;
  growthCount: number;
}

export function ServicesCategorySwitcher({
  activeCategory,
  onSelectCategory,
  techCount,
  growthCount,
}: ServicesCategorySwitcherProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-14 relative z-10">
      <button
        onClick={() => onSelectCategory('all')}
        className={cn(
          "px-6 py-3 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2.5 border",
          activeCategory === 'all'
            ? "bg-emerald-500 text-[#0d0d0e] border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-[1.02] font-black"
            : "bg-[#141416] text-slate-300 border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5"
        )}
      >
        <Layers className="w-4 h-4" />
        <span>All Capabilities ({techCount + growthCount})</span>
      </button>

      <button
        onClick={() => onSelectCategory('technology')}
        className={cn(
          "px-6 py-3 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2.5 border",
          activeCategory === 'technology'
            ? "bg-emerald-500 text-[#0d0d0e] border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-[1.02] font-black"
            : "bg-[#141416] text-slate-300 border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5"
        )}
      >
        <Code2 className="w-4 h-4 text-sky-400" />
        <span>Technology Services ({techCount})</span>
      </button>

      <button
        onClick={() => onSelectCategory('marketing')}
        className={cn(
          "px-6 py-3 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2.5 border",
          activeCategory === 'marketing'
            ? "bg-amber-400 text-[#0d0d0e] border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-[1.02] font-black"
            : "bg-[#141416] text-slate-300 border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5"
        )}
      >
        <TrendingUp className="w-4 h-4 text-amber-400" />
        <span>Digital Growth Services ({growthCount})</span>
      </button>
    </div>
  );
}

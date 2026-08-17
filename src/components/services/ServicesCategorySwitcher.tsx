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
    <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2 sm:pb-0 mb-10 sm:mb-14 scroll-smooth max-w-full">
      <button
        type="button"
        onClick={() => onSelectCategory('all')}
        className={cn(
          "min-h-[48px] px-5 sm:px-6 py-3 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 border whitespace-nowrap shrink-0",
          activeCategory === 'all'
            ? "bg-[#0d0d0e] text-white border-black shadow-md scale-[1.02]"
            : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:text-black hover:bg-slate-50"
        )}
      >
        <Layers className="w-4 h-4 text-emerald-500" />
        <span>All Capabilities ({techCount + growthCount})</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectCategory('technology')}
        className={cn(
          "min-h-[48px] px-5 sm:px-6 py-3 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 border whitespace-nowrap shrink-0",
          activeCategory === 'technology'
            ? "bg-[#0d0d0e] text-white border-black shadow-md scale-[1.02]"
            : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:text-black hover:bg-slate-50"
        )}
      >
        <Code2 className="w-4 h-4 text-emerald-500" />
        <span>Technology Services ({techCount})</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectCategory('marketing')}
        className={cn(
          "min-h-[48px] px-5 sm:px-6 py-3 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 border whitespace-nowrap shrink-0",
          activeCategory === 'marketing'
            ? "bg-[#0d0d0e] text-white border-black shadow-md scale-[1.02]"
            : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:text-black hover:bg-slate-50"
        )}
      >
        <TrendingUp className="w-4 h-4 text-amber-500" />
        <span>Digital Growth ({growthCount})</span>
      </button>
    </div>
  );
}

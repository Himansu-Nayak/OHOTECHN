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
    <div className="flex flex-wrap items-center gap-3 mb-14">
      <button
        onClick={() => onSelectCategory('all')}
        className={cn(
          "px-6 py-3 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2.5 border",
          activeCategory === 'all'
            ? "bg-[#0d0d0e] text-white border-black shadow-md scale-[1.02]"
            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-black hover:bg-slate-50"
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
            ? "bg-[#0d0d0e] text-white border-black shadow-md scale-[1.02]"
            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-black hover:bg-slate-50"
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
            ? "bg-[#0d0d0e] text-white border-black shadow-md scale-[1.02]"
            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-black hover:bg-slate-50"
        )}
      >
        <TrendingUp className="w-4 h-4 text-amber-400" />
        <span>Digital Growth Services ({growthCount})</span>
      </button>
    </div>
  );
}

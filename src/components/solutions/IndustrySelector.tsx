'use client';

import * as React from 'react';
import { Industry } from '@/config/industries';
import { cn } from '@/lib/utils';
import { Layers, ChevronDown } from 'lucide-react';

interface IndustrySelectorProps {
  industries: Industry[];
  selectedIndustry: Industry;
  onSelectIndustry: (industry: Industry) => void;
}

export function IndustrySelector({
  industries,
  selectedIndustry,
  onSelectIndustry,
}: IndustrySelectorProps) {
  const [showAllDropdown, setShowAllDropdown] = React.useState(false);

  // Featured top industries for primary horizontal pill bar
  const mainPills = industries.slice(0, 9);
  const dropdownPills = industries.slice(9);

  return (
    <div className="w-full relative mb-12 z-20">
      {/* Horizontal Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x focus:outline-none">
        {mainPills.map((ind) => {
          const isActive = selectedIndustry.slug === ind.slug;
          return (
            <button
              key={ind.slug}
              onClick={() => onSelectIndustry(ind)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap snap-start shrink-0 flex items-center gap-2 border",
                isActive
                  ? "bg-emerald-500 text-[#0d0d0e] border-emerald-400 font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-[1.02]"
                  : "bg-[#141416] text-slate-300 border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d0d0e] animate-pulse" />
              )}
              <span>{ind.name}</span>
            </button>
          );
        })}

        {/* View All / Remaining Industries Dropdown Pill */}
        {dropdownPills.length > 0 && (
          <div className="relative shrink-0">
            <button
              onClick={() => setShowAllDropdown(!showAllDropdown)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 border",
                dropdownPills.some((i) => i.slug === selectedIndustry.slug)
                  ? "bg-emerald-500 text-[#0d0d0e] border-emerald-400 font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "bg-[#141416] text-slate-300 border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {dropdownPills.some((i) => i.slug === selectedIndustry.slug)
                  ? selectedIndustry.name
                  : "More Industries"}
              </span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  showAllDropdown ? "rotate-180" : ""
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {showAllDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#141416] border border-white/15 rounded-2xl shadow-2xl z-30 p-2 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                {dropdownPills.map((ind) => (
                  <button
                    key={ind.slug}
                    onClick={() => {
                      onSelectIndustry(ind);
                      setShowAllDropdown(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between",
                      selectedIndustry.slug === ind.slug
                        ? "bg-emerald-500 text-[#0d0d0e] font-bold"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span>{ind.name}</span>
                    <span className="text-[10px] font-mono opacity-70">
                      {ind.products.length} prods
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

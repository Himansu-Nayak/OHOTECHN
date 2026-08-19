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
    <div className="w-full relative mb-12">
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
                  ? "bg-[#0d0d0e] text-white border-black shadow-md"
                  : "bg-white text-slate-600 border-slate-200/80 hover:border-slate-400 hover:text-black hover:bg-slate-50"
              )}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
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
                  ? "bg-[#0d0d0e] text-white border-black shadow-md"
                  : "bg-white text-slate-600 border-slate-200/80 hover:border-slate-400 hover:text-black hover:bg-slate-50"
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
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-2 space-y-1 animate-in fade-in slide-in-from-top-2">
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
                        ? "bg-[#0d0d0e] text-white font-bold"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <span>{ind.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">
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

'use client';

import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';

/**
 * SystemCraftBadge
 *
 * Fixed craft badge highlighting engineering & spatial design standards.
 */
export function AwwwardsBadge() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden xl:block pointer-events-auto">
      <a
        href="#hero"
        data-cursor="OHO SYSTEMS"
        className="group flex flex-col items-center justify-center bg-[#0d0d0e] border-l border-y border-white/20 text-white py-4 px-2.5 rounded-l-2xl shadow-2xl hover:bg-emerald-500 hover:text-black hover:border-emerald-400 transition-all duration-300"
        title="OHO TECH Digital Systems Platform"
      >
        <Terminal className="w-4 h-4 mb-2 text-emerald-400 group-hover:text-black transition-colors" />
        <span className="font-mono text-[9px] font-extrabold tracking-widest uppercase [writing-mode:vertical-rl] rotate-180 py-1 select-none">
          SYSTEM CRAFT // 2026
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:bg-black mt-2 animate-pulse" />
      </a>
    </div>
  );
}

'use client';

import * as React from 'react';
import { ArrowDown } from 'lucide-react';

interface StoryFlowConnectorProps {
  currentNum: string;
  nextNum: string;
  nextTitle: string;
  nextEmoji: string;
  nextTargetId: string;
}

export function StoryFlowConnector({
  currentNum,
  nextNum,
  nextTitle,
  nextEmoji,
  nextTargetId,
}: StoryFlowConnectorProps) {
  const handleScrollToNext = () => {
    const el = document.getElementById(nextTargetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-[1536px] w-full mx-auto my-8 flex flex-col items-center justify-center relative z-20 group">
      
      {/* Top Connecting Vertical Line */}
      <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-400/50" />

      {/* Interactive Flow Badge & Scroll Button */}
      <button
        onClick={handleScrollToNext}
        type="button"
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border-2 border-emerald-300 hover:border-emerald-500 text-[#0d0d0e] shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer font-mono text-xs font-bold"
      >
        <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs animate-bounce shrink-0">
          ↓
        </span>
        <span className="text-emerald-700">CONTINUE FLOW</span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-700 uppercase">
          {nextNum} / {nextTitle} {nextEmoji}
        </span>
        <ArrowDown className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-y-0.5 transition-transform" />
      </button>

      {/* Bottom Connecting Vertical Line */}
      <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-400/50 to-emerald-500" />

    </div>
  );
}

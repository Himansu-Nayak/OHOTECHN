import React from 'react';

export default function MarketingLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading OHO TECH Experience"
      className="min-h-[75vh] w-full flex flex-col items-center justify-center bg-[#07080c] text-white px-4 py-20"
    >
      <div className="relative flex flex-col items-center max-w-xs w-full text-center">
        {/* Ambient Glow */}
        <div className="absolute -top-10 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Minimal OHO TECH Beacon */}
        <div className="relative mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
          </div>
        </div>

        {/* Status Line */}
        <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
          <span>OHO TECH</span>
          <span className="text-slate-500">//</span>
          <span>STREAMING</span>
        </div>

        <p className="text-[11px] font-mono text-slate-400 mb-6 tracking-wide">
          PREPARING CLIENT APPLICATION
        </p>

        {/* Lightweight Micro Progress Track */}
        <div className="w-44 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full animate-[progress_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

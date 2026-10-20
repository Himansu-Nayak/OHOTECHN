'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ShieldAlert, Terminal } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client exceptions for telemetry
    console.error('[OHO TECH ErrorBoundary] Uncaught runtime exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07080c] text-white flex flex-col justify-center items-center relative overflow-hidden font-sans px-4 sm:px-6 lg:px-8 py-20">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-rose-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-amber-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-xl w-full text-center space-y-8 bg-[#111216]/90 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
        {/* Terminal Header Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5" />
          <span>RUNTIME EXCEPTION INTERCEPTED</span>
        </div>

        {/* Error Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Heading & Context */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Application State Disruption
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            An unexpected error occurred during rendering. The execution boundary captured the failure to preserve session security.
          </p>
        </div>

        {/* Diagnostic Digest */}
        {error.digest && (
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-500 flex items-center justify-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            <span>Diagnostic ID: <code className="text-slate-300">{error.digest}</code></span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

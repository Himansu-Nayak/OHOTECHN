'use client';

import React, { useEffect } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[OHO TECH GlobalError] Root layout failure:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#07080c] text-white min-h-screen flex items-center justify-center font-sans antialiased p-4">
        <div className="max-w-md w-full bg-[#111216] border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <AlertOctagon className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase tracking-tight text-white">
              Critical System Error
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              A root layout level failure occurred. The application was halted to safeguard data integrity.
            </p>
          </div>

          {error.digest && (
            <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 text-[11px] font-mono text-slate-500">
              Diagnostic ID: <span className="text-slate-300">{error.digest}</span>
            </div>
          )}

          <button
            onClick={() => reset()}
            className="w-full px-5 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}

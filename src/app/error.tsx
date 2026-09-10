'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { getErrorMessage } from '@/lib/utils';

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log safe error telemetry without exposing sensitive data to user UI
    console.error('Application runtime boundary caught error:', error);
  }, [error]);

  const displayMessage = getErrorMessage(
    error,
    'A temporary system error interrupted this request. Please try again.'
  );

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen flex items-center justify-center px-4 py-16 selection:bg-[#0d0d0e] selection:text-white">
      <div className="max-w-xl w-full bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 shadow-sm text-center relative overflow-hidden grid-pattern-light">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-mono text-xs font-bold uppercase tracking-wider mb-5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>SYSTEM RUNTIME NOTICE</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight leading-tight mb-3">
          Something didn&apos;t load as expected.
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed max-w-md mx-auto">
          {displayMessage}
        </p>

        {error.digest && (
          <p className="text-[10px] font-mono text-slate-400 mb-6">
            Error Reference ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:scale-105 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#f0f0eb] hover:bg-[#e4e4df] text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all hover:scale-105"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Return Home</span>
          </Link>
        </div>

        <p className="text-[11px] font-mono text-slate-400 mt-8">
          If this issue persists, please notify our team at{' '}
          <a href="mailto:hello@ohotech.com" className="text-emerald-600 hover:underline">
            hello@ohotech.com
          </a>.
        </p>

      </div>
    </div>
  );
}

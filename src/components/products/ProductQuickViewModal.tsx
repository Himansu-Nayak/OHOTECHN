'use client';

import * as React from 'react';
import Link from 'next/link';
import { Product } from '@/config/industries';
import { X, ExternalLink, Copy, Check, ShieldCheck, Sparkles, Box, Key, Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';

interface ProductQuickViewModalProps {
  product: Product | null;
  industrySlug: string;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, industrySlug, onClose }: ProductQuickViewModalProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  // Keyboard Escape listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const demoUrl = product.demoUrl || `https://demo.ohotech.com/${product.slug}`;
  const adminEmail = product.adminCredentials?.email || `admin@${product.slug}.ohotech.com`;
  const adminPassword = product.adminCredentials?.password || 'Admin@12345';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0d0d0e] text-white border-2 border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10 grid-pattern-dark my-auto animate-in zoom-in-95 duration-300">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="relative z-10 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TURNKEY PRODUCT HUB</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-slate-300 font-mono text-[11px] uppercase">
              <Box className="w-3 h-3 text-sky-400" />
              <span>{industrySlug}</span>
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>⚡</span>
            <span>{product.name}</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2.5">
            {product.shortDescription}
          </p>
        </div>

        {/* 3-Step Buyer Journey Banner */}
        <div className="relative z-10 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase mb-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>HOW TO BUY THIS PRODUCT (3-STEP PROCESS)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-300">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold">1. Test-Drive</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Use credentials below to view live project</p>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold">2. Evaluate</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Explore admin features &amp; modules</p>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold">3. Purchase</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Pay &amp; unlock full source code &amp; SLA</p>
            </div>
          </div>
        </div>

        {/* Live Admin Demo Credentials Box */}
        <div className="relative z-10 bg-[#141416] border border-white/15 rounded-2xl p-5 mb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>TEST-DRIVE ADMIN ACCESS CREDENTIALS</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              1-Click Copy
            </span>
          </div>

          {/* Admin Email */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2.5 text-slate-300 truncate">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-400">Email:</span>
              <span className="text-white font-bold truncate">{adminEmail}</span>
            </div>

            <button
              onClick={() => copyToClipboard(adminEmail, 'email')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-[#0d0d0e] text-slate-200 text-[11px] font-mono font-bold transition-all shrink-0 ml-2 cursor-pointer"
            >
              {copiedField === 'email' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Admin Password */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2.5 text-slate-300 truncate">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-400">Password:</span>
              <span className="text-white font-bold truncate">{adminPassword}</span>
            </div>

            <button
              onClick={() => copyToClipboard(adminPassword, 'password')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-[#0d0d0e] text-slate-200 text-[11px] font-mono font-bold transition-all shrink-0 ml-2 cursor-pointer"
            >
              {copiedField === 'password' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feature Modules Grid */}
        {product.features && product.features.length > 0 && (
          <div className="relative z-10 mb-6">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
              CORE SYSTEM CAPABILITIES ({product.features.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.features.slice(0, 4).map((feat: string, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Action Footer */}
        <div className="relative z-10 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href={`/get-quote?product=${encodeURIComponent(product.name)}`}
            onClick={onClose}
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-bold"
          >
            <span>Ready to Buy? Request Commercial Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>

            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0d0d0e] font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105"
            >
              <span>Test-Drive Live Project</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

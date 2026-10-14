'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Check,
  Copy,
  Monitor,
  ArrowRight,
  Download,
} from 'lucide-react';

export interface ProductPurchaseSuccessSectionProps {
  productName: string;
  planName?: string;
  activationLimit?: number;
  purchasedOrderId: number | null;
  demoCustomerEmail: string;
  generatedKey: string | null;
  isCopiedKey: boolean;
  onCopyKey: () => void;
  onDownloadInvoice: () => void;
  onResetPurchase: () => void;
}

export function ProductPurchaseSuccessSection({
  productName,
  planName = 'Commercial Perpetual',
  activationLimit = 1,
  purchasedOrderId,
  demoCustomerEmail,
  generatedKey,
  isCopiedKey,
  onCopyKey,
  onDownloadInvoice,
  onResetPurchase,
}: ProductPurchaseSuccessSectionProps) {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Status Banner */}
      <div className="p-6 rounded-[28px] bg-gradient-to-r from-emerald-50 via-emerald-100/40 to-teal-50 border-2 border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-emerald-700" /> Payment Confirmed (₹ INR) &amp; Subscription Active
            </div>
            <h3 className="text-2xl font-black text-[#0d0d0e]">
              Congratulations! Your Software License is Generated
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Order #ORD-{purchasedOrderId} has been verified and settled in full. Your software seat is ready for immediate PC activation.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs font-mono font-bold shrink-0">
          <span className="px-3 py-1 rounded-full bg-emerald-600 text-white flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> STATUS: ACTIVE
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-900 text-emerald-400">
            SUBSCRIPTION: ACTIVE
          </span>
        </div>
      </div>

      {/* Cryptographic Key Box */}
      <div className="p-8 rounded-[32px] bg-slate-950 text-white border-2 border-emerald-500 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                AUTHORITATIVE CRYPTOGRAPHIC LICENSE KEY
              </span>
              <h4 className="text-xl font-black text-white">{productName}</h4>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Plan: <span className="text-white font-bold">{planName}</span> • Seats: <span className="text-emerald-400 font-bold">{activationLimit} Device(s)</span>
            </div>
          </div>

          {/* Monospace Key Display */}
          <div className="p-5 rounded-2xl bg-black/70 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="font-mono font-extrabold text-xl sm:text-2xl text-emerald-400 tracking-wider break-all select-all">
              {generatedKey}
            </div>

            <button
              type="button"
              onClick={onCopyKey}
              className={`px-5 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md ${
                isCopiedKey
                  ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                  : 'bg-white hover:bg-slate-100 text-slate-900'
              }`}
            >
              {isCopiedKey ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY KEY</span>
                </>
              )}
            </button>
          </div>

          {/* Clear Step-by-Step Guide for PC Desktop Software Activation */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
              <Monitor className="w-4 h-4" />
              <span>How to Unlock &amp; Activate the Software on Your PC / Laptop:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] font-mono font-bold text-slate-400 mb-1">STEP 1</div>
                <div className="font-bold text-white mb-1">Launch Software</div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Open or launch your installed desktop software application on your PC.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] font-mono font-bold text-slate-400 mb-1">STEP 2</div>
                <div className="font-bold text-white mb-1">Sign In at Startup</div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Log in with your customer account email (<span className="text-emerald-400 font-mono">{demoCustomerEmail}</span>).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] font-mono font-bold text-slate-400 mb-1">STEP 3</div>
                <div className="font-bold text-white mb-1">Enter License Key</div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  At the startup activation prompt, paste your generated key: <span className="text-emerald-400 font-mono">{generatedKey}</span>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] font-mono font-bold text-slate-400 mb-1">STEP 4</div>
                <div className="font-bold text-white mb-1">Subscription Active</div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Hardware ID activates automatically, all features unlock, and your subscription is active!
                </p>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/my-products?newPurchase=true"
                className="py-3 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
              >
                <span>Open Customer Portal (/my-products)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={onDownloadInvoice}
                className="py-3 px-5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Tax Invoice (PDF)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onResetPurchase}
              className="text-xs font-mono font-bold text-slate-400 hover:text-white underline cursor-pointer"
            >
              + Purchase Another License / Package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import * as React from 'react';
import { RefreshCw, Info } from 'lucide-react';

export const metadata = {
  title: 'Refund & Cancellation Policy | OHO TECH',
  description: 'Project cancellation and refund terms for custom software and digital services.',
};

export default function RefundCancellationPage() {
  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f0f0eb] border border-black/10 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
            <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
            COMMERCIAL POLICY
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] mb-4">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs font-mono text-slate-500">
            Last Updated: January 2026 • OHO TECH Studio
          </p>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3 mb-8">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Policy Scope:</strong> Software development projects at OHO TECH are executed under milestone-based commercial agreements.
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 text-sm text-slate-600 leading-relaxed shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">1. Custom Development Projects</h2>
            <p>
              Custom software development services are billed according to milestone deliverables outlined in executed project proposals. Due to the custom engineering work required, upfront deposit payments covering discovery, architecture design, and sprint initialization are non-refundable once work has commenced.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">2. Project Cancellation</h2>
            <p>
              Clients may request project cancellation by providing written notice to OHO TECH. Upon receiving written cancellation, work will halt, and the client will be invoiced only for completed development hours and unbilled milestone progress up to the date of notice.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">3. SaaS Subscriptions &amp; Licensing</h2>
            <p>
              Recurring software subscriptions or cloud license plans can be cancelled prior to the upcoming renewal billing cycle. Unused portions of active billing periods are non-refundable.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-2">Billing Inquiries</h2>
            <p>
              For questions regarding invoice statements or refund requests, please contact <strong className="text-[#0d0d0e]">hello@ohotech.com</strong>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

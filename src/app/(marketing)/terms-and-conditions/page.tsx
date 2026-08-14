import * as React from 'react';
import { FileText, Info } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | OHO TECH',
  description: 'Standard terms of service and client project agreements for OHO TECH.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f0f0eb] border border-black/10 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            LEGAL DOCUMENTATION
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs font-mono text-slate-500">
            Last Updated: January 2026 • OHO TECH Studio
          </p>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3 mb-8">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Notice:</strong> These terms apply to general website usage and initial project engagements. Executed Master Services Agreements (MSA) and Statements of Work (SOW) supersede general website terms.
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 text-sm text-slate-600 leading-relaxed shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">1. Scope of Services</h2>
            <p>
              OHO TECH provides custom software engineering, website development, mobile application development, ERP solution integration, and digital growth services as specified in approved proposal agreements.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">2. Intellectual Property Rights</h2>
            <p>
              Upon full payment of agreed project invoices, custom codebases, custom UI designs, and client-specific software deliverables created by OHO TECH are assigned to the client as specified in executed project contracts. Pre-existing proprietary modules and framework assets remain the property of OHO TECH or their respective licensors.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">3. Client Responsibilities</h2>
            <p>
              Clients agree to provide timely feedback, necessary credentials, content assets, and approval sign-offs required to maintain project development schedules.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">4. Limitation of Liability</h2>
            <p>
              OHO TECH provides digital services with professional care and skill. OHO TECH is not liable for indirect, incidental, or consequential damages resulting from third-party server downtime, user error, or external API service changes beyond our direct control.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-2">Inquiries</h2>
            <p>
              For legal inquiries or contractual clarifications, please contact our legal desk at <strong className="text-[#0d0d0e]">hello@ohotech.com</strong>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

import * as React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | OHO TECH',
  description: 'Privacy policy and data protection guidelines for OHO TECH software and digital services.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f0f0eb] border border-black/10 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            LEGAL DOCUMENTATION
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] mb-4">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-slate-500">
            Last Updated: January 2026 • OHO TECH Studio
          </p>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3 mb-8">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Notice:</strong> This document represents OHO TECH&apos;s standard operational privacy policy guidelines. For specific enterprise client agreements, custom NDA and data processing addendums apply.
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 text-sm text-slate-600 leading-relaxed shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">1. Information We Collect</h2>
            <p>
              OHO TECH collects information necessary to deliver software development, custom applications, and digital growth services. This includes contact information provided through contact forms, project requirement submissions, and demonstration booking inquiries (such as name, email address, phone number, and company name).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">2. How We Use Information</h2>
            <p>
              We use collected information solely for business communication, delivering software development proposals, managing client projects, fulfilling technical support obligations, and improving user experiences across our digital platforms.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">3. Data Protection &amp; Security</h2>
            <p>
              We implement industry-standard administrative, physical, and technical safeguards to prevent unauthorized access, disclosure, or alteration of confidential client data and project deliverables.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">4. Third-Party Services</h2>
            <p>
              OHO TECH does not sell, rent, or lease customer or client personal information to third parties. Data is shared with third-party service providers (such as hosting infrastructure or email delivery platforms) only as strictly necessary to fulfill business operations under non-disclosure agreements.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-2">Contact Us Regarding Privacy</h2>
            <p>
              If you have questions regarding this Privacy Policy or wish to exercise data access or removal rights, please contact us at <strong className="text-[#0d0d0e]">hello@ohotech.com</strong>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

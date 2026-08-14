import * as React from 'react';
import { AlertCircle, Info } from 'lucide-react';

export const metadata = {
  title: 'Disclaimer | OHO TECH',
  description: 'General website and service disclaimer for OHO TECH.',
};

export default function DisclaimerPage() {
  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f0f0eb] border border-black/10 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
            <AlertCircle className="w-3.5 h-3.5 text-sky-600" />
            TERMS &amp; NOTICES
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] mb-4">
            Disclaimer
          </h1>
          <p className="text-xs font-mono text-slate-500">
            Last Updated: January 2026 • OHO TECH Studio
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 text-sm text-slate-600 leading-relaxed shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">1. General Information Only</h2>
            <p>
              The content provided on the OHO TECH website is for general informational purposes relating to custom software development, digital platforms, and business growth services.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">2. Product Concepts &amp; Architecture Showcase</h2>
            <p>
              Demonstrations, visual mockups, and software concept representations displayed on our website illustrate technical engineering capabilities and solution frameworks available for client customization.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">3. External Links</h2>
            <p>
              Our website may contain links to external third-party sites. OHO TECH is not responsible for the content, privacy practices, or accuracy of information on external websites.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-2">Inquiries</h2>
            <p>
              Contact <strong className="text-[#0d0d0e]">hello@ohotech.com</strong> for further information.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

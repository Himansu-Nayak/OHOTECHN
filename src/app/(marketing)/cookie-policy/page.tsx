import * as React from 'react';
import { Cookie, Info } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy | OHO TECH',
  description: 'Information about how OHO TECH uses cookies and web technologies.',
};

export default function CookiePolicyPage() {
  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f0f0eb] border border-black/10 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
            <Cookie className="w-3.5 h-3.5 text-sky-600" />
            COOKIE STATEMENT
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] mb-4">
            Cookie Policy
          </h1>
          <p className="text-xs font-mono text-slate-500">
            Last Updated: January 2026 • OHO TECH Studio
          </p>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 text-sm text-slate-600 leading-relaxed shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your computer or mobile device when visiting a website. They help websites remember preferences, enhance navigation, and analyze visitor interaction.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">2. How OHO TECH Uses Cookies</h2>
            <p>
              We use essential cookies required for website operation, session navigation, user interface theme settings, and anonymized website performance analytics.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-3">3. Managing Your Preferences</h2>
            <p>
              Most web browsers allow users to control or block cookies through browser settings. Disabling essential cookies may affect website functionality.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-[#0d0d0e] mb-2">Questions</h2>
            <p>
              Contact <strong className="text-[#0d0d0e]">hello@ohotech.com</strong> for questions about our cookie usage.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

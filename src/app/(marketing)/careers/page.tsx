import * as React from 'react';
import Link from 'next/link';
import { Briefcase, Send } from 'lucide-react';

export const metadata = {
  title: 'Careers | OHO TECH',
  description: 'Explore opportunities to work on software engineering, digital products, and enterprise solutions at OHO TECH.',
};

export default function CareersPage() {
  const openPositions: Array<{
    title: string;
    department: string;
    location: string;
    type: string;
    slug: string;
    desc: string;
  }> = [];

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-24 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="careers-main">
        
        {/* Page Header */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-6 sm:p-14 lg:p-20 shadow-sm mb-10 text-center relative overflow-hidden grid-pattern-light" id="careers-hero">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              CAREERS AT OHO TECH
            </div>
            
            <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-[#0d0d0e] mb-6 leading-[1.08]">
              Build Enterprise Software With Us.
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              Join OHO TECH to engineer high-impact software products, cloud systems, and growth engines for modern enterprises.
            </p>
          </div>
        </section>

        {/* Open Positions List */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-6 sm:p-14 lg:p-20 shadow-sm mb-10" id="open-positions-section">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-block text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest mb-2">
                CURRENT OPPORTUNITIES
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight">
                Open Positions ({openPositions.length})
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-500">
              Noida &amp; Remote Positions
            </p>
          </div>

          {openPositions.length === 0 ? (
            <div className="p-6 sm:p-12 bg-[#fafafa] border-2 border-slate-200 rounded-3xl text-center">
              <p className="text-base font-bold text-slate-800 mb-2">
                There are no open positions at this moment.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
                We are always seeking talented full-stack software engineers, mobile developers, and digital marketing specialists. Submit your profile below for upcoming roles.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {openPositions.map((pos) => (
                <div key={pos.slug} className="p-6 bg-[#fafafa] border-2 border-slate-200 hover:border-emerald-500 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                  <div>
                    <h3 className="text-lg font-bold text-[#0d0d0e]">{pos.title}</h3>
                    <p className="text-xs text-slate-500">{pos.department} • {pos.location}</p>
                  </div>
                  <Link href={`/careers/${pos.slug}`} className="min-h-[48px] px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center">
                    Apply Now
                  </Link>
                </div>
              ))}
            </div>
          )}

        </section>

        {/* Profile Submission Banner */}
        <section className="bg-[#0d0d0e] text-white border-2 border-slate-700 rounded-[32px] sm:rounded-[44px] p-6 sm:p-14 lg:p-16 text-center shadow-2xl relative overflow-hidden" id="careers-cta">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Want to join OHO TECH?</h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto">
              Send your resume and portfolio directly to our engineering lead at <strong className="text-emerald-400">hello@ohotech.com</strong>.
            </p>
            <Link
              href="/contact?subject=Career Application"
              className="w-full sm:w-auto min-h-[48px] px-8 py-4 rounded-full bg-white hover:bg-emerald-400 text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg inline-flex items-center justify-center gap-2"
            >
              <span>Submit General Profile</span>
              <Send className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

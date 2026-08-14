import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, MapPin, Clock } from 'lucide-react';

export const metadata = {
  title: 'Careers | OHO TECH',
  description: 'Explore opportunities to work on technology, digital products, and business solutions at OHO TECH.',
};

export default function CareersPage() {
  // If no verified job openings are currently listed:
  const openPositions: Array<{
    title: string;
    department: string;
    location: string;
    type: string;
    slug: string;
    desc: string;
  }> = [];

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f0f0eb] border border-black/10 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
            <Briefcase className="w-3.5 h-3.5 text-sky-600" />
            CAREERS AT OHO TECH
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0d0d0e] mb-6 leading-tight">
            Build what's next with us.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Explore opportunities to work on technology, digital products, and business solutions.
          </p>
        </div>

        {/* Open Positions List */}
        <div className="mb-16">
          <h2 className="text-xl sm:text-2xl font-black text-[#0d0d0e] mb-8 pb-4 border-b border-slate-200">
            Open Positions ({openPositions.length})
          </h2>

          {openPositions.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-12 text-center">
              <p className="text-base font-semibold text-slate-700 mb-2">
                No open positions at the moment.
              </p>
              <p className="text-sm text-slate-500 max-w-lg mx-auto">
                We are always interested in connecting with talented software engineers, mobile developers, UI designers, and growth strategists.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {openPositions.map((job) => (
                <div
                  key={job.slug}
                  className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 hover:border-slate-400 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                        {job.department}
                      </span>
                      <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                      <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {job.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0d0d0e] mb-2">{job.title}</h3>
                    <p className="text-sm text-slate-600 max-w-2xl">{job.desc}</p>
                  </div>

                  <Link
                    href={`/careers/${job.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-colors shrink-0"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Share Profile CTA */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-sm">
          <h3 className="text-2xl font-black text-[#0d0d0e] mb-3">
            Share your profile with us.
          </h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Interested in future engineering or growth marketing roles at OHO TECH? Send your resume and work portfolio directly to our team.
          </p>
          <a
            href="mailto:careers@ohotech.com?subject=General Profile Submission - OHO TECH Careers"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-colors"
          >
            <span>Share Profile via Email</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}

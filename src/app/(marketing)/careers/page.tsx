import * as React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Careers — OHO TECHN',
  description: 'Explore opportunities to work on software engineering, infrastructure systems, and digital solutions at OHO TECHN.',
};

export default function CareersPage() {
  const openPositions = [
    {
      title: 'Senior Full-Stack Software Engineer',
      department: 'Engineering',
      location: 'Noida, India / Hybrid',
      type: 'Full-time',
      desc: 'Lead the architecture and development of high-availability enterprise web applications and API platforms.',
    },
    {
      title: 'Solutions Architect (Cloud & Infrastructure)',
      department: 'Architecture',
      location: 'Noida, India',
      type: 'Full-time',
      desc: 'Design scalable, resilient digital infrastructure and cloud integration systems for enterprise clients.',
    },
  ];

  return (
    <div className="bg-[#f8f9fb] text-[#0f172a] min-h-screen pb-20 pt-28 sm:pt-36 px-4 sm:px-6 lg:px-8 selection:bg-slate-900 selection:text-white">
      <main className="max-w-7xl mx-auto" id="careers-main">
        
        {/* Page Header */}
        <section className="text-center max-w-4xl mx-auto mb-16" id="careers-hero">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 block mb-3">
            Careers at OHO TECHN
          </span>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 mb-6 leading-tight">
            Build Modern Infrastructure With Us.
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Join our engineering team building high-impact digital systems, enterprise applications, and scalable infrastructure.
          </p>
        </section>

        {/* Open Positions List */}
        <section className="space-y-6 mb-16" id="open-positions-section">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Current Opportunities
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">
                Open Roles ({openPositions.length})
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {openPositions.map((pos) => (
              <div key={pos.title} className="corporate-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-950">{pos.title}</h3>
                    <span className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                      {pos.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {pos.department} • {pos.location}
                  </div>
                  <p className="text-sm text-slate-600 max-w-2xl">{pos.desc}</p>
                </div>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-md bg-[#090a0f] hover:bg-slate-800 text-white font-semibold text-xs transition-colors shrink-0 text-center"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Spontaneous Applications */}
        <section className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-950">
            Don&apos;t See a Matching Role?
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            We are always interested in speaking with talented engineers, system architects, and technical leaders.
          </p>
          <div className="pt-2">
            <a
              href={`mailto:${siteConfig.contact.email}?subject=Career Inquiry`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#090a0f] hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Send Resume to {siteConfig.contact.email}</span>
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}

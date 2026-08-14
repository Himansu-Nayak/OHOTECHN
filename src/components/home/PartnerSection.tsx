'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Handshake, Building, Code, Users } from 'lucide-react';

export function PartnerSection() {
  const partnerTypes = [
    { title: 'Technology Partners', desc: 'Co-develop enterprise software modules and integrate custom APIs.', icon: Code },
    { title: 'Agencies & Studios', desc: 'Expand your service scope by offering software & mobile engineering.', icon: Building },
    { title: 'System Integrators', desc: 'Implement OHO TECH ERP & retail solutions for client deployments.', icon: Handshake },
    { title: 'Channel Partners', desc: 'Distribute ready software products across regional business markets.', icon: Users },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-16 bg-white border border-slate-200/80 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm" id="partner-with-us">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column */}
        <div className="lg:col-span-6">
          <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-4">
            09 / PARTNER WITH US
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-6">
            Grow together with OHO TECH.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
            We collaborate with agencies, developers, system integrators, and business partners to deliver high-impact digital solutions.
          </p>

          <Link
            href="/partner"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md group hover:scale-[1.02]"
          >
            <span>Become a Partner</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right Column: 4 Partner Types */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {partnerTypes.map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-[#fafafa] border border-slate-200/80 hover:border-slate-400 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0d0d0e] mb-1.5">{partner.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{partner.desc}</p>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, Building2, Handshake, Users, Sparkles } from 'lucide-react';

export function PartnerSection() {
  const partnerTypes = [
    {
      title: 'Technology Partners',
      desc: 'Co-develop enterprise software modules and integrate custom APIs.',
      icon: Code2,
      tag: 'Co-Development',
    },
    {
      title: 'Agencies & Studios',
      desc: 'Expand your service scope by offering software & mobile engineering.',
      icon: Building2,
      tag: 'Service Expansion',
    },
    {
      title: 'System Integrators',
      desc: 'Implement OHO TECH ERP & retail solutions for client deployments.',
      icon: Handshake,
      tag: 'Deployment Ready',
    },
    {
      title: 'Channel Partners',
      desc: 'Distribute ready software products across regional business markets.',
      icon: Users,
      tag: 'Global Distribution',
    },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-16 bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm" id="partner-with-us">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column */}
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            PARTNER WITH US 🤝
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-6">
            Grow together with OHO TECH.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
            We collaborate with agencies, developers, system integrators, and business partners to deliver high-impact digital solutions.
          </p>

          <Link
            href="/partner"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0d0d0e] hover:bg-emerald-500 text-white hover:text-slate-950 font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md group hover:scale-[1.02]"
          >
            <span>Become a Partner</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right Column: 4 Solid Premium Partner Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {partnerTypes.map((partner, idx) => {
            const Icon = partner.icon;

            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-gradient-to-b from-[#131b2e] via-[#0d1424] to-[#090d18] border border-slate-800 text-white shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Top Glowing Highlight */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 shadow-md">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 uppercase tracking-wider">
                    {partner.tag}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5 tracking-tight">
                  {partner.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {partner.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}

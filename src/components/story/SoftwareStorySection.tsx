'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, Cpu, Workflow, Database, ShieldCheck } from 'lucide-react';

export function SoftwareStorySection() {
  const capabilities = [
    { title: 'Custom Software Development', desc: 'Bespoke applications engineered for your specific business requirements.' },
    { title: 'Business Applications', desc: 'Internal operational tools that streamline day-to-day team workflows.' },
    { title: 'Web Applications', desc: 'Scalable cloud-native applications with high availability and speed.' },
    { title: 'Enterprise Systems', desc: 'Robust architecture designed to support high volume and complex data.' },
    { title: 'Software Modernization', desc: 'Upgrading legacy codebases into modern, maintainable technology stacks.' },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-12 bg-white border border-slate-200/80 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden" id="software-story">
      
      {/* Eyebrow Label */}
      <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-4">
        01. SOFTWARE ENGINEERING
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-14">
        
        {/* Left Column: Editorial Headline & Explanation */}
        <div className="lg:col-span-7">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-6">
            Software built around your business.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
            We design and develop custom software that helps businesses manage operations, automate workflows, and create better digital experiences.
          </p>

          <Link
            href="/services/software-development"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md group hover:scale-[1.02]"
          >
            <span>Explore Software Development</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right Column: Premium Abstract Product / System Visual */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-[#0d0d0e] text-white border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-sky-500/40 transition-all duration-300">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-sky-400" />
                <span className="text-xs font-mono font-bold text-slate-200">System Architecture</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Custom Build
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  <span className="text-slate-200">Business Process Engine</span>
                </div>
                <span className="text-[10px] text-slate-400">Core</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Workflow className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-200">Automated Workflows</span>
                </div>
                <span className="text-[10px] text-amber-400">Active</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200">Secure Database Cluster</span>
                </div>
                <span className="text-[10px] text-emerald-400">Verified</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Enterprise Delivery</span>
              <span className="text-sky-400 font-bold">Tailored Codebase</span>
            </div>

          </div>
        </div>

      </div>

      {/* Below: 5 Concise Capability Points */}
      <div className="pt-8 border-t border-slate-200/80">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-6">
          KEY SOFTWARE CAPABILITIES
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {capabilities.map((cap, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200/80 hover:border-slate-400 transition-colors">
              <div className="flex items-center gap-2 text-sky-600 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold text-[#0d0d0e]">{cap.title}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, Cpu, Workflow, Database, ShieldCheck } from 'lucide-react';

export function SoftwareStorySection() {
  const capabilities = [
    { title: 'Custom Software Development', desc: 'Bespoke applications engineered around your exact operational workflows.', emoji: '💻' },
    { title: 'Business Applications', desc: 'Internal software tools that streamline day-to-day team productivity.', emoji: '📊' },
    { title: 'Enterprise Systems', desc: 'Robust software architecture designed to handle high transaction volume.', emoji: '🏢' },
    { title: 'Software Modernization', desc: 'Upgrading legacy platforms to modern, scalable technology stacks.', emoji: '⚡' },
    { title: 'Workflow Automation', desc: 'Eliminating repetitive manual processes with automated digital systems.', emoji: '🔄' },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-6 bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden transition-all duration-500" id="software-story">
      
      {/* Eyebrow Label */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-5">
        <span>💻</span>
        <span>01 / SOFTWARE DEVELOPMENT CAPABILITIES</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-14">
        
        {/* Left Column: Text on Left */}
        <div className="lg:col-span-7">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-6">
            Software built around your business. 💻
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
            We develop custom software and business applications designed around your workflows, operations, and strategic business goals.
          </p>

          <Link
            href="/services/software-development"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md group hover:scale-[1.02]"
          >
            <span>Explore Software Development</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right Column: Visual on Right */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-[#0d0d0e] text-white border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200">Software Operations Core</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                Custom Architecture
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200">Business Logic Layer</span>
                </div>
                <span className="text-[10px] text-slate-400">Tailored</span>
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
                  <Database className="w-4 h-4 text-teal-400" />
                  <span className="text-slate-200">Data Architecture</span>
                </div>
                <span className="text-[10px] text-teal-400">Structured</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Operational Focus</span>
              <span className="text-emerald-400 font-bold">Scalable Stack</span>
            </div>

          </div>
        </div>

      </div>

      {/* Below: Capabilities Grid */}
      <div className="pt-8 border-t border-slate-200/80">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-6">
          CORE SOFTWARE CAPABILITIES
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {capabilities.map((cap, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 hover:border-emerald-400 transition-all group">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <span className="text-lg group-hover:scale-110 transition-transform">{cap.emoji}</span>
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

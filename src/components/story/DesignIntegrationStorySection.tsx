'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Palette, Plug, Layers, Sparkles, ShieldCheck } from 'lucide-react';

export function DesignIntegrationStorySection() {
  const highlights = [
    { title: 'UI/UX Design', desc: 'Intuitive interface design centered around seamless user tasks and efficiency.' },
    { title: 'Product Design', desc: 'End-to-end digital product design from initial wireframes to design systems.' },
    { title: 'API Integration', desc: 'Connecting web & mobile applications with external APIs, payment gateways, and CRMs.' },
    { title: 'Third-Party Integrations', desc: 'Harmonizing existing software tools into a single connected workflow.' },
    { title: 'System Modernization', desc: 'Refactoring user interfaces and integration layers for legacy applications.' },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-12 bg-white border border-slate-200/80 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden" id="design-integration-story">
      
      {/* Eyebrow Label */}
      <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-4">
        05. DESIGN, UX &amp; INTEGRATION
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-14">
        
        {/* Left Column: Editorial Headline & Explanation */}
        <div className="lg:col-span-7">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-6">
            Technology should feel simple.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
            We design intuitive digital experiences and connect the systems your business already depends on.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md group hover:scale-[1.02]"
          >
            <span>Talk to a Technology Expert</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right Column: Clean Design & API Integration Graphic */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm bg-[#0d0d0e] text-white border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-sky-400 transition-all duration-300">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Palette className="w-5 h-5 text-sky-400" />
                <span className="text-xs font-mono font-bold text-slate-200">Design &amp; API Connectivity</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Connected
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-sky-400" />
                  <span className="text-slate-200">UI/UX Design System</span>
                </div>
                <span className="text-[10px] text-slate-400">Atomic</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Plug className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-200">Payment &amp; CRM Gateway</span>
                </div>
                <span className="text-[10px] text-amber-400">Integrated</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200">Third-Party Microservices</span>
                </div>
                <span className="text-[10px] text-emerald-400">Synced</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Human-Centered UI</span>
              <span className="text-sky-400 font-bold">Seamless API</span>
            </div>

          </div>
        </div>

      </div>

      {/* Below: 5 Design & Integration Highlights */}
      <div className="pt-8 border-t border-slate-200/80">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-6">
          DESIGN &amp; INTEGRATION CAPABILITIES
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {highlights.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200/80 hover:border-slate-400 transition-colors">
              <div className="flex items-center gap-2 text-sky-600 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold text-[#0d0d0e]">{item.title}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

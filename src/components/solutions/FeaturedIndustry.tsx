'use client';

import * as React from 'react';
import Link from 'next/link';
import { Industry } from '@/config/industries';
import { ArrowRight, Sparkles, Cpu, ShieldCheck, Database, Layers } from 'lucide-react';

interface FeaturedIndustryProps {
  industry: Industry;
}

export function FeaturedIndustry({ industry }: FeaturedIndustryProps) {
  return (
    <div className="w-full bg-[#111113] text-white rounded-3xl p-8 sm:p-12 lg:p-14 mb-12 relative overflow-hidden shadow-xl border border-black/20 transition-all duration-300">
      
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Overlay Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none grid-pattern-dark" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        
        {/* Left Column: Heading & Description & Primary CTA */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-teal-300 text-xs font-mono font-bold uppercase tracking-wider mb-5 self-start">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            INDUSTRY SOLUTIONS
          </div>

          {/* Large Title */}
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            {industry.name} Technology
          </h3>

          {/* Short Description */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-xl">
            {industry.description}
          </p>

          {/* Primary CTA */}
          <div>
            <Link
              href={`/solutions/${industry.slug}`}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white hover:bg-teal-400 text-[#0d0d0e] font-extrabold text-sm tracking-tight transition-all duration-200 shadow-lg group hover:scale-[1.02]"
            >
              <span>Explore {industry.name} Solutions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

        {/* Right Column: Premium Abstract Ecosystem Architecture Graphic */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="w-full max-w-sm bg-[#1a1a1e] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-teal-500/40 transition-all duration-300">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  {industry.slug}_stack.sys
                </span>
              </div>
              <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                {industry.products.length} Modules
              </span>
            </div>

            {/* Architecture Visual Nodes */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-teal-400" />
                  <span className="text-slate-200 font-semibold">{industry.name} Core Engine</span>
                </div>
                <span className="text-[10px] text-emerald-400">ONLINE</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-sky-400" />
                  <span className="text-slate-200 font-semibold">Real-Time Data Lake</span>
                </div>
                <span className="text-[10px] text-sky-400">SYNCED</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-200 font-semibold">Enterprise SLA &amp; Auth</span>
                </div>
                <span className="text-[10px] text-amber-400">SECURE</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>SLA: 99.99% UPTIME</span>
              <span className="text-teal-400">DEPLOY READY &rarr;</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

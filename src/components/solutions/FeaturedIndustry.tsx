'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-sky-300 text-xs font-mono font-bold uppercase tracking-wider mb-5 self-start">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
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

        {/* Right Column: 4K Ultra-High Definition AI Artwork Display */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="w-full h-72 sm:h-80 relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl group hover:border-teal-500/50 transition-all duration-300">
            <NextImage
              src="/hero_tech_ecosystem.jpg"
              alt={`${industry.name} 4K AI Enterprise Solution Architecture System`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.95] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-teal-400 bg-[#111113]/90 backdrop-blur-md px-3 py-1 rounded-full border border-teal-500/30">
                ⚡ 4K {industry.name.toUpperCase()} ECOSYSTEM
              </span>
              <span className="text-[10px] font-mono text-slate-300 bg-[#111113]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                {industry.products.length} MODULES
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

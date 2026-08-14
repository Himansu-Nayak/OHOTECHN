'use client';

import * as React from 'react';
import Link from 'next/link';
import { Service } from '@/config/services';
import { ArrowRight, Code2, Sparkles, ShieldCheck } from 'lucide-react';

interface FeaturedServiceCardProps {
  service: Service;
}

export function FeaturedServiceCard({ service }: FeaturedServiceCardProps) {
  const isTech = service.category === 'technology';

  return (
    <div className="md:col-span-2 bg-[#0d0d0e] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-black relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/40 transition-all duration-300">
      
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        
        {/* Header Tag */}
        <div className="flex items-center justify-between mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
            <span>{service.emoji || '⚡'}</span>
            <span>FLAGSHIP {isTech ? 'ENGINEERING' : 'GROWTH'} CAPABILITY</span>
          </div>

          <span className="text-xs font-mono text-slate-400 font-medium">
            {service.features.length} Core Modules
          </span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 group-hover:text-emerald-300 transition-colors flex items-center gap-2.5">
          <span>{service.emoji || '⚡'}</span>
          <span>{service.name}</span>
        </h3>

        {/* Description */}
        <p className="text-base text-slate-300 leading-relaxed mb-8 max-w-xl">
          {service.description}
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {service.features.slice(0, 3).map((feat, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Action Footer */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400">
          SLA-Backed Delivery
        </span>

        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#0d0d0e] hover:bg-emerald-400 font-extrabold text-xs tracking-tight transition-all duration-200 shadow-md group-hover:scale-105"
        >
          <span>Explore Capabilities</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}

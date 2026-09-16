'use client';

import * as React from 'react';
import Link from 'next/link';
import { Service } from '@/config/services';
import { ArrowRight, Code2, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeaturedServiceCardProps {
  service: Service;
}

export function FeaturedServiceCard({ service }: FeaturedServiceCardProps) {
  const isTech = service.category === 'technology';

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="md:col-span-2 bg-[#121316] text-white rounded-none p-6 sm:p-10 border border-white/10 relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/50 transition-colors duration-200 will-change-transform"
    >
      <div className="relative z-10">
        
        {/* Header Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-white/5 border border-white/10 text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider w-fit">
            <span>{service.emoji || '⚡'}</span>
            <span>FLAGSHIP {isTech ? 'ENGINEERING' : 'GROWTH'} CAPABILITY</span>
          </div>

          <span className="text-xs font-mono text-slate-400 font-medium">
            {service.features.length} Core Modules
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight mb-3 group-hover:text-emerald-300 transition-colors flex items-center gap-2.5">
          <span>{service.emoji || '⚡'}</span>
          <span>{service.name}</span>
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-xl">
          {service.description}
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
          {service.features.slice(0, 3).map((feat, idx) => (
            <div key={idx} className="p-3 rounded-none bg-white/5 border border-white/10 text-xs font-medium text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Action Footer */}
      <div className="relative z-10 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-mono text-slate-400">
          SLA-Backed Delivery
        </span>

        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-none bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs tracking-wider uppercase transition-colors duration-200"
        >
          <span>Explore Capabilities</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </motion.div>
  );
}

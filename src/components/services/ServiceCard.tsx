'use client';

import * as React from 'react';
import Link from 'next/link';
import { Service } from '@/config/services';
import { cn } from '@/lib/utils';
import {
  Code2,
  Globe,
  Smartphone,
  Tablet,
  Wrench,
  LayoutGrid,
  Palette,
  Plug,
  Search,
  Share2,
  Target,
  Megaphone,
  PenTool,
  MessageCircle,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Globe,
  Smartphone,
  Tablet,
  Wrench,
  LayoutGrid,
  Palette,
  Plug,
  Search,
  Share2,
  Target,
  Megaphone,
  PenTool,
  MessageCircle,
  Mail,
};

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = iconMap[service.iconName] || Sparkles;
  const isTech = service.category === 'technology';

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative rounded-3xl bg-gradient-to-b from-[#131b2e] via-[#0d1424] to-[#090d18] border border-slate-800/90 text-white p-7 sm:p-8 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:border-slate-700/80 hover:shadow-2xl"
    >
      {/* Top Subtle Glow Line */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80 group-hover:opacity-100 transition-opacity",
          isTech
            ? "from-emerald-500/80 via-emerald-400 to-emerald-500/80"
            : "from-amber-500/80 via-amber-400 to-amber-500/80"
        )}
      />

      <div>
        {/* Top Header: Vector Icon Pod + Category Tag */}
        <div className="flex items-center justify-between mb-6">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300 shadow-md",
              isTech
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-slate-950"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30 group-hover:bg-amber-400 group-hover:text-slate-950"
            )}
          >
            <IconComponent className="w-6 h-6 stroke-[2]" />
          </div>

          <span
            className={cn(
              "text-[11px] font-mono font-bold px-3 py-1 rounded-full border tracking-wider uppercase shadow-xs",
              isTech
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            )}
          >
            {isTech ? 'Technology' : 'Digital Growth'}
          </span>
        </div>

        {/* Service Name */}
        <h4 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors duration-200">
          {service.name}
        </h4>

        {/* Short Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-8 font-normal">
          {service.description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-slate-400 group-hover:text-white transition-colors">
        <span>EXPLORE CAPABILITY</span>
        <ArrowRight
          className={cn(
            "w-4 h-4 transition-all duration-200 group-hover:translate-x-1",
            isTech ? "text-emerald-400" : "text-amber-400"
          )}
        />
      </div>
    </Link>
  );
}

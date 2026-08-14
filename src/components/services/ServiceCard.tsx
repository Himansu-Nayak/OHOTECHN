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
      className="group block bg-white border border-slate-200/80 rounded-2xl p-7 sm:p-8 hover:border-slate-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Emoji Icon & Category Label */}
        <div className="flex items-center justify-between mb-6">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-200 group-hover:scale-110 border",
              isTech
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-amber-50 text-amber-600 border-amber-200"
            )}
          >
            {service.emoji || '⚙️'}
          </div>

          <span
            className={cn(
              "text-[11px] font-mono font-semibold px-3 py-1 rounded-full border transition-colors",
              isTech
                ? "bg-slate-50 text-slate-600 border-slate-200/80 group-hover:border-slate-300"
                : "bg-amber-50/60 text-amber-800 border-amber-200/60 group-hover:border-amber-300"
            )}
          >
            {isTech ? 'Technology' : 'Digital Growth'}
          </span>
        </div>

        {/* Service Name */}
        <h4 className="text-lg sm:text-xl font-bold text-[#0d0d0e] mb-3 group-hover:text-emerald-600 transition-colors duration-200 flex items-center gap-2">
          <span>{service.emoji || '⚙️'}</span>
          <span>{service.name}</span>
        </h4>

        {/* Short Description (Max 2 lines) */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-8">
          {service.description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#0d0d0e] transition-colors">
        <span>Explore Service</span>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-200" />
      </div>
    </Link>
  );
}

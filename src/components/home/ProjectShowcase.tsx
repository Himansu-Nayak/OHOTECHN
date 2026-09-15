'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export interface ProjectData {
  id: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  keyDeliverables?: string[];
  technologies?: string[];
  image: string;
  hoverImage?: string;
  href: string;
  accent: string;
}

interface ProjectShowcaseProps {
  project: ProjectData;
  index: number;
  priorityImage?: boolean;
}

const SECONDARY_HOVER_IMAGES: Record<string, string> = {
  'healthcare-emr': '/images/3d-enterprise-node.jpg',
  'education-erp': '/images/3d-software-dev.jpg',
  'retail-pos': '/images/3d-digital-growth.jpg',
  'hospitality-erp': '/hero_workspace_editorial.jpg',
};

/**
 * ProjectShowcase (14islands Flat Editorial Grid Architecture)
 * 
 * - Flat rectangle with 1px hairline border (no rounded corners, no drop shadow, no glow blob).
 * - Instant scanability: Number + Category Tag + Title + Direct Link.
 * - CSS Hover Swap: Primary screenshot smoothly crossfades to secondary preview state on hover/tap.
 */
export function ProjectShowcase({ project, index, priorityImage = false }: ProjectShowcaseProps) {
  const isEven = index % 2 === 1;
  const hoverImg = project.hoverImage || SECONDARY_HOVER_IMAGES[project.id] || project.image;

  return (
    <Link
      href={project.href}
      data-cursor-text="EXPLORE"
      className="group block w-full bg-[#0a0a0b] border-t border-b border-white/10 hover:border-emerald-500/50 transition-colors duration-300 py-10 sm:py-14 lg:py-16"
    >
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
        isEven ? 'lg:grid-flow-dense' : ''
      }`}>
        
        {/* Visual Showcase: CSS Hover Crossfade Frame */}
        <div className={`lg:col-span-7 w-full ${isEven ? 'lg:col-start-6' : ''}`}>
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#121316] border border-white/10">
            {/* Primary Static Image */}
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
              priority={priorityImage}
              className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
            />

            {/* Secondary Hover State Crossfade */}
            <Image
              src={hoverImg}
              alt={`${project.title} Preview`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
              className="object-cover object-center opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
            />

            {/* Hairline Editorial Overlay Header */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] sm:text-xs text-white px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-white/10">
              <span className="text-emerald-400 font-bold">PROJECT {project.number}</span>
              <span className="text-slate-300 uppercase tracking-widest">{project.category}</span>
            </div>
          </div>
        </div>

        {/* Flat Editorial Typography Side */}
        <div className={`lg:col-span-5 flex flex-col justify-between ${
          isEven ? 'lg:col-start-1' : ''
        }`}>
          <div>
            <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span>0{index + 1}</span>
              <span className="text-white/20">/</span>
              <span>{project.category}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight uppercase group-hover:text-emerald-400 transition-colors duration-300 mb-6">
              {project.title}
            </h3>

            <div className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-6">
              {project.subtitle}
            </div>
          </div>

          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-white uppercase tracking-wider group-hover:text-emerald-400 transition-colors pt-4 border-t border-white/10">
            <span>View Architecture</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </div>
        </div>

      </div>
    </Link>
  );
}

export default ProjectShowcase;

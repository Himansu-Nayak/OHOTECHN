'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, FolderGit2, ArrowUpRight } from 'lucide-react';
import { WorkProject } from '@/config/work';

interface WorkNextProjectProps {
  nextProject: WorkProject;
}

export function WorkNextProject({ nextProject }: WorkNextProjectProps) {
  if (!nextProject) return null;

  return (
    <section className="mt-20 sm:mt-28 pt-12 border-t border-white/10">
      <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
        <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>CONTINUE CASE STUDY READING // UP NEXT</span>
      </div>

      <Link
        href={`/work/${nextProject.slug}`}
        className="group block relative rounded-3xl bg-[#111216]/95 border border-white/15 hover:border-emerald-500/50 p-6 sm:p-10 lg:p-12 transition-all duration-500 shadow-2xl overflow-hidden cursor-pointer"
      >
        {/* Next Project Ambient Radial Glow */}
        <div 
          className="absolute -top-32 -right-32 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full blur-[160px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500"
          style={{ backgroundColor: nextProject.accent }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider">
                PROJECT // {nextProject.number}
              </span>
              <span className="text-slate-400">
                {nextProject.industry}
              </span>
            </div>

            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              {nextProject.category}
            </div>

            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight group-hover:text-emerald-300 transition-colors">
              {nextProject.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed line-clamp-2">
              {nextProject.summary}
            </p>

            {/* Metrics Highlight Preview */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {nextProject.metrics.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono">
                  <div className="text-sm sm:text-base font-black text-emerald-400">{m.value}</div>
                  <div className="text-[10px] text-slate-400 uppercase truncate">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors uppercase">
              <span>EXPLORE NEXT BLUEPRINT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>

          {/* Right Image Preview with Scale */}
          <div className="lg:col-span-5 w-full">
            <div className="relative w-full h-56 sm:h-72 lg:h-80 rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-xl">
              <Image
                src={nextProject.heroImage}
                alt={nextProject.title}
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover object-center opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold shadow-xl group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>

        </div>
      </Link>
    </section>
  );
}

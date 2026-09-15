'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  FolderGit2, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  Filter, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { WorkProject } from '@/config/work';

interface WorkFilterableGridProps {
  projects: WorkProject[];
}

export function WorkFilterableGrid({ projects }: WorkFilterableGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const cats = ['All'];
    projects.forEach((p) => {
      if (!cats.includes(p.industry)) {
        cats.push(p.industry);
      }
    });
    return cats;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.industry.toLowerCase() === selectedCategory.toLowerCase();
      const matchesQuery =
        searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesQuery;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Search and Category Filter Bar */}
      <div className="mb-12 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer button-tactile glow-focus ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search architecture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111216] border border-white/15 focus:border-emerald-500 rounded-full py-2 pl-10 pr-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
          <span>SHOWING {filteredProjects.length} OF {projects.length} VERIFIED ARCHITECTURE CASE STUDIES</span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-emerald-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-[#111216]/50 rounded-3xl border border-white/10 p-8">
          <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-sans">No matching case studies found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Try adjusting your search terms or category selection to browse our enterprise case study archive.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 rounded-full bg-emerald-500 text-black font-mono text-xs font-bold uppercase tracking-wider"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 mb-20">
          {filteredProjects.map((project) => (
            <article 
              key={project.slug}
              data-cursor-text="CASE"
              className="group rounded-3xl bg-[#111216]/90 border border-white/10 hover:border-emerald-500/50 p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between shadow-2xl relative overflow-hidden hover-lift"
            >
              {/* Corner Ambient Glow */}
              <div 
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[110px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: project.accent }}
              />

              <div>
                {/* Visual Thumbnail with Scale */}
                <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden bg-black/60 border border-white/10 mb-6 group/thumb">
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover object-center opacity-85 group-hover/thumb:scale-105 group-hover/thumb:opacity-95 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-transparent opacity-80" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 font-mono text-[10px] text-white px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/15">
                    <span className="text-emerald-400 font-bold">PROJECT // {project.number}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-300">{project.industry}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-slate-300 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10">
                    <span className="truncate">{project.clientArchetype}</span>
                    <span className="text-emerald-400 font-bold ml-2 shrink-0">PRODUCTION READY</span>
                  </div>
                </div>

                {/* Category & Title */}
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                  {project.category}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-4 group-hover:text-emerald-300 transition-colors font-sans">
                  {project.title}
                </h2>

                <p className="text-sm text-slate-300 font-normal leading-relaxed mb-6">
                  {project.summary}
                </p>

                {/* Key Deliverables Bullet Points */}
                <div className="space-y-2 mb-6 text-xs font-mono text-slate-300">
                  {project.deliverables.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Metrics Highlight Strip */}
                <div className="grid grid-cols-3 gap-2.5 mb-6 p-3 rounded-2xl bg-black/40 border border-white/5 font-mono text-center">
                  {project.metrics.map((m, mIdx) => (
                    <div key={mIdx}>
                      <div className="text-sm sm:text-base font-black text-emerald-400">{m.value}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-tight truncate">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5 max-w-[60%]">
                  {project.technologies.slice(0, 3).map((t, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/work/${project.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-300 hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md button-tactile glow-focus group/btn"
                >
                  <span>Explore Case</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform arrow-slide" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

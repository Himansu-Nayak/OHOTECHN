import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FolderGit2, Sparkles, Terminal, ShieldCheck } from 'lucide-react';
import { WORK_PROJECTS } from '@/config/work';
import { WorkFilterableGrid } from '@/components/work/WorkFilterableGrid';

import { buildMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Selected Work & Case Studies | OHO TECH Enterprise Platforms',
  description: 'Explore representative enterprise software platforms, custom architecture blueprints, and scalable digital systems engineered by OHO TECH.',
  path: '/work',
});

export default function WorkPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Selected Work', url: '/work' },
  ];

  return (
    <main className="min-h-screen bg-[#07080c] text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/4 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-emerald-500/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" />
      
      {/* Precision Technical Mesh Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 sm:mb-10 font-mono text-xs text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-400 transition-colors">HOME</Link>
          <span>/</span>
          <span className="text-emerald-400 font-bold">SELECTED WORK</span>
        </nav>

        {/* Hero Section Header */}
        <div className="mb-14 sm:mb-16 pb-10 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-6">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>ENTERPRISE CASE STUDY ARCHIVE // {WORK_PROJECTS.length.toString().padStart(2, '0')}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] uppercase mb-6">
            <span>Selected Work.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Engineered For Scale.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
            A comprehensive index of mission-critical software systems, distributed enterprise architectures, and bespoke operational platforms engineered by OHO TECH.
          </p>
        </div>

        {/* Filterable Case Studies Grid */}
        <WorkFilterableGrid projects={WORK_PROJECTS} />

        {/* Architecture Consultation Strip */}
        <div className="rounded-3xl bg-[#14151a] border border-white/15 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-2">
              TECHNICAL CONSULTATION
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
              Require a custom architectural assessment?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 font-normal max-w-xl">
              Our technical leadership directly evaluates system requirements, scale constraints, and deployment topologies with zero obligation.
            </p>
          </div>

          <Link
            href="/contact"
            className="w-full md:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl shrink-0 flex items-center justify-center gap-2"
          >
            <span>CONSULT LEADERSHIP</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  );
}

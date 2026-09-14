import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FolderGit2, Layers, Cpu, ShieldCheck, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { WORK_PROJECTS } from '@/config/work';

export const metadata: Metadata = {
  title: 'Selected Work & Case Studies | OHO TECH Enterprise Platforms',
  description: 'Explore representative enterprise software platforms, custom architecture blueprints, and scalable digital systems engineered by OHO TECH.',
  openGraph: {
    title: 'Selected Work & Case Studies | OHO TECH',
    description: 'Explore representative enterprise software platforms, custom architecture blueprints, and scalable digital systems engineered by OHO TECH.',
  },
};

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-[#07080c] text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
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
        <div className="mb-16 sm:mb-20 pb-10 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-6">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>ENTERPRISE CASE STUDY ARCHIVE // 04</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] uppercase mb-6">
            <span>Selected Work</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Engineered For Scale.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
            A comprehensive index of mission-critical software systems, distributed enterprise architectures, and bespoke operational platforms engineered by OHO TECH.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 mb-20">
          {WORK_PROJECTS.map((project) => (
            <article 
              key={project.slug}
              className="group rounded-3xl bg-[#111216]/90 border border-white/10 hover:border-emerald-500/40 p-6 sm:p-10 transition-all duration-300 flex flex-col justify-between shadow-2xl relative overflow-hidden"
            >
              {/* Corner Ambient Glow */}
              <div 
                className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-[100px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: project.accent }}
              />

              <div>
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6 font-mono text-xs">
                  <span className="text-emerald-400 font-bold tracking-widest">
                    PROJECT // {project.number}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300">
                    {project.industry}
                  </span>
                </div>

                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                  {project.category}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-4 group-hover:text-emerald-300 transition-colors">
                  {project.title}
                </h2>

                <p className="text-sm text-slate-300 font-normal leading-relaxed mb-6">
                  {project.summary}
                </p>

                {/* Key Deliverables Bullet Points */}
                <div className="space-y-2 mb-8 text-xs font-mono text-slate-300">
                  {project.deliverables.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Metrics Highlight Strip */}
                <div className="grid grid-cols-3 gap-2.5 mb-8 p-3 rounded-2xl bg-black/40 border border-white/5 font-mono text-center">
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
                <div className="flex flex-wrap gap-1.5 max-w-[65%]">
                  {project.technologies.slice(0, 3).map((t, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/work/${project.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-300 hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200"
                >
                  <span>Explore Case</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

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

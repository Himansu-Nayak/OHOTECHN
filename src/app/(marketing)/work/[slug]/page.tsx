import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowRight, 
  ArrowUpRight,
  CheckCircle2, 
  Cpu, 
  Database, 
  Globe, 
  Layers, 
  Lock, 
  Server, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { WORK_PROJECTS, getWorkProject, getAllWorkProjectSlugs } from '@/config/work';
import { WorkHero } from '@/components/work/WorkHero';
import { WorkPipelineVisualizer } from '@/components/work/WorkPipelineVisualizer';
import { WorkVisualizer } from '@/components/work/WorkVisualizer';
import { WorkGallery } from '@/components/work/WorkGallery';
import { WorkNextProject } from '@/components/work/WorkNextProject';
import { buildMetadata, getBreadcrumbJsonLd, getSoftwareApplicationJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllWorkProjectSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getWorkProject(slug);

  if (!project) {
    return {
      title: 'Case Study Not Found | OHO TECH',
    };
  }

  return buildMetadata({
    title: `${project.title} | Enterprise Case Study`,
    description: project.summary,
    path: `/work/${project.slug}`,
    image: project.heroImage,
    tags: project.technologies,
  });
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getWorkProject(slug);

  if (!project) {
    notFound();
  }

  const nextProject = WORK_PROJECTS.find((p) => p.slug === project.nextSlug) || WORK_PROJECTS[0];

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Selected Work', url: '/work' },
    { name: project.title, url: `/work/${project.slug}` },
  ];

  const softwareAppSchema = getSoftwareApplicationJsonLd({
    name: project.title,
    description: project.summary,
    applicationCategory: project.category,
    url: `/work/${project.slug}`,
  });

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-white pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={softwareAppSchema} />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* 1. EDITORIAL HERO */}
        <WorkHero project={project} />

        {/* 2. INTERACTIVE PIPELINE VISUALIZER (From Reference Recording) */}
        <WorkPipelineVisualizer project={project} />

        {/* 3. OPERATIONAL CHALLENGE & OBJECTIVES (FLAT ASYMMETRIC GRID) */}
        <section className="py-14 sm:py-20 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            
            {/* The Challenge */}
            <div className="lg:col-span-6 bg-[#111216] border border-white/10 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  OPERATIONAL CHALLENGE
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
                  {project.challenge.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  {project.challenge.description}
                </p>

                <div className="space-y-3 mb-6 pt-4 border-t border-white/10">
                  <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                    CRITICAL FRICTION POINTS
                  </div>
                  {project.challenge.frictionPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-mono">
                      <span className="text-emerald-400 font-bold">/</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {project.challenge.rootCauses && (
                <div className="pt-4 border-t border-white/10 space-y-1.5 text-xs font-mono text-slate-400">
                  <span className="text-slate-500 font-bold text-[10px] uppercase block">ROOT CONSTRAINTS</span>
                  {project.challenge.rootCauses.map((rc, idx) => (
                    <div key={idx} className="text-[11px]">• {rc}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Core Objectives */}
            <div className="lg:col-span-6 bg-[#111216] border border-white/10 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">
                  ENGINEERING TARGETS
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
                  Core Architectural Goals
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  {project.objective.primaryGoal}
                </p>

                <div className="space-y-3 mb-6 pt-4 border-t border-white/10">
                  <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                    DELIVERABLE BENCHMARKS
                  </div>
                  {project.objective.coreObjectives.map((obj, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-1.5 text-xs font-mono text-slate-400">
                <span className="text-slate-500 font-bold text-[10px] uppercase block">STANDARDS COMPLIANCE</span>
                <div className="flex flex-wrap gap-2">
                  {project.objective.regulatoryCompliance.map((reg, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white/5 border border-white/10 text-[10px] text-emerald-300 font-bold">
                      {reg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. SOLUTION ARCHITECTURE BLUEPRINT (FLAT 1PX GRID) */}
        <section id="solution" className="py-14 sm:py-20 border-b border-white/10">
          <div className="max-w-3xl mb-10">
            <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
              TECHNICAL BLUEPRINT
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase mb-4">
              {project.solution.title}
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {project.solution.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-5 bg-[#111216] border border-white/10 font-mono text-xs">
              <div className="text-slate-500 text-[10px] uppercase mb-1">FRONTEND ARCHITECTURE</div>
              <div className="text-white font-bold">{project.architecture.frontend}</div>
            </div>
            <div className="p-5 bg-[#111216] border border-white/10 font-mono text-xs">
              <div className="text-slate-500 text-[10px] uppercase mb-1">SERVICES & PROTOCOLS</div>
              <div className="text-white font-bold">{project.architecture.services}</div>
            </div>
            <div className="p-5 bg-[#111216] border border-white/10 font-mono text-xs">
              <div className="text-slate-500 text-[10px] uppercase mb-1">DATABASE CORE</div>
              <div className="text-white font-bold">{project.architecture.database}</div>
            </div>
            <div className="p-5 bg-[#111216] border border-white/10 font-mono text-xs">
              <div className="text-slate-500 text-[10px] uppercase mb-1">INFRASTRUCTURE</div>
              <div className="text-emerald-400 font-bold">{project.architecture.infrastructure}</div>
            </div>
          </div>

          <div className="p-5 bg-[#111216] border border-white/10 text-xs font-mono text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-emerald-400 font-bold uppercase mr-2">SYSTEM STRATEGY:</span>
              <span>{project.solution.systemDesignStrategy}</span>
            </div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest shrink-0">
              AUDITED DEPLOYMENT
            </span>
          </div>
        </section>

        {/* 5. CORE SYSTEM MODULES */}
        <section className="py-14 sm:py-20 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
            <div>
              <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
                MODULAR CAPABILITIES
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                Core System Modules
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {project.features.length} Enterprise Modules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.features.map((feat) => (
              <div
                key={feat.id}
                className="p-6 sm:p-8 bg-[#111216] border border-white/10 hover:border-emerald-500/50 transition-colors duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 font-mono text-xs">
                    <span className="text-slate-400 uppercase tracking-wider font-bold">
                      {feat.subtitle}
                    </span>
                    {feat.badge && (
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase">
                        {feat.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
                    {feat.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono text-slate-300">
                  {feat.capabilities.map((cap, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. VERIFIED METRICS BENCHMARKS */}
        <section className="py-14 sm:py-20 border-b border-white/10">
          <div className="mb-10">
            <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
              EMPIRICAL EVIDENCE
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Measured Architectural Benchmarks
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="p-6 sm:p-8 bg-[#111216] border border-white/10 font-mono">
                <div className="text-3xl sm:text-5xl font-black text-emerald-400 mb-2">{m.value}</div>
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">{m.label}</div>
                <div className="text-[11px] text-slate-400 leading-relaxed">{m.detail}</div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#111216] border border-white/10 text-xs font-mono text-slate-400">
            <span className="text-emerald-400 font-bold uppercase mr-2">NOTICE:</span>
            {project.dataDisclosureNotice}
          </div>
        </section>

        {/* 7. DOMAIN TELEMETRY VISUALIZER */}
        <section className="py-14 sm:py-20 border-b border-white/10">
          <div className="mb-8">
            <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
              INTERACTIVE DOMAIN VISUALIZER
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Live Topology Inspector
            </h3>
          </div>

          <WorkVisualizer project={project} />
        </section>

        {/* 8. GALLERY SPREAD */}
        <WorkGallery items={project.gallery} projectTitle={project.title} />

        {/* 9. ARCHITECTURAL VERDICT BANNER */}
        <div className="my-16 sm:my-20 p-6 sm:p-10 bg-[#111216] border border-white/10 text-xs font-mono text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-2">
              ARCHITECTURAL VERDICT // CONCLUSION
            </span>
            <p className="text-slate-300 text-sm sm:text-base font-sans leading-relaxed">{project.verdict}</p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider text-xs font-mono shrink-0 transition-all shadow-lg"
          >
            <span>CONSULT ON ARCHITECTURE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 10. NEXT PROJECT CURTAIN FOOTER */}
        <WorkNextProject nextProject={nextProject} />

      </div>
    </main>
  );
}

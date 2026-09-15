import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowRight, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Globe, 
  Server,
  Zap,
  Lock,
  Target,
  FileCheck2,
  Sparkles,
  Info
} from 'lucide-react';
import { WORK_PROJECTS, getWorkProject, getAllWorkProjectSlugs } from '@/config/work';
import { WorkHero } from '@/components/work/WorkHero';
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
    <main className="min-h-screen bg-[#07080c] text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={softwareAppSchema} />
      {/* Precision Technical Mesh Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION                                                          */}
        {/* ========================================================================= */}
        <WorkHero project={project} />

        {/* ========================================================================= */}
        {/* 2. PROJECT INTRODUCTION                                                  */}
        {/* ========================================================================= */}
        <section className="mb-16 sm:mb-24 p-6 sm:p-10 rounded-3xl bg-[#111216]/90 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4" />
            <span>01 // EXECUTIVE PROJECT INTRODUCTION</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-6 font-sans">
            Architectural Overview &amp; Scope
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8">
            <p>{project.introduction.overview}</p>
            <p className="text-slate-400">{project.introduction.context}</p>
          </div>

          <div>
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
              PRIMARY ENGINEERING SCOPE
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {project.introduction.scope.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PROBLEM & 4. OBJECTIVE (2-COLUMN GRID)                                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 sm:mb-24">
          
          {/* Section 3: Problem */}
          <section className="p-6 sm:p-8 rounded-3xl bg-rose-950/10 border border-rose-500/20 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-rose-400 uppercase tracking-wider mb-4">
                <AlertCircle className="w-4 h-4" />
                <span>02 // THE OPERATIONAL PROBLEM</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-4 font-sans">
                {project.challenge.title}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {project.challenge.description}
              </p>
              
              <div className="space-y-2.5 mb-6">
                <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">OBSERVED FRICTION POINTS</div>
                {project.challenge.frictionPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-rose-200/90 font-mono">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {project.challenge.rootCauses && (
              <div className="pt-4 border-t border-rose-500/10 space-y-1.5 text-xs font-mono text-slate-400">
                <span className="text-rose-400/80 font-bold text-[10px] uppercase block">ROOT CAUSES</span>
                {project.challenge.rootCauses.map((rc, idx) => (
                  <div key={idx} className="text-[11px]">• {rc}</div>
                ))}
              </div>
            )}
          </section>

          {/* Section 4: Objective */}
          <section className="p-6 sm:p-8 rounded-3xl bg-cyan-950/10 border border-cyan-500/20 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4">
                <Target className="w-4 h-4" />
                <span>03 // ENGINEERING OBJECTIVES</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-4 font-sans">
                Core Design Targets
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {project.objective.primaryGoal}
              </p>

              <div className="space-y-2.5 mb-6">
                <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">PRIMARY DELIVERABLE GOALS</div>
                {project.objective.coreObjectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-cyan-200/90 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-cyan-500/10 space-y-1.5 text-xs font-mono text-slate-400">
              <span className="text-cyan-400 font-bold text-[10px] uppercase block">REGULATORY STANDARDS</span>
              <div className="flex flex-wrap gap-1.5">
                {project.objective.regulatoryCompliance.map((reg, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-300">
                    {reg}
                  </span>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* ========================================================================= */}
        {/* 5. SOLUTION ARCHITECTURE                                                 */}
        {/* ========================================================================= */}
        <section className="mb-16 sm:mb-24 p-6 sm:p-10 rounded-3xl bg-[#111216]/90 border border-white/15 shadow-2xl">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
            <Zap className="w-4 h-4" />
            <span>04 // THE ENGINEERED SOLUTION</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4 font-sans">
            {project.solution.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-4xl">
            {project.solution.description}
          </p>

          {/* Blueprint Stack Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono mb-8">
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
              <div className="text-slate-400 text-[10px] uppercase mb-1">FRONTEND RUNTIME</div>
              <div className="text-slate-100 font-bold leading-snug">{project.architecture.frontend}</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
              <div className="text-slate-400 text-[10px] uppercase mb-1">MICROSERVICES &amp; PROTOCOLS</div>
              <div className="text-slate-100 font-bold leading-snug">{project.architecture.services}</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
              <div className="text-slate-400 text-[10px] uppercase mb-1">DATABASE CORE &amp; CACHING</div>
              <div className="text-slate-100 font-bold leading-snug">{project.architecture.database}</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
              <div className="text-slate-400 text-[10px] uppercase mb-1">INFRASTRUCTURE MESH</div>
              <div className="text-slate-100 font-bold leading-snug">{project.architecture.infrastructure}</div>
            </div>

            <div className="col-span-1 md:col-span-2 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="text-emerald-400 text-[10px] uppercase mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>SECURITY &amp; COMPLIANCE POSTURE</span>
              </div>
              <div className="text-slate-200 font-bold leading-snug">{project.architecture.security}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
            <span className="text-emerald-400 font-bold uppercase mr-2">SYSTEM STRATEGY:</span>
            {project.solution.systemDesignStrategy}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. FEATURES DEEP-DIVE                                                    */}
        {/* ========================================================================= */}
        <section className="mb-16 sm:mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>05 // FUNCTIONAL CAPABILITIES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-sans">
                Core System Modules
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {project.features.length} Modular Enterprise Components
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.features.map((feat) => (
              <div
                key={feat.id}
                className="p-6 sm:p-8 rounded-3xl bg-[#111216]/90 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                      {feat.subtitle}
                    </span>
                    {feat.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400 uppercase">
                        {feat.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-3 font-sans">
                    {feat.title}
                  </h3>

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

        {/* ========================================================================= */}
        {/* 7. TECHNOLOGY & EXECUTION TOPOLOGY                                       */}
        {/* ========================================================================= */}
        <section className="mb-16 sm:mb-24 space-y-8">
          
          {/* Tech Stack Details Breakdown */}
          <div className="p-6 sm:p-10 rounded-3xl bg-[#111216]/90 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">
              <Cpu className="w-4 h-4" />
              <span>06 // PRODUCTION TECHNOLOGY SPECIFICATION</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-8 font-sans">
              Technology Stack Rationale
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {project.techStackDetails.map((tech, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs space-y-1.5">
                  <div className="text-[10px] text-purple-400 font-bold uppercase">{tech.category}</div>
                  <div className="text-sm font-bold text-white font-sans">{tech.stack}</div>
                  <div className="text-slate-400 text-[11px] leading-relaxed pt-1">{tech.role}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
              {project.technologies.map((t, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-slate-200">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Execution Topology Terminal */}
          <div className="rounded-3xl bg-black/90 border border-white/15 p-6 sm:p-8 font-mono shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>{project.slug}-execution-topology.pipeline</span>
              </div>
              <span className="text-emerald-400 text-[11px] font-bold">DETERMINISTIC FLOW</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.topologySteps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-emerald-400 font-bold">STEP {step.step} // {step.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      {step.status || 'VERIFIED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 8. VISUALS (DOMAIN-SPECIFIC INTERACTIVE VISUALIZER)                      */}
        {/* ========================================================================= */}
        <section className="mb-16 sm:mb-24">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>07 // SYSTEM ARCHITECTURE VISUALIZER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-sans">
              Domain Blueprint Telemetry
            </h2>
          </div>

          <WorkVisualizer project={project} />
        </section>

        {/* ========================================================================= */}
        {/* 9. RESULTS / IMPACT WHERE REAL DATA EXISTS                                */}
        {/* ========================================================================= */}
        <section className="mb-16 sm:mb-24 p-6 sm:p-10 rounded-3xl bg-[#111216]/90 border border-white/15 shadow-2xl">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
            <FileCheck2 className="w-4 h-4" />
            <span>08 // VERIFIED ARCHITECTURAL METRICS &amp; IMPACT</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3 font-sans">
            Measured Design Benchmarks
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed mb-8 max-w-3xl">
            Empirical benchmarks and architectural throughput specifications measured during comprehensive integration testing.
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-black/60 border border-white/10 font-mono">
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-1">{m.value}</div>
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">{m.label}</div>
                <div className="text-[11px] text-slate-400">{m.detail}</div>
              </div>
            ))}
          </div>

          {/* Verified Outcomes List */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 mb-6">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-3">
              MEASURED SYSTEM OUTCOMES
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
              {project.verifiedOutcomes.map((out, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{out}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real Metrics Disclosure Notice */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <Info className="w-4 h-4 shrink-0" />
            <span>{project.dataDisclosureNotice}</span>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. GALLERY (INTERACTIVE LIGHTBOX)                                       */}
        {/* ========================================================================= */}
        <WorkGallery items={project.gallery} projectTitle={project.title} />

        {/* Architectural Verdict */}
        <div className="mb-16 sm:mb-20 p-6 sm:p-8 rounded-3xl bg-black/60 border border-white/10 text-xs font-mono text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-1">
              ARCHITECTURAL VERDICT // SUMMARY
            </span>
            <p className="text-slate-300 text-sm">{project.verdict}</p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider text-xs font-mono shrink-0 transition-all shadow-lg"
          >
            <span>CONSULT ON THIS BLUEPRINT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 11. NEXT PROJECT (INTERACTIVE TRANSITION)                                */}
        {/* ========================================================================= */}
        <WorkNextProject nextProject={nextProject} />

      </div>
    </main>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowRight, 
  ArrowLeft,
  FolderGit2, 
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
  Lock
} from 'lucide-react';
import { WORK_PROJECTS, getWorkProject } from '@/config/work';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return WORK_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getWorkProject(slug);

  if (!project) {
    return {
      title: 'Project Not Found | OHO TECH',
    };
  }

  return {
    title: `${project.title} | Case Study | OHO TECH`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | OHO TECH Architecture Case Study`,
      description: project.summary,
    },
  };
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getWorkProject(slug);

  if (!project) {
    notFound();
  }

  const otherProjects = WORK_PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <main className="min-h-screen bg-[#07080c] text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Ambient background lighting */}
      <div 
        className="absolute top-10 right-10 w-96 sm:w-[600px] h-96 sm:h-[600px] rounded-full blur-[190px] pointer-events-none opacity-20"
        style={{ backgroundColor: project.accent }}
      />
      <div className="absolute bottom-20 left-10 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 sm:mb-12 font-mono text-xs text-slate-400 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-emerald-400 transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/work" className="hover:text-emerald-400 transition-colors">SELECTED WORK</Link>
          <span>/</span>
          <span className="text-emerald-400 font-bold truncate max-w-xs">{project.title}</span>
        </nav>

        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/work" 
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO ALL CASE STUDIES</span>
          </Link>
        </div>

        {/* Hero Section */}
        <header className="mb-14 sm:mb-20 pb-10 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>PROJECT // {project.number}</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
              {project.clientArchetype}
            </div>
          </div>

          <div className="text-xs sm:text-sm font-mono font-bold text-slate-400 tracking-[0.2em] uppercase mb-3">
            {project.category}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] uppercase mb-6">
            {project.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-4xl mb-8">
            {project.summary}
          </p>

          {/* Metrics Highlight Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#121318]/90 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mb-1">{m.value}</div>
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">{m.label}</div>
                <div className="text-[11px] font-mono text-slate-400">{m.detail}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Challenge & Solution 2-Column Section */}
        <section className="mb-16 sm:mb-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Challenge Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-rose-950/10 border border-rose-500/20">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-rose-400 uppercase tracking-wider mb-4">
              <AlertCircle className="w-4 h-4" />
              <span>THE OPERATIONAL PROBLEM</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-4">
              {project.challenge.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {project.challenge.description}
            </p>
            <div className="space-y-2.5">
              {project.challenge.frictionPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-rose-200/90 font-mono">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solution Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">
              <Zap className="w-4 h-4" />
              <span>THE ENGINEERED SOLUTION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-4">
              {project.solution.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {project.solution.description}
            </p>
            <div className="space-y-2.5">
              {project.solution.coreCapabilities.map((cap, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-emerald-200/90 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Architecture Blueprint Breakdown */}
        <section className="mb-16 sm:mb-20 p-6 sm:p-10 rounded-3xl bg-[#111216]/90 border border-white/15 shadow-2xl">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
            <Layers className="w-4 h-4" />
            <span>FULL ARCHITECTURAL STACK BLUEPRINT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-8">
            Modular Component Specifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-black/50 border border-white/10">
              <div className="text-slate-400 text-[10px] uppercase mb-1">FRONTEND RUNTIME</div>
              <div className="text-slate-100 font-bold leading-snug">{project.architecture.frontend}</div>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-white/10">
              <div className="text-slate-400 text-[10px] uppercase mb-1">MICROSERVICES &amp; PROTOCOLS</div>
              <div className="text-slate-100 font-bold leading-snug">{project.architecture.services}</div>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-white/10">
              <div className="text-slate-400 text-[10px] uppercase mb-1">DATABASE CORE &amp; CACHING</div>
              <div className="text-slate-100 font-bold leading-snug">{project.architecture.database}</div>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-white/10">
              <div className="text-slate-400 text-[10px] uppercase mb-1">INFRASTRUCTURE MESH</div>
              <div className="text-slate-100 font-bold leading-snug">{project.architecture.infrastructure}</div>
            </div>

            <div className="col-span-1 md:col-span-2 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="text-emerald-400 text-[10px] uppercase mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>SECURITY &amp; COMPLIANCE POSTURE</span>
              </div>
              <div className="text-slate-200 font-bold leading-snug">{project.architecture.security}</div>
            </div>
          </div>
        </section>

        {/* Execution Topology Terminal */}
        <section className="mb-16 sm:mb-20 rounded-3xl bg-black/80 border border-white/15 p-6 sm:p-8 font-mono shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>{project.slug}-topology-pipeline.spec</span>
            </div>
            <span className="text-emerald-400 text-[11px] font-bold">DETERMINISTIC FLOW</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.topologySteps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-2">
                  <span>STEP {step.step} //</span>
                  <span className="text-white">{step.title}</span>
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Deliverables & Tech Tags */}
        <section className="mb-16 sm:mb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#121318]/90 border border-white/10">
            <h3 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider mb-4">
              DELIVERED SYSTEM COMPONENTS
            </h3>
            <div className="space-y-3">
              {project.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-[#121318]/90 border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider mb-4">
                PRODUCTION TECHNOLOGY STACK
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((t, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-400">
              <span className="text-emerald-400 font-bold block mb-1">ARCHITECTURAL VERDICT</span>
              {project.verdict}
            </div>
          </div>
        </section>

        {/* Related Case Studies */}
        {otherProjects.length > 0 && (
          <section className="mb-16 sm:mb-20 pt-10 border-t border-white/10">
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-8">
              Explore More Case Studies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherProjects.map((p) => (
                <Link
                  key={p.slug}
                  href={`/work/${p.slug}`}
                  className="p-6 rounded-2xl bg-[#121318] border border-white/10 hover:border-emerald-500/40 transition-colors group block"
                >
                  <div className="font-mono text-[10px] text-slate-400 uppercase mb-1">
                    {p.category}
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                    {p.title}
                  </h4>
                  <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <span>View Case Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Strip */}
        <div className="rounded-3xl bg-[#14151a] border border-white/15 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-2">
              DEPLOYMENT ASSESSMENT
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Ready to engineer your custom architecture?
            </h3>
            <p className="text-sm text-slate-300 font-normal max-w-xl">
              Connect with OHO TECH leadership for a comprehensive review of your technical constraints and rollout plan.
            </p>
          </div>

          <Link
            href="/contact"
            className="w-full md:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl shrink-0 flex items-center justify-center gap-2"
          >
            <span>DISCUSS ARCHITECTURE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  );
}

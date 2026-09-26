import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Server, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Boxes, 
  Lock, 
  Workflow,
  HelpCircle,
  FolderGit2,
  ExternalLink
} from 'lucide-react';
import { services, coreServices, getServiceBySlug, Service } from '@/config/services';
import { WORK_PROJECTS, WorkProject } from '@/config/work';
import { DeliveryRoadmap } from '@/components/services/DeliveryRoadmap';
import { buildMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const allSlugs: string[] = [];
  services.forEach((service) => {
    allSlugs.push(service.slug);
    if (service.aliases && service.aliases.length > 0) {
      allSlugs.push(...service.aliases);
    }
  });
  return Array.from(new Set(allSlugs)).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  
  if (!service) {
    return { title: 'Service Not Found | OHO TECH' };
  }

  return buildMetadata({
    title: `${service.name} | Enterprise Engineering Services`,
    description: service.description,
    path: `/services/${service.slug}`,
    tags: service.features || [],
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Find verified case studies matching this service's related work slugs
  const relatedProjects: WorkProject[] = (service.relatedWorkSlugs || [])
    .map((s) => WORK_PROJECTS.find((p) => p.slug === s))
    .filter((p): p is WorkProject => Boolean(p))
    .slice(0, 3);

  // Other complementary services
  const otherServices = coreServices
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: service.name, url: `/services/${service.slug}` },
  ];

  return (
    <main className="min-h-screen bg-[#07080c] text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden font-sans">
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      
      {/* Ambient background glow matching accent */}
      <div 
        className="absolute top-10 right-10 w-96 sm:w-[600px] h-96 sm:h-[600px] rounded-full blur-[190px] pointer-events-none opacity-20"
        style={{ backgroundColor: service.accent }}
      />
      <div className="absolute bottom-20 left-10 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Grid Mesh */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 font-mono text-xs text-slate-400 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-emerald-400 transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-emerald-400 transition-colors">SERVICES</Link>
          <span>/</span>
          <span className="text-emerald-400 font-bold truncate max-w-xs">{service.name}</span>
        </nav>

        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO ALL SERVICES</span>
          </Link>
        </div>

        {/* ── 01. HERO SECTION ── */}
        <header className="mb-14 sm:mb-20 pb-12 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Boxes className="w-3.5 h-3.5" />
              <span>{service.badge} • {service.category.toUpperCase()}</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400">
              SPEC ID: {service.slug}
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.06] uppercase mb-4">
            {service.name}
          </h1>

          <p className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 mb-6">
            {service.headline}
          </p>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-4xl mb-8">
            {service.description}
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 mb-10">
            {service.specs.map((spec, sIdx) => (
              <div key={sIdx} className="p-5 rounded-2xl bg-[#111216]/90 border border-white/10">
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mb-1">{spec.value}</div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{spec.label}</div>
              </div>
            ))}
          </div>

          {/* Service Feature Banner Image */}
          {service.image && (
            <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden border border-white/10 mb-8 shadow-2xl">
              <Image
                src={service.image}
                alt={service.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-transparent to-transparent" />
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={`/contact?service=${service.slug}`}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>START A PROJECT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/products"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center"
            >
              <span>EXPLORE SOFTWARE</span>
            </Link>
          </div>
        </header>

        {/* ── 02. WHAT WE BUILD ── */}
        {service.whatWeBuild && service.whatWeBuild.length > 0 && (
          <section className="mb-16 sm:mb-24">
            <div className="mb-8">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-2">
                SYSTEM CATEGORIES &amp; SOLUTIONS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                What We Build in {service.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.whatWeBuild.map((block, bIdx) => (
                <div 
                  key={bIdx}
                  className="p-7 rounded-3xl bg-[#111216] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                      {block.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-6">
                      {block.description}
                    </p>
                    <div className="space-y-2 text-xs font-mono text-slate-300">
                      {block.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 03. CAPABILITIES SPECIFICATION ── */}
        {service.capabilities && service.capabilities.length > 0 && (
          <section className="mb-16 sm:mb-24 p-6 sm:p-10 rounded-3xl bg-[#111216]/90 border border-white/15 shadow-2xl">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>TECHNICAL CAPABILITY PROFILE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-8">
              Engineering Disciplines &amp; Standards
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {service.capabilities.map((cap, cIdx) => (
                <div key={cIdx} className="p-5 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{cap.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">{cap.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 04. DEVELOPMENT APPROACH & ROADMAP ── */}
        <section className="mb-16 sm:mb-24">
          <div className="mb-8">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest block mb-2">
              DELIVERY LIFECYCLE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              How We Engineer &amp; Deliver
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {(service.approach || [
              { step: '01', title: 'Discovery & Topology', description: 'Auditing constraints, defining schemas, and scoping requirements.' },
              { step: '02', title: 'Design & Prototype', description: 'Crafting UI design systems, wireframes, and clickable prototypes.' },
              { step: '03', title: 'Agile Engineering', description: 'Deterministic coding, automated unit testing, and continuous code reviews.' },
              { step: '04', title: 'Launch & IP Transfer', description: 'Production deployment with zero downtime, telemetry, and full code handover.' },
            ]).map((step, sIdx) => (
              <div key={sIdx} className="p-6 rounded-2xl bg-[#111216] border border-white/10">
                <div className="font-mono text-2xl font-black text-emerald-400 mb-2">
                  {step.step}
                </div>
                <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 05. TECHNOLOGY STACK ── */}
        {service.technologies && service.technologies.length > 0 && (
          <section className="mb-16 sm:mb-24 rounded-3xl bg-black/80 border border-white/15 p-6 sm:p-8 font-mono shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>{service.slug}-stack-manifest.json</span>
              </div>
              <span className="text-emerald-400 text-[11px] font-bold uppercase">PRODUCTION TECHNOLOGIES</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {service.technologies.map((tech, tIdx) => (
                <span 
                  key={tIdx} 
                  className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── 06. RELATED WORK / CASE STUDIES ── */}
        {relatedProjects.length > 0 && (
          <section className="mb-16 sm:mb-24 pt-10 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block mb-1">
                  PROVEN PRODUCTION RESULTS
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  Related Enterprise Work
                </h3>
              </div>
              <Link
                href="/work"
                className="text-xs font-mono font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1.5"
              >
                <span>View All Case Studies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className="rounded-3xl bg-[#111216] border border-white/10 hover:border-sky-500/50 p-6 flex flex-col justify-between group transition-all duration-300"
                >
                  <div>
                    {project.heroImage && (
                      <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-4 border border-white/10">
                        <Image
                          src={project.heroImage}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="font-mono text-[10px] text-sky-400 uppercase mb-1 font-bold">{project.category}</div>
                    <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors mb-2">
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 font-normal">
                      {project.summary}
                    </p>
                  </div>
                  <div className="text-xs font-mono text-sky-400 flex items-center gap-1 pt-3 border-t border-white/5">
                    <span>Inspect Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── 07. FAQ WHERE USEFUL ── */}
        {service.faqs && service.faqs.length > 0 && (
          <section className="mb-16 sm:mb-24 pt-10 border-t border-white/10">
            <div className="mb-8">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-2">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Common Questions About {service.name}
              </h3>
            </div>

            <div className="space-y-4">
              {service.faqs.map((faq, fIdx) => (
                <div 
                  key={fIdx}
                  className="p-6 rounded-2xl bg-[#111216] border border-white/10"
                >
                  <h4 className="text-base font-bold text-white mb-2 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 08. FINAL CTA ── */}
        <div className="rounded-3xl bg-[#14151a] border border-white/15 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-2">
              INITIATE SPECIFICATION REVIEW
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Ready to engineer your {service.name}?
            </h3>
            <p className="text-sm text-slate-300 font-normal max-w-xl">
              Connect directly with our engineering team to review system requirements, SLAs, and rollout timelines. 100% full source code transfer upon completion.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              href={`/contact?service=${service.slug}`}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <span>START A PROJECT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center"
            >
              <span>EXPLORE SOFTWARE</span>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

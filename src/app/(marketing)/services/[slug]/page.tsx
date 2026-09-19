import { notFound } from 'next/navigation';
import Link from 'next/link';
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
  Workflow 
} from 'lucide-react';
import { services, Service } from '@/config/services';
import { DeliveryRoadmap } from '@/components/services/DeliveryRoadmap';
import { buildMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  
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
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const isTech = service.category === 'technology';
  const relatedServices = services.filter((s) => s.slug !== service.slug && s.category === service.category).slice(0, 2);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Core Services', url: '/services' },
    { name: service.name, url: `/services/${service.slug}` },
  ];

  return (
    <main className="min-h-screen bg-[#07080c] text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden font-sans">
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      {/* Ambient background glow */}
      <div className="absolute top-10 right-10 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-emerald-500/5 rounded-full blur-[190px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Grid Mesh */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs text-slate-400 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-emerald-400 transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-emerald-400 transition-colors">CORE SERVICES</Link>
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

        {/* Hero Section Header */}
        <header className="mb-14 sm:mb-20 pb-10 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Boxes className="w-3.5 h-3.5" />
              <span>CAPABILITY SPECIFICATION • {service.category.toUpperCase()}</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
              SLUG: {service.slug}
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] uppercase mb-6">
            {service.name}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-4xl mb-8">
            {service.description}
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-[#111216]/90 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Code Ownership</div>
              <div className="text-[11px] font-mono text-slate-400">Zero vendor lock-in with full IP transfer</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111216]/90 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">&lt; 15ms</div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Execution Target</div>
              <div className="text-[11px] font-mono text-slate-400">Deterministic high-throughput runtimes</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111216]/90 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">99.99%</div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Availability SLA</div>
              <div className="text-[11px] font-mono text-slate-400">Containerized auto-healing clusters</div>
            </div>
          </div>
        </header>

        {/* Key Features & Deliverables Breakdown */}
        {service.features && service.features.length > 0 && (
          <section className="mb-16 sm:mb-20 p-6 sm:p-10 rounded-3xl bg-[#111216]/90 border border-white/15 shadow-2xl">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" />
              <span>CORE DELIVERABLES &amp; SCOPE SPECIFICATIONS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-8">
              What Is Included In This Engineering Vertical
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.features.map((feature, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-white mb-0.5">{feature}</div>
                    <div className="text-xs text-slate-400 font-mono">Production tested &amp; SLA compliant</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Architecture Topology Blueprint */}
        <section className="mb-16 sm:mb-20 rounded-3xl bg-black/80 border border-white/15 p-6 sm:p-8 font-mono shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>{service.slug}-architecture-spec.json</span>
            </div>
            <span className="text-emerald-400 text-[11px] font-bold">SOVEREIGN ARCHITECTURE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400 text-[10px] block mb-1">CLIENT RUNTIME</span>
              <span className="text-slate-100 font-bold">Next.js 16 • React 19 • Native Mobile</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400 text-[10px] block mb-1">SERVICE LAYER</span>
              <span className="text-slate-100 font-bold">Go Microservices • gRPC Bus</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400 text-[10px] block mb-1">PERSISTENCE CORE</span>
              <span className="text-slate-100 font-bold">PostgreSQL • Redis Cluster</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400 text-[10px] block mb-1">GOVERNANCE</span>
              <span className="text-slate-100 font-bold">Mutual mTLS • KMS Key Vault</span>
            </div>
          </div>
        </section>

        {/* Delivery Methodology Roadmap */}
        <DeliveryRoadmap />

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="mb-16 pt-10 border-t border-white/10">
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-6">
              Explore Complementary Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedServices.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/services/${rel.slug}`}
                  className="p-6 rounded-2xl bg-[#111216] border border-white/10 hover:border-emerald-500/40 transition-colors group block"
                >
                  <div className="font-mono text-[10px] text-emerald-400 uppercase mb-1">{rel.category}</div>
                  <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 font-normal">
                    {rel.description}
                  </p>
                  <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Technical Architecture CTA */}
        <div className="rounded-3xl bg-[#14151a] border border-white/15 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-2">
              INITIATE SPECIFICATION REVIEW
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Ready to engineer your {service.name}?
            </h3>
            <p className="text-sm text-slate-300 font-normal max-w-xl">
              Connect directly with our engineering team to review system requirements, SLAs, and rollout timelines.
            </p>
          </div>

          <Link
            href={`/contact?service=${service.slug}`}
            className="w-full md:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl shrink-0 flex items-center justify-center gap-2"
          >
            <span>DISCUSS PROJECT REQUIREMENTS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  );
}

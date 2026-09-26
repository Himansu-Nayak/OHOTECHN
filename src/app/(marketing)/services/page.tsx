import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Boxes, 
  CheckCircle2, 
  Server, 
  Cpu, 
  Layers, 
  Smartphone, 
  Database, 
  Palette, 
  Globe, 
  ShieldCheck, 
  Activity, 
  Zap,
  FolderGit2,
  Lock,
  Code2
} from 'lucide-react';
import { coreServices, marketingServices, Service } from '@/config/services';
import { DeliveryRoadmap } from '@/components/services/DeliveryRoadmap';
import { buildMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Bespoke Software Engineering & Digital Services | OHO TECH',
  description: 'Explore OHO TECH\'s full spectrum of custom software development, high-performance web applications, native iOS/Android mobile apps, spatial UI/UX design, enterprise AI, and cloud DevOps.',
  path: '/services',
});

// Verified real enterprise case studies showcasing custom engineering outcomes
const SHOWCASE_WORK = [
  {
    title: 'Hospital EMR & Clinical Platform',
    domain: 'HEALTHCARE & INFORMATICS',
    desc: 'Integrated clinical operating system unifying patient records, bed allocation grids, and pharmacy billing.',
    slug: 'healthcare-emr',
    image: '/images/work/3d-healthcare-emr.jpg',
    stack: 'Next.js 16 • Go Microservices • PostgreSQL Core',
  },
  {
    title: 'High-Throughput Retail POS & Inventory Sync',
    domain: 'RETAIL & OMNICHANNEL',
    desc: 'Offline-first counter billing engine with real-time depot synchronization and automated GST ledgers.',
    slug: 'retail-pos',
    image: '/images/work/3d-retail-pos.jpg',
    stack: 'Kotlin Native • SQLite Edge • Central PostgreSQL',
  },
  {
    title: 'Multi-Campus University ERP & Student Portal',
    domain: 'EDUCATION CONTINUUM',
    desc: 'Multi-campus institutional system unifying student records, proctored digital testing, and automated fees.',
    slug: 'education-erp',
    image: '/images/work/3d-education-erp.jpg',
    stack: 'React 19 • Node.js Microservices • Redis Cache',
  },
];

export default function ServicesPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
  ];

  return (
    <main className="min-h-screen bg-[#07080c] text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden font-sans">
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/4 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-emerald-500/5 rounded-full blur-[190px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-cyan-500/5 rounded-full blur-[190px] pointer-events-none" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 sm:mb-10 font-mono text-xs text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-400 transition-colors">HOME</Link>
          <span>/</span>
          <span className="text-emerald-400 font-bold">DIGITAL ENGINEERING SERVICES</span>
        </nav>

        {/* ── 01. HERO SECTION ── */}
        <header className="mb-16 sm:mb-24 pb-12 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-6">
            <Boxes className="w-3.5 h-3.5" />
            <span>BESPOKE ENGINEERING // 7 CORE VERTICALS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.04] uppercase mb-6">
            <span>What Can OHO TECH Build</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              For Your Business?
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
            We architect and engineer bespoke digital platforms, native Android/iOS mobile ecosystems, high-concurrency cloud backends, and practical AI automations. 100% code ownership with zero proprietary lock-in.
          </p>

          {/* Key Metric Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-[#111216]/90 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</div>
              <div className="text-xs font-bold text-white uppercase mt-0.5">Code Ownership</div>
              <div className="text-[10px] font-mono text-slate-400">Full IP &amp; Source Transfer</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#111216]/90 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">Native</div>
              <div className="text-xs font-bold text-white uppercase mt-0.5">iOS &amp; Android</div>
              <div className="text-[10px] font-mono text-slate-400">120 FPS Fluid Runtimes</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#111216]/90 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">99.99%</div>
              <div className="text-xs font-bold text-white uppercase mt-0.5">Availability SLA</div>
              <div className="text-[10px] font-mono text-slate-400">Containerized Auto-Healing</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#111216]/90 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">Zero</div>
              <div className="text-xs font-bold text-white uppercase mt-0.5">Vendor Lock-In</div>
              <div className="text-[10px] font-mono text-slate-400">Standard Open Foundations</div>
            </div>
          </div>
        </header>

        {/* ── 02. CORE SERVICES SECTION ── */}
        <section className="mb-20 sm:mb-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                CORE CAPABILITIES // PRODUCTION DOMAINS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                7 Core Engineering Verticals
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              7 Dedicated Engineering Disciplines
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreServices.map((service, idx) => (
              <article
                key={service.slug}
                className="rounded-3xl bg-[#111216]/90 border border-white/10 hover:border-emerald-500/40 p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
              >
                {/* Ambient Glow */}
                <div 
                  className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: service.accent }}
                />

                <div>
                  {/* Card Top Metadata */}
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10 mb-5 font-mono text-xs">
                    <span className="text-emerald-400 font-bold">
                      0{idx + 1} // {service.badge}
                    </span>
                    <span className="text-slate-400 text-[10px] uppercase">
                      SLA READY
                    </span>
                  </div>

                  {/* Service Visual Preview */}
                  {service.image && (
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-5 border border-white/10">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-transparent" />
                    </div>
                  )}

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-3 group-hover:text-emerald-300 transition-colors">
                    <Link href={`/services/${service.slug}`}>
                      {service.name}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Capabilities List */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2 mb-6 text-xs font-mono text-slate-300">
                      {service.features.slice(0, 3).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Specs Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/40 border border-white/5 font-mono mb-6 text-center">
                    {service.specs.map((spec, sIdx) => (
                      <div key={sIdx}>
                        <div className="text-xs font-bold text-white truncate">{spec.value}</div>
                        <div className="text-[9px] text-slate-400 uppercase truncate mt-0.5">{spec.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/contact?service=${service.slug}`}
                    className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
                  >
                    Start a Project
                  </Link>

                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 03. HOW WE BUILD (DELIVERY ROADMAP) ── */}
        <section className="mb-20 sm:mb-28">
          <DeliveryRoadmap />
        </section>

        {/* ── 04. TECHNOLOGY STACK OVERVIEW ── */}
        <section className="mb-20 sm:mb-28 p-8 sm:p-12 rounded-3xl bg-[#111216] border border-white/10 shadow-2xl">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">
              FOUNDATIONAL ARCHITECTURE
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase mb-4">
              We Use Technology to Solve Business Problems
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Every system is engineered on production-tested open-source foundations, ensuring exceptional concurrency, enterprise security compliance, and effortless long-term maintainability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
              <div className="text-emerald-400 font-bold uppercase text-[11px] mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Frontend &amp; Web
              </div>
              <p className="text-slate-300 leading-relaxed">
                React 19, Next.js 16 App Router, TypeScript, Tailwind CSS v4, and Edge Caching.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
              <div className="text-sky-400 font-bold uppercase text-[11px] mb-2 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> Mobile Ecosystems
              </div>
              <p className="text-slate-300 leading-relaxed">
                Native Kotlin (Android), Swift &amp; SwiftUI (iOS), and Offline SQLite Sync.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
              <div className="text-amber-400 font-bold uppercase text-[11px] mb-2 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" /> Backend &amp; Microservices
              </div>
              <p className="text-slate-300 leading-relaxed">
                Java 21, Spring Boot 4, Node.js, RESTful &amp; gRPC APIs, and WebSockets.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
              <div className="text-purple-400 font-bold uppercase text-[11px] mb-2 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" /> Data &amp; Cloud Mesh
              </div>
              <p className="text-slate-300 leading-relaxed">
                PostgreSQL, Redis, Docker, GitHub Actions CI/CD, and Multi-Region Topologies.
              </p>
            </div>
          </div>
        </section>

        {/* ── 05. SELECTED WORK / CASE STUDIES ── */}
        <section className="mb-20 sm:mb-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block mb-1">
                VERIFIED OUTCOMES // CASE STUDIES
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                Proven Engineering in Production
              </h2>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 font-mono text-xs text-sky-400 hover:text-sky-300 font-bold uppercase tracking-wider"
            >
              <span>View All 5 Case Studies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SHOWCASE_WORK.map((work, idx) => (
              <Link
                key={idx}
                href={`/work/${work.slug}`}
                className="rounded-3xl bg-[#111216] border border-white/10 hover:border-sky-500/50 p-6 flex flex-col justify-between group transition-all duration-300"
              >
                <div>
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-5 border border-white/10">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-transparent" />
                  </div>
                  <div className="font-mono text-[10px] text-sky-400 uppercase tracking-wider mb-2 font-bold">
                    {work.domain}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {work.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal mb-4">
                    {work.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono font-bold text-sky-400">
                  <span className="text-[10px] text-slate-500 truncate max-w-[180px]">{work.stack}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span>Inspect Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 06. FINAL DUAL CTA ── */}
        <section className="rounded-3xl bg-[#14151a] border border-white/15 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-2">
              INITIATE TECHNICAL SPECIFICATION
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Ready to engineer your custom software?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 font-normal max-w-xl">
              Partner with OHO TECH to architect, develop, and deploy software tailored to your company workflows. 100% source code ownership guaranteed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0">
            <Link
              href="/contact"
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
        </section>

      </div>
    </main>
  );
}

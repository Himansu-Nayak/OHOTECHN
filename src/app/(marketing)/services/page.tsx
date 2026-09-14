import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Boxes, 
  Sparkles, 
  CheckCircle2, 
  Server, 
  Cpu, 
  Layers, 
  Smartphone, 
  Database, 
  Palette, 
  Globe, 
  Workflow, 
  ShieldCheck, 
  Activity, 
  TrendingUp,
  Search,
  MessageCircle,
  Terminal,
  Zap
} from 'lucide-react';
import { services, technologyServices, marketingServices, Service } from '@/config/services';
import { DeliveryRoadmap } from '@/components/services/DeliveryRoadmap';

export const metadata: Metadata = {
  title: 'Core Engineering & Digital Services | OHO TECH',
  description: 'Explore OHO TECH\'s full spectrum of software development, distributed cloud infrastructure, enterprise ERP/EMR systems, AI neural pipelines, and spatial UI/UX design.',
  openGraph: {
    title: 'Core Engineering & Digital Services | OHO TECH',
    description: 'Explore OHO TECH\'s full spectrum of software development, distributed cloud infrastructure, enterprise ERP/EMR systems, AI neural pipelines, and spatial UI/UX design.',
  },
};

// Map each service to specific architectural specifications
const SERVICE_SPECS: Record<string, { specs: { label: string; value: string }[]; highlightTag: string; accent: string }> = {
  'software-development': {
    specs: [{ label: 'CONCURRENCY', value: '500K+ RPS' }, { label: 'ISOLATION', value: 'mTLS Zero-Trust' }, { label: 'SLA', value: '99.99%' }],
    highlightTag: 'MICROSERVICES & APIS',
    accent: '#10b981',
  },
  'web-development': {
    specs: [{ label: 'PERFORMANCE', value: '100 / 100' }, { label: 'FCP TIME', value: '< 0.4s' }, { label: 'EDGE CACHE', value: '98.2% Hit' }],
    highlightTag: 'NEXT.JS 16 & REACT 19',
    accent: '#06b6d4',
  },
  'cloud-infrastructure': {
    specs: [{ label: 'UPTIME SLA', value: '99.999%' }, { label: 'GLOBAL LATENCY', value: '< 12ms' }, { label: 'EDGE POPS', value: '300+' }],
    highlightTag: 'MULTI-REGION MESH',
    accent: '#3b82f6',
  },
  'ai-ml-solutions': {
    specs: [{ label: 'INFERENCE', value: '< 40ms TTFT' }, { label: 'CONTEXT', value: '128K Tokens' }, { label: 'ACCURACY', value: '99.4%' }],
    highlightTag: 'TENSOR & VECTOR DB',
    accent: '#8b5cf6',
  },
  'erp-systems': {
    specs: [{ label: 'AUDIT POSTURE', value: '100% ACID' }, { label: 'FAILOVER', value: '< 1 Sec' }, { label: 'TENANTS', value: 'Multi-Branch' }],
    highlightTag: 'DOUBLE-ENTRY & SYNC',
    accent: '#f59e0b',
  },
  'ui-ux-design': {
    specs: [{ label: 'ACCESSIBILITY', value: 'WCAG AAA' }, { label: 'SYSTEM TOKENS', value: '800+' }, { label: 'USABILITY', value: '98.8/100' }],
    highlightTag: 'SPATIAL & DESIGN SYSTEMS',
    accent: '#ec4899',
  },
  'mobile-apps': {
    specs: [{ label: 'FRAME RATE', value: '120 FPS Fluid' }, { label: 'OFFLINE MODE', value: 'Active WAL' }, { label: 'CRASH-FREE', value: '99.98%' }],
    highlightTag: 'SWIFT & KOTLIN NATIVE',
    accent: '#10b981',
  },
  'api-integration': {
    specs: [{ label: 'RESPONSE', value: '< 15ms' }, { label: 'PROTOCOLS', value: 'gRPC / REST' }, { label: 'ENCRYPTION', value: 'AES-256' }],
    highlightTag: 'GATEWAY & PROTOCOLS',
    accent: '#06b6d4',
  },
  'seo': {
    specs: [{ label: 'CORE VITALS', value: '100% Pass' }, { label: 'INDEXING', value: 'Real-Time' }, { label: 'AUDIT', value: 'Technical SEO' }],
    highlightTag: 'SEARCH INTELLIGENCE',
    accent: '#10b981',
  },
  'google-ads': {
    specs: [{ label: 'ROAS TARGET', value: '3.8x - 6.5x' }, { label: 'TRACKING', value: 'Server CAPI' }, { label: 'RETARGETING', value: 'Real-Time' }],
    highlightTag: 'PERFORMANCE PPC',
    accent: '#f59e0b',
  },
  'branding-graphic-design': {
    specs: [{ label: 'DESIGN TOKENS', value: 'Semantic' }, { label: 'VECTOR ASSETS', value: 'Infinite SVG' }, { label: 'GUIDELINES', value: 'Full Brand Book' }],
    highlightTag: 'BRAND IDENTITY',
    accent: '#ec4899',
  },
  'whatsapp-marketing': {
    specs: [{ label: 'DELIVERABILITY', value: '99.8%' }, { label: 'LATENCY', value: '< 200ms' }, { label: 'INTEGRATION', value: 'Official API' }],
    highlightTag: 'AUTOMATION & APIS',
    accent: '#10b981',
  },
};

export default function ServicesPage() {
  const coreTech = services.filter((s) => s.category === 'technology');
  const digitalGrowth = services.filter((s) => s.category === 'marketing');

  return (
    <main className="min-h-screen bg-[#07080c] text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden font-sans">
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
          <span className="text-emerald-400 font-bold">CORE SERVICES</span>
        </nav>

        {/* Page Hero Header */}
        <header className="mb-16 sm:mb-24 pb-12 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-6">
            <Boxes className="w-3.5 h-3.5" />
            <span>CAPABILITY ECOSYSTEM // 15 PRODUCTION VERTICALS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.04] uppercase mb-6">
            <span>Engineering &amp; Digital</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Systems for Modern Scale.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
            From bespoke software architecture, distributed cloud backends, and offline-first retail engines to custom LLM neural inference and spatial UI/UX systems.
          </p>

          {/* Key Metric Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-[#111216]/90 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</div>
              <div className="text-xs font-bold text-white uppercase mt-0.5">Code Ownership</div>
              <div className="text-[10px] font-mono text-slate-400">Zero Proprietary Lock-In</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#111216]/90 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">&lt; 15ms</div>
              <div className="text-xs font-bold text-white uppercase mt-0.5">Service Latency</div>
              <div className="text-[10px] font-mono text-slate-400">Deterministic Runtimes</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#111216]/90 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">99.999%</div>
              <div className="text-xs font-bold text-white uppercase mt-0.5">Cloud Uptime SLA</div>
              <div className="text-[10px] font-mono text-slate-400">Multi-Region Topologies</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#111216]/90 border border-white/10">
              <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">120 FPS</div>
              <div className="text-xs font-bold text-white uppercase mt-0.5">Fluid UI Runtimes</div>
              <div className="text-[10px] font-mono text-slate-400">WCAG AAA Accessibility</div>
            </div>
          </div>
        </header>

        {/* ── SECTION 01: CORE TECHNOLOGY & SOFTWARE SERVICES ── */}
        <section className="mb-20 sm:mb-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                VERTICAL 01 // CORE COMPUTING &amp; SYSTEMS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                Software &amp; Infrastructure Engineering
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {coreTech.length} Production Architectures
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreTech.map((service, idx) => {
              const specData = SERVICE_SPECS[service.slug] || {
                specs: [{ label: 'ARCHITECTURE', value: 'Microservices' }, { label: 'PROTOCOL', value: 'REST / gRPC' }, { label: 'SLA', value: 'Enterprise' }],
                highlightTag: 'CUSTOM ARCHITECTURE',
                accent: '#10b981'
              };

              return (
                <article
                  key={service.slug}
                  className="rounded-3xl bg-[#111216]/90 border border-white/10 hover:border-emerald-500/40 p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
                >
                  {/* Ambient Glow */}
                  <div 
                    className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: specData.accent }}
                  />

                  <div>
                    {/* Card Top Metadata */}
                    <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10 mb-5 font-mono text-xs">
                      <span className="text-emerald-400 font-bold">
                        0{idx + 1} // {specData.highlightTag}
                      </span>
                      <span className="text-slate-400 text-[10px] uppercase">
                        SLA READY
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-3 group-hover:text-emerald-300 transition-colors">
                      <Link href={`/services/${service.slug}`}>
                        {service.name}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Features list */}
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
                      {specData.specs.map((spec, sIdx) => (
                        <div key={sIdx}>
                          <div className="text-xs font-bold text-white truncate">{spec.value}</div>
                          <div className="text-[9px] text-slate-400 uppercase truncate mt-0.5">{spec.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      View Architecture
                    </span>

                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 02: DIGITAL GROWTH & BRAND SYSTEMS ── */}
        <section className="mb-20 sm:mb-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                VERTICAL 02 // PERFORMANCE MARKETING &amp; SPATIAL DESIGN
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                Digital Growth &amp; User Experience
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {digitalGrowth.length} Strategic Capabilities
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {digitalGrowth.map((service, idx) => {
              const specData = SERVICE_SPECS[service.slug] || {
                specs: [{ label: 'CONVERSION', value: 'High ROAS' }, { label: 'INTELLIGENCE', value: 'Data-Driven' }, { label: 'EXECUTION', value: 'Full-Funnel' }],
                highlightTag: 'PERFORMANCE ENGINE',
                accent: '#f59e0b'
              };

              return (
                <article
                  key={service.slug}
                  className="rounded-3xl bg-[#111216]/90 border border-white/10 hover:border-amber-500/40 p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
                >
                  {/* Ambient Glow */}
                  <div 
                    className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: specData.accent }}
                  />

                  <div>
                    {/* Card Top Metadata */}
                    <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10 mb-5 font-mono text-xs">
                      <span className="text-amber-400 font-bold">
                        0{idx + 1} // {specData.highlightTag}
                      </span>
                      <span className="text-slate-400 text-[10px] uppercase">
                        DATA-DRIVEN
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-3 group-hover:text-amber-300 transition-colors">
                      <Link href={`/services/${service.slug}`}>
                        {service.name}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Features list */}
                    {service.features && service.features.length > 0 && (
                      <div className="space-y-2 mb-6 text-xs font-mono text-slate-300">
                        {service.features.slice(0, 3).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/40 border border-white/5 font-mono mb-6 text-center">
                      {specData.specs.map((spec, sIdx) => (
                        <div key={sIdx}>
                          <div className="text-xs font-bold text-white truncate">{spec.value}</div>
                          <div className="text-[9px] text-slate-400 uppercase truncate mt-0.5">{spec.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      View Strategy
                    </span>

                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 03: DELIVERY METHODOLOGY ROADMAP ── */}
        <DeliveryRoadmap />

        {/* ── SECTION 04: ARCHITECTURE CONSULTATION CTA ── */}
        <section className="rounded-3xl bg-[#14151a] border border-white/15 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-2">
              TECHNICAL SCOPE &amp; ESTIMATION
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Ready to engineer your custom software?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 font-normal max-w-xl">
              Schedule a technical session directly with OHO TECH system architects to evaluate latency constraints, database partitioning, and rollout schedules.
            </p>
          </div>

          <Link
            href="/contact"
            className="w-full md:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl shrink-0 flex items-center justify-center gap-2"
          >
            <span>SCHEDULE ARCHITECTURE TALK</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

      </div>
    </main>
  );
}

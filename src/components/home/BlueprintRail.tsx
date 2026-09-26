'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Activity, 
  Smartphone, 
  Server, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUpRight,
  Code2
} from 'lucide-react';

interface Blueprint {
  id: string;
  number: string;
  badge: string;
  title: string;
  architecture: string;
  techStack: string[];
  metrics: string;
  link: string;
}

const BLUEPRINTS: Blueprint[] = [
  {
    id: 'bp-1',
    number: '01',
    badge: 'CORE FINANCIALS',
    title: 'DISTRIBUTED TRANSACTIONAL LEDGER',
    architecture: 'Double-entry immutable ledger engine with ACID transactional idempotency and cryptographically chained audit trails.',
    techStack: ['Spring Boot 4', 'PostgreSQL', 'HikariCP', 'Redis'],
    metrics: '10,000+ TX/SEC • 0.38MS LATENCY',
    link: '/services/erp-solutions'
  },
  {
    id: 'bp-2',
    number: '02',
    badge: 'SECURITY & RBAC',
    title: 'ZERO-TRUST ENTERPRISE IDENTITY',
    architecture: 'Cryptographically signed JWT with hierarchical role permissions, session revocation, and fine-grained resource claims.',
    techStack: ['Spring Security', 'OAuth2', 'JWT RS256', 'BCrypt'],
    metrics: 'ISO 27001 & SOC2 COMPLIANT',
    link: '/technology'
  },
  {
    id: 'bp-3',
    number: '03',
    badge: 'HEALTHCARE EMR',
    title: 'MULTI-TENANT CLINICAL ISOLATION',
    architecture: 'Database tenant isolation with row-level security policies protecting electronic patient health records.',
    techStack: ['PostgreSQL RLS', 'AES-256', 'DICOM Proxy', 'HL7/FHIR'],
    metrics: '100% HIPAA COMPLIANT TENANCY',
    link: '/services/healthcare-software'
  },
  {
    id: 'bp-4',
    number: '04',
    badge: 'TELEMETRY MESH',
    title: 'REAL-TIME DUPLEX WEBSOCKETS',
    architecture: 'High-throughput event pub/sub broker distributing live vitals, notifications, and telemetry to web and mobile clients.',
    techStack: ['WebSocket STOMP', 'Redis Pub/Sub', 'Next.js 16', 'RxJS'],
    metrics: '50K CONCURRENT CHANNELS',
    link: '/technology'
  },
  {
    id: 'bp-5',
    number: '05',
    badge: 'FIELD MOBILITY',
    title: 'OFFLINE-FIRST MOBILE SYNC',
    architecture: 'Local SQLite WAL database with differential sync reconciliation, enabling continuous operation in zero-connectivity environments.',
    techStack: ['React Native', 'SQLite WAL', 'Background Fetch', 'CRDT'],
    metrics: 'ZERO DATA LOSS OFFLINE',
    link: '/services/mobile-app-development'
  },
  {
    id: 'bp-6',
    number: '06',
    badge: 'DEVOPS RUNTIME',
    title: 'CONTAINERIZED CLOUD CI/CD',
    architecture: 'Zero-downtime blue/green deployment orchestration with health probing, automated rollbacks, and systemd monitoring.',
    techStack: ['Docker', 'Nginx 1.28', 'Systemd', 'GitHub Actions'],
    metrics: '3-MIN DEPLOYMENT CYCLE',
    link: '/technology'
  }
];

export function BlueprintRail() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  React.useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 380;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative py-24 sm:py-32 bg-[#090a0d] border-t border-white/10 overflow-hidden">
      
      {/* Background radial accent */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[350px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Navigation Arrows (Ploy-inspired pattern) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-mono text-[11px] font-bold uppercase tracking-widest mb-4">
              <Code2 className="w-3.5 h-3.5" />
              <span>CORE ARCHITECTURAL BLUEPRINTS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-[0.95]">
              ENTERPRISE PATTERNS, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                PROVEN IN PRODUCTION.
              </span>
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
                canScrollLeft 
                  ? 'border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-emerald-500/50' 
                  : 'border-white/5 bg-transparent text-slate-600 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
                canScrollRight 
                  ? 'border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-emerald-500/50' 
                  : 'border-white/5 bg-transparent text-slate-600 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Carousel (Ploy-inspired rail) */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {BLUEPRINTS.map((bp) => (
            <div
              key={bp.id}
              className="w-[320px] sm:w-[380px] shrink-0 p-6 sm:p-7 rounded-2xl bg-[#0f1116] border border-white/10 hover:border-emerald-500/50 hover:bg-[#13161c] transition-all duration-300 group flex flex-col justify-between snap-start"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {bp.number} // BLUEPRINT
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/25 font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {bp.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white mb-3 group-hover:text-emerald-300 transition-colors">
                  {bp.title}
                </h3>

                {/* Architecture Description */}
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {bp.architecture}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {bp.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-emerald-400 tracking-wider">
                  {bp.metrics}
                </span>

                <Link
                  href={bp.link}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

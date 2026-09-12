'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Globe, 
  Smartphone, 
  Building2, 
  Cloud, 
  Layers, 
  ArrowRight, 
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface Capability {
  id: string;
  title: string;
  badge: string;
  desc: string;
  icon: React.ElementType;
  tech: string[];
  link: string;
  visualTitle: string;
  visualMetrics: { label: string; val: string }[];
  visualHighlights: string[];
}

const capabilities: Capability[] = [
  {
    id: 'software-products',
    title: 'Software Products & Turnkey Platforms',
    badge: 'TURNKEY SOLUTIONS',
    desc: 'Ready-to-deploy, white-label enterprise products including SchoolCloud ERP, HealthOS Hospital Management, FinCore NBFC, and Omnichannel RetailPOS.',
    icon: Building2,
    tech: ['Next.js 16', 'Spring Boot', 'PostgreSQL', 'Multi-Tenant Architecture'],
    link: '/products',
    visualTitle: 'Modular Platform Engine',
    visualMetrics: [
      { label: 'Deployment Time', val: '< 24 Hours' },
      { label: 'Role Permissions', val: 'Granular RBAC' },
      { label: 'Data Encryption', val: 'AES-256 GCM' }
    ],
    visualHighlights: [
      'Automated multi-tenant tenant isolation',
      'Plug-and-play GST billing and invoicing modules',
      'Real-time automated audit logging & daily backups'
    ]
  },
  {
    id: 'ai-automation',
    title: 'AI Solutions & Process Automation',
    badge: 'INTELLIGENT SYSTEMS',
    desc: 'Bespoke automation pipelines, LLM-powered enterprise assistants, intelligent document processing, and robotic process automation (RPA).',
    icon: Cpu,
    tech: ['Python FastAPI', 'OpenAI APIs', 'LangChain', 'Automated Webhooks'],
    link: '/services/custom-software-development',
    visualTitle: 'Automated Intelligence Graph',
    visualMetrics: [
      { label: 'Task Execution', val: 'Sub-Second' },
      { label: 'Extraction Precision', val: 'Deterministic' },
      { label: 'Human-in-the-Loop', val: 'Configurable' }
    ],
    visualHighlights: [
      'Automated invoice data extraction & categorization',
      'Intelligent customer lead scoring & WhatsApp bots',
      'Continuous cron-based automated workflow triggers'
    ]
  },
  {
    id: 'web-platforms',
    title: 'High-Performance Web Platforms',
    badge: 'WEB ENGINEERING',
    desc: 'Fast, secure, SEO-optimized web applications with modern micro-frontends, server-side rendering, and responsive digital storefronts.',
    icon: Globe,
    tech: ['React 19', 'Next.js Turbopack', 'Tailwind CSS', 'Edge Rendering'],
    link: '/services/website-development',
    visualTitle: 'Edge Web Performance Suite',
    visualMetrics: [
      { label: 'Lighthouse Score', val: '98 - 100' },
      { label: 'First Contentful Paint', val: '< 0.6s' },
      { label: 'SSR Execution', val: 'Zero Hydration Lag' }
    ],
    visualHighlights: [
      'Full core web vitals optimization out of the box',
      'Zero layout shift with strict content bounding',
      'Dynamic OpenGraph and structured schema injection'
    ]
  },
  {
    id: 'mobile-apps',
    title: 'Native & Cross-Platform Mobile Apps',
    badge: 'MOBILE ENGINEERING',
    desc: 'High-responsiveness iOS and Android apps engineered with native Kotlin, Swift, and React Native for fluid, tactile user experiences.',
    icon: Smartphone,
    tech: ['Kotlin', 'Swift', 'React Native', 'Offline-First Sync'],
    link: '/services/android-app-development',
    visualTitle: 'Mobile Native Architecture',
    visualMetrics: [
      { label: 'Frame Rate', val: '60 - 120 FPS' },
      { label: 'Offline Sync', val: 'SQLite / Room' },
      { label: 'Push Delivery', val: 'Firebase Cloud' }
    ],
    visualHighlights: [
      'Biometric authentication & hardware token storage',
      'Background sync for low-connectivity environments',
      'Interactive micro-haptics & adaptive gesture physics'
    ]
  },
  {
    id: 'cloud-infrastructure',
    title: 'Cloud Infrastructure & DevOps',
    badge: 'INFRASTRUCTURE',
    desc: 'Scalable containerized cloud architecture, automated CI/CD deployment pipelines, zero-downtime rolling updates, and distributed database clustering.',
    icon: Cloud,
    tech: ['Docker', 'AWS / DigitalOcean', 'Kubernetes', 'Nginx Reverse Proxy'],
    link: '/services/software-development',
    visualTitle: 'Containerized Cluster Mesh',
    visualMetrics: [
      { label: 'Cluster Resilience', val: 'High-Availability' },
      { label: 'Pod Auto-Scaling', val: 'Dynamic' },
      { label: 'Backup Cadence', val: 'Hourly Snapshots' }
    ],
    visualHighlights: [
      'Isolated VPC networks with zero public database exposure',
      'Encrypted volume backups with 1-click restore verification',
      'Real-time CPU/Memory telemetry with automated alerts'
    ]
  },
  {
    id: 'api-integrations',
    title: 'API Integrations & Payment Gateways',
    badge: 'DATA HIGHWAYS',
    desc: 'Secure integration bridges connecting third-party payment gateways (Razorpay, Stripe), communication engines (Resend, WhatsApp), and legacy ERPs.',
    icon: Layers,
    tech: ['REST APIs', 'Webhooks', 'JWT Authentication', 'Rate Limiting'],
    link: '/services/api-integration',
    visualTitle: 'Secure Gateway Orchestrator',
    visualMetrics: [
      { label: 'Signature Validation', val: 'HMAC-SHA256' },
      { label: 'Webhook Retry', val: 'Exponential Backoff' },
      { label: 'Token Expiry', val: 'Rotating Refresh' }
    ],
    visualHighlights: [
      'Idempotent payment webhook event processing',
      'Standardized payload contracts across microservices',
      'Centralized rate-limiting to prevent traffic exhaustion'
    ]
  }
];

export function CapabilityExplorer() {
  const [selectedId, setSelectedId] = React.useState<string>(capabilities[0].id);
  const activeCap = capabilities.find((c) => c.id === selectedId) || capabilities[0];

  return (
    <section id="capabilities" className="w-full bg-[#0d0d0e] text-white py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden grid-pattern-dark">
      <div className="max-w-7xl mx-auto relative z-10">
      
      {/* Background Lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mb-8 sm:mb-12 relative z-10">
        <ScrollReveal yOffset={15} duration={0.6}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>CORE CAPABILITIES MATRIX</span>
          </div>
        </ScrollReveal>

        <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-[1.1] mb-3">
            What OHO TECH Builds.
          </h2>
          <p className="text-xs sm:text-base text-slate-300 font-normal leading-relaxed">
            Engineered disciplines spanning turnkey business software, bespoke platforms, mobile applications, and high-concurrency cloud systems.
          </p>
        </ScrollReveal>
      </div>

      {/* Interactive Two-Column Panel System */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 relative z-10 items-start">
        
        {/* Left Column: Interactive Capability List */}
        <div className="lg:col-span-6 space-y-2.5">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            const isSelected = selectedId === cap.id;
            return (
              <button
                key={cap.id}
                type="button"
                onClick={() => setSelectedId(cap.id)}
                onMouseEnter={() => setSelectedId(cap.id)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 group ${
                  isSelected 
                    ? 'bg-white/10 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] translate-x-1' 
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                  isSelected 
                    ? 'bg-emerald-500 text-black shadow-md' 
                    : 'bg-white/5 text-slate-300 group-hover:text-white'
                }`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[9.5px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                      {cap.badge}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                    }`} />
                  </div>
                  
                  <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 truncate">
                    {cap.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Dynamic Architectural Visualizer */}
        <div className="lg:col-span-6 sticky top-24">
          <div className="rounded-2xl sm:rounded-3xl bg-[#141416] border border-white/15 p-5 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300">
            
            {/* Visual Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-0.5">
                  SYSTEM SCHEMATIC
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {activeCap.visualTitle}
                </h4>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
                <Activity className="w-3 h-3 animate-pulse" />
                Active Node
              </span>
            </div>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {activeCap.visualMetrics.map((m) => (
                <div key={m.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                  <div className="text-xs sm:text-sm font-extrabold text-white mb-0.5 font-mono">
                    {m.val}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-tight">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Architecture Highlights */}
            <div className="space-y-2.5 mb-6">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                ENGINEERING SPECIFICATIONS
              </span>
              {activeCap.visualHighlights.map((hl) => (
                <div key={hl} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>

            {/* Stack Tags */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {activeCap.tech.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                    {t}
                  </span>
                ))}
              </div>

              <Link
                href={activeCap.link}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase font-mono tracking-wider"
              >
                <span>View Scope</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>

      </div>
      </div>

    </section>
  );
}

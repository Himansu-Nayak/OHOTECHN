'use client';

import * as React from 'react';
import { 
  Globe, 
  Server, 
  Database, 
  Key, 
  CreditCard, 
  Cloud,
  Layers
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface StackLayer {
  layer: string;
  name: string;
  role: string;
  technologies: string[];
  icon: React.ElementType;
}

const layers: StackLayer[] = [
  {
    layer: 'LAYER 01',
    name: 'Presentation & Client Layer',
    role: 'Server-side rendered web applications, native mobile interfaces, and low-latency POS terminals.',
    technologies: ['Next.js 16 (Turbopack)', 'React 19', 'Tailwind CSS', 'Kotlin Android', 'Swift iOS'],
    icon: Globe
  },
  {
    layer: 'LAYER 02',
    name: 'API Gateway & Security Proxy',
    role: 'Reverse proxy routing, JWT token rotation, request rate-limiting, and CORS policy enforcement.',
    technologies: ['Spring Security', 'JWT / OAuth2', 'Nginx Proxy', 'Helmet Protection'],
    icon: Key
  },
  {
    layer: 'LAYER 03',
    name: 'Core Business Application Engine',
    role: 'Modular enterprise services executing transaction validation, inventory calculations, and scheduling.',
    technologies: ['Spring Boot 3', 'Java 21', 'Node.js LTS', 'FastAPI'],
    icon: Server
  },
  {
    layer: 'LAYER 04',
    name: 'Data Persistence & Caching Tier',
    role: 'Relational ACID transaction storage, database migration versioning, and in-memory cache sync.',
    technologies: ['PostgreSQL 16', 'Flyway Migrations', 'Hibernate / JPA', 'Redis'],
    icon: Database
  },
  {
    layer: 'LAYER 05',
    name: 'Third-Party Integration Highways',
    role: 'Secured webhooks for payments, direct transactional email delivery, and telecom broadcasts.',
    technologies: ['Razorpay SDK', 'Stripe API', 'Resend SMTP', 'WhatsApp Business API'],
    icon: CreditCard
  },
  {
    layer: 'LAYER 06',
    name: 'Cloud Infrastructure & Observability',
    role: 'Containerized deployment nodes, automated SSL provisioning, daily encrypted backups, and telemetry.',
    technologies: ['Docker Containers', 'AWS / Cloud VPC', 'Prometheus Telemetry', 'Encrypted S3 Backups'],
    icon: Cloud
  }
];

export function InfrastructureStack() {
  return (
    <section id="infrastructure-stack" className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 px-4 sm:px-8 lg:px-12 py-12 sm:py-16 bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[28px] sm:rounded-[44px] shadow-2xl relative overflow-hidden grid-pattern-dark">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mb-10 sm:mb-14 relative z-10">
        <ScrollReveal yOffset={15} duration={0.6}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>FULL-STACK ARCHITECTURAL BLUEPRINT</span>
          </div>
        </ScrollReveal>

        <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-[1.1] mb-3">
            Layered Technology Architecture.
          </h2>
          <p className="text-xs sm:text-base text-slate-300 font-normal leading-relaxed">
            Every layer in the OHO TECH infrastructure is decoupled, horizontally scalable, and protected with enterprise security standards.
          </p>
        </ScrollReveal>
      </div>

      {/* Layer Cards Cascade */}
      <div className="space-y-3.5 relative z-10">
        {layers.map((l, index) => {
          const Icon = l.icon;
          return (
            <ScrollReveal key={l.layer} yOffset={20} duration={0.6} delay={index * 0.06}>
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/50 hover:bg-white/[0.04] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                
                <div className="flex items-start sm:items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-cyan-400">
                        {l.layer}
                      </span>
                      <span className="text-slate-500">•</span>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {l.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl font-normal">
                      {l.role}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 md:justify-end pl-12 md:pl-0">
                  {l.technologies.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>

              </div>
            </ScrollReveal>
          );
        })}
      </div>

    </section>
  );
}

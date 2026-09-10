'use client';

import * as React from 'react';
import { 
  User, 
  Globe, 
  Layers, 
  Cpu, 
  Database, 
  Sparkles, 
  Network, 
  Server,
  Zap
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface SystemNode {
  id: string;
  step: string;
  name: string;
  role: string;
  specs: string;
  icon: React.ElementType;
  tech: string;
}

const systemNodes: SystemNode[] = [
  {
    id: 'user',
    step: '01',
    name: 'End User & Multi-Device Client',
    role: 'Customer, Admin, Doctor, or Field Operator Request',
    specs: 'HTTPS / TLS 1.3 Encryption',
    icon: User,
    tech: 'Web, iOS, Android, Desktop POS'
  },
  {
    id: 'frontend',
    step: '02',
    name: 'Edge Next.js Frontend Layer',
    role: 'Server-Side Rendering & Client-Side Hydration',
    specs: '< 20ms Edge Response',
    icon: Globe,
    tech: 'React 19, Tailwind CSS, Lenis'
  },
  {
    id: 'api-gateway',
    step: '03',
    name: 'Secure API Gateway & Load Balancer',
    role: 'Rate Limiting, JWT Auth & Request Routing',
    specs: 'Reverse Proxy & DDoS Shield',
    icon: Layers,
    tech: 'Nginx, Spring Cloud Gateway'
  },
  {
    id: 'business-logic',
    step: '04',
    name: 'Core Microservices & Domain Logic',
    role: 'ERP Modules, Billing Calculators & Transaction Validation',
    specs: 'Stateless Isolated Execution',
    icon: Cpu,
    tech: 'Spring Boot 3, Java 21, Node.js'
  },
  {
    id: 'database',
    step: '05',
    name: 'High-Availability Database Cluster',
    role: 'ACID Transactions, Read Replicas & Connection Pooling',
    specs: 'Automated Failover & Backups',
    icon: Database,
    tech: 'PostgreSQL, Redis Cache'
  },
  {
    id: 'ai-automation',
    step: '06',
    name: 'AI Processing & Async Job Queue',
    role: 'Document OCR, Predictive Analytics & Background Crons',
    specs: 'Distributed Task Workers',
    icon: Sparkles,
    tech: 'FastAPI, Celery, LangChain'
  },
  {
    id: 'integrations',
    step: '07',
    name: 'External Enterprise Integrations',
    role: 'Payment Gateways, SMS/WhatsApp & Resend Email SMTP',
    specs: 'Idempotent Webhook Verification',
    icon: Network,
    tech: 'Razorpay, Stripe, Resend'
  },
  {
    id: 'infrastructure',
    step: '08',
    name: 'Containerized Cloud Infrastructure',
    role: 'Auto-Scaling Pods, Health Telemetry & High-Availability Clusters',
    specs: 'Multi-AZ Cloud Deployment',
    icon: Server,
    tech: 'Docker, Kubernetes, AWS'
  }
];

export function SystemArchitectureFlow() {
  const [activeStep, setActiveStep] = React.useState<number>(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % systemNodes.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="architecture" className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[28px] sm:rounded-[44px] p-4 sm:p-10 lg:p-14 shadow-2xl relative overflow-hidden grid-pattern-dark">
      
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-3xl mb-8 sm:mb-12 relative z-10">
        <ScrollReveal yOffset={15} duration={0.6}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>LIVING SYSTEM TOPOLOGY</span>
          </div>
        </ScrollReveal>

        <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-[1.1] mb-3">
            Everything connects.
          </h2>
          <p className="text-xs sm:text-base text-slate-300 font-normal leading-relaxed">
            A continuous, resilient data lifecycle connecting user interactions to cloud infrastructure with zero friction and enterprise-grade security.
          </p>
        </ScrollReveal>
      </div>

      {/* Interactive System Pipeline Flow */}
      <div className="relative z-10 space-y-3">
        {systemNodes.map((node, index) => {
          const Icon = node.icon;
          const isActive = index === activeStep;
          return (
            <div key={node.id} className="relative">
              
              {/* Node Card */}
              <div 
                onClick={() => setActiveStep(index)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isActive
                    ? 'bg-white/10 border-emerald-400/80 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                }`}
              >
                
                {/* Left Meta & Icon */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <span className={`font-mono text-xs font-bold px-2 py-1 rounded-md transition-colors ${
                    isActive ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-400'
                  }`}>
                    {node.step}
                  </span>

                  <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                    isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-300'
                  }`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-0.5">
                      {node.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {node.role}
                    </p>
                  </div>
                </div>

                {/* Right Specs & Tech Stack */}
                <div className="flex flex-wrap items-center gap-3 md:justify-end pl-12 md:pl-0">
                  <span className="text-[10px] font-mono text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {node.specs}
                  </span>

                  <span className="text-[10px] font-mono text-slate-300 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                    {node.tech}
                  </span>
                </div>

              </div>

              {/* Connecting Flow Line Indicator between nodes */}
              {index < systemNodes.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className={`w-0.5 h-3 transition-colors duration-300 ${
                    isActive ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-white/10'
                  }`} />
                </div>
              )}

            </div>
          );
        })}
      </div>

    </section>
  );
}

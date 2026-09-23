'use client';

import * as React from 'react';
import { 
  X, 
  Calculator, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  Server, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Send,
  Building2,
  Database,
  Smartphone,
  Globe
} from 'lucide-react';
import { FlippingText } from '@/components/ui/FlippingText';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface SystemEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ProjectType = 'products' | 'custom-erp' | 'mobile-apps' | 'ai-automation' | 'cloud-infra';
type ScaleLevel = 'starter' | 'growth' | 'enterprise';

interface EstimateSpec {
  timeline: string;
  recommendedStack: string;
  architectureTier: string;
  includedFeatures: string[];
}

const ESTIMATE_MATRIX: Record<ProjectType, Record<ScaleLevel, EstimateSpec>> = {
  'products': {
    starter: {
      timeline: '1 - 2 Business Days',
      recommendedStack: 'Pre-compiled Binary / Single Server / SQLite or PG',
      architectureTier: 'Standard Commercial Single-Instance',
      includedFeatures: ['Instant Source Code License', 'Installation Script', 'Standard Admin Console', '1 Year Updates']
    },
    growth: {
      timeline: '3 - 5 Business Days',
      recommendedStack: 'Docker Container / PostgreSQL Core / Redis Cache',
      architectureTier: 'Multi-Terminal Network Deploy',
      includedFeatures: ['Commercial License + Multi-User Roles', 'Custom Domain & SSL', 'Automated Daily Backups', 'Priority SLA Support']
    },
    enterprise: {
      timeline: '1 - 2 Weeks',
      recommendedStack: 'Kubernetes Cluster / Master-Replica PG / Redis Sentinel',
      architectureTier: 'Multi-Branch Distributed System',
      includedFeatures: ['Full Enterprise Source Code Access', 'Multi-Branch Sync Engine', 'Custom API Webhooks', 'Dedicated DevOps Deployment']
    }
  },
  'custom-erp': {
    starter: {
      timeline: '3 - 5 Weeks',
      recommendedStack: 'Next.js 16 + Node.js + PostgreSQL + Tailwind CSS',
      architectureTier: 'Bespoke Single-Tenant SaaS',
      includedFeatures: ['Core Business Workflows', 'Role-Based Access Control', 'Automated PDF/GST Invoicing', 'RESTful API Backend']
    },
    growth: {
      timeline: '6 - 9 Weeks',
      recommendedStack: 'Next.js + Go Microservices + PostgreSQL + Redis + BullMQ',
      architectureTier: 'High-Concurrency Multi-Branch ERP',
      includedFeatures: ['Custom Inventory & Ledger Sync', 'Payment Gateway Integration', 'Automated WhatsApp & SMS Gateway', 'Real-Time Telemetry Dashboard']
    },
    enterprise: {
      timeline: '10 - 14 Weeks',
      recommendedStack: 'Event-Driven Microservices + Kafka + Distributed PG + AWS Multi-AZ',
      architectureTier: 'Mission-Critical Enterprise Core',
      includedFeatures: ['Custom Legacy Migration Pipeline', 'Offline-First Edge Terminal Sync', 'SOC2 / HIPAA Audit Logging', '24/7 Dedicated SLA Monitoring']
    }
  },
  'mobile-apps': {
    starter: {
      timeline: '4 - 6 Weeks',
      recommendedStack: 'Flutter (iOS & Android) + Node.js REST API + PostgreSQL',
      architectureTier: 'Cross-Platform Native Hybrid',
      includedFeatures: ['iOS App Store & Google Play Deploy', 'Push Notifications Core', 'User Authentication & Profiles', 'Offline Data Caching']
    },
    growth: {
      timeline: '7 - 10 Weeks',
      recommendedStack: 'Flutter + GraphQL Engine + Redis + Firebase Cloud Messaging',
      architectureTier: 'High-Performance Mobile Platform',
      includedFeatures: ['In-App Payments & Subscriptions', 'Real-Time Chat & GPS Tracking', 'Biometric FaceID / TouchID Auth', 'Deep Analytics Integration']
    },
    enterprise: {
      timeline: '11 - 16 Weeks',
      recommendedStack: 'Native Kotlin/Swift + Flutter Hybrid Engine + Microservices Backend',
      architectureTier: 'Enterprise Fleet & Consumer Ecosystem',
      includedFeatures: ['Offline-Resilient SQLite Sync', 'Custom Bluetooth Hardware POS Link', 'Multi-Language Localization', 'Zero-Downtime CI/CD App Pipeline']
    }
  },
  'ai-automation': {
    starter: {
      timeline: '2 - 4 Weeks',
      recommendedStack: 'Python FastAPI + OpenAI/Claude API + LangChain + PostgreSQL',
      architectureTier: 'Intelligent Knowledge Assistant',
      includedFeatures: ['Internal Document RAG Search', 'Automated Customer Query Routing', 'Sentiment & Analytics Dashboard', 'Secure API Gateway']
    },
    growth: {
      timeline: '5 - 8 Weeks',
      recommendedStack: 'Python + pgvector + Redis Vector Cache + Celery Workers',
      architectureTier: 'Autonomous Workflow Pipeline',
      includedFeatures: ['Multi-Modal Invoice & OCR Extraction', 'Automated Lead Enrichment Engine', 'CRM & ERP Webhook Automation', 'Fine-Tuned Domain Prompts']
    },
    enterprise: {
      timeline: '9 - 14 Weeks',
      recommendedStack: 'Self-Hosted LLaMA/Mistral + vLLM Cluster + Vector DB + AWS GPU VPC',
      architectureTier: 'Zero-Data-Leak Private AI Core',
      includedFeatures: ['100% On-Premise / Private VPC Hosting', 'Custom Fine-Tuned Model Weights', 'Enterprise Role-Based Guardrails', 'Real-Time Voice & Multimodal Agents']
    }
  },
  'cloud-infra': {
    starter: {
      timeline: '1 - 2 Weeks',
      recommendedStack: 'Docker + NGINX Reverse Proxy + Cloudflare CDN + PostgreSQL',
      architectureTier: 'Hardened Single-Server Stack',
      includedFeatures: ['Automated SSL & DDoS Shield', 'Daily Encrypted Remote Backups', 'Basic Health Monitoring', 'GitHub Actions CI/CD']
    },
    growth: {
      timeline: '3 - 5 Weeks',
      recommendedStack: 'AWS ECS / DigitalOcean K8s + Managed Database + Redis Cluster',
      architectureTier: 'Auto-Scaling Cloud Environment',
      includedFeatures: ['Auto-Scaling Load Balancer', 'Zero-Downtime Blue/Green Deploys', 'Prometheus & Grafana Monitoring', 'Multi-Region Edge Caching']
    },
    enterprise: {
      timeline: '6 - 9 Weeks',
      recommendedStack: 'Multi-Region Kubernetes (EKS) + PostgreSQL Multi-AZ + Terraform IaC',
      architectureTier: 'Global High-Availability Mesh',
      includedFeatures: ['Infrastructure-as-Code (Terraform)', 'Disaster Recovery Warm Standby', 'Sub-30ms Global Anycast Routing', '99.99% Uptime Guarantee SLA']
    }
  }
};

export function SystemEstimateModal({ isOpen, onClose }: SystemEstimateModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const [projectType, setProjectType] = React.useState<ProjectType>('custom-erp');
  const [scaleLevel, setScaleLevel] = React.useState<ScaleLevel>('growth');
  const [clientName, setClientName] = React.useState<string>('');
  const [clientEmail, setClientEmail] = React.useState<string>('');
  const [clientPhone, setClientPhone] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const currentSpec = ESTIMATE_MATRIX[projectType][scaleLevel];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        service: `Architecture Estimate: ${projectType.toUpperCase()} (${scaleLevel.toUpperCase()})`,
        requirements: `Estimated Stack: ${currentSpec.recommendedStack}. Timeline: ${currentSpec.timeline}. Tier: ${currentSpec.architectureTier}`,
        source: 'System Architecture Estimator Modal'
      };

      await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setIsSubmitted(true);
    } catch {
      // Fallback display
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-8 select-none overflow-y-auto"
        >
          {/* Backdrop with Motion Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container with Spring Scale */}
          <motion.div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="estimate-modal-title"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 12 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="relative w-full max-w-4xl bg-[#0c0d11] text-white border-2 border-slate-700 rounded-[28px] sm:rounded-[40px] shadow-2xl overflow-hidden my-auto p-6 sm:p-10 max-h-[92vh] flex flex-col justify-between overflow-y-auto custom-scroll z-10"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                ENTERPRISE SYSTEM ARCHITECTURE ESTIMATOR
              </span>
              <h3 id="estimate-modal-title" className="text-lg sm:text-2xl font-black text-white tracking-tight">
                Configure Your Deployment Specification
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            aria-label="Close Estimator Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-6 space-y-6 relative z-10">
          
          {/* Step 1: Project Scope Selection */}
          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-2.5 font-bold">
              01 • SELECT SYSTEM DOMAIN &amp; SCOPE
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'products', label: 'Products & Licenses', icon: Building2 },
                { id: 'custom-erp', label: 'Custom Cloud ERP', icon: Layers },
                { id: 'mobile-apps', label: 'Mobile Apps (iOS/Android)', icon: Smartphone },
                { id: 'ai-automation', label: 'AI & Vector Systems', icon: Cpu },
                { id: 'cloud-infra', label: 'Cloud & Kubernetes', icon: Server },
              ].map((item) => {
                const isSelected = projectType === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProjectType(item.id as ProjectType)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="text-[11px] font-mono font-bold leading-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Scale / Concurrency Selector */}
          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-2.5 font-bold">
              02 • OPERATIONAL SCALE &amp; CONCURRENCY
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'starter', label: 'Starter / Single Facility', desc: 'Up to 50 Concurrent Users' },
                { id: 'growth', label: 'Growth / Multi-Branch', desc: '50 - 500 Active Users' },
                { id: 'enterprise', label: 'Enterprise / High-Throughput', desc: '500+ Distributed Users' },
              ].map((tier) => {
                const isSelected = scaleLevel === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setScaleLevel(tier.id as ScaleLevel)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#141822] border-emerald-500 text-white ring-1 ring-emerald-500'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-white">
                        {tier.label}
                      </span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      {tier.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generated Architecture Blueprint Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#12151d] border border-white/15">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">ESTIMATED SLA TIMELINE:</span>
                <span className="font-bold text-emerald-400">{currentSpec.timeline}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentSpec.architectureTier}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono mb-4">
              <div>
                <span className="text-[10px] uppercase text-slate-500 block mb-1">RECOMMENDED INFRASTRUCTURE</span>
                <span className="text-slate-200 text-xs font-bold">{currentSpec.recommendedStack}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 block mb-1">INCLUDED DELIVERABLES</span>
                <ul className="space-y-1">
                  {currentSpec.includedFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3: Quick Dispatch Contact Strip */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="pt-4 border-t border-white/10 space-y-3">
              <span className="text-xs font-mono uppercase text-slate-400 block font-bold">
                03 • RECEIVE FORMAL ARCHITECTURE PROPOSAL &amp; PRICING
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  id="estimate-client-name"
                  type="text"
                  required
                  aria-label="Your Full Name"
                  placeholder="Your Name *"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-400"
                />

                <input
                  id="estimate-client-email"
                  type="email"
                  required
                  aria-label="Corporate Email Address"
                  placeholder="Corporate Email *"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-400"
                />

                <input
                  id="estimate-client-phone"
                  type="tel"
                  aria-label="Phone or WhatsApp Number"
                  placeholder="Phone / WhatsApp"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  Guaranteed SLA: Response within &lt; 24 hours with complete project breakdown.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Architecture Spec'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-base font-black text-white font-mono">
                Architecture Specification Dispatched Successfully
              </h4>
              <p className="text-xs text-slate-300 font-mono max-w-lg mx-auto">
                Thank you, {clientName || 'Partner'}. Our engineering leadership will review your configured specification ({projectType.toUpperCase()} - {scaleLevel.toUpperCase()}) and send the commercial breakdown directly to {clientEmail}.
              </p>
            </div>
          )}

        </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


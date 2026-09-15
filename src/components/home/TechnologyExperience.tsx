'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Workflow, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Radio, 
  Server, 
  CheckCircle2, 
  ArrowRight,
  Activity,
  Globe,
  Lock,
  Sparkles,
  Terminal,
  Zap,
  GitBranch,
  Monitor,
  Code2
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TechDomain {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  securityPosture: string;
  topologyBlueprint: string[];
}

const FOUNDATION_PILLARS = [
  {
    number: '01',
    title: 'Decoupled Service Boundaries',
    subtitle: 'MODULAR ISOLATION',
    desc: 'Autonomous microservices eliminate cascading failures, guarantee zero single-point-of-failure, and empower rapid independent iteration.',
    icon: Layers,
    metric: 'FAULT ISOLATION',
  },
  {
    number: '02',
    title: 'Sub-Millisecond Stream Propagation',
    subtitle: 'EVENT-DRIVEN ARCHITECTURE',
    desc: 'Asynchronous event streaming queues and distributed edge caches enable instantaneous enterprise state synchronization.',
    icon: Cpu,
    metric: '< 18ms PROPAGATION',
  },
  {
    number: '03',
    title: 'Sovereign Data Governance',
    subtitle: '100% CODE OWNERSHIP',
    desc: 'Dedicated private infrastructure, immutable cryptographic audit trails, and sovereign data ownership with zero proprietary vendor lock-in.',
    icon: ShieldCheck,
    metric: '100% CODE OWNERSHIP',
  },
];

const TECH_DOMAINS: TechDomain[] = [
  {
    id: 'frontend',
    category: 'Frontend',
    title: 'Next-Gen Interface Engines & Native Ecosystems',
    subtitle: 'HIGH-PERFORMANCE CLIENT RUNTIMES',
    description: 'High-concurrency React 19 web engines and 120 FPS native mobile frameworks engineered for fluid typography, zero layout shifts, and instantaneous edge hydration.',
    icon: Monitor,
    accent: '#10b981',
    technologies: ['Next.js 16 App Router', 'React 19 Server Components', 'Turbopack', 'Swift Native (iOS)', 'Kotlin Multiplatform (Android)', 'Tailwind CSS 4', 'WebAssembly (WASM)'],
    metrics: [
      { label: 'FIRST CONTENTFUL PAINT', value: '< 0.4s FCP' },
      { label: 'FRAME RATE', value: '120 FPS Fluid' },
      { label: 'STANDARDS', value: 'WCAG AAA Compliant' },
    ],
    securityPosture: 'Strict CSP Headers, Ephemeral Token Hydration & Zero XSS Surface',
    topologyBlueprint: [
      'Edge CDN Hydration (Global POPs)',
      'React 19 Streaming SSR Buffers',
      'Client-Side Optimistic State Cache',
      'Micro-Frontend Decoupled Shell'
    ],
  },
  {
    id: 'backend',
    category: 'Backend',
    title: 'Distributed Microservices & High-Concurrency Runtimes',
    subtitle: 'CONTAINERIZED DOMAIN COMPUTE',
    description: 'Autonomous containerized domain services running on isolated Kubernetes pods with asynchronous message passing and automated fault recovery.',
    icon: Server,
    accent: '#06b6d4',
    technologies: ['Node.js Enterprise Engine', 'Go (Golang)', 'Rust Core Systems', 'gRPC & Protocol Buffers', 'Asynchronous AMQP', 'OpenTelemetry Distributed Tracing'],
    metrics: [
      { label: 'EXECUTION TIME', value: '< 15ms Execution' },
      { label: 'AVAILABILITY TARGET', value: '99.99% Fault-Tolerant' },
      { label: 'THROUGHPUT CAPACITY', value: '500K+ RPS Scale' },
    ],
    securityPosture: 'Container Pod Isolation, Ephemeral File Systems & Mutual mTLS',
    topologyBlueprint: [
      'Stateless Horizontal Worker Pods',
      'High-Throughput gRPC Inter-Service Bus',
      'Dead-Letter Queue Retry Deamons',
      'Automated Pod Auto-Scaling Policy'
    ],
  },
  {
    id: 'ai',
    category: 'AI',
    title: 'Enterprise LLM Ingestion & Tensor Pipelines',
    subtitle: 'NEURAL INFERENCE & VECTOR SEARCH',
    description: 'Custom fine-tuned large language models, enterprise vector similarity indices, and real-time predictive telemetry pipelines for business automation.',
    icon: Sparkles,
    accent: '#8b5cf6',
    technologies: ['PyTorch Engine', 'Hugging Face Transformers', 'pgvector Embeddings', 'Vector Similarity Search', 'TensorRT Acceleration', 'LangChain / LlamaIndex'],
    metrics: [
      { label: 'INFERENCE SPEED', value: '< 40ms TTFT' },
      { label: 'CONTEXT WINDOW', value: '128K Token Window' },
      { label: 'BENCHMARK ACCURACY', value: '99.4% Precision' },
    ],
    securityPosture: 'Private Tenant Sandboxing, On-Premise Weights & Zero Training Leakage',
    topologyBlueprint: [
      'Document Chunking & Embedding Worker',
      'HNSW Vector Index Acceleration',
      'Semantic Routing & Prompt Shield',
      'Streaming Inference Edge Proxy'
    ],
  },
  {
    id: 'cloud',
    category: 'Cloud',
    title: 'Multi-Region Mesh & Elastic Cloud Topologies',
    subtitle: 'GLOBAL RESILIENCE & EDGE MESH',
    description: 'Global infrastructure topologies deployed across multi-cloud container clusters with automated horizontal autoscaling and intelligent edge request routing.',
    icon: Globe,
    accent: '#3b82f6',
    technologies: ['AWS Multi-Region', 'Google Cloud VPC', 'Cloudflare Edge Workers', 'Terraform IAC', 'Kubernetes (EKS / GKE)', 'Global Edge DNS'],
    metrics: [
      { label: 'GLOBAL AVAILABILITY', value: '99.999% SLA' },
      { label: 'EDGE LATENCY', value: '< 12ms Edge Routing' },
      { label: 'EDGE COVERAGE', value: '300+ Global POPs' },
    ],
    securityPosture: 'VPC Peering, Automated DDoS Scrubbing & Zero Public Database Ingress',
    topologyBlueprint: [
      'Multi-Region Active-Active Replication',
      'Cloudflare Geo-Distributed DNS',
      'Terraform Declared Immutable Stacks',
      'Automated Multi-AZ Failover Orchestrator'
    ],
  },
  {
    id: 'apis',
    category: 'APIs',
    title: 'Zero-Trust Gateway & Traffic Orchestration',
    subtitle: 'GATEWAY PROTOCOL MESH',
    description: 'Centralized request routing, cryptographic token validation, dynamic rate-limiting, and GraphQL/REST API protocol translation.',
    icon: Workflow,
    accent: '#ec4899',
    technologies: ['Envoy Proxy', 'GraphQL Federation', 'Kong Gateway', 'OAuth 2.0 / OIDC', 'JWT Cryptographic Tokens', 'REST JSON Endpoints'],
    metrics: [
      { label: 'GATEWAY OVERHEAD', value: '< 4ms Processing' },
      { label: 'TOKEN VALIDATION', value: '< 2ms Validation' },
      { label: 'RATE-LIMITING', value: '100% Dynamic Token Bucket' },
    ],
    securityPosture: 'Mutual TLS (mTLS) Encryption, HMAC Signature & Cryptographic RBAC',
    topologyBlueprint: [
      'Edge SSL/TLS 1.3 Termination',
      'Unified GraphQL Schema Stitching',
      'Distributed Rate-Limiter Daemon',
      'Real-Time Ingress Audit Logger'
    ],
  },
  {
    id: 'databases',
    category: 'Databases',
    title: 'ACID Relational Core & Sovereign Persistence',
    subtitle: 'HIGH-CONSISTENCY DATA STORES',
    description: 'ACID-compliant relational engines paired with sub-millisecond in-memory caches and immutable cryptographic audit logs on dedicated sovereign infrastructure.',
    icon: Database,
    accent: '#f59e0b',
    technologies: ['PostgreSQL Cluster', 'Redis Pub/Sub Cache', 'Apache Kafka Streams', 'S3 Sovereign Storage', 'Encrypted Immutable Ledger'],
    metrics: [
      { label: 'QUERY RETRIEVAL', value: '< 3ms Query Latency' },
      { label: 'CONSISTENCY POSTURE', value: 'Strict ACID Compliance' },
      { label: 'BACKUP DISPATCH', value: 'Daily Automated Snapshots' },
    ],
    securityPosture: 'AES-256 Encryption at Rest & In-Transit, Row-Level Security (RLS)',
    topologyBlueprint: [
      'Primary Write Master + Multi Read Replicas',
      'Redis In-Memory Distributed Cache',
      'Kafka Event Streaming Partition Log',
      'Encrypted Point-in-Time Data Snapshots'
    ],
  },
  {
    id: 'automation',
    category: 'Automation',
    title: 'Event-Driven Telemetry & CI/CD Pipelines',
    subtitle: 'CONTINUOUS INTEGRATION & OPS',
    description: 'Continuous integration, automated regression testing, immutable container image builds, and real-time Prometheus/Grafana system health telemetry.',
    icon: Activity,
    accent: '#10b981',
    technologies: ['GitHub Actions Enterprise', 'Docker Container Builds', 'Prometheus Metrics', 'Grafana Telemetry', 'Automated Webhooks', 'Helm Charts'],
    metrics: [
      { label: 'RELEASE CYCLE', value: 'Zero-Downtime Rolling' },
      { label: 'DRIFT MONITORING', value: 'Real-Time Telemetry' },
      { label: 'CRITICAL COVERAGE', value: '100% Core Regression' },
    ],
    securityPosture: 'Signed Cryptographic Binaries, Container Vulnerability Scans & Drift Alerts',
    topologyBlueprint: [
      'Automated Lint, Test & Security Scan',
      'Immutable Multi-Arch Container Build',
      'Blue-Green Deployment Switcher',
      'Prometheus Telemetry Prometheus Alertmanager'
    ],
  },
  {
    id: 'infrastructure',
    category: 'Infrastructure',
    title: 'Hardened Security & Bare-Metal Edge Topologies',
    subtitle: 'GOVERNANCE & SOVEREIGN SECURITY',
    description: 'End-to-end cryptographic governance, enterprise role-based access control (RBAC), and strict regulatory compliance controls for data sovereignty.',
    icon: Lock,
    accent: '#06b6d4',
    technologies: ['SOC-2 Type II Controls', 'Role-Based RBAC', 'KMS Key Management', 'Immutable Audit Trails', 'ISO 27001 Framework', 'Sovereign VPC Mesh'],
    metrics: [
      { label: 'CODE OWNERSHIP', value: '100% Sovereign Client IP' },
      { label: 'AUDIT LOGGING', value: '100% Immutable Append' },
      { label: 'LOCK-IN FACTOR', value: 'Zero Proprietary Lock-In' },
    ],
    securityPosture: 'Zero-Trust Architecture, Cryptographic KMS Keys & Complete Sovereignty',
    topologyBlueprint: [
      'Dedicated Sovereign VPC Subnets',
      'Hardware Security Module (HSM) Keys',
      'Real-Time Intrusion Detection Sentry',
      'Air-Gapped Cold Disaster Recovery Vault'
    ],
  },
];

export function TechnologyExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const explorerRef = useRef<HTMLDivElement>(null);

  const [selectedDomainIndex, setSelectedDomainIndex] = useState<number>(0);
  const currentDomain = TECH_DOMAINS[selectedDomainIndex] || TECH_DOMAINS[0];
  const DomainIcon = currentDomain.icon;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Statement entrance
      if (statementRef.current) {
        gsap.fromTo(
          statementRef.current.children,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statementRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      }

      // 2. Foundation pillars stagger & differential depth
      if (pillarsRef.current) {
        gsap.fromTo(
          pillarsRef.current.children,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReduced && window.innerWidth >= 768) {
          const pillars = Array.from(pillarsRef.current.children);
          pillars.forEach((p, idx) => {
            const offset = idx === 1 ? -16 : 16;
            gsap.to(p, {
              y: offset,
              ease: 'none',
              scrollTrigger: {
                trigger: pillarsRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            });
          });
        }
      }

      // 3. Explorer container reveal & scroll-driven domain progression
      if (explorerRef.current) {
        gsap.fromTo(
          explorerRef.current,
          { opacity: 0, y: 28, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: explorerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );

        // Scroll progress drives domain sequence smoothly
        if (window.innerWidth >= 1024) {
          ScrollTrigger.create({
            trigger: explorerRef.current,
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: 0.8,
            onUpdate: (self) => {
              const total = TECH_DOMAINS.length;
              const idx = Math.min(total - 1, Math.max(0, Math.floor(self.progress * total * 0.999)));
              setSelectedDomainIndex(idx);
            },
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSelectDomain = useCallback((index: number) => {
    setSelectedDomainIndex(index);
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="technology" 
      aria-label="OHO TECH Technology Foundation and Architecture Matrix"
      className="w-full bg-[#0a0a0b] text-white py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/5"
    >
      {/* Background Ambient Lighting */}
      <div className="absolute top-1/4 right-0 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-emerald-500/5 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-cyan-500/5 rounded-full blur-[170px] pointer-events-none" />

      {/* Precision Technical Mesh Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* ── PART 1: STRONG EDITORIAL FOUNDATION STATEMENT ── */}
        <div ref={statementRef} className="mb-16 sm:mb-24 pb-12 border-b border-white/10">
          
          {/* Pre-title Capsule */}
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              06 // ARCHITECTURAL FOUNDATION &amp; TECHNOLOGY MATRIX
            </span>
          </div>

          {/* Editorial Display Headline */}
          <div className="max-w-5xl mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.02] uppercase mb-6">
              <span>Technology is the foundation.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                We engineer what powerful experiences rest upon.
              </span>
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
              Every fluid user interface, sub-second transaction engine, and resilient commercial platform requires an unshakeable foundation of distributed systems engineering, cryptographic security, and sovereign cloud architecture.
            </p>
          </div>

          {/* 3 Core Architectural Pillars Grid */}
          <div ref={pillarsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {FOUNDATION_PILLARS.map((pillar, pIdx) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={pIdx}
                  className="p-6 sm:p-7 rounded-2xl bg-[#121316]/90 border border-white/10 hover:border-emerald-500/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        PILLAR {pillar.number}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
                      {pillar.subtitle}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-4">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 font-mono text-[10px] sm:text-[11px] font-bold text-emerald-400 uppercase">
                    {pillar.metric}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ── PART 2: INTERACTIVE 8-DOMAIN TECHNOLOGY PRESENTATION ── */}
        <div ref={explorerRef}>
          
          {/* Matrix Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
            <div>
              <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                ENTERPRISE STACK MATRIX
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                Explore The Technology Mesh
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-md">
              Select any domain below to inspect architecture protocols, benchmarks, and production blueprints.
            </p>
          </div>

          {/* 8-Category Interactive Navigation Tabs */}
          <div 
            role="tablist"
            aria-label="Technology Domains"
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-8 sm:mb-10"
          >
            {TECH_DOMAINS.map((domain, idx) => {
              const isSelected = selectedDomainIndex === idx;
              const Icon = domain.icon;

              return (
                <button
                  key={domain.id}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`tech-domain-panel-${domain.id}`}
                  tabIndex={0}
                  onClick={() => handleSelectDomain(idx)}
                  className={`p-3 sm:p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 hover:-translate-y-0.5 ${
                    isSelected
                      ? 'bg-[#181920] border-emerald-500/50 shadow-xl ring-1 ring-emerald-500/30 text-white'
                      : 'bg-[#111215]/80 border-white/10 hover:border-white/20 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-bold opacity-60">
                      0{idx + 1}
                    </span>
                    <Icon className={`w-4 h-4 transition-colors ${
                      isSelected ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'
                    }`} />
                  </div>

                  <div className="font-mono text-xs font-bold uppercase tracking-wider truncate">
                    {domain.category}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Domain Deep Inspector (Progressive Reveal Stage) */}
          <div 
            key={currentDomain.id}
            id={`tech-domain-panel-${currentDomain.id}`}
            role="tabpanel"
            className="w-full rounded-2xl sm:rounded-3xl bg-[#14151a]/95 border border-white/15 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-in fade-in duration-300 zoom-in-98"
          >
            {/* Ambient Corner Glow */}
            <div 
              className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[140px] pointer-events-none opacity-25"
              style={{ backgroundColor: currentDomain.accent }}
            />

            {/* Inspector Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8 font-mono text-xs">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                  style={{ color: currentDomain.accent }}
                >
                  <DomainIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-white uppercase text-sm block">
                    {currentDomain.category} DOMAIN SPECIFICATION
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {currentDomain.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>ACTIVE &amp; DEPLOYMENT TESTED</span>
              </div>
            </div>

            {/* Domain Title & Detailed Narrative */}
            <div className="mb-8">
              <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-3">
                {currentDomain.title}
              </h4>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-4xl">
                {currentDomain.description}
              </p>
            </div>

            {/* 3 Benchmarks Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {currentDomain.metrics.map((metric, mIdx) => (
                <div key={mIdx} className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/10">
                  <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    {metric.label}
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-white">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Two-Column Deep Breakdown: Tech Badges (Left) & Topology Blueprint (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-white/10">
              
              {/* Left Column: Tech Stack Badges */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span>VERIFIED PRODUCTION TECHNOLOGIES</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentDomain.technologies.map((tech, tIdx) => (
                      <span 
                        key={tIdx}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-slate-200 font-medium hover:border-emerald-500/40 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-0.5">
                      SECURITY &amp; RESILIENCE POLICY
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      {currentDomain.securityPosture}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Architectural Topology Blueprint Terminal */}
              <div className="lg:col-span-6">
                <div className="w-full rounded-xl bg-black/60 border border-white/10 p-5 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-slate-400">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{currentDomain.category.toLowerCase()}-topology.spec</span>
                    </div>
                    <span className="text-[10px] text-emerald-400">BLUEPRINT</span>
                  </div>

                  <div className="space-y-2.5 text-slate-300">
                    {currentDomain.topologyBlueprint.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2.5">
                        <span className="text-emerald-400 font-bold">0{sIdx + 1} //</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                    <span>LAYER COMPLIANCE: 100%</span>
                    <span className="text-emerald-400 font-bold">ENCRYPTED AT REST &amp; TRANSIT</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

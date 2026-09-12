'use client';

import * as React from 'react';
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
  Activity
} from 'lucide-react';

interface TierSpec {
  id: string;
  number: string;
  name: string;
  category: string;
  summary: string;
  latency: string;
  availability: string;
  protocols: string[];
  components: string[];
  security: string;
}

const TIERS: TierSpec[] = [
  {
    id: 'edge',
    number: 'TIER 01',
    name: 'Edge & Client Delivery Layer',
    category: 'GLOBAL EDGE ACCELERATION',
    summary: 'High-speed edge routing and client application delivery with global caching, automatic asset compression, and instant CDN hydration.',
    latency: '< 8ms Edge TTFB',
    availability: '100% Global POPs',
    protocols: ['HTTP/3', 'QUIC', 'TLS 1.3', 'Edge DNS'],
    components: ['Next.js 16 Turbopack', 'Swift Native (iOS)', 'Kotlin (Android)', 'Cloudflare Edge Mesh'],
    security: 'DDoS Shield & Automated WAF Bot Mitigation',
  },
  {
    id: 'gateway',
    number: 'TIER 02',
    name: 'API Gateway & Security Mesh',
    category: 'TRAFFIC ORCHESTRATION & AUTH',
    summary: 'Centralized request routing, cryptographic token validation, dynamic rate-limiting, and GraphQL/REST API protocol translation.',
    latency: '< 4ms Gateway Processing',
    availability: '99.999% Fault-Tolerant',
    protocols: ['gRPC', 'GraphQL', 'REST JSON', 'OAuth 2.0 / OIDC'],
    components: ['Envoy Proxy', 'Kong Gateway', 'JWT Token Validator', 'Dynamic Rate Limiter'],
    security: 'Mutual TLS (mTLS) & Zero-Trust Verification',
  },
  {
    id: 'core',
    number: 'TIER 03',
    name: 'Distributed Core Microservices',
    category: 'DOMAIN LOGIC & COMPUTE',
    summary: 'Autonomous containerized domain services running on isolated Kubernetes pods with automated horizontal autoscaling and failure recovery.',
    latency: '< 15ms Execution Time',
    availability: '99.99% Guaranteed SLA',
    protocols: ['Asynchronous AMQP', 'Internal gRPC', 'OpenTelemetry'],
    components: ['Node.js Enterprise Engine', 'Go Microservices', 'Docker / Kubernetes', 'Auto-Scaler'],
    security: 'Container Isolation & Read-Only Ephemeral Filesystem',
  },
  {
    id: 'streaming',
    number: 'TIER 04',
    name: 'Real-Time Event Stream & Messaging',
    category: 'EVENT PUB/SUB PIPELINE',
    summary: 'High-throughput event streaming architecture ensuring sub-millisecond asynchronous state propagation across enterprise business modules.',
    latency: '< 5ms Message Relay',
    availability: '99.999% Partition Resilient',
    protocols: ['Kafka Protocol', 'Redis Pub/Sub', 'Secure WebSockets'],
    components: ['Apache Kafka Cluster', 'Redis In-Memory Cache', 'WebSocket Gateway', 'Dead-Letter Queues'],
    security: 'Encrypted Message Streams with Replay Prevention',
  },
  {
    id: 'storage',
    number: 'TIER 05',
    name: 'Sovereign Data Lake & Ledger',
    category: 'PERSISTENCE & SOVEREIGNTY',
    summary: 'ACID-compliant relational engines paired with vector embeddings and encrypted immutable audit logs on dedicated sovereign infrastructure.',
    latency: '< 3ms Query Retrieval',
    availability: '99.999% Multi-AZ Replicated',
    protocols: ['SQL Relational', 'Vector Similarity Search', 'S3 Object Storage'],
    components: ['PostgreSQL Cluster', 'pgvector AI Index', 'Immutable Audit Ledger', 'Daily Encrypted Snapshots'],
    security: 'AES-256 Encryption at Rest & In-Transit',
  },
];

export function TechnologyExperience() {
  const [selectedTier, setSelectedTier] = React.useState<number>(0);
  const currentTier = TIERS[selectedTier];

  return (
    <section 
      id="technology" 
      className="w-full bg-[#0a0a0b] text-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background Lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
              <Workflow className="w-3.5 h-3.5" />
              <span>SYSTEM ARCHITECTURE TOPOLOGY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase">
              Technology Architecture
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300 font-normal max-w-md leading-relaxed">
            Multi-tier distributed architecture engineered for sub-millisecond edge response, elastic scalability, and zero-trust cryptographic security.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Tier Selector (Left) & Deep Inspector (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: 5 Tier Selectors */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {TIERS.map((tier, idx) => {
              const isSelected = selectedTier === idx;
              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(idx)}
                  className={`w-full p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#18191f] border-emerald-500/40 shadow-xl ring-1 ring-emerald-500/30'
                      : 'bg-[#121318]/90 border-white/10 hover:border-white/20 hover:bg-[#15161c]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${
                      isSelected 
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}>
                      {tier.number}
                    </div>

                    <div>
                      <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                        {tier.category}
                      </div>
                      <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                        {tier.name}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${
                    isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-500 group-hover:text-white'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Live Tier Inspector Card */}
          <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl bg-[#141416]/95 border border-white/15 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl">
            
            {/* Inspector Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10 mb-6">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400 mr-2">
                  {currentTier.number} SPECIFICATION
                </span>
                <span className="font-mono text-[10px] sm:text-xs text-slate-400 uppercase">
                  // {currentTier.category}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                <Activity className="w-3.5 h-3.5" />
                <span>ONLINE &amp; MONITORED</span>
              </div>
            </div>

            {/* Tier Title & Summary */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-3">
              {currentTier.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-8">
              {currentTier.summary}
            </p>

            {/* Performance Metric Badges: 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="font-mono text-[10px] text-slate-400 uppercase mb-1">
                  LATENCY SLA
                </div>
                <div className="font-mono text-sm sm:text-base font-bold text-emerald-400">
                  {currentTier.latency}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="font-mono text-[10px] text-slate-400 uppercase mb-1">
                  AVAILABILITY TARGET
                </div>
                <div className="font-mono text-sm sm:text-base font-bold text-cyan-400">
                  {currentTier.availability}
                </div>
              </div>
            </div>

            {/* Components & Protocols Grid */}
            <div className="space-y-6 pt-6 border-t border-white/10">
              
              <div>
                <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  CORE INFRASTRUCTURE COMPONENTS
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentTier.components.map((comp, cIdx) => (
                    <span 
                      key={cIdx}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-slate-200 font-medium"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  SUPPORTED PROTOCOLS &amp; STANDARDS
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentTier.protocols.map((proto, pIdx) => (
                    <span 
                      key={pIdx}
                      className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 font-mono text-xs text-emerald-400"
                    >
                      {proto}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-0.5">
                    SECURITY POSTURE
                  </div>
                  <div className="text-xs text-slate-300">
                    {currentTier.security}
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

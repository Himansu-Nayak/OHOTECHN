'use client';

import React from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Server, 
  Database, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Terminal,
  Activity,
  CheckCircle2
} from 'lucide-react';

export function ArchitectureTopologyMesh() {
  const meshNodes = [
    {
      layer: '01. CLIENT & EDGE INGRESS',
      nodes: ['Next.js 16 Web App', 'Native iOS & Android Apps', 'Offline-First POS Terminals'],
      accent: '#10b981',
      details: 'Global Anycast DNS -> Cloudflare WAF -> SSL/TLS 1.3 Termination (<15ms)',
      icon: Globe
    },
    {
      layer: '02. ZERO-TRUST API GATEWAY',
      nodes: ['mTLS Client Auth', 'Token Bucket Rate Limiting', 'Cryptographic RBAC Interceptor'],
      accent: '#06b6d4',
      details: 'Inspects HMAC signatures and routes gRPC / REST traffic (<4ms overhead)',
      icon: ShieldCheck
    },
    {
      layer: '03. DISTRIBUTED SERVICE MESH',
      nodes: ['Go (Golang) Microservices', 'Node.js Enterprise Workers', 'AMQP Asynchronous Message Queue'],
      accent: '#3b82f6',
      details: 'Decoupled domain compute with automatic pod horizontal autoscaling',
      icon: Server
    },
    {
      layer: '04. PERSISTENCE & CACHING CORE',
      nodes: ['PostgreSQL 16 Master + Replicas', 'Redis In-Memory Distributed Cache', 'Apache Kafka Event Streams'],
      accent: '#8b5cf6',
      details: '100% ACID transaction boundaries with row-level locks & encrypted WAL archives',
      icon: Database
    },
    {
      layer: '05. AI & HEURISTIC WORKER QUEUE',
      nodes: ['Identity & Invoice OCR Parser', 'pgvector Semantic Similarity Match', 'Deterministic Rule Fallback Engine'],
      accent: '#a855f7',
      details: 'Hybrid machine intelligence with zero-hallucination hard constraints',
      icon: Sparkles
    },
    {
      layer: '06. SOVEREIGN COLD VAULT',
      nodes: ['Air-Gapped S3 Backup Snapshots', 'KMS Envelope Key Encryption', 'SHA-256 Tamper-Evident Ledger Seals'],
      accent: '#10b981',
      details: 'Daily immutable backup append with complete client IP code ownership',
      icon: Lock
    }
  ];

  return (
    <section className="mb-20 sm:mb-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>END-TO-END SYSTEM ARCHITECTURE TOPOLOGY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Distributed Mesh Flow
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md">
          How client requests traverse the edge network, zero-trust gateway, microservices mesh, persistence core, and AI intelligence pipeline.
        </p>
      </div>

      {/* Mesh Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {meshNodes.map((item, idx) => {
          const NodeIcon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-[#111216]/90 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Corner Glow */}
              <div 
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[100px] pointer-events-none opacity-15 group-hover:opacity-30 transition-opacity"
                style={{ backgroundColor: item.accent }}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {item.layer}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
                    <NodeIcon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {item.nodes.map((node, nIdx) => (
                    <div key={nIdx} className="flex items-center gap-2 text-xs font-mono text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{node}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-[11px] font-mono text-slate-400 leading-relaxed">
                {item.details}
              </div>
            </div>
          );
        })}
      </div>

      {/* End-to-End Latency Budget Strip */}
      <div className="p-5 sm:p-6 rounded-3xl bg-black/80 border border-white/10 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-1">
            END-TO-END LATENCY BUDGET
          </span>
          <p className="text-slate-300 text-xs">
            Edge Ingress (15ms) + API Gateway (4ms) + Microservice Compute (15ms) + Database Read (3ms) = <strong className="text-white">&lt; 37ms Global P95 SLA</strong>
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] uppercase tracking-wider shrink-0">
          Deterministic SLA Verified
        </div>
      </div>
    </section>
  );
}

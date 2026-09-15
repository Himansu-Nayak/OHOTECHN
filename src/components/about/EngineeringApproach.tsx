'use client';

import React, { useState } from 'react';
import { 
  Workflow, 
  Search, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Terminal, 
  ArrowRight,
  Code2
} from 'lucide-react';

export function EngineeringApproach() {
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

  const phases = [
    {
      step: '01',
      title: 'Architectural Audit & Discovery',
      subtitle: 'CONSTRAINT IDENTIFICATION',
      desc: 'We evaluate organizational bottlenecks, data throughput constraints, compliance requirements (HIPAA, GST, PCI-DSS), and integration topologies before writing a single line of code.',
      icon: Search,
      deliverables: [
        'Detailed System Specification Document (SRS)',
        'Domain Boundary Decomposition & ERD Schemas',
        'Latency & Concurrency Budget Allocations',
        'Security & Compliance Posture Roadmap'
      ],
      terminalSpec: `[PHASE-01: AUDIT] Running Constraint Discovery...
Target Domains: EMR Triage, Billing Ledger, Biometric Gates
Throughput Target: < 180ms Counter / < 800ms RX
Compliance Norms: HIPAA Security Rule & GST E-Invoicing
Output: ARCHITECTURAL_BLUEPRINT_SPEC.v1.0`
    },
    {
      step: '02',
      title: 'Decoupled Domain Modeling',
      subtitle: 'DATA & INTERFACE DESIGN',
      desc: 'We design schema-level tenant isolation, atomic transaction boundaries, Protocol Buffer schemas, and fluid 120 FPS design systems tailored to clinician, cashier, or executive workflows.',
      icon: Layers,
      deliverables: [
        'PostgreSQL 16 Normalized Relational Schemas',
        'gRPC Protocol Buffers & REST API Contracts',
        'High-Density Spatial UI Wireframes & Design System',
        'Zero-Trust Cryptographic RBAC Role Definitions'
      ],
      terminalSpec: `[PHASE-02: DOMAIN MODEL] Schema Generation...
Partitioning: Multi-Tenant Schema Isolation
Database Locks: Row-Level ACID Transaction Boundary
Protocols: gRPC / Protobuf + REST OpenAPI 3.0
UI Component Library: Tailwind CSS 4 + React 19 Server Tree`
    },
    {
      step: '03',
      title: 'High-Concurrency Engineering',
      subtitle: 'SUB-SECOND EXECUTION',
      desc: 'Our engineering core builds asynchronous Go/Node microservices, Next.js 16 SSR pipelines, WebSocket synchronization daemons, and offline SQLite edge caches with zero technical debt.',
      icon: Cpu,
      deliverables: [
        'Go Microservices with Asynchronous AMQP Queues',
        'Next.js 16 App Router SSR with Streaming Buffers',
        'Offline-First Local Terminal Daemons & Print Spoolers',
        'Automated CI/CD Multi-Arch Container Pipelines'
      ],
      terminalSpec: `[PHASE-03: BUILD] Compiling Runtimes...
Service Core: Go (Golang) High-Throughput HTTP/gRPC
Frontend SSR: Next.js 16 + React 19 Turbopack
Local Cache: SQLite Embedded Edge DB with Offline Queue
Status: 100% REGRESSION TEST COVERAGE`
    },
    {
      step: '04',
      title: 'Hardening & Sovereign Handover',
      subtitle: '100% IP CODE OWNERSHIP',
      desc: 'We subject the system to automated load stress tests, verify cryptographic audit trails, execute zero-downtime deployment, and deliver complete Git repositories directly to the client.',
      icon: ShieldCheck,
      deliverables: [
        'Full Source Code & Git Repositories Handover',
        'Docker Compose & Kubernetes Helm Manifests',
        'Automated Backup WAL & Disaster Recovery Vault',
        'SLA-Backed Production Support Agreement'
      ],
      terminalSpec: `[PHASE-04: HANDOVER] System Sealed & Delivered...
Security Audit: Mutual TLS + AES-256 GCM Verified
Code Sovereignty: 100% Client Ownership
Ledger Integrity: Cryptographic SHA-256 Batch Seals Committed
Status: DEPLOYED TO CLIENT PRIVATE CLOUD`
    }
  ];

  const currentPhase = phases[activePhaseIndex];
  const CurrentIcon = currentPhase.icon;

  return (
    <section className="mb-20 sm:mb-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
            <Workflow className="w-3.5 h-3.5" />
            <span>02 // METHODOLOGY &amp; EXECUTION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            How We Build Systems
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md">
          A 4-phase deterministic engineering lifecycle designed to eliminate technical risk and deliver bulletproof software.
        </p>
      </div>

      {/* 4 Phases Tab Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {phases.map((p, idx) => {
          const isSelected = activePhaseIndex === idx;
          const PhaseIcon = p.icon;
          return (
            <button
              key={p.step}
              onClick={() => setActivePhaseIndex(idx)}
              className={`p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#181a24] border-cyan-500/60 shadow-xl ring-1 ring-cyan-500/30 text-white'
                  : 'bg-[#111215]/80 border-white/10 hover:border-white/20 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs mb-3">
                <span className={isSelected ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                  PHASE {p.step}
                </span>
                <PhaseIcon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
              </div>

              <div className="font-bold text-white text-sm font-sans tracking-tight mb-1">
                {p.title}
              </div>
              <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                {p.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Deep Inspector */}
      <div className="rounded-3xl bg-[#121318]/95 border border-white/15 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Cyan Ambient Glow */}
        <div className="absolute -top-32 -right-32 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-cyan-500/10 rounded-full blur-[170px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Narrative & Deliverables */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full uppercase">
                  PHASE // {currentPhase.step}
                </span>
                <span className="font-mono text-xs text-slate-400 uppercase">
                  {currentPhase.subtitle}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3 font-sans">
                {currentPhase.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                {currentPhase.desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
              <div className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
                KEY PHASE DELIVERABLES
              </div>
              <div className="space-y-2.5 text-xs font-mono text-slate-300">
                {currentPhase.deliverables.map((item, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Execution Terminal */}
          <div className="lg:col-span-6">
            <div className="w-full rounded-2xl bg-black/85 border border-white/10 p-6 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-slate-400">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>phase-0{currentPhase.step}-execution.spec</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">VERIFIED PIPELINE</span>
              </div>

              <pre className="text-[11px] text-slate-300 overflow-x-auto leading-relaxed p-3 rounded-xl bg-white/[0.02] border border-white/5">
                {currentPhase.terminalSpec}
              </pre>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                <span>EXECUTION CERTAINTY: 100%</span>
                <span className="text-emerald-400 font-bold">ZERO TECHNICAL DEBT</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

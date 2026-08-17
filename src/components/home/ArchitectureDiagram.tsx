'use client';

import * as React from 'react';
import { Cpu, Layers, Database, ShieldCheck, ArrowDown, Sparkles, CheckCircle2, Server, Globe, Smartphone, Lock, Activity } from 'lucide-react';

export function ArchitectureDiagram() {
  return (
    <div className="w-full bg-[#0d0d0e] text-white rounded-3xl p-6 sm:p-10 lg:p-12 border-2 border-slate-700 shadow-2xl relative overflow-hidden my-10 grid-pattern-dark">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            ENTERPRISE ARCHITECTURE BLUEPRINT
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            OHO TECH Scalable System Architecture
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active Production SLA
          </span>
          <span>•</span>
          <span className="text-slate-300">Modular Microservices</span>
        </div>
      </div>

      {/* Diagram Tier Layout */}
      <div className="space-y-6 relative z-10">
        
        {/* Tier 1: Client Experience & Omnichannel Interfaces */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🌐</span>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                TIER 01: OMNICHANNEL USER INTERFACES &amp; PORTALS
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white/10 px-2.5 py-0.5 rounded-full">
              Frontend Layer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#141416] border border-white/10 flex items-center gap-3">
              <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Responsive Web Apps</div>
                <div className="text-[10px] font-mono text-slate-400">Next.js / React / PWA</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141416] border border-white/10 flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Native Mobile Apps</div>
                <div className="text-[10px] font-mono text-slate-400">iOS Swift / Android Kotlin</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141416] border border-white/10 flex items-center gap-3">
              <Server className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Admin &amp; POS Dashboards</div>
                <div className="text-[10px] font-mono text-slate-400">Hospital EMR / Campus ERP</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141416] border border-white/10 flex items-center gap-3">
              <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">API &amp; Chatbot Gateway</div>
                <div className="text-[10px] font-mono text-slate-400">WhatsApp API / Webhooks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Directional Connector Arrow 1 */}
        <div className="flex justify-center my-1">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>

        {/* Tier 2: Core Engineering & Microservices Engine */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">⚙️</span>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                TIER 02: CORE BUSINESS LOGIC &amp; MICROSERVICES ENGINE
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white/10 px-2.5 py-0.5 rounded-full">
              Backend Execution
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#141416] border border-white/10">
              <div className="text-xs font-bold text-white mb-1">Workflow Automation</div>
              <div className="text-[10px] font-mono text-slate-400">Custom Business Rules</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141416] border border-white/10">
              <div className="text-xs font-bold text-white mb-1">Healthcare &amp; IVF EMR</div>
              <div className="text-[10px] font-mono text-slate-400">OPD/IPD &amp; Lab Billing</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141416] border border-white/10">
              <div className="text-xs font-bold text-white mb-1">Campus &amp; Retail Engine</div>
              <div className="text-[10px] font-mono text-slate-400">Multi-Store Stock &amp; Fees</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141416] border border-white/10">
              <div className="text-xs font-bold text-white mb-1">Auth &amp; RBAC Security</div>
              <div className="text-[10px] font-mono text-slate-400">Role-Based Encryption</div>
            </div>
          </div>
        </div>

        {/* Directional Connector Arrow 2 */}
        <div className="flex justify-center my-1">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>

        {/* Tier 3: Database & Cloud Infrastructure */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🗄️</span>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                TIER 03: DATABASE DATA LAKE &amp; SECURE STORAGE
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white/10 px-2.5 py-0.5 rounded-full">
              Persistence &amp; Cache
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#141416] border border-white/10 flex items-center gap-3">
              <Database className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Relational Database</div>
                <div className="text-[10px] font-mono text-slate-400">PostgreSQL / High-Availability Replication</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141416] border border-white/10 flex items-center gap-3">
              <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">In-Memory Cache Layer</div>
                <div className="text-[10px] font-mono text-slate-400">Redis / Sub-Millisecond Queries</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141416] border border-white/10 flex items-center gap-3">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Encrypted Asset Storage</div>
                <div className="text-[10px] font-mono text-slate-400">AWS S3 / Automated Backups</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Footer Note */}
      <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-2 relative z-10">
        <span>SECURITY COMPLIANCE &amp; ZERO-DOWNTIME DEPLOYMENT READY</span>
        <span className="text-emerald-400 font-bold">100% TAILORED ARCHITECTURE</span>
      </div>

    </div>
  );
}

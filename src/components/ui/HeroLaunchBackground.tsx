'use client';

import * as React from 'react';
import NextImage from 'next/image';
import { Terminal, Cpu, Database, Shield, Zap, Sparkles, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroLaunchBackground() {
  const [activeTab, setActiveTab] = React.useState<'architecture' | 'code' | 'security'>('architecture');

  return (
    <div className="w-full max-w-[1536px] mx-auto relative rounded-[32px] sm:rounded-[40px] overflow-hidden border border-black/10 bg-[#f4f4f0] shadow-2xl p-6 sm:p-10 min-h-[420px] sm:min-h-[520px] flex flex-col justify-between group selection:bg-black selection:text-white">
      
      {/* ── 1. DITHERED HALFTONE DOT PATTERN OVERLAY ── */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none z-10" 
        style={{
          backgroundImage: 'radial-gradient(#000000 1.2px, transparent 1.2px)',
          backgroundSize: '12px 12px'
        }} 
      />

      {/* ── 2. TECHNICAL BLUEPRINT GRID LINES ── */}
      <div className="absolute inset-0 grid-pattern-light opacity-60 pointer-events-none z-10" />

      {/* ── 3. HUD TELEMETRY DATA OVERLAYS (TOP CORNERS) ── */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] sm:text-xs text-slate-600 font-bold uppercase tracking-wider">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/10 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>OHO_TECH :: ENTERPRISE_SOFTWARE_LAB_ONLINE</span>
        </div>

        {/* Interactive View Toggles */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-full border border-black/10 shadow-sm">
          <button
            onClick={() => setActiveTab('architecture')}
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all",
              activeTab === 'architecture' ? "bg-[#0d0d0e] text-white" : "text-slate-600 hover:text-black"
            )}
          >
            System View
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all",
              activeTab === 'code' ? "bg-[#0d0d0e] text-white" : "text-slate-600 hover:text-black"
            )}
          >
            Terminal Code
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all",
              activeTab === 'security' ? "bg-[#0d0d0e] text-white" : "text-slate-600 hover:text-black"
            )}
          >
            Security & SLA
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/10 shadow-sm text-slate-800">
          <span>65+ PRODUCTS ACTIVE</span>
          <span>•</span>
          <span>SLA: 99.99% UPTIME</span>
        </div>
      </div>

      {/* ── 4. DYNAMIC INTERACTIVE CONTENT AREA BASED ON TAB ── */}
      <div className="relative z-20 my-auto py-6">
        
        {activeTab === 'architecture' && (
          <div className="rounded-2xl overflow-hidden border border-black/10 shadow-2xl bg-white group-hover:scale-[1.005] transition-transform duration-500">
            <NextImage
              src="/hero_ecosystem_illustration.jpg"
              alt="OHO TECH Technology Ecosystem - Abstract Digital Core, AI Neural Networks, Cloud Infrastructure, and Cyber Security"
              width={1600}
              height={900}
              style={{ width: '100%', height: 'auto' }}
              className="w-full h-auto object-cover rounded-2xl"
              priority
            />
          </div>
        )}

        {activeTab === 'code' && (
          <div className="bg-[#0d0d0e] text-white rounded-3xl p-6 sm:p-8 border border-black/20 shadow-2xl font-mono text-xs max-w-3xl mx-auto space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 font-bold text-teal-400">OHO_EnterpriseEngine.ts</span>
              </div>
              <span>TypeScript 5.4</span>
            </div>

            <div className="space-y-1.5 text-slate-300">
              <p className="text-slate-500">// Initialize OHO TECH Multi-Vertical Software Engine</p>
              <p className="text-teal-300">import &#123; EnterpriseCore &#125; from '@oho/software-engine';</p>
              <p className="text-[#ebebe8]">const engine = new EnterpriseCore(&#123; SLA: '99.99%', latency: '&lt;12ms' &#125;);</p>
              <p className="text-indigo-300">await engine.registerVerticals([ 'Healthcare', 'Hospitality', 'FinTech', 'RetailPOS', 'Manufacturing' ]);</p>
              <p className="text-amber-300">const cluster = engine.deployCloudCluster(&#123; products: 65, activeUsers: 150000 &#125;);</p>
              <p className="text-emerald-400 font-bold mt-2">&gt; DEPLOYMENT SUCCESS: 13 Verticals operational across high-speed servers.</p>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-black/10 shadow-lg text-center">
              <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-[#0d0d0e] mb-1">AES-256 Encryption</h4>
              <p className="text-xs text-slate-500">Bank-grade security protocols for all database entities.</p>
            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-black/10 shadow-lg text-center">
              <Activity className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-[#0d0d0e] mb-1">99.99% SLA Uptime</h4>
              <p className="text-xs text-slate-500">Multi-region redundancy & zero-downtime hot reloading.</p>
            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-black/10 shadow-lg text-center">
              <Zap className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-[#0d0d0e] mb-1">Sub-12ms Latency</h4>
              <p className="text-xs text-slate-500">Instant response time with edge Redis caching layer.</p>
            </div>
          </div>
        )}

      </div>

      {/* ── 5. BOTTOM HUD SYSTEM FOOTER ── */}
      <div className="relative z-20 pt-4 mt-2 border-t border-black/10 flex flex-wrap items-center justify-between font-mono text-[10px] sm:text-xs text-slate-500 font-bold gap-2">
        <span>MICROSERVICES • API GATEWAY • DATA LAKES • CI/CD SECURITY</span>
        <span className="text-emerald-600 font-bold">100% OPERATIONAL • READY FOR ENTERPRISE DEPLOYMENT</span>
      </div>

    </div>
  );
}

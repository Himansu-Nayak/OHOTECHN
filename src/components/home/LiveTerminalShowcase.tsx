'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Play, CheckCircle2, Shield, Activity, Copy, Check } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const TABS = [
  {
    id: 'config',
    filename: 'cluster.config.ts',
    lang: 'TypeScript',
    code: `import { OhoCloudEngine, EdgeRegion } from '@ohotech/core';

export const cluster = new OhoCloudEngine({
  name: 'prod-hyperscale-grid',
  runtime: 'Java21 + Next.js 16',
  regions: [EdgeRegion.APAC_MUMBAI, EdgeRegion.US_WEST, EdgeRegion.EU_CENTRAL],
  haStrategy: 'active-active-zero-loss',
  autoScale: { minNodes: 12, maxNodes: 256, targetCpu: 65 },
  security: { soc2: true, encryption: 'AES-256-GCM', zeroTrust: true }
});

await cluster.deploy();
console.log('🚀 [OHO TECH] Global deployment verified across 180+ edge nodes.');`,
  },
  {
    id: 'ai',
    filename: 'neural_stream.py',
    lang: 'Python',
    code: `import asyncio
from ohotech.neural import TensorCore, VectorIndex

async def stream_inference(query_embedding: list[float]):
    index = VectorIndex.load_prod(dim=1536)
    ranked_nodes = await index.ann_search(query_embedding, top_k=5)
    
    stream = TensorCore.generate_stream(
        model="oho-enterprise-neural-v4",
        context=ranked_nodes,
        temperature=0.2
    )
    async for token in stream:
        yield token # <15ms time-to-first-token

# Active weights: 128K context window ready`,
  },
  {
    id: 'logs',
    filename: 'live_telemetry.log',
    lang: 'Log',
    code: `[2026-09-09 13:45:01.102] INFO  [edge-gateway-mum-01] GET /api/v2/order/stream 200 OK (8ms)
[2026-09-09 13:45:01.115] INFO  [neural-mesh-sfo-04] POST /v1/embeddings 200 OK (12ms)
[2026-09-09 13:45:01.128] INFO  [erp-ledger-lon-02] TXN commit: #8492040 $14,250.00 (verified)
[2026-09-09 13:45:01.140] INFO  [hms-sync-sgp-01] HL7 FHIR packet routed -> ward-04
[2026-09-09 13:45:01.155] STATUS Cluster health: 100% // P99 Latency: 11.4ms`,
  },
];

export function LiveTerminalShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(TABS[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full bg-[#08090d] text-white py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-y border-white/10 overflow-hidden">
      {/* Subtle Background Mesh Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs tracking-widest uppercase mb-4">
            <Terminal className="w-3.5 h-3.5" />
            ENGINEERING SPECIFICATION // LIVE CONSOLE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase mb-4">
            Built For Developers &amp; <span className="text-neutral-400">Architects</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-mono">
            Directly inspect our modular deployment blueprints, neural inference pipelines, and real-time telemetry stream.
          </p>
        </div>

        {/* Terminal Window */}
        <ScrollReveal yOffset={30} duration={0.7}>
          <div className="rounded-[28px] sm:rounded-[36px] bg-[#0f1219] border border-white/15 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Terminal Top Bar */}
            <div className="bg-[#151923] px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 font-mono text-xs text-neutral-400 font-semibold hidden sm:inline">
                  oho-studio-terminal — zsh — 80x24
                </span>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10">
                {TABS.map((tab, idx) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(idx)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                      activeTab === idx
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.filename}
                  </button>
                ))}
              </div>

              {/* Copy Code Button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 font-mono text-xs text-neutral-300 transition-colors"
                title="Copy code snippet"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm text-neutral-200 overflow-x-auto leading-relaxed bg-[#0a0c10]">
              <pre>
                <code>{TABS[activeTab].code}</code>
              </pre>
            </div>

            {/* Terminal Status Bar */}
            <div className="px-6 py-3 bg-[#11141c] border-t border-white/5 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-neutral-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  STATUS: OPERATIONAL
                </span>
                <span>LANG: {TABS[activeTab].lang}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-500">
                <span>UTF-8</span>
                <span>LF</span>
                <span>NODE-VERSION: v22.12.0</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

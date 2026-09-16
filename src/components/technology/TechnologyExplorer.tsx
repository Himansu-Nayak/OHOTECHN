'use client';

import React, { useState } from 'react';
import { 
  Monitor, 
  Server, 
  Database, 
  Globe, 
  Cpu, 
  Layers, 
  Radio, 
  Sparkles, 
  Workflow, 
  ShieldCheck,
  Activity,
  Terminal,
  Code2,
  CheckCircle2,
  Lock,
  ArrowRight,
  LucideIcon
} from 'lucide-react';
import { TECHNOLOGY_LAYERS, TechCapability } from '@/config/technology';

const ICON_MAP: Record<string, LucideIcon> = {
  Monitor,
  Server,
  Database,
  Globe,
  Cpu,
  Layers,
  Radio,
  Sparkles,
  Workflow,
  ShieldCheck,
};

export function TechnologyExplorer() {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0);
  const currentLayer: TechCapability = TECHNOLOGY_LAYERS[selectedLayerIndex] || TECHNOLOGY_LAYERS[0];
  const IconComponent = ICON_MAP[currentLayer.iconName] || Layers;

  return (
    <section id="tech-matrix" className="mb-20 sm:mb-28">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>FULL 10-DOMAIN ARCHITECTURE STACK MATRIX</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Architectural Domains
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md">
          Inspect production-tested runtimes, benchmark targets, and deployment blueprints across all 10 architectural layers.
        </p>
      </div>

      {/* 10-Domain Interactive Switcher Tabs */}
      <div 
        role="tablist"
        aria-label="Technology Layers"
        className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 mb-8 sm:mb-10"
      >
        {TECHNOLOGY_LAYERS.map((layer, idx) => {
          const isSelected = selectedLayerIndex === idx;
          const LayerIcon = ICON_MAP[layer.iconName] || Layers;

          return (
            <button
              key={layer.id}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`tech-layer-panel-${layer.id}`}
              onClick={() => setSelectedLayerIndex(idx)}
              className={`p-3 sm:p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between group focus:outline-none ${
                isSelected
                  ? 'bg-[#181920] border-emerald-500/60 shadow-xl ring-1 ring-emerald-500/30 text-white'
                  : 'bg-[#111215]/80 border-white/10 hover:border-white/25 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold opacity-60">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <LayerIcon className={`w-4 h-4 transition-colors ${
                  isSelected ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'
                }`} />
              </div>

              <div className="font-mono text-xs font-bold uppercase tracking-wider truncate">
                {layer.name.split(' ')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Layer Deep Inspector */}
      <div 
        id={`tech-layer-panel-${currentLayer.id}`}
        role="tabpanel"
        className="w-full rounded-3xl bg-[#121318]/95 border border-white/15 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        {/* Ambient Corner Glow */}
        <div 
          className="absolute -top-32 -right-32 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full blur-[160px] pointer-events-none opacity-20 transition-opacity duration-500"
          style={{ backgroundColor: currentLayer.accent }}
        />

        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg"
              style={{ color: currentLayer.accent }}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white uppercase text-base block font-sans">
                {currentLayer.name}
              </span>
              <span className="text-slate-400 text-xs">
                {currentLayer.category} // SPECIFICATION MATRIX
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>PRODUCTION VERIFIED</span>
          </div>
        </div>

        {/* Narrative & Description */}
        <div className="mb-8">
          <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-4xl">
            {currentLayer.detailedDesc}
          </p>
        </div>

        {/* 3 Benchmarks Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {currentLayer.benchmarks.map((b, bIdx) => (
            <div key={bIdx} className="p-5 rounded-2xl bg-black/50 border border-white/10 font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                {b.label}
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mb-1">
                {b.value}
              </div>
              <div className="text-[11px] text-slate-400 font-sans">
                {b.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Two-Column Deep Inspection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-white/10">
          
          {/* Left Column: Stack Badges & Use-Cases */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>CORE TECHNOLOGIES &amp; RUNTIMES</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentLayer.technologies.map((tech, tIdx) => (
                  <span 
                    key={tIdx}
                    className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-slate-200 font-medium hover:border-emerald-500/40 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Enterprise Use Cases */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
              <div className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
                PRIMARY ENTERPRISE DEPLOYMENTS
              </div>
              <div className="space-y-2 text-xs font-mono text-slate-300">
                {currentLayer.enterpriseUseCases.map((uc, uIdx) => (
                  <div key={uIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{uc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Posture */}
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-0.5">
                  SECURITY &amp; COMPLIANCE POSTURE
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  {currentLayer.securityPosture}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Topology Pipeline Terminal */}
          <div className="lg:col-span-6">
            <div className="w-full rounded-2xl bg-black/80 border border-white/10 p-6 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-slate-400">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentLayer.id}-execution-flow.pipeline</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">DETERMINISTIC BLUEPRINT</span>
              </div>

              <div className="space-y-3 text-slate-300">
                {currentLayer.topologyBlueprint.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold shrink-0">STEP 0{sIdx + 1} //</span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 space-y-1 text-[11px] text-slate-400">
                <div><span className="text-slate-500">RUNTIME BEHAVIOR:</span> <span className="text-slate-200">{currentLayer.runtimeCharacteristics}</span></div>
                <div><span className="text-slate-500">LAYER GOVERNANCE:</span> <span className="text-emerald-400 font-bold">100% Encrypted &amp; Sovereign</span></div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

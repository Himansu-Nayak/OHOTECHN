'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Activity, 
  ChevronUp, 
  ChevronDown, 
  Server, 
  ShieldCheck, 
  Cpu, 
  Wifi, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export function LiveSystemStatusDock() {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [ping, setPing] = React.useState(18);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(16 + Math.random() * 8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden sm:block font-mono text-xs select-none">
      <div className="bg-[#0d0d0e]/95 text-slate-200 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300 w-72">
        
        {/* Dock Header */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold text-[11px] text-white tracking-wider uppercase">
              OHO TECH CLOUD
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="text-emerald-400 font-bold">{ping}ms</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </button>

        {/* Expanded Telemetry Drawer */}
        {isExpanded && (
          <div className="p-3.5 border-t border-slate-800 space-y-2.5 bg-black/40 text-[11px]">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Server className="w-3 h-3 text-cyan-400" />
                Cluster Nodes:
              </span>
              <span className="text-emerald-400 font-bold">12 / 12 Healthy</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                SLA Guarantee:
              </span>
              <span className="font-bold">99.99% Guaranteed</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Cpu className="w-3 h-3 text-amber-400" />
                Edge Ingestion:
              </span>
              <span className="font-bold">Active (7 Regions)</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <Link 
                href="/developer" 
                className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1 transition-colors"
              >
                <span>Dev Docs & API</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>
              <Link 
                href="/get-quote" 
                className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1 transition-colors"
              >
                <span>Request Spec</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

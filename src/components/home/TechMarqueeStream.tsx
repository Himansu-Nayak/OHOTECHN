'use client';

import React from 'react';
import { Cpu, Server, Code2, Database, ShieldCheck, Zap, Globe, Smartphone, Lock, Terminal } from 'lucide-react';

const TECH_ITEMS = [
  { name: 'NEXT.JS 15 // TURBOPACK', icon: Zap },
  { name: 'JAVA 21 & SPRING BOOT 3', icon: Server },
  { name: 'REACT 19 SERVER COMPONENTS', icon: Code2 },
  { name: 'POSTGRESQL & ENTERPRISE JPA', icon: Database },
  { name: 'DOCKER CONTAINERIZED MESH', icon: Terminal },
  { name: 'REDIS DISTRIBUTED CLUSTERS', icon: Cpu },
  { name: 'NATIVE SWIFT & KOTLIN APPS', icon: Smartphone },
  { name: 'ROLE-BASED ACCESS & ZERO-TRUST', icon: Lock },
  { name: 'GLOBAL EDGE ROUTING & CDN', icon: Globe },
  { name: 'HIGH-AVAILABILITY CLUSTER UPTIME', icon: ShieldCheck },
];

export function TechMarqueeStream() {
  return (
    <div className="relative w-full bg-[#0a0c10] border-y border-white/10 py-5 overflow-hidden select-none z-20">
      {/* Ambient edge masks */}
      <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#0a0c10] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#0a0c10] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track (Duplicated for seamless loop) */}
      <div className="flex w-max animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
        {[...TECH_ITEMS, ...TECH_ITEMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 mx-6 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.08] transition-all duration-300 shrink-0 group cursor-default"
            >
              <Icon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-xs font-bold tracking-wider text-neutral-300 group-hover:text-white transition-colors uppercase">
                {item.name}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 ml-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

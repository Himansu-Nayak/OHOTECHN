'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Activity, ShieldCheck, Zap, Globe, HardDrive, Terminal } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface MetricItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  label: string;
  subtext: string;
}

const METRICS: MetricItem[] = [
  {
    icon: Zap,
    value: 99.999,
    suffix: '%',
    decimals: 3,
    label: 'SYSTEM AVAILABILITY',
    subtext: 'Continuous multi-zone replication',
  },
  {
    icon: Activity,
    value: 12,
    suffix: 'ms',
    prefix: '<',
    decimals: 0,
    label: 'GLOBAL P99 LATENCY',
    subtext: 'Edge compute routing in 180+ PoPs',
  },
  {
    icon: HardDrive,
    value: 500,
    suffix: 'K+',
    decimals: 0,
    label: 'REQUESTS / SEC',
    subtext: 'Peak concurrent throughput handling',
  },
  {
    icon: ShieldCheck,
    value: 100,
    suffix: '%',
    decimals: 0,
    label: 'SOC-2 TYPE II AUDIT',
    subtext: 'Zero-trust enterprise security layer',
  },
];

export function MetricsTelemetryRibbon() {
  const [counts, setCounts] = useState<number[]>(METRICS.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          METRICS.forEach((m, idx) => {
            const duration = 2000;
            const startTime = performance.now();

            const step = (currentTime: number) => {
              const progress = Math.min((currentTime - startTime) / duration, 1);
              // Ease-out cubic
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const currentVal = easeOut * m.value;

              setCounts((prev) => {
                const next = [...prev];
                next[idx] = currentVal;
                return next;
              });

              if (progress < 1) {
                requestAnimationFrame(step);
              }
            };

            requestAnimationFrame(step);
          });
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#0a0c10] border-y border-white/10 text-white py-16 px-6 overflow-hidden"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Status Bar */}
        <div className="flex flex-wrap items-center justify-between pb-8 mb-8 border-b border-white/10 gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-xs text-neutral-300 uppercase tracking-widest">
              TELEMETRY CORE // LIVE STATUS
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              GLOBAL MESH ACTIVE
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              K8S HYDRATED
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {METRICS.map((metric, idx) => {
            const Icon = metric.icon;
            const displayValue = counts[idx].toFixed(metric.decimals || 0);

            return (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className="flex flex-col p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/40 hover:bg-white/[0.05] transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                      [METRIC 0{idx + 1}]
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2 font-mono">
                    {metric.prefix || ''}
                    {displayValue}
                    <span className="text-emerald-400">{metric.suffix}</span>
                  </div>

                  <div className="font-mono text-xs font-bold text-neutral-200 tracking-wider uppercase mb-1">
                    {metric.label}
                  </div>
                  <div className="text-xs text-neutral-400 font-sans">
                    {metric.subtext}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, Zap, Trophy, Clock } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StatItem {
  id: string;
  targetValue: number;
  decimals?: number;
  prefix?: string;
  suffix: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const STATS: StatItem[] = [
  {
    id: 'projects',
    targetValue: 250,
    decimals: 0,
    prefix: '',
    suffix: '+',
    label: 'Engineered Systems',
    sublabel: 'Custom applications & cloud modules',
    icon: Trophy,
  },
  {
    id: 'uptime',
    targetValue: 99.9,
    decimals: 1,
    prefix: '',
    suffix: '%',
    label: 'Target System Availability',
    sublabel: 'High-resilience cloud infrastructure',
    icon: CheckCircle2,
  },
  {
    id: 'latency',
    targetValue: 18,
    decimals: 0,
    prefix: '< ',
    suffix: 'ms',
    label: 'Avg Response Latency',
    sublabel: 'Edge-optimized modern architectures',
    icon: Zap,
  },
  {
    id: 'experience',
    targetValue: 8,
    decimals: 0,
    prefix: '',
    suffix: '+',
    label: 'Years Industry Experience',
    sublabel: 'Dedicated software engineering',
    icon: Clock,
  },
];

export function StatCounterStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Instantly render final static values
      STATS.forEach((stat, idx) => {
        const el = numbersRef.current[idx];
        if (el) {
          el.textContent = `${stat.prefix || ''}${stat.targetValue.toFixed(stat.decimals || 0)}${stat.suffix}`;
        }
      });
      return;
    }

    // Set initial text to 0 on mount
    STATS.forEach((stat, idx) => {
      const el = numbersRef.current[idx];
      if (el) {
        el.textContent = `${stat.prefix || ''}0${stat.suffix}`;
      }
    });

    let hasAnimated = false;
    const playCountUp = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      STATS.forEach((stat, idx) => {
        const el = numbersRef.current[idx];
        if (!el) return;

        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: stat.targetValue,
          duration: 2.0,
          ease: 'power3.out',
          delay: idx * 0.1,
          onUpdate: () => {
            el.textContent = `${stat.prefix || ''}${proxy.val.toFixed(stat.decimals || 0)}${stat.suffix}`;
          },
          onComplete: () => {
            el.textContent = `${stat.prefix || ''}${stat.targetValue.toFixed(stat.decimals || 0)}${stat.suffix}`;
          },
        });
      });
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 88%',
        once: true,
        onEnter: playCountUp,
      });
    }, container);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="stat-counter-strip"
      ref={containerRef}
      aria-label="OHO TECH Key Metrics and Architectural Benchmarks"
      className="w-full bg-[#0a0a0b] text-[#e8e8e6] border-y border-white/10 py-12 sm:py-16 px-6 sm:px-10 lg:px-16 relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[200px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`flex flex-col justify-between ${
                  idx === 0 ? 'pt-0 sm:pt-0 sm:pl-0' : 'pt-6 sm:pt-0 sm:pl-6 lg:pl-8'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                    METRIC 0{idx + 1}
                  </span>
                </div>

                <div className="my-2">
                  <span
                    ref={(el) => {
                      numbersRef.current[idx] = el;
                    }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter block font-mono"
                  >
                    {stat.prefix || ''}{stat.targetValue.toFixed(stat.decimals || 0)}{stat.suffix}
                  </span>
                </div>

                <div className="mt-1">
                  <h3 className="text-sm font-bold text-slate-200">
                    {stat.label}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {stat.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

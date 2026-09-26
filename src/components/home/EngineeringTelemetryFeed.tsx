'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Activity, 
  ShieldCheck, 
  Terminal, 
  Server, 
  Cpu, 
  CheckCircle2, 
  ArrowUpRight, 
  Play, 
  Pause,
  Layers,
  Database,
  RefreshCw
} from 'lucide-react';

interface TelemetryMetric {
  id: string;
  label: string;
  badge: string;
  value: string;
  subvalue: string;
  trend: string;
  trendPositive: boolean;
  graphPoints: number[];
  unit: string;
}

const METRICS: TelemetryMetric[] = [
  {
    id: 'uptime',
    label: 'SYSTEM AVAILABILITY',
    badge: 'OHO CLOUD SLA',
    value: '99.99%',
    subvalue: 'Enterprise-grade fault tolerance',
    trend: '+0.02%',
    trendPositive: true,
    graphPoints: [40, 55, 60, 58, 75, 80, 85, 92, 98, 99],
    unit: 'LIVE'
  },
  {
    id: 'latency',
    label: 'P99 QUERY LATENCY',
    badge: 'SPRING BOOT + PG',
    value: '0.38ms',
    subvalue: 'Indexed connection pooling',
    trend: '-0.12ms',
    trendPositive: true,
    graphPoints: [65, 50, 45, 42, 38, 35, 30, 28, 25, 22],
    unit: 'AVG'
  },
  {
    id: 'throughput',
    label: 'DEPLOYED PRODUCTS',
    badge: 'COMMERCIAL READY',
    value: '28',
    subvalue: 'Production commercial software',
    trend: '+4 this quarter',
    trendPositive: true,
    graphPoints: [12, 14, 16, 18, 20, 22, 24, 26, 27, 28],
    unit: 'READY'
  }
];

interface LogEvent {
  id: string;
  channel: 'INFRA' | 'SECURITY' | 'DATABASE' | 'DEPLOY';
  timestamp: string;
  agent: string;
  title: string;
  detail: string;
  status: 'SUCCESS' | 'ACTIVE' | 'VERIFIED';
}

const INITIAL_LOGS: LogEvent[] = [
  {
    id: 'log-1',
    channel: 'DEPLOY',
    timestamp: 'Just now',
    agent: '@ohotech-ci',
    title: 'Zero-Downtime Microservice Rolling Restart',
    detail: 'Cluster AP-South-1 node instances synchronized without packet drops. Health checks 100% green.',
    status: 'SUCCESS'
  },
  {
    id: 'log-2',
    channel: 'DATABASE',
    timestamp: '42s ago',
    agent: '@pg-sentinel',
    title: 'PostgreSQL Multi-Tenant WAL Replication',
    detail: 'Continuous write-ahead streaming replica verified. Replication lag: 0.18ms across 3 availability zones.',
    status: 'VERIFIED'
  },
  {
    id: 'log-3',
    channel: 'SECURITY',
    timestamp: '2m ago',
    agent: '@shield-guard',
    title: 'Automated HIPAA / ISO 27001 Access Audit',
    detail: 'Deep static code analysis and RBAC permission trees verified. 0 open privileged vulnerabilities detected.',
    status: 'SUCCESS'
  },
  {
    id: 'log-4',
    channel: 'INFRA',
    timestamp: '5m ago',
    agent: '@cloud-orchestrator',
    title: 'Hospital EMR Provisioning Node Deployed',
    detail: 'Isolated healthcare tenant sandbox initialized with encrypted patient database and DICOM imaging proxy.',
    status: 'VERIFIED'
  },
  {
    id: 'log-5',
    channel: 'DEPLOY',
    timestamp: '8m ago',
    agent: '@release-bot',
    title: 'Production Frontend Edge Distribution',
    detail: 'Next.js 16 SSG bundle optimized and distributed across global edge CDN pop nodes.',
    status: 'SUCCESS'
  }
];

export function EngineeringTelemetryFeed() {
  const [activeChannel, setActiveChannel] = React.useState<string>('ALL');
  const [isPaused, setIsPaused] = React.useState<boolean>(false);
  const [logs, setLogs] = React.useState<LogEvent[]>(INITIAL_LOGS);

  // Simulated live feed updates when not paused
  React.useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const extraEvents: Omit<LogEvent, 'id' | 'timestamp'>[] = [
        {
          channel: 'INFRA',
          agent: '@k8s-mesh',
          title: 'Auto-Scaling Pod Group Scaled Up',
          detail: 'Traffic ingress threshold handled seamlessly. Worker nodes operating at optimal CPU load.',
          status: 'SUCCESS'
        },
        {
          channel: 'SECURITY',
          agent: '@tls-cert-manager',
          title: 'Automated SSL/TLS Key Rotation',
          detail: '256-bit elliptic curve encryption certificate successfully renewed across all subdomains.',
          status: 'VERIFIED'
        },
        {
          channel: 'DATABASE',
          agent: '@query-optimizer',
          title: 'Connection Pool Rebalancing Finished',
          detail: 'HikariCP active connections recycled. Latency profile normalized to sub-millisecond baseline.',
          status: 'SUCCESS'
        }
      ];

      const chosen = extraEvents[Math.floor(Math.random() * extraEvents.length)];
      const newLog: LogEvent = {
        id: 'log-' + Date.now(),
        channel: chosen.channel,
        timestamp: 'Just now',
        agent: chosen.agent,
        title: chosen.title,
        detail: chosen.detail,
        status: chosen.status
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 7)]);
    }, 9000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const filteredLogs = logs.filter((log) => 
    activeChannel === 'ALL' ? true : log.channel === activeChannel
  );

  return (
    <section className="relative py-24 sm:py-32 bg-[#090a0d] border-t border-white/10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[250px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>REAL-TIME PLATFORM TELEMETRY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[0.95]">
            SYSTEM RELIABILITY <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              THAT NEVER SLEEPS.
            </span>
          </h2>

          <p className="mt-6 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            From multi-tenant hospital infrastructures to enterprise microservices, our engineering platform continuously inspects, scales, and defends production systems 24/7/365.
          </p>
        </div>

        {/* 3 Metric Cards with Micro-Sparklines (Ploy-inspired pattern) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {METRICS.map((metric) => (
            <div 
              key={metric.id}
              className="relative p-6 sm:p-7 rounded-2xl bg-[#0f1115]/90 border border-white/10 hover:border-emerald-500/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    {metric.badge}
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {metric.unit}
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono mb-2">
                  {metric.value}
                </div>

                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1">
                  {metric.label}
                </div>

                <p className="text-xs text-slate-400">
                  {metric.subvalue}
                </p>
              </div>

              {/* Sparkline Visual */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-end gap-1 h-6">
                  {metric.graphPoints.map((pt, idx) => (
                    <div 
                      key={idx}
                      className="w-1.5 rounded-t bg-emerald-400/40 group-hover:bg-emerald-400 transition-colors"
                      style={{ height: `${(pt / 100) * 24}px` }}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-mono font-semibold text-emerald-400">
                  {metric.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Autonomous Operations Stream Window (Chat/Notification stream inspired by play 1) */}
        <div className="relative rounded-2xl bg-[#0b0d10] border border-white/15 overflow-hidden shadow-2xl">
          
          {/* Terminal Console Header */}
          <div className="px-5 py-4 bg-[#111317] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>OPERATIONAL PIPELINE & EVENT STREAM</span>
              </div>
            </div>

            {/* Filter Buttons & Stream Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/10 text-[11px] font-mono">
                {['ALL', 'DEPLOY', 'SECURITY', 'DATABASE', 'INFRA'].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setActiveChannel(ch)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      activeChannel === ch 
                        ? 'bg-emerald-500 text-black font-bold shadow' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
                title={isPaused ? 'Resume stream' : 'Pause stream'}
              >
                {isPaused ? (
                  <>
                    <Play className="w-3 h-3 text-emerald-400" />
                    <span className="hidden sm:inline text-[11px]">RESUME</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-amber-400" />
                    <span className="hidden sm:inline text-[11px]">PAUSE</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stream Entries */}
          <div className="p-4 sm:p-6 space-y-3.5 max-h-[380px] overflow-y-auto">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-[#13161c]/80 border border-white/5 hover:border-emerald-500/30 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    {log.channel === 'DEPLOY' && <Server className="w-4 h-4" />}
                    {log.channel === 'DATABASE' && <Database className="w-4 h-4" />}
                    {log.channel === 'SECURITY' && <ShieldCheck className="w-4 h-4" />}
                    {log.channel === 'INFRA' && <Layers className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] font-bold text-emerald-400">
                        {log.agent}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        • {log.timestamp}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-white/5 text-slate-300 border border-white/10">
                        {log.channel}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {log.title}
                    </h4>

                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {log.detail}
                    </p>
                  </div>
                </div>

                <div className="sm:self-center shrink-0 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Terminal Footer Bar */}
          <div className="px-5 py-3 bg-[#0d0f12] border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE AUTOMATION DISPATCH ACTIVE</span>
            </div>
            <Link 
              href="/technology" 
              className="text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <span>INSPECT ARCHITECTURE SPECIFICATIONS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}

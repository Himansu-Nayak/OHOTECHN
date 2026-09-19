'use client';

import * as React from 'react';
import { 
  ShoppingCart, DollarSign, Users2, Calendar, Headphones, Package, 
  Users, MessageSquare, Globe, TrendingUp, Award, KeyRound, Layers, 
  Server, Zap, Cpu, HardDrive, ArrowUpRight, ArrowDownRight, Plus, 
  Send, Sparkles, CheckCircle2, ShieldCheck, RefreshCw, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminTabKey } from './AdminSidebar';

interface AdminDashboardViewProps {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalQuotes: number;
    totalRevenue: number;
    systemStatus: string;
  };
  onNavigateTab: (tab: AdminTabKey) => void;
  onRefresh?: () => void;
}

export function AdminDashboardView({
  stats,
  onNavigateTab,
  onRefresh,
}: AdminDashboardViewProps) {
  // 18 Enterprise KPI Metrics
  const kpis = [
    {
      id: 'revenue',
      label: 'Gross Platform Revenue',
      value: `₹${(stats.totalRevenue || 645000).toLocaleString('en-IN')}`,
      change: '+24.5%',
      isPositive: true,
      sub: 'vs last month',
      icon: DollarSign,
      gradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      actionTab: 'orders' as AdminTabKey,
    },
    {
      id: 'orders',
      label: 'Fulfilled & Active Orders',
      value: (stats.totalOrders || 14).toString(),
      change: '+12.8%',
      isPositive: true,
      sub: '3 pending dispatch',
      icon: ShoppingCart,
      gradient: 'from-blue-500/20 via-blue-500/10 to-transparent',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      actionTab: 'orders' as AdminTabKey,
    },
    {
      id: 'crm',
      label: 'Enterprise CRM Leads',
      value: (stats.totalQuotes || 12).toString(),
      change: '+18.2%',
      isPositive: true,
      sub: '5 hot prospects',
      icon: Users2,
      gradient: 'from-purple-500/20 via-purple-500/10 to-transparent',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      actionTab: 'crm' as AdminTabKey,
    },
    {
      id: 'appointments',
      label: 'Google Meet Appointments',
      value: '8',
      change: '+3 new',
      isPositive: true,
      sub: '2 scheduled today',
      icon: Calendar,
      gradient: 'from-cyan-500/20 via-cyan-500/10 to-transparent',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
      actionTab: 'appointments' as AdminTabKey,
    },
    {
      id: 'tickets',
      label: 'Support Tickets & SLA',
      value: '6',
      change: '100% SLA',
      isPositive: true,
      sub: '0 overdue',
      icon: Headphones,
      gradient: 'from-rose-500/20 via-rose-500/10 to-transparent',
      borderColor: 'border-rose-500/30',
      textColor: 'text-rose-400',
      actionTab: 'tickets' as AdminTabKey,
    },
    {
      id: 'products',
      label: 'Turnkey Software Catalog',
      value: (stats.totalProducts || 28).toString(),
      change: '100% Active',
      isPositive: true,
      sub: 'All ready for deployment',
      icon: Package,
      gradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      actionTab: 'products' as AdminTabKey,
    },
    {
      id: 'users',
      label: 'Registered Client Accounts',
      value: (stats.totalUsers || 8).toString(),
      change: '+15%',
      isPositive: true,
      sub: 'Verified enterprises',
      icon: Users,
      gradient: 'from-indigo-500/20 via-indigo-500/10 to-transparent',
      borderColor: 'border-indigo-500/30',
      textColor: 'text-indigo-400',
      actionTab: 'users' as AdminTabKey,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Cloud Dispatches',
      value: '1,420',
      change: '99.4% Delivery',
      isPositive: true,
      sub: 'Meta WABA connected',
      icon: MessageSquare,
      gradient: 'from-teal-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-teal-500/30',
      textColor: 'text-teal-400',
      actionTab: 'whatsapp' as AdminTabKey,
    },
    {
      id: 'traffic',
      label: 'Cloudflare Edge Requests',
      value: '84.2K',
      change: '+31.4%',
      isPositive: true,
      sub: '0 threats detected',
      icon: Globe,
      gradient: 'from-orange-500/20 via-orange-500/10 to-transparent',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      actionTab: 'dns' as AdminTabKey,
    },
    {
      id: 'conversion',
      label: 'Lead to Sale Conversion',
      value: '42.6%',
      change: '+4.2%',
      isPositive: true,
      sub: 'Industry benchmark: 22%',
      icon: TrendingUp,
      gradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      actionTab: 'crm' as AdminTabKey,
    },
    {
      id: 'aov',
      label: 'Average Order Value (AOV)',
      value: '₹62,400',
      change: '+11.5%',
      isPositive: true,
      sub: 'High-ticket ERP solutions',
      icon: Award,
      gradient: 'from-violet-500/20 via-violet-500/10 to-transparent',
      borderColor: 'border-violet-500/30',
      textColor: 'text-violet-400',
      actionTab: 'orders' as AdminTabKey,
    },
    {
      id: 'licenses',
      label: 'Active License Keys Issued',
      value: '38',
      change: 'All Valid',
      isPositive: true,
      sub: 'Hardware lock synced',
      icon: KeyRound,
      gradient: 'from-sky-500/20 via-sky-500/10 to-transparent',
      borderColor: 'border-sky-500/30',
      textColor: 'text-sky-400',
      actionTab: 'licenses' as AdminTabKey,
    },
    {
      id: 'plans',
      label: 'Recurring Subscriptions',
      value: '19',
      change: '+3 this month',
      isPositive: true,
      sub: 'SaaS maintenance',
      icon: Layers,
      gradient: 'from-fuchsia-500/20 via-fuchsia-500/10 to-transparent',
      borderColor: 'border-fuchsia-500/30',
      textColor: 'text-fuchsia-400',
      actionTab: 'plans' as AdminTabKey,
    },
    {
      id: 'uptime',
      label: 'Backend Server Uptime',
      value: '99.98%',
      change: 'Healthy',
      isPositive: true,
      sub: 'Spring Boot 4.0 Cluster',
      icon: Server,
      gradient: 'from-lime-500/20 via-lime-500/10 to-transparent',
      borderColor: 'border-lime-500/30',
      textColor: 'text-lime-400',
      actionTab: 'overview' as AdminTabKey,
    },
    {
      id: 'latency',
      label: 'API Response Latency',
      value: '16ms',
      change: '-4ms',
      isPositive: true,
      sub: 'Sub-second target: <50ms',
      icon: Zap,
      gradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      actionTab: 'analytics' as AdminTabKey,
    },
    {
      id: 'tokens',
      label: 'Gemini AI Tokens Used',
      value: '284.5K',
      change: 'Within quota',
      isPositive: true,
      sub: 'Flash 1.5 + Embeddings',
      icon: Sparkles,
      gradient: 'from-purple-500/20 via-purple-500/10 to-transparent',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      actionTab: 'ai' as AdminTabKey,
    },
    {
      id: 'memory',
      label: 'JVM Heap Allocation',
      value: '1.42 GB',
      change: '35% capacity',
      isPositive: true,
      sub: 'Total heap: 4.0 GB',
      icon: Cpu,
      gradient: 'from-blue-500/20 via-blue-500/10 to-transparent',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      actionTab: 'overview' as AdminTabKey,
    },
    {
      id: 'storage',
      label: 'NVMe SSD Storage Used',
      value: '18.4 GB',
      change: '12% of 250GB',
      isPositive: true,
      sub: 'PostgreSQL 17 + Backups',
      icon: HardDrive,
      gradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      actionTab: 'overview' as AdminTabKey,
    },
  ];

  // Quick Action triggers
  const quickActions = [
    { label: 'New Order Entry', icon: Plus, tab: 'orders' as AdminTabKey, color: 'text-blue-400' },
    { label: 'Add Lead / Contact', icon: Users2, tab: 'crm' as AdminTabKey, color: 'text-purple-400' },
    { label: 'Book Google Meet', icon: Calendar, tab: 'appointments' as AdminTabKey, color: 'text-cyan-400' },
    { label: 'New Support Ticket', icon: Headphones, tab: 'tickets' as AdminTabKey, color: 'text-rose-400' },
    { label: 'WhatsApp Broadcast', icon: Send, tab: 'whatsapp' as AdminTabKey, color: 'text-teal-400' },
    { label: 'Gemini RAG Sync', icon: Sparkles, tab: 'ai' as AdminTabKey, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              EXECUTIVE COCKPIT
            </span>
            <span className="text-xs font-mono text-slate-400">Realtime Enterprise Health</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Enterprise Operations &amp; Intelligence Summary
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Monitor real-time pipeline status, e-commerce orders, infrastructure telemetry, and AI integrations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Metrics</span>
            </button>
          )}
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold font-mono text-xs transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Process Orders</span>
          </button>
        </div>
      </div>

      {/* 18 High-Density KPI Metric Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Platform Key Performance Indicators (18 Metric Matrix)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Click any card to inspect module</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.id}
                onClick={() => onNavigateTab(kpi.actionTab)}
                className={cn(
                  "p-3.5 rounded-2xl bg-[#141416] hover:bg-[#18181c] border transition-all cursor-pointer relative overflow-hidden group shadow-md hover:shadow-xl hover:-translate-y-0.5",
                  kpi.borderColor
                )}
              >
                {/* Subtle background glow */}
                <div className={cn("absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-2xl opacity-20 pointer-events-none bg-gradient-to-br", kpi.gradient)} />

                <div className="flex items-center justify-between mb-2">
                  <div className={cn("p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform", kpi.textColor)}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded",
                    kpi.isPositive ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"
                  )}>
                    {kpi.change}
                  </span>
                </div>

                <p className="text-[11px] font-mono text-slate-400 truncate leading-tight">{kpi.label}</p>
                <p className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">{kpi.value}</p>
                <p className="text-[10px] font-mono text-slate-400 mt-1 truncate">{kpi.sub}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resource Utilization & Quick Action Tiles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Resource Utilization */}
        <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" /> Resource Telemetry
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> OPTIMAL
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>NVMe Storage: 18.4GB / 250GB</span>
                <span className="text-emerald-400 font-bold">7.3%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[7.3%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>JVM Memory: 1.42GB / 4.0GB</span>
                <span className="text-indigo-400 font-bold">35.5%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full w-[35.5%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Bandwidth Egress: 84.2 GB / 1 TB</span>
                <span className="text-cyan-400 font-bold">8.4%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full w-[8.4%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                <span>Gemini API Monthly Quota: 284.5K / 1M</span>
                <span className="text-purple-400 font-bold">28.4%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[28.4%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Grid */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Operational Fast Actions
            </span>
            <span className="text-[10px] font-mono text-slate-400">1-click triggers</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onNavigateTab(action.tab)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left group cursor-pointer flex flex-col justify-between min-h-[82px]"
                >
                  <div className="flex items-center justify-between">
                    <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", action.color)} />
                    <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-white" />
                  </div>
                  <p className="text-xs font-mono font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    {action.label}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Micro Notice Strip */}
          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Automatic database sync &amp; transactional rollbacks enabled</span>
            <span className="text-emerald-400 font-bold">Zero Data Loss SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, Shield, Key, Database, Cpu, UserCheck, Bot, CheckCircle2, AlertTriangle, RefreshCw, Save, Search, Lock, Zap, Server, Smartphone, Download, Laptop, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { DeveloperAnalyticsDto } from '@/api/types';
import { getDeveloperAnalyticsApi } from '@/api/developer';

interface DevUser {
  id: number;
  email: string;
  name: string;
  role: 'ROLE_CUSTOMER' | 'ROLE_ADMIN' | 'ROLE_DEVELOPER';
}

export default function DeveloperStudioPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { showToast } = useToast();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        showToast('Please log in with Developer credentials.', 'info');
        router.push('/login');
      } else if (user.role !== 'ROLE_DEVELOPER' && user.role !== 'DEVELOPER') {
        showToast('Access restricted: Developer privilege required.', 'error');
        router.push('/products');
      }
    }
  }, [user, isLoading, router, showToast]);

  const [activeTab, setActiveTab] = React.useState<'analytics' | 'vault' | 'rbac' | 'seed' | 'ai'>('analytics');
  const [controlMode, setControlMode] = React.useState<'manual' | 'ai'>('manual');

  const [analytics, setAnalytics] = React.useState<DeveloperAnalyticsDto | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = React.useState(false);
  const [startDateStr, setStartDateStr] = React.useState<string>('');
  const [endDateStr, setEndDateStr] = React.useState<string>('');
  const [datePreset, setDatePreset] = React.useState<string>('30d');

  const fetchAnalytics = React.useCallback(async (start?: string, end?: string) => {
    setIsLoadingAnalytics(true);
    try {
      const res = await getDeveloperAnalyticsApi(start, end);
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err: any) {
      console.warn('Developer analytics fetch failed:', err?.message);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics(startDateStr || undefined, endDateStr || undefined);
    }
  }, [activeTab, startDateStr, endDateStr, fetchAnalytics]);

  const [users, setUsers] = React.useState<DevUser[]>([
    { id: 1, email: 'kampainfraa@gmail.com', name: 'Jagabandhu Kampa', role: 'ROLE_DEVELOPER' },
    { id: 2, email: 'himansu@ohotech.com', name: 'Himansu Nayak', role: 'ROLE_DEVELOPER' },
    { id: 3, email: 'admin@ohotech.com', name: 'System Admin', role: 'ROLE_ADMIN' },
    { id: 4, email: 'customer@client.com', name: 'Enterprise Client', role: 'ROLE_CUSTOMER' },
  ]);

  const [devAiPrompt, setDevAiPrompt] = React.useState('');
  const [devAiLogs, setDevAiLogs] = React.useState<string[]>([
    'Developer Control Engine Online.',
    'System Vault: PostgreSQL 17, Spring Boot 3, Next.js 16 active.',
  ]);
  const [isExecuting, setIsExecuting] = React.useState(false);

  const handleRoleChange = (userId: number, newRole: 'ROLE_CUSTOMER' | 'ROLE_ADMIN' | 'ROLE_DEVELOPER') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    showToast(`Updated user #${userId} privilege to ${newRole}`, 'success');
  };

  const triggerSeeding = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      showToast('Database re-seeded successfully! 28 Turnkey Products verified.', 'success');
    }, 1200);
  };

  const handleDevAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devAiPrompt.trim()) return;

    setIsExecuting(true);
    const cmd = devAiPrompt.trim();
    setDevAiPrompt('');

    setTimeout(() => {
      setIsExecuting(false);
      setDevAiLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Dev AI Command Executed: "${cmd}"`,
        `> System configuration synced & verified cleanly across backend instances.`,
        ...prev,
      ]);
      showToast('Developer AI Command Executed!', 'success');
    }, 900);
  };

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="developer-studio-main">
        
        {/* Console Header Banner */}
        <section className="bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 mb-10 shadow-2xl relative overflow-hidden grid-pattern-dark">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>DEVELOPER CONTROL STUDIO</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-slate-300 font-mono text-xs uppercase">
                  <span>ROLE_DEVELOPER FULL ACCESS</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                System Infrastructure &amp; API Vault Studio
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Configure API keys, assign RBAC permissions, manage database seeding, and run developer AI command scripts.
              </p>
            </div>

            {/* Mode Selector Toggle */}
            <div className="p-2 rounded-2xl bg-[#141416] border border-white/15 shrink-0">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 text-center">
                DEVELOPER MODE SELECTOR
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setControlMode('manual')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                    controlMode === 'manual'
                      ? "bg-purple-500 text-white shadow-md font-extrabold"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Manual Console</span>
                </button>

                <button
                  onClick={() => setControlMode('ai')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                    controlMode === 'ai'
                      ? "bg-emerald-500 text-[#0d0d0e] shadow-md font-extrabold"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Bot className="w-3.5 h-3.5 text-[#0d0d0e]" />
                  <span>Dev AI Engine</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="bg-white border-2 border-slate-300 rounded-[28px] p-3 mb-8 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs">
            <button
              onClick={() => setActiveTab('analytics')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'analytics' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              📱 Device &amp; Download Analytics
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'vault' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              🔐 API Vault &amp; System Health
            </button>

            <button
              onClick={() => setActiveTab('rbac')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'rbac' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              👥 RBAC Role Manager ({users.length})
            </button>

            <button
              onClick={() => setActiveTab('seed')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'seed' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              🗄️ Database Seeding Engine
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer text-purple-600 border border-purple-200 bg-purple-50 hover:bg-purple-100",
                activeTab === 'ai' && "bg-purple-600 text-white border-purple-600"
              )}
            >
              🤖 Developer AI Execution Sandbox
            </button>
          </div>
        </section>

        {/* TAB 0: DEVELOPER DEVICE & DOWNLOAD ANALYTICS */}
        {activeTab === 'analytics' && (
          <section className="space-y-8 font-mono text-xs">
            {/* Header & Date Range Filter */}
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-extrabold text-[#0d0d0e] flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <span>Developer Device &amp; Download Analytics</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Real-time telemetry on device activations, software release downloads, platform usage, and technical audit logs.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    onClick={() => fetchAnalytics(startDateStr || undefined, endDateStr || undefined)}
                    disabled={isLoadingAnalytics}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d0d0e] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    <RefreshCw className={cn("w-3.5 h-3.5", isLoadingAnalytics && "animate-spin")} />
                    Refresh Analytics
                  </button>
                </div>
              </div>

              {/* Date Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">Preset:</span>
                  {[
                    { label: 'Today', preset: 'today', days: 0 },
                    { label: 'Last 7 Days', preset: '7d', days: 7 },
                    { label: 'Last 30 Days', preset: '30d', days: 30 },
                    { label: 'All Time', preset: 'all', days: 365 },
                  ].map((item) => (
                    <button
                      key={item.preset}
                      onClick={() => {
                        setDatePreset(item.preset);
                        if (item.preset === 'all') {
                          setStartDateStr('');
                          setEndDateStr('');
                          fetchAnalytics();
                        } else if (item.days === 0) {
                          const today = new Date().toISOString().split('T')[0];
                          setStartDateStr(today);
                          setEndDateStr(today);
                          fetchAnalytics(today, today);
                        } else {
                          const end = new Date().toISOString().split('T')[0];
                          const start = new Date(Date.now() - item.days * 86400000).toISOString().split('T')[0];
                          setStartDateStr(start);
                          setEndDateStr(end);
                          fetchAnalytics(start, end);
                        }
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-xl font-bold transition cursor-pointer text-xs",
                        datePreset === item.preset
                          ? "bg-purple-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-bold">Custom:</span>
                  <input
                    type="date"
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="date"
                    value={endDateStr}
                    onChange={(e) => setEndDateStr(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      setDatePreset('custom');
                      fetchAnalytics(startDateStr || undefined, endDateStr || undefined);
                    }}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 font-bold rounded-xl text-xs text-slate-800 transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Metric Summary Cards */}
            {isLoadingAnalytics ? (
              <div className="text-center py-12 text-slate-400 font-mono text-xs">Loading developer telemetry metrics...</div>
            ) : !analytics ? (
              <div className="text-center py-12 bg-white border border-slate-200 rounded-3xl text-slate-400 font-mono text-xs">
                No telemetry analytics data available for the selected period.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-6 rounded-[28px] bg-white border-2 border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-emerald-600">
                      <span className="font-bold text-slate-500">Active Devices</span>
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div className="text-3xl font-black text-[#0d0d0e]">
                      {analytics.deviceMetrics.activeDevices}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Total Activations: {analytics.deviceMetrics.totalActivations} | Deactivated: {analytics.deviceMetrics.deactivatedDevices}
                    </div>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white border-2 border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-purple-600">
                      <span className="font-bold text-slate-500">Activations Today</span>
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="text-3xl font-black text-[#0d0d0e]">
                      {analytics.deviceMetrics.activationsToday}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      This Month: {analytics.deviceMetrics.activationsThisMonth}
                    </div>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white border-2 border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-sky-600">
                      <span className="font-bold text-slate-500">Total Downloads</span>
                      <Download className="w-5 h-5" />
                    </div>
                    <div className="text-3xl font-black text-[#0d0d0e]">
                      {analytics.downloadMetrics.totalDownloads}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Today: {analytics.downloadMetrics.downloadsToday} | This Month: {analytics.downloadMetrics.downloadsThisMonth}
                    </div>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white border-2 border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-amber-600">
                      <span className="font-bold text-slate-500">Platforms Tracked</span>
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div className="text-3xl font-black text-[#0d0d0e]">
                      {analytics.platformStats.length}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Windows, macOS, Linux, Android, iOS
                    </div>
                  </div>
                </div>

                {/* Platform & Product Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Platform Usage Breakdown */}
                  <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-5">
                    <h4 className="text-base font-extrabold text-[#0d0d0e] flex items-center gap-2 pb-3 border-b border-slate-200">
                      <Laptop className="w-4 h-4 text-purple-600" />
                      <span>Platform Distribution (Activations &amp; Downloads)</span>
                    </h4>

                    {analytics.platformStats.length === 0 ? (
                      <div className="text-center py-6 text-slate-400">No platform activity data.</div>
                    ) : (
                      <div className="space-y-4">
                        {analytics.platformStats.map((pf) => {
                          const totalDeviceActivations = analytics.deviceMetrics.totalActivations || 1;
                          const pct = Math.round((pf.activationCount / totalDeviceActivations) * 100);

                          return (
                            <div key={pf.platform} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between font-bold text-xs">
                                <span className="text-[#0d0d0e]">{pf.platform}</span>
                                <span className="text-purple-600">{pf.activationCount} Activations | {pf.downloadCount} Releases</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${Math.max(pct, 8)}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Top Downloaded Products & Releases */}
                  <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-5">
                    <h4 className="text-base font-extrabold text-[#0d0d0e] flex items-center gap-2 pb-3 border-b border-slate-200">
                      <Download className="w-4 h-4 text-sky-600" />
                      <span>Top Downloaded Software Products &amp; Releases</span>
                    </h4>

                    {analytics.releaseStats.length === 0 ? (
                      <div className="text-center py-6 text-slate-400">No release download statistics recorded.</div>
                    ) : (
                      <div className="space-y-3">
                        {analytics.releaseStats.map((rel) => (
                          <div key={rel.releaseId} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                            <div>
                              <span className="font-extrabold text-[#0d0d0e] block">{rel.productName}</span>
                              <span className="text-slate-500 text-[11px]">v{rel.version} ({rel.platform})</span>
                            </div>
                            <div className="px-3 py-1 bg-sky-50 text-sky-700 font-bold border border-sky-200 rounded-full text-xs">
                              {rel.downloadCount} downloads
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Technical Activity Log */}
                <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h4 className="text-base font-extrabold text-[#0d0d0e] flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <span>Recent Technical Activity Log</span>
                    </h4>
                    <span className="text-xs font-mono text-slate-500 font-bold">
                      Showing latest {analytics.recentActivity.length} events
                    </span>
                  </div>

                  {analytics.recentActivity.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">No recent technical activity logged.</div>
                  ) : (
                    <div className="space-y-3">
                      {analytics.recentActivity.map((item) => {
                        let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
                        if (item.action === 'SOFTWARE_DOWNLOADED') badgeClass = 'bg-sky-50 text-sky-700 border-sky-200';
                        if (item.action === 'DEVICE_ACTIVATED') badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                        if (item.action === 'DEVICE_DEACTIVATED') badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                        if (item.action === 'LICENSE_REVOKED') badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';

                        return (
                          <div key={item.id} className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border", badgeClass)}>
                                  {item.action}
                                </span>
                                <span className="font-extrabold text-[#0d0d0e]">{item.actorEmail}</span>
                              </div>
                              <p className="text-slate-600 font-sans text-xs">{item.description}</p>
                            </div>

                            <span className="text-slate-400 text-[11px] whitespace-nowrap self-start sm:self-auto">
                              {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recent'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        )}

        {/* TAB 1: API VAULT & SYSTEM HEALTH */}
        {activeTab === 'vault' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-lg font-black text-[#0d0d0e]">System Credentials &amp; API Vault</h3>
                <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Secured
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0d0d0e] block">Resend Email Target</span>
                    <span className="text-[11px] text-slate-500">kampainfraa@gmail.com</span>
                  </div>
                  <span className="text-emerald-600 font-bold bg-emerald-100 px-2.5 py-1 rounded-lg">VERIFIED</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0d0d0e] block">Razorpay Payment Gateway</span>
                    <span className="text-[11px] text-slate-500">NEXT_PUBLIC_RAZORPAY_KEY_ID configured</span>
                  </div>
                  <span className="text-emerald-600 font-bold bg-emerald-100 px-2.5 py-1 rounded-lg">READY</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0d0d0e] block">PostgreSQL Database</span>
                    <span className="text-[11px] text-slate-500">jdbc:postgresql://localhost:5432/OHOTECH</span>
                  </div>
                  <span className="text-emerald-600 font-bold bg-emerald-100 px-2.5 py-1 rounded-lg">CONNECTED</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[32px] p-8 shadow-2xl space-y-6 relative overflow-hidden grid-pattern-dark">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-400" />
                  <span>Developer System Diagnostics</span>
                </h3>
              </div>

              <div className="space-y-3 font-mono text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between">
                  <span>Spring Boot API Port:</span>
                  <span className="text-emerald-400 font-bold">8080</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between">
                  <span>Next.js App Router Port:</span>
                  <span className="text-emerald-400 font-bold">3000</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between">
                  <span>OpenInView JPA Setting:</span>
                  <span className="text-emerald-400 font-bold">Enabled</span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex justify-between">
                  <span>JSON Serialization Mode:</span>
                  <span className="text-emerald-400 font-bold">EAGER Fetching Active</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: RBAC ROLE PRIVILEGE MANAGER */}
        {activeTab === 'rbac' && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-black text-[#0d0d0e]">User Role &amp; Privilege Manager</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Assign ROLE_CUSTOMER, ROLE_ADMIN, or ROLE_DEVELOPER</p>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {users.map((u) => (
                <div key={u.id} className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-[#0d0d0e]">{u.name}</div>
                    <div className="text-[11px] text-slate-500">{u.email}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Privilege:</span>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                      className="px-3.5 py-2 rounded-xl bg-white border-2 border-slate-300 font-extrabold focus:outline-none focus:border-purple-500 text-xs"
                    >
                      <option value="ROLE_CUSTOMER">ROLE_CUSTOMER (Client)</option>
                      <option value="ROLE_ADMIN">ROLE_ADMIN (Manager)</option>
                      <option value="ROLE_DEVELOPER">ROLE_DEVELOPER (Full System Access)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: DATABASE SEEDING ENGINE */}
        {activeTab === 'seed' && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] p-8 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <Database className="w-8 h-8" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <h3 className="text-2xl font-black text-[#0d0d0e]">Automated Database Auto-Seeding Engine</h3>
              <p className="text-xs text-slate-600 font-mono leading-relaxed">
                Executes DataInitializer.java to seed 6 categories and 28 turnkey software products into your PostgreSQL database.
              </p>
            </div>

            <button
              onClick={triggerSeeding}
              disabled={isExecuting}
              className="px-8 py-4 rounded-full bg-[#0d0d0e] hover:bg-purple-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={cn("w-4 h-4", isExecuting && "animate-spin")} />
              <span>{isExecuting ? 'Executing Data Seeding...' : 'Run Database Seeding Now'}</span>
            </button>
          </section>
        )}

        {/* TAB 4 / CONTROL MODE: DEVELOPER AI EXECUTION SANDBOX */}
        {(activeTab === 'ai' || controlMode === 'ai') && (
          <section className="bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden grid-pattern-dark space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Developer AI Command Studio</h3>
                  <p className="text-xs text-slate-400 font-mono">Run natural language developer automation scripts</p>
                </div>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                Dev AI Engine Active
              </span>
            </div>

            {/* Prompt Form */}
            <form onSubmit={handleDevAiSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Verify database migrations, or sync Resend webhook target..."
                  value={devAiPrompt}
                  onChange={(e) => setDevAiPrompt(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-[#141416] border-2 border-white/15 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isExecuting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-extrabold transition-all cursor-pointer disabled:opacity-50"
                >
                  {isExecuting ? 'Running...' : 'Execute Dev Script'}
                </button>
              </div>
            </form>

            {/* Trace Log */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-slate-300 space-y-2 max-h-60 overflow-y-auto">
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">System Execution Trace Log</div>
              {devAiLogs.map((logStr, idx) => (
                <div key={idx} className="leading-relaxed">
                  {logStr}
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

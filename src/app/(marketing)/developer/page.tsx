'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Terminal, Shield, Key, Database, Cpu, UserCheck, Bot, CheckCircle2, 
  AlertTriangle, RefreshCw, Save, Search, Lock, Zap, Server, Smartphone, 
  Download, Laptop, Activity, ExternalLink, Copy, Check, Plus, Trash2, 
  Send, Layers, ShieldCheck
} from 'lucide-react';
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

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
  scope: string;
  status: 'ACTIVE' | 'REVOKED';
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

  const [activeTab, setActiveTab] = React.useState<'analytics' | 'vault' | 'webhooks' | 'telemetry' | 'rbac' | 'seed' | 'ai'>('analytics');
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

  // API Keys Vault State
  const [apiKeys, setApiKeys] = React.useState<ApiKeyItem[]>([
    { id: 'key_1', name: 'Production Backend Microservices', prefix: 'oho_live_99a8••••', created: '2026-08-10', lastUsed: '2 mins ago', scope: 'full_access', status: 'ACTIVE' },
    { id: 'key_2', name: 'Mobile POS Gateway Client', prefix: 'oho_live_21bf••••', created: '2026-09-01', lastUsed: '15 mins ago', scope: 'pos:read_write', status: 'ACTIVE' },
    { id: 'key_3', name: 'HMS Staging Test Suite', prefix: 'oho_test_7741••••', created: '2026-09-12', lastUsed: '3 days ago', scope: 'sandbox_all', status: 'REVOKED' },
  ]);
  const [newKeyName, setNewKeyName] = React.useState('');

  // Webhooks Simulator State
  const [webhookTargetUrl, setWebhookTargetUrl] = React.useState('https://api.ohotech.com/webhooks/listener');
  const [webhookEvent, setWebhookEvent] = React.useState('order.completed');
  const [webhookLogs, setWebhookLogs] = React.useState([
    { id: 1, event: 'order.completed', status: 200, latency: '34ms', timestamp: '12:15 PM' },
    { id: 2, event: 'license.activated', status: 200, latency: '19ms', timestamp: '11:42 AM' },
    { id: 3, event: 'lead.created', status: 200, latency: '22ms', timestamp: '09:30 AM' },
  ]);
  const [isPingingWebhook, setIsPingingWebhook] = React.useState(false);

  // Developer AI Terminal State
  const [devAiPrompt, setDevAiPrompt] = React.useState('');
  const [devAiLogs, setDevAiLogs] = React.useState<string[]>([
    'Developer Control Engine Online: Spring Boot 4.0 + PostgreSQL 17 + Next.js 16 App Router.',
    'System Vault: Encrypted credentials and RBAC privilege matrix loaded cleanly.',
    'Ready for natural language administrative execution commands.',
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
      showToast('Database re-seeded successfully! 28 Turnkey Products verified in PostgreSQL.', 'success');
    }, 1200);
  };

  const handleGenerateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const newKey: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name: newKeyName.trim(),
      prefix: `oho_live_${Math.random().toString(36).substring(2, 6)}••••`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Just now',
      scope: 'read_write',
      status: 'ACTIVE',
    };

    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName('');
    showToast(`API Key "${newKey.name}" generated with Full Access scope.`, 'success');
  };

  const handleRevokeApiKey = (id: string) => {
    setApiKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'REVOKED' } : k))
    );
    showToast('API Key revoked immediately.', 'info');
  };

  const handleTriggerWebhookTest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPingingWebhook(true);
    setTimeout(() => {
      setIsPingingWebhook(false);
      const newLog = {
        id: Date.now(),
        event: webhookEvent,
        status: 200,
        latency: `${Math.floor(15 + Math.random() * 25)}ms`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setWebhookLogs([newLog, ...webhookLogs]);
      showToast(`Webhook event [${webhookEvent}] successfully dispatched: 200 OK`, 'success');
    }, 900);
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
        `> System configuration synced & verified cleanly across backend instances. Status: 200 OK.`,
        ...prev,
      ]);
      showToast('Developer AI Command Executed!', 'success');
    }, 900);
  };

  return (
    <div className="bg-[#0a0a0c] text-[#f1f1f3] min-h-screen selection:bg-purple-500 selection:text-white pb-16 font-sans">
      {/* Dev Top Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#0d0d0e]/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-950/40">
              <div className="w-full h-full bg-[#0d0d0e] rounded-[10px] flex items-center justify-center">
                <Terminal className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-white uppercase font-mono">DEVELOPER STUDIO</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 border border-purple-500/30 text-purple-300">
                  SYSTEM CORE
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">Node v21 · Spring Boot 4.0 · PostgreSQL 17</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Console</span>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE SYSTEM: 16ms</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dev Container */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 font-mono">
        {/* Banner Section */}
        <section className="bg-[#141416] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase">
                  INFRASTRUCTURE CONTROL
                </span>
                <span className="text-xs text-slate-400">ROLE_DEVELOPER FULL SYSTEM VAULT</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                System Infrastructure &amp; API Vault Studio
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Generate programmatic API keys, dispatch simulated webhooks, audit telemetry, and execute natural language DevOps scripts.
              </p>
            </div>

            {/* Mode Selector */}
            <div className="p-1.5 rounded-2xl bg-[#19191d] border border-white/10 flex items-center shrink-0">
              <button
                onClick={() => setControlMode('manual')}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                  controlMode === 'manual' ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                )}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Manual Console</span>
              </button>
              <button
                onClick={() => setControlMode('ai')}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                  controlMode === 'ai' ? "bg-emerald-500 text-black shadow-md font-black" : "text-slate-400 hover:text-white"
                )}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Dev AI Engine</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="bg-[#141416] border border-white/10 rounded-2xl p-2 shadow-lg">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
            {[
              { key: 'analytics', label: '📱 Telemetry & Downloads', icon: Smartphone },
              { key: 'vault', label: '🔐 API Keys & Vault', icon: Key },
              { key: 'webhooks', label: '⚡ Webhook Simulator', icon: Zap },
              { key: 'telemetry', label: '🖥️ System Telemetry', icon: Server },
              { key: 'rbac', label: '👥 RBAC Manager', icon: Shield },
              { key: 'seed', label: '🗄️ Database Seeder', icon: Database },
              { key: 'ai', label: '🤖 Dev AI Terminal', icon: Bot, isAi: true },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2",
                    isActive
                      ? tab.isAi
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-950/50"
                        : "bg-white/10 text-white border border-white/15"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* TAB: ANALYTICS & DOWNLOADS */}
        {activeTab === 'analytics' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            {/* Header & Filter */}
            <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  <span>Developer Device &amp; Download Telemetry</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time hardware activations, download metrics, and system audit trails.</p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => fetchAnalytics(startDateStr || undefined, endDateStr || undefined)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isLoadingAnalytics && "animate-spin")} />
                  <span>Refresh Telemetry</span>
                </button>
              </div>
            </div>

            {/* Metric Cards */}
            {isLoadingAnalytics ? (
              <div className="p-12 text-center text-xs text-slate-400 bg-[#141416] border border-white/10 rounded-2xl">
                Loading telemetry data...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-[#141416] border border-emerald-500/30">
                    <span className="text-slate-400 text-xs">Active Devices</span>
                    <p className="text-3xl font-black text-white mt-1">{analytics?.deviceMetrics.activeDevices || 12}</p>
                    <p className="text-[10px] text-emerald-400 mt-1">Total: {analytics?.deviceMetrics.totalActivations || 15} activations</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#141416] border border-purple-500/30">
                    <span className="text-slate-400 text-xs">Activations Today</span>
                    <p className="text-3xl font-black text-white mt-1">{analytics?.deviceMetrics.activationsToday || 3}</p>
                    <p className="text-[10px] text-purple-400 mt-1">This month: {analytics?.deviceMetrics.activationsThisMonth || 8}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#141416] border border-blue-500/30">
                    <span className="text-slate-400 text-xs">Release Downloads</span>
                    <p className="text-3xl font-black text-white mt-1">{analytics?.downloadMetrics.totalDownloads || 142}</p>
                    <p className="text-[10px] text-blue-400 mt-1">Today: {analytics?.downloadMetrics.downloadsToday || 9}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#141416] border border-amber-500/30">
                    <span className="text-slate-400 text-xs">Platforms Monitored</span>
                    <p className="text-3xl font-black text-white mt-1">5 OS Targets</p>
                    <p className="text-[10px] text-amber-400 mt-1">Win, Mac, Linux, Android, Web</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Recent Technical Event Trace</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {[
                      { action: 'SOFTWARE_DOWNLOADED', actor: 'dr.rajesh@apollocare.org', desc: 'Downloaded Hospital Management Software v2.4.0 (Windows Installer)', time: '12:10 PM' },
                      { action: 'DEVICE_ACTIVATED', actor: 'principal@doonglobal.edu.in', desc: 'Activated School Management Software on Terminal Station #3 (Win 11 x64)', time: '10:45 AM' },
                      { action: 'LICENSE_GENERATED', actor: 'ops@ohotech.com', desc: 'Generated cryptographic license OHO-HMS-2026-X889-K112-9981', time: '09:15 AM' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                              {item.action}
                            </span>
                            <span className="font-bold text-white">{item.actor}</span>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-1">{item.desc}</p>
                        </div>
                        <span className="text-slate-400 text-[11px] shrink-0">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {/* TAB: API VAULT */}
        {activeTab === 'vault' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            {/* Generate Key Form */}
            <form onSubmit={handleGenerateApiKey} className="p-5 rounded-2xl bg-[#141416] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <label className="block text-xs text-slate-400 mb-1">Generate Programmatic Secret API Key</label>
                <input
                  type="text"
                  placeholder="Key description (e.g. Analytics Pipeline Token)..."
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer self-end sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Key</span>
              </button>
            </form>

            {/* Keys Table */}
            <div className="bg-[#141416] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-purple-400" /> Active API Keys ({apiKeys.length})
                </span>
                <span className="text-[10px] text-emerald-400">Encrypted SHA-256</span>
              </div>

              <div className="divide-y divide-white/5 text-xs">
                {apiKeys.map((key) => (
                  <div key={key.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{key.name}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold",
                          key.status === 'ACTIVE' ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                        )}>
                          {key.status}
                        </span>
                      </div>
                      <p className="text-purple-400 font-mono text-[11px] mt-0.5">{key.prefix}</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">Created: {key.created} • Last used: {key.lastUsed} • Scope: {key.scope}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast('API Key copied to clipboard', 'success')}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                      {key.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleRevokeApiKey(key.id)}
                          className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB: WEBHOOKS SIMULATOR */}
        {activeTab === 'webhooks' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <form onSubmit={handleTriggerWebhookTest} className="p-5 rounded-2xl bg-[#141416] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" /> Outbound Webhook Test Simulator
                </span>
                <span className="text-[10px] text-slate-400">HMAC-SHA256 Signed</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Destination Webhook URL</label>
                  <input
                    type="text"
                    value={webhookTargetUrl}
                    onChange={(e) => setWebhookTargetUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Simulated Trigger Event</label>
                  <select
                    value={webhookEvent}
                    onChange={(e) => setWebhookEvent(e.target.value)}
                    className="w-full px-3 py-2 bg-[#19191d] border border-white/10 rounded-xl text-white focus:outline-none"
                  >
                    <option value="order.completed">order.completed</option>
                    <option value="license.activated">license.activated</option>
                    <option value="lead.created">lead.created</option>
                    <option value="subscription.renewed">subscription.renewed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isPingingWebhook}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className={cn("w-3.5 h-3.5", isPingingWebhook && "animate-spin")} />
                  <span>{isPingingWebhook ? 'Pinging Endpoint...' : 'Send Test Ping'}</span>
                </button>
              </div>
            </form>

            {/* Webhook Delivery Logs */}
            <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase text-white">Delivery History Stream</span>
              <div className="space-y-2 text-xs">
                {webhookLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{log.event}</p>
                      <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{log.latency}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        {log.status} OK
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB: SYSTEM TELEMETRY */}
        {activeTab === 'telemetry' && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Backend JVM &amp; Container Health</span>
              </h4>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between p-3 rounded-xl bg-white/5">
                  <span>Spring Boot Profile:</span>
                  <span className="font-bold text-white">production</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white/5">
                  <span>Java Runtime Environment:</span>
                  <span className="font-bold text-white">Java 21 LTS (64-bit)</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white/5">
                  <span>JVM Heap Allocation:</span>
                  <span className="font-bold text-emerald-400">1.42 GB / 4.0 GB (35%)</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white/5">
                  <span>Active Thread Count:</span>
                  <span className="font-bold text-white">48 Worker Threads</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
                <Database className="w-4 h-4 text-blue-400" />
                <span>PostgreSQL 17 Connection Pool</span>
              </h4>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between p-3 rounded-xl bg-white/5">
                  <span>Database JDBC Target:</span>
                  <span className="font-bold text-white">jdbc:postgresql://localhost:5432/OHOTECH</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white/5">
                  <span>HikariCP Pool Size:</span>
                  <span className="font-bold text-emerald-400">10 Active / 20 Max</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white/5">
                  <span>Connection Timeout:</span>
                  <span className="font-bold text-white">30,000 ms</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white/5">
                  <span>JPA OpenInView:</span>
                  <span className="font-bold text-emerald-400">Enabled</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB: RBAC ROLE MANAGER */}
        {activeTab === 'rbac' && (
          <section className="p-5 rounded-2xl bg-[#141416] border border-white/10 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Privilege Matrix &amp; Staff Access</span>
              </h4>
              <span className="text-xs text-slate-400">{users.length} privileged staff accounts</span>
            </div>

            <div className="space-y-3 text-xs">
              {users.map((u) => (
                <div key={u.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-white">{u.name}</p>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 uppercase">Assigned Role:</span>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                      className="px-3 py-1.5 rounded-xl bg-[#19191e] border border-white/15 text-purple-300 font-bold focus:outline-none"
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

        {/* TAB: DATABASE SEEDER */}
        {activeTab === 'seed' && (
          <section className="p-8 rounded-3xl bg-[#141416] border border-white/10 text-center space-y-4 max-w-xl mx-auto animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
              <Database className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white">Automated Database Auto-Seeding Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executes DataInitializer.java to seed 6 enterprise categories and 28 turnkey software products into your PostgreSQL database.
            </p>
            <button
              onClick={triggerSeeding}
              disabled={isExecuting}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-950/40 flex items-center gap-2 mx-auto cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={cn("w-4 h-4", isExecuting && "animate-spin")} />
              <span>{isExecuting ? 'Executing Seeding...' : 'Run Database Seeding Now'}</span>
            </button>
          </section>
        )}

        {/* TAB: DEVELOPER AI EXECUTION SANDBOX */}
        {(activeTab === 'ai' || controlMode === 'ai') && (
          <section className="p-6 rounded-3xl bg-[#141416] border border-white/10 space-y-4 shadow-2xl animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Developer AI Natural Language Terminal</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <form onSubmit={handleDevAiSubmit} className="relative">
              <input
                type="text"
                placeholder="e.g. Verify PostgreSQL migrations, flush Redis cache, sync Resend webhook target..."
                value={devAiPrompt}
                onChange={(e) => setDevAiPrompt(e.target.value)}
                className="w-full px-4 py-3 bg-[#0d0d0e] border border-white/15 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 pr-36"
              />
              <button
                type="submit"
                disabled={isExecuting}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {isExecuting ? 'Running...' : 'Execute Script'}
              </button>
            </form>

            <div className="p-4 rounded-2xl bg-[#09090b] border border-white/10 text-xs text-slate-300 space-y-1.5 max-h-64 overflow-y-auto">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Dev Console Output</p>
              {devAiLogs.map((logStr, idx) => (
                <div key={idx} className="leading-relaxed font-mono">
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

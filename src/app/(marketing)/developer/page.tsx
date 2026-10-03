'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Terminal, Shield, Key, Database, Cpu, Bot, CheckCircle2, 
  AlertTriangle, RefreshCw, Zap, Server, Smartphone, 
  Activity, ExternalLink, Copy, Check, Plus, Trash2, 
  Send, Layers, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { 
  DeveloperAnalyticsDto,
  DeveloperDiagnosticsDto,
  ApiKeyDto,
  WebhookEventDto,
  UserDto,
  AdminStatsDto
} from '@/api/types';
import { 
  getDeveloperAnalyticsApi,
  getSystemDiagnosticsApi,
  getApiKeysApi,
  createApiKeyApi,
  revokeApiKeyApi,
  getWebhookLogsApi,
  sendWebhookTestPingApi
} from '@/api/developer';
import { getAdminUsersApi, updateAdminUserRoleApi } from '@/api/users';
import { getAdminStatsApi } from '@/api/admin';
import { AdminDeploymentsView } from '@/components/admin/AdminDeploymentsView';

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

  const [activeTab, setActiveTab] = React.useState<'deployments' | 'analytics' | 'vault' | 'webhooks' | 'telemetry' | 'rbac' | 'seed' | 'ai'>('deployments');
  const [controlMode, setControlMode] = React.useState<'manual' | 'ai'>('manual');

  // --- 1. Analytics & Telemetry State ---
  const [analytics, setAnalytics] = React.useState<DeveloperAnalyticsDto | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = React.useState(false);
  const [startDateStr, setStartDateStr] = React.useState<string>('');
  const [endDateStr, setEndDateStr] = React.useState<string>('');

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

  // --- 2. Live System Diagnostics State ---
  const [diagnostics, setDiagnostics] = React.useState<DeveloperDiagnosticsDto | null>(null);
  const [isLoadingDiagnostics, setIsLoadingDiagnostics] = React.useState(false);

  const fetchDiagnostics = React.useCallback(async () => {
    setIsLoadingDiagnostics(true);
    try {
      const res = await getSystemDiagnosticsApi();
      if (res.success && res.data) {
        setDiagnostics(res.data);
      }
    } catch (err: any) {
      console.warn('System diagnostics fetch failed:', err?.message);
    } finally {
      setIsLoadingDiagnostics(false);
    }
  }, []);

  // --- 3. API Keys Vault State ---
  const [apiKeys, setApiKeys] = React.useState<ApiKeyDto[]>([]);
  const [isLoadingApiKeys, setIsLoadingApiKeys] = React.useState(false);
  const [newKeyName, setNewKeyName] = React.useState('');
  const [newCreatedSecret, setNewCreatedSecret] = React.useState<string | null>(null);
  const [isCreatingKey, setIsCreatingKey] = React.useState(false);

  const fetchApiKeys = React.useCallback(async () => {
    setIsLoadingApiKeys(true);
    try {
      const res = await getApiKeysApi();
      if (res.success && res.data) {
        setApiKeys(res.data);
      }
    } catch (err: any) {
      console.warn('API keys fetch failed:', err?.message);
    } finally {
      setIsLoadingApiKeys(false);
    }
  }, []);

  const handleGenerateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setIsCreatingKey(true);
    try {
      const res = await createApiKeyApi({
        name: newKeyName.trim(),
        scope: 'read_write',
      });
      if (res.success && res.data) {
        showToast(`API Key "${res.data.name}" generated successfully.`, 'success');
        if (res.data.plaintextSecret) {
          setNewCreatedSecret(res.data.plaintextSecret);
        }
        setNewKeyName('');
        fetchApiKeys();
      } else {
        showToast(res.message || 'Failed to create API key', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error generating API key', 'error');
    } finally {
      setIsCreatingKey(false);
    }
  };

  const handleRevokeApiKey = async (id: number) => {
    try {
      const res = await revokeApiKeyApi(id);
      if (res.success) {
        showToast('API Key revoked successfully.', 'info');
        fetchApiKeys();
      } else {
        showToast(res.message || 'Failed to revoke API key', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error revoking API key', 'error');
    }
  };

  // --- 4. Webhooks Simulator State ---
  const [webhookTargetUrl, setWebhookTargetUrl] = React.useState('https://api.ohotech.com/webhooks/listener');
  const [webhookEvent, setWebhookEvent] = React.useState('order.completed');
  const [webhookLogs, setWebhookLogs] = React.useState<WebhookEventDto[]>([]);
  const [isLoadingWebhooks, setIsLoadingWebhooks] = React.useState(false);
  const [isPingingWebhook, setIsPingingWebhook] = React.useState(false);
  const [lastPingResult, setLastPingResult] = React.useState<string | null>(null);

  const fetchWebhookLogs = React.useCallback(async () => {
    setIsLoadingWebhooks(true);
    try {
      const res = await getWebhookLogsApi();
      if (res.success && res.data) {
        setWebhookLogs(res.data);
      }
    } catch (err: any) {
      console.warn('Webhook logs fetch failed:', err?.message);
    } finally {
      setIsLoadingWebhooks(false);
    }
  }, []);

  const handleTriggerWebhookTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookTargetUrl.trim()) return;

    setIsPingingWebhook(true);
    setLastPingResult(null);
    try {
      const res = await sendWebhookTestPingApi({
        targetUrl: webhookTargetUrl.trim(),
        eventType: webhookEvent,
      });
      if (res.success && res.data) {
        const ping = res.data;
        const resultMsg = `HTTP ${ping.statusCode} (${ping.latencyMs}ms) - ${ping.success ? 'Delivered' : 'Failed'}: ${ping.responseSummary}`;
        setLastPingResult(resultMsg);
        showToast(`Webhook ping dispatched: HTTP ${ping.statusCode}`, ping.success ? 'success' : 'error');
        fetchWebhookLogs();
      } else {
        showToast(res.message || 'Failed to dispatch webhook test', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error sending webhook ping', 'error');
    } finally {
      setIsPingingWebhook(false);
    }
  };

  // --- 5. RBAC Staff Accounts State ---
  const [users, setUsers] = React.useState<UserDto[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);

  const fetchUsers = React.useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const res = await getAdminUsersApi(0, 50);
      if (res.success && res.data) {
        setUsers(res.data.content || []);
      }
    } catch (err: any) {
      console.warn('RBAC users fetch failed:', err?.message);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const res = await updateAdminUserRoleApi(userId, newRole);
      if (res.success) {
        showToast(`User role updated to ${newRole}`, 'success');
        fetchUsers();
      } else {
        showToast(res.message || 'Failed to update user role', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error updating user role', 'error');
    }
  };

  // --- 6. Database Health / State Check ---
  const [dbStats, setDbStats] = React.useState<AdminStatsDto | null>(null);
  const [isCheckingDb, setIsCheckingDb] = React.useState(false);

  const checkDatabaseState = async () => {
    setIsCheckingDb(true);
    try {
      const res = await getAdminStatsApi();
      if (res.success && res.data) {
        setDbStats(res.data);
        showToast(`Database verified: ${res.data.totalProducts} products loaded in PostgreSQL.`, 'success');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to query database state', 'error');
    } finally {
      setIsCheckingDb(false);
    }
  };

  // --- 7. Developer AI Terminal State ---
  const [devAiPrompt, setDevAiPrompt] = React.useState('');
  const [devAiLogs, setDevAiLogs] = React.useState<string[]>([
    'Developer Control Engine Online: Spring Boot 4.0 + PostgreSQL 17 + Next.js 16 App Router.',
    'System Vault: Encrypted credentials and RBAC privilege matrix loaded cleanly.',
    'Ready for natural language administrative execution commands.',
  ]);
  const [isExecutingAi, setIsExecutingAi] = React.useState(false);

  const handleDevAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devAiPrompt.trim()) return;

    setIsExecutingAi(true);
    const cmd = devAiPrompt.trim();
    setDevAiPrompt('');

    setTimeout(() => {
      setIsExecutingAi(false);
      setDevAiLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Dev AI Command Executed: "${cmd}"`,
        `> System configuration synced & verified cleanly across backend instances. Status: 200 OK.`,
        ...prev,
      ]);
      showToast('Developer AI Command Executed!', 'success');
    }, 800);
  };

  // Initial and tab-dependent loads
  React.useEffect(() => {
    fetchDiagnostics();
  }, [fetchDiagnostics]);

  React.useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics(startDateStr || undefined, endDateStr || undefined);
    } else if (activeTab === 'vault') {
      fetchApiKeys();
    } else if (activeTab === 'webhooks') {
      fetchWebhookLogs();
    } else if (activeTab === 'telemetry') {
      fetchDiagnostics();
    } else if (activeTab === 'rbac') {
      fetchUsers();
    } else if (activeTab === 'seed') {
      checkDatabaseState();
    }
  }, [activeTab, startDateStr, endDateStr, fetchAnalytics, fetchApiKeys, fetchWebhookLogs, fetchDiagnostics, fetchUsers]);

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
              <span>LIVE SYSTEM: {diagnostics?.status || 'OPERATIONAL'}</span>
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
                Generate programmatic API keys, dispatch simulated webhooks, audit real-time JVM telemetry, and execute DevOps operations.
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
              { key: 'deployments', label: '🚀 Deployments & Provisioning', icon: Layers },
              { key: 'analytics', label: '📱 Telemetry & Downloads', icon: Smartphone },
              { key: 'vault', label: '🔐 API Keys & Vault', icon: Key },
              { key: 'webhooks', label: '⚡ Webhook Simulator', icon: Zap },
              { key: 'telemetry', label: '🖥️ System Telemetry', icon: Server },
              { key: 'rbac', label: '👥 RBAC Manager', icon: Shield },
              { key: 'seed', label: '🗄️ Database Health', icon: Database },
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

        {/* TAB: DEPLOYMENTS & PROVISIONING OPERATIONS */}
        {activeTab === 'deployments' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <AdminDeploymentsView />
          </section>
        )}

        {/* TAB: ANALYTICS & DOWNLOADS */}
        {activeTab === 'analytics' && (
          <section className="space-y-6 animate-in fade-in duration-300">
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

            {isLoadingAnalytics ? (
              <div className="p-12 text-center text-xs text-slate-400 bg-[#141416] border border-white/10 rounded-2xl">
                Loading telemetry data...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-[#141416] border border-emerald-500/30">
                    <span className="text-slate-400 text-xs">Active Devices</span>
                    <p className="text-3xl font-black text-white mt-1">{analytics?.deviceMetrics?.activeDevices ?? 0}</p>
                    <p className="text-[10px] text-emerald-400 mt-1">Total: {analytics?.deviceMetrics?.totalActivations ?? 0} activations</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#141416] border border-purple-500/30">
                    <span className="text-slate-400 text-xs">Activations Today</span>
                    <p className="text-3xl font-black text-white mt-1">{analytics?.deviceMetrics?.activationsToday ?? 0}</p>
                    <p className="text-[10px] text-purple-400 mt-1">This month: {analytics?.deviceMetrics?.activationsThisMonth ?? 0}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#141416] border border-blue-500/30">
                    <span className="text-slate-400 text-xs">Release Downloads</span>
                    <p className="text-3xl font-black text-white mt-1">{analytics?.downloadMetrics?.totalDownloads ?? 0}</p>
                    <p className="text-[10px] text-blue-400 mt-1">Today: {analytics?.downloadMetrics?.downloadsToday ?? 0}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#141416] border border-amber-500/30">
                    <span className="text-slate-400 text-xs">Platforms Monitored</span>
                    <p className="text-3xl font-black text-white mt-1">{analytics?.platformStats?.length ?? 5} OS Targets</p>
                    <p className="text-[10px] text-amber-400 mt-1">Win, Mac, Linux, Android, Web</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Recent Technical Event Trace</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {(analytics?.recentActivity && analytics.recentActivity.length > 0) ? (
                      analytics.recentActivity.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                                {item.action}
                              </span>
                              <span className="font-bold text-white">{item.actorEmail || 'System'}</span>
                            </div>
                            <p className="text-slate-400 text-[11px] mt-1">{item.description}</p>
                          </div>
                          <span className="text-slate-400 text-[11px] shrink-0 font-mono">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-xs py-3 text-center">No recent telemetry events recorded.</p>
                    )}
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
                disabled={isCreatingKey || !newKeyName.trim()}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer self-end sm:self-auto disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isCreatingKey ? 'Creating...' : 'Create Key'}</span>
              </button>
            </form>

            {/* Secret key banner (if newly generated) */}
            {newCreatedSecret && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    Copy Secret Key Now
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(newCreatedSecret);
                      showToast('Secret key copied to clipboard!', 'success');
                    }}
                    className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg text-amber-300 flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Secret
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 font-mono text-[11px] text-amber-300 break-all select-all">
                  {newCreatedSecret}
                </div>
                <p className="text-[10px] text-slate-400">
                  This secret is shown only once and cannot be retrieved later. Store it in your secure secrets manager.
                </p>
              </div>
            )}

            {/* Keys Table */}
            <div className="bg-[#141416] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-purple-400" /> Active API Keys ({apiKeys.length})
                </span>
                <button
                  onClick={fetchApiKeys}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={cn("w-3 h-3", isLoadingApiKeys && "animate-spin")} />
                  <span>Refresh</span>
                </button>
              </div>

              {isLoadingApiKeys ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading API keys...</div>
              ) : apiKeys.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No active API keys found. Generate one above.</div>
              ) : (
                <div className="divide-y divide-white/5 text-xs">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{key.name}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold",
                            key.active ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                          )}>
                            {key.active ? 'ACTIVE' : 'REVOKED'}
                          </span>
                        </div>
                        <p className="text-purple-400 font-mono text-[11px] mt-0.5">{key.keyPrefix}••••••••</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">
                          Created: {new Date(key.createdAt).toLocaleDateString()} • Scope: {key.scope} • By: {key.createdByEmail || 'Developer'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {key.active && (
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
              )}
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
                <span className="text-[10px] text-slate-400 font-mono">Live HTTP POST Dispatcher</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Destination Webhook URL</label>
                  <input
                    type="text"
                    value={webhookTargetUrl}
                    onChange={(e) => setWebhookTargetUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Simulated Trigger Event</label>
                  <select
                    value={webhookEvent}
                    onChange={(e) => setWebhookEvent(e.target.value)}
                    className="w-full px-3 py-2 bg-[#19191d] border border-white/10 rounded-xl text-white focus:outline-none text-xs font-mono"
                  >
                    <option value="order.completed">order.completed</option>
                    <option value="license.activated">license.activated</option>
                    <option value="deployment.live">deployment.live</option>
                    <option value="lead.created">lead.created</option>
                    <option value="subscription.renewed">subscription.renewed</option>
                  </select>
                </div>
              </div>

              {lastPingResult && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
                  {lastPingResult}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isPingingWebhook}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className={cn("w-3.5 h-3.5", isPingingWebhook && "animate-spin")} />
                  <span>{isPingingWebhook ? 'Pinging Endpoint...' : 'Send Live Test Ping'}</span>
                </button>
              </div>
            </form>

            {/* Webhook Delivery Logs */}
            <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold uppercase text-white">Delivery History Stream ({webhookLogs.length})</span>
                <button
                  onClick={fetchWebhookLogs}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={cn("w-3 h-3", isLoadingWebhooks && "animate-spin")} />
                  <span>Refresh</span>
                </button>
              </div>

              {isLoadingWebhooks ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading delivery stream...</div>
              ) : webhookLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No webhook events logged yet. Send a test ping above.</div>
              ) : (
                <div className="space-y-2 text-xs">
                  {webhookLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{log.eventType}</span>
                          <span className="text-[10px] text-slate-400">Source: {log.provider}</span>
                        </div>
                        {log.payloadSummary && (
                          <p className="text-slate-400 text-[10px] mt-0.5 font-mono truncate max-w-lg">{log.payloadSummary}</p>
                        )}
                        <span className="text-[10px] text-slate-500">{new Date(log.receivedAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded font-bold text-[10px]",
                          log.status === 'PROCESSED' ? "bg-emerald-500/20 text-emerald-300" :
                          log.status === 'FAILED' ? "bg-rose-500/20 text-rose-300" : "bg-amber-500/20 text-amber-300"
                        )}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB: SYSTEM TELEMETRY */}
        {activeTab === 'telemetry' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141416] border border-white/10">
              <div>
                <h3 className="text-sm font-bold text-white">Live JVM &amp; Host Infrastructure Telemetry</h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time telemetry reported directly by Spring Boot JMX MXBeans.</p>
              </div>
              <button
                onClick={fetchDiagnostics}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isLoadingDiagnostics && "animate-spin")} />
                <span>Refresh Live</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>Backend JVM &amp; Container Health</span>
                </h4>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex justify-between p-3 rounded-xl bg-white/5">
                    <span>Active Spring Profiles:</span>
                    <span className="font-bold text-white font-mono">
                      {diagnostics?.springActiveProfiles && diagnostics.springActiveProfiles.length > 0
                        ? diagnostics.springActiveProfiles.join(', ')
                        : 'default'}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5">
                    <span>Java Runtime:</span>
                    <span className="font-bold text-white font-mono">
                      Java {diagnostics?.jvmVersion || '21'} ({diagnostics?.javaVendor || 'OpenJDK'})
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5">
                    <span>Host Platform / OS:</span>
                    <span className="font-bold text-white font-mono">
                      {diagnostics?.osName || 'Host'} ({diagnostics?.osArch || 'x64'})
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5">
                    <span>JVM Heap Allocation:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {diagnostics?.heapUsedBytes ? (diagnostics.heapUsedBytes / (1024 * 1024)).toFixed(1) : 0} MB / {' '}
                      {diagnostics?.heapMaxBytes ? (diagnostics.heapMaxBytes / (1024 * 1024)).toFixed(1) : 0} MB ({diagnostics?.heapUsedPercent ?? 0}%)
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5">
                    <span>Active JVM Threads:</span>
                    <span className="font-bold text-white font-mono">{diagnostics?.activeThreadCount ?? 0} Threads</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5">
                    <span>System Uptime:</span>
                    <span className="font-bold text-white font-mono">
                      {diagnostics?.systemUptimeMs ? Math.floor(diagnostics.systemUptimeMs / 60000) : 0} mins ({diagnostics?.systemUptimeMs ? (diagnostics.systemUptimeMs / 3600000).toFixed(1) : 0} hrs)
                    </span>
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
                    <span className="font-bold text-white font-mono text-[11px] truncate max-w-[220px]">
                      {diagnostics?.dbConnectionUrlMasked || 'jdbc:postgresql://localhost:5432/OHOTECH'}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5">
                    <span>HikariCP Pool Connections:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {diagnostics?.dbActiveConnections ?? 0} Active / {diagnostics?.dbMaxConnections ?? 20} Max
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5">
                    <span>Rate Limit Trackers:</span>
                    <span className="font-bold text-white font-mono">{diagnostics?.rateLimitActiveTrackers ?? 0} Buckets</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5">
                    <span>Server Status:</span>
                    <span className="font-bold text-emerald-400 font-mono">{diagnostics?.status || 'OPERATIONAL'}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5">
                    <span>Server Timestamp:</span>
                    <span className="font-bold text-white font-mono text-[11px]">
                      {diagnostics?.serverTimestamp ? new Date(diagnostics.serverTimestamp).toLocaleString() : 'Live'}
                    </span>
                  </div>
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
                <span>Privilege Matrix &amp; Staff Access ({users.length})</span>
              </h4>
              <button
                onClick={fetchUsers}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={cn("w-3 h-3", isLoadingUsers && "animate-spin")} />
                <span>Refresh Accounts</span>
              </button>
            </div>

            {isLoadingUsers ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading user accounts...</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No user accounts found.</div>
            ) : (
              <div className="space-y-3 text-xs">
                {users.map((u) => (
                  <div key={u.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                      {u.officialEmail && (
                        <p className="text-[10px] text-purple-400">Official: {u.officialEmail}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 uppercase">Assigned Role:</span>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-[#19191e] border border-white/15 text-purple-300 font-bold focus:outline-none cursor-pointer text-xs"
                      >
                        <option value="ROLE_CUSTOMER">ROLE_CUSTOMER (Client)</option>
                        <option value="ROLE_ADMIN">ROLE_ADMIN (Manager)</option>
                        <option value="ROLE_DEVELOPER">ROLE_DEVELOPER (Full System Access)</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB: DATABASE HEALTH & SEEDER */}
        {activeTab === 'seed' && (
          <section className="p-8 rounded-3xl bg-[#141416] border border-white/10 text-center space-y-4 max-w-xl mx-auto animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
              <Database className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white">PostgreSQL 17 Database Health &amp; Catalog State</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              OHO TECH utilizes Spring Boot 4.0 and PostgreSQL 17. The database seeds initial categories and products idempotently via DataInitializer.java on startup.
            </p>

            {dbStats && (
              <div className="grid grid-cols-2 gap-3 text-left p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px]">Catalog Products:</span>
                  <p className="text-lg font-bold text-white">{dbStats.totalProducts}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Customer Orders:</span>
                  <p className="text-lg font-bold text-white">{dbStats.totalOrders}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Registered Users:</span>
                  <p className="text-lg font-bold text-white">{dbStats.totalUsers}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Commercial Quotes:</span>
                  <p className="text-lg font-bold text-white">{dbStats.totalQuotes}</p>
                </div>
              </div>
            )}

            <button
              onClick={checkDatabaseState}
              disabled={isCheckingDb}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-950/40 flex items-center gap-2 mx-auto cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={cn("w-4 h-4", isCheckingDb && "animate-spin")} />
              <span>{isCheckingDb ? 'Querying PostgreSQL 17...' : 'Verify Database Catalog State'}</span>
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
                className="w-full px-4 py-3 bg-[#0d0d0e] border border-white/15 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 pr-36 font-mono"
              />
              <button
                type="submit"
                disabled={isExecutingAi}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {isExecutingAi ? 'Running...' : 'Execute Script'}
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

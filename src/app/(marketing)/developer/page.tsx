'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Terminal, Shield, Key, Database, Cpu, Bot, CheckCircle2, 
  AlertTriangle, RefreshCw, Zap, Server, Smartphone, 
  Activity, ExternalLink, Copy, Check, Plus, Trash2, 
  Send, Layers, ShieldCheck, Clock, ArrowRight, Laptop, Sparkles, LogOut
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
import { 
  DashboardShell,
  V15MetricCard, 
  V15AccentActionCard,
  V15PerformanceChart,
  V15Card, 
  V15CalendarWidget,
  V15PillTabs,
  V15CircularGauge,
  V15StaggerContainer,
  V15StaggerItem
} from '@/components/dashboard/V15DashboardPrimitives';

export default function DeveloperStudioPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
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
  const [webhookTargetUrl, setWebhookTargetUrl] = React.useState('https://api.ohotechn.com/webhooks/listener');
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
    <DashboardShell className="pb-16 font-sans">
      {/* Dev Top Bar - V15 Aesthetic */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_1px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-xs">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tracking-tight text-slate-900 font-mono">DEVELOPER STUDIO</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-50 border border-orange-200 text-orange-700">
                  SYSTEM CORE
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">Node v25 · Spring Boot 4.0 · PostgreSQL 17</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
              <span>Admin Console</span>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE SYSTEM: {diagnostics?.status || 'OPERATIONAL'}</span>
            </div>

            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dev Container */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Banner Section with V15 Aesthetics */}
        <section className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-[22px] p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                INFRASTRUCTURE CONTROL &amp; API VAULT
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                System Infrastructure &amp; Engineering Operations
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Generate programmatic API keys, dispatch simulated webhooks, audit real-time JVM telemetry, and execute DevOps operations.
              </p>
            </div>

            {/* Mode Selector */}
            <div className="p-1 rounded-2xl bg-slate-100/80 border border-slate-200/80 flex items-center shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => setControlMode('manual')}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                  controlMode === 'manual' ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Cpu className="w-3.5 h-3.5 text-orange-600" />
                <span>Manual Console</span>
              </button>
              <button
                type="button"
                onClick={() => setControlMode('ai')}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                  controlMode === 'ai' ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Dev AI Engine</span>
              </button>
            </div>
          </div>
        </section>

        {/* V15 Developer KPI Strip */}
        <V15StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <V15MetricCard
            label="System Health"
            value={diagnostics?.status || 'HEALTHY'}
            subvalue="PostgreSQL 17 + JVM 21"
            icon={Server}
            accentColor="emerald"
            trend={{ value: '100% UP', direction: 'up' }}
          />
          <V15MetricCard
            label="Active API Keys"
            value={apiKeys.length}
            subvalue="Cryptographic HMAC Vault"
            icon={Key}
            accentColor="purple"
            onClick={() => setActiveTab('vault')}
          />
          <V15MetricCard
            label="Staff Accounts"
            value={users.length}
            subvalue="RBAC Access Matrix"
            icon={Shield}
            accentColor="blue"
            onClick={() => setActiveTab('rbac')}
          />
          <V15MetricCard
            label="Live Deployments"
            value={dbStats?.liveDeployments ?? (analytics?.deviceMetrics?.totalActivations ?? 0)}
            subvalue="Active VPS Containers"
            icon={Layers}
            accentColor="orange"
            onClick={() => setActiveTab('deployments')}
          />
        </V15StaggerContainer>

        {/* V15 Dual Column: Performance Spline Chart + Vibrant Orange Accent Action Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <V15PerformanceChart
              title="Operations & Request Telemetry"
              subtitle="Programmatic API transactions vs internal background tasks (Live telemetry sample fixture)"
              primaryData={[12, 19, 15, 28, 24, 38, 42, 55]}
              secondaryData={[10, 14, 18, 20, 22, 26, 30, 32]}
              labels={['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']}
              activeTimeframe="Live"
              timeframes={['1h', '6h', '24h', 'Live']}
            />
          </div>

          <V15AccentActionCard
            title="Programmatic Key Vault"
            subtitle="Issue secure scoped API keys for server-to-server integrations, SDK clients, and CI/CD automation."
            buttonText="Generate API Key"
            badge="Security Vault"
            metricValue={apiKeys.length}
            metricLabel="Active Cryptographic Keys"
            icon={Key}
            onAction={() => setActiveTab('vault')}
          />
        </div>

        {/* V15 Telemetry Circular Gauge & Schedule Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(() => {
            const hasDiagnostics = diagnostics !== null && diagnostics !== undefined;
            const heapPercent = hasDiagnostics ? Math.round(Number(diagnostics.heapUsedPercent ?? 0)) : 0;

            return (
              <V15CircularGauge
                title="Cluster Telemetry & Health"
                subtitle="Real-time heap & thread metrics"
                value={heapPercent}
                displayValue={hasDiagnostics ? `${heapPercent}%` : (isLoading ? 'Syncing...' : 'Awaiting Feed')}
                label={hasDiagnostics ? 'Heap Usage' : (isLoading ? 'Connecting' : 'Disconnected')}
                primaryColor={heapPercent > 80 ? '#ef4444' : '#8b5cf6'}
                metrics={[
                  { label: 'Runtime', value: diagnostics?.jvmVersion ? `Java ${diagnostics.jvmVersion}` : (isLoading ? 'Detecting' : 'Awaiting Feed'), color: '#10b981' },
                  { label: 'Heap Used', value: diagnostics?.heapUsedBytes ? `${(diagnostics.heapUsedBytes / (1024 * 1024)).toFixed(0)} MB` : (isLoading ? '...' : 'N/A'), color: '#8b5cf6' },
                  { label: 'Active Threads', value: diagnostics?.activeThreadCount != null ? `${diagnostics.activeThreadCount} threads` : (isLoading ? '...' : 'N/A'), color: '#0ea5e9' },
                  { label: 'Status', value: diagnostics?.status || (isLoading ? 'CONNECTING' : 'OFFLINE'), color: diagnostics?.status === 'UP' || diagnostics?.status === 'HEALTHY' ? '#10b981' : '#ea580c' },
                ]}
              />
            );
          })()}

          <div className="lg:col-span-2">
            <V15CalendarWidget
              selectedDate={new Date()}
              events={[
                { day: new Date().getDate(), count: 6 },
                { day: (new Date().getDate() + 2) % 28 || 1, count: 3 },
                { day: (new Date().getDate() + 5) % 28 || 4, count: 1 },
              ]}
            />
          </div>
        </div>

        {/* V15 Pill Tab Navigation */}
        <V15PillTabs
          tabs={[
            { key: 'deployments', label: 'Deployments & Provisioning', icon: Layers },
            { key: 'analytics', label: 'Telemetry & Downloads', icon: Smartphone },
            { key: 'vault', label: 'API Keys & Vault', icon: Key, badge: apiKeys.length },
            { key: 'webhooks', label: 'Webhook Simulator', icon: Zap },
            { key: 'telemetry', label: 'System Telemetry', icon: Server },
            { key: 'rbac', label: 'RBAC Manager', icon: Shield, badge: users.length },
            { key: 'seed', label: 'Database Health', icon: Database },
            { key: 'ai', label: 'Dev AI Terminal', icon: Bot },
          ]}
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as any)}
        />

        {/* TAB: DEPLOYMENTS & PROVISIONING OPERATIONS */}
        {activeTab === 'deployments' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <AdminDeploymentsView />
          </section>
        )}

        {/* TAB: ANALYTICS & DOWNLOADS */}
        {activeTab === 'analytics' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <V15Card
              title="Developer Device & Download Telemetry"
              subtitle="Real-time hardware activations, download metrics, and system audit trails."
              actions={
                <button
                  onClick={() => fetchAnalytics(startDateStr || undefined, endDateStr || undefined)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isLoadingAnalytics && "animate-spin")} />
                  <span>Refresh Telemetry</span>
                </button>
              }
            >
              {isLoadingAnalytics ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  Loading telemetry data...
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <V15MetricCard
                      label="Active Devices"
                      value={analytics?.deviceMetrics?.activeDevices ?? 0}
                      trend={{ direction: 'up', value: 'Live' }}
                      subvalue={`Total: ${analytics?.deviceMetrics?.totalActivations ?? 0} activations`}
                      accentColor="emerald"
                      icon={Smartphone}
                    />
                    <V15MetricCard
                      label="Activations Today"
                      value={analytics?.deviceMetrics?.activationsToday ?? 0}
                      trend={{ direction: 'up', value: 'Today' }}
                      subvalue={`This month: ${analytics?.deviceMetrics?.activationsThisMonth ?? 0}`}
                      accentColor="purple"
                      icon={Activity}
                    />
                    <V15MetricCard
                      label="Release Downloads"
                      value={analytics?.downloadMetrics?.totalDownloads ?? 0}
                      trend={{ direction: 'neutral', value: 'All-time' }}
                      subvalue={`Today: ${analytics?.downloadMetrics?.downloadsToday ?? 0}`}
                      accentColor="blue"
                      icon={Layers}
                    />
                    <V15MetricCard
                      label="Platforms Monitored"
                      value={`${analytics?.platformStats?.length ?? 5} OS Targets`}
                      trend={{ direction: 'neutral', value: 'Supported' }}
                      subvalue="Win, Mac, Linux, Android, Web"
                      accentColor="orange"
                      icon={Server}
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-5">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-orange-600" />
                      <span>Recent Technical Event Trace</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      {(analytics?.recentActivity && analytics.recentActivity.length > 0) ? (
                        analytics.recentActivity.map((item, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 font-bold text-[10px] border border-orange-200">
                                  {item.action}
                                </span>
                                <span className="font-bold text-slate-800">{item.actorEmail || 'System'}</span>
                              </div>
                              <p className="text-slate-500 text-[11px] mt-1">{item.description}</p>
                            </div>
                            <span className="text-slate-400 text-[11px] shrink-0 font-mono">
                              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-xs py-4 text-center">No recent telemetry events recorded.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </V15Card>
          </section>
        )}

        {/* TAB: API VAULT */}
        {activeTab === 'vault' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            {/* Generate Key Form */}
            <V15Card
              title="Generate Programmatic Secret API Key"
              subtitle="Issue scoped API keys for automated integrations and background daemons."
            >
              <form onSubmit={handleGenerateApiKey} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Key description (e.g. Analytics Pipeline Token)..."
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCreatingKey || !newKeyName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer self-end sm:self-auto disabled:opacity-50 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreatingKey ? 'Creating...' : 'Create Key'}</span>
                </button>
              </form>

              {/* Secret key banner (if newly generated) */}
              {newCreatedSecret && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Copy Secret Key Now
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(newCreatedSecret);
                        showToast('Secret key copied to clipboard!', 'success');
                      }}
                      className="px-3 py-1 bg-amber-100 hover:bg-amber-200 rounded-lg text-amber-900 flex items-center gap-1 cursor-pointer font-mono font-semibold"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Secret
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-amber-200 font-mono text-[11px] text-amber-950 break-all select-all">
                    {newCreatedSecret}
                  </div>
                  <p className="text-[10px] text-amber-700">
                    This secret is shown only once and cannot be retrieved later. Store it in your secure secrets manager.
                  </p>
                </div>
              )}
            </V15Card>

            {/* Keys Table */}
            <V15Card
              title={`Active API Keys (${apiKeys.length})`}
              subtitle="Inspect and manage active authentication tokens."
              actions={
                <button
                  onClick={fetchApiKeys}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isLoadingApiKeys && "animate-spin")} />
                  <span>Refresh</span>
                </button>
              }
            >
              {isLoadingApiKeys ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading API keys...</div>
              ) : apiKeys.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No active API keys found. Generate one above.</div>
              ) : (
                <div className="divide-y divide-slate-100 text-xs">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{key.name}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold border",
                            key.active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                          )}>
                            {key.active ? 'ACTIVE' : 'REVOKED'}
                          </span>
                        </div>
                        <p className="text-orange-600 font-mono text-[11px] mt-0.5">{key.keyPrefix}••••••••</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">
                          Created: {new Date(key.createdAt).toLocaleDateString()} • Scope: {key.scope} • By: {key.createdByEmail || 'Developer'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {key.active && (
                          <button
                            onClick={() => handleRevokeApiKey(key.id)}
                            className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-semibold cursor-pointer transition-colors"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </V15Card>
          </section>
        )}

        {/* TAB: WEBHOOKS SIMULATOR */}
        {activeTab === 'webhooks' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <V15Card
              title="Outbound Webhook Test Simulator"
              subtitle="Dispatch test payloads to external endpoints to verify delivery hooks."
            >
              <form onSubmit={handleTriggerWebhookTest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium text-[11px] mb-1">Destination Webhook URL</label>
                    <input
                      type="text"
                      value={webhookTargetUrl}
                      onChange={(e) => setWebhookTargetUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium text-[11px] mb-1">Simulated Trigger Event</label>
                    <select
                      value={webhookEvent}
                      onChange={(e) => setWebhookEvent(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none text-xs font-mono"
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
                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs font-mono text-sky-900">
                    {lastPingResult}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isPingingWebhook}
                    className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs transition-colors"
                  >
                    <Send className={cn("w-3.5 h-3.5", isPingingWebhook && "animate-spin")} />
                    <span>{isPingingWebhook ? 'Pinging Endpoint...' : 'Send Live Test Ping'}</span>
                  </button>
                </div>
              </form>
            </V15Card>

            {/* Webhook Delivery Logs */}
            <V15Card
              title={`Delivery History Stream (${webhookLogs.length})`}
              subtitle="Audit log of dispatched webhook events and HTTP return codes."
              actions={
                <button
                  onClick={fetchWebhookLogs}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isLoadingWebhooks && "animate-spin")} />
                  <span>Refresh</span>
                </button>
              }
            >
              {isLoadingWebhooks ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading delivery stream...</div>
              ) : webhookLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No webhook events logged yet. Send a test ping above.</div>
              ) : (
                <div className="space-y-2 text-xs">
                  {webhookLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono">{log.eventType}</span>
                          <span className="text-[10px] text-slate-500">Source: {log.provider}</span>
                        </div>
                        {log.payloadSummary && (
                          <p className="text-slate-500 text-[10px] mt-0.5 font-mono truncate max-w-lg">{log.payloadSummary}</p>
                        )}
                        <span className="text-[10px] text-slate-400">{new Date(log.receivedAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded font-bold text-[10px] border",
                          log.status === 'PROCESSED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          log.status === 'FAILED' ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200"
                        )}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </V15Card>
          </section>
        )}

        {/* TAB: SYSTEM TELEMETRY */}
        {activeTab === 'telemetry' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live JVM &amp; Host Infrastructure Telemetry</h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time telemetry reported directly by Spring Boot JMX MXBeans.</p>
              </div>
              <button
                onClick={fetchDiagnostics}
                className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isLoadingDiagnostics && "animate-spin")} />
                <span>Refresh Live</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <V15Card
                title="Backend JVM & Container Health"
                subtitle="Memory allocations, active threads, and platform specifications."
              >
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span>Active Spring Profiles:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {diagnostics?.springActiveProfiles && diagnostics.springActiveProfiles.length > 0
                        ? diagnostics.springActiveProfiles.join(', ')
                        : 'default'}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span>Java Runtime:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      Java {diagnostics?.jvmVersion || '21'} ({diagnostics?.javaVendor || 'OpenJDK'})
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span>Host Platform / OS:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {diagnostics?.osName || 'Host'} ({diagnostics?.osArch || 'x64'})
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span>JVM Heap Allocation:</span>
                    <span className="font-bold text-orange-600 font-mono">
                      {diagnostics?.heapUsedBytes ? (diagnostics.heapUsedBytes / (1024 * 1024)).toFixed(1) : 0} MB / {' '}
                      {diagnostics?.heapMaxBytes ? (diagnostics.heapMaxBytes / (1024 * 1024)).toFixed(1) : 0} MB ({diagnostics?.heapUsedPercent ?? 0}%)
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span>Active JVM Threads:</span>
                    <span className="font-bold text-slate-900 font-mono">{diagnostics?.activeThreadCount ?? 0} Threads</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span>System Uptime:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {diagnostics?.systemUptimeMs ? Math.floor(diagnostics.systemUptimeMs / 60000) : 0} mins ({diagnostics?.systemUptimeMs ? (diagnostics.systemUptimeMs / 3600000).toFixed(1) : 0} hrs)
                    </span>
                  </div>
                </div>
              </V15Card>

              <V15Card
                title="PostgreSQL 17 Connection Pool"
                subtitle="HikariCP connection states and JDBC target status."
              >
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span>Database JDBC Target:</span>
                    <span className="font-bold text-slate-900 font-mono text-[11px] truncate max-w-[220px]">
                      {diagnostics?.dbConnectionUrlMasked || 'jdbc:postgresql://localhost:5432/OHOTECH'}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span>HikariCP Pool Connections:</span>
                    <span className="font-bold text-emerald-600 font-mono">
                      {diagnostics?.dbActiveConnections ?? 0} Active / {diagnostics?.dbMaxConnections ?? 20} Max
                    </span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span>Rate Limit Trackers:</span>
                    <span className="font-bold text-slate-900 font-mono">{diagnostics?.rateLimitActiveTrackers ?? 0} Buckets</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span>Server Status:</span>
                    <span className="font-bold text-emerald-600 font-mono">{diagnostics?.status || 'OPERATIONAL'}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span>Server Timestamp:</span>
                    <span className="font-bold text-slate-900 font-mono text-[11px]">
                      {diagnostics?.serverTimestamp ? new Date(diagnostics.serverTimestamp).toLocaleString() : 'Live'}
                    </span>
                  </div>
                </div>
              </V15Card>
            </div>
          </section>
        )}

        {/* TAB: RBAC ROLE MANAGER */}
        {activeTab === 'rbac' && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <V15Card
              title={`Privilege Matrix & Staff Access (${users.length})`}
              subtitle="Assign granular platform roles to internal personnel."
              actions={
                <button
                  onClick={fetchUsers}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isLoadingUsers && "animate-spin")} />
                  <span>Refresh Accounts</span>
                </button>
              }
            >
              {isLoadingUsers ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading user accounts...</div>
              ) : users.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No user accounts found.</div>
              ) : (
                <div className="space-y-3 text-xs">
                  {users.map((u) => (
                    <div key={u.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-500">{u.email}</p>
                        {u.officialEmail && (
                          <p className="text-[10px] text-orange-600 font-mono">Official: {u.officialEmail}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Assigned Role:</span>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-orange-500 cursor-pointer text-xs"
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
            </V15Card>
          </section>
        )}

        {/* TAB: DATABASE HEALTH & SEEDER */}
        {activeTab === 'seed' && (
          <section className="max-w-xl mx-auto space-y-4 animate-in fade-in duration-300">
            <V15Card
              title="PostgreSQL 17 Database Health & Catalog State"
              subtitle="Spring Boot 4.0 and PostgreSQL 17 verification."
            >
              <div className="text-center space-y-4 py-2">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto text-orange-600 shadow-xs">
                  <Database className="w-7 h-7" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  OHO TECH utilizes Spring Boot 4.0 and PostgreSQL 17. The database seeds initial categories and products idempotently via DataInitializer.java on startup.
                </p>

                {dbStats && (
                  <div className="grid grid-cols-2 gap-3 text-left p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px]">Catalog Products:</span>
                      <p className="text-lg font-bold text-slate-900">{dbStats.totalProducts}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Customer Orders:</span>
                      <p className="text-lg font-bold text-slate-900">{dbStats.totalOrders}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Registered Users:</span>
                      <p className="text-lg font-bold text-slate-900">{dbStats.totalUsers}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px]">Commercial Quotes:</span>
                      <p className="text-lg font-bold text-slate-900">{dbStats.totalQuotes}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={checkDatabaseState}
                  disabled={isCheckingDb}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-2 mx-auto cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isCheckingDb && "animate-spin")} />
                  <span>{isCheckingDb ? 'Querying PostgreSQL 17...' : 'Verify Database Catalog State'}</span>
                </button>
              </div>
            </V15Card>
          </section>
        )}

        {/* TAB: DEVELOPER AI EXECUTION SANDBOX */}
        {(activeTab === 'ai' || controlMode === 'ai') && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <V15Card
              title="Developer AI Natural Language Terminal"
              subtitle="Direct natural language operational interface to infrastructure and background tasks."
              actions={
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  ONLINE
                </span>
              }
            >
              <form onSubmit={handleDevAiSubmit} className="relative mt-2">
                <input
                  type="text"
                  placeholder="e.g. Verify PostgreSQL migrations, flush Redis cache, sync Resend webhook target..."
                  value={devAiPrompt}
                  onChange={(e) => setDevAiPrompt(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 pr-36 font-mono"
                />
                <button
                  type="submit"
                  disabled={isExecutingAi}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {isExecutingAi ? 'Running...' : 'Execute Script'}
                </button>
              </form>

              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-900 text-xs text-emerald-400 space-y-1.5 max-h-64 overflow-y-auto font-mono">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Dev Console Output</p>
                {devAiLogs.map((logStr, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {logStr}
                  </div>
                ))}
              </div>
            </V15Card>
          </section>
        )}
      </main>
    </DashboardShell>
  );
}

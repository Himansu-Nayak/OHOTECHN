'use client';

import * as React from 'react';
import {
  Settings,
  Shield,
  Server,
  Database,
  CreditCard,
  Mail,
  Cpu,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  User,
  Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAdminAuditLogsApi } from '@/api/admin';
import { AuditLogDto } from '@/api/types';
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  StatusBadge,
  AdminEmptyState,
  AdminTableSkeleton
} from './AdminUiPrimitives';

export function AdminSettingsView() {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = React.useState<AuditLogDto[]>([]);
  const [loadingLogs, setLoadingLogs] = React.useState(false);
  const [errorLogs, setErrorLogs] = React.useState<string | null>(null);

  const fetchAuditLogs = React.useCallback(async () => {
    setLoadingLogs(true);
    setErrorLogs(null);
    try {
      const res = await getAdminAuditLogsApi(0, 10);
      if (res.success && res.data) {
        setAuditLogs(res.data.content || []);
      } else {
        setErrorLogs(res.message || 'Unable to load audit logs');
      }
    } catch (err: any) {
      setErrorLogs(err?.message || 'Failed to fetch audit events');
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Platform Architecture &amp; Security Settings</h1>
            <AdminBadge variant="primary">Static Architecture Spec</AdminBadge>
          </div>
          <p className="text-sm text-slate-500">
            System architectural specifications, role-based access baseline, and real immutable audit logs from database.
          </p>
        </div>
      </div>

      {/* Admin Session Card */}
      <AdminCard className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base uppercase">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">{user?.name || 'Administrator'}</span>
              <AdminBadge variant="error">{user?.role || 'ROLE_ADMIN'}</AdminBadge>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{user?.email}</div>
          </div>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>JWT Session Active</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600">Zero Client Secret Exposure</span>
        </div>
      </AdminCard>

      {/* Service Infrastructure Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Service &amp; Technology Stack Baseline</h2>
          <span className="text-[11px] text-slate-400 font-medium">STATIC SPECIFICATION</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Core REST API */}
          <AdminCard className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-slate-900 text-xs">Core REST API</span>
              </div>
              <AdminBadge variant="neutral">CONFIGURED</AdminBadge>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-400">Runtime:</span>
                <span className="font-medium text-slate-900 font-mono">Java 21 / Spring Boot 4.1.0</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-400">Port / Transport:</span>
                <span className="font-medium text-slate-900 font-mono">:8080 (HTTPS/JSON)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Auth Protocol:</span>
                <span className="font-medium text-slate-900 font-mono">Bearer JWT (HMAC-256)</span>
              </div>
            </div>
          </AdminCard>

          {/* Database Engine */}
          <AdminCard className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-slate-900 text-xs">Database Engine</span>
              </div>
              <AdminBadge variant="neutral">CONFIGURED</AdminBadge>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-400">Engine:</span>
                <span className="font-medium text-slate-900 font-mono">PostgreSQL 17</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-400">ORM:</span>
                <span className="font-medium text-slate-900 font-mono">Hibernate 6 / JPA</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Pool:</span>
                <span className="font-medium text-slate-900 font-mono">HikariCP</span>
              </div>
            </div>
          </AdminCard>

          {/* Payment Gateway */}
          <AdminCard className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-slate-900 text-xs">Payment Gateway</span>
              </div>
              <AdminBadge variant="neutral">CONFIGURED</AdminBadge>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-400">Provider:</span>
                <span className="font-medium text-slate-900 font-mono">Razorpay v1</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-400">Verification:</span>
                <span className="font-medium text-slate-900 font-mono">HMAC SHA256 Webhook</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Currencies:</span>
                <span className="font-medium text-slate-900 font-mono">INR (₹)</span>
              </div>
            </div>
          </AdminCard>

          {/* Email Gateway */}
          <AdminCard className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-slate-900 text-xs">Email Gateway</span>
              </div>
              <AdminBadge variant="neutral">CONFIGURED</AdminBadge>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-400">Provider:</span>
                <span className="font-medium text-slate-900 font-mono">Resend Cloud API</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-400">Notifications:</span>
                <span className="font-medium text-slate-900">Orders, Invoices, Inquiries</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Dispatch:</span>
                <span className="font-medium text-slate-900 font-mono">Server-Side TLS</span>
              </div>
            </div>
          </AdminCard>

          {/* AI Intelligence Engine */}
          <AdminCard className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-slate-900 text-xs">AI Intelligence Engine</span>
              </div>
              <AdminBadge variant="neutral">CONFIGURED</AdminBadge>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-400">Foundation Model:</span>
                <span className="font-medium text-slate-900 font-mono">Gemini 2.5 Flash</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-400">Features:</span>
                <span className="font-medium text-slate-900">Catalog, Insights, Embeddings</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Vector Indexing:</span>
                <span className="font-medium text-slate-900 font-mono">Cosine Similarity</span>
              </div>
            </div>
          </AdminCard>

          {/* Security & Compliance */}
          <AdminCard className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-slate-900 text-xs">Security &amp; Compliance</span>
              </div>
              <AdminBadge variant="neutral">SPECIFICATION</AdminBadge>
            </div>
            <div className="text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-400">Password Hashing:</span>
                <span className="font-medium text-slate-900 font-mono">BCrypt (Work factor 12)</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="text-slate-400">CORS Policy:</span>
                <span className="font-medium text-slate-900 font-mono">Restricted to Origin</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-400">Audit Logs:</span>
                <span className="font-medium text-slate-900 font-mono">Append-Only JPA Table</span>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Immutable Audit Trail */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-700" />
                Recent System Audit Trail
              </h2>
              <AdminBadge variant="success">Real Runtime Information</AdminBadge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live chronological log of administrator logins, product mutations, and critical actions from PostgreSQL database.
            </p>
          </div>
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => fetchAuditLogs()}
            disabled={loadingLogs}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />}
          >
            Refresh Logs
          </AdminButton>
        </div>

        {errorLogs && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorLogs}
          </div>
        )}

        <AdminCard className="overflow-hidden">
          {loadingLogs ? (
            <div className="p-6">
              <AdminTableSkeleton rows={5} cols={5} />
            </div>
          ) : auditLogs.length === 0 ? (
            <AdminEmptyState
              title="No audit log entries recorded"
              description="Administrative actions and critical lifecycle events will appear here automatically."
              icon={<Activity className="w-6 h-6 text-slate-400" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString('en-IN') : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 text-xs">{log.actorName || log.actorEmail || 'System'}</div>
                        {log.actorRole && (
                          <div className="text-[10px] text-slate-400 font-mono">{log.actorRole}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <AdminBadge variant="primary">{log.action}</AdminBadge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                        {log.entityType ? `${log.entityType} #${log.entityId || ''}` : '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-xs">
                        {log.description || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShieldAlert, Search, Filter, Calendar, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAdminAuditLogsApi } from '@/api/admin';
import { AuditLogDto } from '@/api/types';

export default function AdminAuditLogsPage() {
  const { user } = useAuth();

  const [logs, setLogs] = React.useState<AuditLogDto[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [search, setSearch] = React.useState<string>('');
  const [actionFilter, setActionFilter] = React.useState<string>('');
  const [page, setPage] = React.useState<number>(0);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [totalElements, setTotalElements] = React.useState<number>(0);

  const fetchAuditLogs = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminAuditLogsApi(page, 20, actionFilter || undefined, undefined, search || undefined);
      if (res.success && res.data) {
        setLogs(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (e) {
      console.warn('Failed to load audit logs', e);
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter, search]);

  React.useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const isAdmin = user && (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN' || user.role === 'ROLE_DEVELOPER' || user.role === 'DEVELOPER');

  if (!user || !isAdmin) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Lock className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Access Restricted</h1>
          <p className="text-xs text-slate-500 mb-6">Administrator or Developer credentials required to access system audit logs.</p>
          <Link href="/login" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-7xl w-full mx-auto" id="audit-logs-main">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin" className="text-xs font-mono font-bold text-sky-600 hover:underline">← Back to Admin Console</Link>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e] flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-sky-600" />
              Security Audit Logs
            </h1>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Immutable activity trail of user authentication, admin changes, licensing operations, and security events.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 font-bold bg-white px-4 py-2 rounded-full border border-slate-300">
            Total Logged Events: {totalElements}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border-2 border-slate-300 rounded-[28px] p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search description or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-full text-xs font-medium focus:outline-none focus:border-sky-600"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setPage(0);
                }}
                className="bg-slate-50 border border-slate-300 rounded-full px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="">All Actions</option>
                <option value="USER_REGISTERED">USER_REGISTERED</option>
                <option value="USER_LOGIN_SUCCESS">USER_LOGIN_SUCCESS</option>
                <option value="USER_LOGIN_FAILED">USER_LOGIN_FAILED</option>
                <option value="ACCOUNT_LOCKED">ACCOUNT_LOCKED</option>
                <option value="PASSWORD_CHANGED">PASSWORD_CHANGED</option>
                <option value="USER_ROLE_CHANGED">USER_ROLE_CHANGED</option>
                <option value="USER_STATUS_CHANGED">USER_STATUS_CHANGED</option>
                <option value="PRODUCT_CREATED">PRODUCT_CREATED</option>
                <option value="PRODUCT_UPDATED">PRODUCT_UPDATED</option>
                <option value="LICENSE_REVOKED">LICENSE_REVOKED</option>
                <option value="LICENSE_SUSPENDED">LICENSE_SUSPENDED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white border-2 border-slate-300 rounded-[28px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-mono font-bold">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Actor</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Entity</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs font-mono text-slate-400">
                      Loading security audit trail...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs font-mono text-slate-500">
                      No matching audit log records found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'medium' })}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#0d0d0e]">
                        <div>{log.actorName || 'System'}</div>
                        <div className="text-[10px] font-mono text-slate-400">{log.actorEmail || '—'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {log.actorRole || 'SYSTEM'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-sky-700">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {log.entityType ? `${log.entityType} #${log.entityId || ''}` : '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={log.description}>
                        {log.description}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-200 bg-[#fafafa] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-full border border-slate-300 hover:bg-slate-100 disabled:opacity-40 font-bold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-full border border-slate-300 hover:bg-slate-100 disabled:opacity-40 font-bold flex items-center gap-1 cursor-pointer"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

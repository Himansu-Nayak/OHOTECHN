'use client';

import * as React from 'react';
import { 
  Mail, RefreshCw, AlertCircle, CheckCircle2, Clock, 
  Ban, Send, Search, Trash2, Plus, Eye, ShieldAlert,
  RotateCcw, Filter, ChevronLeft, ChevronRight, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { 
  emailApi, 
  EmailOutboxItem, 
  EmailStats, 
  EmailSuppressionItem, 
  EmailStatus, 
  EmailCategory 
} from '@/api/email';
import { 
  AdminCard, 
  AdminBadge, 
  AdminButton, 
  AdminEmptyState, 
  AdminTableSkeleton, 
  AdminModal 
} from './AdminUiPrimitives';

export function AdminEmailsView() {
  const { showToast } = useToast();

  const [activeSubTab, setActiveSubTab] = React.useState<'outbox' | 'suppressions'>('outbox');
  const [stats, setStats] = React.useState<EmailStats | null>(null);

  // Outbox state
  const [emails, setEmails] = React.useState<EmailOutboxItem[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = React.useState(true);
  const [selectedStatus, setSelectedStatus] = React.useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalElements, setTotalElements] = React.useState(0);
  const [retryingId, setRetryingId] = React.useState<number | null>(null);
  const [selectedEmail, setSelectedEmail] = React.useState<EmailOutboxItem | null>(null);

  // Suppressions state
  const [suppressions, setSuppressions] = React.useState<EmailSuppressionItem[]>([]);
  const [isLoadingSuppressions, setIsLoadingSuppressions] = React.useState(false);
  const [suppressionSearch, setSuppressionSearch] = React.useState('');
  const [isAddSuppressionOpen, setIsAddSuppressionOpen] = React.useState(false);
  const [newSuppressionEmail, setNewSuppressionEmail] = React.useState('');
  const [newSuppressionReason, setNewSuppressionReason] = React.useState('MANUAL_ADMIN');
  const [isSubmittingSuppression, setIsSubmittingSuppression] = React.useState(false);
  const [deletingSuppressionId, setDeletingSuppressionId] = React.useState<number | null>(null);

  // Fetch stats
  const fetchStats = React.useCallback(async () => {
    try {
      const res = await emailApi.getEmailStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch {
      // Non-blocking error for stats
    }
  }, []);

  // Fetch outbox emails
  const fetchEmails = React.useCallback(async () => {
    setIsLoadingEmails(true);
    try {
      const res = await emailApi.getEmails({
        status: selectedStatus !== 'ALL' ? (selectedStatus as EmailStatus) : undefined,
        category: selectedCategory !== 'ALL' ? (selectedCategory as EmailCategory) : undefined,
        page: currentPage,
        size: 15,
      });

      if (res.success && res.data) {
        setEmails(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      } else {
        showToast(res.message || 'Failed to load email outbox records.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error connecting to email outbox service.', 'error');
    } finally {
      setIsLoadingEmails(false);
    }
  }, [selectedStatus, selectedCategory, currentPage, showToast]);

  // Fetch suppressions
  const fetchSuppressions = React.useCallback(async () => {
    setIsLoadingSuppressions(true);
    try {
      const res = await emailApi.getSuppressions();
      if (res.success && res.data) {
        setSuppressions(res.data);
      } else {
        showToast(res.message || 'Failed to load suppression list.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error loading suppressions.', 'error');
    } finally {
      setIsLoadingSuppressions(false);
    }
  }, [showToast]);

  React.useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  React.useEffect(() => {
    if (activeSubTab === 'outbox') {
      fetchEmails();
    } else {
      fetchSuppressions();
    }
  }, [activeSubTab, fetchEmails, fetchSuppressions]);

  const handleRetry = async (id: number) => {
    setRetryingId(id);
    try {
      const res = await emailApi.retryEmail(id);
      if (res.success) {
        showToast(`Email #${id} re-queued for delivery!`, 'success');
        await fetchEmails();
        await fetchStats();
      } else {
        showToast(res.message || `Failed to retry email #${id}`, 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to trigger retry.', 'error');
    } finally {
      setRetryingId(null);
    }
  };

  const handleAddSuppression = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuppressionEmail.trim()) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubmittingSuppression(true);
    try {
      const res = await emailApi.addSuppression({
        email: newSuppressionEmail.trim(),
        reason: newSuppressionReason,
      });

      if (res.success) {
        showToast(`Email ${newSuppressionEmail} added to suppression list!`, 'success');
        setNewSuppressionEmail('');
        setIsAddSuppressionOpen(false);
        await fetchSuppressions();
        await fetchStats();
      } else {
        showToast(res.message || 'Failed to add suppression.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error adding suppression record.', 'error');
    } finally {
      setIsSubmittingSuppression(false);
    }
  };

  const handleRemoveSuppression = async (id: number, email: string) => {
    if (!confirm(`Are you sure you want to unsuppress ${email}? It will become eligible for email delivery again.`)) {
      return;
    }

    setDeletingSuppressionId(id);
    try {
      const res = await emailApi.removeSuppression(id);
      if (res.success) {
        showToast(`Unsuppressed ${email} successfully.`, 'success');
        await fetchSuppressions();
        await fetchStats();
      } else {
        showToast(res.message || 'Failed to remove suppression.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error removing suppression.', 'error');
    } finally {
      setDeletingSuppressionId(null);
    }
  };

  const getStatusBadge = (status: EmailStatus) => {
    switch (status) {
      case 'SENT':
        return <AdminBadge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Sent</AdminBadge>;
      case 'QUEUED':
        return <AdminBadge variant="warning" className="gap-1"><Clock className="w-3 h-3" /> Queued</AdminBadge>;
      case 'PROCESSING':
        return <AdminBadge variant="info" className="gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Sending</AdminBadge>;
      case 'FAILED':
        return <AdminBadge variant="error" className="gap-1"><AlertCircle className="w-3 h-3" /> Failed</AdminBadge>;
      case 'SUPPRESSED':
        return <AdminBadge variant="neutral" className="gap-1"><Ban className="w-3 h-3" /> Suppressed</AdminBadge>;
      default:
        return <AdminBadge variant="neutral">{status}</AdminBadge>;
    }
  };

  const filteredEmails = React.useMemo(() => {
    if (!searchQuery.trim()) return emails;
    const q = searchQuery.toLowerCase();
    return emails.filter(
      (e) =>
        e.recipient.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        (e.templateKey && e.templateKey.toLowerCase().includes(q))
    );
  }, [emails, searchQuery]);

  const filteredSuppressions = React.useMemo(() => {
    if (!suppressionSearch.trim()) return suppressions;
    const q = suppressionSearch.toLowerCase();
    return suppressions.filter(
      (s) =>
        s.email.toLowerCase().includes(q) ||
        s.reason.toLowerCase().includes(q) ||
        s.source.toLowerCase().includes(q)
    );
  }, [suppressions, suppressionSearch]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Mail className="w-7 h-7 text-emerald-600" />
            Email Infrastructure & Durable Outbox
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time delivery status, exponential backoff retries, Resend webhooks, and suppression management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={() => {
              fetchStats();
              if (activeSubTab === 'outbox') fetchEmails();
              else fetchSuppressions();
            }}
            disabled={isLoadingEmails || isLoadingSuppressions}
            className="gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", (isLoadingEmails || isLoadingSuppressions) && "animate-spin")} />
            Refresh
          </AdminButton>

          {activeSubTab === 'suppressions' && (
            <AdminButton
              variant="primary"
              size="sm"
              onClick={() => setIsAddSuppressionOpen(true)}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="w-4 h-4" />
              Add Suppression
            </AdminButton>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <AdminCard className="p-4 flex flex-col justify-between border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Outbox</span>
            <Mail className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 mt-2">
            {stats?.total ?? '—'}
          </div>
        </AdminCard>

        <AdminCard className="p-4 flex flex-col justify-between border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <span>Delivered / Sent</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {stats?.sent ?? '—'}
          </div>
        </AdminCard>

        <AdminCard className="p-4 flex flex-col justify-between border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <span>Queued / Retrying</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            {(stats?.queued ?? 0) + (stats?.processing ?? 0)}
          </div>
        </AdminCard>

        <AdminCard className="p-4 flex flex-col justify-between border-red-500/20 bg-red-500/5">
          <div className="flex items-center justify-between text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-wider">
            <span>Failed</span>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-red-600 dark:text-red-400 mt-2">
            {stats?.failed ?? '—'}
          </div>
        </AdminCard>

        <AdminCard className="p-4 flex flex-col justify-between border-neutral-500/20 bg-neutral-500/5">
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider">
            <span>Suppressed</span>
            <Ban className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-700 dark:text-neutral-300 mt-2">
            {stats?.suppressed ?? '—'}
          </div>
        </AdminCard>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-4">
        <button
          onClick={() => setActiveSubTab('outbox')}
          className={cn(
            "pb-3 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2",
            activeSubTab === 'outbox'
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          )}
        >
          <Send className="w-4 h-4" />
          Outbox & Dispatch History
          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
            {totalElements}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('suppressions')}
          className={cn(
            "pb-3 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2",
            activeSubTab === 'suppressions'
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          )}
        >
          <ShieldAlert className="w-4 h-4" />
          Suppression List
          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
            {suppressions.length}
          </span>
        </button>
      </div>

      {/* SUBTAB 1: Outbox */}
      {activeSubTab === 'outbox' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search recipient, subject, or template..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Status:</span>
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(0);
                }}
                className="text-xs py-1.5 px-2.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
              >
                <option value="ALL">All Statuses</option>
                <option value="SENT">Sent</option>
                <option value="QUEUED">Queued</option>
                <option value="PROCESSING">Processing</option>
                <option value="FAILED">Failed</option>
                <option value="SUPPRESSED">Suppressed</option>
              </select>

              <div className="flex items-center gap-1.5 text-xs text-neutral-500 ml-2">
                <span>Category:</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(0);
                }}
                className="text-xs py-1.5 px-2.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
              >
                <option value="ALL">All Categories</option>
                <option value="TRANSACTIONAL">Transactional</option>
                <option value="MARKETING">Marketing</option>
                <option value="ANNOUNCEMENT">Announcement</option>
              </select>
            </div>
          </div>

          {/* Outbox Table */}
          <AdminCard className="overflow-hidden border-neutral-200 dark:border-neutral-800">
            {isLoadingEmails ? (
              <AdminTableSkeleton cols={7} rows={6} />
            ) : filteredEmails.length === 0 ? (
              <AdminEmptyState
                icon={Mail}
                title="No email records found"
                description="No matching outbox emails were found with the selected filters."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 text-xs uppercase font-semibold border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Attempts</th>
                      <th className="py-3 px-4">Created / Sent</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {filteredEmails.map((item) => (
                      <tr 
                        key={item.id} 
                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-xs text-neutral-400">
                          #{item.id}
                        </td>
                        <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100 max-w-[200px] truncate">
                          {item.recipient}
                        </td>
                        <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300 max-w-[240px] truncate">
                          {item.subject}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                          {item.attempts} / {item.maxAttempts}
                        </td>
                        <td className="py-3 px-4 text-xs text-neutral-500">
                          <div>{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</div>
                          {item.sentAt && (
                            <div className="text-emerald-600 dark:text-emerald-400 text-[11px]">
                              Delivered: {new Date(item.sentAt).toLocaleTimeString()}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => setSelectedEmail(item)}
                            title="View Outbox Metadata"
                            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {(item.status === 'FAILED' || item.status === 'QUEUED') && (
                            <button
                              onClick={() => handleRetry(item.id)}
                              disabled={retryingId === item.id}
                              title="Force Retry Send"
                              className="p-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
                            >
                              <RotateCcw className={cn("w-4 h-4", retryingId === item.id && "animate-spin")} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
                <span>
                  Showing page {currentPage + 1} of {totalPages} ({totalElements} total entries)
                </span>
                <div className="flex items-center gap-2">
                  <AdminButton
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0 || isLoadingEmails}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </AdminButton>
                  <AdminButton
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage >= totalPages - 1 || isLoadingEmails}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </AdminButton>
                </div>
              </div>
            )}
          </AdminCard>
        </div>
      )}

      {/* SUBTAB 2: Suppressions */}
      {activeSubTab === 'suppressions' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search suppressed emails or reasons..."
                value={suppressionSearch}
                onChange={(e) => setSuppressionSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="text-xs text-neutral-500">
              Suppressed recipients are automatically guarded against dispatch to prevent bounce loops and preserve sender reputation.
            </div>
          </div>

          <AdminCard className="overflow-hidden border-neutral-200 dark:border-neutral-800">
            {isLoadingSuppressions ? (
              <AdminTableSkeleton cols={5} rows={4} />
            ) : filteredSuppressions.length === 0 ? (
              <AdminEmptyState
                icon={ShieldAlert}
                title="Suppression list is empty"
                description="No addresses are currently suppressed. Any bounces or manual suppressions will show up here."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 text-xs uppercase font-semibold border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="py-3 px-4">Suppressed Email</th>
                      <th className="py-3 px-4">Reason</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4">Added Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {filteredSuppressions.map((item) => (
                      <tr 
                        key={item.id}
                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">
                          {item.email}
                        </td>
                        <td className="py-3 px-4">
                          <AdminBadge variant={item.reason.includes('BOUNCE') ? 'error' : 'warning'}>
                            {item.reason}
                          </AdminBadge>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-neutral-500">
                          {item.source}
                        </td>
                        <td className="py-3 px-4 text-xs text-neutral-500">
                          {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleRemoveSuppression(item.id, item.email)}
                            disabled={deletingSuppressionId === item.id}
                            title="Unsuppress Email"
                            className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AdminCard>
        </div>
      )}

      {/* MODAL: View Outbox Details */}
      <AdminModal
        isOpen={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
        title={`Outbox Record #${selectedEmail?.id}`}
      >
        {selectedEmail && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase">Status</label>
                <div className="mt-1">{getStatusBadge(selectedEmail.status)}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase">Category</label>
                <div className="mt-1 font-mono text-xs">{selectedEmail.category}</div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-500 uppercase">Recipient</label>
              <div className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">
                {selectedEmail.recipient}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-500 uppercase">Subject</label>
              <div className="mt-1 text-neutral-800 dark:text-neutral-200">
                {selectedEmail.subject}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase">Attempts</label>
                <div className="mt-1 font-mono text-xs">
                  {selectedEmail.attempts} of {selectedEmail.maxAttempts} max
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase">Template</label>
                <div className="mt-1 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                  {selectedEmail.templateKey || 'GENERAL'}
                </div>
              </div>
            </div>

            {selectedEmail.providerMessageId && (
              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase">Provider Message ID</label>
                <div className="mt-1 font-mono text-xs bg-neutral-100 dark:bg-neutral-800 p-2 rounded break-all">
                  {selectedEmail.providerMessageId}
                </div>
              </div>
            )}

            {selectedEmail.idempotencyKey && (
              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase">Idempotency Key</label>
                <div className="mt-1 font-mono text-xs bg-neutral-100 dark:bg-neutral-800 p-2 rounded break-all">
                  {selectedEmail.idempotencyKey}
                </div>
              </div>
            )}

            {selectedEmail.errorMessage && (
              <div>
                <label className="text-xs font-semibold text-red-500 uppercase">Error Information</label>
                <div className="mt-1 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2.5 rounded border border-red-200 dark:border-red-900">
                  {selectedEmail.errorMessage}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-xs text-neutral-500 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <div>Created: {new Date(selectedEmail.createdAt).toLocaleString()}</div>
              <div>Sent: {selectedEmail.sentAt ? new Date(selectedEmail.sentAt).toLocaleString() : 'Not yet'}</div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              {(selectedEmail.status === 'FAILED' || selectedEmail.status === 'QUEUED') && (
                <AdminButton
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    await handleRetry(selectedEmail.id);
                    setSelectedEmail(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  Retry Send
                </AdminButton>
              )}
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setSelectedEmail(null)}
              >
                Close
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>

      {/* MODAL: Add Manual Suppression */}
      <AdminModal
        isOpen={isAddSuppressionOpen}
        onClose={() => setIsAddSuppressionOpen(false)}
        title="Add Recipient to Suppression List"
      >
        <form onSubmit={handleAddSuppression} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="recipient@example.com"
              value={newSuppressionEmail}
              onChange={(e) => setNewSuppressionEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
              Reason
            </label>
            <select
              value={newSuppressionReason}
              onChange={(e) => setNewSuppressionReason(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="MANUAL_ADMIN">Manual Admin Suppression</option>
              <option value="BOUNCE">Hard Bounce</option>
              <option value="COMPLAINT">Spam Complaint</option>
              <option value="UNSUBSCRIBE">Customer Request / Unsubscribe</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddSuppressionOpen(false)}
            >
              Cancel
            </AdminButton>
            <AdminButton
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmittingSuppression}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmittingSuppression ? 'Adding...' : 'Add to Suppression'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

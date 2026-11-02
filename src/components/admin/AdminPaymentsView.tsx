'use client';

import * as React from 'react';
import { 
  CreditCard, Search, RefreshCw, CheckCircle2, 
  AlertCircle, ShieldCheck, Check,
  XCircle, Copy, Clock, QrCode, Truck, AlertTriangle, Scale,
  Activity, Terminal, Eye, RotateCw, ChevronLeft, ChevronRight,
  User, Mail, ArrowUpRight, DollarSign, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { 
  Payment, 
  PaymentReconciliationReportDto, 
  TransactionOverviewDto, 
  WebhookEventDto,
  Page
} from '@/api/types';
import { 
  getTransactionsHistoryApi,
  getTransactionOverviewApi,
  getWebhooksApi,
  retryWebhookApi,
  recoverReconciliationApi,
  adminVerifyPaymentApi, 
  adminRejectPaymentApi,
  getPaymentReconciliationReportApi
} from '@/api/payments';
import { CounterBillingTerminal } from './CounterBillingTerminal';
import { 
  AdminCard, 
  AdminButton, 
  AdminInput, 
  AdminSelect, 
  AdminBadge, 
  StatusBadge, 
  AdminEmptyState, 
  AdminTableSkeleton,
  AdminModal,
  AdminDrawer
} from './AdminUiPrimitives';

type ActiveTab = 'overview' | 'ledger' | 'webhooks' | 'reconciliation' | 'counter-billing';

export function AdminPaymentsView() {
  const { showToast } = useToast();

  // Active top-level tab
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('overview');

  // ==========================================
  // TAB 1: OVERVIEW STATE
  // ==========================================
  const [overviewPeriod, setOverviewPeriod] = React.useState<'ALL' | '30D' | '7D' | '24H'>('ALL');
  const [overviewData, setOverviewData] = React.useState<TransactionOverviewDto | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = React.useState<boolean>(true);

  // ==========================================
  // TAB 2: LEDGER STATE (Server-side Paginated)
  // ==========================================
  const [transactions, setTransactions] = React.useState<Payment[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [pageSize] = React.useState<number>(10);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [totalElements, setTotalElements] = React.useState<number>(0);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
  const [providerFilter, setProviderFilter] = React.useState<string>('ALL');
  const [isLoadingLedger, setIsLoadingLedger] = React.useState<boolean>(true);
  const [ledgerError, setLedgerError] = React.useState<string | null>(null);

  // Selected Transaction for Drawer
  const [selectedTxn, setSelectedTxn] = React.useState<Payment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);

  // Verification & Rejection Modal State
  const [verifyingPayment, setVerifyingPayment] = React.useState<Payment | null>(null);
  const [adminNotes, setAdminNotes] = React.useState('');
  const [isVerifyingAction, setIsVerifyingAction] = React.useState(false);

  const [rejectingPayment, setRejectingPayment] = React.useState<Payment | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [isRejectingAction, setIsRejectingAction] = React.useState(false);

  // Clipboard copy state
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  // ==========================================
  // TAB 3: WEBHOOKS MONITOR STATE
  // ==========================================
  const [webhooks, setWebhooks] = React.useState<WebhookEventDto[]>([]);
  const [webhookPage, setWebhookPage] = React.useState<number>(0);
  const [webhookPageSize] = React.useState<number>(10);
  const [webhookTotalPages, setWebhookTotalPages] = React.useState<number>(0);
  const [webhookTotalElements, setWebhookTotalElements] = React.useState<number>(0);
  const [webhookStatusFilter, setWebhookStatusFilter] = React.useState<string>('ALL');
  const [webhookProviderFilter, setWebhookProviderFilter] = React.useState<string>('ALL');
  const [webhookSearch, setWebhookSearch] = React.useState<string>('');
  const [isLoadingWebhooks, setIsLoadingWebhooks] = React.useState<boolean>(false);
  const [retryingWebhookId, setRetryingWebhookId] = React.useState<number | null>(null);
  const [inspectedWebhook, setInspectedWebhook] = React.useState<WebhookEventDto | null>(null);

  // ==========================================
  // TAB 4: RECONCILIATION STATE
  // ==========================================
  const [reconReport, setReconReport] = React.useState<PaymentReconciliationReportDto | null>(null);
  const [isLoadingRecon, setIsLoadingRecon] = React.useState<boolean>(false);
  const [recoveringOrderId, setRecoveringOrderId] = React.useState<number | null>(null);

  // ==========================================
  // FETCH HANDLERS
  // ==========================================

  const fetchOverview = React.useCallback(async (period: string = overviewPeriod) => {
    setIsLoadingOverview(true);
    try {
      const res = await getTransactionOverviewApi(period);
      if (res.success && res.data) {
        setOverviewData(res.data);
      }
    } catch (err: any) {
      console.warn('Overview fetch note:', err?.message);
    } finally {
      setIsLoadingOverview(false);
    }
  }, [overviewPeriod]);

  const fetchLedger = React.useCallback(async (targetPage: number = page) => {
    setIsLoadingLedger(true);
    setLedgerError(null);
    try {
      const res = await getTransactionsHistoryApi({
        page: targetPage,
        size: pageSize,
        search: searchQuery.trim() || undefined,
        status: statusFilter,
        provider: providerFilter,
      });

      if (res.success && res.data) {
        setTransactions(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
        setPage(res.data.number || 0);
      } else {
        setLedgerError(res.message || 'Unable to retrieve transaction ledger.');
      }
    } catch (err: any) {
      setLedgerError(err?.message || 'Error connecting to transaction records.');
    } finally {
      setIsLoadingLedger(false);
    }
  }, [page, pageSize, searchQuery, statusFilter, providerFilter]);

  const fetchWebhooks = React.useCallback(async (targetPage: number = webhookPage) => {
    setIsLoadingWebhooks(true);
    try {
      const res = await getWebhooksApi({
        page: targetPage,
        size: webhookPageSize,
        provider: webhookProviderFilter,
        status: webhookStatusFilter,
        search: webhookSearch.trim() || undefined,
      });

      if (res.success && res.data) {
        setWebhooks(res.data.content || []);
        setWebhookTotalPages(res.data.totalPages || 0);
        setWebhookTotalElements(res.data.totalElements || 0);
        setWebhookPage(res.data.number || 0);
      }
    } catch (err: any) {
      console.warn('Webhooks fetch note:', err?.message);
    } finally {
      setIsLoadingWebhooks(false);
    }
  }, [webhookPage, webhookPageSize, webhookProviderFilter, webhookStatusFilter, webhookSearch]);

  const fetchReconciliation = React.useCallback(async () => {
    setIsLoadingRecon(true);
    try {
      const res = await getPaymentReconciliationReportApi();
      if (res.success && res.data) {
        setReconReport(res.data);
      }
    } catch (err: any) {
      console.warn('Reconciliation report fetch note:', err?.message);
    } finally {
      setIsLoadingRecon(false);
    }
  }, []);

  // Initial load & Tab triggers
  React.useEffect(() => {
    fetchOverview(overviewPeriod);
    fetchLedger(0);
    fetchReconciliation();
  }, [fetchOverview, overviewPeriod, fetchLedger, fetchReconciliation]);

  React.useEffect(() => {
    if (activeTab === 'webhooks') {
      fetchWebhooks(0);
    } else if (activeTab === 'reconciliation') {
      fetchReconciliation();
    }
  }, [activeTab, fetchWebhooks, fetchReconciliation]);

  // Debounced search for ledger
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchLedger(0);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, providerFilter]);

  // Debounced search for webhooks
  React.useEffect(() => {
    if (activeTab === 'webhooks') {
      const timer = setTimeout(() => {
        fetchWebhooks(0);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [webhookSearch, webhookStatusFilter, webhookProviderFilter, activeTab]);

  // ==========================================
  // ACTIONS
  // ==========================================

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    showToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleConfirmVerify = async () => {
    if (!verifyingPayment) return;
    setIsVerifyingAction(true);
    try {
      const res = await adminVerifyPaymentApi(verifyingPayment.id, {
        notes: adminNotes.trim() || undefined,
      });
      if (res.success) {
        showToast(`Payment #PAY-${verifyingPayment.id} verified and entitlements provisioned!`, 'success');
        setVerifyingPayment(null);
        fetchLedger(page);
        fetchOverview();
        fetchReconciliation();
        if (selectedTxn?.id === verifyingPayment.id) {
          setIsDrawerOpen(false);
        }
      } else {
        showToast(res.message || 'Verification failed.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Verification request failed.', 'error');
    } finally {
      setIsVerifyingAction(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingPayment) return;
    if (!rejectionReason.trim()) {
      showToast('Please provide a rejection reason.', 'warning');
      return;
    }
    setIsRejectingAction(true);
    try {
      const res = await adminRejectPaymentApi(rejectingPayment.id, {
        failureReason: rejectionReason.trim(),
        notes: adminNotes.trim() || undefined,
      });
      if (res.success) {
        showToast(`Payment #PAY-${rejectingPayment.id} marked as rejected.`, 'info');
        setRejectingPayment(null);
        fetchLedger(page);
        fetchOverview();
        fetchReconciliation();
        if (selectedTxn?.id === rejectingPayment.id) {
          setIsDrawerOpen(false);
        }
      } else {
        showToast(res.message || 'Rejection failed.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Rejection request failed.', 'error');
    } finally {
      setIsRejectingAction(false);
    }
  };

  const handleRetryWebhook = async (webhookEventId: number) => {
    setRetryingWebhookId(webhookEventId);
    try {
      const res = await retryWebhookApi(webhookEventId);
      if (res.success) {
        showToast(`Webhook #${webhookEventId} retried and processed successfully!`, 'success');
        fetchWebhooks(webhookPage);
        fetchOverview();
      } else {
        showToast(res.message || 'Webhook retry execution failed.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Webhook retry failed.', 'error');
    } finally {
      setRetryingWebhookId(null);
    }
  };

  const handleRecoverReconciliation = async (orderId: number) => {
    setRecoveringOrderId(orderId);
    try {
      const res = await recoverReconciliationApi(orderId);
      if (res.success) {
        showToast(`Reconciliation recovery succeeded for Order #${orderId}. Entitlements provisioned!`, 'success');
        fetchReconciliation();
        fetchLedger(page);
        fetchOverview();
      } else {
        showToast(res.message || 'Reconciliation recovery failed.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Reconciliation recovery failed.', 'error');
    } finally {
      setRecoveringOrderId(null);
    }
  };

  // Helper calculation for success percentage
  const totalTxnCount = overviewData?.totalTransactions || 0;
  const successTxnCount = overviewData?.successfulCount || 0;
  const successRate = totalTxnCount > 0 ? ((successTxnCount / totalTxnCount) * 100).toFixed(1) : '100.0';

  return (
    <div className="space-y-6 animate-in fade-in duration-300 motion-reduce:animate-none">
      {/* Top Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-[22px] bg-white/90 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.025),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-[#FF6B4A] before:via-[#FF8E53] before:to-[#f5c6b8]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Transaction Operations Center</h1>
            <AdminBadge variant="brand">V15 Operations</AdminBadge>
            {reconReport && reconReport.anomalyCount > 0 && (
              <AdminBadge variant="warning">{reconReport.anomalyCount} Anomaly</AdminBadge>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Real-time financial telemetry, distributed webhook idempotency, server-side transaction ledger, and automated reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => {
              if (activeTab === 'overview') fetchOverview(overviewPeriod);
              else if (activeTab === 'ledger') fetchLedger(page);
              else if (activeTab === 'webhooks') fetchWebhooks(webhookPage);
              else if (activeTab === 'reconciliation') fetchReconciliation();
            }}
            disabled={isLoadingLedger || isLoadingOverview || isLoadingWebhooks || isLoadingRecon}
            leftIcon={<RefreshCw className={cn("w-3.5 h-3.5", (isLoadingLedger || isLoadingOverview || isLoadingWebhooks || isLoadingRecon) && "animate-spin")} />}
          >
            Sync Data
          </AdminButton>
        </div>
      </div>

      {/* 4-Tab Navigation */}
      <div role="tablist" aria-label="Payment operations views" className="flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200/80 bg-white/80 shadow-[0_4px_18px_rgba(15,23,42,0.025)] overflow-x-auto">
        <button
          role="tab"
          aria-selected={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          className={cn(
            "px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-[background-color,box-shadow,transform,color] duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20",
            activeTab === 'overview'
              ? "bg-gradient-to-r from-[#FF6B4A] to-[#FF8E53] text-white shadow-[0_6px_18px_rgba(255,107,74,0.22)]"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Overview &amp; Health</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'ledger'}
          onClick={() => setActiveTab('ledger')}
          className={cn(
            "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap",
            activeTab === 'ledger'
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Transaction Ledger ({totalElements})</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'webhooks'}
          onClick={() => setActiveTab('webhooks')}
          className={cn(
            "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap",
            activeTab === 'webhooks'
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Webhook Operations</span>
          {overviewData && overviewData.webhookFailures > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
              {overviewData.webhookFailures} failed
            </span>
          )}
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'reconciliation'}
          onClick={() => setActiveTab('reconciliation')}
          className={cn(
            "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap",
            activeTab === 'reconciliation'
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Reconciliation &amp; Recovery</span>
          {reconReport && reconReport.anomalyCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
              {reconReport.anomalyCount}
            </span>
          )}
        </button>

        <button
          id="btn-counter-billing"
          data-testid="counter-billing-tab"
          role="tab"
          aria-selected={activeTab === 'counter-billing'}
          onClick={() => setActiveTab('counter-billing')}
          className={cn(
            "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap",
            activeTab === 'counter-billing'
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>POS Counter Billing</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
            Register
          </span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: OVERVIEW & TELEMETRY                                          */}
      {/* =================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Period Selection Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {(['ALL', '30D', '7D', '24H'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setOverviewPeriod(p);
                    fetchOverview(p);
                  }}
                  className={cn(
                    "px-3 py-1 font-semibold rounded-lg transition-all cursor-pointer",
                    overviewPeriod === p
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {p === 'ALL' ? 'All Time' : p === '30D' ? 'Last 30 Days' : p === '7D' ? 'Last 7 Days' : 'Last 24 Hours'}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400">
              Telemetry updated: {overviewData?.generatedAt ? new Date(overviewData.generatedAt).toLocaleTimeString() : 'Live'}
            </div>
          </div>

          {/* Core KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Settled Volume */}
            <AdminCard className="p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Settled Volume</div>
                <div className="text-xl font-black text-slate-900 truncate">
                  ₹{Number(overviewData?.successfulAmount || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium">
                  {overviewData?.successfulCount || 0} successful orders
                </div>
              </div>
            </AdminCard>

            {/* Total Transactions & Success Rate */}
            <AdminCard className="p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Volume / Success</div>
                <div className="text-xl font-black text-slate-900">
                  {overviewData?.totalTransactions || 0} Txns
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {successRate}% completion rate
                </div>
              </div>
            </AdminCard>

            {/* Pending Settlements / Verification */}
            <AdminCard className="p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Settlement</div>
                <div className="text-xl font-black text-amber-600 font-mono">
                  {overviewData?.pendingCount || 0}
                </div>
                <div className="text-[11px] text-slate-500">
                  ₹{Number(overviewData?.pendingAmount || 0).toLocaleString('en-IN')} awaiting review
                </div>
              </div>
            </AdminCard>

            {/* Operational Integrity Anomaly Count */}
            <AdminCard className="p-4 flex items-center gap-4">
              <div className={cn(
                "w-11 h-11 rounded-xl border flex items-center justify-center shrink-0",
                (overviewData?.reconciliationDiscrepancies || 0) > 0 || (overviewData?.webhookFailures || 0) > 0
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "bg-emerald-50 border-emerald-100 text-emerald-600"
              )}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Integrity Watch</div>
                <div className={cn(
                  "text-xl font-black font-mono",
                  (overviewData?.reconciliationDiscrepancies || 0) > 0 || (overviewData?.webhookFailures || 0) > 0
                    ? "text-rose-600"
                    : "text-emerald-700"
                )}>
                  {(overviewData?.reconciliationDiscrepancies || 0) + (overviewData?.webhookFailures || 0)} Alerts
                </div>
                <div className="text-[11px] text-slate-500">
                  {overviewData?.webhookFailures || 0} webhooks, {overviewData?.reconciliationDiscrepancies || 0} recon
                </div>
              </div>
            </AdminCard>
          </div>

          {/* Secondary Telemetry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Payment Status Breakdown */}
            <AdminCard className="p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Transaction States</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Successful / Settled
                  </span>
                  <span className="font-mono font-bold text-slate-900">{overviewData?.successfulCount || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Pending Verification
                  </span>
                  <span className="font-mono font-bold text-slate-900">{overviewData?.pendingCount || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Failed / Rejected
                  </span>
                  <span className="font-mono font-bold text-slate-900">{overviewData?.failedCount || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    Refunded
                  </span>
                  <span className="font-mono font-bold text-slate-900">{overviewData?.refundedCount || 0}</span>
                </div>
              </div>
            </AdminCard>

            {/* Quick Actions Card */}
            <AdminCard className="p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Operational Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab('ledger');
                    setStatusFilter('PENDING');
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-colors flex items-center justify-between text-left text-xs cursor-pointer"
                >
                  <span className="font-semibold text-slate-800">Review Pending UTR Submissions</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    setActiveTab('webhooks');
                    setWebhookStatusFilter('FAILED');
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 transition-colors flex items-center justify-between text-left text-xs cursor-pointer"
                >
                  <span className="font-semibold text-slate-800">Investigate Failed Webhooks</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => setActiveTab('reconciliation')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors flex items-center justify-between text-left text-xs cursor-pointer"
                >
                  <span className="font-semibold text-slate-800">Audit Entitlement Mismatches</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </AdminCard>

            {/* Resilience Architecture Pill */}
            <AdminCard className="p-5 space-y-3 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Payment Security Core</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Protected with HMAC-SHA256 constant-time verification, PostgreSQL row locking (PESSIMISTIC_WRITE), and database-level idempotency guards across all gateways.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Zero Duplicate Fulfillment Guarantee
              </div>
            </AdminCard>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: TRANSACTION LEDGER (Paginated + Filterable)                  */}
      {/* =================================================================== */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <AdminCard className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <AdminInput
                  placeholder="Search by Payment ID, Order ID, UTR, Payer Name, Email, or Gateway Ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>

              <div className="w-full sm:w-48">
                <AdminSelect
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                  options={[
                    { value: 'ALL', label: 'All Providers' },
                    { value: 'RAZORPAY', label: 'Razorpay PG' },
                    { value: 'UPI_DIRECT', label: 'Direct UPI / QR' },
                    { value: 'COD', label: 'Cash on Delivery' },
                  ]}
                />
              </div>

              <div className="w-full sm:w-48">
                <AdminSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'ALL', label: 'All Statuses' },
                    { value: 'SUCCESSFUL', label: 'Successful / Paid' },
                    { value: 'PENDING', label: 'Pending Verification' },
                    { value: 'FAILED', label: 'Failed / Rejected' },
                    { value: 'REFUNDED', label: 'Refunded' },
                  ]}
                />
              </div>
            </div>
          </AdminCard>

          {/* Ledger Table */}
          <AdminCard className="overflow-hidden">
            {isLoadingLedger ? (
              <div className="p-6">
                <AdminTableSkeleton rows={6} cols={8} />
              </div>
            ) : ledgerError ? (
              <div className="p-8 text-center text-rose-600">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-500" />
                <p className="font-semibold text-sm">{ledgerError}</p>
                <AdminButton variant="secondary" size="sm" onClick={() => fetchLedger(0)} className="mt-3">
                  Retry Connection
                </AdminButton>
              </div>
            ) : transactions.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4">Payment Ref</th>
                        <th className="py-3 px-4">Order Ref</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Provider &amp; Method</th>
                        <th className="py-3 px-4">Transaction / UTR</th>
                        <th className="py-3 px-4 text-right">Amount (₹)</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Date</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map((pay) => (
                        <tr key={pay.id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Payment Ref */}
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                            #PAY-{pay.id}
                          </td>

                          {/* Order Ref */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {pay.orderId ? (
                              <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                #ORD-{pay.orderId}
                              </span>
                            ) : pay.razorpayOrderId ? (
                              <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                {pay.razorpayOrderId}
                              </span>
                            ) : (
                              <span className="text-slate-400">Direct Txn</span>
                            )}
                          </td>

                          {/* Customer */}
                          <td className="py-3 px-4">
                            <div className="max-w-[160px] truncate">
                              <div className="font-semibold text-slate-900 truncate">
                                {pay.customerName || pay.payerName || 'Direct Customer'}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {pay.customerEmail || pay.payerUpiId || '—'}
                              </div>
                            </div>
                          </td>

                          {/* Provider & Method */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {pay.provider === 'UPI_DIRECT' ? (
                              <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                                <QrCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Direct UPI / QR</span>
                              </div>
                            ) : pay.provider === 'COD' ? (
                              <div className="flex items-center gap-1.5 font-semibold text-amber-800">
                                <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>Cash on Delivery</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 font-semibold text-blue-800">
                                <CreditCard className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span>Razorpay PG</span>
                              </div>
                            )}
                          </td>

                          {/* UTR / Transaction Reference */}
                          <td className="py-3 px-4">
                            {pay.transactionReference ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-slate-900 select-all">
                                  {pay.transactionReference}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(pay.transactionReference!)}
                                  className="text-slate-400 hover:text-slate-600 transition-colors"
                                  title="Copy UTR"
                                >
                                  {copiedText === pay.transactionReference ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            ) : pay.razorpayPaymentId ? (
                              <div className="font-mono text-slate-600 max-w-[140px] truncate" title={pay.razorpayPaymentId}>
                                {pay.razorpayPaymentId}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">No reference</span>
                            )}
                          </td>

                          {/* Amount */}
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 text-right whitespace-nowrap">
                            ₹{Number(pay.amount).toLocaleString('en-IN')}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <StatusBadge status={pay.status} />
                          </td>

                          {/* Date */}
                          <td className="py-3 px-4 text-right text-slate-500 whitespace-nowrap">
                            {pay.createdAt ? new Date(pay.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'N/A'}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTxn(pay);
                                  setIsDrawerOpen(true);
                                }}
                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                title="Inspect Transaction"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {pay.status === 'PENDING' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setVerifyingPayment(pay);
                                      setAdminNotes('');
                                    }}
                                    className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Verify and Approve"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Verify</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRejectingPayment(pay);
                                      setRejectionReason('');
                                      setAdminNotes('');
                                    }}
                                    className="px-2 py-0.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Reject Payment"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Server-side Pagination Footer */}
                <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                  <div>
                    Showing <span className="font-semibold text-slate-800">{page * pageSize + 1}</span> to{' '}
                    <span className="font-semibold text-slate-800">
                      {Math.min((page + 1) * pageSize, totalElements)}
                    </span>{' '}
                    of <span className="font-semibold text-slate-800">{totalElements}</span> transactions
                  </div>

                  <div className="flex items-center gap-1">
                    <AdminButton
                      variant="outline"
                      size="sm"
                      onClick={() => fetchLedger(page - 1)}
                      disabled={page <= 0 || isLoadingLedger}
                      leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                    >
                      Previous
                    </AdminButton>

                    <div className="px-3 py-1 font-mono font-medium text-slate-700">
                      Page {page + 1} of {Math.max(1, totalPages)}
                    </div>

                    <AdminButton
                      variant="outline"
                      size="sm"
                      onClick={() => fetchLedger(page + 1)}
                      disabled={page >= totalPages - 1 || isLoadingLedger}
                      rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    >
                      Next
                    </AdminButton>
                  </div>
                </div>
              </>
            ) : (
              <AdminEmptyState
                title="No transaction records found"
                description={
                  searchQuery || statusFilter !== 'ALL' || providerFilter !== 'ALL'
                    ? "No transactions match your current search and filter criteria."
                    : "Payments, UPI transfers, and settlements will appear here."
                }
                icon={<CreditCard className="w-6 h-6 text-slate-400" />}
              />
            )}
          </AdminCard>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: WEBHOOK OPERATIONS CENTER                                    */}
      {/* =================================================================== */}
      {activeTab === 'webhooks' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <AdminCard className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <AdminInput
                  placeholder="Search by Webhook Event ID or Payload content..."
                  value={webhookSearch}
                  onChange={(e) => setWebhookSearch(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>

              <div className="w-full sm:w-48">
                <AdminSelect
                  value={webhookProviderFilter}
                  onChange={(e) => setWebhookProviderFilter(e.target.value)}
                  options={[
                    { value: 'ALL', label: 'All Providers' },
                    { value: 'RAZORPAY', label: 'Razorpay' },
                    { value: 'YOUPI', label: 'YouPi' },
                  ]}
                />
              </div>

              <div className="w-full sm:w-48">
                <AdminSelect
                  value={webhookStatusFilter}
                  onChange={(e) => setWebhookStatusFilter(e.target.value)}
                  options={[
                    { value: 'ALL', label: 'All Event States' },
                    { value: 'PROCESSED', label: 'PROCESSED' },
                    { value: 'RECEIVED', label: 'RECEIVED' },
                    { value: 'PROCESSING', label: 'PROCESSING' },
                    { value: 'FAILED', label: 'FAILED' },
                    { value: 'DUPLICATE', label: 'DUPLICATE' },
                  ]}
                />
              </div>
            </div>
          </AdminCard>

          {/* Webhooks Table */}
          <AdminCard className="overflow-hidden">
            {isLoadingWebhooks ? (
              <div className="p-6">
                <AdminTableSkeleton rows={5} cols={7} />
              </div>
            ) : webhooks.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4">Event Ref</th>
                        <th className="py-3 px-4">Provider</th>
                        <th className="py-3 px-4">Event Type</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Attempts</th>
                        <th className="py-3 px-4">Received At</th>
                        <th className="py-3 px-4">Processed At</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {webhooks.map((wh) => (
                        <tr key={wh.id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Event Ref */}
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                            #{wh.id}
                            <span className="block text-[10px] text-slate-400 font-normal truncate max-w-[140px]" title={wh.externalEventId}>
                              {wh.externalEventId}
                            </span>
                          </td>

                          {/* Provider */}
                          <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                            {wh.provider}
                          </td>

                          {/* Event Type */}
                          <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              {wh.eventType}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <StatusBadge status={wh.status} />
                          </td>

                          {/* Attempts */}
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                            {wh.attemptCount || 1}
                          </td>

                          {/* Received At */}
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                            {wh.receivedAt ? new Date(wh.receivedAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            }) : '—'}
                          </td>

                          {/* Processed At */}
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                            {wh.processedAt ? new Date(wh.processedAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            }) : wh.errorReason ? (
                              <span className="text-rose-600 font-medium truncate block max-w-[160px]" title={wh.errorReason}>
                                {wh.errorReason}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Pending</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {wh.payloadSummary && (
                                <button
                                  type="button"
                                  onClick={() => setInspectedWebhook(wh)}
                                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                                  title="Inspect Payload"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}

                              {wh.status === 'FAILED' && (
                                <AdminButton
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRetryWebhook(wh.id)}
                                  isLoading={retryingWebhookId === wh.id}
                                  leftIcon={<RotateCw className="w-3 h-3" />}
                                  className="text-xs text-rose-700 hover:bg-rose-50 border-rose-200"
                                >
                                  Retry
                                </AdminButton>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Webhooks Pagination Footer */}
                <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                  <div>
                    Showing <span className="font-semibold text-slate-800">{webhookPage * webhookPageSize + 1}</span> to{' '}
                    <span className="font-semibold text-slate-800">
                      {Math.min((webhookPage + 1) * webhookPageSize, webhookTotalElements)}
                    </span>{' '}
                    of <span className="font-semibold text-slate-800">{webhookTotalElements}</span> webhook events
                  </div>

                  <div className="flex items-center gap-1">
                    <AdminButton
                      variant="outline"
                      size="sm"
                      onClick={() => fetchWebhooks(webhookPage - 1)}
                      disabled={webhookPage <= 0 || isLoadingWebhooks}
                      leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                    >
                      Previous
                    </AdminButton>

                    <div className="px-3 py-1 font-mono font-medium text-slate-700">
                      Page {webhookPage + 1} of {Math.max(1, webhookTotalPages)}
                    </div>

                    <AdminButton
                      variant="outline"
                      size="sm"
                      onClick={() => fetchWebhooks(webhookPage + 1)}
                      disabled={webhookPage >= webhookTotalPages - 1 || isLoadingWebhooks}
                      rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    >
                      Next
                    </AdminButton>
                  </div>
                </div>
              </>
            ) : (
              <AdminEmptyState
                title="No webhook events recorded"
                description="Live incoming webhook payloads from Razorpay and payment providers will appear here."
                icon={<Terminal className="w-6 h-6 text-slate-400" />}
              />
            )}
          </AdminCard>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: RECONCILIATION & RECOVERY                                    */}
      {/* =================================================================== */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-6">
          {/* Reconciliation KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <AdminCard className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evaluated Records</div>
                <div className="text-lg font-bold text-slate-900">{reconReport?.totalRecordsEvaluated ?? 0}</div>
              </div>
            </AdminCard>

            <AdminCard className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Matched &amp; Balanced</div>
                <div className="text-lg font-bold text-slate-900">{reconReport?.matchedCount ?? 0}</div>
              </div>
            </AdminCard>

            <AdminCard className="p-4 flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl border flex items-center justify-center",
                (reconReport?.anomalyCount || 0) > 0
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "bg-slate-50 border-slate-100 text-slate-400"
              )}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Anomalies</div>
                <div className={cn(
                  "text-lg font-bold font-mono",
                  (reconReport?.anomalyCount || 0) > 0 ? "text-rose-600" : "text-slate-900"
                )}>
                  {reconReport?.anomalyCount ?? 0}
                </div>
              </div>
            </AdminCard>

            <AdminCard className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audit Health</div>
                <div className="text-lg font-bold text-slate-900">
                  {(reconReport?.anomalyCount || 0) === 0 ? 'HEALTHY' : 'ACTION REQUIRED'}
                </div>
              </div>
            </AdminCard>
          </div>

          {/* Anomaly Callout Banner & 1-Click Recovery Actions */}
          {reconReport && reconReport.anomalies && reconReport.anomalies.length > 0 && (
            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Reconciliation Discrepancies ({reconReport.anomalies.length} Issues Detected)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reconReport.anomalies.map((anom, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-rose-700">{anom.anomalyType}</span>
                      <span className="font-mono text-[11px] text-slate-500">PAY #{anom.paymentId} &bull; ORD #{anom.orderId || '—'}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{anom.recommendation}</p>
                    <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                      <span>Payment: {anom.currentPaymentStatus} &bull; Order: {anom.currentOrderStatus}</span>
                      <span>₹{Number(anom.recordedAmount || 0).toLocaleString('en-IN')}</span>
                    </div>

                    {/* 1-Click Recovery Button for MISSING_ENTITLEMENT */}
                    {anom.anomalyType === 'MISSING_ENTITLEMENT' && anom.orderId && (
                      <div className="pt-2 border-t border-rose-100 flex items-center justify-end">
                        <AdminButton
                          variant="primary"
                          size="sm"
                          onClick={() => handleRecoverReconciliation(anom.orderId!)}
                          isLoading={recoveringOrderId === anom.orderId}
                          className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                          leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                        >
                          Run Recovery (Provision Entitlements)
                        </AdminButton>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Matrix Table */}
          <AdminCard className="overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Payment Reconciliation Matrix</h3>
                <p className="text-xs text-slate-500">Continuous ledger cross-checking against order state machines and webhook confirmations.</p>
              </div>
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={fetchReconciliation}
                disabled={isLoadingRecon}
                leftIcon={<RefreshCw className={cn("w-3.5 h-3.5", isLoadingRecon && "animate-spin")} />}
              >
                Re-evaluate
              </AdminButton>
            </div>

            <div className="p-6">
              {(reconReport?.anomalies?.length || 0) === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">All Transactions Balanced</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Zero discrepancies found. All verified payments correspond directly to confirmed orders and provisioned entitlements.
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-600 space-y-2">
                  <p className="font-semibold text-rose-700">
                    {reconReport?.anomalies.length} anomaly item(s) require administrative review or automated recovery above.
                  </p>
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      )}

      {/* =================================================================== */}
      {/* =================================================================== */}
      {/* TAB 5: COUNTER BILLING POS TERMINAL                                  */}
      {/* =================================================================== */}
      {activeTab === 'counter-billing' && (
        <CounterBillingTerminal />
      )}

      {/* SLIDE-OVER DRAWER: TRANSACTION INSPECTOR                            */}
      {/* =================================================================== */}
      <AdminDrawer
        isOpen={isDrawerOpen && !!selectedTxn}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTxn(null);
        }}
        title={`Transaction Details #PAY-${selectedTxn?.id}`}
        subtitle={`Order #${selectedTxn?.orderId || 'Direct'} • Created ${selectedTxn?.createdAt ? new Date(selectedTxn.createdAt).toLocaleDateString() : ''}`}
        width="md"
      >
        {selectedTxn && (
          <div className="space-y-6 text-xs">
            {/* Status and Amount Header Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Amount Paid</div>
                <div className="text-2xl font-black text-slate-900">
                  ₹{Number(selectedTxn.amount).toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Currency: {selectedTxn.currency || 'INR'}</div>
              </div>
              <div className="text-right space-y-1">
                <StatusBadge status={selectedTxn.status} />
                {selectedTxn.orderStatus && (
                  <div className="text-[10px] text-slate-500">
                    Order: <span className="font-bold text-slate-700">{selectedTxn.orderStatus}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Customer Identity</h4>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{selectedTxn.customerName || selectedTxn.payerName || 'Direct Customer'}</span>
                </div>
                {selectedTxn.customerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-600">{selectedTxn.customerEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Provider and Reference Keys */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Gateway &amp; Reference Audit</h4>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">Provider:</span>
                  <span className="font-bold text-slate-900">{selectedTxn.provider}</span>
                </div>
                {selectedTxn.transactionReference && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans">UTR Ref:</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span>{selectedTxn.transactionReference}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedTxn.transactionReference!)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {copiedText === selectedTxn.transactionReference ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                {selectedTxn.razorpayPaymentId && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans">Razorpay Pay ID:</span>
                    <span className="font-bold text-slate-900">{selectedTxn.razorpayPaymentId}</span>
                  </div>
                )}
                {selectedTxn.razorpayOrderId && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans">Razorpay Order ID:</span>
                    <span className="text-slate-700">{selectedTxn.razorpayOrderId}</span>
                  </div>
                )}
                {selectedTxn.payerUpiId && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-sans">Payer UPI ID:</span>
                    <span className="text-slate-700">{selectedTxn.payerUpiId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Verification Metadata */}
            {(selectedTxn.verifiedBy || selectedTxn.verifiedAt || selectedTxn.adminNotes) && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Verification Audit Log</h4>
                <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1 text-emerald-900">
                  {selectedTxn.verifiedBy && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Verified By:</span>
                      <span className="font-semibold">{selectedTxn.verifiedBy}</span>
                    </div>
                  )}
                  {selectedTxn.verifiedAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Verified Timestamp:</span>
                      <span>{new Date(selectedTxn.verifiedAt).toLocaleString()}</span>
                    </div>
                  )}
                  {selectedTxn.adminNotes && (
                    <div className="pt-1 text-[11px] text-slate-600 italic">
                      Notes: &quot;{selectedTxn.adminNotes}&quot;
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Failure Reason */}
            {selectedTxn.failureReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Failure / Rejection Reason</span>
                </div>
                <p className="text-[11px]">{selectedTxn.failureReason}</p>
              </div>
            )}

            {/* Pending Action Buttons inside Drawer */}
            {selectedTxn.status === 'PENDING' && (
              <div className="pt-4 border-t border-slate-200 flex items-center gap-2">
                <AdminButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setVerifyingPayment(selectedTxn);
                    setAdminNotes('');
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Verify Payment
                </AdminButton>
                <AdminButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRejectingPayment(selectedTxn);
                    setRejectionReason('');
                    setAdminNotes('');
                  }}
                  className="flex-1 text-rose-700 border-rose-200 hover:bg-rose-50"
                  leftIcon={<XCircle className="w-3.5 h-3.5" />}
                >
                  Reject Payment
                </AdminButton>
              </div>
            )}
          </div>
        )}
      </AdminDrawer>

      {/* =================================================================== */}
      {/* MODAL: VERIFY PAYMENT                                               */}
      {/* =================================================================== */}
      <AdminModal
        isOpen={!!verifyingPayment}
        onClose={() => setVerifyingPayment(null)}
        title="Verify &amp; Approve Payment"
        maxWidth="md"
      >
        {verifyingPayment && (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Manual Payment Verification</span>
              </div>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Confirming this payment will mark Order <strong>#ORD-{verifyingPayment.orderId}</strong> as <strong>PAID &amp; CONFIRMED</strong> and automatically provision user software licenses, subscriptions, and access credentials.
              </p>
            </div>

            <div className="space-y-2 text-xs border border-slate-200 rounded-xl p-3 bg-slate-50">
              <div className="flex justify-between">
                <span className="text-slate-500">Payment ID:</span>
                <span className="font-mono font-bold text-slate-900">#PAY-{verifyingPayment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-900">#ORD-{verifyingPayment.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payable Amount:</span>
                <span className="font-mono font-black text-emerald-600 text-sm">
                  ₹{Number(verifyingPayment.amount).toLocaleString('en-IN')}
                </span>
              </div>
              {verifyingPayment.transactionReference && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer UTR / Ref:</span>
                  <span className="font-mono font-bold text-slate-900 select-all">
                    {verifyingPayment.transactionReference}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Audit Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Verified against bank statement transaction #423589"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setVerifyingPayment(null)}
                disabled={isVerifyingAction}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="primary"
                size="sm"
                onClick={handleConfirmVerify}
                isLoading={isVerifyingAction}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Approve &amp; Provision Entitlements
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>

      {/* =================================================================== */}
      {/* MODAL: REJECT PAYMENT                                               */}
      {/* =================================================================== */}
      <AdminModal
        isOpen={!!rejectingPayment}
        onClose={() => setRejectingPayment(null)}
        title="Reject Payment Record"
        maxWidth="md"
      >
        {rejectingPayment && (
          <div className="space-y-4">
            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-rose-800 text-xs">
              <p>
                Rejecting Payment <strong>#PAY-{rejectingPayment.id}</strong> (Order <strong>#ORD-{rejectingPayment.orderId}</strong>) will mark the payment as <strong>FAILED</strong>. The customer will be informed that verification could not be completed.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Rejection Reason <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. UTR not found in bank ledger / Amount mismatch"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Internal Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes for records..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setRejectingPayment(null)}
                disabled={isRejectingAction}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="danger"
                size="sm"
                onClick={handleConfirmReject}
                isLoading={isRejectingAction}
              >
                Reject Payment
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>

      {/* =================================================================== */}
      {/* MODAL: INSPECT WEBHOOK PAYLOAD                                      */}
      {/* =================================================================== */}
      <AdminModal
        isOpen={!!inspectedWebhook}
        onClose={() => setInspectedWebhook(null)}
        title={`Webhook Payload #${inspectedWebhook?.id} [${inspectedWebhook?.eventType}]`}
        maxWidth="lg"
      >
        {inspectedWebhook && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
              <span className="font-mono text-slate-500">Provider: <strong>{inspectedWebhook.provider}</strong></span>
              <StatusBadge status={inspectedWebhook.status} />
            </div>

            {inspectedWebhook.errorReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                <strong>Failure Reason:</strong> {inspectedWebhook.errorReason}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-slate-400">Raw JSON Payload</span>
                <button
                  type="button"
                  onClick={() => handleCopy(inspectedWebhook.payloadSummary || '')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Payload</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-96">
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(inspectedWebhook.payloadSummary || '{}'), null, 2);
                  } catch {
                    return inspectedWebhook.payloadSummary || 'No payload available';
                  }
                })()}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => setInspectedWebhook(null)}
              >
                Close
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

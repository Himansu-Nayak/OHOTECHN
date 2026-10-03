'use client';

import * as React from 'react';
import { 
  CreditCard, Search, Filter, RefreshCw, CheckCircle2, 
  AlertCircle, ArrowDownLeft, ShieldCheck, Download, Check,
  XCircle, Copy, Clock, QrCode, Truck, Building2, AlertTriangle, Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { Payment, PaymentReconciliationReportDto } from '@/api/types';
import { 
  getAdminPaymentsApi, 
  adminVerifyPaymentApi, 
  adminRejectPaymentApi,
  getPaymentReconciliationReportApi
} from '@/api/payments';
import { 
  AdminCard, 
  AdminButton, 
  AdminInput, 
  AdminSelect, 
  AdminBadge, 
  StatusBadge, 
  AdminEmptyState, 
  AdminTableSkeleton,
  AdminModal
} from './AdminUiPrimitives';

export function AdminPaymentsView() {
  const { showToast } = useToast();
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [viewMode, setViewMode] = React.useState<'ledger' | 'reconciliation'>('ledger');
  const [reconReport, setReconReport] = React.useState<PaymentReconciliationReportDto | null>(null);
  const [isLoadingRecon, setIsLoadingRecon] = React.useState<boolean>(false);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [providerFilter, setProviderFilter] = React.useState('ALL');
  const [copiedUtr, setCopiedUtr] = React.useState<string | null>(null);

  // Verification & Rejection Modal State
  const [verifyingPayment, setVerifyingPayment] = React.useState<Payment | null>(null);
  const [adminNotes, setAdminNotes] = React.useState('');
  const [isVerifyingAction, setIsVerifyingAction] = React.useState(false);

  const [rejectingPayment, setRejectingPayment] = React.useState<Payment | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [isRejectingAction, setIsRejectingAction] = React.useState(false);

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

  const fetchPayments = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [paymentsRes, reconRes] = await Promise.allSettled([
        getAdminPaymentsApi(),
        getPaymentReconciliationReportApi()
      ]);

      if (paymentsRes.status === 'fulfilled' && paymentsRes.value.success && paymentsRes.value.data) {
        setPayments(paymentsRes.value.data);
      } else if (paymentsRes.status === 'fulfilled') {
        setErrorMsg(paymentsRes.value.message || 'Unable to retrieve payments.');
      }

      if (reconRes.status === 'fulfilled' && reconRes.value.success && reconRes.value.data) {
        setReconReport(reconRes.value.data);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error connecting to payment records.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUtr(text);
    showToast('Copied to clipboard', 'info');
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleConfirmVerify = async () => {
    if (!verifyingPayment) return;
    setIsVerifyingAction(true);
    try {
      const res = await adminVerifyPaymentApi(verifyingPayment.id, {
        notes: adminNotes.trim() || undefined,
      });

      if (res.success && res.data) {
        showToast(`Payment #PAY-${verifyingPayment.id} verified & approved! Software entitlements provisioned.`, 'success');
        setPayments((prev) => prev.map((p) => (p.id === verifyingPayment.id ? res.data! : p)));
        setVerifyingPayment(null);
        setAdminNotes('');
      } else {
        throw new Error(res.message || 'Failed to verify payment');
      }
    } catch (err: any) {
      showToast(err?.message || 'Verification failed', 'error');
    } finally {
      setIsVerifyingAction(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingPayment) return;
    if (!rejectionReason.trim()) {
      showToast('Please specify a rejection reason.', 'error');
      return;
    }
    setIsRejectingAction(true);
    try {
      const res = await adminRejectPaymentApi(rejectingPayment.id, {
        failureReason: rejectionReason.trim(),
        notes: adminNotes.trim() || undefined,
      });

      if (res.success && res.data) {
        showToast(`Payment #PAY-${rejectingPayment.id} marked as rejected.`, 'info');
        setPayments((prev) => prev.map((p) => (p.id === rejectingPayment.id ? res.data! : p)));
        setRejectingPayment(null);
        setRejectionReason('');
        setAdminNotes('');
      } else {
        throw new Error(res.message || 'Failed to reject payment');
      }
    } catch (err: any) {
      showToast(err?.message || 'Rejection failed', 'error');
    } finally {
      setIsRejectingAction(false);
    }
  };

  const filteredPayments = React.useMemo(() => {
    return payments.filter((p) => {
      const matchesStatus =
        statusFilter === 'ALL' ||
        p.status === statusFilter ||
        (statusFilter === 'COMPLETED' && p.status === 'SUCCESSFUL');
      const matchesProvider =
        providerFilter === 'ALL' ||
        p.provider === providerFilter ||
        (providerFilter === 'UPI_DIRECT' && (p.provider === 'BANK_TRANSFER' || p.method === 'UPI'));
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.id.toString().includes(q) ||
        (p.orderId && p.orderId.toString().includes(q)) ||
        (p.transactionReference && p.transactionReference.toLowerCase().includes(q)) ||
        (p.payerUpiId && p.payerUpiId.toLowerCase().includes(q)) ||
        (p.payerName && p.payerName.toLowerCase().includes(q)) ||
        (p.razorpayPaymentId && p.razorpayPaymentId.toLowerCase().includes(q)) ||
        (p.razorpayOrderId && p.razorpayOrderId.toLowerCase().includes(q));

      return matchesStatus && matchesProvider && matchesSearch;
    });
  }, [payments, statusFilter, providerFilter, searchQuery]);

  // Aggregate stats from real data
  const totalAmount = React.useMemo(() => {
    return payments
      .filter((p) => p.status === 'COMPLETED' || p.status === 'SUCCESSFUL')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }, [payments]);

  const completedCount = React.useMemo(() => {
    return payments.filter((p) => p.status === 'COMPLETED' || p.status === 'SUCCESSFUL').length;
  }, [payments]);

  const pendingVerificationCount = React.useMemo(() => {
    return payments.filter((p) => p.status === 'PENDING').length;
  }, [payments]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Payments &amp; Settlements</h1>
            <AdminBadge variant="outline">{payments.length} Records</AdminBadge>
            {pendingVerificationCount > 0 && (
              <AdminBadge variant="warning">{pendingVerificationCount} Awaiting Review</AdminBadge>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Audit of Bank Transfer / UPI UTR submissions, COD orders, and Razorpay gateway transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={fetchPayments}
            disabled={isLoading}
            leftIcon={<RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />}
          >
            Sync Ledger
          </AdminButton>
        </div>
      </div>

      {/* View Switcher: Payment Ledger vs Payment Reconciliation */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setViewMode('ledger')}
          className={cn(
            "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2",
            viewMode === 'ledger'
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payment Ledger ({payments.length})</span>
        </button>
        <button
          onClick={() => {
            setViewMode('reconciliation');
            fetchReconciliation();
          }}
          className={cn(
            "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2",
            viewMode === 'reconciliation'
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Reconciliation &amp; Mismatch Audit</span>
          {reconReport && reconReport.anomalyCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
              {reconReport.anomalyCount}
            </span>
          )}
        </button>
      </div>

      {viewMode === 'ledger' ? (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminCard className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Settled Volume</div>
            <div className="text-lg font-bold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</div>
          </div>
        </AdminCard>

        <AdminCard className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Transactions</div>
            <div className="text-lg font-bold text-slate-900">{completedCount} of {payments.length}</div>
          </div>
        </AdminCard>

        <AdminCard className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending UTR Verification</div>
            <div className="text-lg font-bold text-amber-600 font-mono">{pendingVerificationCount} Orders</div>
          </div>
        </AdminCard>
      </div>

      {/* Controls Bar */}
      <AdminCard className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <AdminInput
              placeholder="Search by Payment ID, UTR, Payer UPI, Order ID, or Razorpay ID..."
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
                { value: 'UPI_DIRECT', label: 'Direct UPI / QR' },
                { value: 'COD', label: 'Cash on Delivery' },
                { value: 'RAZORPAY', label: 'Razorpay PG' },
              ]}
            />
          </div>

          <div className="w-full sm:w-48">
            <AdminSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'PENDING', label: 'Pending Verification' },
                { value: 'COMPLETED', label: 'Completed / Verified' },
                { value: 'FAILED', label: 'Rejected / Failed' },
                { value: 'REFUNDED', label: 'Refunded' },
              ]}
            />
          </div>
        </div>
      </AdminCard>

      {/* Payments Ledger Table */}
      <AdminCard className="overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <AdminTableSkeleton rows={5} cols={7} />
          </div>
        ) : errorMsg ? (
          <div className="p-8 text-center text-rose-600">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-500" />
            <p className="font-semibold text-sm">{errorMsg}</p>
            <AdminButton variant="secondary" size="sm" onClick={fetchPayments} className="mt-3">
              Retry Connection
            </AdminButton>
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Payment Ref</th>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">UTR / Transaction Ref</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Date</th>
                  <th className="py-3 px-4 text-center">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Payment Ref */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-xs whitespace-nowrap">
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
                        <span className="text-xs text-slate-400">Direct Txn</span>
                      )}
                    </td>

                    {/* Payment Method / Provider */}
                    <td className="py-3 px-4">
                      {pay.provider === 'UPI_DIRECT' ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                          <QrCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Direct UPI / QR</span>
                        </div>
                      ) : pay.provider === 'COD' ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                          <Truck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Cash on Delivery</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-800">
                          <CreditCard className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Razorpay PG</span>
                        </div>
                      )}
                    </td>

                    {/* UTR / Transaction Reference */}
                    <td className="py-3 px-4">
                      {pay.transactionReference ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-slate-900 select-all">
                              {pay.transactionReference}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(pay.transactionReference!)}
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                              title="Copy UTR"
                            >
                              {copiedUtr === pay.transactionReference ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          {(pay.payerUpiId || pay.payerName) && (
                            <div className="text-[10px] text-slate-500 font-medium truncate max-w-[200px]">
                              {pay.payerName ? `${pay.payerName} ` : ''}
                              {pay.payerUpiId ? `(${pay.payerUpiId})` : ''}
                            </div>
                          )}
                        </div>
                      ) : pay.razorpayPaymentId ? (
                        <div className="font-mono text-xs text-slate-600 max-w-[180px] truncate" title={pay.razorpayPaymentId}>
                          {pay.razorpayPaymentId}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No reference</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 font-semibold text-slate-900 text-right whitespace-nowrap">
                      ₹{Number(pay.amount).toLocaleString('en-IN')}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <StatusBadge status={pay.status} />
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4 text-right text-xs text-slate-500 whitespace-nowrap">
                      {pay.createdAt ? new Date(pay.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      }) : 'N/A'}
                    </td>

                    {/* Admin Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {pay.status === 'PENDING' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setVerifyingPayment(pay);
                              setAdminNotes('');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
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
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                            title="Reject Payment"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : pay.status === 'COMPLETED' || pay.status === 'SUCCESSFUL' ? (
                        <div className="text-[11px] text-emerald-700 font-medium flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{pay.verifiedBy ? `By ${pay.verifiedBy}` : 'Verified'}</span>
                        </div>
                      ) : pay.status === 'FAILED' ? (
                        <div className="text-[11px] text-rose-600 font-medium" title={pay.failureReason || ''}>
                          {pay.failureReason ? `Rejected: ${pay.failureReason}` : 'Rejected'}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmptyState
            title="No payment records found"
            description={
              searchQuery || statusFilter !== 'ALL' || providerFilter !== 'ALL'
                ? "No transactions match your current search or filter criteria."
                : "Commercial payments, UPI transfers, and settlements will appear here."
            }
            icon={<CreditCard className="w-6 h-6 text-slate-400" />}
          />
        )}
      </AdminCard>
      </>
      ) : (
        /* Dedicated Reconciliation View satisfying Requirement 9 */
        <div className="space-y-6">
          {/* Reconciliation KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <AdminCard className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evaluated Records</div>
                <div className="text-lg font-bold text-slate-900">{reconReport?.totalRecordsEvaluated ?? payments.length}</div>
              </div>
            </AdminCard>

            <AdminCard className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Matched &amp; Balanced</div>
                <div className="text-lg font-bold text-slate-900">{reconReport?.matchedCount ?? completedCount}</div>
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

          {/* Anomaly Callout Banner if any anomaly detected */}
          {reconReport && reconReport.anomalies && reconReport.anomalies.length > 0 && (
            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Ledger Reconciliation Alerts ({reconReport.anomalies.length} Issues Detected)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reconReport.anomalies.map((anom, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-rose-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-rose-700">{anom.anomalyType}</span>
                      <span className="font-mono text-[11px] text-slate-500">PAY #{anom.paymentId} &bull; ORD #{anom.orderId || '—'}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{anom.recommendation}</p>
                    <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                      <span>Payment: {anom.currentPaymentStatus} &bull; Order: {anom.currentOrderStatus}</span>
                      <span>₹{Number(anom.recordedAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reconciliation Audit Table */}
          <AdminCard className="overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Payment Reconciliation Audit Matrix</h3>
                <p className="text-xs text-slate-500">Cross-verifying PostgreSQL Payment records with Order state machines &amp; Gateway IDs.</p>
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

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Payment ID</th>
                    <th className="py-3 px-4">Razorpay Order ID</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Currency</th>
                    <th className="py-3 px-4 text-center">Payment Status</th>
                    <th className="py-3 px-4 text-center">Order Status</th>
                    <th className="py-3 px-4 whitespace-nowrap">Created At</th>
                    <th className="py-3 px-4 whitespace-nowrap">Verified At</th>
                    <th className="py-3 px-4 text-center">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((pay) => {
                    const isMismatch = (pay.status === 'SUCCESSFUL' || pay.status === 'COMPLETED') &&
                      pay.orderStatus && pay.orderStatus !== 'PAID' && pay.orderStatus !== 'CONFIRMED' && pay.orderStatus !== 'DELIVERED';
                    const isPending = pay.status === 'PENDING';

                    return (
                      <tr 
                        key={pay.id} 
                        className={cn(
                          "transition-colors",
                          isMismatch ? "bg-rose-50/50 hover:bg-rose-50/80" : "hover:bg-slate-50/60"
                        )}
                      >
                        {/* 1. Order ID */}
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {pay.orderId ? (
                            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              #ORD-{pay.orderId}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* 2. Payment ID */}
                        <td className="py-3 px-4 font-mono font-medium text-slate-800">
                          #PAY-{pay.id}
                        </td>

                        {/* 3. Razorpay Order ID */}
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                          {pay.razorpayOrderId || (
                            <span className="text-slate-400 italic">Direct / UTR</span>
                          )}
                        </td>

                        {/* 4. Amount */}
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          ₹{Number(pay.amount || 0).toLocaleString('en-IN')}
                        </td>

                        {/* 5. Currency */}
                        <td className="py-3 px-4 text-center font-mono text-slate-500">
                          {pay.currency || 'INR'}
                        </td>

                        {/* 6. Payment Status */}
                        <td className="py-3 px-4 text-center">
                          <StatusBadge status={pay.status} />
                        </td>

                        {/* 7. Order Status */}
                        <td className="py-3 px-4 text-center font-mono">
                          {pay.orderStatus ? (
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold border",
                              pay.orderStatus === 'PAID' || pay.orderStatus === 'CONFIRMED' || pay.orderStatus === 'DELIVERED'
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : pay.orderStatus === 'PENDING'
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            )}>
                              {pay.orderStatus}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">NONE</span>
                          )}
                        </td>

                        {/* 8. Created At */}
                        <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {pay.createdAt ? new Date(pay.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          }) : '—'}
                        </td>

                        {/* 9. Verified At */}
                        <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {pay.verifiedAt ? (
                            <span className="text-emerald-700 font-medium">
                              {new Date(pay.verifiedAt).toLocaleString('en-IN', {
                                dateStyle: 'short',
                                timeStyle: 'short'
                              })}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Unverified</span>
                          )}
                        </td>

                        {/* Audit Status / Mismatch Highlight */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {isMismatch ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              <span>STATUS MISMATCH</span>
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>PENDING AUDIT</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>BALANCED</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </div>
      )}

      {/* Verify & Approve Modal */}
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
              {verifyingPayment.payerUpiId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Payer UPI ID:</span>
                  <span className="font-mono text-slate-800">{verifyingPayment.payerUpiId}</span>
                </div>
              )}
              {verifyingPayment.payerName && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Payer Name:</span>
                  <span className="font-medium text-slate-800">{verifyingPayment.payerName}</span>
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
                placeholder="e.g. Verified against Indian Bank statement transaction #423589"
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

      {/* Reject Payment Modal */}
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
    </div>
  );
}

'use client';

import * as React from 'react';
import { 
  CreditCard, Search, Filter, RefreshCw, CheckCircle2, 
  AlertCircle, ArrowDownLeft, ShieldCheck, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { Payment } from '@/api/types';
import { getAdminPaymentsApi } from '@/api/payments';
import { 
  AdminCard, 
  AdminButton, 
  AdminInput, 
  AdminSelect, 
  AdminBadge, 
  StatusBadge, 
  AdminEmptyState, 
  AdminTableSkeleton 
} from './AdminUiPrimitives';

export function AdminPaymentsView() {
  const { showToast } = useToast();
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');

  const fetchPayments = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await getAdminPaymentsApi();
      if (res.success && res.data) {
        setPayments(res.data);
      } else {
        setErrorMsg(res.message || 'Unable to retrieve payments.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error connecting to payment gateway records.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments = React.useMemo(() => {
    return payments.filter((p) => {
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        p.id.toString().includes(q) ||
        (p.razorpayPaymentId && p.razorpayPaymentId.toLowerCase().includes(q)) ||
        (p.razorpayOrderId && p.razorpayOrderId.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [payments, statusFilter, searchQuery]);

  // Aggregate stats from real data
  const totalAmount = React.useMemo(() => {
    return payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }, [payments]);

  const completedCount = React.useMemo(() => {
    return payments.filter(p => p.status === 'COMPLETED').length;
  }, [payments]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Payments &amp; Settlements</h1>
            <AdminBadge variant="outline">{payments.length} Records</AdminBadge>
          </div>
          <p className="text-sm text-slate-500">
            Real-time audit of payment gateway settlements, transaction hashes, and reconciliation status.
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
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Successful Transactions</div>
            <div className="text-lg font-bold text-slate-900">{completedCount} of {payments.length}</div>
          </div>
        </AdminCard>

        <AdminCard className="p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gateway Provider</div>
            <div className="text-lg font-bold text-slate-900">Razorpay Direct PG</div>
          </div>
        </AdminCard>
      </div>

      {/* Controls Bar */}
      <AdminCard className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <AdminInput
              placeholder="Search by Payment ID, Razorpay ID, or Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="w-full sm:w-56">
            <AdminSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'COMPLETED', label: 'Completed / Settled' },
                { value: 'PENDING', label: 'Pending Processing' },
                { value: 'FAILED', label: 'Failed Attempts' },
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
            <AdminTableSkeleton rows={5} cols={6} />
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
                  <th className="py-3 px-4">Gateway Provider</th>
                  <th className="py-3 px-4">Gateway Txn ID</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Settlement Status</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-xs">
                      #PAY-{pay.id}
                    </td>
                    <td className="py-3 px-4">
                      {pay.razorpayOrderId ? (
                        <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          #ORD-{pay.razorpayOrderId}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Direct Txn</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Razorpay PG
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-600 max-w-[200px] truncate" title={pay.razorpayPaymentId || ''}>
                      {pay.razorpayPaymentId || <span className="text-slate-400 italic">Pending confirmation</span>}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 text-right">
                      ₹{Number(pay.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={pay.status} />
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-slate-500 whitespace-nowrap">
                      {pay.createdAt ? new Date(pay.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      }) : 'N/A'}
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
              searchQuery || statusFilter !== 'ALL'
                ? "No transactions match your current search or status filter criteria."
                : "Commercial payments and gateway settlements will appear here when customers complete transactions."
            }
            icon={<CreditCard className="w-6 h-6 text-slate-400" />}
          />
        )}
      </AdminCard>
    </div>
  );
}

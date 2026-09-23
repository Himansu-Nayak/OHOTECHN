'use client';

import * as React from 'react';
import { Layers, RefreshCw, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Subscription, SubscriptionStatus } from '@/api/types';
import { getAdminSubscriptionsApi, updateAdminSubscriptionStatusApi } from '@/api/subscriptions';
import { useToast } from '@/context/ToastContext';
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  StatusBadge,
  AdminEmptyState,
  AdminTableSkeleton,
  AdminSelect
} from './AdminUiPrimitives';

export function AdminSubscriptionsView() {
  const { showToast } = useToast();
  const [subs, setSubs] = React.useState<Subscription[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState('ALL');

  const fetchSubscriptions = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminSubscriptionsApi();
      if (res.success && res.data) {
        setSubs(res.data);
      } else {
        setError(res.message || 'Unable to retrieve subscriptions');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to subscription services');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleUpdateStatus = async (id: number, newStatus: SubscriptionStatus) => {
    try {
      const res = await updateAdminSubscriptionStatusApi(id, newStatus);
      if (res.success && res.data) {
        showToast(`Subscription #${id} status changed to ${newStatus}`, 'success');
        setSubs((prev) => prev.map((s) => (s.id === id ? res.data! : s)));
      } else {
        showToast(res.message || 'Failed to update subscription', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error updating subscription status', 'error');
    }
  };

  const filteredSubs = React.useMemo(() => {
    if (statusFilter === 'ALL') return subs;
    return subs.filter(s => s.status === statusFilter);
  }, [subs, statusFilter]);

  const activeCount = subs.filter(s => s.status === 'ACTIVE').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Software Subscriptions &amp; Billing Cycles</h1>
            <AdminBadge variant="success">{activeCount} Active Contracts</AdminBadge>
          </div>
          <p className="text-sm text-slate-500">
            Customer subscription renewal schedules, plan tiers, and lifecycle statuses.
          </p>
        </div>

        <AdminButton
          variant="secondary"
          size="sm"
          onClick={fetchSubscriptions}
          disabled={loading}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
        >
          Sync Subscriptions
        </AdminButton>
      </div>

      {/* Filter Bar */}
      <div className="flex justify-end">
        <div className="w-full sm:w-48">
          <AdminSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Subscriptions' },
              { value: 'ACTIVE', label: 'Active Contracts' },
              { value: 'TRIAL', label: 'Trial Period' },
              { value: 'CANCELLED', label: 'Cancelled' },
              { value: 'EXPIRED', label: 'Expired' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <AdminCard className="overflow-hidden">
        {loading ? (
          <div className="p-6">
            <AdminTableSkeleton rows={5} cols={6} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-500" />
            <p className="font-semibold text-sm">{error}</p>
            <AdminButton variant="secondary" size="sm" onClick={fetchSubscriptions} className="mt-3">
              Retry Connection
            </AdminButton>
          </div>
        ) : filteredSubs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Subscription ID</th>
                  <th className="py-3 px-4">Client / User</th>
                  <th className="py-3 px-4">Plan Name</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Renewal Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-xs">
                      #SUB-{sub.id}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <div className="font-medium text-slate-900">{sub.user?.name || 'Customer'}</div>
                      <div className="text-slate-400">{sub.user?.email || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 text-xs">
                      {sub.productPlan?.name || sub.product?.name || 'Enterprise'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {sub.expiryDate ? new Date(sub.expiryDate).toLocaleDateString('en-IN') : 'Continuous'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {sub.status === 'ACTIVE' ? (
                        <AdminButton
                          variant="danger"
                          size="sm"
                          onClick={() => handleUpdateStatus(sub.id, 'CANCELLED')}
                        >
                          Cancel Plan
                        </AdminButton>
                      ) : (
                        <AdminButton
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateStatus(sub.id, 'ACTIVE')}
                        >
                          Reactivate
                        </AdminButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmptyState
            title="No subscriptions found"
            description="When recurring software plans are purchased, subscriptions will populate here."
            icon={<Layers className="w-6 h-6 text-slate-400" />}
          />
        )}
      </AdminCard>
    </div>
  );
}

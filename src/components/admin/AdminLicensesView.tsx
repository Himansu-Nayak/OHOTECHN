'use client';

import * as React from 'react';
import { KeyRound, RefreshCw, AlertCircle, Shield, Laptop } from 'lucide-react';
import { License, LicenseStatus } from '@/api/types';
import { getAdminLicensesApi, updateAdminLicenseStatusApi } from '@/api/licenses';
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

export function AdminLicensesView() {
  const { showToast } = useToast();
  const [licenses, setLicenses] = React.useState<License[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState('ALL');

  const fetchLicenses = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminLicensesApi();
      if (res.success && res.data) {
        setLicenses(res.data);
      } else {
        setError(res.message || 'Unable to retrieve cryptographic licenses');
      }
    } catch (err: any) {
      setError(err?.message || 'Error connecting to license validation services');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  const handleUpdateStatus = async (id: number, newStatus: LicenseStatus) => {
    try {
      const res = await updateAdminLicenseStatusApi(id, newStatus);
      if (res.success && res.data) {
        showToast(`License #${id} status changed to ${newStatus}`, 'success');
        setLicenses((prev) => prev.map((l) => (l.id === id ? res.data! : l)));
      } else {
        showToast(res.message || 'Failed to update license status', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update license status', 'error');
    }
  };

  const filteredLicenses = React.useMemo(() => {
    if (statusFilter === 'ALL') return licenses;
    return licenses.filter(l => l.status === statusFilter);
  }, [licenses, statusFilter]);

  const activeCount = licenses.filter(l => l.status === 'ACTIVE').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cryptographic Software Licenses</h1>
            <AdminBadge variant="primary">{activeCount} Active Keys</AdminBadge>
          </div>
          <p className="text-sm text-slate-500">
            Node locking, device limits, cryptographic hashes, and instant revocation control.
          </p>
        </div>

        <AdminButton
          variant="secondary"
          size="sm"
          onClick={fetchLicenses}
          disabled={loading}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
        >
          Sync Licenses
        </AdminButton>
      </div>

      {/* Filter Bar */}
      <div className="flex justify-end">
        <div className="w-full sm:w-48">
          <AdminSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Licenses' },
              { value: 'ACTIVE', label: 'Active Licenses' },
              { value: 'REVOKED', label: 'Revoked Licenses' },
              { value: 'EXPIRED', label: 'Expired Licenses' },
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
            <AdminButton variant="secondary" size="sm" onClick={fetchLicenses} className="mt-3">
              Retry Connection
            </AdminButton>
          </div>
        ) : filteredLicenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">License Key</th>
                  <th className="py-3 px-4">Product Solution</th>
                  <th className="py-3 px-4">Client User</th>
                  <th className="py-3 px-4">Activations</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLicenses.map((lic) => (
                  <tr key={lic.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-xs tracking-wider">
                      {lic.licenseKey}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-900">
                      {lic.product?.name || 'Enterprise Solution'}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <div className="font-medium text-slate-900">{lic.user?.name || 'Client'}</div>
                      <div className="text-slate-400">{lic.user?.email || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      <span className="font-mono font-medium text-slate-900">{lic.activationCount || 0}</span> / {lic.activationLimit || 1} devices
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={lic.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {lic.status === 'ACTIVE' ? (
                        <AdminButton
                          variant="danger"
                          size="sm"
                          onClick={() => handleUpdateStatus(lic.id, 'REVOKED')}
                        >
                          Revoke Key
                        </AdminButton>
                      ) : (
                        <AdminButton
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateStatus(lic.id, 'ACTIVE')}
                        >
                          Restore
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
            title="No cryptographic software licenses issued"
            description="Confirmed software purchases generate cryptographic license keys automatically."
            icon={<KeyRound className="w-6 h-6 text-slate-400" />}
          />
        )}
      </AdminCard>
    </div>
  );
}

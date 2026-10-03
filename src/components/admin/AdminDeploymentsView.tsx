'use client';

import * as React from 'react';
import { 
  GitPullRequest, Search, CheckCircle2, X, RefreshCw, 
  AlertCircle, ExternalLink, Clock, User, ShieldCheck,
  Server, Cpu, Edit3, ArrowRight, PlayCircle, Building2,
  Check, Filter
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { DeploymentDto, DeploymentStatus } from '@/api/types';
import { 
  getAdminDeploymentsApi, 
  updateAdminDeploymentStatusApi, 
  updateAdminDeploymentCustomerNotesApi 
} from '@/api/deployments';
import { 
  AdminCard, AdminBadge, StatusBadge, AdminButton, 
  AdminInput, AdminSelect, AdminEmptyState, AdminTableSkeleton, 
  AdminModal 
} from './AdminUiPrimitives';

const DEPLOYMENT_STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending Assignment' },
  { value: 'ASSIGNED', label: 'Assigned to Engineer' },
  { value: 'CONFIGURING', label: 'Configuring Environment' },
  { value: 'TESTING', label: 'Testing & QA' },
  { value: 'READY', label: 'Ready for Handoff' },
  { value: 'LIVE', label: 'Live in Production' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const ENVIRONMENT_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Environments' },
  { value: 'CLOUD_MANAGED', label: 'Cloud Managed (AWS/GCP)' },
  { value: 'VPS_HOSTED', label: 'VPS Dedicated (Hostinger/Hetzner)' },
  { value: 'SAAS_INSTANCE', label: 'Dedicated SaaS Multi-Tenant' },
  { value: 'ON_PREMISE_CLIENT', label: 'Client On-Premise / Bare Metal' },
];

export function AdminDeploymentsView() {
  const { showToast } = useToast();
  const [deployments, setDeployments] = React.useState<DeploymentDto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Pagination & Filtering
  const [page, setPage] = React.useState(0);
  const [pageSize] = React.useState(20);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
  const [environmentFilter, setEnvironmentFilter] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Status Update Modal
  const [selectedDeployment, setSelectedDeployment] = React.useState<DeploymentDto | null>(null);
  const [newStatus, setNewStatus] = React.useState<DeploymentStatus>('CONFIGURING');
  const [assignedEngineer, setAssignedEngineer] = React.useState('');
  const [accessUrl, setAccessUrl] = React.useState('');
  const [adminNotes, setAdminNotes] = React.useState('');
  const [customerNotes, setCustomerNotes] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);

  const fetchDeployments = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const statusParam = statusFilter !== 'ALL' ? statusFilter : undefined;
      const res = await getAdminDeploymentsApi(page, pageSize, statusParam);
      if (res.success && res.data) {
        setDeployments(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      } else {
        setErrorMsg(res.message || 'Failed to retrieve deployments');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error connecting to deployment service');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, statusFilter]);

  React.useEffect(() => {
    fetchDeployments();
  }, [fetchDeployments]);

  // Client-side composite filtering for rapid ops triage
  const filteredDeployments = React.useMemo(() => {
    return deployments.filter((d) => {
      // Env filter
      if (environmentFilter !== 'ALL' && d.targetEnvironment !== environmentFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPipeline = `#dep-${d.id}`.toLowerCase().includes(q) || String(d.id).includes(q);
        const matchesProduct = (d.productName || '').toLowerCase().includes(q);
        const matchesCustomer = (d.userName || '').toLowerCase().includes(q) || (d.userEmail || '').toLowerCase().includes(q);
        const matchesEngineer = (d.assignedEngineer || '').toLowerCase().includes(q);
        const matchesProvider = (d.providerName || '').toLowerCase().includes(q);
        return matchesPipeline || matchesProduct || matchesCustomer || matchesEngineer || matchesProvider;
      }
      return true;
    });
  }, [deployments, environmentFilter, searchQuery]);

  const handleOpenStatusModal = (d: DeploymentDto) => {
    setSelectedDeployment(d);
    setNewStatus(d.status);
    setAssignedEngineer(d.assignedEngineer || '');
    setAccessUrl(d.accessUrl || '');
    setAdminNotes(d.adminNotes || '');
    setCustomerNotes(d.customerNotes || '');
  };

  const handleSaveStatus = async (e?: React.FormEvent, overrideStatus?: DeploymentStatus) => {
    if (e) e.preventDefault();
    if (!selectedDeployment) return;

    const targetStatus = overrideStatus || newStatus;

    if (targetStatus === 'LIVE' && !accessUrl.trim()) {
      showToast('A production access URL is required before marking deployment LIVE.', 'error');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateAdminDeploymentStatusApi(selectedDeployment.id, {
        status: targetStatus,
        assignedEngineer: assignedEngineer.trim() || undefined,
        accessUrl: accessUrl.trim() || undefined,
        adminNotes: adminNotes.trim() || undefined,
      });

      if (customerNotes !== (selectedDeployment.customerNotes || '')) {
        await updateAdminDeploymentCustomerNotesApi(selectedDeployment.id, customerNotes);
      }

      if (res.success) {
        showToast(`Deployment #DEP-${selectedDeployment.id} transitioned to ${targetStatus}`, 'success');
        setSelectedDeployment(null);
        fetchDeployments();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update deployment', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadgeVariant = (status: DeploymentStatus) => {
    switch (status) {
      case 'LIVE':
        return 'success';
      case 'READY':
      case 'TESTING':
        return 'info';
      case 'CONFIGURING':
      case 'ASSIGNED':
        return 'warning';
      case 'SUSPENDED':
      case 'CANCELLED':
        return 'error';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Software Provisioning &amp; Deployments</h1>
            <AdminBadge variant="primary">{totalElements} Active Pipelines</AdminBadge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Operational triage of customer software instances, wholesale provider integrations, and cloud handoffs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={fetchDeployments}
            icon={RefreshCw}
            disabled={isLoading}
          >
            Refresh
          </AdminButton>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search #DEP, customer, product, engineer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Status filter */}
          <div className="w-full sm:w-48">
            <AdminSelect
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              options={DEPLOYMENT_STATUS_OPTIONS}
            />
          </div>

          {/* Environment filter */}
          <div className="w-full sm:w-56">
            <AdminSelect
              value={environmentFilter}
              onChange={(e) => setEnvironmentFilter(e.target.value)}
              options={ENVIRONMENT_FILTER_OPTIONS}
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Showing {filteredDeployments.length} of {totalElements}
        </div>
      </div>

      {/* Table */}
      <AdminCard contentClassName="p-0">
        {isLoading ? (
          <AdminTableSkeleton cols={7} rows={6} />
        ) : errorMsg ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-900 mb-1">Failed to Load Deployments</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">{errorMsg}</p>
            <AdminButton variant="outline" size="sm" onClick={fetchDeployments}>
              Try Again
            </AdminButton>
          </div>
        ) : filteredDeployments.length === 0 ? (
          <AdminEmptyState
            title="No Deployments Found"
            description={
              statusFilter !== 'ALL' || environmentFilter !== 'ALL' || searchQuery
                ? 'No deployments match your selected filter criteria.'
                : 'No customer software provisioning jobs scheduled yet.'
            }
            icon={GitPullRequest}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Pipeline #</th>
                  <th className="py-3.5 px-4">Product / Architecture</th>
                  <th className="py-3.5 px-4">Provider Agency</th>
                  <th className="py-3.5 px-4">Customer Account</th>
                  <th className="py-3.5 px-4">Assigned Engineer</th>
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-4">Live Handoff URL</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredDeployments.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      #DEP-{d.id}
                      {d.orderId && (
                        <div className="text-[10px] text-slate-400 font-normal">Order #{d.orderId}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{d.productName || `Product #${d.productId}`}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Env: {d.targetEnvironment || 'CLOUD_MANAGED'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {d.providerName ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-100 text-purple-700 font-semibold text-[11px]">
                          <Building2 className="w-3 h-3 text-purple-500" />
                          <span>{d.providerName}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">In-House / Direct</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-semibold text-slate-900">{d.userName || 'Client'}</div>
                      <div className="text-[11px] text-slate-500">{d.userEmail}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {d.assignedEngineer ? (
                        <div className="inline-flex items-center gap-1.5 text-slate-800">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{d.assignedEngineer}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <AdminBadge variant={getStatusBadgeVariant(d.status)}>
                        {d.status}
                      </AdminBadge>
                    </td>

                    <td className="py-3.5 px-4">
                      {d.accessUrl ? (
                        <a
                          href={d.accessUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sky-600 hover:underline font-mono text-[11px]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="max-w-[130px] truncate">{d.accessUrl}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenStatusModal(d)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold cursor-pointer text-xs"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {/* Manage Deployment Modal */}
      {selectedDeployment && (
        <AdminModal
          isOpen={!!selectedDeployment}
          onClose={() => setSelectedDeployment(null)}
          title={`Manage Deployment #DEP-${selectedDeployment.id}`}
          subtitle={`Update provisioning stage and delivery notes for ${selectedDeployment.productName}.`}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={(e) => handleSaveStatus(e)} className="space-y-4">
            {/* Meta context card */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Product</span>
                <p className="font-semibold text-slate-900">{selectedDeployment.productName}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Wholesale Provider</span>
                <p className="font-semibold text-purple-700">
                  {selectedDeployment.providerName ? selectedDeployment.providerName : 'In-House / Direct Product'}
                </p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Client Email</span>
                <p className="font-semibold text-slate-800">{selectedDeployment.userEmail}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold">Environment Target</span>
                <p className="font-semibold text-slate-800 font-mono">{selectedDeployment.targetEnvironment || 'CLOUD_MANAGED'}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Provisioning Stage *</label>
                {newStatus !== 'LIVE' && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewStatus('LIVE');
                      if (!accessUrl && selectedDeployment.accessUrl) {
                        setAccessUrl(selectedDeployment.accessUrl);
                      }
                    }}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Quick: Set to LIVE</span>
                  </button>
                )}
              </div>
              <AdminSelect
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as DeploymentStatus)}
                options={[
                  { value: 'PENDING', label: '1. PENDING - Awaiting Engineer Assignment' },
                  { value: 'ASSIGNED', label: '2. ASSIGNED - Engineer Assigned' },
                  { value: 'CONFIGURING', label: '3. CONFIGURING - Setting Up Cloud Instance' },
                  { value: 'TESTING', label: '4. TESTING - Running QA & Smoke Tests' },
                  { value: 'READY', label: '5. READY - Ready for Client Access' },
                  { value: 'LIVE', label: '6. LIVE - Handed Off to Customer (Launch URL Active)' },
                  { value: 'SUSPENDED', label: 'SUSPENDED - Temporarily Halted' },
                  { value: 'CANCELLED', label: 'CANCELLED - Terminated' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Systems Engineer</label>
              <AdminInput
                value={assignedEngineer}
                onChange={(e) => setAssignedEngineer(e.target.value)}
                placeholder="e.g. Himansu Nayak"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Production Access URL (Handoff URL)</label>
              <AdminInput
                value={accessUrl}
                onChange={(e) => setAccessUrl(e.target.value)}
                placeholder="https://app.clientdomain.com"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Once state is LIVE, this URL becomes clickable on the customer's portal.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Instructions (Visible to Customer)</label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                rows={2}
                placeholder="Instructions, DNS instructions, or welcome notes visible on client dashboard."
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Internal Operations Notes (Confidential Admin Only)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={2}
                placeholder="Internal server IP, root credentials reference, or escalation log. NEVER shown to customer."
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-slate-900 focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {newStatus !== 'LIVE' ? (
                <button
                  type="button"
                  onClick={() => handleSaveStatus(undefined, 'LIVE')}
                  disabled={isUpdating}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Mark LIVE &amp; Dispatch Handover</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <AdminButton
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedDeployment(null)}
                  disabled={isUpdating}
                >
                  Cancel
                </AdminButton>
                <AdminButton
                  type="submit"
                  variant="primary"
                  isLoading={isUpdating}
                >
                  Save Changes
                </AdminButton>
              </div>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import { 
  Building2, Search, Plus, Edit3, Trash2, CheckCircle2, 
  X, RefreshCw, AlertCircle, ExternalLink, Mail, Phone,
  Layers, ShieldAlert, FileText, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { ProviderDto } from '@/api/types';
import { 
  getAdminProvidersApi, 
  createAdminProviderApi, 
  updateAdminProviderApi, 
  toggleAdminProviderStatusApi, 
  deleteAdminProviderApi 
} from '@/api/providers';
import { 
  AdminCard, AdminBadge, AdminButton, 
  AdminInput, AdminSelect, AdminEmptyState, AdminTableSkeleton, 
  AdminModal, AdminConfirmDialog 
} from './AdminUiPrimitives';

export function AdminProvidersView() {
  const { showToast } = useToast();
  const [providers, setProviders] = React.useState<ProviderDto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Pagination & Filtering
  const [page, setPage] = React.useState(0);
  const [pageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProvider, setEditingProvider] = React.useState<Partial<ProviderDto> | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Delete Dialog
  const [providerToDelete, setProviderToDelete] = React.useState<ProviderDto | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const fetchProviders = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await getAdminProvidersApi(page, pageSize, searchQuery);
      if (res.success && res.data) {
        setProviders(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      } else {
        setErrorMsg(res.message || 'Failed to retrieve providers');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error connecting to provider service');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery]);

  React.useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleToggleStatus = async (provider: ProviderDto) => {
    try {
      const nextActive = !provider.active;
      const res = await toggleAdminProviderStatusApi(provider.id, nextActive);
      if (res.success) {
        showToast(`Provider "${provider.name}" is now ${nextActive ? 'Active' : 'Inactive'}`, 'success');
        setProviders((prev) =>
          prev.map((p) => (p.id === provider.id ? { ...p, active: nextActive } : p))
        );
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update provider status', 'error');
    }
  };

  const handleOpenAddModal = () => {
    setEditingProvider({
      name: '',
      companyName: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      commercialTerms: 'Wholesale agreement with OHO TECH margin markup',
      commissionRate: 30,
      technicalIntegrationType: 'MANUAL',
      integrationStatus: 'Integration pending provider/API information',
      supportResponsibility: 'OHO_TECH',
      deploymentResponsibility: 'OHO_TECH',
      contractStatus: 'ACTIVE',
      notes: '',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (provider: ProviderDto) => {
    setEditingProvider({ ...provider });
    setIsModalOpen(true);
  };

  const handleSaveProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider || !editingProvider.name?.trim()) {
      showToast('Provider name is required', 'info');
      return;
    }

    setIsSaving(true);
    try {
      if (editingProvider.id) {
        const res = await updateAdminProviderApi(editingProvider.id, editingProvider);
        if (res.success) {
          showToast(`Provider "${res.data?.name}" updated successfully`, 'success');
          setIsModalOpen(false);
          fetchProviders();
        }
      } else {
        const res = await createAdminProviderApi(editingProvider);
        if (res.success) {
          showToast(`Provider "${res.data?.name}" registered successfully`, 'success');
          setIsModalOpen(false);
          fetchProviders();
        }
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to save provider agency', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProvider = async () => {
    if (!providerToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteAdminProviderApi(providerToDelete.id);
      if (res.success) {
        showToast(`Provider agency "${providerToDelete.name}" deactivated`, 'success');
        setProviderToDelete(null);
        fetchProviders();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to deactivate provider agency', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Software Provider Agencies</h1>
            <AdminBadge variant="primary">{totalElements} Registered</AdminBadge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage external software houses, developers, wholesale pricing contracts, and API integration states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={fetchProviders}
            icon={RefreshCw}
            disabled={isLoading}
          >
            Refresh
          </AdminButton>
          <AdminButton
            variant="primary"
            size="sm"
            onClick={handleOpenAddModal}
            icon={Plus}
          >
            Register Provider Agency
          </AdminButton>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <AdminInput
            placeholder="Search provider agency or company..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </div>

      {/* Main Table Content */}
      <AdminCard contentClassName="p-0">
        {isLoading ? (
          <AdminTableSkeleton cols={6} rows={6} />
        ) : errorMsg ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-900 mb-1">Failed to Load Software Providers</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">{errorMsg}</p>
            <AdminButton variant="outline" size="sm" onClick={fetchProviders}>
              Try Again
            </AdminButton>
          </div>
        ) : providers.length === 0 ? (
          <AdminEmptyState
            title="No Software Providers Found"
            description={
              searchQuery
                ? 'No providers matched your search criteria.'
                : 'No external software agencies or wholesale providers registered yet.'
            }
            action={
              <AdminButton variant="primary" size="sm" onClick={handleOpenAddModal}>
                Register First Agency
              </AdminButton>
            }
            icon={Building2}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Provider / Agency</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Commercial Terms</th>
                  <th className="py-3.5 px-4">Technical Integration</th>
                  <th className="py-3.5 px-4">Contract Status</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      {p.companyName && (
                        <div className="text-[11px] text-slate-500">{p.companyName}</div>
                      )}
                      {p.website && (
                        <a 
                          href={p.website.startsWith('http') ? p.website : `https://${p.website}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1 text-[11px] text-sky-600 hover:underline mt-0.5"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>Website</span>
                        </a>
                      )}
                    </td>

                    <td className="py-3.5 px-4 space-y-1">
                      {p.contactPerson && (
                        <div className="font-semibold text-slate-800">{p.contactPerson}</div>
                      )}
                      {p.contactEmail && (
                        <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{p.contactEmail}</span>
                        </div>
                      )}
                      {p.contactPhone && (
                        <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{p.contactPhone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 line-clamp-2 max-w-xs">{p.commercialTerms || 'Standard Terms'}</div>
                      {p.commissionRate && (
                        <div className="text-[11px] font-mono text-emerald-600 font-bold mt-0.5">
                          Markup/Margin: {p.commissionRate}%
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <AdminBadge variant={p.technicalIntegrationType === 'API' ? 'brand' : 'neutral'}>
                          {p.technicalIntegrationType || 'MANUAL'}
                        </AdminBadge>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 max-w-[200px] truncate" title={p.integrationStatus}>
                        {p.integrationStatus || 'Integration pending provider/API information'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <AdminBadge 
                        variant={p.contractStatus === 'ACTIVE' ? 'success' : p.contractStatus === 'PENDING' ? 'warning' : 'neutral'}
                      >
                        {p.contractStatus || 'ACTIVE'}
                      </AdminBadge>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900"
                      >
                        {p.active ? (
                          <ToggleRight className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-slate-300" />
                        )}
                        <span className="text-[11px] font-medium">{p.active ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                          title="Edit Provider"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProviderToDelete(p)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                          title="Deactivate Provider"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {/* Register/Edit Provider Agency Modal */}
      {isModalOpen && editingProvider && (
        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProvider.id ? 'Edit Provider Agency' : 'Register New Software Provider Agency'}
          subtitle="Internal agency record for wholesale pricing, commercial terms, and technical integration."
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveProvider} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Agency / Provider Name *</label>
                <AdminInput
                  value={editingProvider.name || ''}
                  onChange={(e) => setEditingProvider({ ...editingProvider, name: e.target.value })}
                  placeholder="e.g. Apex Software Labs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Legal Entity</label>
                <AdminInput
                  value={editingProvider.companyName || ''}
                  onChange={(e) => setEditingProvider({ ...editingProvider, companyName: e.target.value })}
                  placeholder="e.g. Apex Software Labs Pvt Ltd"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person</label>
                <AdminInput
                  value={editingProvider.contactPerson || ''}
                  onChange={(e) => setEditingProvider({ ...editingProvider, contactPerson: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                <AdminInput
                  type="email"
                  value={editingProvider.contactEmail || ''}
                  onChange={(e) => setEditingProvider({ ...editingProvider, contactEmail: e.target.value })}
                  placeholder="partner@agency.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <AdminInput
                  value={editingProvider.contactPhone || ''}
                  onChange={(e) => setEditingProvider({ ...editingProvider, contactPhone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Agency Website</label>
                <AdminInput
                  value={editingProvider.website || ''}
                  onChange={(e) => setEditingProvider({ ...editingProvider, website: e.target.value })}
                  placeholder="https://agency.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Integration</label>
                <AdminSelect
                  value={editingProvider.technicalIntegrationType || 'MANUAL'}
                  onChange={(e) => setEditingProvider({ ...editingProvider, technicalIntegrationType: e.target.value })}
                  options={[
                    { value: 'MANUAL', label: 'Manual Provisioning' },
                    { value: 'API', label: 'REST API' },
                    { value: 'WEBHOOK', label: 'Webhook Automated' },
                    { value: 'NONE', label: 'None (Offline)' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Support SLA</label>
                <AdminSelect
                  value={editingProvider.supportResponsibility || 'OHO_TECH'}
                  onChange={(e) => setEditingProvider({ ...editingProvider, supportResponsibility: e.target.value })}
                  options={[
                    { value: 'OHO_TECH', label: 'OHO TECH (Level 1-3)' },
                    { value: 'PROVIDER', label: 'Provider Agency' },
                    { value: 'SHARED', label: 'Shared SLA' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contract Status</label>
                <AdminSelect
                  value={editingProvider.contractStatus || 'ACTIVE'}
                  onChange={(e) => setEditingProvider({ ...editingProvider, contractStatus: e.target.value })}
                  options={[
                    { value: 'ACTIVE', label: 'Active Agreement' },
                    { value: 'PENDING', label: 'Pending Review' },
                    { value: 'EXPIRED', label: 'Expired' },
                    { value: 'TERMINATED', label: 'Terminated' },
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Integration Status Label</label>
              <AdminInput
                value={editingProvider.integrationStatus || 'Integration pending provider/API information'}
                onChange={(e) => setEditingProvider({ ...editingProvider, integrationStatus: e.target.value })}
                placeholder="Integration pending provider/API information"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                If live APIs or provider docs are unverified, leave as "Integration pending provider/API information".
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Commercial Wholesale Terms</label>
              <textarea
                value={editingProvider.commercialTerms || ''}
                onChange={(e) => setEditingProvider({ ...editingProvider, commercialTerms: e.target.value })}
                rows={2}
                placeholder="e.g. 70% Wholesale cost to agency, 30% OHO TECH margin retained."
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <AdminButton
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </AdminButton>
              <AdminButton
                type="submit"
                variant="primary"
                isLoading={isSaving}
              >
                {editingProvider.id ? 'Save Changes' : 'Register Agency'}
              </AdminButton>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Deactivate Confirmation Dialog */}
      {providerToDelete && (
        <AdminConfirmDialog
          isOpen={!!providerToDelete}
          title="Deactivate Provider Agency"
          description={`Are you sure you want to deactivate "${providerToDelete.name}"? Products tied to this provider will not be deleted, but wholesale ordering will be flagged.`}
          confirmLabel="Deactivate Agency"
          variant="danger"
          isLoading={isDeleting}
          onConfirm={handleDeleteProvider}
          onClose={() => setProviderToDelete(null)}
        />
      )}
    </div>
  );
}

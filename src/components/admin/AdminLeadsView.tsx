'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Kanban,
  Search,
  RefreshCw,
  Plus,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  Filter,
  CheckCircle2,
  ExternalLink,
  User,
  Clock,
  AlertCircle
} from 'lucide-react';
import { getAdminLeadsApi, createAdminLeadApi, updateAdminLeadStatusApi } from '@/api/crm';
import { LeadDto, LeadStatus, LeadPriority, LeadSource } from '@/api/types';
import { useToast } from '@/context/ToastContext';
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

const PRIORITY_BADGE_VARIANTS: Record<string, 'neutral' | 'primary' | 'warning' | 'error' | 'success'> = {
  LOW: 'neutral',
  MEDIUM: 'primary',
  HIGH: 'warning',
  URGENT: 'error',
};

export function AdminLeadsView() {
  const { showToast } = useToast();

  const [leads, setLeads] = React.useState<LeadDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Filters
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [priorityFilter, setPriorityFilter] = React.useState('ALL');
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalElements, setTotalElements] = React.useState(0);

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    companyName: '',
    source: 'WEBSITE' as LeadSource,
    priority: 'MEDIUM' as LeadPriority,
    estimatedValue: '',
    notes: '',
  });

  const fetchLeads = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminLeadsApi({
        search: search.trim() || undefined,
        status: statusFilter !== 'ALL' ? (statusFilter as LeadStatus) : undefined,
        priority: priorityFilter !== 'ALL' ? (priorityFilter as LeadPriority) : undefined,
        page,
        size: 15,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      if (res.success && res.data) {
        setLeads(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      } else {
        setError(res.message || 'Failed to load CRM leads');
      }
    } catch (err: any) {
      setError(err?.message || 'Error fetching leads');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, page]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const handleStatusChange = async (leadId: number, newStatus: LeadStatus) => {
    try {
      const res = await updateAdminLeadStatusApi(leadId, newStatus);
      if (res.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        showToast(`Lead #${leadId} status updated to ${newStatus}`, 'success');
      } else {
        showToast(res.message || 'Failed to update lead status', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Network error updating status', 'error');
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactName || !formData.contactEmail) {
      showToast('Contact name and email are required', 'error');
      return;
    }

    const nameParts = formData.contactName.trim().split(' ');
    const firstName = nameParts[0] || 'Client';
    const lastName = nameParts.slice(1).join(' ') || undefined;

    setCreating(true);
    try {
      const res = await createAdminLeadApi({
        firstName,
        lastName,
        email: formData.contactEmail,
        phone: formData.contactPhone || undefined,
        companyName: formData.companyName || undefined,
        interestedProduct: formData.title || undefined,
        source: formData.source,
        priority: formData.priority,
        estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : undefined,
        notes: formData.notes || undefined,
      });

      if (res.success) {
        showToast('New CRM lead created successfully!', 'success');
        setIsCreateOpen(false);
        setFormData({
          title: '',
          contactName: '',
          contactEmail: '',
          contactPhone: '',
          companyName: '',
          source: 'WEBSITE',
          priority: 'MEDIUM',
          estimatedValue: '',
          notes: '',
        });
        fetchLeads();
      } else {
        showToast(res.message || 'Failed to create lead', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error saving lead', 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">CRM Leads &amp; Sales Pipeline</h1>
            <AdminBadge variant="outline">{totalElements} Inquiries</AdminBadge>
          </div>
          <p className="text-sm text-slate-500">
            Real enterprise inquiries, contact requests, sales pipeline statuses, and client deal values.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => fetchLeads()}
            disabled={loading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </AdminButton>
          <AdminButton
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Lead
          </AdminButton>
        </div>
      </div>

      {/* Filter Bar */}
      <AdminCard className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <AdminInput
              placeholder="Search leads, names, companies..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-44">
              <AdminSelect
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'NEW', label: 'New Lead' },
                  { value: 'CONTACTED', label: 'Contacted' },
                  { value: 'QUALIFIED', label: 'Qualified' },
                  { value: 'DEMO_SCHEDULED', label: 'Demo Scheduled' },
                  { value: 'QUOTE_SENT', label: 'Quote Sent' },
                  { value: 'NEGOTIATION', label: 'Negotiation' },
                  { value: 'WON', label: 'Won Deal' },
                  { value: 'LOST', label: 'Lost Lead' },
                ]}
              />
            </div>

            <div className="w-full sm:w-40">
              <AdminSelect
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setPage(0);
                }}
                options={[
                  { value: 'ALL', label: 'All Priorities' },
                  { value: 'LOW', label: 'Low Priority' },
                  { value: 'MEDIUM', label: 'Medium Priority' },
                  { value: 'HIGH', label: 'High Priority' },
                  { value: 'URGENT', label: 'Urgent Priority' },
                ]}
              />
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Table / Error / Loading */}
      <AdminCard className="overflow-hidden">
        {loading ? (
          <div className="p-6">
            <AdminTableSkeleton rows={6} cols={7} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-500" />
            <p className="font-semibold text-sm">{error}</p>
            <AdminButton variant="secondary" size="sm" onClick={() => fetchLeads()} className="mt-3">
              Retry Connection
            </AdminButton>
          </div>
        ) : leads.length === 0 ? (
          <AdminEmptyState
            title="No leads found"
            description={
              search || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                ? 'Try resetting the filters.'
                : 'Customer inquiries and manual leads will show up here.'
            }
            icon={<Kanban className="w-6 h-6 text-slate-400" />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Lead / Subject</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4 text-right">Est. Value</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l) => {
                  const leadName = [l.firstName, l.lastName].filter(Boolean).join(' ') || 'Prospective Client';
                  return (
                    <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{l.interestedProduct || l.companyName || 'Inquiry #' + l.id}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{l.companyName || 'Individual Client'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div className="space-y-0.5">
                          <div className="font-medium text-slate-900">{leadName}</div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{l.email}</span>
                          </div>
                          {l.phone && (
                            <div className="flex items-center gap-1 text-slate-500 font-mono">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{l.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <AdminBadge variant="neutral">{l.source}</AdminBadge>
                      </td>
                      <td className="py-3 px-4">
                        <AdminBadge variant={PRIORITY_BADGE_VARIANTS[l.priority] || 'neutral'}>
                          {l.priority}
                        </AdminBadge>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 text-right">
                        {l.estimatedValue ? `₹${l.estimatedValue.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={l.status}
                          onChange={(e) => handleStatusChange(l.id, e.target.value as LeadStatus)}
                          className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="QUALIFIED">QUALIFIED</option>
                          <option value="DEMO_SCHEDULED">DEMO SCHEDULED</option>
                          <option value="DEMO_COMPLETED">DEMO COMPLETED</option>
                          <option value="QUOTE_SENT">QUOTE SENT</option>
                          <option value="NEGOTIATION">NEGOTIATION</option>
                          <option value="WON">WON</option>
                          <option value="LOST">LOST</option>
                          <option value="FOLLOW_UP">FOLLOW UP</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-slate-500 whitespace-nowrap">
                        {l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page <strong className="text-slate-900">{page + 1}</strong> of <strong className="text-slate-900">{totalPages}</strong> ({totalElements} total)
            </span>
            <div className="flex gap-2">
              <AdminButton
                variant="secondary"
                size="sm"
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </AdminButton>
              <AdminButton
                variant="secondary"
                size="sm"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      {/* Create Lead Modal */}
      {isCreateOpen && (
        <AdminModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Create New CRM Lead"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Lead / Deal Title</label>
              <AdminInput
                placeholder="e.g. Enterprise Hospital Management System"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contact Name *</label>
                <AdminInput
                  required
                  placeholder="Full name"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Organization</label>
                <AdminInput
                  placeholder="Organization name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contact Email *</label>
                <AdminInput
                  type="email"
                  required
                  placeholder="client@organization.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
                <AdminInput
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Source</label>
                <AdminSelect
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                  options={[
                    { value: 'WEBSITE', label: 'Website' },
                    { value: 'CONTACT_FORM', label: 'Contact Form' },
                    { value: 'QUOTE_REQUEST', label: 'Quote Request' },
                    { value: 'DEMO_REQUEST', label: 'Demo Request' },
                    { value: 'WHATSAPP', label: 'WhatsApp' },
                    { value: 'REFERRAL', label: 'Referral' },
                    { value: 'MANUAL', label: 'Manual' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                <AdminSelect
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as LeadPriority })}
                  options={[
                    { value: 'LOW', label: 'Low' },
                    { value: 'MEDIUM', label: 'Medium' },
                    { value: 'HIGH', label: 'High' },
                    { value: 'URGENT', label: 'Urgent' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Est. Value (₹)</label>
                <AdminInput
                  type="number"
                  placeholder="50000"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Requirements &amp; Notes</label>
              <textarea
                rows={3}
                placeholder="Key requirements, client scope, timeline..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
              />
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-200">
              <AdminButton
                type="button"
                variant="secondary"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                type="submit"
                variant="primary"
                disabled={creating}
                leftIcon={creating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : undefined}
              >
                {creating ? 'Saving...' : 'Create Lead'}
              </AdminButton>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}

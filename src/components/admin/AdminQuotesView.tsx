'use client';

import * as React from 'react';
import { MessageSquare, RefreshCw, AlertCircle, Mail, Phone } from 'lucide-react';
import { ContactEnquiry } from '@/api/types';
import { getAdminEnquiriesApi, updateAdminEnquiryStatusApi } from '@/api/admin';
import { useToast } from '@/context/ToastContext';
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  StatusBadge,
  AdminEmptyState,
  AdminTableSkeleton
} from './AdminUiPrimitives';

export function AdminQuotesView() {
  const { showToast } = useToast();
  const [enquiries, setEnquiries] = React.useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchEnquiries = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminEnquiriesApi();
      if (res.success && res.data) {
        setEnquiries(res.data);
      } else {
        setError(res.message || 'Unable to retrieve customer inquiries');
      }
    } catch (err: any) {
      setError(err?.message || 'Error connecting to inquiries service');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await updateAdminEnquiryStatusApi(id, newStatus);
      if (res.success && res.data) {
        showToast(`Inquiry lead status updated to ${newStatus}`, 'success');
        setEnquiries((prev) => prev.map((e) => (e.id === id ? res.data! : e)));
      } else {
        showToast(res.message || 'Failed to update quote status', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update quote status', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Commercial Quotes &amp; Enterprise Demo Requests</h1>
            <AdminBadge variant="primary">{enquiries.length} Submissions</AdminBadge>
          </div>
          <p className="text-sm text-slate-500">
            Live customer inquiries submitted through website contact forms and quote request flows.
          </p>
        </div>

        <AdminButton
          variant="secondary"
          size="sm"
          onClick={fetchEnquiries}
          disabled={loading}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
        >
          Refresh Inquiries
        </AdminButton>
      </div>

      {/* Content */}
      {loading ? (
        <AdminCard className="p-6">
          <AdminTableSkeleton rows={4} cols={4} />
        </AdminCard>
      ) : error ? (
        <AdminCard className="p-8 text-center text-rose-600">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-500" />
          <p className="font-semibold text-sm">{error}</p>
          <AdminButton variant="secondary" size="sm" onClick={fetchEnquiries} className="mt-3">
            Retry Connection
          </AdminButton>
        </AdminCard>
      ) : enquiries.length > 0 ? (
        <div className="space-y-3">
          {enquiries.map((enq) => (
            <AdminCard key={enq.id} className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{enq.name}</span>
                  <span className="text-xs text-slate-400">({enq.email})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                  </span>
                  <StatusBadge status={enq.status || 'PENDING'} />
                </div>
              </div>

              {enq.subject && (
                <p className="text-xs font-semibold text-slate-900">
                  Subject: {enq.subject}
                </p>
              )}

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {enq.message}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-2 text-xs text-slate-500">
                <span>Contact Phone: <strong className="text-slate-700">{enq.phone || 'Not provided'}</strong></span>
                <div className="flex items-center gap-2">
                  {enq.status !== 'CONTACTED' && (
                    <AdminButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus(enq.id, 'CONTACTED')}
                    >
                      Mark Contacted
                    </AdminButton>
                  )}
                  <a
                    href={`mailto:${enq.email}?subject=OHO TECH Commercial Inquiry Response`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      ) : (
        <AdminEmptyState
          title="No customer quote requests"
          description="Website contact submissions and enterprise inquiries will appear here in real-time."
          icon={<MessageSquare className="w-6 h-6 text-slate-400" />}
        />
      )}
    </div>
  );
}

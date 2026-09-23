'use client';

import * as React from 'react';
import { DownloadCloud, RefreshCw, AlertCircle, Package } from 'lucide-react';
import { SoftwareReleaseDto } from '@/api/types';
import { getAdminReleasesApi } from '@/api/releases';
import { useToast } from '@/context/ToastContext';
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  StatusBadge,
  AdminEmptyState,
  AdminTableSkeleton
} from './AdminUiPrimitives';

export function AdminReleasesView() {
  const { showToast } = useToast();
  const [releases, setReleases] = React.useState<SoftwareReleaseDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchReleases = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminReleasesApi(1);
      if (res.success && res.data) {
        setReleases(res.data);
      } else {
        setError(res.message || 'Unable to retrieve software releases');
      }
    } catch (err: any) {
      setError(err?.message || 'Error connecting to software release pipeline');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Software Releases &amp; Binary Packages</h1>
            <AdminBadge variant="primary">{releases.length} Builds</AdminBadge>
          </div>
          <p className="text-sm text-slate-500">
            MSI installers, macOS DMGs, Linux Docker containers, and mobile APK builds.
          </p>
        </div>

        <AdminButton
          variant="secondary"
          size="sm"
          onClick={fetchReleases}
          disabled={loading}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
        >
          Sync Releases
        </AdminButton>
      </div>

      {/* Table */}
      <AdminCard className="overflow-hidden">
        {loading ? (
          <div className="p-6">
            <AdminTableSkeleton rows={5} cols={5} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-500" />
            <p className="font-semibold text-sm">{error}</p>
            <AdminButton variant="secondary" size="sm" onClick={fetchReleases} className="mt-3">
              Retry Connection
            </AdminButton>
          </div>
        ) : releases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Target Platform</th>
                  <th className="py-3 px-4">Changelog &amp; Notes</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Published Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {releases.map((rel, idx) => (
                  <tr key={rel.id || idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-xs">
                      v{rel.version}
                    </td>
                    <td className="py-3 px-4">
                      <AdminBadge variant="neutral">{rel.platform}</AdminBadge>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 max-w-md truncate">
                      {rel.releaseNotes || 'Production build'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <AdminBadge variant="success">PUBLISHED</AdminBadge>
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-slate-500 whitespace-nowrap">
                      {rel.createdAt ? new Date(rel.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmptyState
            title="No binary packages published"
            description="Binary releases uploaded via the developer pipeline will be listed here."
            icon={<DownloadCloud className="w-6 h-6 text-slate-400" />}
          />
        )}
      </AdminCard>
    </div>
  );
}

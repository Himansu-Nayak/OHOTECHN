'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { AdminCrmView } from '@/components/admin/AdminCrmView';
import { DashboardShell } from '@/components/dashboard/V15DashboardPrimitives';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export default function AdminCrmPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        showToast('Please log in with Admin credentials.', 'info');
        router.push('/login');
      } else if (
        user.role !== 'ROLE_ADMIN' &&
        user.role !== 'ADMIN' &&
        user.role !== 'ROLE_DEVELOPER' &&
        user.role !== 'DEVELOPER'
      ) {
        showToast('Access restricted: Customer account detected.', 'error');
        router.push('/products');
      }
    }
  }, [user, isLoading, router, showToast]);

  const isAdmin = user && (
    user.role === 'ROLE_ADMIN' ||
    user.role === 'ADMIN' ||
    user.role === 'ROLE_DEVELOPER' ||
    user.role === 'DEVELOPER'
  );

  if (isLoading || !isAdmin) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4 font-mono flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-[32px] p-8 text-center shadow-sm">
          <Lock className="w-10 h-10 text-rose-600 mx-auto mb-3" />
          <h1 className="text-xl font-black text-slate-900 mb-2">Access Restricted</h1>
          <p className="text-xs text-slate-500 mb-6">Administrator credentials required to access CRM Sales Governance.</p>
          <Link href="/login" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#0d0d0e] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto">
        <div className="mb-4">
          <Link href="/admin?tab=crm" className="text-xs font-mono font-bold text-sky-600 hover:underline">
            ← Switch to Admin Console View
          </Link>
        </div>
        <AdminCrmView initialViewMode="pipeline" isStandalonePage={true} />
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Repeat, Clock, XCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMySubscriptionsApi, cancelSubscriptionApi } from '@/api/subscriptions';
import { Subscription } from '@/api/types';

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [cancellingId, setCancellingId] = React.useState<number | null>(null);

  const fetchSubscriptions = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await getMySubscriptionsApi();
      if (res.success && res.data) {
        setSubscriptions(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load subscriptions', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  React.useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    setCancellingId(id);
    try {
      const res = await cancelSubscriptionApi(id);
      if (res.success) {
        showToast('Subscription cancelled successfully', 'success');
        fetchSubscriptions();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel subscription', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Repeat className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Sign In Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please sign in to view your subscriptions.</p>
          <Link href="/login" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-5xl w-full mx-auto" id="subscriptions-main">
        
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            RECURRING PRODUCT PLANS
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
            My Subscriptions &amp; Recurring Plans
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Track active trial periods, billing cycles, auto-renew status, and cancellation management.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((idx) => (
              <div key={idx} className="bg-white border-2 border-slate-200 rounded-[32px] p-6 animate-pulse space-y-3">
                <div className="h-6 bg-slate-100 rounded-lg w-1/3" />
                <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
              </div>
            ))}
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-6 shadow-sm">
            <Repeat className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">No Active Subscriptions</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              You do not have any active product subscriptions or trial plans. Browse our products to get started.
            </p>
            <Link href="/products" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-block">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#0d0d0e]">
                      {sub.product?.name || 'Software Product'}
                    </h3>
                    <div className="text-xs font-mono text-slate-500 mt-1">
                      Plan: {sub.productPlan?.name || 'Standard Subscription'} ({sub.productPlan?.billingType || 'RECURRING'})
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                      sub.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      sub.status === 'TRIAL' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                      'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {sub.status}
                    </span>

                    {(sub.status === 'ACTIVE' || sub.status === 'TRIAL') && (
                      <button
                        onClick={() => handleCancel(sub.id)}
                        disabled={cancellingId === sub.id}
                        className="py-2 px-4 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-mono font-bold text-xs border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        {cancellingId === sub.id ? 'Cancelling...' : 'Cancel Subscription'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-600">
                  <div>
                    <span className="font-bold text-slate-400 uppercase block text-[10px]">Start Date</span>
                    {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase block text-[10px]">Expiration Date</span>
                    {sub.expiryDate ? new Date(sub.expiryDate).toLocaleDateString() : 'No Expiry (Lifetime)'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase block text-[10px]">Auto Renew</span>
                    {sub.autoRenew ? 'Enabled (Automatic)' : 'Disabled'}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

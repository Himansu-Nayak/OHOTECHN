'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, Key, Repeat, Download, ArrowRight, ShieldCheck, Clock, CreditCard, Sparkles, CheckCircle2, Headphones } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getMyEntitledProductsApi } from '@/api/releases';
import { getMyLicensesApi } from '@/api/licenses';
import { getMySubscriptionsApi } from '@/api/subscriptions';
import { getMyOrdersApi } from '@/api/orders';
import { ProductDto, License, Subscription, Order } from '@/api/types';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [products, setProducts] = React.useState<ProductDto[]>([]);
  const [licenses, setLicenses] = React.useState<License[]>([]);
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!user) return;
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [prodRes, licRes, subRes, ordRes] = await Promise.all([
          getMyEntitledProductsApi().catch(() => ({ success: false, data: [] })),
          getMyLicensesApi().catch(() => ({ success: false, data: [] })),
          getMySubscriptionsApi().catch(() => ({ success: false, data: [] })),
          getMyOrdersApi().catch(() => ({ success: false, data: [] })),
        ]);

        if (prodRes.success && prodRes.data) setProducts(prodRes.data);
        if (licRes.success && licRes.data) setLicenses(licRes.data);
        if (subRes.success && subRes.data) setSubscriptions(subRes.data);
        if (ordRes.success && ordRes.data) setOrders(ordRes.data);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Package className="w-12 h-12 text-sky-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Sign In Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please sign in to access your platform dashboard.</p>
          <Link href="/login" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const activeLicensesCount = licenses.filter(l => l.status === 'ACTIVE').length;
  const activeSubsCount = subscriptions.filter(s => s.status === 'ACTIVE' || s.status === 'TRIAL').length;

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-6xl w-full mx-auto" id="customer-dashboard-main">
        
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              CUSTOMER PLATFORM DASHBOARD
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Manage your software entitlements, active license keys, subscription status, and downloads.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/my-products" className="px-4 py-2.5 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors">
              My Products
            </Link>
            <Link href="/downloads" className="px-4 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Downloads
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border-2 border-slate-300 rounded-[28px] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Owned Products</span>
              <Package className="w-5 h-5 text-sky-600" />
            </div>
            <div className="text-3xl font-black text-[#0d0d0e]">{loading ? '...' : products.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Software modules in catalog</p>
          </div>

          <div className="bg-white border-2 border-slate-300 rounded-[28px] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Active Licenses</span>
              <Key className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-[#0d0d0e]">{loading ? '...' : activeLicensesCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Valid activation keys</p>
          </div>

          <div className="bg-white border-2 border-slate-300 rounded-[28px] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Subscriptions</span>
              <Repeat className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-[#0d0d0e]">{loading ? '...' : activeSubsCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Active recurring plans</p>
          </div>

          <div className="bg-white border-2 border-slate-300 rounded-[28px] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
              <CreditCard className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-[#0d0d0e]">{loading ? '...' : orders.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Purchases processed</p>
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/licenses" className="bg-white border-2 border-slate-300 hover:border-emerald-500 rounded-[28px] p-6 shadow-xs transition-all block group">
            <div className="flex items-center justify-between mb-4">
              <Key className="w-6 h-6 text-emerald-600" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-black text-[#0d0d0e] mb-1">License Keys</h3>
            <p className="text-xs text-slate-600">View cryptographic keys, manage registered devices, and inspect activation limits.</p>
          </Link>

          <Link href="/subscriptions" className="bg-white border-2 border-slate-300 hover:border-purple-500 rounded-[28px] p-6 shadow-xs transition-all block group">
            <div className="flex items-center justify-between mb-4">
              <Repeat className="w-6 h-6 text-purple-600" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-black text-[#0d0d0e] mb-1">Subscriptions</h3>
            <p className="text-xs text-slate-600">Track trial periods, monthly/yearly expiry dates, and manage auto-renew options.</p>
          </Link>

          <Link href="/downloads" className="bg-white border-2 border-slate-300 hover:border-sky-500 rounded-[28px] p-6 shadow-xs transition-all block group">
            <div className="flex items-center justify-between mb-4">
              <Download className="w-6 h-6 text-sky-600" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-black text-[#0d0d0e] mb-1">Downloads</h3>
            <p className="text-xs text-slate-600">Download authorized software builds for Windows, macOS, Linux, and Android.</p>
          </Link>

          <Link href="/support" className="bg-white border-2 border-slate-300 hover:border-amber-500 rounded-[28px] p-6 shadow-xs transition-all block group">
            <div className="flex items-center justify-between mb-4">
              <Headphones className="w-6 h-6 text-amber-600" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg font-black text-[#0d0d0e] mb-1">Help Desk &amp; Queries</h3>
            <p className="text-xs text-slate-600">Submit support tickets, communicate with engineering desk, and track SLAs.</p>
          </Link>
        </div>

        {/* Recent Purchases Section */}
        <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-[#0d0d0e]">Recent Orders &amp; Entitlements</h2>
              <p className="text-xs text-slate-500 font-medium">Verified purchases automatically issue licenses and subscriptions.</p>
            </div>
            <Link href="/orders" className="text-xs font-mono font-bold text-sky-600 hover:underline">View All Orders →</Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-medium">
              No orders placed yet. Browse the catalog to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-[#0d0d0e]">Order #{order.id} — ₹{order.totalAmount}</div>
                    <div className="text-[11px] font-mono text-slate-500">Status: {order.status}</div>
                  </div>
                  <Link href="/orders" className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white font-mono font-bold text-[11px] hover:bg-sky-600 transition-colors self-start sm:self-auto">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

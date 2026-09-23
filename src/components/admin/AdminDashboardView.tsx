'use client';

import * as React from 'react';
import { 
  ShoppingCart, DollarSign, Users, Package, KeyRound, Layers, 
  ArrowRight, RefreshCw, CheckCircle2, ShieldCheck, Clock,
  ExternalLink, Server, Database, Sparkles, Inbox
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminTabKey } from './AdminSidebar';
import { AnalyticsDashboardDto, Order } from '@/api/types';
import { getAdminOrdersApi } from '@/api/orders';
import { AdminCard, AdminBadge, StatusBadge, AdminButton, AdminEmptyState } from './AdminUiPrimitives';

interface AdminDashboardViewProps {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalQuotes: number;
    totalRevenue: number;
    systemStatus: string;
  };
  analyticsData?: AnalyticsDashboardDto | null;
  onNavigateTab: (tab: AdminTabKey) => void;
  onRefresh?: () => void;
}

export function AdminDashboardView({
  stats,
  analyticsData,
  onNavigateTab,
  onRefresh,
}: AdminDashboardViewProps) {
  const [recentOrders, setRecentOrders] = React.useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = React.useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = React.useState<string>(new Date().toLocaleTimeString('en-IN'));

  const fetchOrders = React.useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      const res = await getAdminOrdersApi();
      if (res.success && res.data) {
        setRecentOrders(res.data.slice(0, 6));
      }
    } catch (err) {
      console.warn('Recent orders fetch note:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRefreshAll = () => {
    fetchOrders();
    if (onRefresh) onRefresh();
    setLastRefreshed(new Date().toLocaleTimeString('en-IN'));
  };

  // Safe KPI calculations strictly from backend
  const grossRevenue = analyticsData?.revenueMetrics?.totalRevenue != null 
    ? Number(analyticsData.revenueMetrics.totalRevenue) 
    : (stats.totalRevenue || 0);

  const formattedRevenue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(grossRevenue);

  const totalOrders = stats.totalOrders || analyticsData?.orderMetrics?.totalOrders || 0;
  const totalCustomers = stats.totalUsers || analyticsData?.userMetrics?.totalCustomers || 0;
  const activeSubs = analyticsData?.subscriptionMetrics?.activeSubscriptions ?? 0;
  const activeLicenses = analyticsData?.licenseMetrics?.activeLicenses ?? 0;
  const activeEntitlements = activeSubs + activeLicenses;

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Operational Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time business status, order telemetry, and system authority.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Updated {lastRefreshed}
          </span>
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={handleRefreshAll}
            icon={RefreshCw}
          >
            Sync Data
          </AdminButton>
        </div>
      </div>

      {/* 2. Four Focused Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Gross Platform Revenue</span>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {formattedRevenue}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Verified payment transactions in PostgreSQL
            </p>
          </div>
        </div>

        {/* Orders Placed */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Orders Processed</span>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {totalOrders}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Total commerce orders recorded
            </p>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Registered Clients</span>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {totalCustomers}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Active user accounts in directory
            </p>
          </div>
        </div>

        {/* Active Entitlements */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Entitlements</span>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              {activeEntitlements}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              {activeSubs} subscriptions &bull; {activeLicenses} license keys
            </p>
          </div>
        </div>
      </div>

      {/* 3. Operational Sections: Recent Orders & System Authority */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2">
          <AdminCard
            title="Recent Customer Orders"
            subtitle="Most recent transactions needing processing or delivery"
            actions={
              <AdminButton
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab('orders')}
                icon={ArrowRight}
              >
                View All
              </AdminButton>
            }
          >
            {isLoadingOrders ? (
              <div className="py-12 text-center text-xs text-slate-500">
                Loading recent orders...
              </div>
            ) : recentOrders.length === 0 ? (
              <AdminEmptyState
                title="No orders placed yet"
                description="When customers checkout and purchase software licenses, orders will appear here."
                icon={ShoppingCart}
              />
            ) : (
              <div className="overflow-x-auto -mx-5 -my-5">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-[11px] font-semibold">
                      <th className="px-5 py-3">Order ID</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentOrders.map((order) => {
                      const amountFormatted = new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                      }).format(Number(order.totalAmount || 0));

                      return (
                        <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3.5 font-mono font-medium text-slate-900">
                            #{order.id}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-medium text-slate-800 block truncate max-w-[150px]">
                              {order.user?.name || 'Customer'}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                              {order.user?.email}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-slate-900">
                            {amountFormatted}
                          </td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : '—'}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => onNavigateTab('orders')}
                              className="text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </AdminCard>
        </div>

        {/* Right 1 Col: Platform Authority & Direct Shortcuts */}
        <div className="space-y-6">
          {/* Quick Administrative Actions */}
          <AdminCard title="Quick Management" subtitle="Frequent administrative operations">
            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('products')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Catalog Inventory</span>
                    <span className="text-[11px] text-slate-500">28 Turnkey Solutions</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => onNavigateTab('leads')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Inquiries &amp; Quotes</span>
                    <span className="text-[11px] text-slate-500">{stats.totalQuotes} Leads Recorded</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => onNavigateTab('customer-360')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Customer 360</span>
                    <span className="text-[11px] text-slate-500">Comprehensive CRM View</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </AdminCard>

          {/* System Authority Status */}
          <AdminCard title="Integration Services" subtitle="Production platform components">
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Database Engine</span>
                <AdminBadge variant="success">PostgreSQL 17 ACID</AdminBadge>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Payment Gateway</span>
                <AdminBadge variant="info">Razorpay India</AdminBadge>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">AI Intelligence</span>
                <AdminBadge variant="brand">Google Gemini API</AdminBadge>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-600">Backend Runtime</span>
                <span className="font-mono text-[11px] text-slate-700">Spring Boot 4.1.0</span>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}

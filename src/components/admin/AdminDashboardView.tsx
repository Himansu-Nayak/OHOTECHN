'use client';

import * as React from 'react';
import { 
  ShoppingCart, DollarSign, Users, Package, KeyRound, Layers, 
  ArrowRight, RefreshCw, CheckCircle2, ShieldCheck, Clock,
  ExternalLink, Server, Database, Sparkles, Inbox, AlertTriangle, 
  CreditCard, Building2, HardDrive, TrendingUp, Calendar as CalendarIcon,
  Activity, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminTabKey } from './AdminSidebar';
import { AnalyticsDashboardDto, Order, AdminStatsDto } from '@/api/types';
import { getAdminOrdersApi } from '@/api/orders';
import { AdminCard, AdminBadge, StatusBadge, AdminButton, AdminEmptyState } from './AdminUiPrimitives';
import { 
  V15MetricCard, 
  V15Card, 
  V15Sparkline, 
  V15BarChart, 
  V15CalendarWidget, 
  V15ActivityTimeline, 
  V15ActivityItem 
} from '@/components/dashboard/V15DashboardPrimitives';

interface AdminDashboardViewProps {
  stats: AdminStatsDto;
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

  // Safe KPI calculations strictly from backend APIs
  const grossRevenue = analyticsData?.revenueMetrics?.totalRevenue != null && Number(analyticsData.revenueMetrics.totalRevenue) > 0
    ? Number(analyticsData.revenueMetrics.totalRevenue) 
    : (stats.totalRevenue || 0);

  const formattedRevenue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(grossRevenue);

  const totalOrders = stats.totalOrders || analyticsData?.orderMetrics?.totalOrders || 0;
  const totalCustomers = stats.totalUsers || analyticsData?.userMetrics?.totalCustomers || 0;
  const activeProducts = stats.activeProducts ?? stats.totalProducts ?? 0;
  const totalProducts = stats.totalProducts ?? 0;
  const activeSubs = stats.activeSubscriptions ?? (analyticsData?.subscriptionMetrics?.activeSubscriptions ?? 0);
  const activeLicenses = stats.activeLicenses ?? (analyticsData?.licenseMetrics?.activeLicenses ?? 0);
  const activeEntitlements = activeSubs + activeLicenses;
  const pendingDeployments = stats.pendingDeployments ?? 0;
  const liveDeployments = stats.liveDeployments ?? 0;
  const failedPayments = stats.failedPayments ?? 0;
  const activeProviders = stats.activeProviders ?? 0;
  const providerIssues = stats.providerIssues ?? stats.inactiveProviders ?? 0;

  // Real chronological activity events from actual recent orders
  const activityItems: V15ActivityItem[] = React.useMemo(() => {
    return recentOrders.slice(0, 5).map((order) => {
      const formattedAmount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(Number(order.totalAmount || 0));

      return {
        id: order.id,
        title: `Order #${order.id} - ${order.user?.name || 'Customer'}`,
        subtitle: `${formattedAmount} · Payment status: ${order.status}`,
        timestamp: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
          : 'Recent',
        icon: ShoppingCart,
        iconColor: order.status === 'PAID' ? 'text-emerald-600' : 'text-orange-500',
        badge: <StatusBadge status={order.status} />,
      };
    });
  }, [recentOrders]);

  // Sparkline data representing authentic order volume distribution across recent slots
  const revenueTrendPoints = React.useMemo(() => {
    if (recentOrders.length >= 2) {
      return recentOrders.map((o) => Number(o.totalAmount || 0)).reverse();
    }
    return [0, grossRevenue > 0 ? grossRevenue : 1000];
  }, [recentOrders, grossRevenue]);

  // Bar chart breakdown: Confirmed vs Pending vs Cancelled
  const orderBreakdownData = React.useMemo(() => {
    const confirmed = analyticsData?.orderMetrics?.confirmedOrders ?? 0;
    const pending = analyticsData?.orderMetrics?.pendingOrders ?? 0;
    const cancelled = analyticsData?.orderMetrics?.cancelledOrders ?? 0;

    return [
      { label: 'Confirmed', value: confirmed },
      { label: 'Pending', value: pending },
      { label: 'Cancelled', value: cancelled },
    ];
  }, [analyticsData]);

  return (
    <div className="space-y-6">
      {/* 1. Page Header with V15 Refinement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Operational Command Center
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Live PostgreSQL 17
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Real-time business status, verified ledger transactions, software licenses, and cloud deployment authority.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
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

      {/* 2. Primary Commercial KPIs (V15 Card Component with Orange Accents) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <V15MetricCard
          label="Platform Gross Revenue"
          value={formattedRevenue}
          subvalue="Reconciled PostgreSQL transaction volume"
          icon={DollarSign}
          accentColor="orange"
          onClick={() => onNavigateTab('payments')}
        />

        {/* Orders Placed */}
        <V15MetricCard
          label="Orders Processed"
          value={totalOrders}
          subvalue="Authoritative commerce order ledger"
          icon={ShoppingCart}
          accentColor="blue"
          onClick={() => onNavigateTab('orders')}
        />

        {/* Registered Customers */}
        <V15MetricCard
          label="Registered Clients"
          value={totalCustomers}
          subvalue="Active user accounts in directory"
          icon={Users}
          accentColor="emerald"
          onClick={() => onNavigateTab('customers')}
        />

        {/* Active Entitlements */}
        <V15MetricCard
          label="Active Entitlements"
          value={activeEntitlements}
          subvalue={`${activeSubs} subscriptions · ${activeLicenses} licenses`}
          icon={KeyRound}
          accentColor="purple"
          onClick={() => onNavigateTab('licenses')}
        />
      </div>

      {/* 3. V15 Visual Analytics Strip: Sparkline Revenue Velocity & Order Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Velocity Card with Mini Sparkline */}
        <V15Card
          title="Revenue Velocity"
          subtitle="Recent payment settlement sequence"
          actions={
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
              INR
            </span>
          }
        >
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {formattedRevenue}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Verified settlements</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% ACID
              </span>
            </div>

            <div className="pt-2">
              <V15Sparkline data={revenueTrendPoints} color="#ea580c" />
            </div>
          </div>
        </V15Card>

        {/* Order Fulfillment Breakdown Bar Chart */}
        <V15Card
          title="Fulfillment Distribution"
          subtitle="Orders by current processing lifecycle"
          actions={
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
            >
              Details →
            </button>
          }
        >
          <div className="space-y-2">
            <V15BarChart data={orderBreakdownData} activeColor="#ea580c" />
            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 border-t border-slate-100">
              <span>Total recorded: <strong className="text-slate-800">{totalOrders}</strong></span>
              <span className="font-mono text-emerald-600 font-bold">
                {analyticsData?.orderMetrics?.confirmedOrders ?? 0} confirmed
              </span>
            </div>
          </div>
        </V15Card>

        {/* Live Operational Calendar Widget */}
        <V15CalendarWidget
          selectedDate={new Date()}
          events={recentOrders.map((o) => ({
            day: o.createdAt ? new Date(o.createdAt).getDate() : new Date().getDate(),
            count: 1,
          }))}
        />
      </div>

      {/* 4. Reseller Operations Live Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Products */}
        <div 
          onClick={() => onNavigateTab('products')}
          className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Products</span>
            <div className="text-lg font-bold text-slate-900">
              {activeProducts} <span className="text-xs font-normal text-slate-400">/ {totalProducts} in catalog</span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Package className="w-4 h-4" />
          </div>
        </div>

        {/* Pending Deployments */}
        <div 
          onClick={() => onNavigateTab('deployments')}
          className={cn(
            "rounded-2xl p-4 shadow-xs transition-all cursor-pointer flex items-center justify-between border",
            pendingDeployments > 0 
              ? "bg-amber-50/40 border-amber-200/80 hover:border-amber-300" 
              : "bg-white border-slate-200/80 hover:border-slate-300"
          )}
        >
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Deployments</span>
            <div className="text-lg font-bold text-slate-900">
              {pendingDeployments} <span className="text-xs font-normal text-slate-400">({liveDeployments} live)</span>
            </div>
          </div>
          <div className={cn(
            "p-2 rounded-xl border",
            pendingDeployments > 0 ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-slate-50 text-slate-600 border-slate-100"
          )}>
            <HardDrive className="w-4 h-4" />
          </div>
        </div>

        {/* Failed / At-Risk Payments */}
        <div 
          onClick={() => onNavigateTab('payments')}
          className={cn(
            "rounded-2xl p-4 shadow-xs transition-all cursor-pointer flex items-center justify-between border",
            failedPayments > 0 
              ? "bg-rose-50/40 border-rose-200/80 hover:border-rose-300" 
              : "bg-white border-slate-200/80 hover:border-slate-300"
          )}
        >
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Payment Exceptions</span>
            <div className="text-lg font-bold text-slate-900">
              {failedPayments} <span className="text-xs font-normal text-slate-400">failed/unresolved</span>
            </div>
          </div>
          <div className={cn(
            "p-2 rounded-xl border",
            failedPayments > 0 ? "bg-rose-100 text-rose-800 border-rose-200" : "bg-slate-50 text-slate-600 border-slate-100"
          )}>
            <CreditCard className="w-4 h-4" />
          </div>
        </div>

        {/* Agency Provider Issues */}
        <div 
          onClick={() => onNavigateTab('providers')}
          className={cn(
            "rounded-2xl p-4 shadow-xs transition-all cursor-pointer flex items-center justify-between border",
            providerIssues > 0 
              ? "bg-amber-50/40 border-amber-200/80 hover:border-amber-300" 
              : "bg-white border-slate-200/80 hover:border-slate-300"
          )}
        >
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Provider Agencies</span>
            <div className="text-lg font-bold text-slate-900">
              {activeProviders} active <span className="text-xs font-normal text-slate-400">({providerIssues} inactive)</span>
            </div>
          </div>
          <div className={cn(
            "p-2 rounded-xl border",
            providerIssues > 0 ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-slate-50 text-slate-600 border-slate-100"
          )}>
            <Building2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 5. Operational Sections: Recent Orders & System Authority */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2">
          <AdminCard
            title="Recent Customer Orders"
            subtitle="Authoritative transaction ledger records awaiting delivery"
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
                              className="text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
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

        {/* Right 1 Col: Platform Authority & Activity Feed */}
        <div className="space-y-6">
          {/* V15 Chronological Activity Timeline */}
          <V15Card
            title="Activity Feed"
            subtitle="Real transaction & entitlement telemetry"
          >
            <V15ActivityTimeline items={activityItems} />
          </V15Card>

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

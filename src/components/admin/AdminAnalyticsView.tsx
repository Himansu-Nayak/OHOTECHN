'use client';

import * as React from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Users, ShoppingCart, 
  Layers, KeyRound, Globe, RefreshCw, 
  Calendar, CheckCircle2, ArrowUpRight, CreditCard, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalyticsDashboardDto } from '@/api/types';
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminInput,
  AdminTableSkeleton,
  AdminEmptyState
} from './AdminUiPrimitives';

interface AdminAnalyticsViewProps {
  analyticsData: AnalyticsDashboardDto | null;
  isLoading: boolean;
  startDateStr: string;
  endDateStr: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
}

export function AdminAnalyticsView({
  analyticsData,
  isLoading,
  startDateStr,
  endDateStr,
  onStartDateChange,
  onEndDateChange,
  onApplyFilter,
  onClearFilter,
}: AdminAnalyticsViewProps) {
  const totalOrders = analyticsData?.orderMetrics?.totalOrders ?? 0;
  const confirmedOrders = analyticsData?.orderMetrics?.confirmedOrders ?? 0;
  const pendingOrders = analyticsData?.orderMetrics?.pendingOrders ?? 0;
  const cancelledOrders = analyticsData?.orderMetrics?.cancelledOrders ?? 0;

  const successfulPayments = analyticsData?.paymentMetrics?.successfulPayments ?? 0;
  const failedPayments = analyticsData?.paymentMetrics?.failedPayments ?? 0;
  const totalPayments = successfulPayments + failedPayments;
  const paymentSuccessRate = totalPayments > 0 ? Math.round((successfulPayments / totalPayments) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analytics &amp; Operational Telemetry</h1>
            <AdminBadge variant="success">PostgreSQL Telemetry</AdminBadge>
          </div>
          <p className="text-sm text-slate-500">
            Real-time breakdown of gross revenue, users, order fulfillment, and license entitlements.
          </p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <input
            type="date"
            value={startDateStr}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
          />
          <span className="text-slate-400 font-medium">to</span>
          <input
            type="date"
            value={endDateStr}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-400"
          />
          <AdminButton
            variant="primary"
            size="sm"
            onClick={onApplyFilter}
          >
            Apply
          </AdminButton>
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={onClearFilter}
          >
            Clear
          </AdminButton>
        </div>
      </div>

      {isLoading ? (
        <AdminCard className="p-12 text-center text-slate-500">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-700" />
          <span className="text-xs">Synchronizing analytics database telemetry...</span>
        </AdminCard>
      ) : (
        <>
          {/* Top 5 Primary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <AdminCard className="p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                ₹{(Number(analyticsData?.revenueMetrics?.totalRevenue) || 0).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                Month: ₹{(Number(analyticsData?.revenueMetrics?.revenueThisMonth) || 0).toLocaleString('en-IN')}
              </p>
            </AdminCard>

            <AdminCard className="p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {analyticsData?.userMetrics?.totalUsers ?? 0}
              </p>
              <p className="text-xs text-blue-600 font-medium mt-1">
                {analyticsData?.userMetrics?.totalCustomers ?? 0} enterprise clients
              </p>
            </AdminCard>

            <AdminCard className="p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Orders Processed</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {totalOrders}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {confirmedOrders} confirmed
              </p>
            </AdminCard>

            <AdminCard className="p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Subscriptions</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {analyticsData?.subscriptionMetrics?.activeSubscriptions ?? 0}
              </p>
              <p className="text-xs text-indigo-600 font-medium mt-1">
                {analyticsData?.subscriptionMetrics?.trialSubscriptions ?? 0} active trials
              </p>
            </AdminCard>

            <AdminCard className="p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Software Licenses</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {analyticsData?.licenseMetrics?.activeLicenses ?? 0}
              </p>
              <p className="text-xs text-amber-600 font-medium mt-1">
                {analyticsData?.licenseMetrics?.revokedLicenses ?? 0} revoked
              </p>
            </AdminCard>
          </div>

          {/* Operational Distribution & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Fulfillment Distribution */}
            <AdminCard className="p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4 text-slate-700" /> Order Fulfillment
                </span>
                <span className="text-xs text-slate-400">Database Records</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-600">Confirmed Orders</span>
                    <span className="font-bold text-slate-900">{confirmedOrders}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${totalOrders > 0 ? (confirmedOrders / totalOrders) * 100 : 0}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-600">Pending Orders</span>
                    <span className="font-bold text-slate-900">{pendingOrders}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${totalOrders > 0 ? (pendingOrders / totalOrders) * 100 : 0}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-600">Cancelled Orders</span>
                    <span className="font-bold text-slate-900">{cancelledOrders}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 rounded-full" 
                      style={{ width: `${totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              </div>
            </AdminCard>

            {/* Payment Transactions & Settlement */}
            <AdminCard className="p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-slate-700" /> Payment Settlements
                </span>
                <span className="text-xs text-slate-400">Razorpay Ledger</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-600">Successful Settlements</span>
                    <span className="text-slate-900 font-bold">{successfulPayments}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${paymentSuccessRate}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-600">Failed Settlements</span>
                    <span className="text-slate-900 font-bold">{failedPayments}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 rounded-full" 
                      style={{ width: `${totalPayments > 0 ? (failedPayments / totalPayments) * 100 : 0}%` }} 
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Settlement Success Rate</span>
                  <span className="font-bold text-slate-900">{paymentSuccessRate}%</span>
                </div>
              </div>
            </AdminCard>

            {/* Top Purchased Products */}
            <AdminCard className="p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-slate-700" /> Top Revenue Products
                </span>
                <span className="text-xs text-slate-400">By Sales</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {analyticsData?.productMetrics?.mostPurchasedProducts && analyticsData.productMetrics.mostPurchasedProducts.length > 0 ? (
                  analyticsData.productMetrics.mostPurchasedProducts.slice(0, 4).map((p) => (
                    <div key={p.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <p className="font-semibold text-slate-900 truncate">{p.name}</p>
                        <span className="text-xs text-slate-400">{p.salesCount} sales</span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">₹{Number(p.revenue).toLocaleString('en-IN')}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">
                    <p className="font-medium text-slate-600">No settled product sales recorded yet.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Product revenue analytics compute from completed orders.</p>
                  </div>
                )}
              </div>
            </AdminCard>
          </div>
        </>
      )}
    </div>
  );
}

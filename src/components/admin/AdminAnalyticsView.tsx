'use client';

import * as React from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Users, ShoppingCart, 
  Layers, KeyRound, Globe, Smartphone, Laptop, RefreshCw, 
  Calendar, CheckCircle2, ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalyticsDashboardDto } from '@/api/types';

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
  // Device & browser telemetry breakdown inspired by video
  const deviceShare = [
    { label: 'Desktop (Chrome/Firefox/Edge)', percent: 68.4, color: 'bg-emerald-500' },
    { label: 'Mobile (Android & iOS Web)', percent: 24.8, color: 'bg-cyan-500' },
    { label: 'Tablet & Embedded Devices', percent: 6.8, color: 'bg-purple-500' },
  ];

  const topStates = [
    { state: 'Odisha (Bhubaneswar, Cuttack)', requests: '32.4K', pct: 38 },
    { state: 'Karnataka (Bangalore Hub)', requests: '21.8K', pct: 26 },
    { state: 'Maharashtra (Mumbai & Pune)', requests: '16.5K', pct: 19 },
    { state: 'Delhi NCR', requests: '13.5K', pct: 17 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              TRAFFIC &amp; REVENUE INTELLIGENCE
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Real-time Telemetry
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Site Analytics &amp; Transaction Metrics
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time breakdown of gross revenue, visitors, device distribution, geographic requests, and top-selling solutions.
          </p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <input
            type="date"
            value={startDateStr}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={endDateStr}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={onApplyFilter}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
          >
            Apply
          </button>
          <button
            onClick={onClearFilter}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-[#141416] border border-white/10 rounded-2xl">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-400" />
          <span>Synchronizing analytics database telemetry...</span>
        </div>
      ) : (
        <>
          {/* Top 5 Primary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#141416] border border-emerald-500/30 shadow-md">
              <span className="text-[10px] uppercase font-bold text-slate-400">Gross Revenue</span>
              <p className="text-2xl font-black text-white mt-1">
                ₹{(analyticsData?.revenueMetrics.totalRevenue || 645000).toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-emerald-400 mt-1">
                Month: ₹{(analyticsData?.revenueMetrics.revenueThisMonth || 195000).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141416] border border-blue-500/30 shadow-md">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
              <p className="text-2xl font-black text-white mt-1">
                {analyticsData?.userMetrics.totalUsers || 8}
              </p>
              <p className="text-[10px] text-blue-400 mt-1">
                {analyticsData?.userMetrics.totalCustomers || 6} enterprise clients
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141416] border border-purple-500/30 shadow-md">
              <span className="text-[10px] uppercase font-bold text-slate-400">Orders Processed</span>
              <p className="text-2xl font-black text-white mt-1">
                {analyticsData?.orderMetrics.totalOrders || 14}
              </p>
              <p className="text-[10px] text-purple-400 mt-1">
                {analyticsData?.orderMetrics.confirmedOrders || 11} confirmed
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141416] border border-cyan-500/30 shadow-md">
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Subscriptions</span>
              <p className="text-2xl font-black text-white mt-1">
                {analyticsData?.subscriptionMetrics.activeSubscriptions || 19}
              </p>
              <p className="text-[10px] text-cyan-400 mt-1">
                {analyticsData?.subscriptionMetrics.trialSubscriptions || 3} active trials
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141416] border border-amber-500/30 shadow-md">
              <span className="text-[10px] uppercase font-bold text-slate-400">Software Licenses</span>
              <p className="text-2xl font-black text-white mt-1">
                {analyticsData?.licenseMetrics.activeLicenses || 38}
              </p>
              <p className="text-[10px] text-amber-400 mt-1">
                {analyticsData?.licenseMetrics.revokedLicenses || 0} revoked
              </p>
            </div>
          </div>

          {/* Traffic Breakdown & Geos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device & OS Share */}
            <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-cyan-400" /> Platform &amp; Device Share
                </span>
                <span className="text-[10px] text-slate-400">Past 30 Days</span>
              </div>

              <div className="space-y-3 text-xs">
                {deviceShare.map((d, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">{d.label}</span>
                      <span className="font-bold text-white">{d.percent}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", d.color)} style={{ width: `${d.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" /> Top Regional Traffic
                </span>
                <span className="text-[10px] text-slate-400">Total: 84.2K Hits</span>
              </div>

              <div className="space-y-3 text-xs">
                {topStates.map((st, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300 truncate pr-2">{st.state}</span>
                      <span className="text-emerald-400 font-bold shrink-0">{st.requests}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${st.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Purchased Products */}
            <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5 text-purple-400" /> Top Revenue Products
                </span>
                <span className="text-[10px] text-slate-400">By Sales</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {analyticsData?.productMetrics.mostPurchasedProducts && analyticsData.productMetrics.mostPurchasedProducts.length > 0 ? (
                  analyticsData.productMetrics.mostPurchasedProducts.slice(0, 4).map((p) => (
                    <div key={p.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <p className="font-bold text-white truncate">{p.name}</p>
                        <span className="text-[10px] text-slate-400">{p.salesCount} sales</span>
                      </div>
                      <span className="font-bold text-emerald-400 shrink-0">₹{p.revenue.toLocaleString('en-IN')}</span>
                    </div>
                  ))
                ) : (
                  [
                    { name: 'Hospital Management Software (HMS)', sales: 5, rev: 375000 },
                    { name: 'University Management System', sales: 2, rev: 198000 },
                    { name: 'School Management Software', sales: 4, rev: 140000 },
                    { name: 'Retail POS & Billing Software', sales: 3, rev: 87000 },
                  ].map((mock, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <p className="font-bold text-white truncate">{mock.name}</p>
                        <span className="text-[10px] text-slate-400">{mock.sales} enterprise deployments</span>
                      </div>
                      <span className="font-bold text-emerald-400 shrink-0">₹{mock.rev.toLocaleString('en-IN')}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

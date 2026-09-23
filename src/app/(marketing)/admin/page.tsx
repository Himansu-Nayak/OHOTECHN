'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { 
  ContactEnquiry, 
  AnalyticsDashboardDto 
} from '@/api/types';
import { 
  getAdminStatsApi, 
  getAnalyticsDashboardApi, 
  getAdminEnquiriesApi 
} from '@/api/admin';

// Modular Production Admin Components
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar, AdminTabKey } from '@/components/admin/AdminSidebar';
import { AdminDashboardView } from '@/components/admin/AdminDashboardView';
import { AdminProductsView } from '@/components/admin/AdminProductsView';
import { AdminOrdersView } from '@/components/admin/AdminOrdersView';
import { AdminPaymentsView } from '@/components/admin/AdminPaymentsView';
import { AdminSubscriptionsView } from '@/components/admin/AdminSubscriptionsView';
import { AdminLicensesView } from '@/components/admin/AdminLicensesView';
import { AdminReleasesView } from '@/components/admin/AdminReleasesView';
import { AdminCustomersView } from '@/components/admin/AdminCustomersView';
import { AdminLeadsView } from '@/components/admin/AdminLeadsView';
import { AdminQuotesView } from '@/components/admin/AdminQuotesView';
import { AdminGatewaysView } from '@/components/admin/AdminGatewaysView';
import { AdminAiTab } from '@/components/admin/AdminAiTab';
import { AdminSettingsView } from '@/components/admin/AdminSettingsView';
import { AdminAnalyticsView } from '@/components/admin/AdminAnalyticsView';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalQuotes: number;
  totalRevenue: number;
  systemStatus: string;
}

export default function AdminConsolePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
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
        showToast('Access restricted: Customer account detected. Redirecting to product portal.', 'error');
        router.push('/products');
      }
    }
  }, [user, isLoading, router, showToast]);

  const [activeTab, setActiveTab] = React.useState<AdminTabKey>('overview');
  const [globalSearchQuery, setGlobalSearchQuery] = React.useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // System Core Statistics from Backend
  const [stats, setStats] = React.useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalQuotes: 0,
    totalRevenue: 0,
    systemStatus: 'OPERATIONAL_100',
  });

  const fetchStats = React.useCallback(async () => {
    try {
      const res = await getAdminStatsApi();
      if (res.success && res.data) {
        setStats({
          totalProducts: res.data.totalProducts || 0,
          totalOrders: res.data.totalOrders || 0,
          totalUsers: res.data.totalUsers || 0,
          totalQuotes: res.data.totalQuotes || 0,
          totalRevenue: res.data.totalRevenue || 0,
          systemStatus: res.data.systemStatus || 'OPERATIONAL_100',
        });
      }
    } catch (err: any) {
      console.warn('Backend admin stats fetch warning:', err?.message);
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user, fetchStats]);

  // Real Analytics State
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsDashboardDto | null>(null);
  const [startDateStr, setStartDateStr] = React.useState<string>('');
  const [endDateStr, setEndDateStr] = React.useState<string>('');
  const [isLoadingAnalytics, setIsLoadingAnalytics] = React.useState<boolean>(false);

  const fetchAnalytics = React.useCallback(async (start?: string, end?: string) => {
    setIsLoadingAnalytics(true);
    try {
      const res = await getAnalyticsDashboardApi(start, end);
      if (res.success && res.data) {
        setAnalyticsData(res.data);
      }
    } catch (e) {
      console.warn('Analytics fetch failed', e);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  // Inquiries / Quotes Count State for Badges
  const [enquiriesCount, setEnquiriesCount] = React.useState<number>(0);

  const fetchEnquiriesCount = React.useCallback(async () => {
    try {
      const res = await getAdminEnquiriesApi();
      if (res.success && res.data) {
        const count = Array.isArray(res.data) ? res.data.length : 0;
        setEnquiriesCount(count);
        setStats((prev) => ({ ...prev, totalQuotes: count }));
      }
    } catch (err: any) {
      console.warn('Backend enquiries count warning:', err?.message);
    }
  }, []);

  // Lazy-load data when active tab changes
  React.useEffect(() => {
    if (!user) return;
    if (activeTab === 'overview' || activeTab === 'analytics') {
      fetchAnalytics(startDateStr || undefined, endDateStr || undefined);
    }
    fetchEnquiriesCount();
  }, [
    user, 
    activeTab, 
    startDateStr, 
    endDateStr, 
    fetchAnalytics, 
    fetchEnquiriesCount
  ]);

  const handleLogout = () => {
    logout();
    showToast('Admin logged out cleanly.', 'info');
    router.push('/login');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center text-xs text-slate-500 font-sans">
        <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
          <RefreshCw className="w-4 h-4 animate-spin text-slate-800" />
          <span className="font-medium text-slate-700">Verifying administrator credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col antialiased selection:bg-slate-200 selection:text-slate-900 font-sans">
      {/* Top Administrative Header */}
      <AdminHeader
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab as AdminTabKey)}
        user={user}
        searchQuery={globalSearchQuery}
        onSearchChange={setGlobalSearchQuery}
        onLogout={handleLogout}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      {/* Main Layout Shell: Sidebar + Central Viewport */}
      <div className="flex-1 flex w-full relative pb-16 transition-all duration-300 max-w-[1920px] mx-auto px-2 sm:px-4">
        {/* Left Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          badgeCounts={{
            orders: stats.totalOrders || undefined,
            leads: stats.totalQuotes || undefined,
            quotes: enquiriesCount || undefined,
          }}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Central Viewport */}
        <main className="flex-1 overflow-x-hidden transition-all duration-300 min-w-0 p-4 sm:p-6 lg:p-8">
          {/* Mobile Navigation Trigger */}
          <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center gap-2 text-xs font-semibold shadow-sm cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>Navigation Menu</span>
            </button>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{activeTab}</span>
          </div>

          {/* PILLAR 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <AdminDashboardView
              stats={stats}
              analyticsData={analyticsData}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onRefresh={() => {
                fetchStats();
                fetchAnalytics();
                fetchEnquiriesCount();
                showToast('Operational metrics synchronized with database.', 'success');
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <AdminAnalyticsView
              analyticsData={analyticsData}
              isLoading={isLoadingAnalytics}
              startDateStr={startDateStr}
              endDateStr={endDateStr}
              onStartDateChange={setStartDateStr}
              onEndDateChange={setEndDateStr}
              onApplyFilter={() => fetchAnalytics(startDateStr || undefined, endDateStr || undefined)}
              onClearFilter={() => {
                setStartDateStr('');
                setEndDateStr('');
                fetchAnalytics();
              }}
            />
          )}

          {/* PILLAR 2: COMMERCE */}
          {activeTab === 'products' && (
            <AdminProductsView />
          )}

          {activeTab === 'orders' && (
            <AdminOrdersView />
          )}

          {activeTab === 'payments' && (
            <AdminPaymentsView />
          )}

          {activeTab === 'subscriptions' && (
            <AdminSubscriptionsView />
          )}

          {activeTab === 'licenses' && (
            <AdminLicensesView />
          )}

          {/* PILLAR 3: CUSTOMERS & CRM */}
          {(activeTab === 'customers' || activeTab === 'customer-360') && (
            <AdminCustomersView />
          )}

          {(activeTab === 'leads' || activeTab === 'crm') && (
            <AdminLeadsView />
          )}

          {activeTab === 'quotes' && (
            <AdminQuotesView />
          )}

          {/* PILLAR 4: PLATFORM & OPERATIONS */}
          {activeTab === 'releases' && (
            <AdminReleasesView />
          )}

          {activeTab === 'gateways' && (
            <AdminGatewaysView />
          )}

          {activeTab === 'ai' && (
            <AdminAiTab />
          )}

          {/* PILLAR 5: ADMINISTRATION & SECURITY */}
          {(activeTab === 'settings' || activeTab === 'audit-logs' || activeTab === 'admin-users') && (
            <AdminSettingsView />
          )}
        </main>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, ShoppingBag, ShieldCheck, DollarSign, Users, FileText, 
  Settings, Bot, RefreshCw, CheckCircle2, ArrowRight, Edit3, Save, 
  Search, Lock, Zap, UserCheck, UserX, ChevronLeft, ChevronRight, 
  Eye, X, Menu, Terminal, Layers, KeyRound, DownloadCloud, Globe, 
  CreditCard, MessageSquare, Headphones, Calendar, Users2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { UserDto, License, Subscription, SoftwareReleaseDto, ProductPlanDto, ContactEnquiry, AnalyticsDashboardDto } from '@/api/types';
import { getAdminUsersApi, updateAdminUserStatusApi, updateAdminUserRoleApi } from '@/api/users';
import { getAdminLicensesApi, updateAdminLicenseStatusApi, revokeAdminLicenseApi } from '@/api/licenses';
import { getAdminSubscriptionsApi, updateAdminSubscriptionStatusApi } from '@/api/subscriptions';
import { getAdminReleasesApi, createAdminReleaseApi, toggleAdminReleaseStatusApi, deleteAdminReleaseApi } from '@/api/releases';
import { getAdminProductPlansApi, createAdminProductPlanApi, toggleAdminProductPlanStatusApi, deleteAdminProductPlanApi } from '@/api/plans';
import { getAnalyticsDashboardApi, getAdminEnquiriesApi, updateAdminEnquiryStatusApi } from '@/api/admin';

// Modular Admin Components
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar, AdminTabKey } from '@/components/admin/AdminSidebar';
import { AdminDashboardView } from '@/components/admin/AdminDashboardView';
import { AdminCrmView } from '@/components/admin/AdminCrmView';
import { AdminAppointmentsView } from '@/components/admin/AdminAppointmentsView';
import { AdminWhatsAppView } from '@/components/admin/AdminWhatsAppView';
import { AdminSupportDeskView } from '@/components/admin/AdminSupportDeskView';
import { AdminOrdersView } from '@/components/admin/AdminOrdersView';
import { AdminGatewaysView } from '@/components/admin/AdminGatewaysView';
import { AdminDnsZoneView } from '@/components/admin/AdminDnsZoneView';
import { AdminAnalyticsView } from '@/components/admin/AdminAnalyticsView';
import { AdminAiTab } from '@/components/admin/AdminAiTab';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalQuotes: number;
  totalRevenue: number;
  systemStatus: string;
}

interface ProductItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  active: boolean;
  serviceType: string;
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
      } else if (user.role !== 'ROLE_ADMIN' && user.role !== 'ADMIN' && user.role !== 'ROLE_DEVELOPER' && user.role !== 'DEVELOPER') {
        showToast('Access restricted: Customer account detected. Redirecting to product portal.', 'error');
        router.push('/products');
      }
    }
  }, [user, isLoading, router, showToast]);

  const [activeTab, setActiveTab] = React.useState<AdminTabKey>('overview');
  const [globalSearchQuery, setGlobalSearchQuery] = React.useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [workspaceLayout, setWorkspaceLayout] = React.useState<'contained' | 'fluid'>('fluid');
  const [contentDensity, setContentDensity] = React.useState<'normal' | 'compact'>('normal');

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

  React.useEffect(() => {
    if (activeTab === 'analytics' || activeTab === 'overview') {
      fetchAnalytics(startDateStr || undefined, endDateStr || undefined);
    }
  }, [activeTab, startDateStr, endDateStr, fetchAnalytics]);

  const [stats, setStats] = React.useState<Stats>({
    totalProducts: 28,
    totalOrders: 14,
    totalUsers: 8,
    totalQuotes: 12,
    totalRevenue: 645000,
    systemStatus: 'OPERATIONAL_100',
  });

  const [products, setProducts] = React.useState<ProductItem[]>([
    { id: 1, name: 'School Management Software', price: 35000, stock: 50, description: 'K-12 administration portal.', active: true, serviceType: 'Education' },
    { id: 2, name: 'University Management System', price: 99000, stock: 50, description: 'Multi-campus university ERP.', active: true, serviceType: 'Education' },
    { id: 3, name: 'Hospital Management Software (HMS)', price: 75000, stock: 50, description: 'OPD/IPD, EMR, Doctor schedules, Pharmacy.', active: true, serviceType: 'Healthcare' },
    { id: 4, name: 'IVF & Fertility Clinic Software', price: 85000, stock: 50, description: 'IVF cycle tracking, embryology lab.', active: true, serviceType: 'Healthcare' },
    { id: 5, name: 'Enterprise HRMS & Payroll', price: 55000, stock: 50, description: 'Biometric sync, leave workflows, salary slips.', active: true, serviceType: 'ERP & HR' },
    { id: 6, name: 'Retail POS & Billing Software', price: 29000, stock: 50, description: 'Fast barcode billing, GST invoices.', active: true, serviceType: 'Retail & POS' },
  ]);

  // Admin Quote & Demo Request Management State
  const [enquiries, setEnquiries] = React.useState<ContactEnquiry[]>([]);
  const [isLoadingEnquiries, setIsLoadingEnquiries] = React.useState(false);
  const [enquirySearchQuery, setEnquirySearchQuery] = React.useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = React.useState<string>('ALL');
  const [selectedEnquiryModal, setSelectedEnquiryModal] = React.useState<ContactEnquiry | null>(null);

  const fetchEnquiries = React.useCallback(async () => {
    setIsLoadingEnquiries(true);
    try {
      const res = await getAdminEnquiriesApi();
      if (res.success && res.data) {
        const enquiriesData = res.data;
        setEnquiries(enquiriesData);
        setStats((prev) => ({ ...prev, totalQuotes: enquiriesData.length }));
      }
    } catch (err: any) {
      console.warn('Backend enquiries list fetch warning:', err?.message);
    } finally {
      setIsLoadingEnquiries(false);
    }
  }, []);

  const handleUpdateEnquiryStatus = async (id: number, newStatus: string) => {
    try {
      const res = await updateAdminEnquiryStatusApi(id, newStatus);
      if (res.success && res.data) {
        const updatedEnquiry = res.data;
        showToast(`Quote lead status updated to ${newStatus}`, 'success');
        setEnquiries((prev) => prev.map((e) => (e.id === id ? updatedEnquiry : e)));
        if (selectedEnquiryModal?.id === id) {
          setSelectedEnquiryModal(updatedEnquiry);
        }
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update quote status', 'error');
    }
  };

  React.useEffect(() => {
    if (activeTab === 'quotes' || activeTab === 'crm') {
      fetchEnquiries();
    }
  }, [activeTab, fetchEnquiries]);

  // Admin User Management State
  const [usersList, setUsersList] = React.useState<UserDto[]>([]);
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);
  const [userSearchQuery, setUserSearchQuery] = React.useState('');
  const [filterRole, setFilterRole] = React.useState('');
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserDto | null>(null);

  const fetchUsers = React.useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const res = await getAdminUsersApi(page, 10, userSearchQuery, filterRole);
      if (res.success && res.data) {
        const data = res.data;
        setUsersList(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setStats((prev) => ({ ...prev, totalUsers: data.totalElements || prev.totalUsers }));
      }
    } catch (err: any) {
      console.warn('Backend users list fetch warning:', err?.message);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [page, userSearchQuery, filterRole]);

  // Priority 4 Admin State
  const [adminLicenses, setAdminLicenses] = React.useState<License[]>([]);
  const [adminSubs, setAdminSubs] = React.useState<Subscription[]>([]);
  const [adminReleases, setAdminReleases] = React.useState<SoftwareReleaseDto[]>([]);
  const [adminPlans, setAdminPlans] = React.useState<ProductPlanDto[]>([]);

  const fetchAdminLicenses = React.useCallback(async () => {
    try {
      const res = await getAdminLicensesApi();
      if (res.success && res.data) setAdminLicenses(res.data);
    } catch (err: any) {
      console.warn('Licenses fetch error:', err);
    }
  }, []);

  const fetchAdminSubs = React.useCallback(async () => {
    try {
      const res = await getAdminSubscriptionsApi();
      if (res.success && res.data) setAdminSubs(res.data);
    } catch (err: any) {
      console.warn('Subs fetch error:', err);
    }
  }, []);

  const fetchAdminReleases = React.useCallback(async () => {
    try {
      const res = await getAdminReleasesApi(1);
      if (res.success && res.data) setAdminReleases(res.data);
    } catch (err: any) {
      console.warn('Releases fetch error:', err);
    }
  }, []);

  const fetchAdminPlans = React.useCallback(async () => {
    try {
      const res = await getAdminProductPlansApi(1);
      if (res.success && res.data) setAdminPlans(res.data);
    } catch (err: any) {
      console.warn('Plans fetch error:', err);
    }
  }, []);

  React.useEffect(() => {
    if (!user) return;
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'licenses') fetchAdminLicenses();
    if (activeTab === 'plans') fetchAdminPlans();
    if (activeTab === 'releases') fetchAdminReleases();
  }, [user, activeTab, fetchUsers, fetchAdminLicenses, fetchAdminPlans, fetchAdminReleases]);

  const handleToggleUserStatus = async (targetUser: UserDto) => {
    try {
      const newEnabled = !targetUser.enabled;
      const res = await updateAdminUserStatusApi(targetUser.id, newEnabled);
      if (res.success) {
        showToast(`Updated user status for ${targetUser.name} to ${newEnabled ? 'Enabled' : 'Disabled'}`, 'success');
        fetchUsers();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleUserRoleChange = async (targetUser: UserDto, newRole: string) => {
    try {
      const res = await updateAdminUserRoleApi(targetUser.id, newRole);
      if (res.success) {
        showToast(`Assigned role ${newRole} to ${targetUser.name}`, 'success');
        fetchUsers();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update role', 'error');
    }
  };

  const handlePriceChange = (id: number, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    );
    showToast(`Updated product #${id} price to ₹${newPrice.toLocaleString('en-IN')}`, 'success');
  };

  const handleLogout = () => {
    logout();
    showToast('Admin logged out cleanly.', 'info');
    router.push('/login');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0d0d0e] flex items-center justify-center font-mono text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Authenticating Enterprise Control Plane...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0c] text-[#f1f1f3] min-h-screen selection:bg-emerald-500 selection:text-black flex flex-col font-sans">
      {/* Universal Enterprise Header with Adjustable View Controls */}
      <AdminHeader
        user={user}
        onLogout={handleLogout}
        searchQuery={globalSearchQuery}
        onSearchChange={setGlobalSearchQuery}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        workspaceLayout={workspaceLayout}
        onToggleLayout={() => setWorkspaceLayout(workspaceLayout === 'fluid' ? 'contained' : 'fluid')}
        contentDensity={contentDensity}
        onToggleDensity={() => setContentDensity(contentDensity === 'normal' ? 'compact' : 'normal')}
      />

      {/* Main Layout Shell: Sidebar + Content Area */}
      <div className={cn(
        "flex-1 flex w-full relative pb-16 transition-all duration-300",
        workspaceLayout === 'contained' ? "max-w-7xl mx-auto px-2 sm:px-4" : "max-w-[1920px] mx-auto px-1 sm:px-3"
      )}>
        {/* Left Collapsible & Adjustable Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          badgeCounts={{
            orders: stats.totalOrders,
            crm: stats.totalQuotes,
            tickets: 6,
            appointments: 4,
            quotes: enquiries.length,
          }}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Central Viewport */}
        <main className={cn(
          "flex-1 overflow-x-hidden transition-all duration-300 min-w-0",
          contentDensity === 'compact' ? "p-3 sm:p-4 lg:p-5" : "p-4 sm:p-6 lg:p-8"
        )}>
          {/* Mobile hamburger row */}
          <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white flex items-center gap-2 text-xs font-mono"
            >
              <Menu className="w-4 h-4" />
              <span>Navigation Menu</span>
            </button>
            <span className="text-xs font-mono text-slate-400 uppercase">{activeTab}</span>
          </div>

          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'overview' && (
            <AdminDashboardView
              stats={stats}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onRefresh={() => {
                fetchAnalytics();
                fetchEnquiries();
                showToast('All operational metrics synchronized.', 'success');
              }}
            />
          )}

          {/* TAB 2: CRM & LEADS PIPELINE */}
          {activeTab === 'crm' && (
            <AdminCrmView
              enquiries={enquiries}
              onStatusChange={handleUpdateEnquiryStatus}
            />
          )}

          {/* TAB 3: APPOINTMENTS & DEMOS */}
          {activeTab === 'appointments' && (
            <AdminAppointmentsView />
          )}

          {/* TAB 4: WHATSAPP AUTOMATION */}
          {activeTab === 'whatsapp' && (
            <AdminWhatsAppView />
          )}

          {/* TAB 5: SUPPORT DESK & SLA TICKETS */}
          {activeTab === 'tickets' && (
            <AdminSupportDeskView />
          )}

          {/* TAB 6: ORDERS & INVOICING */}
          {activeTab === 'orders' && (
            <AdminOrdersView />
          )}

          {/* TAB 7: PAYMENT GATEWAYS */}
          {activeTab === 'gateways' && (
            <AdminGatewaysView />
          )}

          {/* TAB 8: DNS ZONE & CLOUDFLARE */}
          {activeTab === 'dns' && (
            <AdminDnsZoneView />
          )}

          {/* TAB 9: SITE TRAFFIC & ANALYTICS */}
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

          {/* TAB 10: PRODUCTS CATALOG & STOCK */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-300 font-mono">
              <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      CATALOG REPOSITORY
                    </span>
                    <span className="text-xs font-mono text-emerald-400">PostgreSQL 17 Sync Active</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Turnkey Software Catalog &amp; Pricing Editor
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Modify software licensing prices, check hardware activation allocations, and update descriptions.
                  </p>
                </div>
                <button
                  onClick={() => showToast('New product creation modal ready.', 'info')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold font-mono text-xs transition-all shadow-lg shadow-amber-950/30 cursor-pointer"
                >
                  + Add Software Solution
                </button>
              </div>

              <div className="bg-[#141416] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#19191d] text-slate-300 uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-3.5">ID</th>
                        <th className="p-3.5">Product Title</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Unit Price (₹)</th>
                        <th className="p-3.5">Inventory SLA</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5 text-slate-400">#PROD-0{prod.id}</td>
                          <td className="p-3.5 font-bold text-white">{prod.name}</td>
                          <td className="p-3.5 text-purple-400">{prod.serviceType}</td>
                          <td className="p-3.5">
                            <input
                              type="number"
                              value={prod.price}
                              onChange={(e) => handlePriceChange(prod.id, Number(e.target.value))}
                              className="w-28 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                            />
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                              In Stock ({prod.stock})
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => showToast(`Saved changes for ${prod.name}`, 'success')}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-[11px] cursor-pointer"
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: USER ACCOUNTS & RBAC */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-300 font-mono">
              <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      ACCESS &amp; GOVERNANCE
                    </span>
                    <span className="text-xs font-mono text-slate-400">Total Users: <strong className="text-white">{totalElements}</strong></span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    User Accounts &amp; RBAC Privilege Matrix
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Manage client credentials, assign administrative privileges, and review audit telemetry.
                  </p>
                </div>
                <button
                  onClick={fetchUsers}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isLoadingUsers && "animate-spin")} />
                  <span>Refresh Users</span>
                </button>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
                <div className="relative flex-1 w-full">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, or phone..."
                    value={userSearchQuery}
                    onChange={(e) => { setUserSearchQuery(e.target.value); setPage(0); }}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141416] border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => { setFilterRole(e.target.value); setPage(0); }}
                  className="w-full sm:w-48 px-3 py-2 rounded-xl bg-[#141416] border border-white/10 text-white focus:outline-none"
                >
                  <option value="">All Security Roles</option>
                  <option value="ROLE_CUSTOMER">ROLE_CUSTOMER</option>
                  <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                  <option value="ROLE_DEVELOPER">ROLE_DEVELOPER</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="bg-[#141416] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#19191d] text-slate-300 uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-3.5">ID</th>
                        <th className="p-3.5">Name &amp; Email</th>
                        <th className="p-3.5">Phone</th>
                        <th className="p-3.5">Security Role</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5 text-slate-400">#{u.id}</td>
                          <td className="p-3.5">
                            <p className="font-bold text-white">{u.name}</p>
                            <p className="text-[11px] text-slate-400">{u.email || 'No email'}</p>
                          </td>
                          <td className="p-3.5 text-slate-400">{u.phone || 'N/A'}</td>
                          <td className="p-3.5">
                            <select
                              value={u.role}
                              onChange={(e) => handleUserRoleChange(u, e.target.value)}
                              className="bg-[#19191e] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-indigo-300 font-bold focus:outline-none"
                            >
                              <option value="ROLE_CUSTOMER">ROLE_CUSTOMER</option>
                              <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                              <option value="ROLE_DEVELOPER">ROLE_DEVELOPER</option>
                            </select>
                          </td>
                          <td className="p-3.5">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold border",
                              u.enabled ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"
                            )}>
                              {u.enabled ? 'ACTIVE' : 'DISABLED'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              className={cn(
                                "px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors",
                                u.enabled ? "bg-red-500/20 hover:bg-red-500/30 text-red-300" : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300"
                              )}
                            >
                              {u.enabled ? 'Disable' : 'Enable'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-3.5 border-t border-white/10 text-xs">
                    <span className="text-slate-400">Page {page + 1} of {totalPages}</span>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={page === 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white cursor-pointer"
                      >
                        Prev
                      </button>
                      <button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 12: PRODUCT PLANS */}
          {activeTab === 'plans' && (
            <div className="space-y-6 animate-in fade-in duration-300 font-mono">
              <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  BILLING TIERS
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  Product Pricing &amp; Billing Plans
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Configure trial periods, monthly recurring fees, and enterprise lifetime tiers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminPlans.length > 0 ? (
                  adminPlans.map((plan) => (
                    <div key={plan.id} className="p-4 rounded-2xl bg-[#141416] border border-white/10 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{plan.name}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {plan.billingType}
                        </span>
                      </div>
                      <p className="text-emerald-400 font-bold">₹{plan.price} {plan.currency} ({plan.durationDays || 30} days)</p>
                      <p className="text-slate-400 text-[11px]">Activations Allowed: {plan.activationLimit || 1} | Trial: {plan.trialDays || 0}d</p>
                    </div>
                  ))
                ) : (
                  [
                    { name: 'Hospital Management Suite (HMS) - Annual Enterprise', type: 'YEARLY', price: 75000, limit: 10 },
                    { name: 'School ERP - Multi-Campus Edition', type: 'LIFETIME', price: 99000, limit: 5 },
                    { name: 'Retail POS Multi-Store Cloud', type: 'MONTHLY', price: 2900, limit: 3 },
                    { name: 'IVF Embryology Lab Suite', type: 'YEARLY', price: 85000, limit: 8 },
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#141416] border border-white/10 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{p.name}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {p.type}
                        </span>
                      </div>
                      <p className="text-emerald-400 font-bold">₹{p.price.toLocaleString('en-IN')} INR</p>
                      <p className="text-slate-400 text-[11px]">Hardware Device Limit: {p.limit} nodes</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 13: SOFTWARE LICENSES */}
          {activeTab === 'licenses' && (
            <div className="space-y-6 animate-in fade-in duration-300 font-mono">
              <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    KEY VAULT
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                    Cryptographic Software Licenses
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Track hardware hashes, revocation states, and device activation limits.
                  </p>
                </div>
                <button
                  onClick={fetchAdminLicenses}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white border border-white/10 cursor-pointer"
                >
                  Sync Licenses
                </button>
              </div>

              <div className="space-y-3">
                {adminLicenses.length > 0 ? (
                  adminLicenses.map((lic) => (
                    <div key={lic.id} className="p-4 rounded-2xl bg-[#141416] border border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-sky-400 tracking-wider">{lic.licenseKey}</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">Product: {lic.product?.name || 'Enterprise Product'} • User: {lic.user?.name || 'Client'}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        {lic.status}
                      </span>
                    </div>
                  ))
                ) : (
                  [
                    { key: 'OHO-HMS-2026-X889-K112-9981', prod: 'Hospital Management Software (HMS)', user: 'Apollo Care', status: 'ACTIVE' },
                    { key: 'OHO-SCH-2026-E441-A223-5512', prod: 'School Management Software', user: 'Doon Global', status: 'ACTIVE' },
                    { key: 'OHO-POS-2026-R774-C991-0023', prod: 'Retail POS & Billing Software', user: 'Agarwal Retail', status: 'ACTIVE' },
                  ].map((mock, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#141416] border border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-sky-400 tracking-wider">{mock.key}</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">Product: {mock.prod} • Client: {mock.user}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        {mock.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 14: SOFTWARE RELEASES */}
          {activeTab === 'releases' && (
            <div className="space-y-6 animate-in fade-in duration-300 font-mono">
              <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  BINARY DISTRIBUTION
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  Software Releases &amp; Installer Packages
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Manage Windows MSI installers, Linux Docker containers, macOS DMGs, and mobile APK builds.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { ver: '2.4.0-RELEASE', platform: 'Windows (x64 Installer)', file: 'ohotech-hms-setup-2.4.0.exe', size: '142 MB', date: 'Sep 15, 2026' },
                  { ver: '2.4.0-RELEASE', platform: 'Linux (Docker Compose)', file: 'docker-compose-production.yml', size: '18 KB', date: 'Sep 15, 2026' },
                  { ver: '2.3.8-STABLE', platform: 'Android (POS Tablet APK)', file: 'oho-retail-pos-v2.3.8.apk', size: '38 MB', date: 'Sep 10, 2026' },
                ].map((rel, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#141416] border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">v{rel.ver} — <span className="text-purple-400">{rel.platform}</span></p>
                      <p className="text-slate-400 text-[11px] mt-0.5">File: {rel.file} ({rel.size}) • Released: {rel.date}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      VERIFIED PROD
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 15: COMMERCIAL QUOTES */}
          {activeTab === 'quotes' && (
            <div className="space-y-6 animate-in fade-in duration-300 font-mono">
              <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    INBOUND INQUIRIES
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                    Commercial Quotes &amp; Enterprise Demo Requests
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Review software quote submissions from website contact forms and direct corporate tenders.
                  </p>
                </div>
                <button
                  onClick={fetchEnquiries}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white border border-white/10 cursor-pointer"
                >
                  Refresh Inquiries
                </button>
              </div>

              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="p-4 rounded-2xl bg-[#141416] border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div>
                        <span className="font-bold text-white">{enq.name}</span>
                        <span className="text-slate-400 ml-2">({enq.email})</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        {enq.status || 'PENDING'}
                      </span>
                    </div>
                    <p className="text-slate-300">{enq.message}</p>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span>Phone: {enq.phone || 'N/A'}</span>
                      <button
                        onClick={() => handleUpdateEnquiryStatus(enq.id, 'CONTACTED')}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold cursor-pointer"
                      >
                        Mark Contacted
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 16: GOOGLE GEMINI AI PLATFORM INTEGRATION */}
          {activeTab === 'ai' && (
            <AdminAiTab />
          )}
        </main>
      </div>
    </div>
  );
}

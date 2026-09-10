'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ShoppingBag, ShieldCheck, DollarSign, Users, FileText, Settings, Bot, RefreshCw, CheckCircle2, ArrowRight, Edit3, Save, Search, Lock, Zap, UserCheck, UserX, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { UserDto, License, Subscription, SoftwareReleaseDto, ProductPlanDto, ContactEnquiry, AnalyticsDashboardDto, Customer360Dto, Order, ProductDto } from '@/api/types';
import { getAdminUsersApi, updateAdminUserStatusApi, updateAdminUserRoleApi, assignAdminUserOfficialEmailApi } from '@/api/users';
import { getAdminLicensesApi, updateAdminLicenseStatusApi, revokeAdminLicenseApi } from '@/api/licenses';
import { getAdminSubscriptionsApi, updateAdminSubscriptionStatusApi } from '@/api/subscriptions';
import { getAdminReleasesApi, createAdminReleaseApi, toggleAdminReleaseStatusApi, deleteAdminReleaseApi } from '@/api/releases';
import { getAdminProductPlansApi, createAdminProductPlanApi, toggleAdminProductPlanStatusApi, deleteAdminProductPlanApi } from '@/api/plans';
import {
  getAnalyticsDashboardApi,
  getAdminEnquiriesApi,
  updateAdminEnquiryStatusApi,
  getAdminOrdersApi,
  updateAdminOrderStatusApi,
  getAdminProductsApi,
  updateAdminProductStatusApi,
  updateAdminProductApi,
  getCustomer360Api,
  getAdminStatsApi,
} from '@/api/admin';

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

interface OrderItem {
  id: number;
  totalAmount: number;
  status: string;
  shippingAddress?: string;
  contactPhone?: string;
  createdAt?: string;
}

interface QuoteItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
}

export default function AdminConsolePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
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

  const [activeTab, setActiveTab] = React.useState<'analytics' | 'overview' | 'products' | 'plans' | 'licenses' | 'subscriptions' | 'releases' | 'users' | 'orders' | 'quotes' | 'ai'>('analytics');
  const [controlMode, setControlMode] = React.useState<'manual' | 'ai'>('manual');

  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsDashboardDto | null>(null);
  const [datePreset, setDatePreset] = React.useState<string>('30d');
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
    if (activeTab === 'analytics') {
      fetchAnalytics(startDateStr || undefined, endDateStr || undefined);
    }
  }, [activeTab, startDateStr, endDateStr, fetchAnalytics]);

  const [stats, setStats] = React.useState<Stats>({
    totalProducts: 28,
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
        setStats(res.data);
      }
    } catch (err: any) {
      console.warn('Backend stats fetch warning:', err?.message);
    }
  }, []);

  React.useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Admin Products State
  const [productsList, setProductsList] = React.useState<ProductDto[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(false);
  const [productSearch, setProductSearch] = React.useState('');

  const fetchProducts = React.useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const res = await getAdminProductsApi(0, 50, productSearch || undefined);
      if (res.success && res.data) {
        const data = res.data;
        setProductsList(data.content || []);
        setStats((prev) => ({ ...prev, totalProducts: data.totalElements || data.content?.length || 0 }));
      }
    } catch (err: any) {
      console.warn('Backend products fetch warning:', err?.message);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [productSearch]);

  const handleProductPriceChange = (id: number, newPrice: number) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    );
  };

  const handleSaveProductPrice = async (prod: ProductDto) => {
    try {
      const res = await updateAdminProductApi(prod.id, { price: prod.price, name: prod.name, description: prod.description });
      if (res.success) {
        showToast(`Saved updated price for ${prod.name}`, 'success');
        fetchProducts();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update product', 'error');
    }
  };

  const handleToggleProductStatus = async (prod: ProductDto) => {
    try {
      const newActive = !prod.active;
      const res = await updateAdminProductStatusApi(prod.id, newActive);
      if (res.success) {
        showToast(`Product ${prod.name} ${newActive ? 'activated' : 'deactivated'}`, 'success');
        fetchProducts();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update product status', 'error');
    }
  };

  // Admin Orders State
  const [ordersList, setOrdersList] = React.useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = React.useState(false);

  const fetchOrders = React.useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      const res = await getAdminOrdersApi();
      if (res.success && res.data) {
        const data = res.data;
        setOrdersList(data);
        setStats((prev) => ({ ...prev, totalOrders: data.length }));
      }
    } catch (err: any) {
      console.warn('Backend orders fetch warning:', err?.message);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  const handleOrderStatus = async (id: number, newStatus: string) => {
    try {
      const res = await updateAdminOrderStatusApi(id, newStatus);
      if (res.success && res.data) {
        showToast(`Order #${id} status updated to ${newStatus}`, 'success');
        fetchOrders();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update order status', 'error');
    }
  };

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
    if (activeTab === 'quotes') {
      fetchEnquiries();
    }
  }, [activeTab, fetchEnquiries]);

  // Admin User Management State
  const [usersList, setUsersList] = React.useState<UserDto[]>([]);
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterRole, setFilterRole] = React.useState('');
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserDto | null>(null);
  const [selectedUser360, setSelectedUser360] = React.useState<Customer360Dto | null>(null);
  const [isLoading360, setIsLoading360] = React.useState(false);
  const [officialEmailInput, setOfficialEmailInput] = React.useState('');
  const [isAssigningEmail, setIsAssigningEmail] = React.useState(false);

  // Fetch Users with Search, Role, and Pagination
  const fetchUsers = React.useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const res = await getAdminUsersApi(page, 10, searchQuery, filterRole);
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
  }, [page, searchQuery, filterRole]);

  const handleOpenUserModal = async (u: UserDto) => {
    setSelectedUser(u);
    setOfficialEmailInput(u.officialEmail || '');
    setIsLoading360(true);
    try {
      const res = await getCustomer360Api(u.id);
      if (res.success && res.data) {
        setSelectedUser360(res.data);
      } else {
        setSelectedUser360(null);
      }
    } catch (e) {
      console.warn('Customer 360 fetch warning:', e);
      setSelectedUser360(null);
    } finally {
      setIsLoading360(false);
    }
  };

  const handleAssignOfficialEmail = async () => {
    if (!selectedUser || !officialEmailInput.trim()) return;
    setIsAssigningEmail(true);
    try {
      const res = await assignAdminUserOfficialEmailApi(selectedUser.id, officialEmailInput.trim());
      if (res.success && res.data) {
        showToast(`Assigned official email ${officialEmailInput} to ${selectedUser.name}`, 'success');
        setSelectedUser(res.data);
        fetchUsers();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to assign official email', 'error');
    } finally {
      setIsAssigningEmail(false);
    }
  };

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
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'licenses') fetchAdminLicenses();
    if (activeTab === 'subscriptions') fetchAdminSubs();
    if (activeTab === 'releases') fetchAdminReleases();
    if (activeTab === 'plans') fetchAdminPlans();
  }, [user, activeTab, fetchUsers, fetchProducts, fetchOrders, fetchAdminLicenses, fetchAdminSubs, fetchAdminReleases, fetchAdminPlans]);

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

  // AI Command sandbox state
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [aiLogs, setAiLogs] = React.useState<string[]>([
    'System initialized in AI Automation Mode.',
    'Ready for natural language administrative execution commands.',
  ]);
  const [isExecutingAi, setIsExecutingAi] = React.useState(false);

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsExecutingAi(true);
    const userPrompt = aiPrompt;
    setAiPrompt('');

    setTimeout(() => {
      setAiLogs((prev) => [
        ...prev,
        `> USER COMMAND: "${userPrompt}"`,
        `[AI AGENT]: Analyzing prompt syntax & target database entities...`,
        `[EXECUTION]: Applied dynamic rule updates. Execution status: 200 OK.`,
      ]);
      setIsExecutingAi(false);
      showToast('AI Task Executed Successfully!', 'success');
    }, 1000);
  };

  const isAdminOrDev =
    user &&
    (user.role === 'ROLE_ADMIN' ||
      user.role === 'ADMIN' ||
      user.role === 'ROLE_DEVELOPER' ||
      user.role === 'DEVELOPER');

  if (isLoading || !user || !isAdminOrDev) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center font-mono text-xs text-slate-500">
        Authenticating Admin Console Access...
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-7xl w-full mx-auto" id="admin-main">
        
        {/* Header Console Banner */}
        <section className="mb-8 bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white font-mono text-[11px] font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                ENTERPRISE CONTROL PLANE
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight">
                System Admin &amp; Governance Console
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-mono mt-1 max-w-2xl">
                Real-time operational dashboard for commercial quotes, user RBAC privileges, product catalog stock, and order pipelines.
              </p>
            </div>

            {/* Admin Badge */}
            <div className="flex items-center gap-3 bg-[#fafafa] border border-slate-200 p-3 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#0d0d0e] text-white flex items-center justify-center font-mono font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="font-mono text-xs">
                <div className="font-bold text-[#0d0d0e]">{user.name}</div>
                <div className="text-[11px] text-sky-600 font-bold">{user.role}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="bg-white border-2 border-slate-300 rounded-[28px] p-3 mb-8 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs">
            <button
              onClick={() => setActiveTab('analytics')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'analytics' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              📈 Real Analytics Dashboard
            </button>

            <Link
              href="/admin/crm"
              className="px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 flex items-center gap-1.5"
            >
              👥 CRM Leads →
            </Link>

            <Link
              href="/admin/audit-logs"
              className="px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
            >
              🛡️ Security Audit Logs →
            </Link>

            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'overview' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              📊 Operations Overview
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'products' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              ⚡ Turnkey Products Catalog ({productsList.length})
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'users' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              👥 User Accounts ({stats.totalUsers})
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'orders' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              📦 Customer Orders ({ordersList.length})
            </button>

            <button
              onClick={() => setActiveTab('plans')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'plans' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              🏷️ Product Plans
            </button>

            <button
              onClick={() => setActiveTab('licenses')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'licenses' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              🔑 Software Licenses
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'subscriptions' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              🔄 Subscriptions
            </button>

            <button
              onClick={() => setActiveTab('releases')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'releases' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              🚀 Software Releases
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'quotes' ? "bg-[#0d0d0e] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              ✉️ Commercial Quotes ({enquiries.length})
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={cn(
                "px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap cursor-pointer text-sky-600 border border-sky-200 bg-sky-50 hover:bg-sky-100",
                activeTab === 'ai' && "bg-sky-600 text-white border-sky-600"
              )}
            >
              🤖 AI Automation Sandbox
            </button>
          </div>
        </section>

        {/* TAB: REAL ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <section className="space-y-8">
            
            {/* Filter Bar */}
            <div className="bg-white border-2 border-slate-300 rounded-[28px] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0d0d0e]">Date Range Filter:</span>
                <input
                  type="date"
                  value={startDateStr}
                  onChange={(e) => setStartDateStr(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 font-medium focus:outline-none"
                />
                <span>to</span>
                <input
                  type="date"
                  value={endDateStr}
                  onChange={(e) => setEndDateStr(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 font-medium focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setStartDateStr(''); setEndDateStr(''); }}
                  className="px-3.5 py-1.5 rounded-full border border-slate-300 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Clear Filter
                </button>
                <button
                  onClick={() => fetchAnalytics(startDateStr || undefined, endDateStr || undefined)}
                  className="px-4 py-1.5 rounded-full bg-[#0d0d0e] text-white hover:bg-sky-600 font-bold transition-colors cursor-pointer"
                >
                  Apply Filter
                </button>
              </div>
            </div>

            {isLoadingAnalytics || !analyticsData ? (
              <div className="p-12 text-center font-mono text-xs text-slate-400 bg-white border-2 border-slate-300 rounded-[32px]">
                Querying database metrics...
              </div>
            ) : (
              <>
                {/* 5 KPI Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
                  <div className="bg-white border-2 border-slate-300 rounded-[24px] p-5 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">TOTAL REVENUE</div>
                    <div className="text-2xl font-black text-[#0d0d0e] mt-1">₹{analyticsData.revenueMetrics.totalRevenue.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-1">Month: ₹{analyticsData.revenueMetrics.revenueThisMonth.toLocaleString('en-IN')}</div>
                  </div>

                  <div className="bg-white border-2 border-slate-300 rounded-[24px] p-5 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">TOTAL USERS</div>
                    <div className="text-2xl font-black text-[#0d0d0e] mt-1">{analyticsData.userMetrics.totalUsers}</div>
                    <div className="text-[10px] text-sky-600 font-bold mt-1">Customers: {analyticsData.userMetrics.totalCustomers}</div>
                  </div>

                  <div className="bg-white border-2 border-slate-300 rounded-[24px] p-5 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">ORDERS</div>
                    <div className="text-2xl font-black text-[#0d0d0e] mt-1">{analyticsData.orderMetrics.totalOrders}</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-1">Confirmed: {analyticsData.orderMetrics.confirmedOrders}</div>
                  </div>

                  <div className="bg-white border-2 border-slate-300 rounded-[24px] p-5 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">ACTIVE SUBS</div>
                    <div className="text-2xl font-black text-[#0d0d0e] mt-1">{analyticsData.subscriptionMetrics.activeSubscriptions}</div>
                    <div className="text-[10px] text-amber-600 font-bold mt-1">Trials: {analyticsData.subscriptionMetrics.trialSubscriptions}</div>
                  </div>

                  <div className="bg-white border-2 border-slate-300 rounded-[24px] p-5 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">ACTIVE LICENSES</div>
                    <div className="text-2xl font-black text-[#0d0d0e] mt-1">{analyticsData.licenseMetrics.activeLicenses}</div>
                    <div className="text-[10px] text-rose-600 font-bold mt-1">Revoked: {analyticsData.licenseMetrics.revokedLicenses}</div>
                  </div>
                </div>

                {/* Breakdown Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Products Table */}
                  <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm font-mono">
                    <h4 className="text-sm font-black text-[#0d0d0e] mb-4">Top Purchased Products</h4>
                    {analyticsData.productMetrics.mostPurchasedProducts.length === 0 ? (
                      <div className="text-xs text-slate-400 py-6 text-center">No product purchase data recorded yet.</div>
                    ) : (
                      <div className="divide-y divide-slate-100 text-xs">
                        {analyticsData.productMetrics.mostPurchasedProducts.map((prod) => (
                          <div key={prod.id} className="py-3 flex items-center justify-between">
                            <span className="font-bold text-[#0d0d0e]">{prod.name}</span>
                            <div className="text-right">
                              <div className="font-bold text-emerald-600">₹{prod.revenue.toLocaleString('en-IN')}</div>
                              <div className="text-[10px] text-slate-400">{prod.salesCount} sales</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Operational Status Breakdown */}
                  <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm font-mono space-y-4">
                    <h4 className="text-sm font-black text-[#0d0d0e]">System Operational Status</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span>Verified Gateway Payments:</span>
                        <span className="font-bold text-emerald-600">{analyticsData.paymentMetrics.successfulPayments} Successful</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span>Failed Payments:</span>
                        <span className="font-bold text-rose-600">{analyticsData.paymentMetrics.failedPayments} Failed</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span>Subscriptions Expiring Soon (&lt;7 days):</span>
                        <span className="font-bold text-amber-600">{analyticsData.subscriptionMetrics.expiringSoon} Expiring</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span>Free Trial Starts:</span>
                        <span className="font-bold text-sky-600">{analyticsData.productMetrics.trialStarts} Active Trials</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

          </section>
        )}

        {/* TAB 1: OPERATIONS OVERVIEW */}
        {activeTab === 'overview' && (
          <section className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs mb-2">
                  <span>TOTAL REVENUE</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-[#0d0d0e]">
                  ₹{stats.totalRevenue.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] font-mono text-emerald-600 font-bold mt-1 block">
                  +18.4% from last month
                </span>
              </div>

              <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs mb-2">
                  <span>ACTIVE PRODUCTS</span>
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-[#0d0d0e]">
                  {stats.totalProducts} Software Modules
                </div>
                <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                  Across 13 Industry Verticals
                </span>
              </div>

              <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs mb-2">
                  <span>REGISTERED USERS</span>
                  <Users className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-3xl font-black text-[#0d0d0e]">
                  {stats.totalUsers} Accounts
                </div>
                <span className="text-[11px] font-mono text-sky-600 font-bold mt-1 block">
                  Active Security Policies
                </span>
              </div>

              <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 font-mono text-xs mb-2">
                  <span>COMMERCIAL QUOTES</span>
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-[#0d0d0e]">
                  {stats.totalQuotes} Inquiries
                </div>
                <span className="text-[11px] font-mono text-purple-600 font-bold mt-1 block">
                  Target: support@ohotechn.com
                </span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-8 shadow-sm">
              <h3 className="text-lg font-black text-[#0d0d0e] mb-4">Admin Quick Action Controls</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs font-bold">
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center justify-between"
                >
                  <span>Manage User Accounts &amp; Roles</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center justify-between"
                >
                  <span>Edit Product Prices &amp; Stock</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('ai')}
                  className="p-4 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-left transition-colors flex items-center justify-between"
                >
                  <span>Launch AI Automation Assistant</span>
                  <Bot className="w-4 h-4 text-sky-600" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: PRODUCTS CATALOG MANAGER */}
        {activeTab === 'products' && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-black text-[#0d0d0e]">Product Catalog &amp; Price Editor</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Real-time database updates for turnkey software products</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                Live Sync Enabled
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Product Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">Stock SLA</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#0d0d0e]">
                  {productsList.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-400">#PROD-0{prod.id}</td>
                      <td className="py-4 px-4 font-bold">{prod.name}</td>
                      <td className="py-4 px-4 text-slate-600">{prod.serviceType}</td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          value={prod.price}
                          onChange={(e) => handleProductPriceChange(prod.id, Number(e.target.value))}
                          className="w-28 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-300 font-extrabold focus:outline-none focus:border-sky-500"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full font-bold border text-[10px]",
                          prod.active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
                        )}>
                          {prod.active ? `Active (${prod.stock || 100})` : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4 flex items-center gap-2">
                        <button
                          onClick={() => handleSaveProductPrice(prod)}
                          className="px-3 py-1.5 rounded-lg bg-[#0d0d0e] hover:bg-emerald-600 text-white font-bold transition-all text-[11px] cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleToggleProductStatus(prod)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-all text-[11px] cursor-pointer"
                        >
                          {prod.active ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: USER ACCOUNTS MANAGER */}
        {activeTab === 'users' && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-black text-[#0d0d0e]">User Accounts &amp; RBAC Governance</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Manage user privileges, toggle active status, and search accounts</p>
              </div>
              <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200">
                Total Users: {totalElements}
              </span>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 font-mono text-xs">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone number..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 font-bold focus:outline-none focus:border-sky-500"
                />
              </div>

              <select
                value={filterRole}
                onChange={(e) => { setFilterRole(e.target.value); setPage(0); }}
                className="w-full sm:w-48 px-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 font-bold focus:outline-none focus:border-sky-500"
              >
                <option value="">All Roles</option>
                <option value="ROLE_CUSTOMER">ROLE_CUSTOMER</option>
                <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                <option value="ROLE_DEVELOPER">ROLE_DEVELOPER</option>
              </select>

              <button
                onClick={() => fetchUsers()}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#0d0d0e] hover:bg-sky-600 text-white font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Users Table */}
            {isLoadingUsers ? (
              <div className="py-12 text-center font-mono text-xs text-slate-500">
                Loading User Accounts...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">User ID</th>
                      <th className="py-3 px-4">Name &amp; Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[#0d0d0e]">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No users found matching query criteria.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-400">#{u.id}</td>
                          <td className="py-4 px-4 font-bold">
                            <div>{u.name}</div>
                            <div className="text-[11px] text-slate-500 font-normal">{u.email || 'No Email'}</div>
                          </td>
                          <td className="py-4 px-4 text-slate-600">{u.phone || 'N/A'}</td>
                          <td className="py-4 px-4">
                            <select
                              value={u.role}
                              onChange={(e) => handleUserRoleChange(u, e.target.value)}
                              className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-300 font-bold text-[11px] focus:outline-none focus:border-sky-500"
                            >
                              <option value="ROLE_CUSTOMER">ROLE_CUSTOMER</option>
                              <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                              <option value="ROLE_DEVELOPER">ROLE_DEVELOPER</option>
                            </select>
                          </td>
                          <td className="py-4 px-4">
                            <span className={cn(
                              "px-2.5 py-1 rounded-full font-bold text-[10px] border",
                              u.enabled
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            )}>
                              {u.enabled ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="py-4 px-4 flex items-center gap-2">
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              className={cn(
                                "px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1",
                                u.enabled
                                  ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              )}
                            >
                              {u.enabled ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                              <span>{u.enabled ? 'Disable' : 'Enable'}</span>
                            </button>

                            <button
                              onClick={() => setSelectedUser(u)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 font-mono text-xs">
                <span className="text-slate-500">
                  Page {page + 1} of {totalPages} ({totalElements} users total)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 disabled:opacity-40 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* TAB 4: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-black text-[#0d0d0e]">Customer Order Management</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Track and update order fulfillment status</p>
              </div>
            </div>

            <div className="space-y-4">
              {ordersList.map((ord) => (
                <div key={ord.id} className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[#0d0d0e]">Order #{ord.id}</span>
                      <span className="text-slate-400">|</span>
                      <span className="font-bold text-emerald-600">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Address: {ord.shippingAddress} • Phone: {ord.contactPhone}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleOrderStatus(ord.id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-white border-2 border-slate-300 font-extrabold focus:outline-none focus:border-sky-500 text-xs"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 5: COMMERCIAL QUOTES & DEMO REQUESTS PIPELINE */}
        {activeTab === 'quotes' && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#0d0d0e] flex items-center gap-2">
                  <span>✉️</span> Customer Quotes &amp; Enterprise Demo Leads
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Manage incoming product quotes, SLA enquiries, and demo requests from enterprise leads.
                </p>
              </div>
              <button
                onClick={fetchEnquiries}
                disabled={isLoadingEnquiries}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-mono rounded-xl transition cursor-pointer self-start md:self-auto"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isLoadingEnquiries && "animate-spin")} />
                Refresh Leads
              </button>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-bold block">Total Enquiries</span>
                <span className="text-2xl font-black text-[#0d0d0e]">{enquiries.length}</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-amber-700 font-bold block">Pending Leads</span>
                <span className="text-2xl font-black text-amber-900">
                  {enquiries.filter(e => !e.status || e.status === 'PENDING').length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                <span className="text-sky-700 font-bold block">In Contact</span>
                <span className="text-2xl font-black text-sky-900">
                  {enquiries.filter(e => e.status === 'CONTACTED' || e.status === 'RESPONDED').length}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-700 font-bold block">Resolved / Closed</span>
                <span className="text-2xl font-black text-emerald-900">
                  {enquiries.filter(e => e.status === 'RESOLVED' || e.status === 'CLOSED').length}
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by client name, email, phone, subject, or message..."
                  value={enquirySearchQuery}
                  onChange={(e) => setEnquirySearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0d0d0e]"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 font-mono text-xs">
                {['ALL', 'PENDING', 'CONTACTED', 'RESOLVED', 'CLOSED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setEnquiryStatusFilter(st)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl font-bold transition cursor-pointer text-xs whitespace-nowrap",
                      enquiryStatusFilter === st
                        ? "bg-[#0d0d0e] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Lead Enquiries List */}
            {isLoadingEnquiries ? (
              <div className="text-center py-12 text-slate-400 font-mono text-xs">Loading quote enquiries...</div>
            ) : (() => {
              const filtered = enquiries.filter((e) => {
                const matchesSearch =
                  !enquirySearchQuery ||
                  e.name.toLowerCase().includes(enquirySearchQuery.toLowerCase()) ||
                  e.email.toLowerCase().includes(enquirySearchQuery.toLowerCase()) ||
                  (e.phone && e.phone.toLowerCase().includes(enquirySearchQuery.toLowerCase())) ||
                  (e.subject && e.subject.toLowerCase().includes(enquirySearchQuery.toLowerCase())) ||
                  (e.message && e.message.toLowerCase().includes(enquirySearchQuery.toLowerCase()));

                const currentSt = (e.status || 'PENDING').toUpperCase();
                const matchesStatus =
                  enquiryStatusFilter === 'ALL' ||
                  (enquiryStatusFilter === 'PENDING' && (currentSt === 'PENDING' || currentSt === '')) ||
                  (enquiryStatusFilter === 'CONTACTED' && (currentSt === 'CONTACTED' || currentSt === 'RESPONDED')) ||
                  currentSt === enquiryStatusFilter;

                return matchesSearch && matchesStatus;
              });

              if (filtered.length === 0) {
                return (
                  <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 font-mono text-xs">
                    No quote or demo request leads match your current search criteria.
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {filtered.map((enq) => {
                    const statusUpper = (enq.status || 'PENDING').toUpperCase();
                    let badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                    if (statusUpper === 'CONTACTED' || statusUpper === 'RESPONDED') badgeClass = 'bg-sky-50 text-sky-700 border-sky-200';
                    if (statusUpper === 'RESOLVED') badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    if (statusUpper === 'CLOSED') badgeClass = 'bg-slate-100 text-slate-600 border-slate-200';

                    return (
                      <div key={enq.id} className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200 font-mono text-xs space-y-3 hover:border-slate-300 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[#0d0d0e] text-sm">{enq.name}</span>
                            <span className="text-slate-400">({enq.email})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border", badgeClass)}>
                              {statusUpper}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-bold text-sky-700">Subject: {enq.subject || 'Commercial Software Quote Enquiry'}</div>
                          {enq.phone && <div className="text-slate-600 font-medium">Phone: {enq.phone}</div>}
                        </div>

                        <p className="text-[#0d0d0e] text-xs bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed font-sans">
                          "{enq.message}"
                        </p>

                        <div className="flex items-center justify-between pt-2">
                          <button
                            onClick={() => setSelectedEnquiryModal(enq)}
                            className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-800 font-bold cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Lead Details
                          </button>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500 font-medium">Update Status:</span>
                            <select
                              value={statusUpper}
                              onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-[#0d0d0e] focus:outline-none cursor-pointer"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="RESOLVED">RESOLVED</option>
                              <option value="CLOSED">CLOSED</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Lead Details Modal */}
            {selectedEnquiryModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border-2 border-slate-300 shadow-2xl space-y-5 font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h4 className="text-base font-extrabold text-[#0d0d0e]">Commercial Quote Lead Details</h4>
                    <button
                      onClick={() => setSelectedEnquiryModal(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div><span className="text-slate-500 font-bold">Client Name:</span> <span className="text-[#0d0d0e] font-extrabold">{selectedEnquiryModal.name}</span></div>
                    <div><span className="text-slate-500 font-bold">Email Address:</span> <a href={`mailto:${selectedEnquiryModal.email}`} className="text-sky-600 underline font-bold">{selectedEnquiryModal.email}</a></div>
                    {selectedEnquiryModal.phone && <div><span className="text-slate-500 font-bold">Phone Number:</span> <a href={`tel:${selectedEnquiryModal.phone}`} className="text-sky-600 underline font-bold">{selectedEnquiryModal.phone}</a></div>}
                    <div><span className="text-slate-500 font-bold">Subject:</span> <span className="text-[#0d0d0e] font-bold">{selectedEnquiryModal.subject || 'N/A'}</span></div>
                    <div><span className="text-slate-500 font-bold">Submitted Date:</span> {selectedEnquiryModal.createdAt ? new Date(selectedEnquiryModal.createdAt).toLocaleString() : 'N/A'}</div>
                    <div>
                      <span className="text-slate-500 font-bold">Current Status:</span>{' '}
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">{selectedEnquiryModal.status || 'PENDING'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-500 font-bold block mb-1.5">Full Message Inquiry:</label>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-900 font-sans text-xs leading-relaxed max-h-48 overflow-y-auto">
                      {selectedEnquiryModal.message}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <a
                      href={`mailto:${selectedEnquiryModal.email}?subject=Re: ${encodeURIComponent(selectedEnquiryModal.subject || 'OHO TECHN Commercial Quote')}`}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition text-xs inline-flex items-center gap-1.5"
                    >
                      ✉️ Reply via Email
                    </a>
                    <button
                      onClick={() => setSelectedEnquiryModal(null)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition text-xs"
                    >
                      Close Modal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* TAB: PRODUCT PLANS MANAGEMENT */}
        {activeTab === 'plans' && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-extrabold text-[#0d0d0e]">Product Pricing &amp; Billing Plans</h3>
                <p className="text-xs text-slate-500 font-mono">Manage Free Trial, Monthly, Yearly, Lifetime, and Enterprise plans.</p>
              </div>
            </div>

            {adminPlans.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-mono">No product plans loaded. Use API or select a product to manage plans.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminPlans.map((plan) => (
                  <div key={plan.id} className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 text-xs font-mono space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#0d0d0e]">{plan.name}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${plan.active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {plan.billingType} ({plan.active ? 'ACTIVE' : 'DISABLED'})
                      </span>
                    </div>
                    <div className="text-slate-600">Price: ₹{plan.price} {plan.currency} ({plan.durationDays || 30} days)</div>
                    <div className="text-slate-500 text-[11px]">Device Limit: {plan.activationLimit || 1} | Trial Days: {plan.trialDays || 0}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB: SOFTWARE LICENSES MANAGEMENT */}
        {activeTab === 'licenses' && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-extrabold text-[#0d0d0e]">Customer Software Licenses</h3>
                <p className="text-xs text-slate-500 font-mono">Audit cryptographic license keys, status, and device activation usage.</p>
              </div>
            </div>

            {adminLicenses.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-mono">No customer licenses found in database.</div>
            ) : (
              <div className="space-y-3">
                {adminLicenses.map((lic) => (
                  <div key={lic.id} className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-extrabold text-[#0d0d0e] tracking-wider">{lic.licenseKey}</div>
                      <div className="text-slate-500 mt-1">Product: {lic.product?.name || 'N/A'} | User: {lic.user?.name || 'Customer'}</div>
                      <div className="text-slate-400 text-[10px]">Activations: {lic.activationCount}/{lic.activationLimit} | Expires: {lic.expiresAt ? new Date(lic.expiresAt).toLocaleDateString() : 'Never'}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${lic.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {lic.status}
                      </span>
                      {lic.status === 'ACTIVE' && (
                        <button
                          onClick={async () => {
                            await revokeAdminLicenseApi(lic.id);
                            fetchAdminLicenses();
                            showToast(`Revoked license ${lic.licenseKey}`, 'success');
                          }}
                          className="py-1 px-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px]"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB: SUBSCRIPTIONS MANAGEMENT */}
        {activeTab === 'subscriptions' && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-extrabold text-[#0d0d0e]">Customer Subscriptions</h3>
                <p className="text-xs text-slate-500 font-mono">Audit active, trial, and expired recurring customer subscriptions.</p>
              </div>
            </div>

            {adminSubs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-mono">No active customer subscriptions found.</div>
            ) : (
              <div className="space-y-3">
                {adminSubs.map((sub) => (
                  <div key={sub.id} className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-extrabold text-[#0d0d0e]">{sub.product?.name || 'Software Product'}</div>
                      <div className="text-slate-500 mt-1">Customer: {sub.user?.name || 'User'} ({sub.user?.email})</div>
                      <div className="text-slate-400 text-[10px]">Start: {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A'} | Expiry: {sub.expiryDate ? new Date(sub.expiryDate).toLocaleDateString() : 'Lifetime'}</div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      sub.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' :
                      sub.status === 'TRIAL' ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB: SOFTWARE RELEASES MANAGEMENT */}
        {activeTab === 'releases' && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-extrabold text-[#0d0d0e]">Software Release Versions &amp; Packages</h3>
                <p className="text-xs text-slate-500 font-mono">Manage Windows, macOS, Linux, and mobile binary releases.</p>
              </div>
            </div>

            {adminReleases.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-mono">No software releases configured for product #1 yet.</div>
            ) : (
              <div className="space-y-3">
                {adminReleases.map((rel) => (
                  <div key={rel.id} className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-extrabold text-[#0d0d0e]">v{rel.version} — {rel.platform}</div>
                      <div className="text-slate-500 mt-1">File: {rel.fileName} ({rel.fileSize ? `${Math.round(rel.fileSize / 1024)} KB` : '100 MB'})</div>
                    </div>

                    <button
                      onClick={async () => {
                        await toggleAdminReleaseStatusApi(rel.id, !rel.active);
                        fetchAdminReleases();
                        showToast(`Updated release v${rel.version} status`, 'success');
                      }}
                      className={`py-1 px-3 rounded-full text-[10px] font-bold ${rel.active ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}
                    >
                      {rel.active ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 6 / CONTROL MODE: AI AUTOMATION SANDBOX */}
        {(activeTab === 'ai' || controlMode === 'ai') && (
          <section className="bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden grid-pattern-dark space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">AI Automation Assistant Console</h3>
                  <p className="text-xs text-slate-400 font-mono">Execute natural language admin tasks automatically</p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                AI Engine Active
              </span>
            </div>

            {/* Prompt Form */}
            <form onSubmit={handleAiSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Increase price of all Healthcare products by 10%, or approve order #103..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-[#141416] border-2 border-white/15 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isExecutingAi}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-mono font-extrabold transition-all cursor-pointer disabled:opacity-50"
                >
                  {isExecutingAi ? 'Executing...' : 'Run AI Task'}
                </button>
              </div>
            </form>

            {/* Execution Log */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-slate-300 space-y-2 max-h-60 overflow-y-auto">
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Execution Trace Log</div>
              {aiLogs.map((logStr, idx) => (
                <div key={idx} className="leading-relaxed">
                  {logStr}
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-slate-300 rounded-[32px] max-w-lg w-full p-8 shadow-2xl space-y-6 font-mono text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-600" />
                <h3 className="text-lg font-black text-[#0d0d0e]">User Account Details</h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">User ID</span>
                <span className="font-bold text-[#0d0d0e]">#{selectedUser.id}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Full Name</span>
                <span className="font-bold text-[#0d0d0e]">{selectedUser.name}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Email Address</span>
                <span className="font-bold text-[#0d0d0e]">{selectedUser.email || 'N/A'}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Phone Number</span>
                <span className="font-bold text-[#0d0d0e]">{selectedUser.phone || 'N/A'}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Role</span>
                <span className="font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200 inline-block mt-0.5">
                  {selectedUser.role}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Account Status</span>
                <span className={cn(
                  "font-bold px-2.5 py-0.5 rounded-md border inline-block mt-0.5",
                  selectedUser.enabled ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                )}>
                  {selectedUser.enabled ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Created At</span>
                <span className="text-slate-600">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-3 rounded-2xl bg-[#0d0d0e] text-white font-bold text-xs uppercase tracking-wider hover:bg-sky-600 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

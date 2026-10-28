'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Package, Key, Repeat, Download, ArrowRight, ShieldCheck, Clock, 
  CreditCard, Sparkles, CheckCircle2, Headphones, Copy, Check, 
  MessageSquare, AlertCircle, ChevronRight, Laptop, FileText, 
  Loader2, Activity, Plus, ShoppingBag, ExternalLink, Calendar as CalendarIcon, LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMyEntitledProductsApi } from '@/api/releases';
import { getMyLicensesApi } from '@/api/licenses';
import { getMySubscriptionsApi } from '@/api/subscriptions';
import { getMyOrdersApi, downloadOrderInvoiceApi } from '@/api/orders';
import { getMyCustomerTicketsApi } from '@/api/support';
import { ProductDto, License, Subscription, Order, SupportTicketDto, OrderStatus } from '@/api/types';
import { formatInr } from '@/utils/cartUtils';
import { 
  DashboardShell,
  V15MetricCard, 
  V15AccentActionCard,
  V15PerformanceChart,
  V15Card, 
  V15Sparkline, 
  V15CalendarWidget, 
  V15ActivityTimeline, 
  V15ActivityItem,
  V15CircularGauge,
  V15StaggerContainer,
  V15StaggerItem
} from '@/components/dashboard/V15DashboardPrimitives';

export default function CustomerDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [products, setProducts] = React.useState<ProductDto[]>([]);
  const [licenses, setLicenses] = React.useState<License[]>([]);
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [tickets, setTickets] = React.useState<SupportTicketDto[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!user) return;
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [prodRes, licRes, subRes, ordRes, tckRes] = await Promise.all([
          getMyEntitledProductsApi().catch(() => ({ success: false, data: [] })),
          getMyLicensesApi().catch(() => ({ success: false, data: [] })),
          getMySubscriptionsApi().catch(() => ({ success: false, data: [] })),
          getMyOrdersApi().catch(() => ({ success: false, data: [] })),
          getMyCustomerTicketsApi().catch(() => ({ success: false, data: [] })),
        ]);

        if (prodRes.success && prodRes.data) setProducts(prodRes.data);
        if (licRes.success && licRes.data) setLicenses(licRes.data);
        if (subRes.success && subRes.data) setSubscriptions(subRes.data);
        if (ordRes.success && ordRes.data) setOrders(ordRes.data);
        if (tckRes.success && tckRes.data) setTickets(tckRes.data);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  const handleCopyKey = (key: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(key);
      setCopiedKey(key);
      showToast('License key copied to clipboard', 'info');
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleDownloadInvoice = async (orderId: number) => {
    setDownloadingInvoiceId(orderId);
    try {
      const blob = await downloadOrderInvoiceApi(orderId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-order-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast(`Invoice PDF downloaded for Order #${orderId}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to download invoice PDF', 'error');
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PAID':
      case 'CONFIRMED':
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SHIPPED':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'PENDING':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  // Real Chronological Activity Feed Derived From Customer Transactions
  const activityTimelineItems: V15ActivityItem[] = React.useMemo(() => {
    const list: V15ActivityItem[] = [];

    orders.forEach((o) => {
      if (o.createdAt) {
        list.push({
          id: `ord-${o.id}`,
          title: `Order #${o.id} - ${formatInr(o.totalAmount)}`,
          subtitle: `Fulfillment status: ${o.status}`,
          timestamp: new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          icon: CreditCard,
          iconColor: o.status === 'PAID' ? 'text-emerald-600' : 'text-orange-500',
          badge: (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getOrderStatusBadge(o.status)}`}>
              {o.status}
            </span>
          ),
        });
      }
    });

    licenses.forEach((lic) => {
      const dateStr = lic.createdAt || lic.issuedAt;
      if (dateStr) {
        list.push({
          id: `lic-${lic.id}`,
          title: `License: ${lic.product?.name || 'Software'}`,
          subtitle: `${lic.activationCount} / ${lic.activationLimit} Seats · ${lic.status}`,
          timestamp: new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          icon: Key,
          iconColor: 'text-emerald-600',
          badge: (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {lic.status}
            </span>
          ),
        });
      }
    });

    tickets.forEach((t) => {
      if (t.createdAt) {
        list.push({
          id: `tck-${t.id}`,
          title: `Ticket: ${t.ticketCode}`,
          subtitle: t.subject,
          timestamp: new Date(t.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
          icon: Headphones,
          iconColor: 'text-sky-600',
          badge: (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
              {t.status}
            </span>
          ),
        });
      }
    });

    return list.slice(0, 5);
  }, [orders, licenses, tickets]);

  // Order spending trend sparkline points
  const orderSpendLabels = React.useMemo(() => {
    if (orders.length >= 2) {
      return orders
        .map((o) =>
          o.createdAt
            ? new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
            : "Order"
        )
        .reverse();
    }
    return ["Initial", "Setup", "Expansion", "Enterprise"];
  }, [orders]);
  const orderSpendPoints = React.useMemo(() => {
    if (orders.length >= 2) {
      return orders.map((o) => Number(o.totalAmount || 0)).reverse();
    }
    const sum = orders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0);
    return [0, sum > 0 ? sum : 500];
  }, [orders]);

  if (!user) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border border-slate-200/90 rounded-2xl p-8 text-center shadow-xs">
          <Package className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Sign In Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please sign in to access your platform dashboard.</p>
          <Link href="/login" className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const activeLicensesCount = licenses.filter(l => l.status === 'ACTIVE').length;
  const activeSubsCount = subscriptions.filter(s => s.status === 'ACTIVE' || s.status === 'TRIAL').length;
  const openTicketsCount = tickets.filter(t => t.status === 'NEW' || t.status === 'OPEN').length;
  const inProgressTicketsCount = tickets.filter(t => t.status === 'IN_PROGRESS' || t.status === 'ON_HOLD').length;
  const activeTicketsCount = openTicketsCount + inProgressTicketsCount;

  return (
    <DashboardShell className="pb-16 font-sans">
      {/* V15 Customer Command Top Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_1px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-xs shadow-md hover:scale-105 transition-transform">
                OH
              </div>
              <div>
                <span className="text-sm font-black tracking-tight text-slate-900">OHO TECH</span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600">
                  PORTAL
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>

            <Link
              href="/products"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Package className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Browse Products</span>
            </Link>

            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto pt-6 px-3 sm:px-6 lg:px-8" id="customer-dashboard-main">
        
        {/* Welcome Header with V15 Aesthetics */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              CUSTOMER PLATFORM COMMAND CENTER
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Manage your software entitlements, active license keys, subscription renewals, and support queries.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 shrink-0">
            <Link 
              href="/support" 
              className="px-4 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Headphones className="w-3.5 h-3.5 text-orange-600" />
              Support Desk
            </Link>
            <Link 
              href="/my-products" 
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5 text-orange-400" />
              My Products
            </Link>
            <Link 
              href="/downloads" 
              className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition-all shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Downloads
            </Link>
          </div>
        </div>

        {/* Quick Actions Filter Toolbar */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-[20px] p-2 sm:p-2.5 mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 shrink-0">
            Shortcuts:
          </span>
          <Link
            href="/my-products"
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5 text-slate-500" />
            <span>My Products</span>
          </Link>
          <Link
            href="/downloads"
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Downloads</span>
          </Link>
          <Link
            href="/licenses"
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-slate-500" />
            <span>Licenses &amp; Devices</span>
          </Link>
          <Link
            href="/orders"
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            <span>Order History</span>
          </Link>
          <Link
            href="/support"
            className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-orange-600" />
            <span>New Support Query</span>
          </Link>
        </div>

        {/* Primary Metrics Grid (V15 Cards) */}
        <V15StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <V15MetricCard
            label="Owned Products"
            value={products.length}
            subvalue="Catalog modules"
            icon={Package}
            accentColor="orange"
          />
          <V15MetricCard
            label="Active Keys"
            value={activeLicensesCount}
            subvalue="Authoritative licenses"
            icon={Key}
            accentColor="emerald"
          />
          <V15MetricCard
            label="Subscriptions"
            value={activeSubsCount}
            subvalue="Active recurring plans"
            icon={Repeat}
            accentColor="purple"
          />
          <V15MetricCard
            label="Total Orders"
            value={orders.length}
            subvalue="Commercial invoices"
            icon={CreditCard}
            accentColor="blue"
          />
          <V15MetricCard
            label="Support Queries"
            value={activeTicketsCount}
            subvalue={`${tickets.length} total tickets`}
            icon={Headphones}
            accentColor="neutral"
          />
        </V15StaggerContainer>

                {/* V15 Dual Column: Customer Spending Trajectory + Vibrant Orange Action Accent Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <V15PerformanceChart
              title="Procurement & Spending Velocity"
              subtitle="Chronological transaction amounts across licensed software modules"
              primaryData={orderSpendPoints.length >= 2 ? orderSpendPoints : [0, 500, 1200, 2400]}
              secondaryData={[0, 400, 800, 1500]}
              labels={orderSpendLabels}
              activeTimeframe="Overview"
              timeframes={['30 Days', 'Quarter', 'Yearly', 'Overview']}
            />
          </div>

          <V15AccentActionCard
            title="Dedicated Support Desk"
            subtitle="Need engineering assistance or deployment troubleshooting? Reach certified engineers directly."
            buttonText="Open Support Query"
            badge="Engineering Support"
            metricValue={activeTicketsCount}
            metricLabel="Active Support Inquiries"
            icon={Headphones}
            onAction={() => {
              window.location.href = '/support';
            }}
          />
        </div>

                {/* Visual Analytics & Velocity Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Entitlement Health Circular Gauge */}
          {(() => {
            const totalEntitlements = products.length + activeLicensesCount + activeSubsCount;
            const hasActiveEntitlement = totalEntitlements > 0;

            return (
              <V15CircularGauge
                title="Entitlement Authorization"
                subtitle="Software license & SLA status"
                value={hasActiveEntitlement ? 100 : 0}
                displayValue={hasActiveEntitlement ? 'Active' : 'Inactive'}
                label={hasActiveEntitlement ? 'Verified' : 'No Licenses'}
                primaryColor={hasActiveEntitlement ? '#10b981' : '#94a3b8'}
                metrics={[
                  { label: 'Licensed Products', value: products.length, color: '#ea580c' },
                  { label: 'Active Keys', value: activeLicensesCount, color: '#10b981' },
                  { label: 'Subscriptions', value: activeSubsCount, color: '#8b5cf6' },
                  { label: 'Engineering SLA', value: hasActiveEntitlement ? 'Active' : 'Standard Tier', color: '#0ea5e9' },
                ]}
              />
            );
          })()}

          {/* Order Spend Velocity Sparkline */}
          <V15Card
            title="Spending Velocity"
            subtitle="Recent order amounts sequence"
            actions={
              <Link href="/orders" className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline">
                View Ledger →
              </Link>
            }
          >
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-bold text-slate-900">
                    {formatInr(orders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0))}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Total platform purchases</p>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {orders.length} Invoices
                </span>
              </div>
              <div className="pt-2">
                <V15Sparkline data={orderSpendPoints} color="#ea580c" />
              </div>
            </div>
          </V15Card>

          {/* Operational Calendar Widget */}
          <V15CalendarWidget
            selectedDate={new Date()}
            events={orders.map((o) => ({
              day: o.createdAt ? new Date(o.createdAt).getDate() : new Date().getDate(),
              count: 1,
            }))}
          />
        </div>

        
        {/* Chronological Activity Feed */}
        <div className="mb-8">
          <V15Card
            title="Recent Activity"
            subtitle="Latest orders, licenses & support events"
          >
            <V15ActivityTimeline items={activityTimelineItems} />
          </V15Card>
        </div>

        {/* Active Software Licenses Snippet */}
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-[22px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-8">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-orange-600" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Active Software Licenses</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Authoritative activation keys and hardware activation limits.</p>
            </div>
            <Link href="/licenses" className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              Manage Devices <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 animate-pulse space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-8 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : licenses.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl bg-slate-50/60 border border-dashed border-slate-200">
              <Key className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No software licenses assigned yet</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                Purchasing software solutions or subscribing to plans instantly provisions cryptographic keys.
              </p>
              <Link href="/products" className="mt-3 inline-block px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs">
                Browse Solutions
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {licenses.slice(0, 4).map((lic) => {
                const isCopied = copiedKey === lic.licenseKey;
                return (
                  <div key={lic.id} className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-orange-200 hover:shadow-xs transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{lic.product?.name || 'Software License'}</h4>
                        <span className="text-[10px] font-mono text-slate-500">{lic.productPlan?.name || 'Commercial Edition'}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${lic.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                        {lic.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 mb-2.5">
                      <span className="truncate select-all">{lic.licenseKey}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyKey(lic.licenseKey)}
                        className="p-1 rounded hover:bg-white text-slate-500 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
                        title="Copy Key"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Laptop className="w-3 h-3 text-slate-400" />
                        {lic.activationCount} / {lic.activationLimit} Seats
                      </span>
                      <Link href="/licenses" className="font-semibold text-orange-600 hover:underline">
                        Manage Seats →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dual Column: Recent Orders & Support Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Recent Orders Section with Direct Invoice Download */}
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-[22px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-600" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Recent Purchases</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Purchases &amp; commercial tax invoices.</p>
              </div>
              <Link href="/orders" className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                All Orders <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 animate-pulse space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs font-medium">
                No orders placed yet. Browse the catalog to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => {
                  const dateStr = order.createdAt 
                    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Recent';
                  const isDownloading = downloadingInvoiceId === order.id;

                  return (
                    <div key={order.id} className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900">Order #{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getOrderStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {dateStr} · {order.items?.length || 1} item(s) · <span className="font-bold text-slate-900">{formatInr(order.totalAmount)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                        {order.status === 'PAID' && (
                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(order.id)}
                            disabled={isDownloading}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 text-[11px] font-medium flex items-center gap-1 shadow-2xs cursor-pointer disabled:opacity-50"
                          >
                            {isDownloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3 text-orange-600" />}
                            <span>Invoice</span>
                          </button>
                        )}
                        <Link
                          href="/orders"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-medium hover:bg-slate-800 transition-colors shadow-2xs"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Support Queries Section */}
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-[22px] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-orange-600" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Technical Support</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Authoritative tickets &amp; direct engineering resolution.</p>
              </div>
              <Link href="/support" className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                Support Desk <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 animate-pulse space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs font-medium">
                No active support queries. Open a query anytime you need technical guidance.
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.slice(0, 3).map((ticket) => (
                  <div key={ticket.id} className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{ticket.ticketCode}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs">{ticket.subject}</p>
                    </div>

                    <Link
                      href={`/support?ticketId=${ticket.id}`}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-medium hover:bg-slate-800 transition-colors shadow-2xs shrink-0"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </DashboardShell>
  );
}

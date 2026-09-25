'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Package, Key, Repeat, Download, ArrowRight, ShieldCheck, Clock, 
  CreditCard, Sparkles, CheckCircle2, Headphones, Copy, Check, 
  MessageSquare, AlertCircle, ChevronRight, Laptop, FileText, 
  Loader2, Activity, Plus, ShoppingBag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMyEntitledProductsApi } from '@/api/releases';
import { getMyLicensesApi } from '@/api/licenses';
import { getMySubscriptionsApi } from '@/api/subscriptions';
import { getMyOrdersApi, downloadOrderInvoiceApi } from '@/api/orders';
import { getMyCustomerTicketsApi } from '@/api/support';
import { ProductDto, License, Subscription, Order, SupportTicketDto, OrderStatus, TicketStatus } from '@/api/types';
import { formatInr } from '@/utils/cartUtils';

interface ActivityItem {
  id: string;
  type: 'ORDER' | 'LICENSE' | 'TICKET';
  title: string;
  subtitle: string;
  date: Date;
  link: string;
}

export default function CustomerDashboardPage() {
  const { user } = useAuth();
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

  const getTicketStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'RESOLVED':
      case 'CLOSED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'IN_PROGRESS':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'ON_HOLD':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'NEW':
      case 'OPEN':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Package className="w-12 h-12 text-sky-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Sign In Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please sign in to access your platform dashboard.</p>
          <Link href="/login" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block hover:bg-slate-800 transition-colors">
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

  // Real Chronological Activity Derived From Actual Records
  const realActivities: ActivityItem[] = React.useMemo(() => {
    const list: ActivityItem[] = [];

    orders.forEach((o) => {
      if (o.createdAt) {
        list.push({
          id: `ord-${o.id}`,
          type: 'ORDER',
          title: `Order #${o.id} Created`,
          subtitle: `${formatInr(o.totalAmount)} • Status: ${o.status}`,
          date: new Date(o.createdAt),
          link: '/orders',
        });
      }
    });

    licenses.forEach((lic) => {
      const dateStr = lic.createdAt || lic.issuedAt;
      if (dateStr) {
        list.push({
          id: `lic-${lic.id}`,
          type: 'LICENSE',
          title: `License Activated (${lic.product?.name || 'Software'})`,
          subtitle: `${lic.activationCount} / ${lic.activationLimit} Seats • ${lic.status}`,
          date: new Date(dateStr),
          link: '/licenses',
        });
      }
    });

    tickets.forEach((t) => {
      if (t.createdAt) {
        list.push({
          id: `tck-${t.id}`,
          type: 'TICKET',
          title: `Support Ticket ${t.ticketCode}`,
          subtitle: `${t.subject} (${t.status})`,
          date: new Date(t.createdAt),
          link: '/support',
        });
      }
    });

    return list.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  }, [orders, licenses, tickets]);

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-6xl w-full mx-auto" id="customer-dashboard-main">
        
        {/* Welcome Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              CUSTOMER PLATFORM COMMAND CENTER
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Manage your software entitlements, active license keys, subscription status, and support queries.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2 shrink-0">
            <Link href="/support" className="px-4 py-2.5 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors flex items-center gap-1.5 shadow-xs">
              <Headphones className="w-3.5 h-3.5" />
              Support Desk
            </Link>
            <Link href="/my-products" className="px-4 py-2.5 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors">
              My Products
            </Link>
            <Link href="/downloads" className="px-4 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs">
              <Download className="w-3.5 h-3.5" />
              Downloads
            </Link>
          </div>
        </div>

        {/* Quick Actions Toolbar */}
        <div className="bg-white border-2 border-slate-300 rounded-[24px] p-3 mb-6 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 shrink-0">
            Quick Actions:
          </span>
          <Link
            href="/my-products"
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5 text-sky-600" />
            <span>My Products</span>
          </Link>
          <Link
            href="/downloads"
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Downloads</span>
          </Link>
          <Link
            href="/licenses"
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-emerald-600" />
            <span>Licenses &amp; Devices</span>
          </Link>
          <Link
            href="/orders"
            className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold transition-colors shrink-0 flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-600" />
            <span>Order History</span>
          </Link>
          <Link
            href="/support"
            className="px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-mono font-bold transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-amber-600" />
            <span>New Support Query</span>
          </Link>
        </div>

        {/* Metrics Grid (5 cards with skeleton states) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white border-2 border-slate-200 rounded-[24px] p-4 animate-pulse space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-8 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-50 rounded w-full" />
              </div>
            ))
          ) : (
            <>
              <div className="bg-white border-2 border-slate-300 rounded-[24px] p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Owned Products</span>
                  <Package className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#0d0d0e]">{products.length}</div>
                <p className="text-[11px] text-slate-500 mt-1">Catalog modules</p>
              </div>

              <div className="bg-white border-2 border-slate-300 rounded-[24px] p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Active Keys</span>
                  <Key className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#0d0d0e]">{activeLicensesCount}</div>
                <p className="text-[11px] text-slate-500 mt-1">Active licenses</p>
              </div>

              <div className="bg-white border-2 border-slate-300 rounded-[24px] p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Subscriptions</span>
                  <Repeat className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#0d0d0e]">{activeSubsCount}</div>
                <p className="text-[11px] text-slate-500 mt-1">Recurring plans</p>
              </div>

              <div className="bg-white border-2 border-slate-300 rounded-[24px] p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
                  <CreditCard className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#0d0d0e]">{orders.length}</div>
                <p className="text-[11px] text-slate-500 mt-1">Invoices issued</p>
              </div>

              <div className="bg-white border-2 border-slate-300 rounded-[24px] p-4 sm:p-5 shadow-xs col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Support</span>
                  <Headphones className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#0d0d0e]">{activeTicketsCount}</div>
                <p className="text-[11px] text-slate-500 mt-1">{tickets.length} total queries</p>
              </div>
            </>
          )}
        </div>

        {/* Active Software Licenses Snippet */}
        <div className="bg-white border-2 border-slate-300 rounded-[28px] p-5 sm:p-7 shadow-xs mb-8">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-600" />
                <h2 className="text-lg font-black text-[#0d0d0e]">Active Software Licenses</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Your cryptographic activation keys and registered hardware seats.</p>
            </div>
            <Link href="/licenses" className="text-xs font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1">
              Manage Devices <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 animate-pulse space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-8 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : licenses.length === 0 ? (
            <div className="text-center py-6 px-4 rounded-2xl bg-slate-50 border border-slate-200">
              <Key className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No software licenses assigned yet</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                Purchasing any software solution or subscribing to a plan instantly provisions an authoritative activation key.
              </p>
              <Link href="/products" className="mt-3 inline-block px-4 py-2 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors">
                Browse Solutions
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {licenses.slice(0, 4).map((lic) => {
                const isCopied = copiedKey === lic.licenseKey;
                return (
                  <div key={lic.id} className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 hover:border-emerald-300 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-xs font-black text-[#0d0d0e]">{lic.product?.name || 'Software License'}</h4>
                        <span className="text-[10px] font-mono text-slate-500">{lic.productPlan?.name || 'Perpetual Commercial'}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${lic.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                        {lic.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-800 mb-2.5">
                      <span className="truncate select-all">{lic.licenseKey}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyKey(lic.licenseKey)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
                        title="Copy Key"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Laptop className="w-3 h-3 text-slate-400" />
                        {lic.activationCount} / {lic.activationLimit} Devices
                      </span>
                      <Link href="/licenses" className="font-bold text-sky-600 hover:underline">
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
          <div className="bg-white border-2 border-slate-300 rounded-[28px] p-5 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-sky-600" />
                  <h2 className="text-lg font-black text-[#0d0d0e]">Recent Orders</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Purchases &amp; commercial tax invoices.</p>
              </div>
              <Link href="/orders" className="text-xs font-mono font-bold text-sky-600 hover:underline flex items-center gap-1">
                All Orders <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 animate-pulse space-y-2">
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
                    <div key={order.id} className="p-3.5 rounded-2xl bg-[#fafafa] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-[#0d0d0e]">Order #{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getOrderStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {dateStr} • {order.items?.length || 1} item(s) • <span className="font-bold text-slate-900">{formatInr(order.totalAmount)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                        {order.status === 'PAID' && (
                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(order.id)}
                            disabled={isDownloading}
                            className="px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-[10px] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            title="Download PDF Invoice"
                          >
                            {isDownloading ? <Loader2 className="w-3 h-3 animate-spin text-slate-600" /> : <FileText className="w-3 h-3 text-slate-600" />}
                            <span>Invoice</span>
                          </button>
                        )}
                        <Link href="/orders" className="px-3 py-1.5 rounded-full bg-[#0d0d0e] text-white font-mono font-bold text-[11px] hover:bg-sky-600 transition-colors">
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Support Section with Open & Pending Counts */}
          <div className="bg-white border-2 border-slate-300 rounded-[28px] p-5 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-amber-600" />
                  <h2 className="text-lg font-black text-[#0d0d0e]">Support &amp; Inquiries</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Tickets, technical queries &amp; SLA resolution.</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/support" className="px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-mono font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  <span>New Query</span>
                </Link>
              </div>
            </div>

            {/* Support Summary Pills */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-center">
                <div className="text-lg font-black text-amber-900">{loading ? '...' : openTicketsCount}</div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700">Open Tickets</div>
              </div>
              <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/80 text-center">
                <div className="text-lg font-black text-sky-900">{loading ? '...' : inProgressTicketsCount}</div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700">In Progress</div>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 animate-pulse space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-5 px-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold text-slate-700">No active support tickets</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Need help deploying, activating a license, or configuring your software? Our engineering desk is on call.
                </p>
                <Link href="/support" className="mt-2.5 inline-block px-4 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors">
                  Create Support Ticket
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {tickets.slice(0, 3).map((ticket) => {
                  const dateStr = ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                    : 'Recent';
                  return (
                    <div key={ticket.id} className="p-3 rounded-xl bg-[#fafafa] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-slate-500 text-[10px]">{ticket.ticketCode}</span>
                          <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold border ${getTicketStatusBadge(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-[#0d0d0e] text-xs truncate max-w-xs">{ticket.subject}</h4>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {ticket.department} • Priority: <span className="font-semibold text-slate-700">{ticket.priority}</span> • {dateStr}
                        </div>
                      </div>
                      <Link href="/support" className="px-3 py-1.5 rounded-full bg-[#0d0d0e] text-white font-mono font-bold text-[11px] hover:bg-amber-600 transition-colors self-start sm:self-auto shrink-0">
                        Thread
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Real Recent Activity Timeline */}
        <div className="bg-white border-2 border-slate-300 rounded-[28px] p-5 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h2 className="text-lg font-black text-[#0d0d0e]">Recent Account Activity</h2>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Live Account Events</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : realActivities.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs font-medium">
              No recent activity recorded yet. Orders, license updates, and support interactions will appear here in real time.
            </div>
          ) : (
            <div className="space-y-3">
              {realActivities.map((act) => {
                const Icon = act.type === 'ORDER' ? CreditCard : act.type === 'LICENSE' ? Key : Headphones;
                const iconColor = act.type === 'ORDER' ? 'text-amber-600 bg-amber-50' : act.type === 'LICENSE' ? 'text-emerald-600 bg-emerald-50' : 'text-sky-600 bg-sky-50';
                
                return (
                  <div key={act.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#fafafa] border border-slate-200 text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-[#0d0d0e]">{act.title}</div>
                        <div className="text-[11px] text-slate-500">{act.subtitle}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                        {act.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      <Link href={act.link} className="font-bold text-sky-600 hover:underline text-xs flex items-center gap-0.5">
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

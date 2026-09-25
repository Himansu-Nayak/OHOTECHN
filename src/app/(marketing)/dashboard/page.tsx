'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Package, Key, Repeat, Download, ArrowRight, ShieldCheck, Clock, 
  CreditCard, Sparkles, CheckCircle2, Headphones, Copy, Check, 
  MessageSquare, AlertCircle, ChevronRight, Laptop
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMyEntitledProductsApi } from '@/api/releases';
import { getMyLicensesApi } from '@/api/licenses';
import { getMySubscriptionsApi } from '@/api/subscriptions';
import { getMyOrdersApi } from '@/api/orders';
import { getMyCustomerTicketsApi } from '@/api/support';
import { ProductDto, License, Subscription, Order, SupportTicketDto, OrderStatus, TicketStatus } from '@/api/types';
import { formatInr } from '@/utils/cartUtils';

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
  const activeTicketsCount = tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;

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

        {/* Metrics Grid (5 cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
          <div className="bg-white border-2 border-slate-300 rounded-[24px] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Owned Products</span>
              <Package className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#0d0d0e]">{loading ? '...' : products.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Catalog modules</p>
          </div>

          <div className="bg-white border-2 border-slate-300 rounded-[24px] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Active Keys</span>
              <Key className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#0d0d0e]">{loading ? '...' : activeLicensesCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Active licenses</p>
          </div>

          <div className="bg-white border-2 border-slate-300 rounded-[24px] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Subscriptions</span>
              <Repeat className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#0d0d0e]">{loading ? '...' : activeSubsCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">Recurring plans</p>
          </div>

          <div className="bg-white border-2 border-slate-300 rounded-[24px] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
              <CreditCard className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#0d0d0e]">{loading ? '...' : orders.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Invoices issued</p>
          </div>

          <div className="bg-white border-2 border-slate-300 rounded-[24px] p-4 sm:p-5 shadow-xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Support</span>
              <Headphones className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#0d0d0e]">{loading ? '...' : activeTicketsCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">{tickets.length} total tickets</p>
          </div>
        </div>

        {/* Quick Access Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/licenses" className="bg-white border-2 border-slate-300 hover:border-emerald-500 rounded-[24px] p-5 shadow-xs transition-all block group">
            <div className="flex items-center justify-between mb-3">
              <Key className="w-5 h-5 text-emerald-600" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-base font-black text-[#0d0d0e] mb-1">License Keys</h3>
            <p className="text-xs text-slate-600">View cryptographic keys, manage registered devices, and inspect limits.</p>
          </Link>

          <Link href="/subscriptions" className="bg-white border-2 border-slate-300 hover:border-purple-500 rounded-[24px] p-5 shadow-xs transition-all block group">
            <div className="flex items-center justify-between mb-3">
              <Repeat className="w-5 h-5 text-purple-600" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-base font-black text-[#0d0d0e] mb-1">Subscriptions</h3>
            <p className="text-xs text-slate-600">Track trial periods, monthly/yearly expiry dates, and renewal status.</p>
          </Link>

          <Link href="/downloads" className="bg-white border-2 border-slate-300 hover:border-sky-500 rounded-[24px] p-5 shadow-xs transition-all block group">
            <div className="flex items-center justify-between mb-3">
              <Download className="w-5 h-5 text-sky-600" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-base font-black text-[#0d0d0e] mb-1">Downloads</h3>
            <p className="text-xs text-slate-600">Download authorized software builds for Windows, macOS, Linux, and Android.</p>
          </Link>

          <Link href="/support" className="bg-white border-2 border-slate-300 hover:border-amber-500 rounded-[24px] p-5 shadow-xs transition-all block group">
            <div className="flex items-center justify-between mb-3">
              <Headphones className="w-5 h-5 text-amber-600" />
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-base font-black text-[#0d0d0e] mb-1">Help Desk &amp; Queries</h3>
            <p className="text-xs text-slate-600">Submit support tickets, communicate with engineers, and track SLAs.</p>
          </Link>
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
            <div className="py-6 text-center text-xs text-slate-400">Loading active licenses...</div>
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
                        className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors shrink-0"
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

        {/* Two-Column Grid: Recent Orders & Recent Support Tickets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Orders Section */}
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
              <div className="py-6 text-center text-xs text-slate-400">Loading orders...</div>
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
                      <Link href="/orders" className="px-3 py-1.5 rounded-full bg-[#0d0d0e] text-white font-mono font-bold text-[11px] hover:bg-sky-600 transition-colors self-start sm:self-auto shrink-0">
                        View Order
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Support Tickets Section */}
          <div className="bg-white border-2 border-slate-300 rounded-[28px] p-5 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-amber-600" />
                  <h2 className="text-lg font-black text-[#0d0d0e]">Support Queries</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Tickets, technical queries &amp; SLA resolution.</p>
              </div>
              <Link href="/support" className="text-xs font-mono font-bold text-amber-700 hover:underline flex items-center gap-1">
                Support Desk <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-6 text-center text-xs text-slate-400">Loading support queries...</div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-6 px-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold text-slate-700">No active support tickets</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Need help deploying, activating a license, or configuring your software? Our engineering desk is on call.
                </p>
                <Link href="/support" className="mt-3 inline-block px-4 py-2 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors">
                  Create Ticket
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.slice(0, 3).map((ticket) => {
                  const dateStr = ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                    : 'Recent';
                  return (
                    <div key={ticket.id} className="p-3.5 rounded-2xl bg-[#fafafa] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
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
                        View Thread
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}

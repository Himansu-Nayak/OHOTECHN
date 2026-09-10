'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Package, 
  Key, 
  Repeat, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Bell, 
  FileText, 
  Copy, 
  Check, 
  Lock, 
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMyEntitledProductsApi } from '@/api/releases';
import { getMyLicensesApi } from '@/api/licenses';
import { getMySubscriptionsApi } from '@/api/subscriptions';
import { getMyOrdersApi, downloadOrderInvoiceApi } from '@/api/orders';
import { getNotificationsApi, markNotificationAsReadApi } from '@/api/notifications';
import { ProductDto, License, Subscription, Order, NotificationDto } from '@/api/types';
import { CustomerPortalNav } from '@/components/portal/CustomerPortalNav';
import { cn } from '@/lib/utils';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = React.useState<ProductDto[]>([]);
  const [licenses, setLicenses] = React.useState<License[]>([]);
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [notifications, setNotifications] = React.useState<NotificationDto[]>([]);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = React.useState<number | null>(null);

  const loadDashboardData = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [prodRes, licRes, subRes, ordRes, notifRes] = await Promise.allSettled([
        getMyEntitledProductsApi(),
        getMyLicensesApi(),
        getMySubscriptionsApi(),
        getMyOrdersApi(),
        getNotificationsApi(false, 0, 5),
      ]);

      let hasAnySuccess = false;

      if (prodRes.status === 'fulfilled' && prodRes.value.success && prodRes.value.data) {
        setProducts(prodRes.value.data);
        hasAnySuccess = true;
      }
      if (licRes.status === 'fulfilled' && licRes.value.success && licRes.value.data) {
        setLicenses(licRes.value.data);
        hasAnySuccess = true;
      }
      if (subRes.status === 'fulfilled' && subRes.value.success && subRes.value.data) {
        setSubscriptions(subRes.value.data);
        hasAnySuccess = true;
      }
      if (ordRes.status === 'fulfilled' && ordRes.value.success && ordRes.value.data) {
        setOrders(ordRes.value.data);
        hasAnySuccess = true;
      }
      if (notifRes.status === 'fulfilled' && notifRes.value.success && notifRes.value.data) {
        setNotifications(notifRes.value.data.content || []);
        hasAnySuccess = true;
      }

      // If all rejected or returned failure, display friendly error
      if (!hasAnySuccess && (
        prodRes.status === 'rejected' ||
        licRes.status === 'rejected' ||
        subRes.status === 'rejected' ||
        ordRes.status === 'rejected'
      )) {
        setError('Unable to load some dashboard metrics. Please check your connection and retry.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with backend services.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    showToast('License key copied to clipboard', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
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

  const handleMarkNotifRead = async (id: number) => {
    try {
      await markNotificationAsReadApi(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      showToast('Notification marked as read.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to mark notification read', 'error');
    }
  };

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Lock className="w-12 h-12 text-sky-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Customer Sign In Required</h1>
          <p className="text-xs text-slate-500 mb-6">
            Please log in with your account credentials to access your customer dashboard, licenses, and downloads.
          </p>
          <Link 
            href="/login" 
            className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-block"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  const activeLicenses = licenses.filter(l => l.status === 'ACTIVE');
  const activeSubs = subscriptions.filter(s => s.status === 'ACTIVE' || s.status === 'TRIAL');
  const unreadNotifs = notifications.filter(n => !n.read);

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-6xl w-full mx-auto" id="customer-dashboard-main">
        
        {/* Unified Customer Navigation Subnav */}
        <CustomerPortalNav />

        {/* Header & Account Profile Status Strip */}
        <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  CUSTOMER COMMAND CENTER
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] font-bold uppercase">
                  {user.role || 'ROLE_USER'}
                </span>
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Account
                  </span>
                ) : (
                  <Link 
                    href="/verify-email" 
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-mono text-[11px] font-bold transition-colors"
                  >
                    <AlertCircle className="w-3 h-3 text-amber-600" /> Verify Email
                  </Link>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
                Welcome back, {user.name}
              </h1>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Manage your enterprise cloud software, cryptographic license activations, and orders.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => loadDashboardData()}
                disabled={loading}
                className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Refresh Metrics"
              >
                <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
                <span>Refresh</span>
              </button>
              <Link 
                href="/products" 
                className="px-4 py-2.5 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors shadow-xs"
              >
                Browse Catalog
              </Link>
              <Link 
                href="/downloads" 
                className="px-4 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Downloads
              </Link>
            </div>
          </div>
        </div>

        {/* Error Alert with Retry */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadDashboardData()}
              className="px-3 py-1 rounded-xl bg-rose-600 text-white font-mono font-bold text-[11px] hover:bg-rose-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* 5-Column Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          
          {/* 1. Owned Products */}
          <Link 
            href="/my-products"
            className="bg-white border-2 border-slate-300 hover:border-sky-500 rounded-[28px] p-5 shadow-xs transition-all group block"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Entitlements</span>
              <Package className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl font-black text-[#0d0d0e]">
              {loading ? (
                <div className="h-8 bg-slate-100 rounded-lg w-12 animate-pulse" />
              ) : (
                products.length
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Owned software packages</p>
          </Link>

          {/* 2. Active Licenses */}
          <Link 
            href="/licenses"
            className="bg-white border-2 border-slate-300 hover:border-emerald-500 rounded-[28px] p-5 shadow-xs transition-all group block"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Active Keys</span>
              <Key className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl font-black text-[#0d0d0e]">
              {loading ? (
                <div className="h-8 bg-slate-100 rounded-lg w-12 animate-pulse" />
              ) : (
                activeLicenses.length
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {licenses.reduce((acc, l) => acc + (l.activationCount || 0), 0)} devices active
            </p>
          </Link>

          {/* 3. Subscriptions & Trials */}
          <Link 
            href="/subscriptions"
            className="bg-white border-2 border-slate-300 hover:border-purple-500 rounded-[28px] p-5 shadow-xs transition-all group block"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Subscriptions</span>
              <Repeat className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl font-black text-[#0d0d0e]">
              {loading ? (
                <div className="h-8 bg-slate-100 rounded-lg w-12 animate-pulse" />
              ) : (
                activeSubs.length
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Active recurring plans</p>
          </Link>

          {/* 4. Total Orders */}
          <Link 
            href="/orders"
            className="bg-white border-2 border-slate-300 hover:border-amber-500 rounded-[28px] p-5 shadow-xs transition-all group block"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Orders</span>
              <CreditCard className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl font-black text-[#0d0d0e]">
              {loading ? (
                <div className="h-8 bg-slate-100 rounded-lg w-12 animate-pulse" />
              ) : (
                orders.length
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Tax invoices ready</p>
          </Link>

          {/* 5. Notifications */}
          <Link 
            href="/notifications"
            className="bg-white border-2 border-slate-300 hover:border-rose-500 rounded-[28px] p-5 shadow-xs transition-all group block"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Unread Alerts</span>
              <Bell className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl font-black text-[#0d0d0e]">
              {loading ? (
                <div className="h-8 bg-slate-100 rounded-lg w-12 animate-pulse" />
              ) : (
                unreadNotifs.length
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">System &amp; billing notices</p>
          </Link>

        </div>

        {/* Two Column Layout: Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Left 2-Cols: Recent Orders & Entitlement Snapshot */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Recent Orders & Invoices */}
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0d0d0e]">Recent Orders &amp; Tax Invoices</h2>
                  <p className="text-xs text-slate-500 font-medium">Download official PDF receipts and track license provisioning.</p>
                </div>
                <Link href="/orders" className="text-xs font-mono font-bold text-sky-600 hover:underline flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 animate-pulse h-20" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10 bg-[#fafafa] rounded-2xl border border-dashed border-slate-200">
                  <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <div className="text-xs font-bold text-[#0d0d0e]">No purchase orders yet</div>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                    Purchasing a turnkey solution will instantly issue your cryptographic key and invoice.
                  </p>
                  <Link 
                    href="/products" 
                    className="mt-4 inline-block px-4 py-2 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors"
                  >
                    Browse Catalog
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => {
                    const orderDate = order.createdAt 
                      ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'Recent';

                    return (
                      <div 
                        key={order.id} 
                        className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[#0d0d0e]">Order #{order.id}</span>
                            <span className={cn(
                              'px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase border',
                              order.status === 'PAID' || order.status === 'CONFIRMED' || order.status === 'DELIVERED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            )}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-1">
                            Amount: <strong className="text-slate-800">₹{order.totalAmount}</strong> • Date: {orderDate}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <button
                            onClick={() => handleDownloadInvoice(order.id)}
                            disabled={downloadingInvoiceId === order.id}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-mono font-bold text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            title="Download PDF Invoice"
                          >
                            <Download className="w-3 h-3" />
                            <span>{downloadingInvoiceId === order.id ? 'PDF...' : 'Invoice PDF'}</span>
                          </button>
                          <Link 
                            href="/orders" 
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-[11px] transition-colors"
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

            {/* Active Licenses Snapshot */}
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0d0d0e]">Active Software License Keys</h2>
                  <p className="text-xs text-slate-500 font-medium">Cryptographic activation keys and device seat limits.</p>
                </div>
                <Link href="/licenses" className="text-xs font-mono font-bold text-sky-600 hover:underline flex items-center gap-1">
                  <span>Manage Keys</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 animate-pulse h-20" />
                  ))}
                </div>
              ) : licenses.length === 0 ? (
                <div className="text-center py-10 bg-[#fafafa] rounded-2xl border border-dashed border-slate-200">
                  <Key className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <div className="text-xs font-bold text-[#0d0d0e]">No active licenses found</div>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                    License keys are generated automatically upon software purchase or trial activation.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {licenses.slice(0, 3).map((lic) => (
                    <div 
                      key={lic.id} 
                      className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#0d0d0e]">{lic.product?.name || 'Enterprise License'}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono font-bold text-[11px]">
                            {lic.licenseKey}
                          </code>
                          <button
                            onClick={() => handleCopyKey(lic.licenseKey)}
                            className="p-1 rounded text-slate-500 hover:text-black transition-colors"
                            title="Copy Key"
                          >
                            {copiedKey === lic.licenseKey ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-slate-500">
                          {lic.activationCount}/{lic.activationLimit} Seats Used
                        </span>
                        <Link 
                          href="/licenses" 
                          className="px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-sky-600 font-bold transition-colors"
                        >
                          Devices
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right 1-Col: Quick Access & Notifications Feed */}
          <div className="space-y-8">
            
            {/* Quick Actions Card */}
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 shadow-sm">
              <h3 className="text-base font-extrabold text-[#0d0d0e] mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                Quick Actions
              </h3>

              <div className="space-y-2 text-xs font-mono font-bold">
                <Link 
                  href="/downloads" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-600" />
                    Software Downloads
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link 
                  href="/licenses" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-slate-600" />
                    Manage License Keys
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link 
                  href="/subscriptions" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 text-purple-800 hover:bg-purple-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-purple-600" />
                    Subscriptions &amp; Renewals
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link 
                  href="/profile" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-600" />
                    Account Security &amp; Password
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link 
                  href="/contact" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-sky-50 text-sky-800 hover:bg-sky-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <LifeBuoy className="w-4 h-4 text-sky-600" />
                    Technical Support
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Notification Center Snapshot */}
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-[#0d0d0e] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-rose-500" />
                  Recent Alerts
                </h3>
                <Link href="/notifications" className="text-[11px] font-mono font-bold text-sky-600 hover:underline">
                  View All ({notifications.length})
                </Link>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl animate-pulse h-12" />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 font-medium">
                  No notifications to display.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {notifications.slice(0, 3).map((notif) => (
                    <div 
                      key={notif.id} 
                      className={cn(
                        'p-3 rounded-2xl border text-xs transition-colors flex items-start justify-between gap-2',
                        notif.read ? 'bg-[#fafafa] border-slate-200' : 'bg-sky-50/60 border-sky-200'
                      )}
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-[#0d0d0e] text-[11px] leading-tight">
                          {notif.title}
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>

                      {!notif.read && (
                        <button
                          onClick={() => handleMarkNotifRead(notif.id)}
                          className="text-[10px] font-mono text-sky-600 hover:text-sky-800 shrink-0 uppercase font-bold"
                          title="Mark Read"
                        >
                          Read
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assistance Card */}
            <div className="bg-gradient-to-br from-slate-900 to-[#0d0d0e] rounded-[32px] p-6 text-white shadow-sm">
              <LifeBuoy className="w-8 h-8 text-sky-400 mb-3" />
              <h4 className="text-sm font-extrabold">Need Custom Integration?</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Our enterprise engineering team is available for custom deployment architecture and SLA guarantees.
              </p>
              <Link 
                href="/contact" 
                className="mt-4 inline-block px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Contact Engineers
              </Link>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

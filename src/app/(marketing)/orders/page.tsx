'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Package,
  Clock,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  CreditCard,
  CheckCircle2,
  FileText,
  Download,
  Search,
  Filter,
  Eye,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMyOrdersApi, downloadOrderInvoiceApi } from '@/api/orders';
import { createPaymentOrderApi } from '@/api/payments';
import { Order, OrderStatus } from '@/api/types';
import { CustomerPortalNav } from '@/components/portal/CustomerPortalNav';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
  const [downloadingId, setDownloadingId] = React.useState<number | null>(null);

  const fetchOrders = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getMyOrdersApi();
      if (res.success && res.data) {
        setOrders(res.data);
      } else {
        throw new Error(res.message || 'Failed to fetch orders');
      }
    } catch (err: any) {
      setError(err.message || 'Could not load your orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePayNow = async (orderId: number) => {
    try {
      const res = await createPaymentOrderApi(orderId);
      if (res.success && res.data) {
        showToast(`Payment order initialized for Order #${orderId}. Redirecting to gateway...`, 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Payment initiation failed', 'error');
    }
  };

  const handleDownloadInvoice = async (e: React.MouseEvent, orderId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDownloadingId(orderId);
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
      showToast(`Tax Invoice PDF downloaded for Order #${orderId}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to download invoice PDF', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
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

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'CONFIRMED' && (order.status === 'CONFIRMED' || order.status === 'PAID')) ||
      (statusFilter === 'PENDING' && order.status === 'PENDING') ||
      (statusFilter === 'CANCELLED' && order.status === 'CANCELLED');

    const matchesSearch =
      !searchQuery.trim() ||
      String(order.id).includes(searchQuery.trim()) ||
      order.shippingAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some((item) => item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const confirmedCount = orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'PAID').length;
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const totalSpend = orders
    .filter((o) => o.status === 'CONFIRMED' || o.status === 'PAID')
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Package className="w-12 h-12 text-sky-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Login Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please sign in to access your order history.</p>
          <Link
            href="/login?redirect=/orders"
            className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-5xl w-full mx-auto" id="orders-main">
        <CustomerPortalNav />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200 uppercase tracking-widest">
                Procurement &amp; Orders History
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
              My Orders &amp; Invoices
            </h1>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Track enterprise software deployments, download official GST tax invoices, and review order timelines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/invoices"
              className="py-2.5 px-4 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>Invoices Hub</span>
            </Link>
            <Link
              href="/products"
              className="py-2.5 px-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>New Order</span>
            </Link>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Total Orders</div>
            <div className="text-2xl font-black text-[#0d0d0e] mt-1">{orders.length}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{confirmedCount} active / verified</div>
          </div>
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Pending Orders</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Awaiting checkout payment</div>
          </div>
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Total Investment</div>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalSpend)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Verified software licenses</div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order #, product name, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors font-mono cursor-pointer',
                  statusFilter === tab
                    ? 'bg-[#0d0d0e] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="bg-white border-2 border-slate-200 rounded-[32px] p-6 animate-pulse space-y-3">
                <div className="h-6 bg-slate-100 rounded-lg w-1/4" />
                <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                <div className="h-16 bg-slate-50 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-6 shadow-sm">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">No Matching Orders Found</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              {searchQuery || statusFilter !== 'ALL'
                ? 'No orders match your filter criteria. Try resetting your search query.'
                : "You haven't placed any software orders yet. Browse our turnkey products catalog to get started."}
            </p>
            {searchQuery || statusFilter !== 'ALL' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                }}
                className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            ) : (
              <Link
                href="/products"
                className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-block"
              >
                Explore Products
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Recent';

              const formattedTotal = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(order.totalAmount || 0);

              return (
                <div
                  key={order.id}
                  className="bg-white border-2 border-slate-300 hover:border-slate-400 rounded-[32px] p-6 sm:p-8 shadow-sm transition-all"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-base font-black text-[#0d0d0e] hover:text-sky-600 transition-colors flex items-center gap-1.5 group"
                        >
                          <span>Order #{order.id}</span>
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-sky-600" />
                        </Link>
                        <span
                          className={cn(
                            'text-[10px] font-mono font-bold px-3 py-0.5 rounded-full border uppercase tracking-wider',
                            getStatusBadge(order.status)
                          )}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-mono">
                        <Clock className="w-3.5 h-3.5" /> {formattedDate}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                          Total Amount
                        </div>
                        <div className="text-lg font-black text-[#0d0d0e] font-mono">{formattedTotal}</div>
                      </div>

                      <button
                        onClick={(e) => handleDownloadInvoice(e, order.id)}
                        disabled={downloadingId === order.id}
                        className="py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-sky-600 text-white font-mono font-bold text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
                        title="Download Tax Invoice PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{downloadingId === order.id ? 'Generating...' : 'Tax Invoice PDF'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="py-4 space-y-3">
                    <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                      Ordered Products ({order.items?.length || 0})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="bg-[#fafafa] border border-slate-200 rounded-2xl p-3.5 text-xs flex justify-between items-center"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-bold text-[#0d0d0e] truncate">
                              {item.product?.name || `Product #${item.id}`}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5 font-mono">
                              {item.productPlan && (
                                <span className="text-emerald-700 font-bold">
                                  {item.productPlan.name}
                                </span>
                              )}
                              <span>Qty: {item.quantity} x ₹{item.price}</span>
                            </div>
                          </div>
                          <div className="font-black text-[#0d0d0e] font-mono shrink-0">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery & Actions Footer */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="text-slate-600 font-medium line-clamp-1">
                      <span className="font-bold text-[#0d0d0e]">Shipping / Billing Address:</span> {order.shippingAddress} (Phone: {order.contactPhone})
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/orders/${order.id}`}
                        className="py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-600" />
                        <span>View Order Timeline</span>
                      </Link>

                      {order.status === 'PENDING' && (
                        <Link
                          href={`/checkout`}
                          className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Complete Payment</span>
                        </Link>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}

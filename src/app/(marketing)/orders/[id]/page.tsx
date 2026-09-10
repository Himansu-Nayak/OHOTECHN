'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Clock,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  FileText,
  Download,
  Key,
  Layers,
  Building,
  Phone,
  Mail,
  User,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getOrderByIdApi, downloadOrderInvoiceApi } from '@/api/orders';
import { Order, OrderStatus } from '@/api/types';
import { CustomerPortalNav } from '@/components/portal/CustomerPortalNav';
import { cn } from '@/lib/utils';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const orderId = params?.id as string;

  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [downloading, setDownloading] = React.useState<boolean>(false);

  const fetchOrder = React.useCallback(async () => {
    if (!user || !orderId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getOrderByIdApi(orderId);
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        throw new Error(res.message || 'Order not found');
      }
    } catch (err: any) {
      setError(err.message || 'Access Denied: You do not have permission to view this order.');
    } finally {
      setLoading(false);
    }
  }, [user, orderId]);

  React.useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleDownloadInvoice = async () => {
    if (!order) return;
    setDownloading(true);
    try {
      const blob = await downloadOrderInvoiceApi(order.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-order-${order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast(`Tax Invoice PDF downloaded for Order #${order.id}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to download invoice PDF', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleViewInvoiceInBrowser = async () => {
    if (!order) return;
    setDownloading(true);
    try {
      const blob = await downloadOrderInvoiceApi(order.id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      showToast('Opening PDF Invoice in viewer...', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to preview invoice PDF', 'error');
    } finally {
      setDownloading(false);
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

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Package className="w-12 h-12 text-sky-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Login Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please sign in to view this order.</p>
          <Link
            href={`/login?redirect=/orders/${orderId}`}
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
      <main className="max-w-5xl w-full mx-auto" id="order-detail-main">
        <CustomerPortalNav />

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Orders
          </Link>
        </div>

        {error && (
          <div className="bg-white border-2 border-rose-200 rounded-[32px] p-8 text-center my-6 shadow-sm">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h2 className="text-lg font-black text-rose-900 mb-2">Order Access Denied or Not Found</h2>
            <p className="text-xs text-rose-700 max-w-md mx-auto mb-6">{error}</p>
            <Link
              href="/orders"
              className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-block"
            >
              Return to My Orders
            </Link>
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            <div className="bg-white border-2 border-slate-200 rounded-[32px] p-8 animate-pulse space-y-4">
              <div className="h-6 bg-slate-100 rounded-lg w-1/3" />
              <div className="h-4 bg-slate-100 rounded-lg w-1/4" />
              <div className="h-24 bg-slate-50 rounded-2xl" />
            </div>
          </div>
        ) : order && (
          <div className="space-y-8">
            
            {/* Order Hero Card */}
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0d0d0e]">
                      Order #{order.id}
                    </h1>
                    <span
                      className={cn(
                        'text-xs font-mono font-bold px-3.5 py-1 rounded-full border uppercase tracking-wider',
                        getStatusBadge(order.status)
                      )}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-2 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Placed on{' '}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Recent'}
                    </span>
                  </div>
                </div>

                {/* PDF Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleViewInvoiceInBrowser}
                    disabled={downloading}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-mono font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                    <span>View Invoice</span>
                  </button>

                  <button
                    onClick={handleDownloadInvoice}
                    disabled={downloading}
                    className="py-2.5 px-4 rounded-xl bg-[#0d0d0e] hover:bg-sky-600 text-white font-mono font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloading ? 'Downloading...' : 'Download Tax PDF'}</span>
                  </button>
                </div>
              </div>

              {/* Visual Order Timeline */}
              <div className="pt-6">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Order Lifecycle Timeline
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Step 1 */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>1. Order Placed</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 font-medium">Cart calculated &amp; locked</p>
                  </div>

                  {/* Step 2 */}
                  <div
                    className={cn(
                      'p-4 rounded-2xl border space-y-1',
                      order.status === 'CONFIRMED' || order.status === 'PAID'
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-amber-50 border-amber-200'
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-2 font-bold text-xs',
                        order.status === 'CONFIRMED' || order.status === 'PAID'
                          ? 'text-emerald-700'
                          : 'text-amber-800'
                      )}
                    >
                      <CheckCircle2
                        className={cn(
                          'w-4 h-4',
                          order.status === 'CONFIRMED' || order.status === 'PAID'
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        )}
                      />
                      <span>2. Payment Verified</span>
                    </div>
                    <p
                      className={cn(
                        'text-[11px] font-medium',
                        order.status === 'CONFIRMED' || order.status === 'PAID'
                          ? 'text-emerald-800'
                          : 'text-amber-800'
                      )}
                    >
                      {order.status === 'CONFIRMED' || order.status === 'PAID'
                        ? 'Razorpay verified via HMAC'
                        : 'Pending customer payment'}
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div
                    className={cn(
                      'p-4 rounded-2xl border space-y-1',
                      order.status === 'CONFIRMED' || order.status === 'PAID'
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-2 font-bold text-xs',
                        order.status === 'CONFIRMED' || order.status === 'PAID'
                          ? 'text-emerald-700'
                          : 'text-slate-500'
                      )}
                    >
                      <Key className="w-4 h-4" />
                      <span>3. Entitlement Issued</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">Digital license key issued</p>
                  </div>

                  {/* Step 4 */}
                  <div
                    className={cn(
                      'p-4 rounded-2xl border space-y-1',
                      order.status === 'CONFIRMED' || order.status === 'PAID'
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center gap-2 font-bold text-xs',
                        order.status === 'CONFIRMED' || order.status === 'PAID'
                          ? 'text-emerald-700'
                          : 'text-slate-500'
                      )}
                    >
                      <Zap className="w-4 h-4" />
                      <span>4. Production Active</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">Ready for deployment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Grid: Items & Customer/Billing */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Ordered Products Section */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm">
                  <h2 className="text-lg font-black text-[#0d0d0e] mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span>Ordered Software ({order.items?.length || 0})</span>
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">Itemized Line</span>
                  </h2>

                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 uppercase text-slate-700">
                              {item.product?.serviceType || 'Software'}
                            </span>
                            {item.productPlan && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                                {item.productPlan.name} ({item.productPlan.billingType})
                              </span>
                            )}
                          </div>
                          <h3 className="font-extrabold text-[#0d0d0e] text-sm truncate">
                            {item.product?.name || `Product #${item.id}`}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Quantity: {item.quantity} x ₹{item.price}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-black text-[#0d0d0e] font-mono">
                            ₹{item.price * item.quantity}
                          </div>
                          <Link
                            href="/licenses"
                            className="text-[11px] font-bold text-sky-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                          >
                            <Key className="w-3 h-3" /> View License Key
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown Summary */}
                  <div className="pt-6 border-t border-slate-200 mt-6 space-y-2 text-xs">
                    <div className="flex justify-between font-medium text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#0d0d0e]">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.totalAmount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium text-slate-600">
                      <span>Digital License Issuance</span>
                      <span className="font-bold text-emerald-600">INCLUDED</span>
                    </div>
                    <div className="flex justify-between font-medium text-slate-600">
                      <span>Tax / GST</span>
                      <span className="font-bold text-slate-700">Included in Total</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
                      <span className="font-black text-[#0d0d0e]">Total Amount Paid</span>
                      <span className="text-xl font-black text-emerald-600 font-mono">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.totalAmount || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer, Billing & Payment Audit */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Billing & Customer Identity */}
                <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
                  <h3 className="text-base font-black text-[#0d0d0e] pb-3 border-b border-slate-100 flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-600" />
                    Customer &amp; Billing Details
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Customer Name</div>
                      <div className="font-bold text-[#0d0d0e] mt-0.5">{order.user?.name || user.name}</div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Email Address</div>
                      <div className="font-bold text-[#0d0d0e] mt-0.5">{order.user?.email || user.email}</div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Contact Phone</div>
                      <div className="font-bold text-[#0d0d0e] mt-0.5">{order.contactPhone || 'N/A'}</div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Shipping / Billing Address</div>
                      <div className="font-medium text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                        {order.shippingAddress}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Gateway Records */}
                <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
                  <h3 className="text-base font-black text-[#0d0d0e] pb-3 border-b border-slate-100 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    Payment Gateway Records
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Gateway Provider</span>
                      <span className="font-bold font-mono text-[#0d0d0e]">Razorpay Secure</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Payment Status</span>
                      <span className="font-bold text-emerald-600 uppercase font-mono">
                        {order.status === 'CONFIRMED' || order.status === 'PAID' ? 'SUCCESSFUL' : 'PENDING'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Verification Model</span>
                      <span className="font-mono text-slate-700">HMAC SHA-256</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <Link
                      href="/licenses"
                      className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Access Software Licenses</span>
                    </Link>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

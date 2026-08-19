'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, Clock, ShieldCheck, AlertCircle, ShoppingBag, ArrowRight, CreditCard, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMyOrdersApi } from '@/api/orders';
import { createPaymentOrderApi, verifyPaymentApi } from '@/api/payments';
import { Order, OrderStatus } from '@/api/types';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

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
        showToast(`Payment order created: ${res.data.id || res.data.orderId || 'Success'}. Proceeding to gateway...`, 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Payment initiation failed', 'error');
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
          <p className="text-xs text-slate-500 mb-6">Please sign in to access your order history.</p>
          <Link
            href="/login"
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
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
            My Orders
          </h1>
          <p className="text-xs font-medium text-slate-600 mt-1">
            Track your cloud deployments, subscription status, and purchase history.
          </p>
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
        ) : orders.length === 0 ? (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-6 shadow-sm">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">No Orders Placed Yet</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              You haven't placed any software orders yet. Browse our turnkey products catalog to get started.
            </p>
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-block"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent';

              const formattedTotal = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(order.totalAmount || 0);

              return (
                <div
                  key={order.id}
                  className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm transition-all hover:border-sky-500"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-[#0d0d0e]">
                          Order #{order.id}
                        </span>
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

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Total Amount</div>
                      <div className="text-lg font-black text-[#0d0d0e]">{formattedTotal}</div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="py-4 space-y-3">
                    <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Ordered Products</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="bg-[#fafafa] border border-slate-200 rounded-2xl p-3.5 text-xs flex justify-between items-center"
                        >
                          <div>
                            <div className="font-bold text-[#0d0d0e]">{item.product?.name || `Product #${item.id}`}</div>
                            <div className="text-[10px] text-slate-500">Qty: {item.quantity} x ₹{item.price}</div>
                          </div>
                          <div className="font-black text-[#0d0d0e]">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery & Actions Footer */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="text-slate-600 font-medium">
                      <span className="font-bold text-[#0d0d0e]">Shipping Address:</span> {order.shippingAddress} (Phone: {order.contactPhone})
                    </div>

                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handlePayNow(order.id)}
                        className="py-2.5 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Complete Payment</span>
                      </button>
                    )}
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

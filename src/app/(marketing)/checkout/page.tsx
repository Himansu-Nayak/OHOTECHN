'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, CreditCard, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createOrderApi } from '@/api/orders';
import { createPaymentOrderApi, verifyPaymentApi } from '@/api/payments';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, totalAmount, refreshCart } = useCart();
  const { showToast } = useToast();

  const [shippingAddress, setShippingAddress] = React.useState('');
  const [contactPhone, setContactPhone] = React.useState(user?.phone || '');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  React.useEffect(() => {
    if (user?.phone && !contactPhone) {
      setContactPhone(user.phone);
    }
  }, [user, contactPhone]);

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(totalAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setErrorMsg('Shipping address is required');
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMsg('Contact phone number is required');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Create order in Spring Boot backend
      const res = await createOrderApi({
        shippingAddress,
        contactPhone,
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to place order.');
      }

      const createdOrder = res.data;
      showToast('Order created successfully!', 'success');
      await refreshCart();

      // 2. Attempt Razorpay Payment order creation
      try {
        const paymentRes = await createPaymentOrderApi(createdOrder.id);
        if (paymentRes.success && paymentRes.data) {
          // If Razorpay SDK is loaded or backend provided payment details, navigate to order details
          showToast('Payment initiated. Redirecting to your orders...', 'info');
        }
      } catch (payErr: any) {
        console.warn('Payment order creation note:', payErr.message);
      }

      // Redirect user to My Orders page
      router.push('/orders');
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while creating your order.');
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Lock className="w-12 h-12 text-sky-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Login Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please log in to complete your checkout process.</p>
          <Link
            href="/login"
            className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-5xl w-full mx-auto" id="checkout-main">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
              Checkout
            </h1>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Complete your deployment order details and delivery location.
            </p>
          </div>

          <Link href="/cart" className="flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-black text-[#0d0d0e] mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-600" />
                Shipping &amp; Contact Information
              </h2>

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Contact Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Shipping / Deployment Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter full office/delivery address with Pincode..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !cart?.items?.length}
                  className="w-full py-4 px-6 rounded-2xl bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm &amp; Place Order ({formattedTotal})</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Cart Summary Right */}
          <div className="lg:col-span-5">
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#0d0d0e] pb-3 border-b border-slate-100">
                Order Items ({cart?.items?.length || 0})
              </h3>

              <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                {cart?.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
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

              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between font-extrabold text-[#0d0d0e]">
                  <span>Total Amount</span>
                  <span className="text-base text-sky-600">{formattedTotal}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Protected by OHO TECH Verified Enterprise Protection.</span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

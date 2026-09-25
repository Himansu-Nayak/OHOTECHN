'use client';

import * as React from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  Package, Clock, ShieldCheck, AlertCircle, ShoppingBag, ArrowRight, 
  CreditCard, CheckCircle2, FileText, Download, QrCode, Copy, Check, X, Building2, Smartphone, Loader2 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMyOrdersApi, downloadOrderInvoiceApi } from '@/api/orders';
import { initiateUpiPaymentApi, submitUtrApi } from '@/api/payments';
import { Order, OrderStatus, UpiInitiateResponse } from '@/api/types';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function OrdersPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [downloadingId, setDownloadingId] = React.useState<number | null>(null);

  // Payment Modal State
  const [payModalOrder, setPayModalOrder] = React.useState<Order | null>(null);
  const [upiData, setUpiData] = React.useState<UpiInitiateResponse | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');
  const [utrInput, setUtrInput] = React.useState('');
  const [payerUpiInput, setPayerUpiInput] = React.useState('');
  const [isInitiatingPay, setIsInitiatingPay] = React.useState(false);
  const [isSubmittingUtr, setIsSubmittingUtr] = React.useState(false);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

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

  const handleOpenPayModal = async (order: Order) => {
    setPayModalOrder(order);
    setUpiData(null);
    setQrCodeUrl('');
    setUtrInput('');
    setPayerUpiInput('');
    setIsInitiatingPay(true);

    try {
      const res = await initiateUpiPaymentApi(order.id);
      if (res.success && res.data) {
        setUpiData(res.data);
        const url = await QRCode.toDataURL(res.data.upiIntentUri, {
          width: 260,
          margin: 2,
          color: { dark: '#0f172a', light: '#ffffff' },
        });
        setQrCodeUrl(url);
      } else {
        throw new Error(res.message || 'Failed to initialize UPI payment gateway');
      }
    } catch (err: any) {
      showToast(err.message || 'Unable to open payment modal', 'error');
      setPayModalOrder(null);
    } finally {
      setIsInitiatingPay(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label} to clipboard`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalOrder) return;
    const trimmed = utrInput.trim();
    if (!trimmed || trimmed.length < 6) {
      showToast('Please enter a valid UTR number (at least 6 characters)', 'error');
      return;
    }

    setIsSubmittingUtr(true);
    try {
      const res = await submitUtrApi({
        orderId: payModalOrder.id,
        utr: trimmed,
        payerUpiId: payerUpiInput.trim() || undefined,
        payerName: user?.name || undefined,
      });

      if (res.success) {
        showToast('UTR submitted successfully! Order is under manual finance verification.', 'success');
        setPayModalOrder(null);
        fetchOrders();
      } else {
        throw new Error(res.message || 'Failed to submit UTR');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit UTR reference', 'error');
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  const handleDownloadInvoice = async (orderId: number) => {
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
      showToast(`Invoice PDF downloaded for Order #${orderId}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to download invoice PDF', 'error');
    } finally {
      setDownloadingId(null);
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
                        <StatusBadge status={order.status} showDot size="sm" />
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-mono">
                        <Clock className="w-3.5 h-3.5" /> {formattedDate}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Total Amount</div>
                        <div className="text-lg font-black text-[#0d0d0e]">{formattedTotal}</div>
                      </div>

                      <button
                        onClick={() => handleDownloadInvoice(order.id)}
                        disabled={downloadingId === order.id}
                        className="min-h-[44px] py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-sky-600 text-white font-mono font-bold text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                        title="Download Tax Invoice PDF"
                      >
                        <Download className="w-4 h-4" />
                        <span>{downloadingId === order.id ? 'Generating...' : 'Invoice PDF'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="py-4 space-y-3">
                    <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Ordered Products</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="bg-[#fafafa] border border-slate-200 rounded-2xl p-3.5 text-xs flex justify-between items-center gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-[#0d0d0e] truncate">{item.product?.name || `Product #${item.id}`}</div>
                            <div className="text-[10px] text-slate-500 font-mono">Qty: {item.quantity} x {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price)}</div>
                          </div>
                          <div className="font-black text-[#0d0d0e] font-mono shrink-0">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery & Actions Footer */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="text-slate-600 font-medium">
                        <span className="font-bold text-[#0d0d0e]">Shipping Address:</span> {order.shippingAddress} (Phone: {order.contactPhone})
                      </div>
                      {order.payments && order.payments.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {order.payments.map((p) => (
                            <StatusBadge
                              key={p.id}
                              status={p.status}
                              label={`${p.provider || 'PAYMENT'}: ${p.status}${p.transactionReference ? ` | UTR: ${p.transactionReference}` : ''}`}
                              size="sm"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleOpenPayModal(order)}
                        className="w-full sm:w-auto min-h-[44px] py-2.5 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm cursor-pointer"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>{order.payments?.[0]?.transactionReference ? 'Update Payment / UTR' : 'Complete Payment (UPI)'}</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* UPI QR & UTR Payment Modal */}
        {payModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border-2 border-slate-300 rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setPayModalOrder(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-[#0d0d0e] text-lg">Complete UPI Payment</h3>
                  <p className="text-xs text-slate-500">Order #{payModalOrder.id} • Payable: ₹{payModalOrder.totalAmount}</p>
                </div>
              </div>

              {isInitiatingPay ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                  <p className="text-xs font-mono text-slate-500">Generating direct UPI payment gateway link...</p>
                </div>
              ) : upiData ? (
                <div className="space-y-5">
                  {/* QR Code and Bank Details */}
                  <div className="flex flex-col items-center text-center p-4 bg-[#fafafa] border border-slate-200 rounded-2xl">
                    {qrCodeUrl ? (
                      <div className="bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-inner mb-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48 sm:w-52 sm:h-52 object-contain" />
                      </div>
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center bg-slate-100 rounded-2xl text-xs text-slate-400 mb-3">
                        QR Code Unavailable
                      </div>
                    )}
                    <span className="text-[11px] font-mono text-slate-500 mb-1">
                      Scan using GPay, PhonePe, Paytm, BHIM, or any UPI App
                    </span>

                    {/* Mobile UPI Intent Button */}
                    <a
                      href={upiData.upiIntentUri}
                      className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      <Smartphone className="w-4 h-4" />
                      Open UPI App
                    </a>
                  </div>

                  {/* Merchant & Account Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        Merchant Name
                      </div>
                      <div className="font-bold text-[#0d0d0e] truncate">{upiData.merchantName}</div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>UPI ID / VPA</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(upiData.upiId, 'UPI ID')}
                          className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-0.5 text-[10px] font-bold"
                        >
                          {copiedField === 'UPI ID' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedField === 'UPI ID' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="font-bold text-[#0d0d0e] truncate">{upiData.upiId}</div>
                    </div>
                  </div>

                  {/* UTR Submission Form */}
                  <form onSubmit={handleSubmitUtr} className="space-y-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        12-Digit UTR / Transaction Reference <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={utrInput}
                        onChange={(e) => setUtrInput(e.target.value.trim())}
                        placeholder="e.g. 423589123456"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#fafafa] border-2 border-slate-200 text-xs font-mono font-bold text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors uppercase tracking-wider"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your UPI ID / Phone (Optional)
                      </label>
                      <input
                        type="text"
                        value={payerUpiInput}
                        onChange={(e) => setPayerUpiInput(e.target.value)}
                        placeholder="e.g. yourname@okhdfcbank"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setPayModalOrder(null)}
                        className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingUtr || !utrInput.trim()}
                        className="flex-[2] py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmittingUtr ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Submit UTR Reference</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-rose-600">
                  Unable to load payment details. Please try again.
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

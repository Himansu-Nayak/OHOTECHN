'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  ArrowLeft, ShieldCheck, CreditCard, Lock, CheckCircle2, 
  AlertCircle, Loader2, QrCode, Truck, Copy, Check, ExternalLink, 
  Smartphone, Building2, Info, Sparkles, Zap
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createOrderApi } from '@/api/orders';
import { 
  createPaymentOrderApi, 
  verifyPaymentApi, 
  demoPayApi,
  getPaymentConfigApi,
  initiateUpiPaymentApi,
  submitUtrApi,
  initiateCodApi 
} from '@/api/payments';
import { PaymentConfigDto, UpiInitiateResponse } from '@/api/types';
import { getSafeCartItemUnitPrice, formatInr } from '@/utils/cartUtils';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, totalAmount, clearCart } = useCart();
  const { showToast } = useToast();

  const [shippingAddress, setShippingAddress] = React.useState('Demo Tech Park, Block B-402, Outer Ring Road, Bengaluru, Karnataka - 560103');
  const [customerName, setCustomerName] = React.useState(user?.name || 'Demo Customer');
  const [customerEmail, setCustomerEmail] = React.useState(user?.email || 'demo.customer@ohotech.com');
  const [contactPhone, setContactPhone] = React.useState(user?.phone || '+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = React.useState<'UPI' | 'COD' | 'RAZORPAY' | 'DEMO'>('DEMO');

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [razorpayLoaded, setRazorpayLoaded] = React.useState(false);

  // Dynamic Payment Configuration from Backend
  const [paymentConfig, setPaymentConfig] = React.useState<PaymentConfigDto | null>(null);

  // UPI Stage state
  const [upiOrderData, setUpiOrderData] = React.useState<UpiInitiateResponse | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');
  const [utrNumber, setUtrNumber] = React.useState('');
  const [payerUpiId, setPayerUpiId] = React.useState('');
  const [payerName, setPayerName] = React.useState('');
  const [isSubmittingUtr, setIsSubmittingUtr] = React.useState(false);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [isSuccessSubmitted, setIsSuccessSubmitted] = React.useState(false);
  const [successOrderId, setSuccessOrderId] = React.useState<number | null>(null);

  // Fetch payment configuration from backend
  React.useEffect(() => {
    let isMounted = true;
    getPaymentConfigApi()
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setPaymentConfig(res.data);
          // If UPI is disabled but Razorpay enabled, switch default
          if (!res.data.upiDirectEnabled && res.data.razorpayEnabled) {
            setPaymentMethod('RAZORPAY');
          } else if (!res.data.upiDirectEnabled && !res.data.razorpayEnabled && res.data.codEnabled) {
            setPaymentMethod('COD');
          }
        }
      })
      .catch((err) => {
        console.warn('Could not fetch payment config:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic Razorpay SDK script loader
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).Razorpay) {
      setRazorpayLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay Checkout SDK.');
    };
    document.body.appendChild(script);
  }, []);

  // Auto-scroll to the amount breakdown / payment section on mount
  React.useEffect(() => {
    const el = document.getElementById('amount-breakdown-section');
    if (el) {
      const timer = setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const fillDemoDetails = () => {
    setCustomerName(user?.name || 'Demo Customer');
    setCustomerEmail(user?.email || 'demo.customer@ohotech.com');
    setContactPhone(user?.phone || '+91 98765 43210');
    setShippingAddress('Demo Tech Park, Block B-402, Outer Ring Road, Bengaluru, Karnataka - 560103');
    showToast('Demo contact and deployment details populated', 'info');
  };

  React.useEffect(() => {
    if (user) {
      if (user.name && customerName === 'Demo Customer') setCustomerName(user.name);
      if (user.email && customerEmail === 'demo.customer@ohotech.com') setCustomerEmail(user.email);
      if (user.phone && contactPhone === '+91 98765 43210') setContactPhone(user.phone);
    }
  }, [user]);

  // Generate QR Code data URL when UPI response is received
  React.useEffect(() => {
    if (!upiOrderData?.upiIntentUri) return;
    QRCode.toDataURL(upiOrderData.upiIntentUri, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Failed to render QR Code:', err));
  }, [upiOrderData]);

  const formattedTotal = formatInr(totalAmount);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName} to clipboard`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const processRazorpayCheckout = async (createdOrderId: number, paymentData: any) => {
    const rawKeyId = paymentData?.keyId || '';
    if (!rawKeyId || !rawKeyId.startsWith('rzp_')) {
      setErrorMsg('Razorpay payment gateway configuration is missing on server. Please use Direct UPI / Bank Transfer or Demo Pay.');
      showToast('Gateway configuration error. Please choose UPI or Demo Pay.', 'error');
      setIsLoading(false);
      return;
    }

    if (!razorpayLoaded || !(window as any).Razorpay) {
      setErrorMsg('Razorpay Checkout SDK is still loading. Please try again or use Direct UPI / Demo Pay.');
      showToast('Payment SDK not ready. Please retry.', 'error');
      setIsLoading(false);
      return;
    }

    const options = {
      key: rawKeyId,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      name: 'OHO TECHN',
      description: `Order #${createdOrderId} - Software Entitlement`,
      image: '/OHO_TECH_LOGO.png',
      order_id: paymentData.razorpayOrderId,
      handler: async function (response: any) {
        if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
          setErrorMsg('Incomplete payment response from gateway.');
          showToast('Payment verification failed.', 'error');
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);
          const verifyRes = await verifyPaymentApi({
            orderId: createdOrderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verifyRes.success) {
            await clearCart();
            showToast('Payment received! Your order is submitted for admin review.', 'success');
            setSuccessOrderId(createdOrderId);
            setIsSuccessSubmitted(true);
          } else {
            throw new Error(verifyRes.message || 'Payment signature verification failed.');
          }
        } catch (err: any) {
          setErrorMsg(err.message || 'Payment verification failed.');
          showToast(err.message || 'Verification failed.', 'error');
        } finally {
          setIsLoading(false);
        }
      },
      modal: {
        ondismiss: function () {
          setIsLoading(false);
          showToast('Payment cancelled. Your cart is still saved.', 'info');
        },
      },
      prefill: {
        name: customerName || user?.name || '',
        email: customerEmail || user?.email || '',
        contact: contactPhone,
      },
      theme: {
        color: '#0d0d0e',
      },
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        const desc = response.error?.description || 'Payment was not completed. Your cart has been preserved.';
        setErrorMsg(desc);
        showToast('Payment was not completed. Your cart has been preserved.', 'error');
        setIsLoading(false);
      });
      rzp.open();
    } catch (e: any) {
      console.error('Razorpay popup open error:', e);
      setErrorMsg('Failed to open Razorpay payment gateway. Please try UPI / Bank Transfer.');
      showToast('Failed to open payment gateway.', 'error');
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setErrorMsg('Deployment / Shipping address is required');
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMsg('Contact phone number is required');
      return;
    }
    if (!cart?.items?.length) {
      setErrorMsg('Your cart is empty. Add products before checking out.');
      return;
    }
    if (!totalAmount || totalAmount <= 0) {
      setErrorMsg('Invalid order total amount. Please review your cart.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Create order in Spring Boot backend (Server calculates accurate total from DB)
      const res = await createOrderApi({
        shippingAddress: shippingAddress.trim(),
        contactPhone: contactPhone.trim(),
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to place order.');
      }

      const createdOrder = res.data;

      // 2. Route based on selected payment method
      if (paymentMethod === 'DEMO') {
        const demoRes = await demoPayApi(createdOrder.id);
        if (!demoRes.success) {
          throw new Error(demoRes.message || 'Demo payment confirmation failed.');
        }
        await clearCart();
        showToast('Demo Payment Confirmed! Your software license key has been generated.', 'success');
        router.push(`/my-products?orderId=${createdOrder.id}&newPurchase=true`);
        return;
      } else if (paymentMethod === 'UPI') {
        const upiRes = await initiateUpiPaymentApi(createdOrder.id);
        if (!upiRes.success || !upiRes.data) {
          throw new Error(upiRes.message || 'Failed to initiate UPI payment.');
        }
        setUpiOrderData(upiRes.data);
        setIsLoading(false);
      } else if (paymentMethod === 'COD') {
        const codRes = await initiateCodApi(createdOrder.id);
        if (!codRes.success) {
          throw new Error(codRes.message || 'Failed to confirm Cash on Delivery order.');
        }
        await clearCart();
        showToast('Order confirmed! Cash on Delivery selected.', 'success');
        setSuccessOrderId(createdOrder.id);
        setIsSuccessSubmitted(true);
        setIsLoading(false);
      } else if (paymentMethod === 'RAZORPAY') {
        const paymentRes = await createPaymentOrderApi(createdOrder.id);
        if (!paymentRes.success || !paymentRes.data) {
          throw new Error(paymentRes.message || 'Failed to initiate Razorpay payment order.');
        }
        await processRazorpayCheckout(createdOrder.id, paymentRes.data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while creating your order.');
      showToast(err.message || 'Failed to place order', 'error');
      setIsLoading(false);
    }
  };

  const handleAutoVerifyDemoUtr = async () => {
    if (!upiOrderData) return;
    setIsSubmittingUtr(true);
    try {
      const randomUtr = 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000);
      setUtrNumber(randomUtr);
      await submitUtrApi({
        orderId: upiOrderData.orderId,
        utr: randomUtr,
        payerUpiId: payerUpiId || 'demo@okhdfcbank',
        payerName: payerName || customerName || 'Demo Customer',
      });
      await clearCart();
      showToast('Payment reference submitted! Order is awaiting admin verification.', 'success');
      setSuccessOrderId(upiOrderData.orderId);
      setIsSuccessSubmitted(true);
    } catch (err: any) {
      showToast(err.message || 'Verification failed', 'error');
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiOrderData) return;

    const trimmedUtr = utrNumber.trim();
    if (!trimmedUtr || trimmedUtr.length < 6) {
      showToast('Please enter a valid 12-digit UTR or Transaction Reference number.', 'error');
      return;
    }

    setIsSubmittingUtr(true);
    setErrorMsg('');

    try {
      const res = await submitUtrApi({
        orderId: upiOrderData.orderId,
        utr: trimmedUtr,
        payerUpiId: payerUpiId.trim() || undefined,
        payerName: payerName.trim() || customerName || undefined,
      });

      if (!res.success) {
        throw new Error(res.message || 'Failed to submit UTR reference.');
      }

      await clearCart();
      showToast('Payment submitted! Awaiting admin approval.', 'success');
      setSuccessOrderId(upiOrderData.orderId);
      setIsSuccessSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit UTR. Please try again.');
      showToast(err.message || 'UTR submission failed.', 'error');
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Lock className="w-12 h-12 text-sky-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Login Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please log in to complete your checkout process.</p>
          <Link href="/login" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Success Confirmation Screen
  if (isSuccessSubmitted) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-xl mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#0d0d0e]">Order Submitted Successfully!</h1>
            <p className="text-xs text-slate-500 mt-2">
              Order Reference: <span className="font-mono font-bold text-slate-900">#ORD-{successOrderId}</span>
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Next Steps &amp; Verification</span>
            </div>
            <p className="text-slate-600">
              {paymentMethod === 'UPI' ? (
                <>Our administration team is verifying your payment with the banking ledger using UTR <span className="font-mono font-bold text-slate-900">{utrNumber}</span>. Your software licenses and subscriptions will be automatically activated upon admin approval.</>
              ) : paymentMethod === 'COD' ? (
                <>Your order has been recorded for Cash on Delivery. Our dispatch and operations desk will reach out on <span className="font-mono font-bold text-slate-900">{contactPhone}</span>.</>
              ) : (
                <>Your payment was recorded successfully. Software licenses, API keys, and download entitlements will be activated upon admin verification.</>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/my-products"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Go to My Products
            </Link>
            <Link
              href="/orders"
              className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all"
            >
              View Order Status
            </Link>
          </div>
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
              Checkout &amp; Payment
            </h1>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Direct UPI QR / Bank Transfer, Cash on Delivery, or Online Payment Gateway.
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
          
          {/* Main Checkout Area */}
          <div className="lg:col-span-7 space-y-6">

            {/* If UPI Payment is initiated and waiting for UTR */}
            {upiOrderData ? (
              <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-[#0d0d0e] flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-emerald-600" />
                      Scan Dynamic UPI QR Code
                    </h2>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Order #ORD-{upiOrderData.orderId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Scan with any UPI app (Google Pay, PhonePe, Paytm, BHIM, Cred) to transfer exact amount.
                  </p>
                </div>

                {/* QR Code and Bank Details Box */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-52 h-52 bg-white p-2.5 rounded-2xl border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                    {qrCodeUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={qrCodeUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
                    ) : (
                      <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-3 flex-1 w-full text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Payable Amount</span>
                      <span className="text-2xl font-black text-emerald-600 font-mono">
                        {formatInr(upiOrderData.amount)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Verified Merchant / Payee</span>
                      <span className="font-bold text-slate-900 block truncate" title={upiOrderData.merchantName}>
                        {upiOrderData.merchantName}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Bank &amp; Account</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {upiOrderData.bankName}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">UPI ID</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code className="bg-white px-2 py-1 rounded border border-slate-200 font-mono text-[11px] font-bold text-slate-800 select-all">
                          {upiOrderData.upiId}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopy(upiOrderData.upiId, 'UPI ID')}
                          className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                          title="Copy UPI ID"
                        >
                          {copiedField === 'UPI ID' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Mobile UPI Deep Link */}
                    {upiOrderData.upiIntentUri && (
                      <div className="pt-2">
                        <a
                          href={upiOrderData.upiIntentUri}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Open in UPI App</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: UTR Reference Submission Form */}
                <form onSubmit={handleSubmitUtr} className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#0d0d0e]">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">2</span>
                    <span>Submit Payment UTR / Transaction Reference</span>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      After making the payment via your UPI app, enter the <strong>12-digit UPI Ref / UTR number</strong> shown in your bank/app receipt. Your order remains pending until verified by admin.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                      12-Digit UTR / Transaction Reference <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value.trim())}
                      placeholder="e.g. 423589123456"
                      className="w-full px-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-xs font-mono font-bold text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors uppercase tracking-wider"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Your UPI ID / Phone (Optional)
                      </label>
                      <input
                        type="text"
                        value={payerUpiId}
                        onChange={(e) => setPayerUpiId(e.target.value)}
                        placeholder="e.g. user@okhdfcbank"
                        className="w-full px-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Payer / Bank Account Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingUtr || !utrNumber.trim()}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
                  >
                    {isSubmittingUtr ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting UTR Reference...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Payment &amp; Submit UTR</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleAutoVerifyDemoUtr}
                      disabled={isSubmittingUtr}
                      className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Demo Mode: 1-Click Auto-Fill UTR &amp; Activate License</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Step 1: Customer Contact + Payment Method Selection Form */
              <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm">
                
                {/* Demo Basis Pre-fill Notice Banner */}
                <div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-sky-900 font-medium">
                    <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Demo Basis: Test contact and shipping details are pre-loaded for instant testing.</span>
                  </div>
                  <button
                    type="button"
                    onClick={fillDemoDetails}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] uppercase tracking-wider transition-colors shrink-0 shadow-2xs cursor-pointer"
                  >
                    Reset Demo Details
                  </button>
                </div>

                <h2 className="text-lg font-black text-[#0d0d0e] mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-sky-600" />
                  Shipping &amp; Customer Contact
                </h2>

                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                      className="w-full px-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
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

                  {/* Payment Method Selector */}
                  <div className="pt-4 border-t border-slate-100">
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Select Payment Method (INR ₹) <span className="text-rose-500">*</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Option 1: Demo Instant Pay & Activate */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('DEMO')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                          paymentMethod === 'DEMO'
                            ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          ⚡ Instant Demo
                        </span>
                        <Zap className={`w-5 h-5 mb-2 ${paymentMethod === 'DEMO' ? 'text-emerald-600' : 'text-slate-500'}`} />
                        <div className="text-xs font-bold text-slate-900">Demo Quick Pay (₹ INR)</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                          Instant verification &amp; license key auto-generation
                        </div>
                      </button>

                      {/* Option 2: Direct UPI / Bank Transfer */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                          paymentMethod === 'UPI'
                            ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <QrCode className={`w-5 h-5 mb-2 ${paymentMethod === 'UPI' ? 'text-emerald-600' : 'text-slate-500'}`} />
                        <div className="text-xs font-bold text-slate-900">Direct UPI / QR (₹ INR)</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                          Indian Bank QR &amp; UTR verification
                        </div>
                      </button>

                      {/* Option 3: Razorpay Online Gateway */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('RAZORPAY')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          paymentMethod === 'RAZORPAY'
                            ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <CreditCard className={`w-5 h-5 mb-2 ${paymentMethod === 'RAZORPAY' ? 'text-blue-600' : 'text-slate-500'}`} />
                        <div className="text-xs font-bold text-slate-900">Razorpay PG (₹ INR)</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                          Cards, Netbanking &amp; Online
                        </div>
                      </button>

                      {/* Option 4: Cash on Delivery */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          paymentMethod === 'COD'
                            ? 'border-amber-600 bg-amber-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <Truck className={`w-5 h-5 mb-2 ${paymentMethod === 'COD' ? 'text-amber-600' : 'text-slate-500'}`} />
                        <div className="text-xs font-bold text-slate-900">Cash on Delivery (₹ INR)</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                          Pay upon delivery / deployment
                        </div>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !cart?.items?.length || totalAmount <= 0}
                    className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-6 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Initializing Payment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {paymentMethod === 'DEMO'
                            ? `⚡ Demo One-Click Pay & Activate Software (${formattedTotal})`
                            : paymentMethod === 'UPI'
                            ? `Generate UPI QR Code (${formattedTotal})`
                            : paymentMethod === 'COD'
                            ? `Place Cash on Delivery Order (${formattedTotal})`
                            : `Pay with Razorpay (${formattedTotal})`}
                        </span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* Cart & Summary Sidebar (Amount Breakdown Section) */}
          <div className="lg:col-span-5" id="amount-breakdown-section">
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4 sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-black text-[#0d0d0e]">
                  Amount Breakdown ({cart?.items?.length || 0} items)
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  INR (₹) Standard
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                {cart?.items?.map((item) => {
                  const unitPrice = getSafeCartItemUnitPrice(item);
                  return (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-[#0d0d0e]">{item.product?.name || `Product #${item.id}`}</div>
                        {item.productPlan && (
                          <div className="text-[10px] text-sky-700 font-mono font-medium">Plan: {item.productPlan.name}</div>
                        )}
                        <div className="text-[10px] text-slate-500 font-mono">
                          Qty: {item.quantity} x {formatInr(unitPrice)}
                        </div>
                      </div>
                      <div className="font-black text-[#0d0d0e] font-mono">
                        {formatInr(unitPrice * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between font-extrabold text-[#0d0d0e]">
                  <span>Total Amount Payable</span>
                  <span className="text-lg text-emerald-600 font-mono font-black">{formattedTotal}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  All prices in Indian Rupees (₹ INR) inclusive of applicable taxes.
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Server-Side Verified Price &amp; Entitlement Security.</span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

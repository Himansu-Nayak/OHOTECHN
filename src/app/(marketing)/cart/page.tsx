'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Activity, 
  GraduationCap, 
  Store, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Landmark, 
  Loader2,
  ExternalLink
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getSafeCartItemUnitPrice, formatInr } from '@/utils/cartUtils';

const POPULAR_CATEGORIES = [
  {
    name: 'Healthcare & Hospital EMR',
    desc: 'Clinical OPD/IPD, Pharmacy & Lab billing software.',
    icon: Activity,
    color: 'text-rose-600 bg-rose-50 border-rose-100',
    categoryId: 2,
  },
  {
    name: 'Education & School ERP',
    desc: 'Student admissions, fees, exams & attendance management.',
    icon: GraduationCap,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    categoryId: 1,
  },
  {
    name: 'Retail, POS & Inventory',
    desc: 'High-speed barcode billing, inventory & multi-store sync.',
    icon: Store,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    categoryId: 4,
  },
  {
    name: 'Enterprise ERP & Accounting',
    desc: 'Complete financial ledger, GST filing & payroll systems.',
    icon: Building2,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    categoryId: 3,
  },
];

export default function CartPage() {
  const { user } = useAuth();
  const { cart, itemCount, totalAmount, loading, updateQuantity, removeItem, clearCart } = useCart();
  const [updatingItemId, setUpdatingItemId] = React.useState<number | null>(null);

  const formattedTotal = formatInr(totalAmount);

  const handleQuantityChange = async (itemId: number, newQty: number) => {
    setUpdatingItemId(itemId);
    try {
      await updateQuantity(itemId, newQty);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setUpdatingItemId(itemId);
    try {
      await removeItem(itemId);
    } finally {
      setUpdatingItemId(null);
    }
  };

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-20 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-5xl w-full mx-auto" id="cart-main">
        
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
              <Link href="/products" className="hover:text-sky-600 transition-colors">Catalog</Link>
              <span>/</span>
              <span className="text-slate-900">Cart</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
              Shopping Cart
            </h1>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Review your selected enterprise software products, single-tenant instances, and node-locked licenses.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors self-start sm:self-auto py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Browsing</span>
          </Link>
        </div>

        {!user ? (
          /* Unauthenticated Prompt */
          <div className="space-y-12">
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-8 sm:p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-5 border border-sky-100">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-[#0d0d0e] mb-2">Login Required to View Cart</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
                Sign in to your verified OHO TECH account to retrieve your synchronized shopping cart, active software licenses, and secure checkout sessions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xs mx-auto">
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors shadow-sm text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors text-center"
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* Popular Catalog Shortcuts */}
            <div>
              <div className="text-center mb-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Or Explore Verified Software Suites</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {POPULAR_CATEGORIES.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={idx}
                      href={`/products`}
                      className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-500 hover:shadow-md transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${cat.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-black text-[#0d0d0e] group-hover:text-sky-600 transition-colors mb-1">
                          {cat.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {cat.desc}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-sky-600 mt-4">
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : !cart || !cart.items || cart.items.length === 0 ? (
          /* Empty Cart State */
          <div className="space-y-12">
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-8 sm:p-14 text-center shadow-sm">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-5 border border-slate-200">
                <ShoppingBag className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-2xl font-black text-[#0d0d0e] mb-2">Your Cart is Currently Empty</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
                You haven't added any turnkey software applications, enterprise licenses, or single-tenant cloud deployments to your order yet.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/products"
                  className="px-8 py-3.5 rounded-full bg-[#0d0d0e] text-white text-xs font-extrabold uppercase tracking-wider hover:bg-sky-600 transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Browse Products Catalog</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="px-8 py-3.5 rounded-full border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>

            {/* Turnkey Features Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0d0d0e] mb-0.5">Turnkey Onboarding</h4>
                  <p className="text-[11px] text-slate-500">Automated setup on your private VPS or cloud server within hours.</p>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0d0d0e] mb-0.5">Hardware Node-Locking</h4>
                  <p className="text-[11px] text-slate-500">Cryptographically bound license keys to guarantee unauthorized execution prevention.</p>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0d0d0e] mb-0.5">GST Compliant Invoicing</h4>
                  <p className="text-[11px] text-slate-500">Tax invoices with B2B input tax credit immediately issued upon payment.</p>
                </div>
              </div>
            </div>

            {/* Popular Catalog Shortcuts */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Explore Enterprise Solutions</h3>
                <Link href="/products" className="text-xs font-bold text-sky-600 hover:underline">View All &rarr;</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {POPULAR_CATEGORIES.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={idx}
                      href={`/products`}
                      className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-500 hover:shadow-md transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${cat.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-black text-[#0d0d0e] group-hover:text-sky-600 transition-colors mb-1">
                          {cat.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {cat.desc}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-sky-600 mt-4">
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between px-2 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                <span>Items in Order ({itemCount})</span>
                <button
                  onClick={clearCart}
                  disabled={loading}
                  className="text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 text-[11px] font-bold disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                </button>
              </div>

              {cart.items.map((item) => {
                const unitPrice = getSafeCartItemUnitPrice(item);
                const itemTotal = formatInr(unitPrice * item.quantity);
                const isUpdating = updatingItemId === item.id || loading;

                return (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-slate-200 rounded-[28px] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm transition-all hover:border-slate-300"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider">
                          {item.product?.serviceType || 'SOFTWARE'}
                        </span>
                        {item.productPlan && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                            Plan: {item.productPlan.name}
                          </span>
                        )}
                      </div>
                      
                      <Link
                        href={item.product?.id ? `/products/${item.product.id}` : '/products'}
                        className="text-base font-extrabold text-[#0d0d0e] hover:text-sky-600 transition-colors inline-block group"
                      >
                        <span>{item.product?.name || `Software Package #${item.id}`}</span>
                        <ExternalLink className="inline-block w-3.5 h-3.5 ml-1.5 text-slate-400 group-hover:text-sky-600 transition-colors" />
                      </Link>

                      <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                        {item.product?.description || 'Enterprise single-tenant deployment package.'}
                      </p>
                      
                      <div className="text-[11px] font-mono text-slate-400 mt-2">
                        Unit Price: <span className="font-bold text-slate-700">{formatInr(unitPrice)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                      {/* Quantity Stepper with 44px Touch Targets */}
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-2xl p-1">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={isUpdating}
                          aria-label="Decrease quantity"
                          className="w-10 h-10 rounded-xl bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold transition-colors disabled:opacity-50 shadow-xs"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <div className="w-10 text-center text-xs font-black text-[#0d0d0e] flex items-center justify-center">
                          {isUpdating && updatingItemId === item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" />
                          ) : (
                            <span>{item.quantity}</span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={isUpdating}
                          aria-label="Increase quantity"
                          className="w-10 h-10 rounded-xl bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold transition-colors disabled:opacity-50 shadow-xs"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right min-w-[110px]">
                        <div className="text-base font-black text-[#0d0d0e]">{itemTotal}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {item.quantity} unit{item.quantity > 1 ? 's' : ''}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isUpdating}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                        title="Remove Item from Cart"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center gap-3 text-xs text-sky-800">
                <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
                <span>
                  Licenses and download packages are automatically prepared and provisioned in your Customer Dashboard immediately upon payment completion.
                </span>
              </div>
            </div>

            {/* Order Summary Sticky Card */}
            <div className="lg:col-span-4">
              <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6 sticky top-28">
                <h2 className="text-lg font-black text-[#0d0d0e] border-b border-slate-100 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3.5 text-xs font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                    <span className="font-bold text-[#0d0d0e]">{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cloud Deployment &amp; Setup</span>
                    <span className="font-bold text-emerald-600 uppercase text-[11px] tracking-wide">Included Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hardware Node-Lock Key</span>
                    <span className="font-bold text-emerald-600 uppercase text-[11px] tracking-wide">Included Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes &amp; GST</span>
                    <span className="font-bold text-slate-400 text-[11px]">Calculated at Checkout</span>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-sm font-black text-[#0d0d0e]">Order Total</span>
                    <span className="text-2xl font-black text-[#0d0d0e]">{formattedTotal}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 px-6 rounded-2xl bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group min-h-[48px]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Payment Options Trust Badges */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider text-center">
                    Accepted Secure Payment Methods
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-700 flex flex-col items-center justify-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-sky-600" />
                      <span>Cards / UPI</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-700 flex flex-col items-center justify-center gap-1">
                      <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                      <span>NEFT / RTGS</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-700 flex flex-col items-center justify-center gap-1">
                      <QrCode className="w-3.5 h-3.5 text-purple-600" />
                      <span>Instant QR</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 256-Bit SSL Encrypted Checkout
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

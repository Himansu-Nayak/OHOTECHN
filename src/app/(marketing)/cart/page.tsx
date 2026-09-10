'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, ArrowRight, Plus, Minus, ArrowLeft, ShieldCheck, Lock, Layers, Zap, CheckCircle2 } from 'lucide-react';
import { useCart, getCartItemUnitPrice, getCartItemSubtotal } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, itemCount, totalAmount, loading, updateQuantity, removeItem, clearCart } = useCart();

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(totalAmount);

  // Tax preview (Standard Indian B2B SaaS 18% GST display)
  const gstAmount = totalAmount > 0 ? totalAmount * 0.18 : 0;
  const grandTotal = totalAmount + gstAmount;

  const formattedGrandTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(grandTotal);

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-5xl w-full mx-auto" id="cart-main">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200 uppercase tracking-widest">
                Review &amp; Provisioning
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
              Software Shopping Cart
            </h1>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Review your selected enterprise applications, subscription tiers, and developer licenses.
            </p>
          </div>

          <Link
            href="/products"
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {!user ? (
          /* Unauthenticated Prompt */
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-8 sm:p-12 text-center my-6 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto mb-4 text-sky-600">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">Sign In to Manage Your Cart</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Please sign in to your verified OHO TECH account to manage items, access reserved plan pricing, and proceed to checkout.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/login?redirect=/cart"
                className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors shadow-sm"
              >
                Sign In
              </Link>
              <Link
                href="/register?redirect=/cart"
                className="px-6 py-3 rounded-full border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : !cart || !cart.items || cart.items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-8 sm:p-12 text-center my-6 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">Your Cart is Currently Empty</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Explore our catalogue of enterprise software systems, cloud APIs, and developer suites to get started.
            </p>
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-block shadow-sm"
            >
              Explore Products Catalog
            </Link>
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between px-2 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                <span>Selected Items ({itemCount})</span>
                <button
                  onClick={clearCart}
                  disabled={loading}
                  className="text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All Items
                </button>
              </div>

              {cart.items.map((item) => {
                const unitPrice = getCartItemUnitPrice(item);
                const itemTotal = getCartItemSubtotal(item);
                const formattedItemTotal = new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 2,
                }).format(itemTotal);

                const formattedUnitPrice = new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 2,
                }).format(unitPrice);

                return (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-slate-200 hover:border-slate-300 rounded-[28px] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider">
                          {item.product?.serviceType || 'Software'}
                        </span>
                        {item.productPlan && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
                            <Zap className="w-3 h-3 text-emerald-600" />
                            {item.productPlan.name} ({item.productPlan.billingType})
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-[#0d0d0e] truncate">
                        {item.product?.name || `Product #${item.id}`}
                      </h3>

                      {item.productPlan?.description && (
                        <p className="text-xs text-emerald-800 font-medium mt-0.5">
                          {item.productPlan.description}
                        </p>
                      )}

                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {item.product?.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-5 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 shrink-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={loading}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs transition-colors shadow-xs disabled:opacity-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-black text-[#0d0d0e]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={loading}
                          aria-label="Increase quantity"
                          className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs transition-colors shadow-xs disabled:opacity-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-[100px]">
                        <div className="text-sm font-black text-[#0d0d0e]">{formattedItemTotal}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {formattedUnitPrice} / unit
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={loading}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-rose-50"
                        title="Remove Item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Right Card */}
            <div className="lg:col-span-4">
              <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6 sticky top-28">
                <h2 className="text-lg font-black text-[#0d0d0e] border-b border-slate-100 pb-4">
                  Cart Summary
                </h2>

                <div className="space-y-3 text-xs font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Subtotal</span>
                    <span className="font-bold text-[#0d0d0e]">{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>License Provisioning</span>
                    <span className="font-bold text-emerald-600">INCLUDED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Applicable GST (18%)</span>
                    <span className="font-bold text-slate-700">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(gstAmount)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-black text-[#0d0d0e]">Estimated Total</span>
                      <p className="text-[10px] text-slate-400 font-normal">Final total verified by backend</p>
                    </div>
                    <span className="text-xl font-black text-[#0d0d0e]">{formattedGrandTotal}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 px-6 rounded-2xl bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Instant digital license key &amp; installer access</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>Verified Razorpay test payment gateway</span>
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

'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, ArrowRight, Plus, Minus, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, itemCount, totalAmount, loading, updateQuantity, removeItem, clearCart } = useCart();

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(totalAmount);

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-5xl w-full mx-auto" id="cart-main">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
              Shopping Cart
            </h1>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Review your selected software products and cloud licenses.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {!user ? (
          /* Unauthenticated Prompt */
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-6 shadow-sm">
            <Lock className="w-12 h-12 text-sky-600 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">Login Required to View Cart</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Please sign in to your OHO TECH account to view saved cart items and proceed with checkout.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/login"
                className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 rounded-full border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : !cart || !cart.items || cart.items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-6 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">Your Cart is Empty</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              You haven't added any software applications or licenses to your cart yet.
            </p>
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-block"
            >
              Browse Products Catalog
            </Link>
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between px-2 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                <span>Items ({itemCount})</span>
                <button
                  onClick={clearCart}
                  disabled={loading}
                  className="text-rose-600 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                </button>
              </div>

              {cart.items.map((item) => {
                const itemTotal = new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                }).format(item.price * item.quantity);

                return (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-slate-200 rounded-[28px] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider">
                        {item.product?.serviceType || 'Product'}
                      </span>
                      <h3 className="text-base font-extrabold text-[#0d0d0e] mt-1">
                        {item.product?.name || `Product #${item.id}`}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {item.product?.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={loading}
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-[#0d0d0e]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={loading}
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-[90px]">
                        <div className="text-sm font-black text-[#0d0d0e]">{itemTotal}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          ₹{item.price} x {item.quantity}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={loading}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove Item"
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
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#0d0d0e]">{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cloud Deployment &amp; Setup</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="font-bold text-slate-400">Calculated at Checkout</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-sm font-black text-[#0d0d0e]">Total</span>
                    <span className="text-xl font-black text-[#0d0d0e]">{formattedTotal}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 px-6 rounded-2xl bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure SSL Checkout
                </div>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

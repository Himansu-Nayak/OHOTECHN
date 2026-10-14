'use client';

import * as React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { Cart } from '@/api/types/order.types';
import { getSafeCartItemUnitPrice, formatInr } from '@/utils/cartUtils';

export interface CheckoutAmountBreakdownProps {
  cart: Cart | null;
  formattedTotal: string;
}

export function CheckoutAmountBreakdown({
  cart,
  formattedTotal,
}: CheckoutAmountBreakdownProps) {
  const itemCount = cart?.items?.length || 0;

  return (
    <div className="lg:col-span-5" id="amount-breakdown-section">
      <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4 sticky top-28">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-black text-[#0d0d0e]">
            Amount Breakdown ({itemCount} {itemCount === 1 ? 'item' : 'items'})
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
  );
}

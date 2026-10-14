import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, ShieldCheck, QrCode } from 'lucide-react';
import Link from 'next/link';

export interface PaymentStatusFeedbackProps {
  status: 'SUCCESS' | 'FAILED' | 'CANCELLED';
  orderId?: number | string | null;
  paymentMethod?: string;
  utrNumber?: string;
  contactPhone?: string;
  errorMessage?: string;
  onRetry?: () => void;
  onSwitchToUpi?: () => void;
}

export const PaymentStatusFeedback: React.FC<PaymentStatusFeedbackProps> = ({
  status,
  orderId,
  paymentMethod,
  utrNumber,
  contactPhone,
  errorMessage,
  onRetry,
  onSwitchToUpi,
}) => {
  const isSuccess = status === 'SUCCESS';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-xl mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 text-center shadow-sm space-y-6"
      >
        {isSuccess ? (
          <>
            {/* Success Icon Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-xs"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>

            <div>
              <h2 className="text-2xl font-black text-[#0d0d0e]">Order Submitted Successfully!</h2>
              {orderId && (
                <p className="text-xs text-slate-500 mt-2">
                  Order Reference: <span className="font-mono font-bold text-slate-900">#ORD-{orderId}</span>
                </p>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Next Steps &amp; Verification</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
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
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Go to My Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/orders"
                className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all"
              >
                View Order Status
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Failure / Alert Icon Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.15, 1], rotate: [0, -6, 6, 0] }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-rose-600 mx-auto shadow-xs"
            >
              <AlertTriangle className="w-9 h-9" />
            </motion.div>

            <div>
              <h2 className="text-2xl font-black text-[#0d0d0e]">
                {status === 'CANCELLED' ? 'Payment Cancelled' : 'Payment Not Completed'}
              </h2>
              <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                {errorMessage || 'Your transaction could not be processed by the gateway. Your cart has been preserved.'}
              </p>
            </div>

            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-left space-y-1 text-xs text-amber-900">
              <div className="font-bold flex items-center gap-1.5">
                <span>Safe Recovery Options:</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                You can retry using the same method, or switch to Direct UPI QR / Indian Bank Transfer for guaranteed zero gateway dropoffs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Payment</span>
                </button>
              )}

              {onSwitchToUpi && (
                <button
                  type="button"
                  onClick={onSwitchToUpi}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Pay via Direct UPI QR</span>
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

'use client';

import * as React from 'react';
import { 
  CreditCard, ShieldCheck, Key, Lock, CheckCircle2, 
  AlertTriangle, RefreshCw, Zap, DollarSign, Globe,
  Building2, Check, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { getAdminPaymentsApi } from '@/api/payments';
import { Payment } from '@/api/types';
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  StatusBadge,
  AdminEmptyState,
  AdminTableSkeleton
} from './AdminUiPrimitives';

export function AdminGatewaysView() {
  const { showToast } = useToast();
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchGatewayActivity = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAdminPaymentsApi();
      if (res.success && res.data) {
        setPayments(res.data);
      }
    } catch (err: any) {
      console.warn('Gateway payments check warning:', err?.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchGatewayActivity();
  }, [fetchGatewayActivity]);

  const settledCount = payments.filter((p) => p.status === 'COMPLETED').length;
  const totalVolume = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Payment Gateways &amp; Settlement Architecture</h1>
            <AdminBadge variant="success">Environment Secured</AdminBadge>
          </div>
          <p className="text-sm text-slate-500">
            Server-side encrypted payment processing, signature verification, and settlement ledger.
          </p>
        </div>

        <AdminButton
          variant="secondary"
          size="sm"
          onClick={() => {
            fetchGatewayActivity();
            showToast('Gateway ledger synchronized.', 'success');
          }}
          disabled={isLoading}
          leftIcon={<RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />}
        >
          Sync Gateway Status
        </AdminButton>
      </div>

      {/* Operational Volume Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminCard className="p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Primary Gateway</div>
          <p className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Razorpay Payments</span>
          </p>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Spring Boot SDK Configured</span>
          </p>
        </AdminCard>

        <AdminCard className="p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Settled Volume</div>
          <p className="text-lg font-bold text-emerald-600 mt-1">
            ₹{totalVolume.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            <span>{settledCount} completed transactions in DB</span>
          </p>
        </AdminCard>

        <AdminCard className="p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Architecture</div>
          <p className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-600" />
            <span>HMAC-SHA256</span>
          </p>
          <p className="text-xs text-slate-500 mt-2">
            <span>Server signature verification</span>
          </p>
        </AdminCard>
      </div>

      {/* Primary Gateway Specification */}
      <AdminCard className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Razorpay Standard Merchant Gateway</h3>
              <p className="text-xs text-slate-500">Production Payment Gateway for Turnkey Software &amp; Digital Solutions</p>
            </div>
          </div>
          <AdminBadge variant="primary">Configured Gateway</AdminBadge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Processing Specifications</p>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Supported Currency:</span>
                <span className="font-bold text-slate-900 font-mono">INR (₹)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Verification Endpoint:</span>
                <span className="font-mono text-slate-900">POST /api/payments/verify</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Order Creation Endpoint:</span>
                <span className="font-mono text-slate-900">POST /api/payments/create-order</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Credential Source:</span>
                <span className="text-emerald-700 font-mono font-medium">VPS Environment Variables</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Supported Payment Instruments</p>
            <ul className="space-y-1.5 text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant UPI (Google Pay, PhonePe, Paytm, BHIM AutoPay)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Debit &amp; Credit Cards (RuPay, Visa, Mastercard, American Express)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Net Banking (50+ Leading Commercial &amp; PSU Banks)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Corporate Invoicing with Auto-Generated OpenPDF Tax Receipts</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold">Security Notice:</strong> Payment gateway API secrets are managed directly on the production VPS via <code className="font-mono text-amber-900 bg-amber-100/80 px-1 py-0.5 rounded">RAZORPAY_KEY_ID</code> and <code className="font-mono text-amber-900 bg-amber-100/80 px-1 py-0.5 rounded">RAZORPAY_KEY_SECRET</code>. Browser credential exposure is strictly prevented.
          </p>
        </div>
      </AdminCard>

      {/* Enterprise Direct Wire / B2B Settlement */}
      <AdminCard className="p-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Institutional Direct Bank Wire (RTGS / NEFT)</h3>
            <p className="text-xs text-slate-500">Direct Treasury Settlement for High-Value Enterprise Deployments</p>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          For large turnkey contracts and institutional orders exceeding standard online card limits, payments are processed via corporate bank remittance with manual accountant reconciliation and invoice matching.
        </p>
      </AdminCard>
    </div>
  );
}

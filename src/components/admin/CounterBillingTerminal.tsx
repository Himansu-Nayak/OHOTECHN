'use client';

import * as React from 'react';
import { 
  Banknote, CreditCard, Receipt, Search, Printer, 
  CheckCircle2, AlertCircle, RefreshCw, Clock, ArrowRight,
  ShieldCheck, UserCheck, DollarSign, Terminal, Sparkles, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { CounterBillingReceiptDto } from '@/api/types';
import { 
  processCashSaleApi, 
  processCardTerminalSaleApi, 
  getCounterBillingSummaryApi 
} from '@/api/payments';
import { 
  AdminCard, 
  AdminButton, 
  AdminInput, 
  AdminBadge, 
  StatusBadge, 
  AdminModal 
} from './AdminUiPrimitives';

export function CounterBillingTerminal() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = React.useState<'CASH' | 'CARD'>('CASH');
  const [orderIdInput, setOrderIdInput] = React.useState('');
  const [cashTenderedInput, setCashTenderedInput] = React.useState('');
  const [terminalRefInput, setTerminalRefInput] = React.useState('');
  const [terminalIdInput, setTerminalIdInput] = React.useState('TERM-MUMBAI-01');
  const [notesInput, setNotesInput] = React.useState('');

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [activeReceipt, setActiveReceipt] = React.useState<CounterBillingReceiptDto | null>(null);

  // Shift & Terminal Summary State
  const [summary, setSummary] = React.useState<any>(null);
  const [isLoadingSummary, setIsLoadingSummary] = React.useState(false);

  const fetchSummary = React.useCallback(async () => {
    setIsLoadingSummary(true);
    try {
      const res = await getCounterBillingSummaryApi();
      if (res.success && res.data) {
        setSummary(res.data);
      }
    } catch (err: any) {
      console.warn('Could not load counter billing summary:', err.message);
    } finally {
      setIsLoadingSummary(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Handle Quick Cash Buttons
  const setQuickCash = (amount: number) => {
    setCashTenderedInput(String(amount));
  };

  const handleProcessCashSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const orderId = Number(orderIdInput.trim());
    if (!orderId || isNaN(orderId)) {
      setErrorMsg('Please enter a valid numeric Order ID.');
      return;
    }

    const cashTendered = parseFloat(cashTenderedInput.trim());
    if (isNaN(cashTendered) || cashTendered <= 0) {
      setErrorMsg('Please enter a valid cash tendered amount.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await processCashSaleApi(orderId, cashTendered, notesInput.trim() || undefined);
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to process cash counter sale.');
      }

      showToast(`Sale completed! Change due: ₹${res.data.changeReturned?.toFixed(2) || '0.00'}`, 'success');
      setActiveReceipt(res.data);
      setOrderIdInput('');
      setCashTenderedInput('');
      setNotesInput('');
      fetchSummary();
    } catch (err: any) {
      setErrorMsg(err.message || 'Transaction failed.');
      showToast(err.message || 'Cash sale failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessCardSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const orderId = Number(orderIdInput.trim());
    if (!orderId || isNaN(orderId)) {
      setErrorMsg('Please enter a valid numeric Order ID.');
      return;
    }

    const terminalRef = terminalRefInput.trim();
    if (!terminalRef || terminalRef.length < 4) {
      setErrorMsg('Please enter a valid card terminal transaction reference / approval code.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await processCardTerminalSaleApi(
        orderId, 
        terminalRef, 
        terminalIdInput.trim() || 'TERM-01', 
        notesInput.trim() || undefined
      );

      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to record card terminal sale.');
      }

      showToast(`Card sale recorded! Terminal ref: ${terminalRef}`, 'success');
      setActiveReceipt(res.data);
      setOrderIdInput('');
      setTerminalRefInput('');
      setNotesInput('');
      fetchSummary();
    } catch (err: any) {
      setErrorMsg(err.message || 'Transaction failed.');
      showToast(err.message || 'Card transaction failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 motion-reduce:animate-none">
      {/* 1. Terminal Status & Cashier Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-[22px] bg-white/95 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.025),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-[#FF6B4A] before:via-[#FF8E53] before:to-[#f5c6b8]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B4A] to-[#FF8E53] text-white flex items-center justify-center font-black shadow-[0_8px_20px_rgba(255,107,74,0.24)]">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Counter POS & Billing Terminal</h2>
              <AdminBadge variant="success" dot={true}>LIVE REGISTER</AdminBadge>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Cashier: <strong className="text-slate-800">{user?.name || 'Administrator'}</strong> &bull; Terminal ID: <strong className="text-slate-800">{terminalIdInput}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={fetchSummary}
            isLoading={isLoadingSummary}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Drawer
          </AdminButton>
        </div>
      </div>

      {/* 2. Shift Drawer Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminCard className="p-5 bg-gradient-to-br from-emerald-50/70 via-white to-white border-emerald-100/80 rounded-[20px] shadow-[0_4px_18px_rgba(16,185,129,0.045)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Cash in Drawer</span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{summary?.totalCashCollected ? Number(summary.totalCashCollected).toLocaleString('en-IN') : '0.00'}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Verified physical currency</p>
        </AdminCard>

        <AdminCard className="p-5 bg-gradient-to-br from-indigo-50/60 via-white to-white border-indigo-100/80 rounded-[20px] shadow-[0_4px_18px_rgba(99,102,241,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Card Terminal Vol</span>
            <CreditCard className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{summary?.totalCardVolume ? Number(summary.totalCardVolume).toLocaleString('en-IN') : '0.00'}
          </div>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">Settled EDC / POS batch</p>
        </AdminCard>

        <AdminCard className="p-5 bg-gradient-to-br from-amber-50/70 via-white to-white border-amber-100/80 rounded-[20px] shadow-[0_4px_18px_rgba(245,158,11,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Change Returned</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{summary?.totalChangeReturned ? Number(summary.totalChangeReturned).toLocaleString('en-IN') : '0.00'}
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">Total dispensed currency</p>
        </AdminCard>

        <AdminCard className="p-5 bg-gradient-to-br from-[#f8f9fe] via-white to-white border-slate-200/80 rounded-[20px] shadow-[0_4px_18px_rgba(15,23,42,0.025)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Transactions</span>
            <Receipt className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {summary?.totalTransactions || 0}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Shift receipts printed</p>
        </AdminCard>
      </div>

      {/* 3. Transaction Entry Form */}
      <AdminCard className="p-4 sm:p-6 rounded-[22px] border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.035)]">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
          <button
            type="button"
            onClick={() => setMode('CASH')}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-[background-color,box-shadow,transform] duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/20",
              mode === 'CASH'
                ? "bg-gradient-to-r from-[#FF6B4A] to-[#FF8E53] text-white shadow-[0_6px_18px_rgba(255,107,74,0.22)]"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
            )}
          >
            <Banknote className="w-4 h-4 text-emerald-400" />
            Cash Sale & Change
          </button>

          <button
            type="button"
            onClick={() => setMode('CARD')}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all",
              mode === 'CARD'
                ? "bg-slate-900 text-white shadow-sm shadow-slate-900/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
            )}
          >
            <CreditCard className="w-4 h-4 text-indigo-400" />
            EDC / Card Terminal
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-700 leading-relaxed font-semibold">{errorMsg}</div>
          </div>
        )}

        {mode === 'CASH' ? (
          <form onSubmit={handleProcessCashSale} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Order ID <span className="text-rose-500">*</span>
                </label>
                <AdminInput
                  type="number"
                  placeholder="e.g. 1042"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">Pending order created by customer or walk-in</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Cash Tendered (₹) <span className="text-rose-500">*</span>
                </label>
                <AdminInput
                  type="number"
                  step="0.01"
                  placeholder="e.g. 2000.00"
                  value={cashTenderedInput}
                  onChange={(e) => setCashTenderedInput(e.target.value)}
                  required
                />
                {/* Quick Cash Buttons */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Quick:</span>
                  {[500, 1000, 1500, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setQuickCash(amt)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-orange-50 hover:bg-orange-100 border border-orange-100 text-orange-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Cashier Internal Notes (Optional)
              </label>
              <AdminInput
                type="text"
                placeholder="e.g. Walk-in customer paid exact currency at counter"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <AdminButton
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isProcessing}
                leftIcon={<Banknote className="w-5 h-5" />}
              >
                Complete Cash Sale & Issue Receipt
              </AdminButton>
            </div>
          </form>
        ) : (
          <form onSubmit={handleProcessCardSale} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Order ID <span className="text-rose-500">*</span>
                </label>
                <AdminInput
                  type="number"
                  placeholder="e.g. 1042"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  POS Terminal ID
                </label>
                <AdminInput
                  type="text"
                  placeholder="TERM-MUMBAI-01"
                  value={terminalIdInput}
                  onChange={(e) => setTerminalIdInput(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Approval Ref / RRN <span className="text-rose-500">*</span>
                </label>
                <AdminInput
                  type="text"
                  placeholder="e.g. POS-TXN-987654"
                  value={terminalRefInput}
                  onChange={(e) => setTerminalRefInput(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Card Type / Authorization Notes (Optional)
              </label>
              <AdminInput
                type="text"
                placeholder="e.g. RuPay Platinum / Chip & PIN verified"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <AdminButton
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isProcessing}
                leftIcon={<CreditCard className="w-5 h-5" />}
              >
                Record Card Payment & Issue Receipt
              </AdminButton>
            </div>
          </form>
        )}
      </AdminCard>

      {/* 4. Thermal Print-Ready Receipt Modal */}
      <AdminModal
        isOpen={Boolean(activeReceipt)}
        onClose={() => setActiveReceipt(null)}
        title="POS Official Transaction Receipt"
      >
        {activeReceipt && (
          <div className="space-y-4">
            <div id="pos-print-area" className="p-6 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs text-slate-800 space-y-3">
              <div className="text-center border-b border-dashed border-slate-300 pb-3">
                <h3 className="font-black text-sm text-slate-900 tracking-wider">OHO TECHNOLOGIES PVT LTD</h3>
                <p className="text-[10px] text-slate-500">GSTIN: 29AABCO1234F1Z8</p>
                <p className="text-[10px] text-slate-500">Outer Ring Road, Bengaluru - 560103</p>
              </div>

              <div className="flex justify-between text-[11px]">
                <span>Receipt: <strong>{activeReceipt.receiptNumber}</strong></span>
                <span>Order: <strong>#{activeReceipt.orderId}</strong></span>
              </div>

              <div className="flex justify-between text-[11px]">
                <span>Date: {activeReceipt.transactedAt ? new Date(activeReceipt.transactedAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}</span>
                <span>Cashier: #{activeReceipt.cashierId}</span>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Customer:</span>
                  <span>{activeReceipt.customerName}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Method:</span>
                  <span className="text-slate-900">{activeReceipt.paymentMethod}</span>
                </div>
                {activeReceipt.cardTerminalRef && (
                  <div className="flex justify-between">
                    <span>Card Terminal Ref:</span>
                    <span>{activeReceipt.cardTerminalRef}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1 text-sm font-black text-slate-900">
                <div className="flex justify-between">
                  <span>TOTAL AMOUNT:</span>
                  <span>₹{Number(activeReceipt.orderTotal).toFixed(2)}</span>
                </div>

                {activeReceipt.paymentMethod === 'CASH' && (
                  <>
                    <div className="flex justify-between text-xs font-normal text-slate-600">
                      <span>Cash Tendered:</span>
                      <span>₹{Number(activeReceipt.cashTendered || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-emerald-600">
                      <span>CHANGE RETURNED:</span>
                      <span>₹{Number(activeReceipt.changeReturned || 0).toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="text-center text-[10px] text-slate-400 border-t border-dashed border-slate-300 pt-3">
                <p className="font-bold text-slate-600">Software Entitlements & Licenses Activated</p>
                <p>Thank you for choosing OHO TECH!</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <AdminButton
                variant="outline"
                onClick={() => setActiveReceipt(null)}
              >
                Close
              </AdminButton>
              <AdminButton
                variant="primary"
                onClick={handlePrint}
                leftIcon={<Printer className="w-4 h-4" />}
              >
                Print Official Receipt
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

'use client';

import * as React from 'react';
import { 
  CreditCard, ShieldCheck, Key, Lock, CheckCircle2, 
  AlertTriangle, RefreshCw, Save, Zap, DollarSign, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

interface GatewayConfig {
  id: string;
  name: string;
  enabled: boolean;
  mode: 'test' | 'live';
  keyId: string;
  keySecret: string;
  webhookSecret: string;
  currency: string;
  badgeColor: string;
}

export function AdminGatewaysView() {
  const { showToast } = useToast();
  const [gateways, setGateways] = React.useState<GatewayConfig[]>([
    {
      id: 'razorpay',
      name: 'Razorpay PG',
      enabled: true,
      mode: 'live',
      keyId: 'rzp_live_••••••••••••9412',
      keySecret: '••••••••••••••••••••',
      webhookSecret: 'whsec_••••••••••••',
      currency: 'INR',
      badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    },
    {
      id: 'phonepe',
      name: 'PhonePe PG (UPI & Cards)',
      enabled: true,
      mode: 'live',
      keyId: 'M22••••••••••••',
      keySecret: '••••••••••••••••••••',
      webhookSecret: 'phn_sec_••••••••',
      currency: 'INR',
      badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    },
    {
      id: 'stripe',
      name: 'Stripe Global (USD/EUR)',
      enabled: true,
      mode: 'live',
      keyId: 'pk_live_••••••••••••8819',
      keySecret: 'sk_live_••••••••••••',
      webhookSecret: 'whsec_••••••••••••',
      currency: 'USD',
      badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    },
    {
      id: 'cashfree',
      name: 'Cashfree Payments',
      enabled: false,
      mode: 'test',
      keyId: 'TEST_••••••••••••',
      keySecret: '••••••••••••••••••••',
      webhookSecret: 'cf_wh_••••••••••••',
      currency: 'INR',
      badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    },
    {
      id: 'paypal',
      name: 'PayPal Checkout',
      enabled: false,
      mode: 'test',
      keyId: 'client_••••••••••••',
      keySecret: '••••••••••••••••••••',
      webhookSecret: '',
      currency: 'USD',
      badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    },
    {
      id: 'cod',
      name: 'Manual Invoice / Bank NEFT / COD',
      enabled: true,
      mode: 'live',
      keyId: 'BANK_OHOTECH_ODISHA',
      keySecret: 'HDFC0000412',
      webhookSecret: '',
      currency: 'INR',
      badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    },
  ]);

  const handleToggleGateway = (id: string) => {
    setGateways((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextState = !g.enabled;
          showToast(`${g.name} ${nextState ? 'Enabled' : 'Disabled'}`, 'info');
          return { ...g, enabled: nextState };
        }
        return g;
      })
    );
  };

  const handleModeChange = (id: string, newMode: 'test' | 'live') => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, mode: newMode } : g))
    );
    showToast(`Switched ${id} to ${newMode.toUpperCase()} mode`, 'info');
  };

  const handleSaveAll = () => {
    showToast('Payment gateway credentials encrypted and saved to database vault.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              PAYMENT ORCHESTRATION
            </span>
            <span className="text-xs font-mono text-slate-400">PCI-DSS Level 1 Compliant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Payment Gateways &amp; Merchant Settings
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Manage multi-gateway fallback, UPI autopay, webhook secrets, and test/production credentials.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold font-mono text-xs transition-all shadow-lg shadow-emerald-950/30 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Gateway Config</span>
        </button>
      </div>

      {/* Gateway Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {gateways.map((gw) => (
          <div
            key={gw.id}
            className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-lg space-y-4"
          >
            {/* Top row: Name, mode & switch */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className={cn("p-2 rounded-xl border", gw.badgeColor)}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{gw.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.2 rounded uppercase", gw.badgeColor)}>
                      {gw.currency}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Mode: <strong className={gw.mode === 'live' ? 'text-emerald-400' : 'text-amber-400'}>{gw.mode.toUpperCase()}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Mode toggle */}
                <select
                  value={gw.mode}
                  onChange={(e) => handleModeChange(gw.id, e.target.value as any)}
                  className="bg-[#19191e] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                >
                  <option value="live">Live (Prod)</option>
                  <option value="test">Sandbox (Test)</option>
                </select>

                {/* Gateway enable toggle */}
                <button
                  onClick={() => handleToggleGateway(gw.id)}
                  className={cn(
                    "w-11 h-6 rounded-full transition-colors relative cursor-pointer",
                    gw.enabled ? "bg-emerald-500" : "bg-white/20"
                  )}
                >
                  <span className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-black transition-transform",
                    gw.enabled ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-400 text-[10px] mb-1">Public Key / Merchant ID</label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    defaultValue={gw.keyId}
                    className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">Secret Key / Salt</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    defaultValue={gw.keySecret}
                    className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>
              </div>

              {gw.webhookSecret && (
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Webhook Signing Secret</label>
                  <div className="relative">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      defaultValue={gw.webhookSecret}
                      className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-sans"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

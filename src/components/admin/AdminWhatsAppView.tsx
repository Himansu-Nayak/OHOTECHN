'use client';

import * as React from 'react';
import { 
  MessageSquare, CheckCircle2, Send, AlertTriangle, RefreshCw, 
  Smartphone, Bot, ShieldCheck, Zap, Layers, DollarSign, Clock, 
  ChevronRight, ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export function AdminWhatsAppView() {
  const { showToast } = useToast();
  const [aiBotEnabled, setAiBotEnabled] = React.useState(true);
  const [broadcastTarget, setBroadcastTarget] = React.useState('ALL_LEADS');
  const [broadcastTemplate, setBroadcastTemplate] = React.useState('hms_enterprise_demo');
  const [customText, setCustomText] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);

  const [messageLogs, setMessageLogs] = React.useState([
    {
      id: 1,
      recipient: '+91 98610 12345 (Dr. Rajesh)',
      template: 'appointment_reminder',
      status: 'DELIVERED',
      read: true,
      time: '10:45 AM',
    },
    {
      id: 2,
      recipient: '+91 94370 54321 (Priyanka Dash)',
      template: 'quote_ready_notification',
      status: 'READ',
      read: true,
      time: '09:30 AM',
    },
    {
      id: 3,
      recipient: '+91 98200 98765 (Manish Agarwal)',
      template: 'order_status_update',
      status: 'DELIVERED',
      read: false,
      time: 'Yesterday',
    },
  ]);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      showToast('WhatsApp Meta Cloud Broadcast dispatched successfully!', 'success');
      setMessageLogs([
        {
          id: Date.now(),
          recipient: broadcastTarget === 'ALL_LEADS' ? 'All CRM Leads (12 recipients)' : 'Active Order Customers',
          template: broadcastTemplate,
          status: 'DELIVERED',
          read: false,
          time: 'Just now',
        },
        ...messageLogs,
      ]);
      setCustomText('');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
              META CLOUD API
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Verified WhatsApp Business Account (WABA)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            WhatsApp AI Automation &amp; Broadcast Hub
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Send transaction alerts, broadcast software updates, and enable 24/7 autonomous Gemini AI response bots.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Meta Balance: <strong className="text-white">₹4,250.00</strong></span>
          </div>
        </div>
      </div>

      {/* Connection & KPI Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#141416] border border-white/10">
          <p className="text-[11px] font-mono text-slate-400">Meta Phone Number</p>
          <p className="text-base font-bold text-white mt-1">+91 91240 88990</p>
          <p className="text-[10px] font-mono text-emerald-400 mt-0.5">Green Tick Verified</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#141416] border border-white/10">
          <p className="text-[11px] font-mono text-slate-400">Delivery Success Rate</p>
          <p className="text-2xl font-black text-white mt-1">99.4%</p>
          <p className="text-[10px] font-mono text-emerald-400 mt-0.5">1,420 sent this month</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#141416] border border-white/10">
          <p className="text-[11px] font-mono text-slate-400">Read Open Rate</p>
          <p className="text-2xl font-black text-white mt-1">82.6%</p>
          <p className="text-[10px] font-mono text-teal-400 mt-0.5">High customer engagement</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#141416] border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono text-slate-400">Gemini AI Auto-Reply</p>
            <p className="text-sm font-bold text-white mt-1">
              {aiBotEnabled ? '24/7 Copilot Active' : 'Manual Response Only'}
            </p>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">Direct Spring Boot webhook</p>
          </div>
          <button
            onClick={() => {
              setAiBotEnabled(!aiBotEnabled);
              showToast(`WhatsApp AI Copilot ${!aiBotEnabled ? 'Enabled' : 'Disabled'}`, 'info');
            }}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative cursor-pointer",
              aiBotEnabled ? "bg-teal-500" : "bg-white/20"
            )}
          >
            <span className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-black transition-transform",
              aiBotEnabled ? "right-1" : "left-1"
            )} />
          </button>
        </div>
      </div>

      {/* Broadcast Composer & Message Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Composer */}
        <form
          onSubmit={handleSendBroadcast}
          className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-lg space-y-4 font-mono text-xs"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-teal-400" /> Dispatch WhatsApp Broadcast
            </span>
            <span className="text-[10px] font-mono text-slate-400">Official Meta HSM Templates</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 text-[11px] mb-1">Target Audience</label>
              <select
                value={broadcastTarget}
                onChange={(e) => setBroadcastTarget(e.target.value)}
                className="w-full px-3 py-2 bg-[#19191d] border border-white/10 rounded-xl text-white focus:outline-none focus:border-teal-500"
              >
                <option value="ALL_LEADS">All CRM Inquiries &amp; Leads (12)</option>
                <option value="ACTIVE_ORDERS">Active Order Customers (14)</option>
                <option value="HOT_PROSPECTS">Hot Prospects Only (5)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-[11px] mb-1">Approved Template</label>
              <select
                value={broadcastTemplate}
                onChange={(e) => setBroadcastTemplate(e.target.value)}
                className="w-full px-3 py-2 bg-[#19191d] border border-white/10 rounded-xl text-white focus:outline-none focus:border-teal-500"
              >
                <option value="hms_enterprise_demo">hms_enterprise_demo — Hospital Software Demo</option>
                <option value="quote_ready_notification">quote_ready_notification — Proposal PDF Ready</option>
                <option value="order_status_update">order_status_update — Delivery / License Push</option>
                <option value="custom_support_update">custom_support_update — SLA Resolution Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-[11px] mb-1">Personalized Parameter / Note</label>
              <textarea
                rows={3}
                placeholder="Include custom parameter or message preview..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/10">
            <span className="text-[10px] text-slate-400">Est. Cost: ₹0.48 / message</span>
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-black font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-teal-950/30 cursor-pointer disabled:opacity-50"
            >
              {isSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{isSending ? 'Transmitting...' : 'Dispatch Broadcast'}</span>
            </button>
          </div>
        </form>

        {/* Live Message Dispatch Stream */}
        <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-lg space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" /> Recent Dispatch Stream
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Live Webhook Synced</span>
          </div>

          <div className="space-y-2.5">
            {messageLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#19191d] border border-white/10 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-bold text-white">{log.recipient}</p>
                  <p className="text-[10px] text-slate-400">Template: {log.template}</p>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold inline-block",
                    log.read ? "bg-teal-500/20 text-teal-300" : "bg-white/10 text-slate-300"
                  )}>
                    {log.read ? 'READ' : log.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

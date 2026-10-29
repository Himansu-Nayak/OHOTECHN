'use client';

import * as React from 'react';
import { 
  MessageSquare, CheckCircle2, Send, AlertTriangle, RefreshCw, 
  Smartphone, Bot, ShieldCheck, Zap, Layers, DollarSign, Clock, 
  ChevronRight, ArrowUpRight, AlertCircle, Info, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { 
  getWhatsAppConfigApi, 
  getWhatsAppMessagesApi, 
  sendWhatsAppMessageApi,
  WhatsAppConfigDto,
  CrmWhatsAppMessageDto
} from '@/api/whatsapp';
import { AdminCard, AdminBadge, AdminButton, AdminInput, AdminSelect, AdminEmptyState } from './AdminUiPrimitives';

export function AdminWhatsAppView() {
  const { showToast } = useToast();
  const [config, setConfig] = React.useState<WhatsAppConfigDto | null>(null);
  const [loadingConfig, setLoadingConfig] = React.useState(true);
  const [aiBotEnabled, setAiBotEnabled] = React.useState(true);

  // Form State
  const [recipientPhone, setRecipientPhone] = React.useState('');
  const [recipientName, setRecipientName] = React.useState('');
  const [templateName, setTemplateName] = React.useState('oho_checkout_otp');
  const [parameter1, setParameter1] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);

  // Message Logs
  const [messages, setMessages] = React.useState<CrmWhatsAppMessageDto[]>([]);
  const [loadingMessages, setLoadingMessages] = React.useState(true);
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');

  const fetchConfig = React.useCallback(async () => {
    try {
      setLoadingConfig(true);
      const res = await getWhatsAppConfigApi();
      if (res.success && res.data) {
        setConfig(res.data);
      }
    } catch {
      // Non-blocking
    } finally {
      setLoadingConfig(false);
    }
  }, []);

  const fetchMessages = React.useCallback(async () => {
    try {
      setLoadingMessages(true);
      const res = await getWhatsAppMessagesApi({
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        page: 0,
        size: 30,
      });
      if (res.success && res.data) {
        setMessages(res.data.content || []);
      }
    } catch (e: any) {
      console.warn('Failed to load WhatsApp messages', e);
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedStatus]);

  React.useEffect(() => {
    fetchConfig();
    fetchMessages();
  }, [fetchConfig, fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientPhone.trim()) {
      showToast('Recipient phone number is required.', 'error');
      return;
    }

    setIsSending(true);
    try {
      const params = parameter1.trim() ? [parameter1.trim()] : undefined;
      const res = await sendWhatsAppMessageApi({
        recipientPhone: recipientPhone.trim(),
        recipientName: recipientName.trim() || undefined,
        templateName: templateName.trim(),
        parameters: params,
      });

      if (res.success) {
        showToast(res.message || 'WhatsApp message dispatched successfully!', 'success');
        setRecipientPhone('');
        setRecipientName('');
        setParameter1('');
        fetchMessages();
        fetchConfig();
      } else {
        showToast(res.message || 'Failed to dispatch WhatsApp message', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Network error dispatching message', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
              META GRAPH API v19.0
            </span>
            <span className={cn(
              "text-[11px] font-mono flex items-center gap-1 font-semibold",
              config?.configured ? "text-emerald-600" : "text-amber-600"
            )}>
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                config?.configured ? "bg-emerald-500 animate-ping" : "bg-amber-500"
              )} />
              {config?.configured ? 'WhatsApp Business Cloud Active' : 'Dev Simulation Mode (Live API Unconfigured)'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            WhatsApp Business CRM Communications
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Verified HSM template notifications, customer order updates, OTP authentication, and CRM messaging.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={() => {
              fetchConfig();
              fetchMessages();
            }}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Logs
          </AdminButton>
        </div>
      </div>

      {/* Unconfigured Alert Banner */}
      {!config?.configured && !loadingConfig && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">WhatsApp Business Meta Credentials Not Configured</p>
            <p className="text-amber-700 leading-relaxed">
              Environment variables <code>APP_WHATSAPP_ENABLED</code>, <code>APP_WHATSAPP_PHONE_NUMBER_ID</code>, and <code>APP_WHATSAPP_ACCESS_TOKEN</code> are not set in the production environment. Messages are logged and verified locally in transparent simulation mode.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <p className="text-[11px] font-mono text-slate-500">Provider Channel</p>
          <p className="text-sm font-bold text-slate-900 mt-1 truncate">{config?.providerName || 'Meta Cloud API'}</p>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">Phone ID: {config?.phoneNumberId || 'N/A'}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <p className="text-[11px] font-mono text-slate-500">Total Dispatched</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{config?.totalSent || 0}</p>
          <p className="text-[10px] font-mono text-emerald-600 mt-0.5">Delivered: {config?.totalDelivered || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <p className="text-[11px] font-mono text-slate-500">Read Receipts</p>
          <p className="text-2xl font-black text-teal-600 mt-1">{config?.totalRead || 0}</p>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">Failed: {config?.totalFailed || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono text-slate-500">Automated Bot</p>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {aiBotEnabled ? '24/7 Webhook Active' : 'Manual Dispatch'}
            </p>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">Spring Boot Controller</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setAiBotEnabled(!aiBotEnabled);
              showToast(`WhatsApp Automated Bot ${!aiBotEnabled ? 'Enabled' : 'Disabled'}`, 'info');
            }}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative cursor-pointer",
              aiBotEnabled ? "bg-teal-600" : "bg-slate-300"
            )}
          >
            <span className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
              aiBotEnabled ? "right-1" : "left-1"
            )} />
          </button>
        </div>
      </div>

      {/* Composer & Message History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Message Composer */}
        <form
          onSubmit={handleSendMessage}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-teal-600" /> Dispatch Verified Template
            </span>
            <span className="text-[10px] font-mono text-slate-400">Meta Approved Templates</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-1">Recipient Phone Number (with Country Code)</label>
              <AdminInput
                placeholder="+919876543210"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                leftIcon={<Smartphone className="w-3.5 h-3.5" />}
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-1">Recipient Name (Optional)</label>
              <AdminInput
                placeholder="Dr. Rajesh / Client Name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                leftIcon={<User className="w-3.5 h-3.5" />}
              />
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-1">Approved Template</label>
              <AdminSelect
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                options={[
                  { value: 'oho_checkout_otp', label: 'oho_checkout_otp — Authentication / OTP' },
                  { value: 'hms_enterprise_demo', label: 'hms_enterprise_demo — Enterprise Demo Invitation' },
                  { value: 'quote_ready_notification', label: 'quote_ready_notification — Commercial Proposal Ready' },
                  { value: 'order_status_update', label: 'order_status_update — Software License & Order Fulfilled' },
                ]}
              />
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-1">Template Parameter (Body Token)</label>
              <AdminInput
                placeholder="e.g. 849201 or Hospital Management System"
                value={parameter1}
                onChange={(e) => setParameter1(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-[11px] text-slate-500">Provider: Meta Cloud API</span>
            <AdminButton
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isSending}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Dispatch Message
            </AdminButton>
          </div>
        </form>

        {/* Real Message Dispatch History */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" /> Recent Dispatch Stream
            </span>
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="ALL">All Statuses</option>
                <option value="SENT">Sent</option>
                <option value="DELIVERED">Delivered</option>
                <option value="READ">Read</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 truncate">
                      {msg.recipientPhone} {msg.recipientName ? `(${msg.recipientName})` : ''}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Template: <code>{msg.templateName}</code>
                    </p>
                    {msg.wamid && (
                      <p className="text-[9px] text-slate-400 font-mono truncate">
                        ID: {msg.wamid}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold inline-block",
                      msg.status === 'SENT' && "bg-blue-100 text-blue-800",
                      msg.status === 'DELIVERED' && "bg-emerald-100 text-emerald-800",
                      msg.status === 'READ' && "bg-teal-100 text-teal-800",
                      msg.status === 'FAILED' && "bg-rose-100 text-rose-800",
                      msg.status === 'QUEUED' && "bg-amber-100 text-amber-800"
                    )}>
                      {msg.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <AdminEmptyState
                title="No WhatsApp records found"
                description={loadingMessages ? "Loading stream..." : "Dispatch a verified template above to view message records."}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

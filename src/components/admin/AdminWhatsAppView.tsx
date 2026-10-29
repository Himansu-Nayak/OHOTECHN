'use client';

import * as React from 'react';
import { 
  CheckCircle2, Send, RefreshCw, 
  Smartphone, ShieldCheck, Clock, 
  AlertCircle, User, ShieldAlert, PhoneCall,
  UserCheck, UserX, PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { 
  getWhatsAppConfigApi, 
  getWhatsAppMessagesApi, 
  sendWhatsAppMessageApi,
  getWhatsAppConsentsApi,
  registerWhatsAppConsentApi,
  WhatsAppConfigDto,
  CrmWhatsAppMessageDto,
  CrmWhatsAppConsentDto
} from '@/api/whatsapp';
import { AdminBadge, AdminButton, AdminInput, AdminSelect, AdminEmptyState } from './AdminUiPrimitives';

export function AdminWhatsAppView() {
  const { showToast } = useToast();
  const [config, setConfig] = React.useState<WhatsAppConfigDto | null>(null);
  const [loadingConfig, setLoadingConfig] = React.useState(true);
  const [activeSubTab, setActiveSubTab] = React.useState<'messages' | 'consent'>('messages');

  // Form State
  const [recipientPhone, setRecipientPhone] = React.useState('');
  const [recipientName, setRecipientName] = React.useState('');
  const [templateName, setTemplateName] = React.useState('oho_checkout_otp');
  const [messageCategory, setMessageCategory] = React.useState<'MARKETING' | 'TRANSACTIONAL'>('MARKETING');
  const [parameter1, setParameter1] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);

  // Message Logs
  const [messages, setMessages] = React.useState<CrmWhatsAppMessageDto[]>([]);
  const [loadingMessages, setLoadingMessages] = React.useState(true);
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');

  // Consent Ledger State
  const [consents, setConsents] = React.useState<CrmWhatsAppConsentDto[]>([]);
  const [loadingConsents, setLoadingConsents] = React.useState(false);
  const [consentFilter, setConsentFilter] = React.useState<string>('ALL');

  // Quick Consent Modal State
  const [consentPhone, setConsentPhone] = React.useState('');
  const [consentOptIn, setConsentOptIn] = React.useState(true);
  const [consentReason, setConsentReason] = React.useState('');
  const [isRegisteringConsent, setIsRegisteringConsent] = React.useState(false);

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

  const fetchConsents = React.useCallback(async () => {
    try {
      setLoadingConsents(true);
      const optInParam = consentFilter === 'ALL' ? undefined : consentFilter === 'OPTED_IN';
      const res = await getWhatsAppConsentsApi({
        optIn: optInParam,
        page: 0,
        size: 30,
      });
      if (res.success && res.data) {
        setConsents(res.data.content || []);
      }
    } catch (e: any) {
      console.warn('Failed to load WhatsApp consents', e);
    } finally {
      setLoadingConsents(false);
    }
  }, [consentFilter]);

  React.useEffect(() => {
    fetchConfig();
    fetchMessages();
  }, [fetchConfig, fetchMessages]);

  React.useEffect(() => {
    if (activeSubTab === 'consent') {
      fetchConsents();
    }
  }, [activeSubTab, fetchConsents]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientPhone.trim()) {
      showToast('Recipient phone number is required.', 'error');
      return;
    }

    setIsSending(true);
    try {
      const params = parameter1.trim() ? [parameter1.trim()] : undefined;
      const idempotencyKey = `wa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const res = await sendWhatsAppMessageApi({
        recipientPhone: recipientPhone.trim(),
        recipientName: recipientName.trim() || undefined,
        templateName: templateName.trim(),
        category: messageCategory,
        parameters: params,
        idempotencyKey,
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
      showToast(err?.message || 'Error dispatching message. Check consent and network.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleRegisterConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentPhone.trim()) {
      showToast('Phone number is required.', 'error');
      return;
    }

    setIsRegisteringConsent(true);
    try {
      const res = await registerWhatsAppConsentApi({
        phone: consentPhone.trim(),
        optIn: consentOptIn,
        source: 'MANUAL_ADMIN',
        reason: consentReason.trim() || (consentOptIn ? 'Customer explicitly opted in' : 'Manual opt-out by Admin'),
      });

      if (res.success) {
        showToast(res.message || 'Consent record updated successfully', 'success');
        setConsentPhone('');
        setConsentReason('');
        fetchConsents();
        fetchConfig();
      } else {
        showToast(res.message || 'Failed to update consent record', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error saving consent record', 'error');
    } finally {
      setIsRegisteringConsent(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
              META GRAPH API v19.0
            </span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-slate-500" />
              Business Contact: {config?.businessContactNumber || '+917684054872'}
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
            Verified HSM template notifications, delivery receipts, automated opt-out keywords, and consent ledger.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={() => {
              fetchConfig();
              if (activeSubTab === 'messages') fetchMessages();
              if (activeSubTab === 'consent') fetchConsents();
            }}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Data
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
              Environment variables <code>WHATSAPP_ENABLED</code>, <code>WHATSAPP_PHONE_NUMBER_ID</code>, and <code>WHATSAPP_API_TOKEN</code> are not set in the production environment. Messages are verified locally in transparent simulation mode. The primary registered contact number is configured as <strong>{config?.businessContactNumber || '+917684054872'}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <p className="text-[11px] font-mono text-slate-500">Business Channel & Contact</p>
          <p className="text-sm font-bold text-slate-900 mt-1 truncate">{config?.businessContactNumber || '+917684054872'}</p>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">Phone ID: {config?.phoneNumberId || 'N/A'}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <p className="text-[11px] font-mono text-slate-500">Total Dispatched</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{config?.totalSent || 0}</p>
          <p className="text-[10px] font-mono text-emerald-600 mt-0.5">Delivered: {config?.totalDelivered || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <p className="text-[11px] font-mono text-slate-500">Read Receipts & Fails</p>
          <p className="text-2xl font-black text-teal-600 mt-1">{config?.totalRead || 0}</p>
          <p className="text-[10px] font-mono text-rose-500 mt-0.5">Failed: {config?.totalFailed || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <p className="text-[11px] font-mono text-slate-500">Customer Consent Ledger</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {config?.totalConsented || 0}
            <span className="text-xs font-normal text-slate-400 ml-1">consented</span>
          </p>
          <p className="text-[10px] font-mono text-amber-600 mt-0.5">Opted Out: {config?.totalOptedOut || 0}</p>
        </div>
      </div>

      {/* Sub Tabs: Messages vs Consent */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          type="button"
          onClick={() => setActiveSubTab('messages')}
          className={cn(
            "pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5",
            activeSubTab === 'messages'
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          )}
        >
          <Send className="w-4 h-4" /> Message Dispatch & Stream
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('consent')}
          className={cn(
            "pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5",
            activeSubTab === 'consent'
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          )}
        >
          <ShieldCheck className="w-4 h-4" /> Customer Consent & Opt-Outs
        </button>
      </div>

      {activeSubTab === 'messages' ? (
        /* Composer & Message History */
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
                  placeholder="+917684054872"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 text-xs font-semibold mb-1">Approved Template</label>
                  <AdminSelect
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    options={[
                      { value: 'oho_checkout_otp', label: 'oho_checkout_otp — Authentication / OTP' },
                      { value: 'hms_enterprise_demo', label: 'hms_enterprise_demo — Enterprise Demo Invitation' },
                      { value: 'quote_ready_notification', label: 'quote_ready_notification — Proposal Ready' },
                      { value: 'order_status_update', label: 'order_status_update — Order Fulfilled' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-slate-700 text-xs font-semibold mb-1">Message Category</label>
                  <AdminSelect
                    value={messageCategory}
                    onChange={(e) => setMessageCategory(e.target.value as any)}
                    options={[
                      { value: 'MARKETING', label: 'MARKETING (Requires Consent)' },
                      { value: 'TRANSACTIONAL', label: 'TRANSACTIONAL (Essential Alert)' },
                    ]}
                  />
                </div>
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
              <span className="text-[11px] text-slate-500 font-mono">
                Idempotency & Debounce Active
              </span>
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
                  <option value="OPTED_OUT">Opted Out</option>
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
                      {msg.errorMessage && (
                        <p className="text-[10px] text-rose-600 truncate mt-0.5">
                          {msg.errorMessage}
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
                        msg.status === 'OPTED_OUT' && "bg-amber-100 text-amber-800",
                        msg.status === 'QUEUED' && "bg-slate-100 text-slate-800"
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
      ) : (
        /* Consent & Opt-Outs Ledger View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Register / Update Form */}
          <form
            onSubmit={handleRegisterConsent}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4 lg:col-span-1 h-fit"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5 text-teal-600" /> Manage Opt-In / Consent
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 text-xs font-semibold mb-1">Phone Number (E.164)</label>
                <AdminInput
                  placeholder="+917684054872"
                  value={consentPhone}
                  onChange={(e) => setConsentPhone(e.target.value)}
                  leftIcon={<Smartphone className="w-3.5 h-3.5" />}
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-semibold mb-1">Consent Decision</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsentOptIn(true)}
                    className={cn(
                      "p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer",
                      consentOptIn
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Opted In
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsentOptIn(false)}
                    className={cn(
                      "p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer",
                      !consentOptIn
                        ? "bg-rose-50 border-rose-300 text-rose-800"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <UserX className="w-3.5 h-3.5" /> Opted Out
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-semibold mb-1">Reason / Notes</label>
                <AdminInput
                  placeholder="e.g. Inbound verbal consent, Customer requested opt-out"
                  value={consentReason}
                  onChange={(e) => setConsentReason(e.target.value)}
                />
              </div>
            </div>

            <AdminButton
              variant="primary"
              size="sm"
              type="submit"
              className="w-full"
              isLoading={isRegisteringConsent}
            >
              Update Consent Record
            </AdminButton>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">Meta Policy Compliance</p>
              <p>Customers can text <code>STOP</code> to opt out automatically via the webhook endpoint.</p>
            </div>
          </form>

          {/* Consent Records Table */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Registered Customer Consents
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={consentFilter}
                  onChange={(e) => setConsentFilter(e.target.value)}
                  className="text-xs px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                >
                  <option value="ALL">All Records</option>
                  <option value="OPTED_IN">Consented Only</option>
                  <option value="OPTED_OUT">Opted Out Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {consents.length > 0 ? (
                consents.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{c.phone}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Source: {c.source || 'N/A'} • Purpose: {c.purpose || 'ALL'}
                      </p>
                      {c.revocationReason && (
                        <p className="text-[10px] text-amber-600 mt-0.5">
                          Reason: {c.revocationReason}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold inline-block",
                        c.optIn ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      )}>
                        {c.optIn ? 'OPTED IN' : 'OPTED OUT'}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(c.updatedAt || c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <AdminEmptyState
                  title="No consent records found"
                  description={loadingConsents ? "Loading consents..." : "No phone numbers have recorded consent or opt-outs."}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

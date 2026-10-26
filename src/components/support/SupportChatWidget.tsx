'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  X,
  Send,
  HelpCircle,
  FileQuestion,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createCustomerTicketApi, createPublicTicketApi } from '@/api/support';

export function SupportChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'quick' | 'ticket'>('quick');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [department, setDepartment] = useState<'TECHNICAL' | 'BILLING' | 'SALES' | 'LICENSING'>('TECHNICAL');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [submitting, setSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !subject.trim()) return;
    if (!user && !clientEmail.trim()) {
      setErrorMessage('Please provide an email so our team can follow up.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      if (user) {
        const res = await createCustomerTicketApi({
          subject: subject.trim(),
          description: description.trim(),
          department,
          priority,
        });
        if (res.success && res.data) {
          setSuccessCode(res.data.ticketCode);
        } else {
          setErrorMessage(res.message || 'Failed to submit ticket');
        }
      } else {
        const res = await createPublicTicketApi({
          subject: subject.trim(),
          description: description.trim(),
          clientEmail: clientEmail.trim(),
          clientName: 'Website Visitor',
          department,
          priority,
        });
        if (res.success && res.data) {
          setSuccessCode(res.data.ticketCode);
        } else {
          setErrorMessage(res.message || 'Failed to submit ticket');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error submitting inquiry.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessCode(null);
    setSubject('');
    setDescription('');
    setErrorMessage(null);
    setMode('quick');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-950 text-white border border-slate-700/60 shadow-2xl hover:border-orange-500/50 hover:bg-slate-900 transition-all duration-300 group"
          aria-label="Open OHO TECH Support Assistance"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-inner">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold pr-1 text-slate-200 group-hover:text-white transition-colors">
            Support Desk
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] max-h-[85vh] bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  OHO TECH Support
                </h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  SLA Support &amp; AI Advisory
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Close widget"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {successCode ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Ticket Logged</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Your reference tracking code is:
                  </p>
                  <div className="mt-2 py-1.5 px-3 bg-slate-900 border border-slate-700 rounded-xl font-mono text-sm font-bold text-orange-400">
                    {successCode}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Our engineering team will review your query within guaranteed SLA response windows.
                </p>
                <div className="flex gap-2 w-full pt-2">
                  <Link
                    href={"/support?code=" + encodeURIComponent(successCode)}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2 px-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl text-center transition-colors"
                  >
                    View in Portal
                  </Link>
                  <button
                    onClick={handleReset}
                    className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl border border-slate-700 transition-colors"
                  >
                    New Query
                  </button>
                </div>
              </div>
            ) : mode === 'quick' ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-2">
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                    Instant Enterprise Help
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    Have questions about our turnkey ERP/EMR platforms, API license activations, or dedicated engineering retainers?
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setMode('ticket')}
                    className="w-full p-3 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 hover:border-orange-500/40 text-left flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileQuestion className="w-4 h-4 text-orange-400" />
                      <div>
                        <div className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                          Log a Technical Ticket
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Guaranteed SLA response from lead architect
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                  </button>

                  <Link
                    href="/support"
                    onClick={() => setIsOpen(false)}
                    className="w-full p-3 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 text-left flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-sky-400" />
                      <div>
                        <div className="font-semibold text-white group-hover:text-sky-400 transition-colors">
                          Support Operations Portal
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Track existing tickets, SLAs &amp; replies
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>

                <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex items-center gap-2.5 text-slate-400 text-[11px]">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Average SLA First Response: <strong>&lt; 2.4 Hours</strong> (Technical Ops Desk)
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Submit Direct Inquiry</span>
                  <button
                    type="button"
                    onClick={() => setMode('quick')}
                    className="text-[11px] text-orange-400 hover:underline"
                  >
                    Back
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-[11px] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {!user && (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Your Email</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@organization.com"
                      required
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. ERP database migration query"
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500"
                    >
                      <option value="TECHNICAL">Technical Ops</option>
                      <option value="LICENSING">Licensing &amp; IP</option>
                      <option value="BILLING">Billing &amp; Tax</option>
                      <option value="SALES">Enterprise Sales</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High (Urgent)</option>
                      <option value="URGENT">Critical Outage</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Message Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your requirement, issue or platform questions..."
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Dispatch Support Ticket'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

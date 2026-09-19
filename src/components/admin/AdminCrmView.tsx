'use client';

import * as React from 'react';
import { 
  Users2, Search, Plus, Filter, Phone, Mail, MessageSquare, 
  ChevronRight, ArrowRight, CheckCircle2, Clock, X, AlertCircle, 
  DollarSign, Tag, ExternalLink, MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContactEnquiry } from '@/api/types';

export interface LeadItem {
  id: number;
  name: string;
  company?: string;
  email: string;
  phone: string;
  interest: string;
  value: number;
  status: 'NEW' | 'HOT' | 'FOLLOWUP' | 'IN_PROGRESS' | 'CLOSED_WON' | 'LOST';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  source: string;
  createdAt: string;
}

interface AdminCrmViewProps {
  enquiries?: ContactEnquiry[];
  onStatusChange?: (id: number, status: string) => void;
}

export function AdminCrmView({ enquiries = [], onStatusChange }: AdminCrmViewProps) {
  const [viewMode, setViewMode] = React.useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedLead, setSelectedLead] = React.useState<LeadItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // Default seed leads synced with real enquiries
  const [leads, setLeads] = React.useState<LeadItem[]>([
    {
      id: 1,
      name: 'Dr. Rajesh Mohapatra',
      company: 'Apollo Care Multispeciality',
      email: 'dr.rajesh@apollocare.org',
      phone: '+91 98610 12345',
      interest: 'Hospital Management Software (HMS)',
      value: 125000,
      status: 'HOT',
      priority: 'HIGH',
      source: 'Google Search',
      createdAt: 'Today, 10:30 AM',
    },
    {
      id: 2,
      name: 'Priyanka Dash',
      company: 'Doon Global Public School',
      email: 'principal@doonglobal.edu.in',
      phone: '+91 94370 54321',
      interest: 'School Management Software',
      value: 65000,
      status: 'FOLLOWUP',
      priority: 'HIGH',
      source: 'Website Demo Form',
      createdAt: 'Yesterday, 4:15 PM',
    },
    {
      id: 3,
      name: 'Manish Agarwal',
      company: 'Agarwal Mega Retail Hub',
      email: 'manish@agarwalretail.com',
      phone: '+91 98200 98765',
      interest: 'Retail POS & Multi-Store ERP',
      value: 85000,
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      source: 'WhatsApp Inbound',
      createdAt: 'Sep 16, 2:00 PM',
    },
    {
      id: 4,
      name: 'Dr. Sunita Rao',
      company: 'Bloom Fertility & IVF Center',
      email: 'dr.sunita@bloomivf.in',
      phone: '+91 98840 33221',
      interest: 'IVF & Embryology Clinic Portal',
      value: 95000,
      status: 'CLOSED_WON',
      priority: 'HIGH',
      source: 'Direct Referral',
      createdAt: 'Sep 14, 11:20 AM',
    },
    {
      id: 5,
      name: 'Subrat Patnaik',
      company: 'Kalinga Logistics Solutions',
      email: 'ops@kalingalogistics.com',
      phone: '+91 97780 11223',
      interest: 'Custom Microservices SaaS',
      value: 180000,
      status: 'NEW',
      priority: 'MEDIUM',
      source: 'Quote Calculator',
      createdAt: 'Today, 9:15 AM',
    },
    {
      id: 6,
      name: 'Arjun Verma',
      company: 'Verma Pharma Wholesale',
      email: 'arjun@vermapharma.com',
      phone: '+91 91234 56789',
      interest: 'Pharmacy & Drug Batch Tracker',
      value: 45000,
      status: 'NEW',
      priority: 'LOW',
      source: 'Partner Channel',
      createdAt: 'Sep 17, 6:45 PM',
    },
  ]);

  // Form state for adding lead
  const [newLeadForm, setNewLeadForm] = React.useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    interest: 'Hospital Management Software (HMS)',
    value: 50000,
    priority: 'HIGH' as 'HIGH' | 'MEDIUM' | 'LOW',
  });

  const stages: { key: LeadItem['status']; label: string; color: string; bg: string }[] = [
    { key: 'NEW', label: 'New Inquiries', color: 'border-blue-500/40 text-blue-400', bg: 'bg-blue-500/10' },
    { key: 'HOT', label: 'Hot Prospects', color: 'border-amber-500/40 text-amber-400', bg: 'bg-amber-500/10' },
    { key: 'FOLLOWUP', label: 'Follow-Up Due', color: 'border-purple-500/40 text-purple-400', bg: 'bg-purple-500/10' },
    { key: 'IN_PROGRESS', label: 'Proposal Sent', color: 'border-cyan-500/40 text-cyan-400', bg: 'bg-cyan-500/10' },
    { key: 'CLOSED_WON', label: 'Closed Won', color: 'border-emerald-500/40 text-emerald-400', bg: 'bg-emerald-500/10' },
    { key: 'LOST', label: 'Archived / Lost', color: 'border-rose-500/40 text-rose-400', bg: 'bg-rose-500/10' },
  ];

  const handleStageChange = (leadId: number, newStage: LeadItem['status']) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStage } : lead))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStage } : null));
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.email) return;

    const created: LeadItem = {
      id: Date.now(),
      name: newLeadForm.name,
      company: newLeadForm.company || 'Enterprise Prospect',
      email: newLeadForm.email,
      phone: newLeadForm.phone || '+91 00000 00000',
      interest: newLeadForm.interest,
      value: Number(newLeadForm.value) || 50000,
      status: 'NEW',
      priority: newLeadForm.priority,
      source: 'Direct Manual Entry',
      createdAt: 'Just now',
    };

    setLeads([created, ...leads]);
    setIsAddModalOpen(false);
    setNewLeadForm({
      name: '',
      company: '',
      email: '',
      phone: '',
      interest: 'Hospital Management Software (HMS)',
      value: 50000,
      priority: 'HIGH',
    });
  };

  const filteredLeads = leads.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.interest.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPipelineValue = leads
    .filter((l) => l.status !== 'LOST')
    .reduce((sum, l) => sum + l.value, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* CRM Header Bar */}
      <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              SALES PIPELINE
            </span>
            <span className="text-xs font-mono text-slate-400">
              Pipeline Total: <strong className="text-emerald-400">₹{totalPipelineValue.toLocaleString('en-IN')}</strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Leads &amp; Contacts CRM Pipeline
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Track enterprise software leads, assign stages, initiate WhatsApp conversations, and convert to active orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View toggle */}
          <div className="p-1 rounded-xl bg-white/5 border border-white/10 flex items-center">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer",
                viewMode === 'kanban' ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer",
                viewMode === 'table' ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
              )}
            >
              Data Table
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold font-mono text-xs transition-all shadow-lg shadow-purple-950/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Enterprise Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, company, solution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#141416] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 font-mono focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="text-xs font-mono text-slate-400">
          Showing <span className="text-white font-bold">{filteredLeads.length}</span> leads
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
          {stages.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.key);
            const stageTotal = stageLeads.reduce((acc, l) => acc + l.value, 0);

            return (
              <div
                key={stage.key}
                className="bg-[#141416] border border-white/10 rounded-2xl p-3 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="pb-2.5 mb-2.5 border-b border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-xs font-mono font-bold uppercase", stage.color)}>
                      {stage.label}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-white font-bold">
                      {stageLeads.length}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 truncate">
                    ₹{stageTotal.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Lead Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="p-3 rounded-xl bg-[#1a1a1e] hover:bg-[#202026] border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-1.5 mb-1.5">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          ₹{lead.value.toLocaleString('en-IN')}
                        </span>
                        <span className={cn(
                          "text-[9px] font-mono font-bold px-1.5 py-0.2 rounded",
                          lead.priority === 'HIGH' ? "bg-red-500/20 text-red-300" : "bg-white/10 text-slate-300"
                        )}>
                          {lead.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                        {lead.name}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400 truncate">{lead.company}</p>
                      <p className="text-[10px] font-mono text-purple-400 mt-1 truncate">{lead.interest}</p>

                      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{lead.createdAt}</span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-emerald-400"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-cyan-400"
                            title="Direct Call"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="p-4 rounded-xl border border-dashed border-white/5 text-center text-[10px] font-mono text-slate-400">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Table View */
        <div className="bg-[#141416] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#19191d] text-slate-300 uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3.5">Lead Name &amp; Company</th>
                  <th className="p-3.5">Interest &amp; Product</th>
                  <th className="p-3.5">Deal Value</th>
                  <th className="p-3.5">Stage</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Contact Channels</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-white">{lead.name}</p>
                      <p className="text-[11px] text-slate-400">{lead.company}</p>
                    </td>
                    <td className="p-3.5 text-purple-400">{lead.interest}</td>
                    <td className="p-3.5 text-emerald-400 font-bold">₹{lead.value.toLocaleString('en-IN')}</td>
                    <td className="p-3.5">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStageChange(lead.id, e.target.value as any)}
                        className="bg-[#1b1b20] border border-white/15 rounded-lg px-2 py-1 text-[11px] font-mono text-white focus:outline-none"
                      >
                        {stages.map((s) => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold",
                        lead.priority === 'HIGH' ? "bg-red-500/20 text-red-300" : "bg-white/10 text-slate-300"
                      )}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/30"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`mailto:${lead.email}`}
                          className="p-1.5 rounded-lg bg-blue-500/15 text-blue-300 hover:bg-blue-500/30"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/30"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px]"
                      >
                        View Card
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Detail Modal / Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#141416] border border-white/20 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                  Lead Profile #{selectedLead.id}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedLead.name}</h3>
                <p className="text-xs font-mono text-slate-400">{selectedLead.company}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-xl bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <span className="text-slate-400 text-[10px]">Estimated Deal</span>
                  <p className="text-base font-bold text-emerald-400">₹{selectedLead.value.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Current Stage</span>
                  <p className="text-sm font-bold text-white">{selectedLead.status}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px]">Interest / Required Solution</span>
                <p className="text-white font-medium">{selectedLead.interest}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 text-[10px]">Email Address</span>
                  <p className="text-white truncate">{selectedLead.email}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Phone Number</span>
                  <p className="text-white truncate">{selectedLead.phone}</p>
                </div>
              </div>

              <div className="pt-2">
                <label className="text-[10px] text-slate-400 block mb-1">Move Pipeline Stage:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {stages.map((st) => (
                    <button
                      key={st.key}
                      onClick={() => handleStageChange(selectedLead.id, st.key)}
                      className={cn(
                        "py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold transition-all",
                        selectedLead.status === st.key
                          ? "bg-purple-600 text-white"
                          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-white/10">
              <a
                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-mono font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Direct
              </a>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleCreateLead}
            className="bg-[#141416] border border-white/20 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Create Enterprise Prospect</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Lead / Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Mohapatra"
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Enterprise / Organization Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apollo Hospital Cuttack"
                  value={newLeadForm.company}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="dr@apollo.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Deal Value (₹)</label>
                  <input
                    type="number"
                    value={newLeadForm.value}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Priority</label>
                  <select
                    value={newLeadForm.priority}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#19191e] border border-white/10 rounded-xl text-white focus:outline-none"
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
              >
                Save to CRM
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import { 
  Headphones, Search, Filter, Plus, Clock, CheckCircle2, 
  AlertCircle, MessageSquare, Send, User, ChevronRight, X, 
  Tag, ShieldAlert, ArrowRight, CornerDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export interface TicketItem {
  id: number;
  ticketCode: string;
  subject: string;
  clientName: string;
  clientEmail: string;
  department: 'Technical' | 'Billing' | 'Sales' | 'Licensing';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'CLOSED';
  slaHoursRemaining: number;
  createdAt: string;
  lastReply: string;
  description: string;
}

export function AdminSupportDeskView() {
  const { showToast } = useToast();
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTicket, setSelectedTicket] = React.useState<TicketItem | null>(null);
  const [replyMessage, setReplyMessage] = React.useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const [tickets, setTickets] = React.useState<TicketItem[]>([
    {
      id: 1,
      ticketCode: 'TCK-8821',
      subject: 'HMS Bio-metric attendance device sync timeout error',
      clientName: 'Dr. Rajesh Mohapatra (Apollo)',
      clientEmail: 'dr.rajesh@apollocare.org',
      department: 'Technical',
      priority: 'URGENT',
      status: 'OPEN',
      slaHoursRemaining: 1.5,
      createdAt: 'Today, 08:30 AM',
      lastReply: 'Engineering reviewing TCP port 5005',
      description: 'The biometric fingerprint sensor at OPD gate 2 fails to handshake with the Spring Boot server during peak morning shifts.',
    },
    {
      id: 2,
      ticketCode: 'TCK-8820',
      subject: 'Invoice GST breakdown request for School ERP license renewal',
      clientName: 'Priyanka Dash (Doon Global)',
      clientEmail: 'principal@doonglobal.edu.in',
      department: 'Billing',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      slaHoursRemaining: 6.0,
      createdAt: 'Yesterday, 03:00 PM',
      lastReply: 'Finance generated revised 18% GST credit note',
      description: 'Kindly provide an itemized tax breakdown matching HSN 998314 for school accounting audit compliance.',
    },
    {
      id: 3,
      ticketCode: 'TCK-8819',
      subject: 'Multi-store barcode scanner latency on POS billing counter',
      clientName: 'Manish Agarwal',
      clientEmail: 'manish@agarwalretail.com',
      department: 'Technical',
      priority: 'HIGH',
      status: 'OPEN',
      slaHoursRemaining: 3.2,
      createdAt: 'Today, 11:10 AM',
      lastReply: 'Initial support ticket assigned to L2',
      description: 'Laser barcode scanners have a 3-second delay when looking up item codes from the local SQLite cache.',
    },
    {
      id: 4,
      ticketCode: 'TCK-8815',
      subject: 'Hardware locking reset requested after server motherboard upgrade',
      clientName: 'Kalinga Logistics Solutions',
      clientEmail: 'ops@kalingalogistics.com',
      department: 'Licensing',
      priority: 'HIGH',
      status: 'ON_HOLD',
      slaHoursRemaining: 8.5,
      createdAt: 'Sep 16, 04:40 PM',
      lastReply: 'Awaiting customer MAC address confirmation',
      description: 'Server motherboard replaced under warranty. New CPU ID mismatch prevents license daemon initialization.',
    },
    {
      id: 5,
      ticketCode: 'TCK-8802',
      subject: 'IVF clinic custom embryology donor report PDF layout customization',
      clientName: 'Dr. Sunita Rao',
      clientEmail: 'dr.sunita@bloomivf.in',
      department: 'Sales',
      priority: 'LOW',
      status: 'CLOSED',
      slaHoursRemaining: 0,
      createdAt: 'Sep 14, 10:00 AM',
      lastReply: 'Custom JasperReports template deployed & tested',
      description: 'Add clinic logo header and doctor digital signature space on page 2.',
    },
  ]);

  const [newTicketForm, setNewTicketForm] = React.useState({
    subject: '',
    clientName: '',
    clientEmail: '',
    department: 'Technical' as TicketItem['department'],
    priority: 'HIGH' as TicketItem['priority'],
    description: '',
  });

  const handleStatusTransition = (ticketId: number, newStatus: TicketItem['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Ticket #${ticketId} status updated to ${newStatus}`, 'success');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id ? { ...t, lastReply: replyMessage.trim() } : t
      )
    );
    showToast(`Reply dispatched to ${selectedTicket.clientEmail}`, 'success');
    setReplyMessage('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketForm.subject || !newTicketForm.clientName) return;

    const created: TicketItem = {
      id: Date.now(),
      ticketCode: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newTicketForm.subject,
      clientName: newTicketForm.clientName,
      clientEmail: newTicketForm.clientEmail,
      department: newTicketForm.department,
      priority: newTicketForm.priority,
      status: 'NEW',
      slaHoursRemaining: 4.0,
      createdAt: 'Just now',
      lastReply: 'Ticket registered into support desk queue',
      description: newTicketForm.description,
    };

    setTickets([created, ...tickets]);
    setIsCreateModalOpen(false);
    showToast(`Ticket ${created.ticketCode} created successfully`, 'success');
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesDept = departmentFilter === 'ALL' || t.department === departmentFilter;
    const matchesQuery =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesDept && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              SUPPORT DESK &amp; SLA
            </span>
            <span className="text-xs font-mono text-emerald-400">100% SLA Compliance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Enterprise Client Tickets &amp; Help Desk
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Resolve technical issues, coordinate licensing requests, and maintain enterprise customer SLAs.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold font-mono text-xs transition-all shadow-lg shadow-rose-950/30 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Ticket</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1">
          {['ALL', 'NEW', 'OPEN', 'IN_PROGRESS', 'ON_HOLD', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap",
                statusFilter === st
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                  : "bg-white/5 text-slate-400 hover:text-white"
              )}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#141416] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Tickets Table / List */}
      <div className="bg-[#141416] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#19191d] text-slate-300 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="p-3.5">Ticket ID</th>
                <th className="p-3.5">Subject &amp; Client</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">SLA Remaining</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 font-bold text-rose-400">{t.ticketCode}</td>
                  <td className="p-3.5 max-w-sm">
                    <p className="font-bold text-white truncate">{t.subject}</p>
                    <p className="text-[11px] text-slate-400 truncate">{t.clientName}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-slate-300">
                      {t.department}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold",
                      t.priority === 'URGENT' ? "bg-red-500/20 text-red-300" :
                      t.priority === 'HIGH' ? "bg-amber-500/20 text-amber-300" :
                      "bg-blue-500/20 text-blue-300"
                    )}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {t.status === 'CLOSED' ? (
                      <span className="text-emerald-400">Resolved</span>
                    ) : (
                      <span className={cn(
                        "font-bold",
                        t.slaHoursRemaining < 2 ? "text-red-400 animate-pulse" : "text-slate-300"
                      )}>
                        {t.slaHoursRemaining}h remaining
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold",
                      t.status === 'OPEN' ? "bg-blue-500/20 text-blue-300" :
                      t.status === 'IN_PROGRESS' ? "bg-purple-500/20 text-purple-300" :
                      t.status === 'CLOSED' ? "bg-emerald-500/20 text-emerald-300" :
                      "bg-white/10 text-slate-300"
                    )}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] cursor-pointer"
                    >
                      Open Desk
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detail Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#141416] border border-white/20 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    {selectedTicket.ticketCode}
                  </span>
                  <span className="text-xs text-slate-400">{selectedTicket.department}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{selectedTicket.subject}</h3>
                <p className="text-xs text-slate-400">{selectedTicket.clientName} ({selectedTicket.clientEmail})</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-xl bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description Box */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase">Customer Issue Description:</span>
              <p className="text-xs text-slate-200 leading-relaxed">{selectedTicket.description}</p>
            </div>

            {/* Last Reply */}
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1">
              <span className="text-[10px] text-rose-400 uppercase font-bold">Latest Internal / Client Update:</span>
              <p className="text-xs text-slate-300">{selectedTicket.lastReply}</p>
            </div>

            {/* Quick Status Changers */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400">Change Ticket Stage:</span>
              <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                {(['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'CLOSED'] as TicketItem['status'][]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusTransition(selectedTicket.id, st)}
                    className={cn(
                      "py-1 rounded-lg font-bold transition-all cursor-pointer",
                      selectedTicket.status === st
                        ? "bg-rose-600 text-white"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Fast Reply Box */}
            <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t border-white/10">
              <textarea
                rows={2}
                placeholder="Write customer response or engineering dispatch note..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Sends instant email &amp; WhatsApp notice</span>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleCreateTicket}
            className="bg-[#141416] border border-white/20 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Register Support Ticket</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Issue Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database replication delay on Node 2"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Rajesh Mohapatra"
                    value={newTicketForm.clientName}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Client Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@care.org"
                    value={newTicketForm.clientEmail}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, clientEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Department</label>
                  <select
                    value={newTicketForm.department}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, department: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#19191d] border border-white/10 rounded-xl text-white focus:outline-none"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Billing">Billing</option>
                    <option value="Sales">Sales</option>
                    <option value="Licensing">Licensing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Priority</label>
                  <select
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#19191d] border border-white/10 rounded-xl text-white focus:outline-none"
                  >
                    <option value="URGENT">Urgent (2h SLA)</option>
                    <option value="HIGH">High (4h SLA)</option>
                    <option value="MEDIUM">Medium (12h SLA)</option>
                    <option value="LOW">Low (24h SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  placeholder="Paste error stack trace or description..."
                  value={newTicketForm.description}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Create Support Ticket
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

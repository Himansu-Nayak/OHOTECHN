'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Headphones, Search, Filter, Plus, Clock, CheckCircle2, 
  AlertCircle, MessageSquare, Send, User, ChevronRight, X, 
  Tag, ShieldAlert, ArrowRight, CornerDownRight, RefreshCw,
  Building2, Phone, Mail, AlertTriangle, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { AdminDrawer, AdminModal, AdminButton, AdminInput } from './AdminUiPrimitives';
import { 
  SupportTicketDto, 
  TicketDepartment, 
  TicketPriority, 
  TicketStatus 
} from '@/api/types';
import { 
  getStaffTicketsApi, 
  getStaffTicketDetailsApi, 
  postStaffReplyApi, 
  updateTicketStatusApi, 
  createCustomerTicketApi 
} from '@/api/support';

export function AdminSupportDeskView() {
  const { showToast } = useToast();
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTicket, setSelectedTicket] = React.useState<SupportTicketDto | null>(null);
  const [replyMessage, setReplyMessage] = React.useState('');
  const [isInternalNote, setIsInternalNote] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmittingReply, setIsSubmittingReply] = React.useState(false);

  const [tickets, setTickets] = React.useState<SupportTicketDto[]>([]);

  const [newTicketForm, setNewTicketForm] = React.useState({
    subject: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    department: 'TECHNICAL' as TicketDepartment,
    priority: 'HIGH' as TicketPriority,
    description: '',
  });

  const fetchTickets = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getStaffTicketsApi({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        department: departmentFilter !== 'ALL' ? departmentFilter : undefined,
        search: searchQuery || undefined,
      });

      if (res.success && res.data) {
        setTickets(res.data);
      }
    } catch (err: any) {
      console.warn('Failed to load tickets:', err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, departmentFilter, searchQuery]);

  React.useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSelectTicket = async (ticketId: number) => {
    try {
      const res = await getStaffTicketDetailsApi(ticketId);
      if (res.success && res.data) {
        setSelectedTicket(res.data);
      }
    } catch (e) {
      showToast('Could not load ticket details', 'error');
    }
  };

  const handleStatusTransition = async (ticketId: number, newStatus: TicketStatus) => {
    try {
      const res = await updateTicketStatusApi(ticketId, { status: newStatus });
      if (res.success && res.data) {
        setTickets((prev) => prev.map((t) => (t.id === ticketId ? res.data! : t)));
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(res.data);
        }
        showToast(`Ticket #${ticketId} status updated to ${newStatus}`, 'success');
      }
    } catch (err: any) {
      showToast('Status update failed', 'error');
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    setIsSubmittingReply(true);
    try {
      const res = await postStaffReplyApi(selectedTicket.id, {
        message: replyMessage.trim(),
        internalNote: isInternalNote,
      });

      if (res.success && res.data) {
        setSelectedTicket(res.data);
        setTickets((prev) => prev.map((t) => (t.id === res.data!.id ? res.data! : t)));
        setReplyMessage('');
        setIsInternalNote(false);
        showToast(`Reply dispatched to ${selectedTicket.clientEmail}`, 'success');
      }
    } catch (err: any) {
      showToast('Error sending reply', 'error');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketForm.subject || !newTicketForm.clientName) return;

    try {
      const res = await createCustomerTicketApi({
        subject: newTicketForm.subject.trim(),
        description: newTicketForm.description.trim(),
        clientName: newTicketForm.clientName.trim(),
        clientEmail: newTicketForm.clientEmail.trim(),
        clientPhone: newTicketForm.clientPhone.trim(),
        department: newTicketForm.department,
        priority: newTicketForm.priority,
      });

      if (res.success && res.data) {
        setTickets([res.data, ...tickets]);
        setIsCreateModalOpen(false);
        setNewTicketForm({
          subject: '',
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          department: 'TECHNICAL',
          priority: 'HIGH',
          description: '',
        });
        showToast(`Ticket #${res.data.ticketCode} created successfully`, 'success');
      }
    } catch (err: any) {
      showToast('Failed to create ticket', 'error');
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesDept = departmentFilter === 'ALL' || t.department.toUpperCase() === departmentFilter.toUpperCase();
    const matchesSearch =
      !searchQuery.trim() ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketCode.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Viewport Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Support Desk &amp; Help Desk Queue</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise support ticket routing, client communications, and SLA lifecycle management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/support"
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Dedicated Support Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <AdminButton
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Log Support Ticket
          </AdminButton>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by ID, subject, customer, or error message..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            <option value="TECHNICAL">Technical</option>
            <option value="BILLING">Billing &amp; GST</option>
            <option value="LICENSING">Licensing</option>
            <option value="SALES">Sales</option>
            <option value="GENERAL">General</option>
          </select>

          <button
            onClick={fetchTickets}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Tickets Table / List */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading live tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-800">Support Desk Clean</h3>
            <p className="text-xs text-slate-500 mt-1">No pending support tickets in this view.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5">Ticket ID</th>
                  <th className="p-3.5">Subject &amp; Latest Update</th>
                  <th className="p-3.5">Client Organization</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5 text-center">Priority</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">SLA Target</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-sky-700">#{t.ticketCode}</td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-semibold text-slate-900 line-clamp-1">{t.subject}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{t.lastReply || t.description}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{t.clientName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{t.clientEmail}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                        {t.department}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        t.priority === 'URGENT' ? "bg-rose-100 text-rose-800" :
                        t.priority === 'HIGH' ? "bg-amber-100 text-amber-800" :
                        "bg-slate-100 text-slate-700"
                      )}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        t.status === 'RESOLVED' || t.status === 'CLOSED' ? "bg-emerald-100 text-emerald-800" :
                        t.status === 'IN_PROGRESS' ? "bg-sky-100 text-sky-800" :
                        "bg-amber-100 text-amber-800"
                      )}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono text-slate-700">
                      {t.slaHoursRemaining !== undefined ? `${t.slaHoursRemaining}h remaining` : 'Active'}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleSelectTicket(t.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800 cursor-pointer shadow-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Detail Drawer */}
      <AdminDrawer
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        width="lg"
        title={
          selectedTicket ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-sky-700">#{selectedTicket.ticketCode}</span>
              <span className="text-slate-900 font-bold truncate max-w-sm">{selectedTicket.subject}</span>
            </div>
          ) : 'Ticket Inspection'
        }
        subtitle={selectedTicket ? `${selectedTicket.clientName} (${selectedTicket.clientEmail}) • Dept: ${selectedTicket.department}` : ''}
      >
        {selectedTicket && (
          <div className="space-y-5 text-xs">
            {/* Status Control */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Transition Status:</span>
              <div className="flex gap-1.5">
                {(['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED'] as TicketStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusTransition(selectedTicket.id, st)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer",
                      selectedTicket.status === st
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Initial Description */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 text-[11px]">Original Issue Description:</div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
            </div>

            {/* Conversation Thread */}
            <div className="space-y-3">
              <div className="font-bold text-slate-800 text-[11px]">Thread Messages:</div>
              {selectedTicket.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "p-3 rounded-xl border text-xs space-y-1",
                    msg.internalNote ? "bg-amber-50 border-amber-200 text-amber-900" :
                    msg.senderRole === 'CUSTOMER' ? "bg-white border-slate-200" :
                    "bg-sky-50 border-sky-200 text-sky-950"
                  )}
                >
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span>{msg.senderName} ({msg.internalNote ? 'Staff Note' : msg.senderRole})</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Quick Reply Form */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-[11px]">Dispatch Response:</span>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                  <span>Internal Staff Note</span>
                </label>
              </div>

              <textarea
                rows={3}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type response to client or internal engineering note..."
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
              />

              <div className="flex justify-end">
                <AdminButton
                  variant="primary"
                  size="sm"
                  onClick={handleSendReply}
                  isLoading={isSubmittingReply}
                  disabled={!replyMessage.trim()}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Send Update
                </AdminButton>
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>

      {/* Log Ticket Modal */}
      <AdminModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Log Support Ticket"
        maxWidth="md"
      >
        <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Ticket Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={newTicketForm.subject}
              onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
              placeholder="e.g. License sync error on Hospital Server"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Client Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={newTicketForm.clientName}
                onChange={(e) => setNewTicketForm({ ...newTicketForm, clientName: e.target.value })}
                placeholder="Client contact name"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Client Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={newTicketForm.clientEmail}
                onChange={(e) => setNewTicketForm({ ...newTicketForm, clientEmail: e.target.value })}
                placeholder="client@company.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={newTicketForm.department}
                onChange={(e) => setNewTicketForm({ ...newTicketForm, department: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900"
              >
                <option value="TECHNICAL">Technical &amp; Bugs</option>
                <option value="BILLING">Billing &amp; Tax</option>
                <option value="LICENSING">Licensing &amp; Activations</option>
                <option value="SALES">Sales &amp; Upgrades</option>
                <option value="GENERAL">General Support</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={newTicketForm.priority}
                onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent (4h SLA)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Issue Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={newTicketForm.description}
              onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
              placeholder="Describe client issue or error..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <AdminButton variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" size="sm" type="submit">
              Log Support Ticket
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}

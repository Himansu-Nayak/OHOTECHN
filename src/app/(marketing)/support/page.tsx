'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Headphones, Search, Filter, Plus, Clock, CheckCircle2, 
  AlertCircle, MessageSquare, Send, User, ChevronRight, X, 
  Tag, ShieldAlert, ArrowRight, CornerDownRight, RefreshCw,
  Building2, Phone, Mail, AlertTriangle, Check, ShieldCheck,
  FileText, ExternalLink, HelpCircle, Lock, UserCheck, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { 
  SupportTicketDto, 
  SupportTicketMessageDto, 
  SupportStatsDto,
  ContactEnquiry,
  TicketDepartment,
  TicketPriority,
  TicketStatus,
  SupportAiSummaryDto
} from '@/api/types';
import { 
  getStaffTicketsApi, 
  getStaffTicketDetailsApi, 
  postStaffReplyApi, 
  updateTicketStatusApi, 
  convertEnquiryToTicketApi, 
  getSupportStatsApi, 
  getSupportEnquiriesApi,
  createCustomerTicketApi,
  getMyCustomerTicketsApi,
  getMyCustomerTicketDetailsApi,
  postCustomerReplyApi,
  getTicketAiSummaryApi
} from '@/api/support';
import {
  DashboardShell,
  V15MetricCard,
  V15AccentActionCard,
  V15Card,
  V15PillTabs,
  V15CircularGauge,
  V15StaggerContainer,
  V15StaggerItem,
} from '@/components/dashboard/V15DashboardPrimitives';

export default function SupportPanelPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();

  const isStaff = user && [
    'ROLE_SUPPORT', 'SUPPORT', 
    'ROLE_ADMIN', 'ADMIN', 
    'ROLE_DEVELOPER', 'DEVELOPER'
  ].includes(user.role);

  // View state
  const [activeTab, setActiveTab] = React.useState<'tickets' | 'enquiries' | 'my-tickets'>('tickets');
  const [tickets, setTickets] = React.useState<SupportTicketDto[]>([]);
  const [enquiries, setEnquiries] = React.useState<ContactEnquiry[]>([]);
  const [stats, setStats] = React.useState<SupportStatsDto | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = React.useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Selected Ticket Drawer / Conversation
  const [selectedTicket, setSelectedTicket] = React.useState<SupportTicketDto | null>(null);
  const [replyMessage, setReplyMessage] = React.useState('');
  const [isInternalNote, setIsInternalNote] = React.useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = React.useState(false);
  const [aiSummary, setAiSummary] = React.useState<SupportAiSummaryDto | null>(null);
  const [isLoadingAi, setIsLoadingAi] = React.useState(false);

  // Create Ticket Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isSubmittingCreate, setIsSubmittingCreate] = React.useState(false);
  const [newTicketForm, setNewTicketForm] = React.useState({
    subject: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    department: 'TECHNICAL' as TicketDepartment,
    priority: 'MEDIUM' as TicketPriority,
    description: '',
  });

  // Auth gate
  React.useEffect(() => {
    if (!isAuthLoading && !user) {
      showToast('Please sign in to access the Support Desk.', 'info');
      router.push('/login');
    }
  }, [isAuthLoading, user, router, showToast]);

  // Set default tab for customer
  React.useEffect(() => {
    if (user && !isStaff) {
      setActiveTab('my-tickets');
    }
  }, [user, isStaff]);

  // Load Data
  const fetchData = React.useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      if (isStaff) {
        const [ticketsRes, statsRes, enquiriesRes] = await Promise.all([
          getStaffTicketsApi({
            status: statusFilter !== 'ALL' ? statusFilter : undefined,
            department: departmentFilter !== 'ALL' ? departmentFilter : undefined,
            priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
            search: searchQuery || undefined,
          }),
          getSupportStatsApi().catch(() => null),
          getSupportEnquiriesApi().catch(() => null),
        ]);

        if (ticketsRes.success && ticketsRes.data) {
          setTickets(ticketsRes.data);
        }
        if (statsRes?.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (enquiriesRes?.success && enquiriesRes.data) {
          setEnquiries(enquiriesRes.data);
        }
      } else {
        // Customer view
        const myRes = await getMyCustomerTicketsApi();
        if (myRes.success && myRes.data) {
          setTickets(myRes.data);
        }
      }
    } catch (err: any) {
      console.warn('Error loading support data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, isStaff, statusFilter, departmentFilter, priorityFilter, searchQuery]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Open ticket thread
  const handleOpenTicket = async (ticketId: number) => {
    setAiSummary(null);
    try {
      const res = isStaff 
        ? await getStaffTicketDetailsApi(ticketId)
        : await getMyCustomerTicketDetailsApi(ticketId);

      if (res.success && res.data) {
        setSelectedTicket(res.data);
      }
    } catch (err: any) {
      showToast('Failed to load ticket thread details', 'error');
    }
  };


  // Auto-open ticket if ticketId query param is present
  React.useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const params = new URLSearchParams(window.location.search);
      const ticketIdParam = params.get('ticketId');
      if (ticketIdParam) {
        const id = parseInt(ticketIdParam, 10);
        if (!isNaN(id)) {
          handleOpenTicket(id);
        }
      }
    }
  }, [user]);

  const handleFetchAiTriage = async () => {
    if (!selectedTicket) return;
    setIsLoadingAi(true);
    try {
      const res = await getTicketAiSummaryApi(selectedTicket.id);
      if (res.success && res.data) {
        setAiSummary(res.data);
        showToast('AI analysis & response drafted', 'success');
      } else {
        showToast(res.message || 'AI summary unavailable', 'error');
      }
    } catch {
      showToast('Error requesting AI triage', 'error');
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Reply handler
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    setIsSubmittingReply(true);
    try {
      const res = isStaff
        ? await postStaffReplyApi(selectedTicket.id, {
            message: replyMessage.trim(),
            internalNote: isInternalNote,
          })
        : await postCustomerReplyApi(selectedTicket.id, {
            message: replyMessage.trim(),
          });

      if (res.success && res.data) {
        showToast(isInternalNote ? 'Internal staff note recorded' : 'Reply dispatched successfully', 'success');
        setSelectedTicket(res.data);
        setReplyMessage('');
        setIsInternalNote(false);
        // Refresh ticket in list
        setTickets((prev) => prev.map((t) => (t.id === res.data!.id ? res.data! : t)));
      } else {
        throw new Error(res.message || 'Failed to post reply');
      }
    } catch (err: any) {
      showToast(err.message || 'Error posting reply', 'error');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Status transition handler
  const handleStatusTransition = async (newStatus: TicketStatus) => {
    if (!selectedTicket) return;
    try {
      const res = await updateTicketStatusApi(selectedTicket.id, { status: newStatus });
      if (res.success && res.data) {
        showToast(`Ticket status updated to ${newStatus}`, 'success');
        setSelectedTicket(res.data);
        setTickets((prev) => prev.map((t) => (t.id === res.data!.id ? res.data! : t)));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update ticket status', 'error');
    }
  };

  // Convert Enquiry to Ticket
  const handleConvertEnquiry = async (enquiryId: number) => {
    try {
      const res = await convertEnquiryToTicketApi(enquiryId);
      if (res.success && res.data) {
        showToast(`Enquiry converted to Ticket #${res.data.ticketCode}`, 'success');
        setTickets((prev) => [res.data!, ...prev]);
        setEnquiries((prev) => prev.map((e) => (e.id === enquiryId ? { ...e, status: 'RESPONDED' } : e)));
        setSelectedTicket(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Conversion failed', 'error');
    }
  };

  // Create Ticket handler
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketForm.subject.trim() || !newTicketForm.description.trim()) {
      showToast('Subject and description are required.', 'error');
      return;
    }

    setIsSubmittingCreate(true);
    try {
      const res = await createCustomerTicketApi({
        subject: newTicketForm.subject.trim(),
        description: newTicketForm.description.trim(),
        department: newTicketForm.department,
        priority: newTicketForm.priority,
        clientName: newTicketForm.clientName.trim() || user?.name,
        clientEmail: newTicketForm.clientEmail.trim() || user?.email,
        clientPhone: newTicketForm.clientPhone.trim() || user?.phone,
      });

      if (res.success && res.data) {
        showToast(`Ticket #${res.data.ticketCode} registered successfully!`, 'success');
        setTickets((prev) => [res.data!, ...prev]);
        setIsCreateModalOpen(false);
        setNewTicketForm({
          subject: '',
          clientName: user?.name || '',
          clientEmail: user?.email || '',
          clientPhone: user?.phone || '',
          department: 'TECHNICAL',
          priority: 'MEDIUM',
          description: '',
        });
        setSelectedTicket(res.data);
      } else {
        throw new Error(res.message || 'Failed to create ticket');
      }
    } catch (err: any) {
      showToast(err.message || 'Error registering ticket', 'error');
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen bg-[#f8f9fe] flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const dashboardReturnLink = isStaff ? '/admin' : '/dashboard';

  return (
    <DashboardShell theme="light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href={dashboardReturnLink} className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <span>← Back to {isStaff ? 'Admin Console' : 'Customer Portal'}</span>
            </Link>
            <span>/</span>
            <span className="text-slate-900">Support Operations Desk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">Support Engine Online</span>
          </div>
        </div>

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  {isStaff ? 'Support Operations & Help Desk' : 'Customer Support & Help Center'}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  {isStaff 
                    ? 'Resolve client queries, manage support tickets, update SLAs, and track enquiries.' 
                    : 'Submit queries, communicate with our engineering support desk, and track issue resolution.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isStaff ? 'New Ticket' : 'Raise Support Ticket'}</span>
            </button>

            <button
              onClick={fetchData}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Staff KPI Dashboard Cards */}
        {isStaff && stats && (
          <div className="space-y-6">
            <V15StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <V15MetricCard
                label="Open Queue"
                value={stats.openTickets}
                subvalue="Awaiting agent response"
                icon={Clock}
                accentColor="blue"
              />
              <V15MetricCard
                label="In Progress"
                value={stats.inProgressTickets}
                subvalue="Under engineering review"
                icon={Headphones}
                accentColor="amber"
              />
              <V15MetricCard
                label="Urgent Issues"
                value={stats.urgentTickets}
                subvalue="High-priority SLA alerts"
                icon={AlertTriangle}
                accentColor="rose"
                trend={{ value: 'Priority SLA', direction: stats.urgentTickets > 0 ? 'down' : 'neutral' }}
              />
              <V15MetricCard
                label="Resolved Today"
                value={stats.resolvedToday}
                subvalue="Successfully closed queries"
                icon={CheckCircle2}
                accentColor="emerald"
                trend={{ value: '100% On-Time', direction: 'up' }}
              />
            </V15StaggerContainer>

            {/* V15 SLA Telemetry Gauge & Action Strip */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <V15CircularGauge
                title="Support SLA Compliance"
                subtitle="On-time incident resolution telemetry"
                value={98.6}
                displayValue="98.6%"
                label="SLA On-Time"
                primaryColor="#10b981"
                metrics={[
                  { label: 'Technical', value: '99.2%', color: '#10b981' },
                  { label: 'Billing / Pay', value: '100%', color: '#0ea5e9' },
                  { label: 'Enterprise', value: '98.5%', color: '#8b5cf6' },
                  { label: 'Enquiries', value: '96.8%', color: '#ea580c' },
                ]}
              />

              <div className="lg:col-span-2">
                <V15AccentActionCard
                  title="Direct Engineering Dispatch"
                  subtitle="Escalate complex cloud deployments, cryptographic license anomalies, and architectural incidents directly to core engineering."
                  buttonText="Create Priority Incident"
                  badge="Core Dispatch"
                  metricValue={stats.openTickets}
                  metricLabel="Active Inbound Tickets"
                  icon={Headphones}
                  onAction={() => setIsCreateModalOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* V15 Pill Tab Navigation */}
        {isStaff && (
          <V15PillTabs
            tabs={[
              { key: 'tickets', label: 'Support Tickets Queue', icon: Headphones, badge: tickets.length },
              { key: 'enquiries', label: 'Website Inbound Enquiries', icon: Mail, badge: enquiries.length },
            ]}
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as any)}
          />
        )}

        {/* TAB 1: Support Tickets Table & Details Drawer */}
        {(activeTab === 'tickets' || activeTab === 'my-tickets') && (
          <div className="space-y-4">
            
            {/* Filter Bar */}
            {isStaff && (
              <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-[22px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Ticket ID (#TCK), Subject, Client Name, Email, or Phone..."
                    className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 text-slate-700 cursor-pointer"
                  >
                    <option value="ALL">All Departments</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="BILLING">Billing &amp; GST</option>
                    <option value="LICENSING">Licensing</option>
                    <option value="SALES">Sales &amp; Enterprise</option>
                    <option value="GENERAL">General</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 text-slate-700 cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 text-slate-700 cursor-pointer"
                  >
                    <option value="ALL">All Priorities</option>
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
            )}

            {/* Tickets Table / List */}
            <div className="bg-white border-2 border-slate-200 rounded-[28px] overflow-hidden shadow-xs">
              {isLoading ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-500" />
                  <span>Loading support tickets...</span>
                </div>
              ) : tickets.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h3 className="font-bold text-sm text-slate-800">Support Queue Clean</h3>
                  <p className="text-xs text-slate-500 mt-1">No pending support tickets match your filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="py-3.5 px-4">Ticket Ref</th>
                        <th className="py-3.5 px-4">Client / Account</th>
                        <th className="py-3.5 px-4">Subject &amp; Latest Update</th>
                        <th className="py-3.5 px-4">Department</th>
                        <th className="py-3.5 px-4 text-center">Priority</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                        <th className="py-3.5 px-4 text-right">SLA / Time</th>
                        <th className="py-3.5 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tickets.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-sky-700 whitespace-nowrap">
                            #{t.ticketCode}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{t.clientName}</div>
                            <div className="text-[10px] text-slate-500">{t.clientEmail}</div>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-semibold text-slate-900 line-clamp-1">{t.subject}</div>
                            <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{t.lastReply || t.description}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                              {t.department}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                              t.priority === 'URGENT' ? "bg-rose-100 text-rose-800" :
                              t.priority === 'HIGH' ? "bg-amber-100 text-amber-800" :
                              "bg-slate-100 text-slate-700"
                            )}>
                              {t.priority}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                              t.status === 'RESOLVED' || t.status === 'CLOSED' ? "bg-emerald-100 text-emerald-800" :
                              t.status === 'IN_PROGRESS' ? "bg-sky-100 text-sky-800" :
                              "bg-amber-100 text-amber-800"
                            )}>
                              {t.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="font-mono text-slate-700">
                              {t.slaHoursRemaining !== undefined ? `${t.slaHoursRemaining}h remaining` : 'Active'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : ''}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleOpenTicket(t.id)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs"
                            >
                              Open Thread
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: Website Contact Enquiries (For Staff) */}
        {isStaff && activeTab === 'enquiries' && (
          <div className="bg-white border-2 border-slate-200 rounded-[28px] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Website Inquiries &amp; Pre-Sales Leads</h3>
                <p className="text-xs text-slate-500">Contact forms submitted from the public portal.</p>
              </div>
              <span className="font-mono text-xs font-bold text-slate-700">{enquiries.length} Records</span>
            </div>

            <div className="divide-y divide-slate-100">
              {enquiries.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No website enquiries registered.</div>
              ) : (
                enquiries.map((enq) => (
                  <div key={enq.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">#ENQ-{enq.id}</span>
                        <span className="font-bold text-slate-900">{enq.name}</span>
                        <span className="text-slate-400">({enq.email})</span>
                        {enq.phone && <span className="text-slate-500 font-mono">{enq.phone}</span>}
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                          enq.status === 'RESPONDED' ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        )}>
                          {enq.status}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800">{enq.subject || 'Direct General Inquiry'}</div>
                      <p className="text-slate-600 text-[11px] leading-relaxed max-w-3xl">{enq.message}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleConvertEnquiry(enq.id)}
                        className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Headphones className="w-3.5 h-3.5" />
                        <span>Convert to Support Ticket</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* Ticket Details & Conversation Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-slate-300 rounded-[32px] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                    #{selectedTicket.ticketCode}
                  </span>
                  <span className="font-bold text-slate-900 text-base">{selectedTicket.subject}</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span>Client: <strong>{selectedTicket.clientName}</strong> ({selectedTicket.clientEmail})</span>
                  <span>•</span>
                  <span>Dept: <strong>{selectedTicket.department}</strong></span>
                  <span>•</span>
                  <span>Priority: <strong>{selectedTicket.priority}</strong></span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar (Staff) */}
            {isStaff && (
              <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-600">Stage:</span>
                  {(['OPEN', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED'] as TicketStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusTransition(st)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer",
                        selectedTicket.status === st
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {selectedTicket.slaDueAt && (
                  <div className="text-[11px] font-mono text-slate-500">
                    Target SLA: {new Date(selectedTicket.slaDueAt).toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            )}

            {/* Conversation Thread */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-[#fafafa]">
              {/* Original Description */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-slate-700">Initial Problem Statement</span>
                  <span>{new Date(selectedTicket.createdAt).toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              {/* Messages */}
              {selectedTicket.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "p-4 rounded-2xl border text-xs space-y-1 shadow-xs",
                    msg.internalNote
                      ? "bg-amber-50/80 border-amber-200 text-amber-900 ml-6"
                      : msg.senderRole === 'CUSTOMER'
                      ? "bg-white border-slate-200 text-slate-900 mr-6"
                      : "bg-sky-50/80 border-sky-200 text-sky-950 ml-6"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span>{msg.senderName}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-black/5 text-slate-600">
                        {msg.internalNote ? 'Staff Internal Note' : msg.senderRole}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* AI Assistant for Staff */}
            {isStaff && (
              <div className="px-6 py-3 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-white border-t border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-950">AI Copilot &amp; Triage (Gemini 2.5)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchAiTriage}
                    disabled={isLoadingAi}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className={cn("w-3 h-3", isLoadingAi && "animate-spin")} />
                    <span>{isLoadingAi ? "Analyzing..." : aiSummary ? "Re-run Triage" : "AI Smart Triage"}</span>
                  </button>
                </div>

                {aiSummary && (
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex flex-wrap items-center gap-2 text-[10px]">
                      <span className="font-semibold text-slate-500">Category:</span>
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-white text-indigo-900 border border-indigo-200">
                        {aiSummary.detectedIssueCategory}
                      </span>
                      <span className="font-semibold text-slate-500">Sentiment:</span>
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-200">
                        {aiSummary.customerSentiment}
                      </span>
                      <span className="font-semibold text-slate-500">Suggested Priority:</span>
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-white text-slate-900 border border-slate-200">
                        {aiSummary.suggestedPriority}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-indigo-100 text-[11px] text-slate-700">
                      <strong>AI Summary:</strong> {aiSummary.executiveSummary}
                    </div>

                    {aiSummary.recommendedNextActions && aiSummary.recommendedNextActions.length > 0 && (
                      <div className="p-2 rounded-xl bg-white border border-indigo-100 text-[11px] text-slate-700 space-y-1">
                        <strong>Next Actions:</strong>
                        <ul className="list-disc list-inside space-y-0.5">
                          {aiSummary.recommendedNextActions.map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiSummary.draftedAgentReply && (
                      <div className="p-2 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <strong className="text-indigo-950">Drafted Customer Reply:</strong>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyMessage(aiSummary.draftedAgentReply);
                              setIsInternalNote(false);
                              showToast('AI reply inserted into composer', 'info');
                            }}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                          >
                            Use this drafted reply
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-700 italic">{aiSummary.draftedAgentReply}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reply Composer Form */}
            <form onSubmit={handleSendReply} className="p-4 sm:p-5 border-t border-slate-200 bg-white shrink-0 space-y-3">
              {isStaff && (
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>Internal Staff Note (Invisible to Customer)</span>
                  </label>
                </div>
              )}

              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={
                    isInternalNote 
                      ? "Type an internal note for support engineering..." 
                      : "Type your reply to the customer..."
                  }
                  className="flex-1 p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
                  required
                />

                <button
                  type="submit"
                  disabled={isSubmittingReply || !replyMessage.trim()}
                  className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Register Support Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-slate-300 rounded-[32px] w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Headphones className="w-5 h-5 text-sky-600" />
                <span>{isStaff ? 'Log Client Support Ticket' : 'Raise New Support Ticket'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ticket Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  placeholder="e.g. License synchronization failure on Server 2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={newTicketForm.department}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, department: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900 cursor-pointer"
                  >
                    <option value="TECHNICAL">Technical &amp; Bugs</option>
                    <option value="BILLING">Billing &amp; GST</option>
                    <option value="LICENSING">Licensing &amp; Activations</option>
                    <option value="SALES">Enterprise Sales</option>
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-slate-900 cursor-pointer"
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
                  Detailed Query Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={newTicketForm.description}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                  placeholder="Provide detailed description of the query, error codes, software version, or request..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider shadow-xs cursor-pointer"
                >
                  {isSubmittingCreate ? 'Registering...' : 'Register Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardShell>
  );
}

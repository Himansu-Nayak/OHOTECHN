'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Users, Search, Filter, Calendar, ChevronLeft, ChevronRight, Lock,
  Plus, Edit3, Trash2, UserCheck, Eye, RefreshCw, X, Tag, DollarSign,
  Building, Phone, Mail, Clock, CheckCircle2, AlertCircle, ArrowRight,
  Kanban, List, CheckSquare, MessageSquare, PhoneCall, Send, Video, AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  LeadDto, LeadStatus, LeadSource, LeadPriority, UserDto,
  LeadActivityDto, LeadFollowUpDto, PipelineStageDto, FollowUpDashboardDto,
  ActivityType, FollowUpStatus
} from '@/api/types';
import {
  getAdminLeadsApi, createAdminLeadApi, updateAdminLeadApi,
  updateAdminLeadStatusApi, assignAdminLeadApi, deleteAdminLeadApi,
  getPipelineBoardApi, getLeadActivitiesApi, createLeadActivityApi,
  getLeadFollowUpsApi, createLeadFollowUpApi, updateFollowUpApi,
  getFollowUpDashboardApi
} from '@/api/crm';
import { getAdminUsersApi } from '@/api/users';
import { getAdminAuditLogsApi } from '@/api/admin';

const STATUS_BADGES: Record<LeadStatus, { label: string; color: string }> = {
  NEW: { label: 'NEW', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  CONTACTED: { label: 'CONTACTED', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  QUALIFIED: { label: 'QUALIFIED', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  DEMO_SCHEDULED: { label: 'DEMO SCHEDULED', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  DEMO_COMPLETED: { label: 'DEMO COMPLETED', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  QUOTE_SENT: { label: 'QUOTE SENT', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  NEGOTIATION: { label: 'NEGOTIATION', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  WON: { label: 'WON', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  LOST: { label: 'LOST', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  FOLLOW_UP: { label: 'FOLLOW UP', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
};

const PRIORITY_BADGES: Record<LeadPriority, { label: string; color: string }> = {
  LOW: { label: 'LOW', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  MEDIUM: { label: 'MEDIUM', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  HIGH: { label: 'HIGH', color: 'bg-amber-50 text-amber-700 border-amber-300' },
  URGENT: { label: 'URGENT', color: 'bg-rose-100 text-rose-800 border-rose-300 font-bold' },
};

export default function AdminCrmLeadsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [viewMode, setViewMode] = React.useState<'table' | 'pipeline' | 'followups'>('table');

  const [leads, setLeads] = React.useState<LeadDto[]>([]);
  const [pipelineStages, setPipelineStages] = React.useState<PipelineStageDto[]>([]);
  const [followUpDashboard, setFollowUpDashboard] = React.useState<FollowUpDashboardDto | null>(null);
  const [usersList, setUsersList] = React.useState<UserDto[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(0);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [totalElements, setTotalElements] = React.useState<number>(0);

  // Filters
  const [search, setSearch] = React.useState<string>('');
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = React.useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = React.useState<string>('ALL');
  const [assignedFilter, setAssignedFilter] = React.useState<string>('ALL');
  const [startDateStr, setStartDateStr] = React.useState<string>('');
  const [endDateStr, setEndDateStr] = React.useState<string>('');

  // Modals & Details State
  const [selectedLeadModal, setSelectedLeadModal] = React.useState<LeadDto | null>(null);
  const [activeLeadTab, setActiveLeadTab] = React.useState<'overview' | 'activities' | 'followups' | 'notes' | 'history'>('overview');
  const [leadActivities, setLeadActivities] = React.useState<LeadActivityDto[]>([]);
  const [leadFollowUps, setLeadFollowUps] = React.useState<LeadFollowUpDto[]>([]);
  const [leadHistory, setLeadHistory] = React.useState<any[]>([]);

  // Activity & Follow-Up Form State
  const [activityType, setActivityType] = React.useState<ActivityType>('CALL');
  const [activityDescription, setActivityDescription] = React.useState<string>('');
  const [followUpTitle, setFollowUpTitle] = React.useState<string>('');
  const [followUpDate, setFollowUpDate] = React.useState<string>('');
  const [followUpNotes, setFollowUpNotes] = React.useState<string>('');

  // Edit / Create Lead Modal State
  const [isEditModalOpen, setIsEditModalOpen] = React.useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState<boolean>(false);

  const [formData, setFormData] = React.useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    designation: string;
    industry: string;
    city: string;
    state: string;
    country: string;
    interestedProduct: string;
    source: LeadSource;
    status: LeadStatus;
    priority: LeadPriority;
    assignedToId: string;
    estimatedValue: string;
    notes: string;
    nextFollowUpAt: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    designation: '',
    industry: '',
    city: '',
    state: '',
    country: '',
    interestedProduct: '',
    source: 'WEBSITE',
    status: 'NEW',
    priority: 'MEDIUM',
    assignedToId: '',
    estimatedValue: '',
    notes: '',
    nextFollowUpAt: '',
  });

  const fetchLeads = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminLeadsApi({
        search: search || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        source: sourceFilter !== 'ALL' ? sourceFilter : undefined,
        priority: priorityFilter !== 'ALL' ? priorityFilter : undefined,
        assignedToId: assignedFilter !== 'ALL' ? Number(assignedFilter) : undefined,
        startDate: startDateStr || undefined,
        endDate: endDateStr || undefined,
        page,
        size: 15,
      });

      if (res.success && res.data) {
        setLeads(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (e: any) {
      console.warn('Failed to load CRM leads', e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sourceFilter, priorityFilter, assignedFilter, startDateStr, endDateStr, page]);

  const fetchPipeline = React.useCallback(async () => {
    try {
      const res = await getPipelineBoardApi();
      if (res.success && res.data) {
        setPipelineStages(res.data);
      }
    } catch (e) {
      console.warn('Failed to load pipeline board', e);
    }
  }, []);

  const fetchFollowUpDashboard = React.useCallback(async () => {
    try {
      const res = await getFollowUpDashboardApi();
      if (res.success && res.data) {
        setFollowUpDashboard(res.data);
      }
    } catch (e) {
      console.warn('Failed to load follow-up dashboard', e);
    }
  }, []);

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await getAdminUsersApi(0, 100);
      if (res.success && res.data) {
        setUsersList(res.data.content || []);
      }
    } catch (e) {
      console.warn('Failed to load users list', e);
    }
  }, []);

  React.useEffect(() => {
    if (viewMode === 'table') fetchLeads();
    if (viewMode === 'pipeline') fetchPipeline();
    if (viewMode === 'followups') fetchFollowUpDashboard();
  }, [viewMode, fetchLeads, fetchPipeline, fetchFollowUpDashboard]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Lead Details Modal Data Fetcher
  const loadLeadDetailsData = React.useCallback(async (leadId: number) => {
    try {
      const [actRes, folRes, auditRes] = await Promise.all([
        getLeadActivitiesApi(leadId),
        getLeadFollowUpsApi(leadId),
        getAdminAuditLogsApi(0, 20, undefined, 'CRM_LEAD', String(leadId)),
      ]);

      if (actRes.success && actRes.data) setLeadActivities(actRes.data);
      if (folRes.success && folRes.data) setLeadFollowUps(folRes.data);
      if (auditRes.success && auditRes.data) setLeadHistory(auditRes.data.content || []);
    } catch (e) {
      console.warn('Failed to fetch detailed lead data', e);
    }
  }, []);

  React.useEffect(() => {
    if (selectedLeadModal) {
      loadLeadDetailsData(selectedLeadModal.id);
    }
  }, [selectedLeadModal, loadLeadDetailsData]);

  const handleStatusChange = async (leadId: number, newStatus: LeadStatus) => {
    try {
      const res = await updateAdminLeadStatusApi(leadId, newStatus);
      if (res.success && res.data) {
        showToast(`Lead status updated to ${newStatus}`, 'success');
        setLeads((prev) => prev.map((l) => (l.id === leadId ? res.data! : l)));
        if (viewMode === 'pipeline') fetchPipeline();
        if (selectedLeadModal?.id === leadId) setSelectedLeadModal(res.data);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update status', 'error');
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadModal || !activityDescription.trim()) return;
    try {
      const res = await createLeadActivityApi(selectedLeadModal.id, {
        type: activityType,
        description: activityDescription,
      });
      if (res.success && res.data) {
        showToast(`Logged activity: ${activityType}`, 'success');
        setActivityDescription('');
        setLeadActivities((prev) => [res.data!, ...prev]);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to log activity', 'error');
    }
  };

  const handleAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadModal || !followUpTitle.trim() || !followUpDate) {
      showToast('Title and scheduled date are required', 'error');
      return;
    }
    try {
      const res = await createLeadFollowUpApi(selectedLeadModal.id, {
        title: followUpTitle,
        scheduledAt: new Date(followUpDate).toISOString(),
        notes: followUpNotes,
      });
      if (res.success && res.data) {
        showToast('Follow-up scheduled successfully!', 'success');
        setFollowUpTitle('');
        setFollowUpDate('');
        setFollowUpNotes('');
        setLeadFollowUps((prev) => [...prev, res.data!]);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to schedule follow-up', 'error');
    }
  };

  const handleUpdateFollowUpStatus = async (followUpId: number, status: FollowUpStatus) => {
    try {
      const res = await updateFollowUpApi(followUpId, { status });
      if (res.success && res.data) {
        showToast(`Follow-up marked as ${status}`, 'success');
        if (viewMode === 'followups') fetchFollowUpDashboard();
        setLeadFollowUps((prev) => prev.map((f) => (f.id === followUpId ? res.data! : f)));
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update follow-up', 'error');
    }
  };

  const handleDeleteLead = async (leadId: number) => {
    if (!confirm('Are you sure you want to delete this CRM lead?')) return;
    try {
      const res = await deleteAdminLeadApi(leadId);
      if (res.success) {
        showToast('Lead deleted successfully', 'success');
        fetchLeads();
        if (viewMode === 'pipeline') fetchPipeline();
        if (selectedLeadModal?.id === leadId) setSelectedLeadModal(null);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete lead', 'error');
    }
  };

  const openCreateModal = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      companyName: '',
      designation: '',
      industry: '',
      city: '',
      state: '',
      country: '',
      interestedProduct: '',
      source: 'MANUAL',
      status: 'NEW',
      priority: 'MEDIUM',
      assignedToId: '',
      estimatedValue: '',
      notes: '',
      nextFollowUpAt: '',
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (lead: LeadDto) => {
    setSelectedLeadModal(lead);
    setFormData({
      firstName: lead.firstName || '',
      lastName: lead.lastName || '',
      email: lead.email || '',
      phone: lead.phone || '',
      companyName: lead.companyName || '',
      designation: lead.designation || '',
      industry: lead.industry || '',
      city: lead.city || '',
      state: lead.state || '',
      country: lead.country || '',
      interestedProduct: lead.interestedProduct || '',
      source: lead.source,
      status: lead.status,
      priority: lead.priority,
      assignedToId: lead.assignedToId ? String(lead.assignedToId) : '',
      estimatedValue: lead.estimatedValue ? String(lead.estimatedValue) : '',
      notes: lead.notes || '',
      nextFollowUpAt: lead.nextFollowUpAt ? lead.nextFollowUpAt.substring(0, 16) : '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      showToast('Email is required', 'error');
      return;
    }
    try {
      const res = await createAdminLeadApi({
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        email: formData.email,
        phone: formData.phone || undefined,
        companyName: formData.companyName || undefined,
        designation: formData.designation || undefined,
        industry: formData.industry || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        country: formData.country || undefined,
        interestedProduct: formData.interestedProduct || undefined,
        source: formData.source,
        status: formData.status,
        priority: formData.priority,
        assignedToId: formData.assignedToId ? Number(formData.assignedToId) : undefined,
        estimatedValue: formData.estimatedValue ? Number(formData.estimatedValue) : undefined,
        notes: formData.notes || undefined,
        nextFollowUpAt: formData.nextFollowUpAt ? new Date(formData.nextFollowUpAt).toISOString() : undefined,
      });

      if (res.success) {
        showToast('CRM Lead created successfully!', 'success');
        setIsCreateModalOpen(false);
        fetchLeads();
        if (viewMode === 'pipeline') fetchPipeline();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to create lead', 'error');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadModal) return;
    try {
      const res = await updateAdminLeadApi(selectedLeadModal.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        designation: formData.designation,
        industry: formData.industry,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        interestedProduct: formData.interestedProduct,
        source: formData.source,
        status: formData.status,
        priority: formData.priority,
        assignedToId: formData.assignedToId ? Number(formData.assignedToId) : undefined,
        estimatedValue: formData.estimatedValue ? Number(formData.estimatedValue) : undefined,
        notes: formData.notes,
        nextFollowUpAt: formData.nextFollowUpAt ? new Date(formData.nextFollowUpAt).toISOString() : undefined,
      });

      if (res.success && res.data) {
        showToast('CRM Lead updated successfully!', 'success');
        setIsEditModalOpen(false);
        setLeads((prev) => prev.map((l) => (l.id === selectedLeadModal.id ? res.data! : l)));
        setSelectedLeadModal(res.data);
        if (viewMode === 'pipeline') fetchPipeline();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update lead', 'error');
    }
  };

  const isAdmin = user && (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN');

  if (!user || !isAdmin) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4 font-mono">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <Lock className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Access Restricted</h1>
          <p className="text-xs text-slate-500 mb-6">Administrator credentials required to access CRM Sales Governance.</p>
          <Link href="/login" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="crm-leads-main">
        
        {/* Top Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin" className="text-xs font-mono font-bold text-sky-600 hover:underline">← Back to Admin Console</Link>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e] flex items-center gap-3">
              <Users className="w-8 h-8 text-sky-600" />
              CRM Sales Governance
            </h1>
            <p className="text-xs font-mono font-medium text-slate-600 mt-1">
              Lead qualification, Kanban pipeline board, activities log, and follow-up management.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono">
            
            {/* View Switcher */}
            <div className="bg-white border-2 border-slate-300 p-1.5 rounded-2xl flex items-center gap-1 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#0d0d0e] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <List className="w-3.5 h-3.5" /> Table View
              </button>
              <button
                onClick={() => setViewMode('pipeline')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'pipeline' ? 'bg-[#0d0d0e] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" /> Pipeline Board
              </button>
              <button
                onClick={() => setViewMode('followups')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'followups' ? 'bg-[#0d0d0e] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 text-amber-500" /> Follow-Up Dashboard
              </button>
            </div>

            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-2xl bg-[#0d0d0e] hover:bg-sky-600 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Lead
            </button>
          </div>
        </div>

        {/* VIEW 1: TABLE VIEW */}
        {viewMode === 'table' && (
          <>
            {/* Filters Bar */}
            <div className="bg-white border-2 border-slate-300 rounded-[28px] p-5 mb-6 shadow-sm space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="relative lg:col-span-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search name, company, email, phone, product..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium focus:outline-none focus:border-sky-600"
                  />
                </div>

                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    {Object.keys(STATUS_BADGES).map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={sourceFilter}
                    onChange={(e) => { setSourceFilter(e.target.value); setPage(0); }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="ALL">All Sources</option>
                    <option value="WEBSITE">WEBSITE</option>
                    <option value="CONTACT_FORM">CONTACT_FORM</option>
                    <option value="QUOTE_REQUEST">QUOTE_REQUEST</option>
                    <option value="DEMO_REQUEST">DEMO_REQUEST</option>
                    <option value="WEBSITE_PRODUCT">WEBSITE_PRODUCT</option>
                    <option value="FACEBOOK">FACEBOOK</option>
                    <option value="GOOGLE_ADS">GOOGLE_ADS</option>
                    <option value="MANUAL">MANUAL</option>
                  </select>
                </div>

                <div>
                  <select
                    value={priorityFilter}
                    onChange={(e) => { setPriorityFilter(e.target.value); setPage(0); }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="ALL">All Priorities</option>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lead Table */}
            <div className="bg-white border-2 border-slate-300 rounded-[28px] overflow-hidden shadow-sm font-mono text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-bold text-[11px]">
                      <th className="py-3.5 px-4">Name &amp; Contact</th>
                      <th className="py-3.5 px-4">Company</th>
                      <th className="py-3.5 px-4">Source</th>
                      <th className="py-3.5 px-4">Product Interest</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Priority</th>
                      <th className="py-3.5 px-4">Assigned To</th>
                      <th className="py-3.5 px-4">Next Follow-Up</th>
                      <th className="py-3.5 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={9} className="py-12 text-center text-slate-400">Loading CRM leads...</td></tr>
                    ) : leads.length === 0 ? (
                      <tr><td colSpan={9} className="py-12 text-center text-slate-500">No CRM lead records found.</td></tr>
                    ) : (
                      leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#0d0d0e]">
                              {lead.firstName || lead.lastName ? `${lead.firstName || ''} ${lead.lastName || ''}`.trim() : 'Unnamed Lead'}
                            </div>
                            <div className="text-[10px] text-slate-500">{lead.email}</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-700">{lead.companyName || '—'}</td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                              {lead.source}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-sky-800">{lead.interestedProductName || lead.interestedProduct || 'General Enquiry'}</td>
                          <td className="py-3.5 px-4">
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                              className={`text-[10px] font-bold px-2 py-1 rounded-xl border focus:outline-none cursor-pointer ${STATUS_BADGES[lead.status]?.color}`}
                            >
                              {Object.keys(STATUS_BADGES).map((st) => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${PRIORITY_BADGES[lead.priority]?.color}`}>
                              {lead.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">{lead.assignedToName || <span className="text-slate-400 italic">Unassigned</span>}</td>
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                            {lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '—'}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedLeadModal(lead)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 mr-1"
                              title="View &amp; Manage Lead"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(lead)}
                              className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700"
                              title="Edit Lead"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: KANBAN PIPELINE BOARD */}
        {viewMode === 'pipeline' && (
          <div className="overflow-x-auto no-scrollbar font-mono pb-6">
            <div className="flex gap-4 min-w-[1400px]">
              {pipelineStages.map((stage) => (
                <div key={stage.status} className="w-72 shrink-0 bg-white border-2 border-slate-300 rounded-[28px] p-4 flex flex-col max-h-[80vh] shadow-sm">
                  
                  {/* Stage Header */}
                  <div className="pb-3 border-b border-slate-200 mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-xs uppercase text-[#0d0d0e] flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full inline-block ${STATUS_BADGES[stage.status]?.color}`} />
                        {stage.stageName}
                      </h3>
                      <div className="text-[10px] text-slate-500 font-bold mt-0.5">
                        ₹{stage.totalValue ? stage.totalValue.toLocaleString('en-IN') : 0}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                      {stage.count}
                    </span>
                  </div>

                  {/* Stage Cards List */}
                  <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                    {stage.leads.length === 0 ? (
                      <div className="text-center py-8 text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                        No leads in stage
                      </div>
                    ) : (
                      stage.leads.map((lead) => (
                        <div
                          key={lead.id}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-500 transition-all shadow-xs group"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span className="font-bold text-sky-600">#{lead.id}</span>
                            <span className={`px-1.5 py-0.5 rounded-full border text-[9px] ${PRIORITY_BADGES[lead.priority]?.color}`}>
                              {lead.priority}
                            </span>
                          </div>

                          <h4 className="font-bold text-xs text-[#0d0d0e] group-hover:text-sky-600 transition-colors">
                            {lead.firstName || lead.lastName ? `${lead.firstName || ''} ${lead.lastName || ''}`.trim() : lead.email}
                          </h4>

                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{lead.companyName || 'No Company'}</p>

                          <div className="mt-3 text-[10px] space-y-1 text-slate-600 pt-2 border-t border-slate-200/60">
                            <div>Prod: <strong className="text-purple-700">{lead.interestedProductName || lead.interestedProduct || 'General'}</strong></div>
                            <div>Value: <strong className="text-emerald-700">₹{lead.estimatedValue ? lead.estimatedValue.toLocaleString('en-IN') : '0'}</strong></div>
                            <div>Assigned: <strong>{lead.assignedToName || 'Unassigned'}</strong></div>
                          </div>

                          {/* Quick Stage Select */}
                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60">
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                              className="text-[10px] font-bold bg-white border border-slate-300 rounded-lg px-2 py-1 focus:outline-none"
                            >
                              {Object.keys(STATUS_BADGES).map((st) => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>

                            <button
                              onClick={() => setSelectedLeadModal(lead)}
                              className="p-1 rounded-lg bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"
                              title="Open Details"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          </div>

                        </div>
                      ))
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: FOLLOW-UP DASHBOARD */}
        {viewMode === 'followups' && followUpDashboard && (
          <div className="space-y-6 font-mono text-xs">
            
            {/* KPI Summary Header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                <span className="text-slate-400 font-bold block mb-1 uppercase text-[10px]">Today&apos;s Follow-Ups</span>
                <div className="text-3xl font-black text-sky-700">{followUpDashboard.todayCount}</div>
              </div>
              <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                <span className="text-rose-500 font-bold block mb-1 uppercase text-[10px]">Overdue Follow-Ups</span>
                <div className="text-3xl font-black text-rose-600">{followUpDashboard.overdueCount}</div>
              </div>
              <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                <span className="text-emerald-600 font-bold block mb-1 uppercase text-[10px]">Upcoming Follow-Ups</span>
                <div className="text-3xl font-black text-emerald-700">{followUpDashboard.upcomingCount}</div>
              </div>
            </div>

            {/* Overdue Section */}
            {followUpDashboard.overdueFollowUps.length > 0 && (
              <div className="bg-rose-50 border-2 border-rose-200 rounded-[32px] p-6 shadow-sm">
                <h3 className="text-sm font-black text-rose-900 mb-4 uppercase flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Overdue Alerts (Requires Action)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {followUpDashboard.overdueFollowUps.map((fol) => (
                    <div key={fol.id} className="bg-white border border-rose-300 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-rose-700">OVERDUE</span>
                        <span className="text-slate-500">{new Date(fol.scheduledAt).toLocaleString('en-IN')}</span>
                      </div>
                      <h4 className="font-bold text-xs text-[#0d0d0e]">{fol.title}</h4>
                      <p className="text-[11px] text-slate-600">{fol.leadName} ({fol.companyName || fol.leadEmail})</p>
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <span className="text-[10px] text-slate-400">Assigned: {fol.assignedUserName}</span>
                        <button
                          onClick={() => handleUpdateFollowUpStatus(fol.id, 'COMPLETED')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px] hover:bg-emerald-700"
                        >
                          Mark Done ✓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Today's Section */}
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 shadow-sm">
              <h3 className="text-sm font-black text-[#0d0d0e] mb-4 uppercase flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" /> Today&apos;s Scheduled Follow-Ups
              </h3>
              {followUpDashboard.todayFollowUps.length === 0 ? (
                <div className="text-center py-6 text-slate-400 font-bold">No follow-ups scheduled for today.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {followUpDashboard.todayFollowUps.map((fol) => (
                    <div key={fol.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-sky-700">{fol.status}</span>
                        <span className="text-slate-500">{new Date(fol.scheduledAt).toLocaleTimeString('en-IN', { timeStyle: 'short' })}</span>
                      </div>
                      <h4 className="font-bold text-xs text-[#0d0d0e]">{fol.title}</h4>
                      <p className="text-[11px] text-slate-600">{fol.leadName} ({fol.companyName || fol.leadEmail})</p>
                      <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                        <span className="text-[10px] text-slate-400">Assigned: {fol.assignedUserName}</span>
                        {fol.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateFollowUpStatus(fol.id, 'COMPLETED')}
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px] hover:bg-emerald-700"
                          >
                            Mark Done ✓
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ENHANCED TABBED LEAD DETAILS MODAL */}
        {selectedLeadModal && !isEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
            <div className="bg-white border-2 border-slate-300 rounded-[32px] max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
              
              <button
                onClick={() => setSelectedLeadModal(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Lead Title Header */}
              <div className="flex items-center gap-2 text-xs text-sky-600 font-bold mb-2">
                <span>LEAD #{selectedLeadModal.id}</span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded-full border ${STATUS_BADGES[selectedLeadModal.status]?.color}`}>
                  {selectedLeadModal.status}
                </span>
              </div>

              <h2 className="text-2xl font-black text-[#0d0d0e] mb-1">
                {selectedLeadModal.firstName || selectedLeadModal.lastName
                  ? `${selectedLeadModal.firstName || ''} ${selectedLeadModal.lastName || ''}`.trim()
                  : selectedLeadModal.email}
              </h2>
              <p className="text-xs text-slate-500 mb-6">{selectedLeadModal.companyName || 'No Company'} {selectedLeadModal.designation ? `(${selectedLeadModal.designation})` : ''}</p>

              {/* Lead Sub-Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 mb-6 text-xs font-bold overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveLeadTab('overview')}
                  className={`pb-3 px-3 transition-colors border-b-2 ${activeLeadTab === 'overview' ? 'border-[#0d0d0e] text-[#0d0d0e]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveLeadTab('activities')}
                  className={`pb-3 px-3 transition-colors border-b-2 ${activeLeadTab === 'activities' ? 'border-[#0d0d0e] text-[#0d0d0e]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  Activities ({leadActivities.length})
                </button>
                <button
                  onClick={() => setActiveLeadTab('followups')}
                  className={`pb-3 px-3 transition-colors border-b-2 ${activeLeadTab === 'followups' ? 'border-[#0d0d0e] text-[#0d0d0e]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  Follow-ups ({leadFollowUps.length})
                </button>
                <button
                  onClick={() => setActiveLeadTab('notes')}
                  className={`pb-3 px-3 transition-colors border-b-2 ${activeLeadTab === 'notes' ? 'border-[#0d0d0e] text-[#0d0d0e]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveLeadTab('history')}
                  className={`pb-3 px-3 transition-colors border-b-2 ${activeLeadTab === 'history' ? 'border-[#0d0d0e] text-[#0d0d0e]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  Pipeline History
                </button>
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeLeadTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span><span className="font-bold text-[#0d0d0e]">{selectedLeadModal.email}</span></div>
                    <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span><span className="font-bold text-[#0d0d0e]">{selectedLeadModal.phone || '—'}</span></div>
                    <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Lead Source</span><span className="font-bold text-sky-700">{selectedLeadModal.source}</span></div>
                    <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Priority</span><span className={`font-bold ${PRIORITY_BADGES[selectedLeadModal.priority]?.color}`}>{selectedLeadModal.priority}</span></div>
                    <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Product Interest</span><span className="font-bold text-purple-700">{selectedLeadModal.interestedProductName || selectedLeadModal.interestedProduct || '—'}</span></div>
                    <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Value</span><span className="font-bold text-emerald-700">{selectedLeadModal.estimatedValue ? `₹${selectedLeadModal.estimatedValue.toLocaleString('en-IN')}` : '—'}</span></div>
                    <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Employee</span><span className="font-bold text-[#0d0d0e]">{selectedLeadModal.assignedToName ? `${selectedLeadModal.assignedToName} (${selectedLeadModal.assignedToEmail})` : 'Unassigned'}</span></div>
                    <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Created Date</span><span className="font-bold text-slate-600">{new Date(selectedLeadModal.createdAt).toLocaleString('en-IN')}</span></div>
                  </div>

                  {/* Campaign Attribution */}
                  <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-5 text-xs">
                    <h4 className="font-bold text-sky-900 mb-3 uppercase flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-sky-600" /> Campaign &amp; Attribution</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Campaign</span><span className="font-bold text-[#0d0d0e]">{selectedLeadModal.campaign || 'Direct'}</span></div>
                      <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Medium</span><span className="font-bold text-[#0d0d0e]">{selectedLeadModal.medium || 'organic'}</span></div>
                      <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Landing Page</span><span className="font-bold text-[#0d0d0e] truncate block">{selectedLeadModal.landingPage || '/'}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ACTIVITIES (LOGGER & TIMELINE) */}
              {activeLeadTab === 'activities' && (
                <div className="space-y-6">
                  {/* Log Activity Form */}
                  <form onSubmit={handleAddActivity} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="font-bold text-xs text-[#0d0d0e] uppercase">Log New Activity</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">Activity Type</label>
                        <select
                          value={activityType}
                          onChange={(e) => setActivityType(e.target.value as ActivityType)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                        >
                          <option value="CALL">PHONE CALL</option>
                          <option value="EMAIL">EMAIL</option>
                          <option value="WHATSAPP">WHATSAPP</option>
                          <option value="MEETING">MEETING</option>
                          <option value="DEMO">PRODUCT DEMO</option>
                          <option value="NOTE">NOTE</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500">Description</label>
                        <input
                          type="text"
                          required
                          placeholder="Summary of call/meeting details..."
                          value={activityDescription}
                          onChange={(e) => setActivityDescription(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="px-4 py-2 bg-[#0d0d0e] hover:bg-sky-600 text-white font-bold rounded-xl text-xs">
                        Log Activity
                      </button>
                    </div>
                  </form>

                  {/* Activity Timeline */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs text-slate-600 uppercase">Activity History</h4>
                    {leadActivities.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 font-bold">No activities logged yet.</div>
                    ) : (
                      leadActivities.map((act) => (
                        <div key={act.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200 text-[10px]">{act.type}</span>
                              <span className="text-[10px] text-slate-400">{new Date(act.createdAt).toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-slate-700 font-medium">{act.description}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 font-bold">{act.performedByName}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: FOLLOW-UPS */}
              {activeLeadTab === 'followups' && (
                <div className="space-y-6">
                  {/* Schedule Follow-up Form */}
                  <form onSubmit={handleAddFollowUp} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="font-bold text-xs text-[#0d0d0e] uppercase">Schedule Follow-Up</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">Title / Subject *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Call for EMR Quote review"
                          value={followUpTitle}
                          onChange={(e) => setFollowUpTitle(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">Scheduled Date &amp; Time *</label>
                        <input
                          type="datetime-local"
                          required
                          value={followUpDate}
                          onChange={(e) => setFollowUpDate(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">Notes</label>
                      <input
                        type="text"
                        placeholder="Additional follow-up details..."
                        value={followUpNotes}
                        onChange={(e) => setFollowUpNotes(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="px-4 py-2 bg-[#0d0d0e] hover:bg-sky-600 text-white font-bold rounded-xl text-xs">
                        Schedule Follow-Up
                      </button>
                    </div>
                  </form>

                  {/* Scheduled Follow-ups List */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs text-slate-600 uppercase">Scheduled Follow-Ups</h4>
                    {leadFollowUps.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 font-bold">No follow-ups scheduled yet.</div>
                    ) : (
                      leadFollowUps.map((fol) => (
                        <div key={fol.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[10px]">{fol.status}</span>
                              <span className="text-[10px] text-slate-500 font-bold">{new Date(fol.scheduledAt).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="font-bold text-[#0d0d0e]">{fol.title}</div>
                            {fol.notes && <p className="text-slate-500 text-[11px] mt-0.5">{fol.notes}</p>}
                          </div>
                          {fol.status === 'PENDING' && (
                            <button
                              onClick={() => handleUpdateFollowUpStatus(fol.id, 'COMPLETED')}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-700"
                            >
                              Mark Done ✓
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: NOTES */}
              {activeLeadTab === 'notes' && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap">
                  {selectedLeadModal.notes || 'No lead notes recorded.'}
                </div>
              )}

              {/* TAB 5: PIPELINE HISTORY */}
              {activeLeadTab === 'history' && (
                <div className="space-y-3 text-xs">
                  {leadHistory.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 font-bold">No audit trail events recorded.</div>
                  ) : (
                    leadHistory.map((hist) => (
                      <div key={hist.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-sky-700 block text-[10px]">{hist.action}</span>
                          <span className="text-slate-700">{hist.description}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold shrink-0">{new Date(hist.createdAt).toLocaleString('en-IN')}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 mt-6 font-mono text-xs">
                <button
                  onClick={() => openEditModal(selectedLeadModal)}
                  className="px-5 py-2.5 rounded-2xl bg-[#0d0d0e] hover:bg-sky-600 text-white font-bold transition-colors cursor-pointer"
                >
                  Edit Lead Details
                </button>
              </div>

            </div>
          </div>
        )}

        {/* CREATE / EDIT MODAL */}
        {(isCreateModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
            <div className="bg-white border-2 border-slate-300 rounded-[32px] max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <button
                onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-xl font-black text-[#0d0d0e] mb-6">
                {isCreateModalOpen ? 'Create New CRM Lead' : `Edit Lead #${selectedLeadModal?.id}`}
              </h2>

              <form onSubmit={isCreateModalOpen ? handleSaveCreate : handleSaveEdit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">First Name</label>
                    <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Last Name</label>
                    <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Work Email *</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                    <input type="text" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Designation</label>
                    <input type="text" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lead Source</label>
                    <select value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })} className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none">
                      <option value="MANUAL">MANUAL</option>
                      <option value="WEBSITE">WEBSITE</option>
                      <option value="CONTACT_FORM">CONTACT_FORM</option>
                      <option value="QUOTE_REQUEST">QUOTE_REQUEST</option>
                      <option value="DEMO_REQUEST">DEMO_REQUEST</option>
                      <option value="WEBSITE_PRODUCT">WEBSITE_PRODUCT</option>
                      <option value="FACEBOOK">FACEBOOK</option>
                      <option value="GOOGLE_ADS">GOOGLE_ADS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })} className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none">
                      {Object.keys(STATUS_BADGES).map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Priority</label>
                    <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as LeadPriority })} className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none">
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="URGENT">URGENT</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Interested Product</label>
                    <input type="text" value={formData.interestedProduct} onChange={(e) => setFormData({ ...formData, interestedProduct: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Estimated Value (₹)</label>
                    <input type="number" value={formData.estimatedValue} onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold focus:outline-none" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <button type="button" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} className="px-4 py-2.5 rounded-2xl border border-slate-300 font-bold text-slate-600">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-2xl bg-[#0d0d0e] hover:bg-sky-600 text-white font-bold transition-colors cursor-pointer">Save Lead</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

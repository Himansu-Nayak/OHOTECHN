'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Users, Search, Filter, Calendar, ChevronLeft, ChevronRight, Lock,
  Plus, Edit3, Trash2, UserCheck, Eye, RefreshCw, X, Tag, DollarSign,
  Building, Phone, Mail, Clock, CheckCircle2, AlertCircle, ArrowRight,
  Kanban, List, CheckSquare, MessageSquare, PhoneCall, Send, Video, AlertTriangle,
  User, CreditCard, ShoppingBag, ShieldCheck, Download, Activity, Link2, ExternalLink,
  BarChart3, PieChart, TrendingUp, Globe, Target
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  LeadDto, LeadStatus, LeadSource, LeadPriority, UserDto,
  LeadActivityDto, LeadFollowUpDto, PipelineStageDto, FollowUpDashboardDto,
  ActivityType, FollowUpStatus, Customer360Dto, CustomerMatchResultDto, CrmMarketingAnalyticsDto
} from '@/api/types';
import {
  getAdminLeadsApi, createAdminLeadApi, updateAdminLeadApi,
  updateAdminLeadStatusApi, assignAdminLeadApi, deleteAdminLeadApi,
  getPipelineBoardApi, getLeadActivitiesApi, createLeadActivityApi,
  getLeadFollowUpsApi, createLeadFollowUpApi, updateFollowUpApi,
  getFollowUpDashboardApi, getAdminCustomersApi, getCustomer360Api,
  getCustomerMatchApi, linkCustomerApi, convertLeadApi, getMarketingAnalyticsApi
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

const SOURCE_BADGES: Record<string, { label: string; color: string }> = {
  FACEBOOK: { label: 'Facebook Ads', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  INSTAGRAM: { label: 'Instagram Ads', color: 'bg-pink-100 text-pink-900 border-pink-300' },
  LINKEDIN: { label: 'LinkedIn Lead', color: 'bg-sky-100 text-sky-900 border-sky-300' },
  GOOGLE_ADS: { label: 'Google Ads', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  WEBSITE: { label: 'Website', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  CONTACT_FORM: { label: 'Contact Form', color: 'bg-slate-100 text-slate-800 border-slate-300' },
  QUOTE_REQUEST: { label: 'Quote Request', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  DEMO_REQUEST: { label: 'Demo Request', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  WEBSITE_PRODUCT: { label: 'Product Enquiry', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  WHATSAPP: { label: 'WhatsApp', color: 'bg-green-100 text-green-900 border-green-300' },
  REFERRAL: { label: 'Referral', color: 'bg-violet-100 text-violet-900 border-violet-300' },
  PARTNER: { label: 'Partner', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  MANUAL: { label: 'Manual Entry', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  OTHER: { label: 'Other', color: 'bg-gray-100 text-gray-800 border-gray-300' },
};

export default function AdminCrmLeadsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [viewMode, setViewMode] = React.useState<'table' | 'pipeline' | 'followups' | 'customers' | 'analytics'>('table');

  const [leads, setLeads] = React.useState<LeadDto[]>([]);
  const [pipelineStages, setPipelineStages] = React.useState<PipelineStageDto[]>([]);
  const [followUpDashboard, setFollowUpDashboard] = React.useState<FollowUpDashboardDto | null>(null);
  const [customers, setCustomers] = React.useState<UserDto[]>([]);
  const [marketingAnalytics, setMarketingAnalytics] = React.useState<CrmMarketingAnalyticsDto | null>(null);
  const [usersList, setUsersList] = React.useState<UserDto[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  // Pagination for Leads / Customers
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

  // Customer 360 State
  const [selectedCustomer360, setSelectedCustomer360] = React.useState<Customer360Dto | null>(null);
  const [activeCustomerTab, setActiveCustomerTab] = React.useState<'overview' | 'crm' | 'orders' | 'payments' | 'subscriptions' | 'licenses' | 'timeline'>('overview');

  // Lead Details Modal & Conversion State
  const [selectedLeadModal, setSelectedLeadModal] = React.useState<LeadDto | null>(null);
  const [activeLeadTab, setActiveLeadTab] = React.useState<'overview' | 'activities' | 'followups' | 'notes' | 'history'>('overview');
  const [leadActivities, setLeadActivities] = React.useState<LeadActivityDto[]>([]);
  const [leadFollowUps, setLeadFollowUps] = React.useState<LeadFollowUpDto[]>([]);
  const [leadHistory, setLeadHistory] = React.useState<any[]>([]);

  // Customer Match / Conversion Dialog State
  const [customerMatchResult, setCustomerMatchResult] = React.useState<CustomerMatchResultDto | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = React.useState<boolean>(false);

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

  const fetchCustomers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminCustomersApi(search, page, 15);
      if (res.success && res.data) {
        setCustomers(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (e) {
      console.warn('Failed to load customer list', e);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

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

  const fetchMarketingAnalytics = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMarketingAnalyticsApi();
      if (res.success && res.data) {
        setMarketingAnalytics(res.data);
      }
    } catch (e) {
      console.warn('Failed to load marketing analytics', e);
    } finally {
      setLoading(false);
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
    if (viewMode === 'customers') fetchCustomers();
    if (viewMode === 'analytics') fetchMarketingAnalytics();
    fetchUsers();
  }, [viewMode, fetchLeads, fetchPipeline, fetchFollowUpDashboard, fetchCustomers, fetchMarketingAnalytics, fetchUsers]);

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

  // Customer 360 Fetcher
  const openCustomer360 = async (userId: number) => {
    try {
      const res = await getCustomer360Api(userId);
      if (res.success && res.data) {
        setSelectedCustomer360(res.data);
        setActiveCustomerTab('overview');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to load Customer 360 profile', 'error');
    }
  };

  // Lead Conversion & Customer Match Actions
  const handleCheckCustomerMatch = async (lead: LeadDto) => {
    try {
      const res = await getCustomerMatchApi(lead.id);
      if (res.success && res.data) {
        setCustomerMatchResult(res.data);
        setIsMatchModalOpen(true);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to evaluate customer match', 'error');
    }
  };

  const handleLinkCustomer = async (leadId: number, userId: number) => {
    try {
      const res = await linkCustomerApi(leadId, userId);
      if (res.success && res.data) {
        showToast('Lead successfully linked to existing Customer account!', 'success');
        setIsMatchModalOpen(false);
        if (selectedLeadModal?.id === leadId) setSelectedLeadModal(res.data);
        fetchLeads();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to link customer', 'error');
    }
  };

  const handleConvertLead = async (leadId: number) => {
    try {
      const res = await convertLeadApi(leadId);
      if (res.success && res.data) {
        showToast('Lead successfully converted to Customer account!', 'success');
        setIsMatchModalOpen(false);
        if (selectedLeadModal?.id === leadId) setSelectedLeadModal(res.data);
        fetchLeads();
        if (viewMode === 'pipeline') fetchPipeline();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to convert lead', 'error');
    }
  };

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
              CRM Sales Governance &amp; Customer 360°
            </h1>
            <p className="text-xs font-mono font-medium text-slate-600 mt-1">
              Pipeline management, activities logger, follow-ups, and unified Customer 360° commerce view.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono">
            
            {/* 4 View Switcher Tabs */}
            <div className="bg-white border-2 border-slate-300 p-1.5 rounded-2xl flex items-center gap-1 text-xs">
              <button
                onClick={() => { setViewMode('table'); setPage(0); }}
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
                <CheckSquare className="w-3.5 h-3.5 text-amber-500" /> Follow-Ups
              </button>
              <button
                onClick={() => { setViewMode('customers'); setPage(0); }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'customers' ? 'bg-[#0d0d0e] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Customers 360°
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'analytics' ? 'bg-[#0d0d0e] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-purple-500" /> Marketing Analytics
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

        {/* VIEW 1: LEADS TABLE VIEW */}
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
                    <option value="FACEBOOK">FACEBOOK</option>
                    <option value="INSTAGRAM">INSTAGRAM</option>
                    <option value="LINKEDIN">LINKEDIN</option>
                    <option value="GOOGLE_ADS">GOOGLE_ADS</option>
                    <option value="WHATSAPP">WHATSAPP</option>
                    <option value="REFERRAL">REFERRAL</option>
                    <option value="PARTNER">PARTNER</option>
                    <option value="CONTACT_FORM">CONTACT_FORM</option>
                    <option value="QUOTE_REQUEST">QUOTE_REQUEST</option>
                    <option value="DEMO_REQUEST">DEMO_REQUEST</option>
                    <option value="WEBSITE_PRODUCT">WEBSITE_PRODUCT</option>
                    <option value="MANUAL">MANUAL</option>
                    <option value="OTHER">OTHER</option>
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
                      <th className="py-3.5 px-4">Customer Status</th>
                      <th className="py-3.5 px-4">Assigned To</th>
                      <th className="py-3.5 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={8} className="py-12 text-center text-slate-400">Loading CRM leads...</td></tr>
                    ) : leads.length === 0 ? (
                      <tr><td colSpan={8} className="py-12 text-center text-slate-500">No CRM lead records found.</td></tr>
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
                            {lead.isConverted ? (
                              <button
                                onClick={() => lead.convertedUserId && openCustomer360(lead.convertedUserId)}
                                className="px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-full font-bold text-[10px] flex items-center gap-1 hover:bg-emerald-100"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Linked Customer
                              </button>
                            ) : (
                              <button
                                onClick={() => handleCheckCustomerMatch(lead)}
                                className="px-2 py-0.5 bg-sky-50 border border-sky-300 text-sky-800 rounded-full font-bold text-[10px] flex items-center gap-1 hover:bg-sky-100"
                              >
                                <Link2 className="w-3 h-3" /> Match / Convert
                              </button>
                            )}
                          </td>
                          <td className="py-3.5 px-4">{lead.assignedToName || <span className="text-slate-400 italic">Unassigned</span>}</td>
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
          </div>
        )}

        {/* VIEW 4: CUSTOMERS 360° LIST */}
        {viewMode === 'customers' && (
          <div className="space-y-6 font-mono text-xs">
            {/* Search Bar */}
            <div className="bg-white border-2 border-slate-300 rounded-[28px] p-5 shadow-sm">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search customer name, email, phone, company..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium focus:outline-none focus:border-sky-600"
                />
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white border-2 border-slate-300 rounded-[28px] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-bold text-[11px]">
                      <th className="py-3.5 px-4">Customer Name</th>
                      <th className="py-3.5 px-4">Contact Info</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Account Status</th>
                      <th className="py-3.5 px-4">Registered Date</th>
                      <th className="py-3.5 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={6} className="py-12 text-center text-slate-400">Loading Customer profiles...</td></tr>
                    ) : customers.length === 0 ? (
                      <tr><td colSpan={6} className="py-12 text-center text-slate-500">No customer profiles found.</td></tr>
                    ) : (
                      customers.map((cust) => (
                        <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#0d0d0e]">{cust.name}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-800">{cust.email}</div>
                            <div className="text-[10px] text-slate-500">{cust.phone || '—'}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800">
                              {cust.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {cust.enabled ? (
                              <span className="text-[10px] font-bold text-emerald-600">Active</span>
                            ) : (
                              <span className="text-[10px] font-bold text-rose-600">Disabled</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">{cust.createdAt ? new Date(cust.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => openCustomer360(cust.id)}
                              className="px-3 py-1.5 bg-[#0d0d0e] hover:bg-sky-600 text-white rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5"
                            >
                              <UserCheck className="w-3.5 h-3.5" /> Open 360° Profile
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: MARKETING ANALYTICS */}
        {viewMode === 'analytics' && (
          <div className="space-y-6 font-mono text-xs">
            {!marketingAnalytics ? (
              <div className="bg-white border-2 border-slate-300 rounded-[28px] p-12 text-center text-slate-400">
                Loading Real Marketing Analytics...
              </div>
            ) : (
              <>
                {/* Summary Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                    <span className="text-slate-400 font-bold block mb-1 uppercase text-[10px]">Total CRM Leads</span>
                    <div className="text-3xl font-black text-[#0d0d0e]">{marketingAnalytics.totalLeads}</div>
                  </div>
                  <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                    <span className="text-blue-600 font-bold block mb-1 uppercase text-[10px]">Facebook / Instagram</span>
                    <div className="text-3xl font-black text-blue-700">
                      {(marketingAnalytics.leadsBySource['FACEBOOK'] || 0) + (marketingAnalytics.leadsBySource['INSTAGRAM'] || 0)}
                    </div>
                  </div>
                  <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                    <span className="text-emerald-600 font-bold block mb-1 uppercase text-[10px]">Google Ads / Search</span>
                    <div className="text-3xl font-black text-emerald-700">
                      {marketingAnalytics.leadsBySource['GOOGLE_ADS'] || 0}
                    </div>
                  </div>
                  <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                    <span className="text-sky-600 font-bold block mb-1 uppercase text-[10px]">LinkedIn Lead Gen</span>
                    <div className="text-3xl font-black text-sky-700">
                      {marketingAnalytics.leadsBySource['LINKEDIN'] || 0}
                    </div>
                  </div>
                </div>

                {/* Leads & Revenue Breakdown by Source Table */}
                <div className="bg-white border-2 border-slate-300 rounded-[28px] p-6 shadow-sm">
                  <h3 className="text-sm font-black text-[#0d0d0e] mb-4 uppercase flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" /> Real Lead Source Performance &amp; Revenue Attribution
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px]">
                          <th className="py-3 px-4">Lead Source</th>
                          <th className="py-3 px-4">Total Ingested Leads</th>
                          <th className="py-3 px-4">Conversion Rate (%)</th>
                          <th className="py-3 px-4">Attributed E-Commerce Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {Object.entries(marketingAnalytics.leadsBySource).map(([src, count]) => {
                          const rate = marketingAnalytics.conversionRateBySource[src] || 0;
                          const rev = marketingAnalytics.revenueBySource[src] || 0;
                          return (
                            <tr key={src} className="hover:bg-slate-50">
                              <td className="py-3 px-4 font-bold">
                                <span className={`px-2 py-0.5 rounded-full border text-[10px] ${SOURCE_BADGES[src]?.color || 'bg-slate-100 text-slate-700 border-slate-300'}`}>
                                  {SOURCE_BADGES[src]?.label || src}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-bold text-[#0d0d0e]">{count}</td>
                              <td className="py-3 px-4 font-bold text-sky-700">{rate}%</td>
                              <td className="py-3 px-4 font-bold text-emerald-700">₹{rev.toLocaleString('en-IN')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* CUSTOMER 360° VIEW MODAL */}
        {selectedCustomer360 && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
            <div className="bg-white border-2 border-slate-300 rounded-[32px] max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <button
                onClick={() => setSelectedCustomer360(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold mb-2">
                <span>CUSTOMER 360° PROFILE #{selectedCustomer360.profile.id}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 uppercase">
                  {selectedCustomer360.profile.role}
                </span>
              </div>

              <h2 className="text-2xl font-black text-[#0d0d0e] mb-1">{selectedCustomer360.profile.name}</h2>
              <p className="text-xs text-slate-500 mb-6">{selectedCustomer360.companyName || 'Individual Account'} ({selectedCustomer360.profile.email})</p>

              {/* Customer 360 Sub-Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 mb-6 text-xs font-bold overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveCustomerTab('overview')} className={`pb-3 px-3 transition-colors border-b-2 ${activeCustomerTab === 'overview' ? 'border-[#0d0d0e] text-[#0d0d0e]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Overview</button>
                <button onClick={() => setActiveCustomerTab('crm')} className={`pb-3 px-3 transition-colors border-b-2 ${activeCustomerTab === 'crm' ? 'border-[#0d0d0e] text-[#0d0d0e]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>CRM Leads ({selectedCustomer360.totalLeadsCount})</button>
                <button onClick={() => setActiveCustomerTab('orders')} className={`pb-3 px-3 transition-colors border-b-2 ${activeCustomerTab === 'orders' ? 'border-[#0d0d0e] text-[#0d0d0e]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Orders ({selectedCustomer360.totalOrdersCount})</button>
                <button onClick={() => setActiveCustomerTab('payments')} className={`pb-3 px-3 transition-colors border-b-2 ${activeCustomerTab === 'payments' ? 'border-[#0d0d0e] text-[#0d0d0e]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Payments ({selectedCustomer360.payments.length})</button>
                <button onClick={() => setActiveCustomerTab('subscriptions')} className={`pb-3 px-3 transition-colors border-b-2 ${activeCustomerTab === 'subscriptions' ? 'border-[#0d0d0e] text-[#0d0d0e]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Subscriptions ({selectedCustomer360.subscriptions.length})</button>
                <button onClick={() => setActiveCustomerTab('licenses')} className={`pb-3 px-3 transition-colors border-b-2 ${activeCustomerTab === 'licenses' ? 'border-[#0d0d0e] text-[#0d0d0e]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Licenses ({selectedCustomer360.licenses.length})</button>
                <button onClick={() => setActiveCustomerTab('timeline')} className={`pb-3 px-3 transition-colors border-b-2 ${activeCustomerTab === 'timeline' ? 'border-[#0d0d0e] text-[#0d0d0e]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Business Timeline</button>
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeCustomerTab === 'overview' && (
                <div className="space-y-6 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                      <span className="text-slate-400 block font-bold text-[10px] uppercase">Total Spent</span>
                      <div className="text-2xl font-black text-emerald-700">₹{selectedCustomer360.totalSpent.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                      <span className="text-slate-400 block font-bold text-[10px] uppercase">Completed Orders</span>
                      <div className="text-2xl font-black text-sky-700">{selectedCustomer360.totalOrdersCount}</div>
                    </div>
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                      <span className="text-slate-400 block font-bold text-[10px] uppercase">Active Licenses</span>
                      <div className="text-2xl font-black text-purple-700">{selectedCustomer360.licenses.length}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Customer Email</span><span className="font-bold text-[#0d0d0e]">{selectedCustomer360.profile.email}</span></div>
                    <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span><span className="font-bold text-[#0d0d0e]">{selectedCustomer360.profile.phone || '—'}</span></div>
                    <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Account Role</span><span className="font-bold text-emerald-700">{selectedCustomer360.profile.role}</span></div>
                    <div><span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Date</span><span className="font-bold text-slate-600">{selectedCustomer360.profile.createdAt ? new Date(selectedCustomer360.profile.createdAt).toLocaleString('en-IN') : '—'}</span></div>
                  </div>
                </div>
              )}

              {/* TAB 2: CRM LEADS */}
              {activeCustomerTab === 'crm' && (
                <div className="space-y-4 text-xs">
                  {selectedCustomer360.leads.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 font-bold">No CRM leads linked to this customer account.</div>
                  ) : (
                    selectedCustomer360.leads.map((ld) => (
                      <div key={ld.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-700">Lead #{ld.id} • {ld.source}</span>
                          <span className={`px-2 py-0.5 rounded-full border text-[10px] ${STATUS_BADGES[ld.status]?.color}`}>{ld.status}</span>
                        </div>
                        <p className="font-medium text-slate-700">Product Interest: {ld.interestedProductName || ld.interestedProduct || 'General'}</p>
                        {ld.notes && <p className="text-[11px] text-slate-500 italic">{ld.notes}</p>}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: ORDERS */}
              {activeCustomerTab === 'orders' && (
                <div className="space-y-3 text-xs">
                  {selectedCustomer360.orders.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 font-bold">No order history available.</div>
                  ) : (
                    selectedCustomer360.orders.map((ord) => (
                      <div key={ord.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#0d0d0e]">Order #{ord.id} • ₹{ord.totalAmount.toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-slate-500">{new Date(ord.createdAt).toLocaleString('en-IN')} • {ord.items?.length || 0} items</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-[10px]">
                          {ord.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: PAYMENTS */}
              {activeCustomerTab === 'payments' && (
                <div className="space-y-3 text-xs">
                  {selectedCustomer360.payments.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 font-bold">No payment transactions recorded.</div>
                  ) : (
                    selectedCustomer360.payments.map((pay) => (
                      <div key={pay.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#0d0d0e]">Payment #{pay.id} • ₹{pay.amount.toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-slate-500">{pay.razorpayOrderId ? `Razorpay Order: ${pay.razorpayOrderId}` : 'Direct Transaction'}</div>
                          {pay.razorpayPaymentId && <div className="text-[10px] text-sky-600 font-mono">Razorpay ID: {pay.razorpayPaymentId}</div>}
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-[10px]">{pay.status}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 5: SUBSCRIPTIONS */}
              {activeCustomerTab === 'subscriptions' && (
                <div className="space-y-3 text-xs">
                  {selectedCustomer360.subscriptions.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 font-bold">No product subscriptions found.</div>
                  ) : (
                    selectedCustomer360.subscriptions.map((sub) => (
                      <div key={sub.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#0d0d0e]">{sub.product?.name} ({sub.productPlan?.name || 'Plan'})</div>
                          <div className="text-[10px] text-slate-500">Expires: {sub.expiryDate ? new Date(sub.expiryDate).toLocaleDateString('en-IN') : 'Lifetime'}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-300 text-sky-800 font-bold text-[10px]">{sub.status}</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 6: LICENSES */}
              {activeCustomerTab === 'licenses' && (
                <div className="space-y-3 text-xs">
                  {selectedCustomer360.licenses.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 font-bold">No active software license keys.</div>
                  ) : (
                    selectedCustomer360.licenses.map((lic) => (
                      <div key={lic.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#0d0d0e]">{lic.product?.name}</span>
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-full font-bold text-[10px]">{lic.status}</span>
                        </div>
                        <div className="font-mono font-bold text-sky-700 bg-slate-50 p-2 rounded-xl border border-slate-200 select-all">{lic.licenseKey}</div>
                        <div className="text-[10px] text-slate-500">Activations: {lic.activationCount} / {lic.activationLimit} devices</div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 7: UNIFIED TIMELINE */}
              {activeCustomerTab === 'timeline' && (
                <div className="space-y-3 text-xs">
                  {selectedCustomer360.timeline.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 font-bold">No timeline events recorded.</div>
                  ) : (
                    selectedCustomer360.timeline.map((tm, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-[#0d0d0e]">{tm.title}</h4>
                            <span className="text-[10px] text-slate-400">{new Date(tm.timestamp).toLocaleString('en-IN')}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">{tm.description}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          </div>
        )}

        {/* CUSTOMER MATCH / CONVERSION DIALOG MODAL */}
        {isMatchModalOpen && customerMatchResult && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
            <div className="bg-white border-2 border-slate-300 rounded-[32px] max-w-lg w-full p-8 shadow-2xl relative">
              <button
                onClick={() => setIsMatchModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-xl font-black text-[#0d0d0e] mb-2">Customer Match &amp; Conversion</h3>
              <p className="text-xs text-slate-500 mb-6">Evaluating lead #{customerMatchResult.leadId} ({customerMatchResult.lead.email})</p>

              {customerMatchResult.hasExactMatch && customerMatchResult.matchedUser ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 mb-6 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Exact Customer Match Found! ({customerMatchResult.matchReason})
                  </div>
                  <p className="text-slate-700">Matched User: <strong>{customerMatchResult.matchedUser.name}</strong> ({customerMatchResult.matchedUser.email})</p>
                  <p className="text-[11px] text-slate-500">Linking this lead to the existing customer account will preserve account history without creating duplicate users.</p>
                  <button
                    onClick={() => handleLinkCustomer(customerMatchResult.leadId, customerMatchResult.matchedUser!.id)}
                    className="w-full mt-3 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Link Existing Customer Account ✓
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-300 rounded-2xl p-5 mb-6 space-y-2 text-xs">
                  <div className="font-bold text-[#0d0d0e]">No Existing Customer Match Found</div>
                  <p className="text-slate-600 text-[11px]">Converting this lead will safely initialize a new customer account with role <strong>ROLE_CUSTOMER</strong>.</p>
                  <button
                    onClick={() => handleConvertLead(customerMatchResult.leadId)}
                    className="w-full mt-3 py-2.5 bg-[#0d0d0e] hover:bg-sky-600 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Convert &amp; Create Customer Account →
                  </button>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setIsMatchModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

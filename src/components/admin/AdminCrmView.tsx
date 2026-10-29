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
import { cn } from '@/lib/utils';
import { AdminCard, AdminBadge, AdminButton, AdminInput, AdminSelect, AdminEmptyState, AdminTableSkeleton } from './AdminUiPrimitives';

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

export interface AdminCrmViewProps {
  initialViewMode?: 'table' | 'pipeline' | 'followups' | 'customers' | 'analytics';
  isStandalonePage?: boolean;
}

export function AdminCrmView({
  initialViewMode = 'pipeline',
  isStandalonePage = false,
}: AdminCrmViewProps) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [viewMode, setViewMode] = React.useState<'table' | 'pipeline' | 'followups' | 'customers' | 'analytics'>(initialViewMode);

  React.useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);

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
        status: statusFilter !== 'ALL' ? (statusFilter as LeadStatus) : undefined,
        source: sourceFilter !== 'ALL' ? (sourceFilter as LeadSource) : undefined,
        priority: priorityFilter !== 'ALL' ? (priorityFilter as LeadPriority) : undefined,
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
    fetchUsers();
  }, [fetchUsers]);

  React.useEffect(() => {
    if (viewMode === 'table') {
      fetchLeads();
    } else if (viewMode === 'pipeline') {
      fetchPipeline();
    } else if (viewMode === 'followups') {
      fetchFollowUpDashboard();
    } else if (viewMode === 'customers') {
      fetchCustomers();
    } else if (viewMode === 'analytics') {
      fetchMarketingAnalytics();
    }
  }, [viewMode, fetchLeads, fetchPipeline, fetchFollowUpDashboard, fetchCustomers, fetchMarketingAnalytics]);

  const handleOpenLeadModal = async (lead: LeadDto) => {
    setSelectedLeadModal(lead);
    setActiveLeadTab('overview');
    try {
      const [actRes, folRes] = await Promise.all([
        getLeadActivitiesApi(lead.id),
        getLeadFollowUpsApi(lead.id)
      ]);
      if (actRes.success && actRes.data) setLeadActivities(actRes.data);
      if (folRes.success && folRes.data) setLeadFollowUps(folRes.data);

      try {
        const auditRes = await getAdminAuditLogsApi(0, 20);
        if (auditRes.success && auditRes.data) {
          const filtered = auditRes.data.content.filter((a) => a.description && a.description.includes(`Lead #${lead.id}`));
          setLeadHistory(filtered);
        }
      } catch {
        // Non-blocking
      }
    } catch (e) {
      console.warn('Error loading lead activities/followups', e);
    }
  };

  const handleOpenCustomer360 = async (userId: number) => {
    try {
      const res = await getCustomer360Api(userId);
      if (res.success && res.data) {
        setSelectedCustomer360(res.data);
        setActiveCustomerTab('overview');
      } else {
        showToast(res.message || 'Customer 360 profile not found', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to load Customer 360 profile', 'error');
    }
  };

  const handleOpenCustomerMatch = async (leadId: number) => {
    try {
      const res = await getCustomerMatchApi(leadId);
      if (res.success && res.data) {
        setCustomerMatchResult(res.data);
        setIsMatchModalOpen(true);
      } else {
        showToast(res.message || 'Failed to evaluate customer match', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error checking customer match', 'error');
    }
  };

  const handleLinkCustomer = async (leadId: number, userId: number) => {
    try {
      const res = await linkCustomerApi(leadId, userId);
      if (res.success) {
        showToast('Lead successfully linked to customer account!', 'success');
        setIsMatchModalOpen(false);
        fetchLeads();
        if (selectedLeadModal && selectedLeadModal.id === leadId) {
          setSelectedLeadModal(res.data || null);
        }
      } else {
        showToast(res.message || 'Failed to link customer', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error linking customer', 'error');
    }
  };

  const handleConvertLead = async (leadId: number) => {
    try {
      const res = await convertLeadApi(leadId);
      if (res.success) {
        showToast('Lead successfully converted to Customer Account!', 'success');
        setIsMatchModalOpen(false);
        fetchLeads();
        if (viewMode === 'pipeline') fetchPipeline();
        if (selectedLeadModal && selectedLeadModal.id === leadId) {
          setSelectedLeadModal(res.data || null);
        }
      } else {
        showToast(res.message || 'Failed to convert lead', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error converting lead', 'error');
    }
  };

  const handleUpdateStatus = async (leadId: number, newStatus: LeadStatus) => {
    try {
      const res = await updateAdminLeadStatusApi(leadId, newStatus);
      if (res.success) {
        showToast(`Lead status updated to ${newStatus}`, 'success');
        if (viewMode === 'table') {
          setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
        } else if (viewMode === 'pipeline') {
          fetchPipeline();
        }
        if (selectedLeadModal?.id === leadId) {
          setSelectedLeadModal((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        showToast(res.message || 'Failed to update status', 'error');
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
        priority: formData.priority,
        assignedToId: formData.assignedToId ? Number(formData.assignedToId) : undefined,
        estimatedValue: formData.estimatedValue ? Number(formData.estimatedValue) : undefined,
        notes: formData.notes || undefined,
        nextFollowUpAt: formData.nextFollowUpAt ? new Date(formData.nextFollowUpAt).toISOString() : undefined,
      });

      if (res.success) {
        showToast('CRM Lead registered successfully!', 'success');
        setIsCreateModalOpen(false);
        fetchLeads();
        if (viewMode === 'pipeline') fetchPipeline();
      } else {
        showToast(res.message || 'Failed to create lead', 'error');
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

  return (
    <div className={cn("space-y-6 animate-in fade-in duration-300", isStandalonePage && "p-4 sm:p-6")}>
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
              ENTERPRISE CRM
            </span>
            <span className="text-xs text-slate-400">PostgreSQL Verified</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sales Pipeline, Leads &amp; Customer 360°
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Real-time pipeline tracking, activity history, follow-up reminders, and customer lifetime conversion.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setViewMode('pipeline')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                viewMode === 'pipeline' ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Kanban className="w-3.5 h-3.5 text-indigo-600" />
              Pipeline
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                viewMode === 'table' ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              )}
            >
              <List className="w-3.5 h-3.5 text-blue-600" />
              Leads Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode('followups')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                viewMode === 'followups' ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Follow-ups
            </button>
            <button
              type="button"
              onClick={() => setViewMode('customers')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                viewMode === 'customers' ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              )}
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              Customer 360
            </button>
            <button
              type="button"
              onClick={() => setViewMode('analytics')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                viewMode === 'analytics' ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              )}
            >
              <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
              Analytics
            </button>
          </div>

          <AdminButton
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Lead
          </AdminButton>
        </div>
      </div>

      {/* VIEW MODE 1: SALES PIPELINE (KANBAN) */}
      {viewMode === 'pipeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Kanban className="w-4 h-4 text-indigo-600" /> Interactive Sales Pipeline Board
            </span>
            <AdminButton
              variant="outline"
              size="sm"
              onClick={fetchPipeline}
              leftIcon={<RefreshCw className="w-3 h-3" />}
            >
              Refresh Board
            </AdminButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {pipelineStages.map((stg) => (
              <div
                key={stg.status}
                className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col min-w-[260px] shadow-2xs"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-slate-900 tracking-tight">{stg.stageName}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                      {stg.count}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">₹{(stg.totalValue || 0).toLocaleString('en-IN')}</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {stg.leads.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs italic font-mono">No deals in stage</div>
                  ) : (
                    stg.leads.map((ld) => (
                      <div
                        key={ld.id}
                        onClick={() => handleOpenLeadModal(ld)}
                        className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-900 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                            {ld.firstName} {ld.lastName || ''}
                          </span>
                          <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-bold uppercase", PRIORITY_BADGES[ld.priority]?.color)}>
                            {ld.priority}
                          </span>
                        </div>

                        {ld.companyName && (
                          <p className="text-[11px] text-slate-600 flex items-center gap-1 truncate">
                            <Building className="w-3 h-3 text-slate-400 shrink-0" />
                            {ld.companyName}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                          <span className="font-bold text-emerald-700">₹{(ld.estimatedValue || 0).toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-400 font-mono">#{ld.id}</span>
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

      {/* VIEW MODE 2: LEADS TABLE */}
      {viewMode === 'table' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <AdminCard className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <AdminInput
                  placeholder="Search leads, names, companies, emails..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                  className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="DEMO_SCHEDULED">Demo Scheduled</option>
                  <option value="QUOTE_SENT">Quote Sent</option>
                  <option value="WON">Closed Won</option>
                  <option value="LOST">Lost</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => {
                    setPriorityFilter(e.target.value);
                    setPage(0);
                  }}
                  className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>

                <select
                  value={sourceFilter}
                  onChange={(e) => {
                    setSourceFilter(e.target.value);
                    setPage(0);
                  }}
                  className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                >
                  <option value="ALL">All Sources</option>
                  <option value="WEBSITE">Website</option>
                  <option value="GOOGLE_ADS">Google Ads</option>
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="FACEBOOK">Facebook</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="MANUAL">Manual</option>
                </select>

                <AdminButton
                  variant="outline"
                  size="sm"
                  onClick={fetchLeads}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Filter
                </AdminButton>
              </div>
            </div>
          </AdminCard>

          {/* Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/60 font-mono text-slate-500 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Lead ID &amp; Contact</th>
                    <th className="py-3 px-4 font-bold">Company / Product</th>
                    <th className="py-3 px-4 font-bold">Source</th>
                    <th className="py-3 px-4 font-bold">Priority</th>
                    <th className="py-3 px-4 font-bold">Deal Value</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-400" />
                        Loading CRM leads...
                      </td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No leads match current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    leads.map((ld) => (
                      <tr key={ld.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleOpenLeadModal(ld)}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left"
                          >
                            #{ld.id} — {ld.firstName} {ld.lastName || ''}
                          </button>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{ld.email}</p>
                          {ld.phone && <p className="text-[10px] text-slate-400 font-mono">{ld.phone}</p>}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-800">{ld.companyName || 'Individual'}</p>
                          <p className="text-[11px] text-slate-500 truncate max-w-[180px]">{ld.interestedProduct || 'General Enquiry'}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border", SOURCE_BADGES[ld.source]?.color || "bg-slate-100 text-slate-700")}>
                            {SOURCE_BADGES[ld.source]?.label || ld.source}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border", PRIORITY_BADGES[ld.priority]?.color)}>
                            {ld.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          ₹{(ld.estimatedValue || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={ld.status}
                            onChange={(e) => handleUpdateStatus(ld.id, e.target.value as LeadStatus)}
                            className="text-xs px-2 py-1 rounded-lg border border-slate-200 bg-white font-bold"
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="QUALIFIED">QUALIFIED</option>
                            <option value="DEMO_SCHEDULED">DEMO SCHEDULED</option>
                            <option value="QUOTE_SENT">QUOTE SENT</option>
                            <option value="WON">WON</option>
                            <option value="LOST">LOST</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <AdminButton
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenLeadModal(ld)}
                            >
                              Details
                            </AdminButton>
                            <AdminButton
                              variant="secondary"
                              size="sm"
                              onClick={() => handleOpenCustomerMatch(ld.id)}
                            >
                              Convert
                            </AdminButton>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Showing {leads.length} of {totalElements} leads</span>
              <div className="flex items-center gap-2">
                <AdminButton
                  variant="outline"
                  size="sm"
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Previous
                </AdminButton>
                <span>Page {page + 1} of {totalPages}</span>
                <AdminButton
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: FOLLOW-UPS DASHBOARD */}
      {viewMode === 'followups' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-rose-200 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-rose-600 font-bold">Overdue Reminders</span>
              <p className="text-2xl font-black text-rose-700 mt-1">{followUpDashboard?.overdueCount || 0}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Requires immediate representative action</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-amber-600 font-bold">Due Today</span>
              <p className="text-2xl font-black text-amber-700 mt-1">{followUpDashboard?.todayCount || 0}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Scheduled for today's sales cycle</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-slate-600 font-bold">Upcoming (Next 7 Days)</span>
              <p className="text-2xl font-black text-slate-800 mt-1">{followUpDashboard?.upcomingCount || 0}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Future planned meetings and demos</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Pending Follow-up Schedule</h3>
            <div className="space-y-3">
              {(() => {
                const allRecent: LeadFollowUpDto[] = [
                  ...(followUpDashboard?.overdueFollowUps || []),
                  ...(followUpDashboard?.todayFollowUps || []),
                  ...(followUpDashboard?.upcomingFollowUps || [])
                ];
                return allRecent.length > 0 ? (
                  allRecent.map((fu) => (
                    <div
                      key={fu.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{fu.title}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">Lead #{fu.leadId} — {fu.leadName || 'Contact'}</p>
                        {fu.notes && <p className="text-slate-400 text-[10px] italic mt-0.5">"{fu.notes}"</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] font-mono font-bold text-slate-600 block">
                            {new Date(fu.scheduledAt).toLocaleDateString()}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">
                            {new Date(fu.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <AdminButton
                            variant="secondary"
                            size="sm"
                            onClick={() => handleUpdateFollowUpStatus(fu.id, 'COMPLETED')}
                          >
                            Complete ✓
                          </AdminButton>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs font-mono">
                    No active follow-ups scheduled.
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 4: CUSTOMER 360 DIRECTORY */}
      {viewMode === 'customers' && (
        <div className="space-y-4">
          <AdminCard className="p-4">
            <AdminInput
              placeholder="Search customers by name, email, phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </AdminCard>

          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/60 font-mono text-slate-500 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-bold">Customer ID &amp; Name</th>
                  <th className="py-3 px-4 font-bold">Email Address</th>
                  <th className="py-3 px-4 font-bold">Account Role</th>
                  <th className="py-3 px-4 font-bold">Joined Date</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      #{c.id} — {c.name || 'User'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{c.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                        {c.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <AdminButton
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenCustomer360(c.id)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Customer 360°
                      </AdminButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 5: MARKETING ANALYTICS */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Total Inbound Leads</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{marketingAnalytics?.totalLeads || 0}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Across all marketing attribution channels</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Converted Customers</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{marketingAnalytics?.leadsByStatus?.['WON'] || 0}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Active paying customer conversions (WON)</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Conversion Rate</span>
              <p className="text-2xl font-black text-sky-600 mt-1">
                {marketingAnalytics?.totalLeads ? (((marketingAnalytics?.leadsByStatus?.['WON'] || 0) / marketingAnalytics.totalLeads) * 100).toFixed(1) : '0.0'}%
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Inbound-to-paid closing ratio</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Total Deal Revenue</span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                ₹{(marketingAnalytics?.revenueBySource ? Object.values(marketingAnalytics.revenueBySource).reduce((a, b) => a + b, 0) : 0).toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Cumulative pipeline valuation</p>
            </div>
          </div>

          {/* Breakdown Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-600" /> Channel Source Attribution
              </h3>
              <div className="space-y-3">
                {marketingAnalytics?.leadsBySource && Object.entries(marketingAnalytics.leadsBySource).map(([src, count]) => (
                  <div key={src} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                    <span className="font-semibold text-slate-700">{src}</span>
                    <span className="font-mono font-bold text-slate-900">{Number(count)} leads</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" /> Stage Velocity Breakdown
              </h3>
              <div className="space-y-3">
                {marketingAnalytics?.leadsByStatus && Object.entries(marketingAnalytics.leadsByStatus).map(([stg, count]) => (
                  <div key={stg} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                    <span className="font-semibold text-slate-700">{stg}</span>
                    <span className="font-mono font-bold text-slate-900">{Number(count)} deals</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LEAD DETAILS & ACTIVITY DRAWER / MODAL */}
      {selectedLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedLeadModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                LEAD #{selectedLeadModal.id}
              </span>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded", STATUS_BADGES[selectedLeadModal.status]?.color)}>
                {selectedLeadModal.status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              {selectedLeadModal.firstName} {selectedLeadModal.lastName || ''}
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedLeadModal.email} • {selectedLeadModal.phone || 'No phone'}</p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 my-4 pt-3 border-t border-slate-100">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => openEditModal(selectedLeadModal)}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit Lead
              </AdminButton>
              <AdminButton
                variant="secondary"
                size="sm"
                onClick={() => handleOpenCustomerMatch(selectedLeadModal.id)}
                leftIcon={<UserCheck className="w-3.5 h-3.5" />}
              >
                Match / Convert Customer
              </AdminButton>
              <AdminButton
                variant="danger"
                size="sm"
                onClick={() => handleDeleteLead(selectedLeadModal.id)}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete
              </AdminButton>
            </div>

            {/* Sub-Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 mb-4">
              <button
                type="button"
                onClick={() => setActiveLeadTab('overview')}
                className={cn(
                  "py-2 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer",
                  activeLeadTab === 'overview' ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500"
                )}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveLeadTab('activities')}
                className={cn(
                  "py-2 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer",
                  activeLeadTab === 'activities' ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500"
                )}
              >
                Activities ({leadActivities.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveLeadTab('followups')}
                className={cn(
                  "py-2 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer",
                  activeLeadTab === 'followups' ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500"
                )}
              >
                Follow-ups ({leadFollowUps.length})
              </button>
            </div>

            {/* Tab: Overview */}
            {activeLeadTab === 'overview' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Company</span>
                    <span className="font-bold text-slate-800">{selectedLeadModal.companyName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Product Interest</span>
                    <span className="font-bold text-slate-800">{selectedLeadModal.interestedProduct || 'General'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Estimated Valuation</span>
                    <span className="font-bold text-emerald-700">₹{(selectedLeadModal.estimatedValue || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Lead Source</span>
                    <span className="font-bold text-slate-800">{selectedLeadModal.source}</span>
                  </div>
                </div>

                {selectedLeadModal.notes && (
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-mono block mb-1">Internal Notes</span>
                    <p className="text-slate-700 italic">"{selectedLeadModal.notes}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Activities */}
            {activeLeadTab === 'activities' && (
              <div className="space-y-4">
                <form onSubmit={handleAddActivity} className="p-3.5 bg-slate-50 rounded-xl space-y-2.5">
                  <span className="text-xs font-bold text-slate-800 block">Log New Interaction</span>
                  <div className="flex gap-2">
                    <select
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value as ActivityType)}
                      className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold"
                    >
                      <option value="CALL">Phone Call</option>
                      <option value="EMAIL">Email</option>
                      <option value="MEETING">Meeting / Demo</option>
                      <option value="NOTE">Note</option>
                      <option value="WHATSAPP">WhatsApp</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Describe outcome or notes..."
                      value={activityDescription}
                      onChange={(e) => setActivityDescription(e.target.value)}
                      className="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                    <AdminButton variant="primary" size="sm" type="submit">
                      Log
                    </AdminButton>
                  </div>
                </form>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {leadActivities.map((act) => (
                    <div key={act.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-2.5 text-xs">
                      <Activity className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{act.type}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{new Date(act.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{act.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Follow-ups */}
            {activeLeadTab === 'followups' && (
              <div className="space-y-4">
                <form onSubmit={handleAddFollowUp} className="p-3.5 bg-slate-50 rounded-xl space-y-2.5">
                  <span className="text-xs font-bold text-slate-800 block">Schedule Follow-up</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Follow-up title (e.g. Contract Review)"
                      value={followUpTitle}
                      onChange={(e) => setFollowUpTitle(e.target.value)}
                      className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                      required
                    />
                    <input
                      type="datetime-local"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Additional notes..."
                      value={followUpNotes}
                      onChange={(e) => setFollowUpNotes(e.target.value)}
                      className="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                    <AdminButton variant="primary" size="sm" type="submit">
                      Schedule
                    </AdminButton>
                  </div>
                </form>

                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {leadFollowUps.map((fu) => (
                    <div key={fu.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{fu.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{new Date(fu.scheduledAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold",
                          fu.status === 'COMPLETED' ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        )}>
                          {fu.status}
                        </span>
                        {fu.status !== 'COMPLETED' && (
                          <AdminButton
                            variant="secondary"
                            size="sm"
                            onClick={() => handleUpdateFollowUpStatus(fu.id, 'COMPLETED')}
                          >
                            Done
                          </AdminButton>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CUSTOMER 360 MODAL */}
      {selectedCustomer360 && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative text-xs">
            <button
              type="button"
              onClick={() => setSelectedCustomer360(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                CUSTOMER 360° PROFILE
              </span>
              <span className="font-mono text-slate-400">User #{selectedCustomer360.profile.id}</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900">{selectedCustomer360.profile.name || 'Customer'}</h3>
            <p className="text-slate-500 font-mono mt-0.5">{selectedCustomer360.profile.email} • {selectedCustomer360.profile.phone || 'No phone'}</p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Lifetime Value</span>
                <span className="text-base font-black text-emerald-700">₹{(selectedCustomer360.totalSpent || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Total Orders</span>
                <span className="text-base font-black text-slate-900">{selectedCustomer360.totalOrdersCount || 0}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Active Licenses</span>
                <span className="text-base font-black text-blue-600">{selectedCustomer360.licenses?.length || 0}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Subscriptions</span>
                <span className="text-base font-black text-indigo-600">{selectedCustomer360.subscriptions?.length || 0}</span>
              </div>
            </div>

            {/* Customer Timeline / Order History */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="font-bold text-slate-900">Activity &amp; Entitlement Timeline</h4>
              <div className="space-y-2 max-h-[240px] overflow-y-auto">
                {selectedCustomer360.timeline && selectedCustomer360.timeline.length > 0 ? (
                  selectedCustomer360.timeline.map((tm, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-sky-600 mt-1 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{tm.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{new Date(tm.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{tm.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No historical events recorded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MATCH & CONVERSION MODAL */}
      {isMatchModalOpen && customerMatchResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-xs">
            <button
              type="button"
              onClick={() => setIsMatchModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Customer Match &amp; Conversion</h3>
            <p className="text-slate-500 text-[11px] mb-4">Lead #{customerMatchResult.leadId} ({customerMatchResult.lead.email})</p>

            {customerMatchResult.hasExactMatch && customerMatchResult.matchedUser ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 mb-4">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Existing Account Match Found! ({customerMatchResult.matchReason})
                </div>
                <p className="text-slate-700">User: <strong>{customerMatchResult.matchedUser.name}</strong> ({customerMatchResult.matchedUser.email})</p>
                <p className="text-[11px] text-slate-500">Linking this lead preserves customer transaction history without generating duplicate user profiles.</p>
                <AdminButton
                  variant="primary"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => handleLinkCustomer(customerMatchResult.leadId, customerMatchResult.matchedUser!.id)}
                >
                  Link to Existing Account ✓
                </AdminButton>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 mb-4">
                <p className="font-bold text-slate-800">No Existing Customer Profile</p>
                <p className="text-slate-600 text-[11px]">Converting this lead will initialize a secure customer account with role <strong>ROLE_CUSTOMER</strong>.</p>
                <AdminButton
                  variant="primary"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => handleConvertLead(customerMatchResult.leadId)}
                >
                  Convert &amp; Initialize Customer Account →
                </AdminButton>
              </div>
            )}

            <div className="flex justify-end">
              <AdminButton variant="outline" size="sm" onClick={() => setIsMatchModalOpen(false)}>
                Cancel
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* CREATE LEAD MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCreate}
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-xs space-y-3"
          >
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Create New CRM Lead</h3>

            <div className="grid grid-cols-2 gap-2">
              <AdminInput
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <AdminInput
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <AdminInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <AdminInput
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <AdminInput
                label="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
              <AdminInput
                label="Product Interest"
                value={formData.interestedProduct}
                onChange={(e) => setFormData({ ...formData, interestedProduct: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-700 text-xs font-semibold mb-1">Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="WEBSITE">Website</option>
                  <option value="GOOGLE_ADS">Google Ads</option>
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="MANUAL">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-semibold mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as LeadPriority })}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 text-xs font-semibold mb-1">Deal Value (₹)</label>
                <input
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                  placeholder="50000"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <AdminButton variant="outline" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </AdminButton>
              <AdminButton variant="primary" size="sm" type="submit">
                Create Lead
              </AdminButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

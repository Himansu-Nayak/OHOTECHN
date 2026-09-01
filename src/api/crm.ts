import { apiClient } from './client';
import { ApiResponse, LeadDto, PageResponse, CreateLeadRequest, UpdateLeadRequest, LeadStatus, LeadSource, LeadPriority } from './types';

export interface GetLeadsParams {
  search?: string;
  status?: LeadStatus | string;
  source?: LeadSource | string;
  priority?: LeadPriority | string;
  assignedToId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export async function getAdminLeadsApi(params: GetLeadsParams = {}): Promise<ApiResponse<PageResponse<LeadDto>>> {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'ALL') query.append('status', params.status);
  if (params.source && params.source !== 'ALL') query.append('source', params.source);
  if (params.priority && params.priority !== 'ALL') query.append('priority', params.priority);
  if (params.assignedToId) query.append('assignedToId', params.assignedToId.toString());
  if (params.startDate) query.append('startDate', params.startDate);
  if (params.endDate) query.append('endDate', params.endDate);
  if (params.page !== undefined) query.append('page', params.page.toString());
  if (params.size !== undefined) query.append('size', params.size.toString());
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortDir) query.append('sortDir', params.sortDir);

  const url = `/api/admin/crm/leads${query.toString() ? `?${query.toString()}` : ''}`;
  return apiClient<PageResponse<LeadDto>>(url, {
    method: 'GET',
  });
}

export async function getAdminLeadByIdApi(id: number): Promise<ApiResponse<LeadDto>> {
  return apiClient<LeadDto>(`/api/admin/crm/leads/${id}`, {
    method: 'GET',
  });
}

export async function createAdminLeadApi(data: CreateLeadRequest): Promise<ApiResponse<LeadDto>> {
  return apiClient<LeadDto>('/api/admin/crm/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminLeadApi(id: number, data: UpdateLeadRequest): Promise<ApiResponse<LeadDto>> {
  return apiClient<LeadDto>(`/api/admin/crm/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function updateAdminLeadStatusApi(id: number, status: LeadStatus): Promise<ApiResponse<LeadDto>> {
  return apiClient<LeadDto>(`/api/admin/crm/leads/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function assignAdminLeadApi(id: number, assignedToId?: number): Promise<ApiResponse<LeadDto>> {
  return apiClient<LeadDto>(`/api/admin/crm/leads/${id}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ assignedToId: assignedToId || null }),
  });
}

export async function deleteAdminLeadApi(id: number): Promise<ApiResponse<void>> {
  return apiClient<void>(`/api/admin/crm/leads/${id}`, {
    method: 'DELETE',
  });
}

// Pipeline, Activities & Follow-Up API helpers
export async function getPipelineBoardApi(): Promise<ApiResponse<import('./types').PipelineStageDto[]>> {
  return apiClient<import('./types').PipelineStageDto[]>('/api/admin/crm/pipeline', {
    method: 'GET',
  });
}

export async function getLeadActivitiesApi(leadId: number): Promise<ApiResponse<import('./types').LeadActivityDto[]>> {
  return apiClient<import('./types').LeadActivityDto[]>(`/api/admin/crm/leads/${leadId}/activities`, {
    method: 'GET',
  });
}

export async function createLeadActivityApi(leadId: number, data: import('./types').CreateActivityRequest): Promise<ApiResponse<import('./types').LeadActivityDto>> {
  return apiClient<import('./types').LeadActivityDto>(`/api/admin/crm/leads/${leadId}/activities`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getLeadFollowUpsApi(leadId: number): Promise<ApiResponse<import('./types').LeadFollowUpDto[]>> {
  return apiClient<import('./types').LeadFollowUpDto[]>(`/api/admin/crm/leads/${leadId}/follow-ups`, {
    method: 'GET',
  });
}

export async function createLeadFollowUpApi(leadId: number, data: import('./types').CreateFollowUpRequest): Promise<ApiResponse<import('./types').LeadFollowUpDto>> {
  return apiClient<import('./types').LeadFollowUpDto>(`/api/admin/crm/leads/${leadId}/follow-ups`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateFollowUpApi(followUpId: number, data: import('./types').UpdateFollowUpRequest): Promise<ApiResponse<import('./types').LeadFollowUpDto>> {
  return apiClient<import('./types').LeadFollowUpDto>(`/api/admin/crm/follow-ups/${followUpId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function getFollowUpDashboardApi(): Promise<ApiResponse<import('./types').FollowUpDashboardDto>> {
  return apiClient<import('./types').FollowUpDashboardDto>('/api/admin/crm/follow-ups/dashboard', {
    method: 'GET',
  });
}

// Phase 4 Customer 360 & Lead Conversion API helpers
export async function getAdminCustomersApi(search?: string, page = 0, size = 15): Promise<ApiResponse<import('./types').PageResponse<import('./types').UserDto>>> {
  const query = new URLSearchParams();
  if (search) query.append('search', search);
  query.append('page', page.toString());
  query.append('size', size.toString());
  return apiClient<import('./types').PageResponse<import('./types').UserDto>>(`/api/admin/crm/customers?${query.toString()}`, {
    method: 'GET',
  });
}

export async function getCustomer360Api(userId: number): Promise<ApiResponse<import('./types').Customer360Dto>> {
  return apiClient<import('./types').Customer360Dto>(`/api/admin/crm/customers/${userId}`, {
    method: 'GET',
  });
}

export async function getCustomerMatchApi(leadId: number): Promise<ApiResponse<import('./types').CustomerMatchResultDto>> {
  return apiClient<import('./types').CustomerMatchResultDto>(`/api/admin/crm/leads/${leadId}/customer-match`, {
    method: 'GET',
  });
}

export async function linkCustomerApi(leadId: number, userId: number): Promise<ApiResponse<import('./types').LeadDto>> {
  return apiClient<import('./types').LeadDto>(`/api/admin/crm/leads/${leadId}/link-customer`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export async function convertLeadApi(leadId: number, data?: import('./types').ConvertLeadRequest): Promise<ApiResponse<import('./types').LeadDto>> {
  return apiClient<import('./types').LeadDto>(`/api/admin/crm/leads/${leadId}/convert`, {
    method: 'POST',
    body: JSON.stringify(data || {}),
  });
}

// Phase 5 Marketing Analytics API
export async function getMarketingAnalyticsApi(): Promise<ApiResponse<import('./types').CrmMarketingAnalyticsDto>> {
  return apiClient<import('./types').CrmMarketingAnalyticsDto>('/api/admin/crm/analytics/marketing', {
    method: 'GET',
  });
}



import { apiClient } from './client';
import {
  ApiResponse,
  SupportTicketDto,
  CreateTicketRequest,
  TicketReplyRequest,
  TicketStatusUpdateRequest,
  SupportStatsDto,
  ContactEnquiry,
} from './types';

export interface TicketFilterParams {
  status?: string;
  department?: string;
  priority?: string;
  search?: string;
}

/* =========================================================================
   SUPPORT STAFF / ADMIN / DEVELOPER OPERATIONS
   ========================================================================= */

export async function getStaffTicketsApi(params?: TicketFilterParams): Promise<ApiResponse<SupportTicketDto[]>> {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.department) query.append('department', params.department);
  if (params?.priority) query.append('priority', params.priority);
  if (params?.search) query.append('search', params.search);

  const qs = query.toString();
  return apiClient<SupportTicketDto[]>(`/api/support/tickets${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
}

export async function getStaffTicketDetailsApi(id: number): Promise<ApiResponse<SupportTicketDto>> {
  return apiClient<SupportTicketDto>(`/api/support/tickets/${id}`, {
    method: 'GET',
  });
}

export async function postStaffReplyApi(
  id: number,
  data: TicketReplyRequest
): Promise<ApiResponse<SupportTicketDto>> {
  return apiClient<SupportTicketDto>(`/api/support/tickets/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTicketStatusApi(
  id: number,
  data: TicketStatusUpdateRequest
): Promise<ApiResponse<SupportTicketDto>> {
  return apiClient<SupportTicketDto>(`/api/support/tickets/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function assignTicketApi(
  id: number,
  targetStaffId: number
): Promise<ApiResponse<SupportTicketDto>> {
  return apiClient<SupportTicketDto>(`/api/support/tickets/${id}/assign?targetStaffId=${targetStaffId}`, {
    method: 'PUT',
  });
}

export async function convertEnquiryToTicketApi(enquiryId: number): Promise<ApiResponse<SupportTicketDto>> {
  return apiClient<SupportTicketDto>(`/api/support/tickets/convert-enquiry/${enquiryId}`, {
    method: 'POST',
  });
}

export async function getSupportStatsApi(): Promise<ApiResponse<SupportStatsDto>> {
  return apiClient<SupportStatsDto>('/api/support/stats', {
    method: 'GET',
  });
}

export async function getSupportEnquiriesApi(): Promise<ApiResponse<ContactEnquiry[]>> {
  return apiClient<ContactEnquiry[]>('/api/support/enquiries', {
    method: 'GET',
  });
}

/* =========================================================================
   CUSTOMER TICKET OPERATIONS
   ========================================================================= */

export async function createCustomerTicketApi(data: CreateTicketRequest): Promise<ApiResponse<SupportTicketDto>> {
  return apiClient<SupportTicketDto>('/api/support/customer/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMyCustomerTicketsApi(): Promise<ApiResponse<SupportTicketDto[]>> {
  return apiClient<SupportTicketDto[]>('/api/support/customer/tickets', {
    method: 'GET',
  });
}

export async function getMyCustomerTicketDetailsApi(id: number): Promise<ApiResponse<SupportTicketDto>> {
  return apiClient<SupportTicketDto>(`/api/support/customer/tickets/${id}`, {
    method: 'GET',
  });
}

export async function postCustomerReplyApi(
  id: number,
  data: TicketReplyRequest
): Promise<ApiResponse<SupportTicketDto>> {
  return apiClient<SupportTicketDto>(`/api/support/customer/tickets/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/* =========================================================================
   PUBLIC GUEST TICKET CREATION
   ========================================================================= */

export async function createPublicTicketApi(data: CreateTicketRequest): Promise<ApiResponse<SupportTicketDto>> {
  return apiClient<SupportTicketDto>('/api/support/public/ticket', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

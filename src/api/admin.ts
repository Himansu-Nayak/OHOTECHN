import { apiClient } from './client';
import { ApiResponse, AnalyticsDashboardDto, AuditLogDto, ContactEnquiry, PageResponse } from './types';

export async function getAnalyticsDashboardApi(startDate?: string, endDate?: string): Promise<ApiResponse<AnalyticsDashboardDto>> {
  let url = '/api/admin/analytics/dashboard';
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (params.toString()) url += `?${params.toString()}`;

  return apiClient<AnalyticsDashboardDto>(url, {
    method: 'GET',
  });
}

export async function getAdminAuditLogsApi(
  page = 0,
  size = 20,
  action?: string,
  entityType?: string,
  search?: string
): Promise<ApiResponse<PageResponse<AuditLogDto>>> {
  let url = `/api/admin/audit-logs?page=${page}&size=${size}`;
  if (action) url += `&action=${encodeURIComponent(action)}`;
  if (entityType) url += `&entityType=${encodeURIComponent(entityType)}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;

  return apiClient<PageResponse<AuditLogDto>>(url, {
    method: 'GET',
  });
}

export async function getAdminEnquiriesApi(): Promise<ApiResponse<ContactEnquiry[]>> {
  return apiClient<ContactEnquiry[]>('/api/admin/enquiries', {
    method: 'GET',
  });
}

export async function updateAdminEnquiryStatusApi(id: number | string, status: string): Promise<ApiResponse<ContactEnquiry>> {
  return apiClient<ContactEnquiry>(`/api/admin/enquiries/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function getAdminStatsApi(): Promise<ApiResponse<{ totalProducts: number; totalOrders: number; totalUsers: number; totalQuotes: number; totalRevenue: number; systemStatus: string }>> {
  return apiClient<{ totalProducts: number; totalOrders: number; totalUsers: number; totalQuotes: number; totalRevenue: number; systemStatus: string }>('/api/admin/stats', {
    method: 'GET',
  });
}

export async function getAdminOrdersApi(): Promise<ApiResponse<import('./types').Order[]>> {
  return apiClient<import('./types').Order[]>('/api/admin/orders', {
    method: 'GET',
  });
}

export async function updateAdminOrderStatusApi(id: number | string, status: string): Promise<ApiResponse<import('./types').Order>> {
  return apiClient<import('./types').Order>(`/api/admin/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function getAdminProductsApi(
  page = 0,
  size = 20,
  search?: string,
  category?: number,
  active?: boolean
): Promise<ApiResponse<PageResponse<import('./types').ProductDto>>> {
  let url = `/api/admin/products?page=${page}&size=${size}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (category) url += `&category=${category}`;
  if (active !== undefined) url += `&active=${active}`;

  return apiClient<PageResponse<import('./types').ProductDto>>(url, {
    method: 'GET',
  });
}

export async function createAdminProductApi(dto: Partial<import('./types').ProductDto>): Promise<ApiResponse<import('./types').ProductDto>> {
  return apiClient<import('./types').ProductDto>('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function updateAdminProductApi(id: number | string, dto: Partial<import('./types').ProductDto>): Promise<ApiResponse<import('./types').ProductDto>> {
  return apiClient<import('./types').ProductDto>(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

export async function updateAdminProductStatusApi(id: number | string, active: boolean): Promise<ApiResponse<import('./types').ProductDto>> {
  return apiClient<import('./types').ProductDto>(`/api/admin/products/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ active }),
  });
}

export async function deleteAdminProductApi(id: number | string): Promise<ApiResponse<string>> {
  return apiClient<string>(`/api/admin/products/${id}`, {
    method: 'DELETE',
  });
}

export async function getCustomer360Api(userId: number | string): Promise<ApiResponse<import('./types').Customer360Dto>> {
  return apiClient<import('./types').Customer360Dto>(`/api/admin/crm/customers/${userId}`, {
    method: 'GET',
  });
}


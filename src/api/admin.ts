import { apiClient } from './client';
import { ApiResponse, AnalyticsDashboardDto, AuditLogDto, PageResponse } from './types';

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

import { apiClient } from './client';
import { ApiResponse, DeveloperAnalyticsDto } from './types';

export async function getDeveloperAnalyticsApi(
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<DeveloperAnalyticsDto>> {
  let url = '/api/developer/analytics';
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (params.toString()) url += `?${params.toString()}`;

  return apiClient<DeveloperAnalyticsDto>(url, {
    method: 'GET',
  });
}

export async function getDeveloperDeploymentsApi(
  page: number = 0,
  size: number = 20,
  status?: string
): Promise<ApiResponse<{ content: import('./types').DeploymentDto[]; totalElements: number; totalPages: number }>> {
  let url = `/api/developer/deployments?page=${page}&size=${size}`;
  if (status) url += `&status=${status}`;

  return apiClient<{ content: import('./types').DeploymentDto[]; totalElements: number; totalPages: number }>(url, {
    method: 'GET',
  });
}

export async function transitionDeploymentApi(
  id: number,
  data: {
    action: string;
    assignedEngineer?: string;
    accessUrl?: string;
    customerNotes?: string;
    adminNotes?: string;
  }
): Promise<ApiResponse<import('./types').DeploymentDto>> {
  return apiClient<import('./types').DeploymentDto>(`/api/developer/deployments/${id}/transition`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

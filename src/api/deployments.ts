import { apiClient } from './client';
import { ApiResponse, Page, DeploymentDto, DeploymentStatus } from './types';

export async function getAdminDeploymentsApi(
  page = 0,
  size = 10,
  status?: DeploymentStatus | string
): Promise<ApiResponse<Page<DeploymentDto>>> {
  const queryParams = new URLSearchParams();
  queryParams.set('page', page.toString());
  queryParams.set('size', size.toString());
  if (status && status.trim() !== '') {
    queryParams.set('status', status.trim());
  }

  return apiClient<Page<DeploymentDto>>(`/api/admin/deployments?${queryParams.toString()}`, {
    method: 'GET',
  });
}

export async function getAdminDeploymentByIdApi(id: number | string): Promise<ApiResponse<DeploymentDto>> {
  return apiClient<DeploymentDto>(`/api/admin/deployments/${id}`, {
    method: 'GET',
  });
}

export async function createAdminDeploymentApi(dto: Partial<DeploymentDto>): Promise<ApiResponse<DeploymentDto>> {
  return apiClient<DeploymentDto>('/api/admin/deployments', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function updateAdminDeploymentStatusApi(
  id: number | string,
  payload: {
    status?: DeploymentStatus | string;
    adminNotes?: string;
    accessUrl?: string;
    assignedEngineer?: string;
  }
): Promise<ApiResponse<DeploymentDto>> {
  return apiClient<DeploymentDto>(`/api/admin/deployments/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function updateAdminDeploymentCustomerNotesApi(
  id: number | string,
  customerNotes: string
): Promise<ApiResponse<DeploymentDto>> {
  return apiClient<DeploymentDto>(`/api/admin/deployments/${id}/customer-notes`, {
    method: 'PUT',
    body: JSON.stringify({ customerNotes }),
  });
}

export async function getMyDeploymentsApi(): Promise<ApiResponse<DeploymentDto[]>> {
  return apiClient<DeploymentDto[]>('/api/deployments/my', {
    method: 'GET',
  });
}

export async function getMyDeploymentByIdApi(id: number | string): Promise<ApiResponse<DeploymentDto>> {
  return apiClient<DeploymentDto>(`/api/deployments/${id}`, {
    method: 'GET',
  });
}

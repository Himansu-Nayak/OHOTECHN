import { apiClient, getAccessToken } from './client';
import { ApiResponse, ProductDto, SoftwareReleaseDto } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getMyEntitledProductsApi(): Promise<ApiResponse<ProductDto[]>> {
  return apiClient<ProductDto[]>('/api/products/my', {
    method: 'GET',
  });
}

export async function getEntitledProductReleasesApi(productId: number | string): Promise<ApiResponse<SoftwareReleaseDto[]>> {
  return apiClient<SoftwareReleaseDto[]>(`/api/products/my/${productId}/releases`, {
    method: 'GET',
  });
}

export async function downloadReleaseApi(productId: number | string, releaseId: number | string): Promise<Blob> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}/api/products/my/${productId}/download/${releaseId}`, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Download failed: ${res.statusText} (HTTP ${res.status})`);
  }

  return await res.blob();
}

// Admin APIs
export async function getAdminReleasesApi(productId: number | string): Promise<ApiResponse<SoftwareReleaseDto[]>> {
  return apiClient<SoftwareReleaseDto[]>(`/api/admin/products/${productId}/releases`, {
    method: 'GET',
  });
}

export async function createAdminReleaseApi(productId: number | string, dto: Partial<SoftwareReleaseDto>): Promise<ApiResponse<SoftwareReleaseDto>> {
  return apiClient<SoftwareReleaseDto>(`/api/admin/products/${productId}/releases`, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function updateAdminReleaseApi(releaseId: number | string, dto: Partial<SoftwareReleaseDto>): Promise<ApiResponse<SoftwareReleaseDto>> {
  return apiClient<SoftwareReleaseDto>(`/api/admin/releases/${releaseId}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

export async function toggleAdminReleaseStatusApi(releaseId: number | string, active: boolean): Promise<ApiResponse<SoftwareReleaseDto>> {
  return apiClient<SoftwareReleaseDto>(`/api/admin/releases/${releaseId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ active }),
  });
}

export async function deleteAdminReleaseApi(releaseId: number | string): Promise<ApiResponse<string>> {
  return apiClient<string>(`/api/admin/releases/${releaseId}`, {
    method: 'DELETE',
  });
}

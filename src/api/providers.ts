import { apiClient } from './client';
import { ApiResponse, Page, ProviderDto, ProductDto } from './types';

export async function getAdminProvidersApi(
  page = 0,
  size = 10,
  search?: string
): Promise<ApiResponse<Page<ProviderDto>>> {
  const queryParams = new URLSearchParams();
  queryParams.set('page', page.toString());
  queryParams.set('size', size.toString());
  if (search && search.trim() !== '') {
    queryParams.set('search', search.trim());
  }

  return apiClient<Page<ProviderDto>>(`/api/admin/providers?${queryParams.toString()}`, {
    method: 'GET',
  });
}

export async function getAllActiveProvidersApi(): Promise<ApiResponse<ProviderDto[]>> {
  return apiClient<ProviderDto[]>('/api/admin/providers/all', {
    method: 'GET',
  });
}

export async function getAdminProviderByIdApi(id: number | string): Promise<ApiResponse<ProviderDto>> {
  return apiClient<ProviderDto>(`/api/admin/providers/${id}`, {
    method: 'GET',
  });
}

export async function createAdminProviderApi(dto: Partial<ProviderDto>): Promise<ApiResponse<ProviderDto>> {
  return apiClient<ProviderDto>('/api/admin/providers', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function updateAdminProviderApi(
  id: number | string,
  dto: Partial<ProviderDto>
): Promise<ApiResponse<ProviderDto>> {
  return apiClient<ProviderDto>(`/api/admin/providers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

export async function toggleAdminProviderStatusApi(
  id: number | string,
  active: boolean
): Promise<ApiResponse<ProviderDto>> {
  return apiClient<ProviderDto>(`/api/admin/providers/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ active }),
  });
}

export async function deleteAdminProviderApi(id: number | string): Promise<ApiResponse<string>> {
  return apiClient<string>(`/api/admin/providers/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdminProviderProductsApi(id: number | string): Promise<ApiResponse<ProductDto[]>> {
  return apiClient<ProductDto[]>(`/api/admin/providers/${id}/products`, {
    method: 'GET',
  });
}

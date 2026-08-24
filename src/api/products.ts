import { apiClient } from './client';
import { ApiResponse, Page, ProductDto } from './types';

export async function getProductsApi(
  page = 0,
  size = 10,
  search?: string,
  category?: number | string
): Promise<ApiResponse<Page<ProductDto>>> {
  const queryParams = new URLSearchParams();
  queryParams.set('page', page.toString());
  queryParams.set('size', size.toString());
  if (search && search.trim() !== '') {
    queryParams.set('search', search.trim());
  }
  if (category) {
    queryParams.set('category', category.toString());
  }

  return apiClient<Page<ProductDto>>(`/api/products?${queryParams.toString()}`, {
    method: 'GET',
  });
}

export async function getProductByIdApi(id: number | string): Promise<ApiResponse<ProductDto>> {
  return apiClient<ProductDto>(`/api/products/${id}`, {
    method: 'GET',
  });
}

export async function getAdminProductsApi(
  page = 0,
  size = 10,
  search?: string,
  category?: number | string,
  active?: boolean
): Promise<ApiResponse<Page<ProductDto>>> {
  const queryParams = new URLSearchParams();
  queryParams.set('page', page.toString());
  queryParams.set('size', size.toString());
  if (search && search.trim() !== '') {
    queryParams.set('search', search.trim());
  }
  if (category) {
    queryParams.set('category', category.toString());
  }
  if (active !== undefined) {
    queryParams.set('active', active.toString());
  }

  return apiClient<Page<ProductDto>>(`/api/admin/products?${queryParams.toString()}`, {
    method: 'GET',
  });
}

export async function createAdminProductApi(dto: Partial<ProductDto>): Promise<ApiResponse<ProductDto>> {
  return apiClient<ProductDto>('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function updateAdminProductApi(id: number | string, dto: Partial<ProductDto>): Promise<ApiResponse<ProductDto>> {
  return apiClient<ProductDto>(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

export async function updateAdminProductStatusApi(id: number | string, active: boolean): Promise<ApiResponse<ProductDto>> {
  return apiClient<ProductDto>(`/api/admin/products/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ active }),
  });
}

export async function deleteAdminProductApi(id: number | string): Promise<ApiResponse<string>> {
  return apiClient<string>(`/api/admin/products/${id}`, {
    method: 'DELETE',
  });
}

export async function getCategoriesApi(): Promise<ApiResponse<any[]>> {
  return apiClient<any[]>('/api/categories', {
    method: 'GET',
  });
}

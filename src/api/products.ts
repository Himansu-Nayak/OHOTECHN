import { apiClient } from './client';
import { ApiResponse, Page, ProductDto } from './types';

export async function getProductsApi(
  page = 0,
  size = 10,
  search?: string
): Promise<ApiResponse<Page<ProductDto>>> {
  const queryParams = new URLSearchParams();
  queryParams.set('page', page.toString());
  queryParams.set('size', size.toString());
  if (search && search.trim() !== '') {
    queryParams.set('search', search.trim());
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

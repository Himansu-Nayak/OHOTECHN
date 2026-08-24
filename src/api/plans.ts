import { apiClient } from './client';
import { ApiResponse, ProductPlanDto } from './types';

export async function getProductPlansApi(productId: number | string): Promise<ApiResponse<ProductPlanDto[]>> {
  return apiClient<ProductPlanDto[]>(`/api/products/${productId}/plans`, {
    method: 'GET',
  });
}

export async function getAdminProductPlansApi(productId: number | string): Promise<ApiResponse<ProductPlanDto[]>> {
  return apiClient<ProductPlanDto[]>(`/api/admin/products/${productId}/plans`, {
    method: 'GET',
  });
}

export async function createAdminProductPlanApi(productId: number | string, dto: Partial<ProductPlanDto>): Promise<ApiResponse<ProductPlanDto>> {
  return apiClient<ProductPlanDto>(`/api/admin/products/${productId}/plans`, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function updateAdminProductPlanApi(planId: number | string, dto: Partial<ProductPlanDto>): Promise<ApiResponse<ProductPlanDto>> {
  return apiClient<ProductPlanDto>(`/api/admin/plans/${planId}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

export async function toggleAdminProductPlanStatusApi(planId: number | string, active: boolean): Promise<ApiResponse<ProductPlanDto>> {
  return apiClient<ProductPlanDto>(`/api/admin/plans/${planId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ active }),
  });
}

export async function deleteAdminProductPlanApi(planId: number | string): Promise<ApiResponse<string>> {
  return apiClient<string>(`/api/admin/plans/${planId}`, {
    method: 'DELETE',
  });
}

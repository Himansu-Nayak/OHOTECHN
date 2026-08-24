import { apiClient } from './client';
import { ApiResponse, Subscription, SubscriptionStatus } from './types';

export async function getMySubscriptionsApi(): Promise<ApiResponse<Subscription[]>> {
  return apiClient<Subscription[]>('/api/subscriptions/my', {
    method: 'GET',
  });
}

export async function getSubscriptionByIdApi(id: number | string): Promise<ApiResponse<Subscription>> {
  return apiClient<Subscription>(`/api/subscriptions/${id}`, {
    method: 'GET',
  });
}

export async function cancelSubscriptionApi(id: number | string): Promise<ApiResponse<Subscription>> {
  return apiClient<Subscription>(`/api/subscriptions/${id}/cancel`, {
    method: 'POST',
  });
}

export async function startFreeTrialApi(productId: number | string): Promise<ApiResponse<any>> {
  return apiClient<any>(`/api/products/${productId}/trial`, {
    method: 'POST',
  });
}

// Admin APIs
export async function getAdminSubscriptionsApi(): Promise<ApiResponse<Subscription[]>> {
  return apiClient<Subscription[]>('/api/admin/subscriptions', {
    method: 'GET',
  });
}

export async function updateAdminSubscriptionStatusApi(id: number | string, status: SubscriptionStatus): Promise<ApiResponse<Subscription>> {
  return apiClient<Subscription>(`/api/admin/subscriptions/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

import { apiClient } from './client';
import { ApiResponse, Order } from './types';

export interface CreateOrderParams {
  shippingAddress: string;
  contactPhone: string;
}

export async function createOrderApi(params: CreateOrderParams): Promise<ApiResponse<Order>> {
  return apiClient<Order>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function getMyOrdersApi(): Promise<ApiResponse<Order[]>> {
  return apiClient<Order[]>('/api/orders', {
    method: 'GET',
  });
}

export async function getOrderByIdApi(id: number | string): Promise<ApiResponse<Order>> {
  return apiClient<Order>(`/api/orders/${id}`, {
    method: 'GET',
  });
}

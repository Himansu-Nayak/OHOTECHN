import { apiClient, getAccessToken } from './client';
import { ApiResponse, Order } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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

export async function downloadOrderInvoiceApi(id: number | string): Promise<Blob> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}/api/orders/${id}/invoice`, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to download invoice (HTTP ${res.status})`);
  }

  return await res.blob();
}

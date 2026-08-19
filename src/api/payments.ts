import { apiClient } from './client';
import { ApiResponse, Payment } from './types';

export interface CreatePaymentOrderParams {
  orderId: number;
}

export interface VerifyPaymentParams {
  orderId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export async function createPaymentOrderApi(orderId: number): Promise<ApiResponse<Record<string, any>>> {
  return apiClient<Record<string, any>>('/api/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
}

export async function verifyPaymentApi(params: VerifyPaymentParams): Promise<ApiResponse<Payment>> {
  return apiClient<Payment>('/api/payments/verify', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

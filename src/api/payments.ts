import { apiClient } from './client';
import {
  ApiResponse,
  Payment,
  PaymentConfigDto,
  UpiInitiateResponse,
  UtrSubmissionRequest,
  AdminPaymentActionRequest,
} from './types';

export interface CreatePaymentOrderParams {
  orderId: number;
}

export interface VerifyPaymentParams {
  orderId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export async function getPaymentConfigApi(): Promise<ApiResponse<PaymentConfigDto>> {
  return apiClient<PaymentConfigDto>('/api/payments/config', {
    method: 'GET',
  });
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

export async function initiateUpiPaymentApi(orderId: number): Promise<ApiResponse<UpiInitiateResponse>> {
  return apiClient<UpiInitiateResponse>('/api/payments/initiate-upi', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
}

export async function submitUtrApi(data: UtrSubmissionRequest): Promise<ApiResponse<Payment>> {
  return apiClient<Payment>('/api/payments/submit-utr', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function initiateCodApi(orderId: number): Promise<ApiResponse<Payment>> {
  return apiClient<Payment>('/api/payments/initiate-cod', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
}

export async function getAdminPaymentsApi(): Promise<ApiResponse<Payment[]>> {
  return apiClient<Payment[]>('/api/admin/payments', {
    method: 'GET',
  });
}

export async function adminVerifyPaymentApi(
  paymentId: number,
  data?: AdminPaymentActionRequest
): Promise<ApiResponse<Payment>> {
  return apiClient<Payment>(`/api/admin/payments/${paymentId}/verify`, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function adminRejectPaymentApi(
  paymentId: number,
  data?: AdminPaymentActionRequest
): Promise<ApiResponse<Payment>> {
  return apiClient<Payment>(`/api/admin/payments/${paymentId}/reject`, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}


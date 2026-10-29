import { apiClient } from './client';
import {
  ApiResponse,
  Payment,
  PaymentConfigDto,
  UpiInitiateResponse,
  UtrSubmissionRequest,
  AdminPaymentActionRequest,
  PaymentReconciliationReportDto,
  TransactionOverviewDto,
  WebhookEventDto,
  Page,
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

export async function demoPayApi(orderId: number): Promise<ApiResponse<Payment>> {
  return apiClient<Payment>('/api/payments/demo-pay', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
}

export interface YouPiCreatePaymentResponse {
  orderId: number;
  paymentId: string;
  checkoutUrl: string;
  status: string;
  amountPaise: number;
  currency: string;
}

export async function createYouPiPaymentApi(orderId: number): Promise<ApiResponse<YouPiCreatePaymentResponse>> {
  return apiClient<YouPiCreatePaymentResponse>('/api/payments/youpi/create-order', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
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

export async function getPaymentReconciliationReportApi(): Promise<ApiResponse<PaymentReconciliationReportDto>> {
  return apiClient<PaymentReconciliationReportDto>('/api/admin/payments/reconciliation', {
    method: 'GET',
  });
}

// ==========================================
// TRANSACTION OPERATIONS CENTER APIS
// ==========================================

export async function getTransactionOverviewApi(
  period: string = 'ALL',
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<TransactionOverviewDto>> {
  const query = new URLSearchParams({ period });
  if (startDate) query.append('startDate', startDate);
  if (endDate) query.append('endDate', endDate);
  return apiClient<TransactionOverviewDto>(`/api/admin/transactions/overview?${query.toString()}`, {
    method: 'GET',
  });
}

export interface GetTransactionHistoryParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  provider?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export async function getTransactionsHistoryApi(
  params: GetTransactionHistoryParams = {}
): Promise<ApiResponse<Page<Payment>>> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.append('page', String(params.page));
  if (params.size !== undefined) query.append('size', String(params.size));
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'ALL') query.append('status', params.status);
  if (params.provider && params.provider !== 'ALL') query.append('provider', params.provider);
  if (params.startDate) query.append('startDate', params.startDate);
  if (params.endDate) query.append('endDate', params.endDate);
  if (params.sort) query.append('sort', params.sort);
  if (params.direction) query.append('direction', params.direction);

  return apiClient<Page<Payment>>(`/api/admin/transactions/history?${query.toString()}`, {
    method: 'GET',
  });
}

export interface GetWebhooksParams {
  page?: number;
  size?: number;
  provider?: string;
  status?: string;
  eventType?: string;
  search?: string;
}

export async function getWebhooksApi(
  params: GetWebhooksParams = {}
): Promise<ApiResponse<Page<WebhookEventDto>>> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.append('page', String(params.page));
  if (params.size !== undefined) query.append('size', String(params.size));
  if (params.provider && params.provider !== 'ALL') query.append('provider', params.provider);
  if (params.status && params.status !== 'ALL') query.append('status', params.status);
  if (params.eventType && params.eventType !== 'ALL') query.append('eventType', params.eventType);
  if (params.search) query.append('search', params.search);

  return apiClient<Page<WebhookEventDto>>(`/api/admin/transactions/webhooks?${query.toString()}`, {
    method: 'GET',
  });
}

export async function retryWebhookApi(
  webhookEventId: number
): Promise<ApiResponse<WebhookEventDto>> {
  return apiClient<WebhookEventDto>(`/api/admin/transactions/webhooks/${webhookEventId}/retry`, {
    method: 'POST',
  });
}

export async function recoverReconciliationApi(
  orderId: number
): Promise<ApiResponse<Payment>> {
  return apiClient<Payment>(`/api/admin/transactions/reconciliation/recover/${orderId}`, {
    method: 'POST',
  });
}

// ==========================================
// Self-Hosted UPI Checkout & Verification
// ==========================================

export async function requestPhoneOtpApi(phoneNumber: string): Promise<ApiResponse<{ message: string }>> {
  return apiClient<{ message: string }>('/api/auth/phone-otp/request', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber }),
  });
}

export async function verifyPhoneOtpApi(phoneNumber: string, otpCode: string): Promise<ApiResponse<{ proofToken: string; message: string }>> {
  return apiClient<{ proofToken: string; message: string }>('/api/auth/phone-otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber, otpCode }),
  });
}

export async function initiateSelfHostedUpiCheckoutApi(
  orderId: number,
  phoneProofToken?: string
): Promise<ApiResponse<UpiCheckoutResponseDto>> {
  return apiClient<UpiCheckoutResponseDto>('/api/payments/upi/initiate', {
    method: 'POST',
    body: JSON.stringify({ orderId, phoneProofToken }),
  });
}

export async function getSelfHostedUpiStatusApi(paymentId: number): Promise<ApiResponse<UpiCheckoutStatusDto>> {
  return apiClient<UpiCheckoutStatusDto>(`/api/payments/upi/status/${paymentId}`, {
    method: 'GET',
  });
}

export async function submitSelfHostedUtrApi(data: {
  paymentId: number;
  utr: string;
  payerUpi?: string;
  payerName?: string;
}): Promise<ApiResponse<UpiCheckoutStatusDto>> {
  return apiClient<UpiCheckoutStatusDto>('/api/payments/upi/submit-utr', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function cancelSelfHostedUpiApi(paymentId: number): Promise<ApiResponse<void>> {
  return apiClient<void>(`/api/payments/upi/cancel/${paymentId}`, {
    method: 'POST',
  });
}

// ==========================================
// Counter Billing POS (Cash & Card)
// ==========================================

export async function processCashSaleApi(
  orderId: number,
  cashTendered: number,
  notes?: string
): Promise<ApiResponse<CounterBillingReceiptDto>> {
  return apiClient<CounterBillingReceiptDto>('/api/admin/counter-billing/cash', {
    method: 'POST',
    body: JSON.stringify({ orderId, cashTendered, notes }),
  });
}

export async function processCardTerminalSaleApi(
  orderId: number,
  terminalRef: string,
  terminalId?: string,
  notes?: string
): Promise<ApiResponse<CounterBillingReceiptDto>> {
  return apiClient<CounterBillingReceiptDto>('/api/admin/counter-billing/card', {
    method: 'POST',
    body: JSON.stringify({ orderId, terminalRef, terminalId, notes }),
  });
}

export async function getCounterBillingSummaryApi(): Promise<ApiResponse<Record<string, any>>> {
  return apiClient<Record<string, any>>('/api/admin/counter-billing/terminal-summary', {
    method: 'GET',
  });
}

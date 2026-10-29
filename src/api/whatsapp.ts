import { apiClient } from './client';
import type { ApiResponse } from './types/common.types';
import type { Page } from './types/common.types';

export interface WhatsAppConfigDto {
  configured: boolean;
  providerName: string;
  businessContactNumber?: string;
  phoneNumberId: string;
  apiUrl: string;
  defaultTemplate: string;
  webhookEndpoint?: string;
  webhookConfigured?: boolean;
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalFailed: number;
  totalOptedOut?: number;
  totalConsented?: number;
}

export interface CrmWhatsAppMessageDto {
  id: number;
  recipientPhone: string;
  recipientName?: string;
  templateName: string;
  languageCode: string;
  parametersJson?: string;
  category?: string;
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'OPTED_OUT' | 'SKIPPED_UNCONFIGURED';
  wamid?: string;
  idempotencyKey?: string;
  errorMessage?: string;
  dispatchedBy?: string;
  leadId?: number;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SendWhatsAppMessageRequest {
  recipientPhone: string;
  recipientName?: string;
  templateName: string;
  languageCode?: string;
  parameters?: string[];
  leadId?: number;
  idempotencyKey?: string;
  category?: 'MARKETING' | 'TRANSACTIONAL' | 'UTILITY';
  overrideConsent?: boolean;
}

export interface CrmWhatsAppConsentDto {
  id: number;
  phone: string;
  optIn: boolean;
  source?: string;
  purpose?: string;
  optedInAt?: string;
  optedOutAt?: string;
  revocationReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RegisterWhatsAppConsentRequest {
  phone: string;
  optIn: boolean;
  source?: string;
  purpose?: string;
  reason?: string;
}

export async function getWhatsAppConfigApi(): Promise<ApiResponse<WhatsAppConfigDto>> {
  return apiClient<WhatsAppConfigDto>('/api/admin/whatsapp/config', {
    method: 'GET',
  });
}

export async function getWhatsAppMessagesApi(params?: {
  status?: string;
  page?: number;
  size?: number;
}): Promise<ApiResponse<Page<CrmWhatsAppMessageDto>>> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== 'ALL') query.append('status', params.status);
  if (params?.page !== undefined) query.append('page', params.page.toString());
  if (params?.size !== undefined) query.append('size', params.size.toString());

  const qs = query.toString();
  return apiClient<Page<CrmWhatsAppMessageDto>>(`/api/admin/whatsapp/messages${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
}

export async function sendWhatsAppMessageApi(
  payload: SendWhatsAppMessageRequest
): Promise<ApiResponse<CrmWhatsAppMessageDto>> {
  return apiClient<CrmWhatsAppMessageDto>('/api/admin/whatsapp/send', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getWhatsAppConsentsApi(params?: {
  optIn?: boolean;
  page?: number;
  size?: number;
}): Promise<ApiResponse<Page<CrmWhatsAppConsentDto>>> {
  const query = new URLSearchParams();
  if (params?.optIn !== undefined) query.append('optIn', params.optIn.toString());
  if (params?.page !== undefined) query.append('page', params.page.toString());
  if (params?.size !== undefined) query.append('size', params.size.toString());

  const qs = query.toString();
  return apiClient<Page<CrmWhatsAppConsentDto>>(`/api/admin/whatsapp/consents${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
}

export async function registerWhatsAppConsentApi(
  payload: RegisterWhatsAppConsentRequest
): Promise<ApiResponse<CrmWhatsAppConsentDto>> {
  return apiClient<CrmWhatsAppConsentDto>('/api/admin/whatsapp/consents', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

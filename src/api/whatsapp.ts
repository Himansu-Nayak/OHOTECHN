import { apiClient } from './client';
import type { ApiResponse } from './types/common.types';
import type { Page } from './types/common.types';

export interface WhatsAppConfigDto {
  configured: boolean;
  providerName: string;
  phoneNumberId: string;
  apiUrl: string;
  defaultTemplate: string;
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalFailed: number;
}

export interface CrmWhatsAppMessageDto {
  id: number;
  recipientPhone: string;
  recipientName?: string;
  templateName: string;
  languageCode: string;
  parametersJson?: string;
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  wamid?: string;
  errorMessage?: string;
  dispatchedBy?: string;
  leadId?: number;
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

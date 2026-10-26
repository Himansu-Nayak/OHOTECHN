import { apiClient } from './client';
import type { ApiResponse } from './types/common.types';

export type EmailCategory = 'TRANSACTIONAL' | 'MARKETING' | 'ANNOUNCEMENT';
export type EmailStatus = 'QUEUED' | 'PROCESSING' | 'SENT' | 'FAILED' | 'SUPPRESSED';

export interface EmailOutboxItem {
  id: number;
  recipient: string;
  subject: string;
  templateKey: string;
  category: EmailCategory;
  status: EmailStatus;
  attempts: number;
  maxAttempts: number;
  errorMessage?: string | null;
  providerMessageId?: string | null;
  idempotencyKey?: string | null;
  nextRetryAt?: string | null;
  sentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmailStats {
  total: number;
  queued: number;
  processing: number;
  sent: number;
  failed: number;
  suppressed: number;
}

export interface EmailSuppressionItem {
  id: number;
  email: string;
  reason: string;
  source: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const emailApi = {
  getEmails: async (params?: {
    status?: EmailStatus;
    category?: EmailCategory;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<EmailOutboxItem>>> => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.page !== undefined) query.append('page', params.page.toString());
    if (params?.size !== undefined) query.append('size', params.size.toString());

    const qs = query.toString();
    return apiClient<PageResponse<EmailOutboxItem>>(`/api/admin/emails${qs ? `?${qs}` : ''}`);
  },

  getEmailStats: async (): Promise<ApiResponse<EmailStats>> => {
    return apiClient<EmailStats>('/api/admin/emails/stats');
  },

  retryEmail: async (id: number): Promise<ApiResponse<EmailOutboxItem>> => {
    return apiClient<EmailOutboxItem>(`/api/admin/emails/${id}/retry`, {
      method: 'POST',
    });
  },

  getSuppressions: async (): Promise<ApiResponse<EmailSuppressionItem[]>> => {
    return apiClient<EmailSuppressionItem[]>('/api/admin/emails/suppressions');
  },

  addSuppression: async (data: { email: string; reason?: string }): Promise<ApiResponse<EmailSuppressionItem>> => {
    return apiClient<EmailSuppressionItem>('/api/admin/emails/suppressions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  removeSuppression: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    return apiClient<{ message: string }>(`/api/admin/emails/suppressions/${id}`, {
      method: 'DELETE',
    });
  },
};

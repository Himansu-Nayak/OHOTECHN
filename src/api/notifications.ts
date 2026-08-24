import { apiClient } from './client';
import { ApiResponse, NotificationDto, PageResponse } from './types';

export async function getNotificationsApi(unreadOnly = false, page = 0, size = 20): Promise<ApiResponse<PageResponse<NotificationDto>>> {
  return apiClient<PageResponse<NotificationDto>>(`/api/notifications?unreadOnly=${unreadOnly}&page=${page}&size=${size}`, {
    method: 'GET',
  });
}

export async function getUnreadNotificationCountApi(): Promise<ApiResponse<{ count: number }>> {
  return apiClient<{ count: number }>('/api/notifications/unread-count', {
    method: 'GET',
  });
}

export async function markNotificationAsReadApi(id: number): Promise<ApiResponse<NotificationDto>> {
  return apiClient<NotificationDto>(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

export async function markAllNotificationsAsReadApi(): Promise<ApiResponse<{ updatedCount: number }>> {
  return apiClient<{ updatedCount: number }>('/api/notifications/read-all', {
    method: 'PATCH',
  });
}

export async function deleteNotificationApi(id: number): Promise<ApiResponse<string>> {
  return apiClient<string>(`/api/notifications/${id}`, {
    method: 'DELETE',
  });
}

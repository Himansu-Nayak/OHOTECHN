import { ApiResponse } from './types';

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL !== undefined && process.env.NEXT_PUBLIC_API_URL !== '') {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    return '';
  }
  return 'http://127.0.0.1:8080';
}

export const API_BASE_URL = getApiBaseUrl();

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}

export function setTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }
}

export function clearTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<ApiResponse<T>> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle token refresh on 401 Unauthenticated
    if (response.status === 401 && !isRetry && typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData: ApiResponse<{ accessToken: string; refreshToken?: string }> = await refreshRes.json();
            if (refreshData.success && refreshData.data?.accessToken) {
              setTokens(refreshData.data.accessToken, refreshData.data.refreshToken);
              return apiClient<T>(endpoint, options, true);
            }
          }
        } catch (e) {
          clearTokens();
        }
      }
      clearTokens();
    }

    const data: ApiResponse<T> = await response.json().catch(() => ({
      success: response.ok,
      message: response.statusText || 'Response parsing error',
      data: null as unknown as T,
    }));

    if (!response.ok || !data.success) {
      throw new Error(data.message || `API Request failed with status ${response.status}`);
    }

    return data;
  } catch (error: any) {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error(`Backend server (${API_BASE_URL}) is offline or starting up. Please ensure Spring Boot is running.`);
    }
    throw new Error(error.message || 'Network error occurred. Please check your connection.');
  }
}

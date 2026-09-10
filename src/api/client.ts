import { ApiResponse } from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

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
      let errorMsg = data.message || `API Request failed with status ${response.status}`;
      if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
        const fieldErrors = Object.values(data.data).filter((v): v is string => typeof v === 'string');
        if (fieldErrors.length > 0) {
          errorMsg = fieldErrors.join('; ');
        }
      }
      throw new Error(errorMsg);
    }

    return data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const isNetworkError =
      error instanceof TypeError ||
      message === 'Failed to fetch' ||
      message.includes('fetch');

    if (isNetworkError) {
      throw new Error(`Backend server (${API_BASE_URL}) is offline or starting up. Please ensure Spring Boot is running.`);
    }
    throw new Error(message || 'Network error occurred. Please check your connection.');
  }
}

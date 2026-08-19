import { apiClient } from './client';
import { ApiResponse, AuthResponse, UserDto } from './types';

export interface LoginParams {
  username: string; // email or phone
  password?: string;
}

export interface RegisterParams {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: 'CUSTOMER' | 'ADMIN';
}

export async function loginApi(params: LoginParams): Promise<ApiResponse<AuthResponse>> {
  return apiClient<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function registerApi(params: RegisterParams): Promise<ApiResponse<AuthResponse>> {
  return apiClient<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function refreshTokenApi(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
  return apiClient<AuthResponse>('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export async function getCurrentUserApi(): Promise<ApiResponse<UserDto>> {
  return apiClient<UserDto>('/api/auth/me', {
    method: 'GET',
  });
}

export async function sendOtpApi(target: string, channel: string = 'PHONE'): Promise<ApiResponse<string>> {
  return apiClient<string>('/api/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ target, channel }),
  });
}

export async function verifyOtpApi(target: string, otpCode: string): Promise<ApiResponse<boolean>> {
  return apiClient<boolean>('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ target, otpCode }),
  });
}

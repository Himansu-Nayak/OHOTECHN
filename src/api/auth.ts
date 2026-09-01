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

export type OtpPurpose = 'EMAIL_VERIFICATION' | 'LOGIN' | 'PASSWORD_RESET';

export interface VerifyOtpResponseData {
  verified: boolean;
  resetToken?: string;
}

export async function loginApi(params: LoginParams): Promise<ApiResponse<AuthResponse>> {
  return apiClient<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function loginOtpApi(target: string, otpCode: string): Promise<ApiResponse<AuthResponse>> {
  return apiClient<AuthResponse>('/api/auth/login-otp', {
    method: 'POST',
    body: JSON.stringify({ target, otpCode, purpose: 'LOGIN' }),
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

export async function sendOtpApi(target: string, channel: string = 'EMAIL', purpose: OtpPurpose = 'EMAIL_VERIFICATION'): Promise<ApiResponse<string>> {
  return apiClient<string>('/api/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ target, channel, purpose }),
  });
}

export async function verifyOtpApi(target: string, otpCode: string, purpose: OtpPurpose = 'EMAIL_VERIFICATION'): Promise<ApiResponse<VerifyOtpResponseData>> {
  return apiClient<VerifyOtpResponseData>('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ target, otpCode, purpose }),
  });
}

export async function verifyEmailOtpApi(target: string, otpCode: string): Promise<ApiResponse<boolean>> {
  return apiClient<boolean>('/api/auth/verify-email-otp', {
    method: 'POST',
    body: JSON.stringify({ target, otpCode, purpose: 'EMAIL_VERIFICATION' }),
  });
}

export async function forgotPasswordApi(target: string): Promise<ApiResponse<string>> {
  return apiClient<string>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ target, channel: 'EMAIL', purpose: 'PASSWORD_RESET' }),
  });
}

export async function verifyResetOtpApi(target: string, otpCode: string): Promise<ApiResponse<VerifyOtpResponseData>> {
  return apiClient<VerifyOtpResponseData>('/api/auth/verify-reset-otp', {
    method: 'POST',
    body: JSON.stringify({ target, otpCode, purpose: 'PASSWORD_RESET' }),
  });
}

export async function resetPasswordApi(email: string, resetToken: string, newPassword: string): Promise<ApiResponse<string>> {
  return apiClient<string>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, resetToken, newPassword }),
  });
}

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserDto, AuthResponse } from '../api/types';
import { loginApi, loginOtpApi, registerApi, getCurrentUserApi, firebaseLoginApi, LoginParams, RegisterParams } from '../api/auth';
import { getAccessToken, setTokens, clearTokens } from '../api/client';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface AuthContextType {
  user: UserDto | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (params: LoginParams) => Promise<AuthResponse>;
  loginOtp: (target: string, otpCode: string) => Promise<AuthResponse>;
  loginWithFirebase: (idToken: string) => Promise<AuthResponse>;
  register: (params: RegisterParams) => Promise<AuthResponse>;
  logout: () => void | Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

function isJwtExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonStr);
    if (typeof payload.exp === 'number') {
      return payload.exp * 1000 <= Date.now();
    }
    return false;
  } catch {
    return false;
  }
}

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token || isJwtExpired(token)) {
      if (token && isJwtExpired(token)) {
        clearTokens();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
      }
      setUser(null);
      setAccessToken(null);
      setIsLoading(false);
      return;
    }

    setAccessToken(token);

    // Warm-start cached user if token is mathematically unexpired
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch {
        // ignore parse errors
      }
    }

    try {
      const res = await getCurrentUserApi();
      if (res.success && res.data) {
        setUser(res.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } else {
        clearTokens();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
        setUser(null);
        setAccessToken(null);
      }
    } catch (error: any) {
      const isAuthError =
        error?.status === 401 ||
        error?.status === 403 ||
        error?.response?.status === 401 ||
        error?.response?.status === 403 ||
        String(error?.message).toLowerCase().includes('unauthorized') ||
        String(error?.message).toLowerCase().includes('forbidden') ||
        String(error?.message).toLowerCase().includes('invalid token') ||
        String(error?.message).toLowerCase().includes('expired');

      if (isAuthError) {
        console.warn('Session rejected by server (401/403/invalid), clearing local auth state.');
        clearTokens();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
        setUser(null);
        setAccessToken(null);
      } else {
        console.warn('Network connectivity issue while verifying session, using unexpired local cache:', error);
        if (typeof window !== 'undefined' && localStorage.getItem('user')) {
          try {
            setUser(JSON.parse(localStorage.getItem('user')!));
            setAccessToken(token);
          } catch {
            clearTokens();
            localStorage.removeItem('user');
            setUser(null);
            setAccessToken(null);
          }
        } else {
          clearTokens();
          setUser(null);
          setAccessToken(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (params: LoginParams): Promise<AuthResponse> => {
    const res = await loginApi(params);
    if (res.success && res.data) {
      const authData = res.data;
      setTokens(authData.accessToken, authData.refreshToken);
      setAccessToken(authData.accessToken);
      setUser(authData.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(authData.user));
      }
      return authData;
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const loginOtp = async (target: string, otpCode: string): Promise<AuthResponse> => {
    const res = await loginOtpApi(target, otpCode);
    if (res.success && res.data) {
      const authData = res.data;
      setTokens(authData.accessToken, authData.refreshToken);
      setAccessToken(authData.accessToken);
      setUser(authData.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(authData.user));
      }
      return authData;
    } else {
      throw new Error(res.message || 'OTP Login failed');
    }
  };

  const loginWithFirebase = async (idToken: string): Promise<AuthResponse> => {
    const res = await firebaseLoginApi(idToken);
    if (res.success && res.data) {
      const authData = res.data;
      setTokens(authData.accessToken, authData.refreshToken);
      setAccessToken(authData.accessToken);
      setUser(authData.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(authData.user));
      }
      return authData;
    } else {
      throw new Error(res.message || 'Firebase login failed');
    }
  };

  const register = async (params: RegisterParams): Promise<AuthResponse> => {
    const res = await registerApi(params);
    if (res.success && res.data) {
      const authData = res.data;
      if (authData.accessToken) {
        setTokens(authData.accessToken, authData.refreshToken);
        setAccessToken(authData.accessToken);
        setUser(authData.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(authData.user));
        }
      }
      return authData;
    } else {
      throw new Error(res.message || 'Registration failed');
    }
  };

  const logout = useCallback(async () => {
    try {
      if (auth?.currentUser) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn('Firebase signOut error:', e);
    }
    clearTokens();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    setUser(null);
    setAccessToken(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        loginOtp,
        loginWithFirebase,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

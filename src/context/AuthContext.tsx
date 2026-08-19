'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserDto, AuthResponse } from '../api/types';
import { loginApi, registerApi, getCurrentUserApi, LoginParams, RegisterParams } from '../api/auth';
import { getAccessToken, setTokens, clearTokens } from '../api/client';

interface AuthContextType {
  user: UserDto | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (params: LoginParams) => Promise<AuthResponse>;
  register: (params: RegisterParams) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setAccessToken(null);
      setIsLoading(false);
      return;
    }

    setAccessToken(token);

    try {
      const res = await getCurrentUserApi();
      if (res.success && res.data) {
        setUser(res.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } else {
        clearTokens();
        setUser(null);
        setAccessToken(null);
      }
    } catch (error) {
      console.warn('Failed to verify token on startup:', error);
      clearTokens();
      setUser(null);
      setAccessToken(null);
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

  const register = async (params: RegisterParams): Promise<AuthResponse> => {
    const res = await registerApi(params);
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
      throw new Error(res.message || 'Registration failed');
    }
  };

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setAccessToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
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

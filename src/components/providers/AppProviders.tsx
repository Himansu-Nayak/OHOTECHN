'use client';

import React from 'react';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import { MagneticCursor } from '@/components/ui/MagneticCursor';
import { AwwwardsBadge } from '@/components/ui/AwwwardsBadge';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <SmoothScrollProvider>
            <MagneticCursor />
            <AwwwardsBadge />
            {children}
          </SmoothScrollProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}


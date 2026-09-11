'use client';

import React from 'react';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import { AwwwardsBadge } from '@/components/ui/AwwwardsBadge';
import { SiteIntroLoader } from '@/components/ui/SiteIntroLoader';
import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { PageTransitionOverlay } from '@/components/ui/PageTransitionOverlay';
import { LiveSystemStatusDock } from '@/components/ui/LiveSystemStatusDock';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <SmoothScrollProvider>
            <SiteIntroLoader />
            <PageTransitionOverlay />
            <NoiseOverlay />
            <AwwwardsBadge />
            <LiveSystemStatusDock />
            {children}
          </SmoothScrollProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}


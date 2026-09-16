'use client';

import React, { Suspense } from 'react';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { NavigationProgress } from '@/components/ui/NavigationProgress';
import { PageTransitionOverlay } from '@/components/motion/PageTransitionOverlay';
import { ScrollProvider } from './ScrollProvider';
import { ExperienceProvider } from '@/components/experience/ExperienceProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <ScrollProvider>
            <ExperienceProvider>
              <Suspense fallback={null}>
                <NavigationProgress />
              </Suspense>
              <PageTransitionOverlay />
              {children}
              <CustomCursor />
            </ExperienceProvider>
          </ScrollProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

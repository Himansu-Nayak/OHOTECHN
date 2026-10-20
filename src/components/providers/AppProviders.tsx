'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { Theme, LinkProvider } from '@astryxdesign/core';
import { ohotechTheme } from '@/theme/ohotechTheme';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { NavigationProgress } from '@/components/ui/NavigationProgress';
import { ScrollProvider } from './ScrollProvider';
import { ExperienceProvider } from '@/components/experience/ExperienceProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Theme theme={ohotechTheme}>
      <LinkProvider component={Link}>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <ScrollProvider>
                <ExperienceProvider>
                  <Suspense fallback={null}>
                    <NavigationProgress />
                  </Suspense>
                  {children}
                </ExperienceProvider>
              </ScrollProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </LinkProvider>
    </Theme>
  );
}

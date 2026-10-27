'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PageTransition } from '@/components/ui/PageTransition';
import { AIChatWidget } from '@/components/ai/AIChatWidget';

interface MarketingLayoutShellProps {
  children: React.ReactNode;
}

/**
 * MarketingLayoutShell selectively injects public website chrome (Header, Footer, AIChatWidget, pt-16/72px)
 * for standard marketing pages, while providing clean zero-padding, full-viewport isolation
 * for Admin, Developer, and Customer Dashboards.
 */
export function MarketingLayoutShell({ children }: MarketingLayoutShellProps) {
  const pathname = usePathname();

  const isDashboardRoute =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/developer') ||
    pathname?.startsWith('/dashboard');

  if (isDashboardRoute) {
    return (
      <main id="main-content" tabIndex={-1} className="min-h-screen w-full outline-none">
        {children}
      </main>
    );
  }

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 pt-16 lg:pt-[72px] outline-none">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <AIChatWidget />
    </>
  );
}

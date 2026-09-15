'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className={`page-enter-animation ${className}`}
    >
      {children}
    </div>
  );
}

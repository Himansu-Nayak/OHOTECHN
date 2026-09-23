'use client';

import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <div className={`transition-opacity duration-150 ${className}`}>
      {children}
    </div>
  );
}

'use client';

import React from 'react';

/**
 * MarketingTemplate
 * 
 * Lightweight, zero-delay route transition wrapper for marketing pages.
 * Applies a silky 200ms opacity fade on route change without blocking
 * navigation or user interactions.
 * 
 * Disabled automatically under prefers-reduced-motion via globals.css.
 */
export default function MarketingTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-in fade-in duration-200 ease-out will-change-[opacity]">
      {children}
    </div>
  );
}

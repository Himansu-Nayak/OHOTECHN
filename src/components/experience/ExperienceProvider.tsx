'use client';

import React from 'react';
import { MotionProvider } from './MotionContext';
import { GlobalCanvas } from './GlobalCanvas';

interface ExperienceProviderProps {
  children: React.ReactNode;
}

export function ExperienceProvider({ children }: ExperienceProviderProps) {
  return (
    <MotionProvider>
      {/* Deep Studio Backdrop Layer behind canvas */}
      <div className="fixed inset-0 bg-[#0a0a0b] -z-10 pointer-events-none" aria-hidden="true" />
      {/* Shared Global WebGL Visual Layer */}
      <GlobalCanvas />
      {/* Semantic DOM / Interactive Component Tree */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </MotionProvider>
  );
}

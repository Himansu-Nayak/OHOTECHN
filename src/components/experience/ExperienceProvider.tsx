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
      {/* Shared Global WebGL Visual Layer */}
      <GlobalCanvas />
      {/* Semantic DOM / Interactive Component Tree */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </MotionProvider>
  );
}

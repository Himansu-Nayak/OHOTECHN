'use client';

import React from 'react';
import { ScrollProvider, useLenis } from './ScrollProvider';

export { useLenis };

/**
 * Legacy compatibility alias for ScrollProvider
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return <ScrollProvider>{children}</ScrollProvider>;
}

export default SmoothScrollProvider;

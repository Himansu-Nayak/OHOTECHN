'use client';

import React from 'react';

/**
 * NoiseOverlay
 *
 * Subtle procedural SVG noise overlay that gives the dark glassmorphic studio
 * canvas tactile physical depth and warmth, identical to unitedcarriers.com.
 */
export function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9990] opacity-[0.035] mix-blend-overlay select-none"
      aria-hidden="true"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}

export default NoiseOverlay;

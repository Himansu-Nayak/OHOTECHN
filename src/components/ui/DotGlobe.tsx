'use client';

import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

export interface DotGlobeProps {
  /** Size of the globe in pixels (default: 320) */
  size?: number;
  /** Optional container class name */
  className?: string;
}

/**
 * DotGlobe
 *
 * Lightweight, high-performance canvas rotating dot-globe using COBE.
 * Styled in OHO TECH's emerald / slate / dark luxury palette.
 * Automatically cleans up WebGL context on unmount and respects reduced-motion.
 */
export function DotGlobe({ size = 320, className = '' }: DotGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let phi = 0;
    let width = 0;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const onResize = () => {
      if (canvas) {
        width = canvas.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    let animId: number;
    let globeInstance: ReturnType<typeof createGlobe> | null = null;

    try {
      const globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width: (width || size) * 2,
        height: (width || size) * 2,
        phi: 0,
        theta: 0.25,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 14000,
        mapBrightness: 5,
        baseColor: [0.08, 0.1, 0.14],
        markerColor: [0.06, 0.72, 0.5], // Emerald #10b981
        glowColor: [0.06, 0.72, 0.5],
        markers: [
          // Global tech hubs & data nodes
          { location: [20.5937, 78.9629], size: 0.08 },  // India HQ
          { location: [37.7749, -122.4194], size: 0.07 }, // San Francisco
          { location: [51.5074, -0.1278], size: 0.06 },  // London
          { location: [1.3521, 103.8198], size: 0.06 },  // Singapore
          { location: [25.2048, 55.2708], size: 0.06 },  // Dubai
          { location: [35.6762, 139.6503], size: 0.06 }, // Tokyo
        ],
      });
      globeInstance = globe;

      const animate = () => {
        if (!prefersReducedMotion) {
          phi += 0.005;
        }
        globe.update({
          phi: phi + pointerInteractionMovement.current,
          width: (width || size) * 2,
          height: (width || size) * 2,
        });
        animId = requestAnimationFrame(animate);
      };

      animate();
    } catch (e) {
      console.warn('Globe initialization failed:', e);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (animId) cancelAnimationFrame(animId);
      if (globeInstance) globeInstance.destroy();
    };
  }, [size]);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden aspect-square ${className}`}
      style={{ width: size, height: size, maxWidth: '100%' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          contain: 'layout paint size',
          opacity: 0.95,
        }}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.01;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta * 0.01;
          }
        }}
      />
    </div>
  );
}

export default DotGlobe;

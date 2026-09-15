'use client';

import React, { useRef, useState, useEffect } from 'react';
import { isReducedMotion } from '@/lib/motion';

interface MagneticCTAProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // Distance pull multiplier (default: 0.25)
  maxOffset?: number; // Maximum translation in px (default: 12)
}

export function MagneticCTA({
  children,
  className = '',
  strength = 0.25,
  maxOffset = 12,
}: MagneticCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion()) return;

    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      // Clamp to max offset to keep interaction subtle & non-jarring
      const clampedX = Math.max(-maxOffset, Math.min(maxOffset, deltaX));
      const clampedY = Math.max(-maxOffset, Math.min(maxOffset, deltaY));

      setOffset({ x: clampedX, y: clampedY });
    };

    const handleMouseEnter = () => {
      setHasInteracted(true);
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setOffset({ x: 0, y: 0 });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, maxOffset]);

  // Initial SSR & client hydration renders NO style attribute (deterministic match).
  // Once the user interacts on the client, dynamic transform styles are applied.
  const transformStyle = hasInteracted
    ? {
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: isHovered
          ? 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
      }
    : undefined;

  return (
    <div
      ref={containerRef}
      style={transformStyle}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

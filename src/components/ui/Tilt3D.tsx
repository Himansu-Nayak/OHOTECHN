'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface Tilt3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Maximum tilt angle in degrees during hover (default: 8) */
  maxTilt?: number;
  /** CSS perspective value in pixels (default: 1000) */
  perspective?: number;
  /** Scale factor on hover (default: 1.02) */
  scale?: number;
  /** Whether to animate in from a tilted perspective on scroll (default: true) */
  settleOnScroll?: boolean;
  /** Initial rotateX degrees when settling on scroll (default: 6) */
  initialRotateX?: number;
  /** Initial rotateY degrees when settling on scroll (default: -4) */
  initialRotateY?: number;
  /** Initial Y offset when settling on scroll (default: 24) */
  initialY?: number;
  /** ScrollTrigger start position (default: 'top 85%') */
  triggerStart?: string;
  className?: string;
}

/**
 * Tilt3D
 *
 * Provides a high-end 3D tilt effect:
 * 1. Settles from a tilted 3D entry angle into flat alignment on scroll.
 * 2. On desktop mouse movement, subtly tilts toward the cursor.
 * 3. Gracefully disables all 3D transforms under prefers-reduced-motion.
 */
export function Tilt3D({
  children,
  maxTilt = 8,
  perspective = 1000,
  scale = 1.02,
  settleOnScroll = true,
  initialRotateX = 6,
  initialRotateY = -4,
  initialY = 24,
  triggerStart = 'top 85%',
  className = '',
  style,
  ...props
}: Tilt3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(card, {
        transform: 'none',
        opacity: 1,
        clearProps: 'all',
      });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Scroll-settling entrance
      if (settleOnScroll) {
        gsap.fromTo(
          card,
          {
            rotateX: initialRotateX,
            rotateY: initialRotateY,
            y: initialY,
            opacity: 0.9,
            transformPerspective: perspective,
            transformOrigin: 'center center',
          },
          {
            rotateX: 0,
            rotateY: 0,
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: triggerStart,
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      }

      // 2. Mouse interactive micro-tilt (desktop only)
      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        gsap.to(card, {
          rotateX,
          rotateY,
          scale,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      // Only attach mouse listener if fine pointer (desktop mouse)
      const isFinePointer = window.matchMedia('(pointer: fine)').matches;
      if (isFinePointer) {
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);
      }

      return () => {
        if (isFinePointer) {
          container.removeEventListener('mousemove', handleMouseMove);
          container.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }, containerRef);

    return () => ctx.revert();
  }, [
    maxTilt,
    perspective,
    scale,
    settleOnScroll,
    initialRotateX,
    initialRotateY,
    initialY,
    triggerStart,
  ]);

  return (
    <div
      ref={containerRef}
      className={`perspective-1000 ${className}`}
      style={{ perspective: `${perspective}px`, ...style }}
      {...props}
    >
      <div
        ref={cardRef}
        className="w-full h-full preserve-3d transition-shadow will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </div>
  );
}

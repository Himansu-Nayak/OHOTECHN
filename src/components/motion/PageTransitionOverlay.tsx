'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface TransitionCoords {
  x: number;
  y: number;
  accent: string;
}

const ACCENT_COLORS: Record<string, string> = {
  '/work/healthcare-emr': '#10b981',
  '/work/education-erp': '#06b6d4',
  '/work/retail-pos': '#3b82f6',
  '/work/hospitality-erp': '#f59e0b',
  '/work': '#10b981',
  '/services': '#6366f1',
  '/technology': '#0ea5e9',
};

export function PageTransitionOverlay() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [coords, setCoords] = useState<TransitionCoords>({ x: 50, y: 50, accent: '#10b981' });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // When pathname changes, smoothly exit transition
    if (isTransitioning) {
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
        return;
      }

      // Check if it's an internal route navigation
      if (href.startsWith('/') && href !== pathname) {
        const clickX = (e.clientX / window.innerWidth) * 100;
        const clickY = (e.clientY / window.innerHeight) * 100;
        
        // Find matching accent color or default
        const matchedAccent = Object.entries(ACCENT_COLORS).find(([route]) => href.startsWith(route))?.[1] || '#10b981';

        setCoords({
          x: clickX,
          y: clickY,
          accent: matchedAccent
        });

        setIsTransitioning(true);

        // Fallback safety timeout if route takes longer
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setIsTransitioning(false);
        }, 1200);
      }
    };

    window.addEventListener('click', handleClick, { capture: true });
    return () => {
      window.removeEventListener('click', handleClick, { capture: true });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="organic-bloom-overlay"
          initial={{ clipPath: `circle(0% at ${coords.x}% ${coords.y}%)`, opacity: 0.95 }}
          animate={{ clipPath: `circle(150% at ${coords.x}% ${coords.y}%)`, opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9990] pointer-events-none flex items-center justify-center backdrop-blur-sm"
          style={{
            background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, ${coords.accent} 0%, #0a0a0b 70%)`
          }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-xs font-bold text-white uppercase tracking-widest px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/20"
          >
            OHO TECH // LOADING EXPERIENCE
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

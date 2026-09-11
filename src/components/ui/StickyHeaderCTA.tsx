'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, MessageSquare } from 'lucide-react';

/**
 * StickyHeaderCTA
 * 
 * Persistent enterprise action trigger accessible at all scroll depths.
 * Implemented independently of Header.tsx to maintain strict zero-diff invariant.
 */
export function StickyHeaderCTA() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal sticky state after scrolling past initial hero view (e.g. 200px)
      if (window.scrollY > 200) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      aria-label="Persistent Quick Project Action"
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 transition-all duration-500 ${
        isScrolled
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      }`}
    >
      <Link
        href="/get-quote"
        className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-black uppercase tracking-wider transition-all shadow-[0_10px_35px_rgba(16,185,129,0.35)] hover:shadow-[0_15px_45px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 group cursor-pointer border border-emerald-300/40"
      >
        <span className="w-2 h-2 rounded-full bg-black animate-ping shrink-0" />
        <span className="hidden sm:inline">Work With Us //</span>
        <span>Request Blueprint</span>
        <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}

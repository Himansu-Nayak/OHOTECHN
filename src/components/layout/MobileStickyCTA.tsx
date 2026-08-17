'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA when scrolled past hero (> 350px)
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 z-40 lg:hidden pointer-events-none transition-all duration-300 animate-in slide-in-from-bottom-5">
      <div className="max-w-md mx-auto pointer-events-auto bg-[#0d0d0e]/95 backdrop-blur-xl border border-white/20 rounded-full p-2 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-between gap-3 text-white">
        <div className="pl-4 font-mono text-xs font-bold truncate">
          <span className="text-emerald-400">OHO TECH</span> Solutions
        </div>

        <Link
          id="mobile-sticky-quote"
          href="/get-quote"
          className="min-h-[44px] px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 shrink-0"
        >
          <span>Get a Quote</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

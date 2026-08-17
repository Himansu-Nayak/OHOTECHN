'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
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
    <div className="fixed bottom-4 inset-x-4 z-40 lg:hidden pointer-events-none transition-all duration-300">
      <div className="max-w-md mx-auto pointer-events-auto bg-[#090a0f]/95 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 shadow-xl flex items-center justify-between gap-3 text-white">
        <div className="pl-3 text-xs font-semibold truncate text-slate-200">
          OHO TECHN Solutions
        </div>

        <Link
          id="mobile-sticky-quote"
          href="/contact"
          className="min-h-[40px] px-5 py-2 rounded-md bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <span>Contact Us</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

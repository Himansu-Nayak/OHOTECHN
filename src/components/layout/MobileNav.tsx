'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mainNav, solutionsNav } from '@/config/navigation';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems?: any[];
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/80 shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center">
            <NextImage
              src="/OHO_TECH_LOGO.svg"
              alt="OHO TECHN Logo"
              width={125}
              height={34}
              priority
              style={{ width: 'auto', height: 'auto' }}
              className="h-7 w-auto object-contain"
            />
          </Link>

          <button
            id="mobile-nav-close"
            type="button"
            onClick={onClose}
            aria-label="Close Menu"
            className="w-10 h-10 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <nav className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Main Menu
            </div>
            {mainNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between px-3 py-3 rounded-lg text-base font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1">
              Key Solutions
            </div>
            <div className="grid grid-cols-1 gap-1">
              {solutionsNav.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="px-3 py-2 rounded-md text-xs font-medium text-slate-700 hover:text-teal-700 hover:bg-slate-50 block transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-5 border-t border-slate-200/80 bg-slate-50 shrink-0">
          <Link
            href="/contact"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-md bg-[#090a0f] hover:bg-slate-800 text-white text-sm font-semibold tracking-wide transition-colors"
          >
            Contact Our Team
          </Link>
        </div>
      </div>
    </>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CTAButton } from '../shared/CTAButton';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: any[];
}

export function MobileNav({ isOpen, onClose, navItems }: MobileNavProps) {
  const [openSection, setOpenSection] = React.useState<string | null>(null);

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

  const toggleSection = (label: string) => {
    setOpenSection(openSection === label ? null : label);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Slide-out panel */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-2xl font-bold text-dark" onClick={onClose}>
            <span className="text-accent">OHO</span> TECHN
          </Link>
          <button
            id="mobile-nav-close"
            onClick={onClose}
            className="p-2 -mr-2 text-slate-500 hover:text-dark transition-colors rounded-md"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          <nav className="flex flex-col gap-2">
            {navItems.map((item, index) => (
              <div key={index} className="flex flex-col">
                {item.children ? (
                  <>
                    <button
                      id={`mobile-nav-${item.label.toLowerCase()}`}
                      onClick={() => toggleSection(item.label)}
                      className="flex items-center justify-between py-3 text-lg font-medium text-dark hover:text-primary transition-colors"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          'w-5 h-5 transition-transform duration-200',
                          openSection === item.label ? 'rotate-180' : ''
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        'overflow-hidden transition-all duration-300 ease-in-out',
                        openSection === item.label ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      )}
                    >
                      <div className="flex flex-col gap-2 pl-4 py-2 border-l-2 border-slate-100 ml-2">
                        {item.children.map((child: any, childIdx: number) => (
                          <Link
                            key={childIdx}
                            href={child.href}
                            className="py-2 text-base text-slate-600 hover:text-primary transition-colors"
                            onClick={onClose}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="py-3 text-lg font-medium text-dark hover:text-primary transition-colors"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col gap-4 mt-auto">
          <CTAButton
            id="mobile-nav-demo"
            variant="outline"
            className="w-full justify-center border-primary text-primary hover:bg-primary/5"
            href="/demo"
            onClick={onClose}
          >
            Book a Demo
          </CTAButton>
          <CTAButton
            id="mobile-nav-start"
            variant="primary"
            className="w-full justify-center bg-primary hover:bg-primary/90 text-white"
            href="/start"
            onClick={onClose}
          >
            Get Started
          </CTAButton>
        </div>
      </div>
    </>
  );
}

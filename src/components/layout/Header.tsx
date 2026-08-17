'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Menu, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { solutionsNav, techServicesNav, growthServicesNav } from '@/config/navigation';
import { MobileNav } from './MobileNav';

export function Header() {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 transition-all duration-300 pointer-events-none">
        <header
          id="site-header"
          className={cn(
            'pointer-events-auto w-full transition-all duration-300 border-b',
            isScrolled
              ? 'bg-white/90 backdrop-blur-md border-slate-200/80 shadow-xs py-3'
              : 'bg-white/60 backdrop-blur-xs border-transparent py-4'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
            
            {/* Logo */}
            <Link href="/" id="logo-link" className="flex items-center shrink-0 group">
              <NextImage
                src="/OHO_TECH_LOGO.svg"
                alt="OHO TECHN Logo"
                width={135}
                height={36}
                priority
                style={{ width: 'auto', height: 'auto' }}
                className="h-7 sm:h-8 w-auto object-contain transition-opacity group-hover:opacity-90"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
              
              {/* Solutions Dropdown */}
              <div
                className="relative group/solutions"
                onMouseEnter={() => setOpenDropdown('solutions')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="flex items-center gap-1 cursor-pointer py-1.5 hover:text-slate-950 transition-colors">
                  <Link href="/solutions" onClick={() => setOpenDropdown(null)}>
                    Solutions
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown('solutions');
                    }}
                    aria-label="Toggle Solutions Dropdown"
                    className="p-0.5 text-slate-400 hover:text-slate-900"
                  >
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === 'solutions' && "rotate-180")} />
                  </button>
                </div>

                <div
                  className={cn(
                    "absolute top-full left-0 pt-2 w-80 z-50 transition-all duration-150",
                    openDropdown === 'solutions' ? "block opacity-100 pointer-events-auto" : "hidden opacity-0 pointer-events-none"
                  )}
                >
                  <div className="bg-white border border-slate-200/90 rounded-xl shadow-lg p-3 grid grid-cols-1 gap-1">
                    {solutionsNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="p-2.5 rounded-lg hover:bg-slate-50 transition-colors group/item block"
                      >
                        <div className="text-xs font-semibold text-slate-900 group-hover/item:text-teal-700 transition-colors">
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Services Dropdown */}
              <div
                className="relative group/services"
                onMouseEnter={() => setOpenDropdown('services')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="flex items-center gap-1 cursor-pointer py-1.5 hover:text-slate-950 transition-colors">
                  <Link href="/services" onClick={() => setOpenDropdown(null)}>
                    Services
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown('services');
                    }}
                    aria-label="Toggle Services Dropdown"
                    className="p-0.5 text-slate-400 hover:text-slate-900"
                  >
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === 'services' && "rotate-180")} />
                  </button>
                </div>

                <div
                  className={cn(
                    "absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[480px] z-50 transition-all duration-150",
                    openDropdown === 'services' ? "block opacity-100 pointer-events-auto" : "hidden opacity-0 pointer-events-none"
                  )}
                >
                  <div className="bg-white border border-slate-200/90 rounded-xl shadow-lg p-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider px-2 mb-1.5">
                        Engineering Services
                      </div>
                      <div className="space-y-1">
                        {techServicesNav.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenDropdown(null)}
                            className="p-2 rounded-md hover:bg-slate-50 block transition-colors group/item"
                          >
                            <div className="text-xs font-semibold text-slate-900 group-hover/item:text-teal-700 transition-colors">
                              {item.name}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1.5">
                        Digital Strategy
                      </div>
                      <div className="space-y-1">
                        {growthServicesNav.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenDropdown(null)}
                            className="p-2 rounded-md hover:bg-slate-50 block transition-colors group/item"
                          >
                            <div className="text-xs font-semibold text-slate-900 group-hover/item:text-teal-700 transition-colors">
                              {item.name}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Industries */}
              <Link href="/solutions#industries" className="py-1.5 hover:text-slate-950 transition-colors">
                Industries
              </Link>

              {/* About */}
              <Link href="/about" className="py-1.5 hover:text-slate-950 transition-colors">
                About
              </Link>

              {/* Careers */}
              <Link href="/careers" className="py-1.5 hover:text-slate-950 transition-colors">
                Careers
              </Link>

            </nav>

            {/* Right Action */}
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#090a0f] hover:bg-slate-800 text-white font-medium text-xs tracking-wide transition-all shadow-xs"
              >
                Contact Us
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 text-slate-700 hover:text-slate-950 focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

          </div>
        </header>
      </div>

      <MobileNav isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
}

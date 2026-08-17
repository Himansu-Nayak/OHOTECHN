'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Menu, X, ChevronDown, Code2, TrendingUp, Sparkles, Building2, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { solutionsNav, techServicesNav, growthServicesNav, resourcesNav, companyNav } from '@/config/navigation';
import { MobileNav } from './MobileNav';

export function Header() {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  // Close dropdown on Escape key
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
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  return (
    <>
      {/* Floating Top Navigation Header Bar */}
      <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <header
          id="site-header"
          className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-full px-5 sm:px-7 py-2.5 flex items-center justify-between gap-6 max-w-6xl w-full transition-all duration-300"
        >
          {/* Logo */}
          <Link href="/" id="logo-link" className="flex items-center shrink-0 group py-0.5">
            <NextImage
              src="/OHO_TECH_LOGO.svg"
              alt="OHO TECH Logo"
              width={140}
              height={40}
              priority
              style={{ width: 'auto', height: 'auto' }}
              className="h-8 sm:h-10 max-h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links with Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-700">
            
            {/* 1. Solutions Dropdown */}
            <div
              className="relative group/solutions"
              onMouseEnter={() => setOpenDropdown('solutions')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div
                className={cn(
                  "flex items-center gap-1 px-3.5 py-1.5 rounded-full transition-all cursor-pointer",
                  openDropdown === 'solutions' ? "bg-slate-100 text-black font-extrabold" : "hover:bg-slate-50 hover:text-black"
                )}
              >
                <Link
                  href="/solutions"
                  onClick={() => setOpenDropdown(null)}
                  className="hover:text-sky-600 transition-colors"
                >
                  Solutions
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown('solutions');
                  }}
                  aria-label="Toggle Solutions Dropdown"
                  className="p-0.5 text-slate-400 hover:text-black transition-colors"
                >
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === 'solutions' && "rotate-180")} />
                </button>
              </div>

              {/* Seamless Hover Bridge Wrapper (pt-2 prevents mouse gap) */}
              <div
                className={cn(
                  "absolute top-full left-0 pt-2 w-80 z-50 transition-all duration-150",
                  openDropdown === 'solutions' ? "block opacity-100 pointer-events-auto" : "hidden opacity-0 pointer-events-none"
                )}
              >
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-4 grid grid-cols-1 gap-1">
                  <div className="text-[11px] font-mono font-bold text-sky-600 uppercase px-3 py-1 mb-1">
                    Solutions by Industry
                  </div>
                  {solutionsNav.slice(0, 6).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpenDropdown(null)}
                      className="p-2.5 rounded-xl hover:bg-sky-50 transition-colors group/item block"
                    >
                      <div className="text-xs font-bold text-[#0d0d0e] group-hover/item:text-sky-600 transition-colors">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</div>
                      )}
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-slate-100 mt-1">
                    <Link
                      href="/solutions"
                      onClick={() => setOpenDropdown(null)}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 px-3 py-1 block"
                    >
                      View All Industry Solutions →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Services Mega Dropdown */}
            <div
              className="relative group/services"
              onMouseEnter={() => setOpenDropdown('services')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div
                className={cn(
                  "flex items-center gap-1 px-3.5 py-1.5 rounded-full transition-all cursor-pointer",
                  openDropdown === 'services' ? "bg-slate-100 text-black font-extrabold" : "hover:bg-slate-50 hover:text-black"
                )}
              >
                <Link
                  href="/services"
                  onClick={() => setOpenDropdown(null)}
                  className="hover:text-sky-600 transition-colors"
                >
                  Services
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown('services');
                  }}
                  aria-label="Toggle Services Dropdown"
                  className="p-0.5 text-slate-400 hover:text-black transition-colors"
                >
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === 'services' && "rotate-180")} />
                </button>
              </div>

              {/* Seamless Hover Bridge Wrapper (pt-2 prevents mouse gap) */}
              <div
                className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[560px] z-50 transition-all duration-150",
                  openDropdown === 'services' ? "block opacity-100 pointer-events-auto" : "hidden opacity-0 pointer-events-none"
                )}
              >
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-5 grid grid-cols-2 gap-6">
                  {/* Column 1: Tech Services */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-sky-600 uppercase px-2 mb-2">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Technology Services</span>
                    </div>
                    <div className="space-y-1">
                      {techServicesNav.slice(0, 5).map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className="p-2 rounded-lg hover:bg-sky-50 block transition-colors group/item"
                        >
                          <div className="text-xs font-bold text-[#0d0d0e] group-hover/item:text-sky-600 transition-colors">
                            {item.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Digital Growth */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-600 uppercase px-2 mb-2">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Digital Growth</span>
                    </div>
                    <div className="space-y-1">
                      {growthServicesNav.slice(0, 5).map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className="p-2 rounded-lg hover:bg-amber-50 block transition-colors group/item"
                        >
                          <div className="text-xs font-bold text-[#0d0d0e] group-hover/item:text-amber-600 transition-colors">
                            {item.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <Link href="/services" onClick={() => setOpenDropdown(null)} className="text-sky-600 hover:text-sky-700">
                      Explore All 15 Core Services →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Products Link */}
            <Link href="/products" className="px-3.5 py-1.5 rounded-full hover:bg-slate-50 hover:text-black transition-all">
              Products
            </Link>

            {/* 4. Resources Dropdown */}
            <div
              className="relative group/resources"
              onMouseEnter={() => setOpenDropdown('resources')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div
                className={cn(
                  "flex items-center gap-1 px-3.5 py-1.5 rounded-full transition-all cursor-pointer",
                  openDropdown === 'resources' ? "bg-slate-100 text-black font-extrabold" : "hover:bg-slate-50 hover:text-black"
                )}
              >
                <Link
                  href="/pricing"
                  onClick={() => setOpenDropdown(null)}
                  className="hover:text-sky-600 transition-colors"
                >
                  Resources
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown('resources');
                  }}
                  aria-label="Toggle Resources Dropdown"
                  className="p-0.5 text-slate-400 hover:text-black transition-colors"
                >
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === 'resources' && "rotate-180")} />
                </button>
              </div>

              {/* Seamless Hover Bridge Wrapper (pt-2 prevents mouse gap) */}
              <div
                className={cn(
                  "absolute top-full left-0 pt-2 w-64 z-50 transition-all duration-150",
                  openDropdown === 'resources' ? "block opacity-100 pointer-events-auto" : "hidden opacity-0 pointer-events-none"
                )}
              >
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-3 grid grid-cols-1 gap-1">
                  {resourcesNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpenDropdown(null)}
                      className="p-2.5 rounded-xl hover:bg-sky-50 transition-colors group/item block"
                    >
                      <div className="text-xs font-bold text-[#0d0d0e] group-hover/item:text-sky-600 transition-colors">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Company Dropdown */}
            <div
              className="relative group/company"
              onMouseEnter={() => setOpenDropdown('company')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div
                className={cn(
                  "flex items-center gap-1 px-3.5 py-1.5 rounded-full transition-all cursor-pointer",
                  openDropdown === 'company' ? "bg-slate-100 text-black font-extrabold" : "hover:bg-slate-50 hover:text-black"
                )}
              >
                <Link
                  href="/about"
                  onClick={() => setOpenDropdown(null)}
                  className="hover:text-sky-600 transition-colors"
                >
                  Company
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown('company');
                  }}
                  aria-label="Toggle Company Dropdown"
                  className="p-0.5 text-slate-400 hover:text-black transition-colors"
                >
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === 'company' && "rotate-180")} />
                </button>
              </div>

              {/* Seamless Hover Bridge Wrapper (pt-2 prevents mouse gap) */}
              <div
                className={cn(
                  "absolute top-full right-0 pt-2 w-64 z-50 transition-all duration-150",
                  openDropdown === 'company' ? "block opacity-100 pointer-events-auto" : "hidden opacity-0 pointer-events-none"
                )}
              >
                <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-3 grid grid-cols-1 gap-1">
                  {companyNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpenDropdown(null)}
                      className="p-2.5 rounded-xl hover:bg-sky-50 transition-colors group/item block"
                    >
                      <div className="text-xs font-bold text-[#0d0d0e] group-hover/item:text-sky-600 transition-colors">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </nav>

          {/* Right Dual Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/get-quote"
              className="hidden sm:inline-flex px-4 py-2 rounded-full border border-slate-300 hover:border-black text-[#0d0d0e] font-extrabold text-xs tracking-tight transition-all"
            >
              Get a Quote
            </Link>

            <Link
              href="/book-demo"
              className="px-5 py-2 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs tracking-tight transition-all shadow-sm whitespace-nowrap"
            >
              Book a Demo
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-1.5 text-slate-800 hover:text-[#0d0d0e] ml-1"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </header>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <>
      {/* ── Perfectly Proportioned Floating Top Pill Navigation Bar ── */}
      <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <header
          id="site-header"
          className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-full px-5 sm:px-7 py-2 flex items-center justify-between gap-6 sm:gap-8 transition-all duration-300 max-w-4xl w-full"
        >
          {/* Official OHO TECH Logo - Ultra Sharp Vector SVG */}
          <Link href="/" id="logo-link" className="flex items-center shrink-0 group py-0.5">
            <img
              src="/OHO_TECH_LOGO.svg"
              alt="OHO TECH Logo"
              className="h-9 sm:h-11 md:h-12 max-h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-extrabold tracking-tight text-slate-700">
            <Link href="#work" className="hover:text-[#0d0d0e] transition-colors">
              Work
            </Link>
            <Link href="/solutions" className="hover:text-[#0d0d0e] transition-colors">
              Solutions
            </Link>
            <Link href="/services" className="hover:text-[#0d0d0e] transition-colors">
              Services
            </Link>
            <Link href="#about" className="hover:text-[#0d0d0e] transition-colors">
              About
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-2.5">
            <Link
              id="header-book-call"
              href="/book-demo"
              className="px-5 py-2 sm:px-6 sm:py-2 rounded-full bg-[#0d0d0e] hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm tracking-tight transition-all shadow-sm whitespace-nowrap"
            >
              Book a call
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-toggle"
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-1.5 text-slate-800 hover:text-[#0d0d0e]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>
      </div>

      {/* ── Fixed Floating Asterisk Button (*) on Right Screen Edge ── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <Link
          href="/book-demo"
          id="floating-asterisk-cta"
          aria-label="Book a call"
          className="w-12 h-12 rounded-full bg-[#fcd34d] text-slate-950 border border-black/10 shadow-xl flex items-center justify-center font-extrabold text-2xl hover:scale-110 hover:rotate-90 transition-all duration-300 group"
        >
          <span className="group-hover:rotate-180 transition-transform">✳</span>
        </Link>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed inset-0 z-[60] md:hidden transition-all duration-300',
          isMobileOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        )}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
        <div className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-white p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <img
                src="/OHO_TECH_LOGO.svg"
                alt="OHO TECH Logo"
                className="h-10 max-h-10 w-auto object-contain"
              />
              <button onClick={() => setIsMobileOpen(false)} className="p-1 text-slate-400 hover:text-[#0d0d0e]">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="py-6 space-y-4 flex flex-col text-sm font-bold text-slate-700">
              <Link href="#work" onClick={() => setIsMobileOpen(false)} className="hover:text-[#0d0d0e]">Work & Products</Link>
              <Link href="/solutions" onClick={() => setIsMobileOpen(false)} className="hover:text-[#0d0d0e]">Solutions (13 Verticals)</Link>
              <Link href="/services" onClick={() => setIsMobileOpen(false)} className="hover:text-[#0d0d0e]">Services (15 Offerings)</Link>
              <Link href="/pricing" onClick={() => setIsMobileOpen(false)} className="hover:text-[#0d0d0e]">Pricing</Link>
              <Link href="#about" onClick={() => setIsMobileOpen(false)} className="hover:text-[#0d0d0e]">About</Link>
            </div>
          </div>
          <div className="space-y-3">
            <Link
              href="/book-demo"
              onClick={() => setIsMobileOpen(false)}
              className="block w-full py-3 rounded-full bg-[#0d0d0e] text-white font-extrabold text-xs text-center uppercase tracking-wider shadow-md"
            >
              Book a call
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

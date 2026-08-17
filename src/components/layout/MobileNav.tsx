'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { X, ChevronDown, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { solutionsNav, techServicesNav, growthServicesNav, companyNav, legalNav } from '@/config/navigation';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [openCategory, setOpenCategory] = React.useState<string | null>(null);

  // Lock body scroll when open
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

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleCategory = (category: string) => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Navigation Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center">
            <NextImage
              src="/OHO_TECH_LOGO.svg"
              alt="OHO TECH Logo"
              width={130}
              height={36}
              priority
              style={{ width: 'auto', height: 'auto' }}
              className="h-8 w-auto object-contain"
            />
          </Link>

          <button
            id="mobile-nav-close"
            type="button"
            onClick={onClose}
            aria-label="Close Navigation Menu"
            className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 selection:bg-emerald-500 selection:text-white">
          
          <nav className="space-y-1.5 font-sans" aria-label="Mobile Navigation">
            
            {/* 1. Solutions Accordion */}
            <div className="border-b border-slate-100 pb-2">
              <button
                type="button"
                id="accordion-solutions-trigger"
                aria-expanded={openCategory === 'solutions'}
                aria-controls="accordion-solutions-content"
                onClick={() => toggleCategory('solutions')}
                className="w-full min-h-[48px] py-3 px-3 rounded-2xl flex items-center justify-between text-base font-bold text-[#0d0d0e] hover:bg-slate-50 transition-colors text-left"
              >
                <span>Solutions</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-slate-400 transition-transform duration-200',
                    openCategory === 'solutions' && 'rotate-180 text-emerald-600'
                  )}
                />
              </button>

              {openCategory === 'solutions' && (
                <div id="accordion-solutions-content" className="pt-2 pb-3 px-3 space-y-1 bg-slate-50/70 rounded-2xl my-1 border border-slate-100">
                  <div className="text-[11px] font-mono font-bold text-emerald-600 uppercase tracking-wider px-2 py-1">
                    Industry Solutions
                  </div>
                  {solutionsNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="block py-2 px-3 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-white rounded-xl transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <Link
                      href="/solutions"
                      onClick={onClose}
                      className="inline-flex items-center gap-1 py-1.5 px-3 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      <span>Explore All Solutions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Services Accordion */}
            <div className="border-b border-slate-100 pb-2">
              <button
                type="button"
                id="accordion-services-trigger"
                aria-expanded={openCategory === 'services'}
                aria-controls="accordion-services-content"
                onClick={() => toggleCategory('services')}
                className="w-full min-h-[48px] py-3 px-3 rounded-2xl flex items-center justify-between text-base font-bold text-[#0d0d0e] hover:bg-slate-50 transition-colors text-left"
              >
                <span>Services</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-slate-400 transition-transform duration-200',
                    openCategory === 'services' && 'rotate-180 text-emerald-600'
                  )}
                />
              </button>

              {openCategory === 'services' && (
                <div id="accordion-services-content" className="pt-2 pb-3 px-3 space-y-2 bg-slate-50/70 rounded-2xl my-1 border border-slate-100">
                  <div>
                    <div className="text-[11px] font-mono font-bold text-emerald-600 uppercase tracking-wider px-2 py-1">
                      Technology Services
                    </div>
                    {techServicesNav.slice(0, 6).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className="block py-2 px-3 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-white rounded-xl transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <div className="text-[11px] font-mono font-bold text-amber-600 uppercase tracking-wider px-2 py-1">
                      Digital Growth &amp; Marketing
                    </div>
                    {growthServicesNav.slice(0, 5).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className="block py-2 px-3 text-xs font-semibold text-slate-700 hover:text-amber-600 hover:bg-white rounded-xl transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <Link
                      href="/services"
                      onClick={onClose}
                      className="inline-flex items-center gap-1 py-1.5 px-3 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                    >
                      <span>View All Services</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Products Link */}
            <div className="border-b border-slate-100 pb-2">
              <Link
                href="/products"
                onClick={onClose}
                className="block min-h-[48px] py-3 px-3 rounded-2xl text-base font-bold text-[#0d0d0e] hover:bg-slate-50 transition-colors"
              >
                Products
              </Link>
            </div>

            {/* 4. Resources Accordion */}
            <div className="border-b border-slate-100 pb-2">
              <button
                type="button"
                id="accordion-resources-trigger"
                aria-expanded={openCategory === 'resources'}
                aria-controls="accordion-resources-content"
                onClick={() => toggleCategory('resources')}
                className="w-full min-h-[48px] py-3 px-3 rounded-2xl flex items-center justify-between text-base font-bold text-[#0d0d0e] hover:bg-slate-50 transition-colors text-left"
              >
                <span>Resources</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-slate-400 transition-transform duration-200',
                    openCategory === 'resources' && 'rotate-180 text-emerald-600'
                  )}
                />
              </button>

              {openCategory === 'resources' && (
                <div id="accordion-resources-content" className="pt-2 pb-3 px-3 space-y-1 bg-slate-50/70 rounded-2xl my-1 border border-slate-100">
                  <Link
                    href="/pricing"
                    onClick={onClose}
                    className="block py-2 px-3 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-white rounded-xl transition-colors"
                  >
                    Pricing &amp; Engagement Models
                  </Link>
                  <Link
                    href="/case-studies"
                    onClick={onClose}
                    className="block py-2 px-3 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-white rounded-xl transition-colors"
                  >
                    Case Studies &amp; Projects
                  </Link>
                  <Link
                    href="/resources/blog"
                    onClick={onClose}
                    className="block py-2 px-3 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-white rounded-xl transition-colors"
                  >
                    Engineering &amp; Growth Blog
                  </Link>
                </div>
              )}
            </div>

            {/* 5. Company Accordion */}
            <div className="border-b border-slate-100 pb-2">
              <button
                type="button"
                id="accordion-company-trigger"
                aria-expanded={openCategory === 'company'}
                aria-controls="accordion-company-content"
                onClick={() => toggleCategory('company')}
                className="w-full min-h-[48px] py-3 px-3 rounded-2xl flex items-center justify-between text-base font-bold text-[#0d0d0e] hover:bg-slate-50 transition-colors text-left"
              >
                <span>Company</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-slate-400 transition-transform duration-200',
                    openCategory === 'company' && 'rotate-180 text-emerald-600'
                  )}
                />
              </button>

              {openCategory === 'company' && (
                <div id="accordion-company-content" className="pt-2 pb-3 px-3 space-y-1 bg-slate-50/70 rounded-2xl my-1 border border-slate-100">
                  {companyNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="block py-2 px-3 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-white rounded-xl transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Navigation Links */}
            <div className="pt-2 space-y-1">
              <Link
                href="/careers"
                onClick={onClose}
                className="block py-2.5 px-3 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
              >
                Careers 🚀
              </Link>
              <Link
                href="/partner"
                onClick={onClose}
                className="block py-2.5 px-3 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
              >
                Partner With Us 🤝
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="block py-2.5 px-3 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
              >
                Contact Us ✉️
              </Link>
              <Link
                href="/privacy-policy"
                onClick={onClose}
                className="block py-2.5 px-3 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                Policies &amp; Legal
              </Link>
            </div>

          </nav>

          {/* Social Links Section */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">
              Follow OHO TECH
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OHO TECH on LinkedIn"
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
              )}

              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OHO TECH on Instagram"
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2 stroke-round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}

              {siteConfig.social.twitter && (
                <a
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OHO TECH on X (Twitter)"
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}

              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OHO TECH on Facebook"
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}

              {siteConfig.social.youtube && (
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OHO TECH on YouTube"
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Drawer Bottom Dual CTAs */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex flex-col gap-3 shrink-0">
          <Link
            id="mobile-nav-get-quote"
            href="/get-quote"
            onClick={onClose}
            className="w-full min-h-[48px] rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Get a Quote</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>

          <Link
            id="mobile-nav-book-demo"
            href="/book-demo"
            onClick={onClose}
            className="w-full min-h-[48px] rounded-full bg-white hover:bg-slate-100 text-[#0d0d0e] border border-slate-300 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center transition-all"
          >
            <span>Book a Demo</span>
          </Link>
        </div>

      </div>
    </>
  );
}

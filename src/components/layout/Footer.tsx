'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { solutionsNav, techServicesNav, growthServicesNav, companyNav, legalNav } from '@/config/navigation';

export default function Footer() {
  const [openSection, setOpenSection] = React.useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <footer className="bg-[#07080c] text-slate-400 border-t border-white/10 pt-12 sm:pt-16 pb-12 font-sans text-xs selection:bg-emerald-500 selection:text-white">
      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-10 lg:px-16">
        
        {/* Main Grid: Responsive 1-Column with Accordions on Mobile, 5-Column Grid on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">
          
          {/* Column 1: OHO TECH Brand & Social Links */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <NextImage
                src="/OHO_TECH_LOGO.svg"
                alt="OHO TECH Logo"
                width={140}
                height={40}
                style={{ width: 'auto', height: 'auto' }}
                className="h-9 sm:h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-2.5 text-slate-400">
              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OHO TECH on LinkedIn"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
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
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
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
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
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
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
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
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Solutions Accordion (Mobile) / Expanded (Desktop) */}
          <div className="border-b md:border-b-0 border-white/10 pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('solutions')}
              aria-expanded={openSection === 'solutions'}
              aria-controls="footer-solutions-content"
              className="w-full flex items-center justify-between py-2 text-xs font-mono font-bold text-white uppercase tracking-wider md:cursor-default"
            >
              <span>Solutions</span>
              <ChevronDown className={cn("w-4 h-4 text-slate-400 md:hidden transition-transform duration-200", openSection === 'solutions' && "rotate-180 text-emerald-400")} />
            </button>

            <div id="footer-solutions-content" className={cn("mt-3 md:block space-y-2.5", openSection === 'solutions' ? "block" : "hidden md:block")}>
              <ul className="space-y-2.5">
                {solutionsNav.slice(0, 6).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-white transition-colors py-1 block">
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/solutions" className="text-emerald-400 font-bold hover:underline py-1 block">
                    View All Solutions →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Services Accordion (Mobile) / Expanded (Desktop) */}
          <div className="border-b md:border-b-0 border-white/10 pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('services')}
              aria-expanded={openSection === 'services'}
              aria-controls="footer-services-content"
              className="w-full flex items-center justify-between py-2 text-xs font-mono font-bold text-white uppercase tracking-wider md:cursor-default"
            >
              <span>Services</span>
              <ChevronDown className={cn("w-4 h-4 text-slate-400 md:hidden transition-transform duration-200", openSection === 'services' && "rotate-180 text-emerald-400")} />
            </button>

            <div id="footer-services-content" className={cn("mt-3 md:block space-y-2.5", openSection === 'services' ? "block" : "hidden md:block")}>
              <ul className="space-y-2.5">
                {techServicesNav.slice(0, 4).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-white transition-colors py-1 block">
                      {item.name}
                    </Link>
                  </li>
                ))}
                {growthServicesNav.slice(0, 3).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-white transition-colors py-1 block">
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/services" className="text-emerald-400 font-bold hover:underline py-1 block">
                    View All Services →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 4: Company Accordion (Mobile) / Expanded (Desktop) */}
          <div className="border-b md:border-b-0 border-white/10 pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('company')}
              aria-expanded={openSection === 'company'}
              aria-controls="footer-company-content"
              className="w-full flex items-center justify-between py-2 text-xs font-mono font-bold text-white uppercase tracking-wider md:cursor-default"
            >
              <span>Company</span>
              <ChevronDown className={cn("w-4 h-4 text-slate-400 md:hidden transition-transform duration-200", openSection === 'company' && "rotate-180 text-emerald-400")} />
            </button>

            <div id="footer-company-content" className={cn("mt-3 md:block space-y-2.5", openSection === 'company' ? "block" : "hidden md:block")}>
              <ul className="space-y-2.5">
                {companyNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-white transition-colors py-1 block">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 5: Legal Accordion (Mobile) / Expanded (Desktop) */}
          <div className="border-b md:border-b-0 border-white/10 pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection('legal')}
              aria-expanded={openSection === 'legal'}
              aria-controls="footer-legal-content"
              className="w-full flex items-center justify-between py-2 text-xs font-mono font-bold text-white uppercase tracking-wider md:cursor-default"
            >
              <span>Legal &amp; Policies</span>
              <ChevronDown className={cn("w-4 h-4 text-slate-400 md:hidden transition-transform duration-200", openSection === 'legal' && "rotate-180 text-emerald-400")} />
            </button>

            <div id="footer-legal-content" className={cn("mt-3 md:block space-y-2.5", openSection === 'legal' ? "block" : "hidden md:block")}>
              <ul className="space-y-2.5">
                {legalNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-white transition-colors py-1 block">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Legal Links Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} OHO TECH. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-300 py-1">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-slate-300 py-1">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-slate-300 py-1">Cookie Policy</Link>
            <Link href="/disclaimer" className="hover:text-slate-300 py-1">Disclaimer</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

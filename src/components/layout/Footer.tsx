'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { siteConfig } from '@/config/site';
import { solutionsNav, techServicesNav, companyNav, legalNav } from '@/config/navigation';

export default function Footer() {
  return (
    <footer className="bg-[#090a0f] text-slate-400 border-t border-slate-800/80 pt-16 pb-12 font-sans text-xs selection:bg-teal-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <NextImage
                src="/OHO_TECH_LOGO.svg"
                alt="OHO TECHN Logo"
                width={130}
                height={34}
                style={{ width: 'auto', height: 'auto' }}
                className="h-8 w-auto object-contain brightness-0 invert opacity-95"
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              OHO TECHN delivers technology, infrastructure, and digital solutions that help businesses operate smarter, faster, and more efficiently.
            </p>
            <div className="text-[11px] text-slate-500 space-y-1 pt-2">
              <p>Registered Office: {siteConfig.contact.address}</p>
              <p>Corporate Contact: {siteConfig.contact.email}</p>
            </div>
          </div>

          {/* Solutions Col */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Solutions
            </div>
            <ul className="space-y-2">
              {solutionsNav.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Col */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Services
            </div>
            <ul className="space-y-2">
              {techServicesNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal Col */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Company
            </div>
            <ul className="space-y-2">
              {companyNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} OHO TECHN. All rights reserved. Built for real-world impact.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-slate-300 transition-colors">
                {item.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

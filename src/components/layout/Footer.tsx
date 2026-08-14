'use client';

import Link from 'next/link';
import NextImage from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#07080c] text-slate-400 py-16 border-t border-white/10 font-mono text-xs">
      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="/OHO_TECH_LOGO.svg"
            alt="OHO TECH Logo"
            className="h-10 w-auto object-contain brightness-0 invert"
          />
          <span className="text-slate-500">© {new Date().getFullYear()} OHO TECH Studio. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <Link href="/solutions" className="hover:text-white transition-colors">Solutions</Link>
          <Link href="/services" className="hover:text-white transition-colors">Services</Link>
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/book-demo" className="hover:text-white transition-colors">Book a Call</Link>
        </div>
      </div>
    </footer>
  );
}

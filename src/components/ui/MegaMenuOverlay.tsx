'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  X, 
  ArrowRight, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles 
} from 'lucide-react';
import gsap from 'gsap';
import { solutionsNav, techServicesNav, companyNav } from '@/config/navigation';

export function MegaMenuOverlay() {
  const [isOpen, setIsOpen] = React.useState(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const curtainRef = React.useRef<HTMLDivElement>(null);

  // Open / Close listener hooked to existing header hamburger button without touching Header.tsx
  React.useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const menuBtn = target.closest('button[aria-label="Open navigation menu"]');
      if (menuBtn) {
        // Prevent default drawer and trigger fullscreen mega-menu
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('open-mega-menu', handleCustomOpen);

    return () => {
      window.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('open-mega-menu', handleCustomOpen);
    };
  }, []);

  // Keyboard Escape listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // GSAP Curtain Wipe Animation on Open/Close
  React.useEffect(() => {
    const overlay = overlayRef.current;
    const curtain = curtainRef.current;
    const content = contentRef.current;
    if (!overlay || !curtain || !content) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isOpen) {
      if (prefersReducedMotion) {
        gsap.set(overlay, { display: 'flex', opacity: 1, pointerEvents: 'auto' });
        gsap.set(curtain, { scaleY: 1 });
        gsap.set(content, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.set(overlay, { display: 'flex', pointerEvents: 'auto' })
        .set(curtain, { scaleY: 0, transformOrigin: 'top center' })
        .set(content, { opacity: 0, y: 30 })
        .to(curtain, {
          scaleY: 1,
          duration: 0.45,
          ease: 'power4.inOut',
        })
        .to(content, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power3.out',
        }, '-=0.15');

      return () => {
        tl.kill();
      };
    } else {
      if (prefersReducedMotion) {
        gsap.set(overlay, { display: 'none', opacity: 0, pointerEvents: 'none' });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power4.in' } });
      tl.to(content, {
        opacity: 0,
        y: -20,
        duration: 0.2,
      })
      .to(curtain, {
        scaleY: 0,
        transformOrigin: 'bottom center',
        duration: 0.35,
        ease: 'power4.inOut',
      }, '-=0.05')
      .set(overlay, { display: 'none', pointerEvents: 'none' });

      return () => {
        tl.kill();
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div
      ref={overlayRef}
      aria-modal="true"
      role="dialog"
      aria-label="Full-Screen Navigation Mega Menu"
      className="fixed inset-0 z-[99999] hidden flex-col justify-between bg-transparent text-white overflow-hidden pointer-events-none"
    >
      {/* Background Curtain / Wipe Layer */}
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-[#0a0a0b] border-b border-white/10"
        style={{ transform: 'scaleY(0)' }}
      />

      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Content Area */}
      <div
        ref={contentRef}
        className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto max-w-7xl mx-auto opacity-0"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs font-bold tracking-[0.25em] text-emerald-400 uppercase">
              OHO TECH // NAVIGATION MATRIX
            </span>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close mega navigation menu"
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-emerald-500 hover:text-black border border-white/15 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer group"
          >
            <span>CLOSE [ESC]</span>
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Middle Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-14 py-8 sm:py-12 my-auto">
          
          {/* Main Direct Route Links */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase block mb-4">
              01 // CORE NAVIGATION
            </span>
            <nav className="flex flex-col space-y-2 text-2xl sm:text-4xl font-black uppercase tracking-tight">
              {[
                { name: 'Home', href: '/' },
                { name: 'Solutions', href: '/solutions' },
                { name: 'Services', href: '/services' },
                { name: 'Products & Platforms', href: '/products' },
                { name: 'Pricing & Tiers', href: '/pricing' },
                { name: 'Company About', href: '/about' },
                { name: 'Developer Portal', href: '/developer' },
                { name: 'Get a Quote', href: '/get-quote' },
              ].map((link, idx) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleClose}
                  className="text-white hover:text-emerald-400 transition-colors flex items-center justify-between group py-1 border-b border-white/5"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-400" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Industry Solutions & Tech Services Column */}
          <div className="md:col-span-4 space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-400 uppercase block mb-3">
                02 // FEATURED SERVICES
              </span>
              <div className="space-y-2">
                {techServicesNav.slice(0, 4).map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={handleClose}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 block transition-colors group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {s.name}
                    </div>
                    {s.description && (
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {s.description}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase block mb-3">
                03 // INDUSTRY BLUEPRINTS
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {solutionsNav.slice(0, 6).map((sol) => (
                  <Link
                    key={sol.href}
                    href={sol.href}
                    onClick={handleClose}
                    className="p-2 rounded-lg bg-white/[0.02] hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 transition-colors border border-white/5 truncate"
                  >
                    {sol.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Coordinates & System Telemetry Column */}
          <div className="md:col-span-3 space-y-6 border-l border-white/10 pl-0 md:pl-8">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase block mb-3">
                04 // ENTERPRISE HQ
              </span>
              <div className="space-y-3 text-xs text-slate-300 font-mono">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Bhubaneswar • Hyderabad • Bengaluru, India</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href="mailto:info@ohotechn.com" className="hover:text-white transition-colors">
                    info@ohotechn.com
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href="tel:+919937000000" className="hover:text-white transition-colors">
                    +91 (Direct Dispatch)
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">SYSTEM STATUS</span>
                <span className="text-slate-400">99.99% SLA</span>
              </div>
              <p className="text-xs text-slate-300">
                All production clusters operational with zero edge degradation.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/book-demo"
                onClick={handleClose}
                className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Book Strategy Call</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Metadata Strip */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} OHO TECH. Enterprise Digital Platform.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" onClick={handleClose} className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms-and-conditions" onClick={handleClose} className="hover:text-white">Terms of Service</Link>
            <Link href="/developer" onClick={handleClose} className="text-emerald-400 hover:underline">Developer Console</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

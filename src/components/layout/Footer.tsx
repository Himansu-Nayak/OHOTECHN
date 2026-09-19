'use client';

import * as React from 'react';
import Link from 'next/link';
import { Cpu, ShieldCheck, Sparkles, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '@/config/site';
import { solutionsNav, techServicesNav, growthServicesNav, companyNav, legalNav } from '@/config/navigation';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const BRAND_PILLARS = [
  {
    code: '01 / ARCHITECTURE',
    label: 'Enterprise Scale',
    desc: 'Zero-downtime distributed systems & modern microservices.',
    icon: Cpu,
  },
  {
    code: '02 / SOVEREIGNTY',
    label: '100% Code Ownership',
    desc: 'Complete IP transfer with zero vendor lock-in or licensing trap.',
    icon: ShieldCheck,
  },
  {
    code: '03 / VELOCITY',
    label: 'High-Impact Delivery',
    desc: 'Sub-millisecond execution powering commercial acceleration.',
    icon: Sparkles,
  },
];

export default function Footer() {
  const footerRef = React.useRef<HTMLElement>(null);
  const wordmarkRef = React.useRef<HTMLHeadingElement>(null);
  const pillarsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const footer = footerRef.current;
    const wordmark = wordmarkRef.current;
    const pillars = pillarsRef.current;
    if (!footer || !wordmark) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(wordmark, { opacity: 1, scale: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Signature Stacked Wordmark Scroll Kinetics
      gsap.fromTo(
        wordmark,
        { scale: 0.85, opacity: 0.25, y: 50 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 85%',
            end: 'top 20%',
            scrub: 1.0,
          },
        }
      );

      // 2. Pillars Stagger Reveal
      if (pillars) {
        const pillarCards = pillars.querySelectorAll('.pillar-card');
        gsap.fromTo(
          pillarCards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: pillars,
              start: 'top 80%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      }
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="footer"
      aria-label="OHO TECH Ecosystem & Footer"
      className="w-full bg-[#07080c] text-slate-400 pt-20 sm:pt-32 pb-12 font-sans text-xs relative overflow-hidden select-none border-t border-white/5"
    >
      {/* Ambient Emerald & Cyan Spotlight Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[300px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[300px] bg-sky-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

      {/* ── TOP SECTION: SIGNATURE OHO TECH REVEAL & BRAND PILLARS ── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center mb-16 sm:mb-24">
        
        {/* Brand Chapter Sub-header */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-6 sm:mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SIGNATURE DIGITAL ENGINEERING AGENCY</span>
        </div>

        {/* Massive 2-Line Stacked Wordmark Architecture */}
        <div className="w-full overflow-hidden py-2 sm:py-4">
          <h2
            ref={wordmarkRef}
            className="text-[17vw] sm:text-[18vw] md:text-[20vw] font-black leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600/35 uppercase will-change-transform select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
          >
            <span className="block">OHO</span>
            <span className="block">TECH</span>
          </h2>
        </div>

        {/* Narrative Thesis */}
        <p className="font-mono text-xs sm:text-sm lg:text-base text-slate-300 uppercase tracking-[0.2em] max-w-2xl mx-auto mt-6 mb-12 sm:mb-16 leading-relaxed">
          STRATEGY • DESIGN • ENGINEERING • ENTERPRISE SCALE
        </p>

        {/* 3 Brand Pillars Grid */}
        <div
          ref={pillarsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl mb-12 sm:mb-16 text-left"
        >
          {BRAND_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="pillar-card p-5 sm:p-6 rounded-2xl bg-[#0e1014]/90 border border-white/10 hover:border-emerald-500/40 hover:bg-[#12141a] transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    {pillar.code}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
                  {pillar.label}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Destination Connector */}
        <div className="inline-flex items-center gap-2 font-mono text-[11px] text-slate-400 tracking-wider">
          <span>DESTINATION • CORPORATE ECOSYSTEM &amp; SERVICES DIRECTORY</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 rotate-90" />
        </div>
      </div>

      {/* ── BOTTOM SECTION: 5-COLUMN CORPORATE ECOSYSTEM DIRECTORY ── */}
      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-10 lg:px-16 relative z-10 pt-12 sm:pt-16 border-t border-white/10">
        
        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          
          {/* Column 1: OHO TECH Brand & Social Links */}
          <div className="lg:col-span-1 space-y-4">
            <div className="mb-4">
              <Link
                href="/"
                className="text-xs font-mono font-bold text-white uppercase tracking-wider hover:text-emerald-400 transition-colors inline-flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>OHO TECH</span>
              </Link>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>

            {/* Social Media Links with Accessible Vector SVGs */}
            <div className="pt-2 flex items-center gap-3 text-slate-400">
              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OHO TECH on LinkedIn"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-sky-500 hover:text-black flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
              )}

              {siteConfig.social.twitter && (
                <a
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OHO TECH on X (Twitter)"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-sky-500 hover:text-black flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}

              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OHO TECH on Instagram"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-sky-500 hover:text-black flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2 stroke-round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}

              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OHO TECH on Facebook"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-sky-500 hover:text-black flex items-center justify-center transition-colors"
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
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-sky-500 hover:text-black flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Solutions by Industry */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5">
              {solutionsNav.slice(0, 7).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/solutions" className="text-sky-400 font-bold hover:underline">
                  View All Solutions →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {techServicesNav.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
              {growthServicesNav.slice(0, 3).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-sky-400 font-bold hover:underline">
                  View All Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Legal Policies */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-2.5">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} OHO TECH. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-300">Privacy</Link>
            <Link href="/terms-and-conditions" className="hover:text-slate-300">Terms</Link>
            <Link href="/cookie-policy" className="hover:text-slate-300">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

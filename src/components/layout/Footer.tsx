'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Terminal, 
  CheckCircle2 
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { industries } from '@/config/industries';
import { FooterCurtain } from '@/components/layout/FooterCurtain';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const CORE_SERVICES = [
    { name: 'Software Development', href: '/services/custom-software-development' },
    { name: 'Website Development', href: '/services/web-development' },
    { name: 'Mobile Apps (iOS & Android)', href: '/services/mobile-app-development' },
    { name: 'ERP Solutions & Systems', href: '/services/cloud-infrastructure-devops' },
    { name: 'CRM & Enterprise Automation', href: '/services/ai-ml-automation' },
    { name: 'Digital Marketing & Growth', href: '/services/cybersecurity-compliance' },
  ];

  return (
    <footer 
      role="contentinfo" 
      aria-label="Site Footer" 
      className="bg-[#07080c] text-slate-400 border-t border-white/10 font-sans text-xs relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* 1. Grand Footer Curtain Wordmark */}
      <FooterCurtain />

      {/* 2. Structured 4-Column Navigation Layout */}
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-12 border-t border-white/10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-14">
          
          {/* ── COLUMN 1: Company & Brand Manifesto ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-mono text-xs font-black tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OHO TECH PLATFORM</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {siteConfig.description || 'Engineering enterprise software systems, scalable cloud architectures, and commercial digital platforms that power business growth.'}
            </p>

            <div className="pt-1 flex flex-col space-y-2">
              <Link href="/about" className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-300 font-bold">
                <span>About Our Engineering Ethos</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
              </Link>
              <Link href="/developer" className="hover:text-purple-400 transition-colors flex items-center gap-1 text-slate-400 font-mono">
                <Terminal className="w-3 h-3 text-purple-400" />
                <span>Developer Control Studio</span>
              </Link>
              <Link href="/careers" className="hover:text-emerald-400 transition-colors text-slate-400">
                Careers &amp; Engineering Squads
              </Link>
            </div>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-2.5 text-slate-400">
              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OHO TECH on LinkedIn"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-black flex items-center justify-center transition-colors border border-white/10"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
              )}

              {siteConfig.social.twitter && (
                <a
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OHO TECH on X"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-black flex items-center justify-center transition-colors border border-white/10"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}

              {siteConfig.social.youtube && (
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OHO TECH on YouTube"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-black flex items-center justify-center transition-colors border border-white/10"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* ── COLUMN 2: Core Engineering Services ── */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Core Services</span>
            </h4>
            <ul className="space-y-2.5">
              {CORE_SERVICES.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-slate-300 hover:text-emerald-400 transition-colors block">
                    {s.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href="/services" className="text-emerald-400 font-mono font-bold hover:underline inline-flex items-center gap-1">
                  <span>Explore All Services</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* ── COLUMN 3: Industries (Reusing config/industries data) ── */}
          <div>
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Industries Served</span>
            </h4>
            <ul className="space-y-2.5">
              {industries.slice(0, 6).map((ind) => (
                <li key={ind.slug}>
                  <Link 
                    href={`/solutions/${ind.slug}`} 
                    className="text-slate-300 hover:text-cyan-400 transition-colors block truncate"
                  >
                    {ind.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href="/solutions" className="text-cyan-400 font-mono font-bold hover:underline inline-flex items-center gap-1">
                  <span>View All Industry Blueprints</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* ── COLUMN 4: Contact & Live Dispatch ── */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Direct Coordinates</span>
            </h4>

            <div className="space-y-3 font-mono text-xs text-slate-300">
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

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-400">Mon – Sat: 09:00 – 20:00 IST</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>24/7 INCIDENT TELEMETRY</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Production SLA monitoring active with automated failover routing.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div suppressHydrationWarning>
            &copy; {currentYear} OHO TECH. All rights reserved. Registered Enterprise Digital Platform.
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/refund-cancellation" className="hover:text-slate-300">Refund Policy</Link>
            <Link href="/cookie-policy" className="hover:text-slate-300">Cookie Policy</Link>
            <Link href="/disclaimer" className="hover:text-slate-300">Disclaimer</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

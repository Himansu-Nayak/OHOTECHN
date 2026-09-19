'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  PhoneCall, 
  Mail, 
  Calculator, 
  ShieldCheck,
  Clock,
  CheckCircle2
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextReveal } from '@/components/ui/TextReveal';
import { siteConfig } from '@/config/site';

interface FinalCTAProps {
  onOpenEstimate?: () => void;
}

export function FinalCTA({ onOpenEstimate }: FinalCTAProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const subcopyRef = React.useRef<HTMLParagraphElement>(null);
  const actionsRef = React.useRef<HTMLDivElement>(null);
  const triageCardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Coordinated entrance for subcopy, actions, and triage card
      gsap.fromTo(
        [subcopyRef.current, actionsRef.current, triageCardRef.current],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );

      // Subtle scroll compression on desktop
      if (window.innerWidth >= 768) {
        gsap.to(contentRef.current, {
          scale: 0.97,
          opacity: 0.88,
          y: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'center 30%',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="cta" 
      className="w-full bg-[#0a0a0b]/75 backdrop-blur-[2px] text-white py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/5"
    >
      {/* Ambient subtle background radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(16,185,129,0.06),transparent_70%)] pointer-events-none" />

      <div ref={contentRef} className="relative z-10 max-w-5xl mx-auto w-full text-center">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-6 sm:mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>START YOUR TECHNICAL TRANSFORMATION</span>
        </div>

        {/* 3-Line Massive Headline with Masked Word/Line Reveal */}
        <div className="mb-6 sm:mb-8 select-none">
          <TextReveal as="h2" splitType="lines" className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter text-white leading-[0.92] uppercase">
            LET&apos;S BUILD SOMETHING GREAT.
          </TextReveal>
        </div>

        {/* Value Proposition Description */}
        <p ref={subcopyRef} className="text-sm sm:text-lg lg:text-xl text-slate-300 font-normal max-w-2xl mx-auto mb-10 sm:mb-14 leading-relaxed">
          From distributed enterprise architectures to custom platform modernizations, partner with OHO TECH to architect software that scales effortlessly and performs without compromise.
        </p>

        {/* Responsive Action Buttons Row */}
        <div ref={actionsRef} className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-12 sm:mb-16 w-full max-w-md sm:max-w-none mx-auto">
          <Link
            id="cta-get-quote"
            href="/get-quote"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2 font-mono"
          >
            <span>Get a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {onOpenEstimate && (
            <button
              id="cta-calculate-estimate"
              onClick={onOpenEstimate}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2 font-mono cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Instant Cost Estimate</span>
            </button>
          )}

          <Link
            id="cta-book-demo"
            href="/book-demo"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent hover:bg-white/5 border border-white/20 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center font-mono"
          >
            Book a Demo
          </Link>
        </div>

        {/* Direct Contact & Triage Hub */}
        <div ref={triageCardRef} className="rounded-2xl bg-[#14151a] border border-white/10 p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              
              <div className="flex items-center justify-center md:justify-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-slate-400 uppercase">DIRECT PHONE</div>
                  <a href={`tel:${siteConfig.contact.phone}`} className="font-mono text-xs sm:text-sm font-bold text-white hover:text-emerald-400 transition-colors">
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-slate-400 uppercase">CONSULTATION INBOX</div>
                  <a href={`mailto:${siteConfig.contact.email}`} className="font-mono text-xs sm:text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-slate-400 uppercase">OPERATIONAL SLA</div>
                  <div className="font-mono text-xs sm:text-sm font-bold text-white">
                    Mon – Sat, 9am – 8pm IST
                  </div>
                </div>
              </div>

            </div>
          </div>

      </div>
    </section>
  );
}

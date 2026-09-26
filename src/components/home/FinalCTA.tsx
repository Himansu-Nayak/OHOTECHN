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

        {/* Display Headline */}
        <div className="mb-6 sm:mb-8 select-none">
          <TextReveal as="h2" splitType="lines" className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.035em] text-white leading-[1.05]">
            Ready to build or deploy?
          </TextReveal>
        </div>

        {/* Value Proposition Description */}
        <p ref={subcopyRef} className="text-sm sm:text-lg lg:text-xl text-slate-300 font-normal max-w-2xl mx-auto mb-10 sm:mb-14 leading-relaxed">
          Have a bespoke digital platform to engineer? Or looking for proven enterprise software that&apos;s already pre-built and ready to deploy? Partner directly with OHO TECH.
        </p>

        {/* Responsive Action Buttons Row: Start a Project vs Explore Software */}
        <div ref={actionsRef} className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-12 sm:mb-16 w-full max-w-md sm:max-w-none mx-auto">
          <Link
            id="cta-start-project"
            href="/contact"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Start a project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            id="cta-explore-software"
            href="/products"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center"
          >
            Explore software
          </Link>

          {onOpenEstimate && (
            <button
              id="cta-calculate-estimate"
              onClick={onOpenEstimate}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-transparent hover:bg-white/5 border border-white/15 text-slate-300 hover:text-white font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Cost calculator</span>
            </button>
          )}
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

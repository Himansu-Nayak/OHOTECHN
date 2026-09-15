'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Mail, 
  Phone
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { FlippingText } from '@/components/ui/FlippingText';
import { MagneticCTA } from '@/components/ui/MagneticCTA';

interface FinalCinematicCTAProps {
  onOpenEstimate?: () => void;
}

export function FinalCinematicCTA({ onOpenEstimate }: FinalCinematicCTAProps = {}) {
  return (
    <section id="contact-cta" className="relative w-full min-h-screen flex items-center justify-center bg-[#0a0a0b] text-white px-6 sm:px-12 lg:px-20 py-24 sm:py-32 overflow-hidden text-center">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Status Pill */}
        <ScrollReveal yOffset={15} duration={0.6}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-slate-200 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>COMMENCE YOUR TECHNICAL ENGAGEMENT</span>
          </div>
        </ScrollReveal>

        {/* Dramatic Closing Statement */}
        <ScrollReveal yOffset={25} duration={0.7} delay={0.1}>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95] mb-6 uppercase">
            <span className="block">LET&apos;S BUILD</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">SOMETHING</span>
            <span className="block">GREAT.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal yOffset={18} duration={0.65} delay={0.2}>
          <p className="text-sm sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed">
            Partner with OHO TECH to architect, build, and deploy enterprise-grade software products and high-performance digital platforms.
          </p>
        </ScrollReveal>

        {/* Dual Primary Action Buttons */}
        <ScrollReveal yOffset={15} duration={0.55} delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 sm:mb-14 w-full max-w-md sm:max-w-none mx-auto">
            <MagneticCTA strength={0.28} maxOffset={12} className="w-full sm:w-auto">
              <Link
                id="cta-get-quote"
                href="/get-quote"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] active:translate-y-0 active:scale-[0.99] text-center group button-tactile glow-focus inline-flex items-center justify-center"
              >
                <span className="inline-flex items-center gap-2">
                  <FlippingText text="Get a Quote" />
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform arrow-slide" />
                </span>
              </Link>
            </MagneticCTA>

            {onOpenEstimate && (
              <MagneticCTA strength={0.22} maxOffset={10} className="w-full sm:w-auto">
                <button
                  type="button"
                  id="cta-architecture-estimate"
                  onClick={onOpenEstimate}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] active:translate-y-0 active:scale-[0.99] text-center backdrop-blur-md cursor-pointer button-tactile glow-focus"
                >
                  <span>⚡ Configure Architecture Spec</span>
                </button>
              </MagneticCTA>
            )}

            <MagneticCTA strength={0.24} maxOffset={10} className="w-full sm:w-auto">
              <Link
                id="cta-book-demo"
                href="/book-demo"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.99] text-center backdrop-blur-md button-tactile glow-focus inline-flex items-center justify-center"
              >
                <FlippingText text="Book a Demo" />
              </Link>
            </MagneticCTA>
          </div>
        </ScrollReveal>

        {/* Contact Strip */}
        <ScrollReveal yOffset={15} duration={0.6} delay={0.4}>
          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-400">
            <a 
              href="mailto:contact@ohotech.com" 
              className="hover:text-emerald-400 transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>contact@ohotech.com</span>
            </a>

            <span className="hidden sm:inline">•</span>

            <a 
              href="tel:+918144008008" 
              className="hover:text-emerald-400 transition-colors inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>+91 81440 08008</span>
            </a>

            <span className="hidden sm:inline">•</span>

            <span className="text-slate-500">
              Response SLA: &lt; 24 Hours
            </span>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}

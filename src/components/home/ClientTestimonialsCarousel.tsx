'use client';

import React, { useState } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  highlight: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    author: 'Dr. Alok Verma',
    role: 'CHIEF MEDICAL OFFICER',
    company: 'Apex Multi-Specialty Hospital',
    quote: 'OHO TECH re-architected our entire hospital management system from the ground up. Their offline-first synchronization and real-time pharmacy ledger reduced patient wait times by over 60%. The technical precision and founder oversight were unmatched.',
    rating: 5,
    highlight: '60% PATIENT WAIT REDUCTION',
  },
  {
    id: '2',
    author: 'Sunil Patnaik',
    role: 'DIRECTOR OF OPERATIONS',
    company: 'Vanguard Retail Chain',
    quote: 'Deploying OHO TECH’s distributed POS and WhatsApp billing across 40+ retail branches transformed our operations. We achieved zero inventory drift and saved hundreds of man-hours every month with automated GST reporting.',
    rating: 5,
    highlight: '0.00% INVENTORY DRIFT',
  },
  {
    id: '3',
    author: 'Meera Sengupta',
    role: 'VP OF TECHNOLOGY',
    company: 'Stratum Digital SaaS',
    quote: 'Their microservices architecture easily handled our 10x traffic surge during high-volume product launches. With sub-15ms edge latency and zero downtime, OHO TECH is our definitive long-term engineering partner.',
    rating: 5,
    highlight: '99.999% PROD UPTIME',
  },
];

export function ClientTestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="relative w-full bg-[#0a0c10] text-white py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-y border-white/10">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Quote className="w-4 h-4" />
            </div>
            <span className="font-mono text-xs text-neutral-300 uppercase tracking-widest">
              EXECUTIVE ENDORSEMENTS // VERIFIED REVIEWS
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>99.2% AGGREGATE CSAT RATING</span>
          </div>
        </div>

        {/* Testimonial Active Display */}
        <ScrollReveal yOffset={25} duration={0.65}>
          <div className="relative bg-[#141720] border border-white/10 rounded-[36px] p-8 sm:p-14 lg:p-16 shadow-2xl overflow-hidden">
            {/* Ambient Backlight */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Star Rating & Highlight */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                  {current.highlight}
                </span>
              </div>

              {/* Quote Body */}
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-normal leading-relaxed text-neutral-100 mb-10 tracking-tight font-sans">
                “{current.quote}”
              </blockquote>

              {/* Author Info & Nav Arrows */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-white/10">
                <div>
                  <div className="text-base sm:text-lg font-bold text-white mb-0.5">
                    {current.author}
                  </div>
                  <div className="font-mono text-xs text-neutral-400 uppercase tracking-wider">
                    {current.role} • <span className="text-emerald-400">{current.company}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-neutral-500 mr-2">
                    0{currentIndex + 1} / 0{TESTIMONIALS.length}
                  </span>
                  <button
                    onClick={prev}
                    aria-label="Previous testimonial"
                    className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next testimonial"
                    className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 border border-emerald-400 flex items-center justify-center text-black font-bold transition-all shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

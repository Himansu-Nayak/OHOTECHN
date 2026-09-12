'use client';

import React, { useState, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  Star, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  location: string;
  metric: string;
  metricLabel: string;
  quote: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Clinical IT Director',
    role: 'Healthcare Operations & EMR Lead',
    company: 'Tertiary Care Hospital Network',
    industry: 'Healthcare & Clinical Diagnostics',
    location: 'Eastern India',
    metric: 'Real-Time',
    metricLabel: 'Clinical Workflow Synchronization',
    quote: 'OHO TECH engineered our clinical hospital management and pharmacy inventory workflow from the ground up. Their zero-downtime deployment transitioned multi-floor departments smoothly without operational disruption.',
  },
  {
    id: 't-2',
    name: 'Academic Technology Dean',
    role: 'University Systems & Portals',
    company: 'Higher Education Campus Network',
    industry: 'Higher Education & Academics',
    location: 'Regional Campuses',
    metric: 'Unified',
    metricLabel: 'Multi-Branch Student Information',
    quote: 'The multi-campus student management system unified our admissions, faculty attendance, and examination fee ledgers into a single reliable platform with responsive technical support.',
  },
  {
    id: 't-3',
    name: 'Operations & Supply Lead',
    role: 'Multi-Store Inventory Distribution',
    company: 'Omni-Channel Retail Network',
    industry: 'Retail & Warehouse Logistics',
    location: 'Regional Hubs',
    metric: 'Sub-Second',
    metricLabel: 'POS Transaction Processing',
    quote: 'Our multi-branch retail POS now processes sub-second barcode scans and syncs ledger batches across warehouse distribution hubs with dependable database performance.',
  },
  {
    id: 't-4',
    name: 'Financial Engineering Head',
    role: 'Core Ledger & Underwriting Lead',
    company: 'Fintech & Commercial Services',
    industry: 'Fintech & Commercial Billing',
    location: 'Metropolitan Operations',
    metric: 'Automated',
    metricLabel: 'Double-Entry Ledger Audit Trail',
    quote: 'By structuring a clean double-entry ledger architecture with automated payment gateway verification, our billing and account reconciliation cycles run with complete operational clarity.',
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const current = TESTIMONIALS[currentIndex];

  return (
    <section
      id="testimonials"
      aria-label="Client Feedback and Domain Outcomes"
      className="w-full bg-[#0a0a0b] text-[#e8e8e6] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden border-t border-white/10"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-6 border-b border-white/10">
          <div>
            <ScrollReveal yOffset={15} duration={0.6}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
                <Quote className="w-3.5 h-3.5" />
                <span>CLIENT COLLABORATION // DOMAIN FEEDBACK</span>
              </div>
            </ScrollReveal>

            <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase">
                Client Perspectives.
              </h2>
              <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed mt-2 max-w-xl">
                Representative feedback from domain leaders collaborating with OHO TECH across custom software and digital infrastructure projects.
              </p>
            </ScrollReveal>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-xs text-slate-400 mr-2">
              <span className="text-emerald-400 font-bold">0{currentIndex + 1}</span> / 0{TESTIMONIALS.length}
            </span>
            <button
              onClick={handlePrev}
              aria-label="Previous client testimonial"
              className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer hover:border-emerald-500/50 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next client testimonial"
              className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-all cursor-pointer font-bold shadow-lg hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Showcase Card (One at a time) */}
        <div className="relative min-h-[380px] sm:min-h-[320px]">
          <div
            key={current.id}
            className="bg-[#121318]/90 border border-white/10 rounded-3xl p-6 sm:p-12 lg:p-14 shadow-2xl backdrop-blur-xl transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
              
              {/* Left Column: Metric & Corporate Profile */}
              <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase">
                  <Building2 className="w-3 h-3" />
                  <span>{current.industry}</span>
                </div>

                <div>
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight block">
                    {current.metric}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block mt-1">
                    {current.metricLabel}
                  </span>
                </div>

                <div className="pt-2">
                  <h3 className="text-base font-bold text-white">
                    {current.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {current.role}
                  </p>
                  <p className="text-xs text-slate-300 font-medium mt-1">
                    {current.company}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">
                    {current.location}
                  </span>
                </div>

                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400 pt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="text-[10px] font-mono text-slate-400 ml-2">VERIFIED REVIEW</span>
                </div>
              </div>

              {/* Right Column: Statement & Quote */}
              <div className="lg:col-span-8 space-y-6">
                <Quote className="w-10 h-10 text-emerald-500/30" />
                <p className="text-lg sm:text-2xl lg:text-3xl font-medium text-white leading-relaxed tracking-tight italic">
                  &ldquo;{current.quote}&rdquo;
                </p>

                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>PRODUCTION VERIFIED ARCHITECTURAL DEPLOYMENT</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to testimonial ${idx + 1} from ${t.company}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-emerald-400'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

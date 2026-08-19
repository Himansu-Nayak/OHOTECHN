'use client';

import * as React from 'react';
import Link from 'next/link';
import { technologyServices, marketingServices } from '@/config/services';
import { ServicesCategorySwitcher, CategoryFilter } from './ServicesCategorySwitcher';
import { FeaturedServiceCard } from './FeaturedServiceCard';
import { ServicesSlider } from './ServicesSlider';
import { ArrowRight, Code2, TrendingUp, Sparkles } from 'lucide-react';

export function ServicesSection() {
  const [activeCategory, setActiveCategory] = React.useState<CategoryFilter>('all');

  const showTech = activeCategory === 'all' || activeCategory === 'technology';
  const showGrowth = activeCategory === 'all' || activeCategory === 'marketing';

  return (
    <section
      className="max-w-[1536px] w-full mx-auto mb-16 bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-2xl relative overflow-hidden grid-pattern-dark"
      id="services"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Section Header */}
      <div className="max-w-3xl mb-12 text-left relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          WHAT WE BUILD &amp; GROW ⚡
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-5">
          Technology to Build.<br />
          <span className="text-emerald-400 font-bold">Strategy to Grow.</span>
        </h2>

        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          From custom software and digital platforms to marketing and growth systems, OHO TECH delivers the technology businesses need to move forward.
        </p>
      </div>

      {/* 2. Category Switcher */}
      <ServicesCategorySwitcher
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        techCount={technologyServices.length}
        growthCount={marketingServices.length}
      />

      {/* 3. Core Technology Services Group */}
      {showTech && (
        <div className="mb-16 relative z-10">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <Code2 className="w-4 h-4" />
                <span>01. CORE TECHNOLOGY SERVICES</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Custom software, web applications, mobile platforms, ERP systems, and API architecture.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 font-bold hidden sm:block">
              {technologyServices.length} Offerings
            </span>
          </div>

          {/* Premium Flagship Featured Service Card */}
          <div className="mb-8">
            <FeaturedServiceCard service={technologyServices[0]} />
          </div>

          {/* Auto-Scrolling Horizontal Slider */}
          <div className="mt-4">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
              Explore Additional Technology Capabilities (Auto-Scrolling)
            </div>
            <ServicesSlider servicesList={technologyServices.slice(1)} badgeColor="emerald" />
          </div>
        </div>
      )}

      {/* 4. Digital Growth Services Group */}
      {showGrowth && (
        <div className="mb-16 relative z-10">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>02. DIGITAL GROWTH SERVICES</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Data-driven SEO, Google &amp; Meta ad campaigns, brand identity, and customer acquisition.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 font-bold hidden sm:block">
              {marketingServices.length} Offerings
            </span>
          </div>

          {/* Premium Flagship Featured Service Card */}
          <div className="mb-8">
            <FeaturedServiceCard service={marketingServices[0]} />
          </div>

          {/* Auto-Scrolling Horizontal Slider */}
          <div className="mt-4">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
              Explore Additional Growth Capabilities (Auto-Scrolling)
            </div>
            <ServicesSlider servicesList={marketingServices.slice(1)} badgeColor="amber" />
          </div>
        </div>
      )}

      {/* 5. Bottom CTA Block */}
      <div className="bg-[#141416] border border-white/10 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Project Consultation
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            Have a project in mind?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Tell us what you want to build, and our team will help define the right technology solution.
          </p>
        </div>

        <Link
          href="/book-demo"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0d0d0e] font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shrink-0 group hover:scale-105"
        >
          <span>Talk to an Expert</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </section>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { services, technologyServices, marketingServices } from '@/config/services';
import { ServicesCategorySwitcher, CategoryFilter } from './ServicesCategorySwitcher';
import { ServiceCard } from './ServiceCard';
import { FeaturedServiceCard } from './FeaturedServiceCard';
import { ArrowRight, Code2, TrendingUp, Sparkles } from 'lucide-react';

export function ServicesSection() {
  const [activeCategory, setActiveCategory] = React.useState<CategoryFilter>('all');

  const showTech = activeCategory === 'all' || activeCategory === 'technology';
  const showGrowth = activeCategory === 'all' || activeCategory === 'marketing';

  return (
    <section
      className="max-w-[1536px] w-full mx-auto mb-12 bg-[#fafafa] border border-slate-200/80 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden"
      id="services"
    >
      {/* 1. Section Header */}
      <div className="max-w-3xl mb-12 text-left">
        <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-4">
          WHAT WE BUILD &amp; GROW
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-5">
          Technology to Build.<br />
          <span className="text-sky-600 font-bold">Strategy to Grow.</span>
        </h2>

        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
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
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 uppercase tracking-wider mb-1">
                <Code2 className="w-4 h-4" />
                <span>01. CORE TECHNOLOGY SERVICES</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Custom software, web applications, mobile platforms, ERP systems, and API architecture.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 font-bold hidden sm:block">
              {technologyServices.length} Offerings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Card */}
            <FeaturedServiceCard service={technologyServices[0]} />

            {/* Remaining Technology Cards */}
            {technologyServices.slice(1).map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      )}

      {/* 4. Digital Growth Services Group */}
      {showGrowth && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>02. DIGITAL GROWTH SERVICES</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Data-driven SEO, Google &amp; Meta ad campaigns, brand identity, and customer acquisition.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 font-bold hidden sm:block">
              {marketingServices.length} Offerings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Card */}
            <FeaturedServiceCard service={marketingServices[0]} />

            {/* Remaining Growth Cards */}
            {marketingServices.slice(1).map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      )}

      {/* 5. Redesigned Clean Bottom CTA Block */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            Project Consultation
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#0d0d0e] tracking-tight mb-2">
            Have a project in mind?
          </h3>
          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            Tell us what you want to build, and our team will help define the right technology solution.
          </p>
        </div>

        <Link
          href="/book-demo"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-500 text-white hover:text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shrink-0 group hover:scale-105"
        >
          <span>Talk to an Expert</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </section>
  );
}

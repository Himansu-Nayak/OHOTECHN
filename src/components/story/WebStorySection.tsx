'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Layout, ShoppingCart, Users, Gauge } from 'lucide-react';

export function WebStorySection() {
  const highlights = [
    { title: 'Corporate Websites', desc: 'Brand-focused websites that position your company effectively in the market.', icon: Globe },
    { title: 'E-Commerce Platforms', desc: 'Custom online store solutions built for conversion, speed, and easy management.', icon: ShoppingCart },
    { title: 'Customer Portals', desc: 'Secure self-service web portals for clients, partners, and stakeholders.', icon: Users },
    { title: 'Business Dashboards', desc: 'Interactive administrative portals for data visualization and reporting.', icon: Gauge },
    { title: 'Custom Web Applications', desc: 'Complex web platforms tailored to specific industry business models.', icon: Layout },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-12 bg-[#fafafa] border border-slate-200/80 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden" id="web-story">
      
      {/* Eyebrow Label */}
      <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-4">
        02. WEB &amp; DIGITAL PLATFORMS
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-14">
        
        {/* Left Column: Visual Platform Card (Alternating Layout) */}
        <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-sky-400 transition-all duration-300">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-sky-600" />
                <span className="text-xs font-bold text-[#0d0d0e]">Digital Platform Stack</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                High Performance
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#0d0d0e]">Responsive UX &amp; Design</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Optimized across all device viewports</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#0d0d0e]">SEO Architecture</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Structured metadata & fast indexing</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#0d0d0e]">Analytics &amp; Conversion Sync</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Built to capture lead inquiries</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Editorial Headline & Explanation */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-6">
            Your business deserves more than a basic website.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
            We create high-performance websites, web applications, portals, and digital platforms designed around your business goals.
          </p>

          <Link
            href="/services/website-development"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md group hover:scale-[1.02]"
          >
            <span>Explore Web Development</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Below: 5 Highlight Cards */}
      <div className="pt-8 border-t border-slate-200/80">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-6">
          WEB &amp; PLATFORM OFFERINGS
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-400 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-[#0d0d0e] mb-1.5">{item.title}</h5>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}

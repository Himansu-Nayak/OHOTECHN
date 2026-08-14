'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe } from 'lucide-react';

export function WebStorySection() {
  const capabilities = [
    { title: 'Corporate Websites', desc: 'Brand-focused corporate sites engineered to position your business with authority.', emoji: '🌐' },
    { title: 'E-Commerce Platforms', desc: 'High-conversion online commerce solutions built for seamless inventory & orders.', emoji: '🛒' },
    { title: 'Customer Portals', desc: 'Secure web portals giving clients access to account management & services.', emoji: '👤' },
    { title: 'Business Dashboards', desc: 'Custom administrative reporting tools to visualize key metrics in real time.', emoji: '📊' },
    { title: 'Custom Web Applications', desc: 'Complex web platforms tailored to specific industry business models.', emoji: '💻' },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-6 bg-[#fafafa] border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden transition-all duration-500" id="web-story">
      
      {/* Eyebrow Label */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-5">
        <span>🌐</span>
        <span>02 / WEBSITE &amp; WEB PLATFORM DEVELOPMENT</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-14">
        
        {/* Left Column: Visual on Left */}
        <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-emerald-400 transition-all duration-300">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-[#0d0d0e]">Web Platform Foundation</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                High Performance
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#0d0d0e]">Fluid Responsive Architecture</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Optimized for desktop, tablet &amp; mobile viewports</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#0d0d0e]">SEO &amp; Performance Core</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Fast page load speeds &amp; semantic HTML</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#0d0d0e]">Customer Lead Capture</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Built to turn web visitors into active leads</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Text on Right */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-6">
            More than a website.<br />
            <span className="text-slate-400 font-normal">A digital foundation for your business. 🌐</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
            We design and develop websites, portals, e-commerce platforms, and custom web applications that support real business goals.
          </p>

          <Link
            href="/services/website-development"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md group hover:scale-[1.02]"
          >
            <span>Explore Web Development</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Below: Capabilities Grid */}
      <div className="pt-8 border-t border-slate-200/80">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-6">
          WEB DEVELOPMENT CAPABILITIES
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {capabilities.map((item, idx) => {
            return (
              <div key={idx} className="p-5 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-400 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 text-lg group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>
                <h5 className="text-xs font-bold text-[#0d0d0e] mb-1.5 flex items-center gap-1.5">
                  <span>{item.emoji}</span>
                  <span>{item.title}</span>
                </h5>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Search, Share2, Target, Megaphone, PenTool, MessageCircle, Mail } from 'lucide-react';

export function DigitalGrowthStorySection() {
  const capabilities = [
    { title: 'SEO', desc: 'Data-driven search engine optimization to build long-term organic search visibility.', icon: Search },
    { title: 'Social Media Marketing', desc: 'Strategic content creation, community engagement, and social channel management.', icon: Share2 },
    { title: 'Google Ads', desc: 'High-intent search & display advertising campaigns targeting active customer inquiries.', icon: Target },
    { title: 'Meta Advertising', desc: 'Audience-targeted ad campaigns running across Facebook and Instagram.', icon: Megaphone },
    { title: 'Branding & Graphic Design', desc: 'Cohesive brand identity design, messaging guidelines, and marketing collateral.', icon: PenTool },
    { title: 'WhatsApp Marketing', desc: 'Direct customer communication via broadcast campaigns and automated messaging.', icon: MessageCircle },
    { title: 'Email Marketing', desc: 'Audience-segmented newsletter campaigns and automated customer onboarding flows.', icon: Mail },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-16 bg-gradient-to-b from-[#fefbf6] via-[#fafafa] to-white border border-amber-200/80 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden transition-all duration-500" id="growth-story">
      
      {/* Clear Visual Transition Header Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-mono font-bold uppercase tracking-wider mb-6">
        <TrendingUp className="w-4 h-4 text-amber-600" />
        06 / DIGITAL GROWTH
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-14">
        
        {/* Left Column: Text on Left */}
        <div className="lg:col-span-7">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-6">
            Build your presence.<br />
            <span className="text-amber-800/60 font-normal">Grow your business.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
            We help businesses reach the right audience through strategy, digital marketing, advertising, branding, and communication.
          </p>

          <Link
            href="/services/seo"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md group hover:scale-[1.02]"
          >
            <span>Explore Digital Growth</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right Column: Abstract Growth & Audience Visual */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-white border border-amber-200 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-amber-400 transition-all duration-300">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-bold text-[#0d0d0e]">Growth &amp; Audience Strategy</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Strategic Reach
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#0d0d0e]">SEO &amp; Organic Search Outreach</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">High-intent customer keyword targeting</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#0d0d0e]">Targeted Ads (Google &amp; Meta)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Structured campaign management</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#0d0d0e] shrink-0" />
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#0d0d0e]">Brand Positioning &amp; Design</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Cohesive visual marketing collateral</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Below: Capabilities Grid */}
      <div className="pt-8 border-t border-slate-200/80">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-6">
          DIGITAL GROWTH CAPABILITIES
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
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

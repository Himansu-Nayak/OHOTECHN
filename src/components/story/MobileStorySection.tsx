'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Smartphone, CheckCircle2 } from 'lucide-react';

export function MobileStorySection() {
  const capabilities = [
    { title: 'Android Apps', desc: 'Native Android applications engineered using Kotlin for performance & Play Store readiness.', emoji: '🤖' },
    { title: 'iOS Apps', desc: 'Native iOS applications built adhering strictly to Apple design standards.', emoji: '📱' },
    { title: 'Cross-Platform Apps', desc: 'Single-codebase mobile solutions deploying across both platforms with high speed.', emoji: '⚡' },
    { title: 'Customer Applications', desc: 'Consumer-facing mobile apps for bookings, service ordering, and loyalty.', emoji: '🛍️' },
    { title: 'Internal Business Apps', desc: 'Workforce mobile tools for field operations, task updates, and inventory tracking.', emoji: '📊' },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-6 bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden transition-all duration-500" id="mobile-story">
      
      {/* Eyebrow Label */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-5">
        <span>📱</span>
        <span>03 / MOBILE APP DEVELOPMENT CAPABILITIES</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-14">
        
        {/* Left Column: Text on Left */}
        <div className="lg:col-span-7">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-6">
            Your business, in your customer&apos;s hands. 📱
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
            We create mobile applications that help businesses connect with customers, employees, and operations from anywhere.
          </p>

          <Link
            href="/services/android-app-development"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md group hover:scale-[1.02]"
          >
            <span>Explore Mobile App Development</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right Column: Abstract Mobile Composition Visual */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm bg-[#0d0d0e] text-white border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
            
            <div className="border border-white/15 rounded-2xl p-5 bg-[#141416] space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-slate-200">Mobile Application Core</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="text-slate-300">Push Notification Engine</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="text-slate-300">Offline Data Sync</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <span className="text-slate-300">Biometric &amp; Token Auth</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Android &amp; iOS Deployment</span>
              <span className="text-emerald-400 font-bold">Store Ready</span>
            </div>

          </div>
        </div>

      </div>

      {/* Below: Capabilities Grid */}
      <div className="pt-8 border-t border-slate-200/80">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-6">
          MOBILE APPLICATION CAPABILITIES
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {capabilities.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 hover:border-emerald-400 transition-all group">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <span className="text-lg group-hover:scale-110 transition-transform">{item.emoji}</span>
                <span className="text-xs font-bold text-[#0d0d0e]">{item.title}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

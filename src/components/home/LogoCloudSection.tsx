'use client';

import * as React from 'react';
import NextImage from 'next/image';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function LogoCloudSection() {
  return (
    <div className="w-full my-8 bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 lg:p-14 shadow-sm relative overflow-hidden">
      
      {/* Top Header Tag */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            OHO TECH BRAND &amp; TECHNOLOGY ECOSYSTEM ⚡
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#0d0d0e] tracking-tight">
            Trusted Enterprise Platform Architecture
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>SLA-Backed Production Systems</span>
        </div>
      </div>

      {/* Main OHO TECH Logo & Brand Cloud Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Official OHO TECH Logo Card */}
        <div className="lg:col-span-4 bg-[#0d0d0e] text-white rounded-3xl p-7 border border-black shadow-xl flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 w-full flex flex-col items-center">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest mb-4 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              OFFICIAL OHO BRAND LOGO
            </span>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md mb-4 group-hover:scale-105 transition-transform duration-300 w-full flex justify-center items-center">
              <NextImage
                src="/OHO_TECH_LOGO.png"
                alt="OHO TECH Brand Logo"
                width={220}
                height={70}
                priority
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              OHO TECH Enterprise Digital Solutions &amp; Software Architecture
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Ecosystem Brand Cloud */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 hover:border-emerald-500 transition-all flex flex-col items-center text-center group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚡</div>
            <div className="text-sm font-extrabold text-[#0d0d0e]">OHO TECH Studio</div>
            <div className="text-[10px] font-mono text-slate-500">Core Software</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 hover:border-emerald-500 transition-all flex flex-col items-center text-center group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💬</div>
            <div className="text-sm font-extrabold text-[#0d0d0e]">OHO WhatsApp</div>
            <div className="text-[10px] font-mono text-slate-500">Automated Billing</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 hover:border-emerald-500 transition-all flex flex-col items-center text-center group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📱</div>
            <div className="text-sm font-extrabold text-[#0d0d0e]">OHO Mobile Apps</div>
            <div className="text-[10px] font-mono text-slate-500">Owner &amp; Sales Suite</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 hover:border-emerald-500 transition-all flex flex-col items-center text-center group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🏦</div>
            <div className="text-sm font-extrabold text-[#0d0d0e]">OHO Banking</div>
            <div className="text-[10px] font-mono text-slate-500">Auto Reconciliation</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 hover:border-emerald-500 transition-all flex flex-col items-center text-center group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🎓</div>
            <div className="text-sm font-extrabold text-[#0d0d0e]">OHO Skill ERP</div>
            <div className="text-[10px] font-mono text-slate-500">Vocational e-Governance</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 hover:border-emerald-500 transition-all flex flex-col items-center text-center group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">☁️</div>
            <div className="text-sm font-extrabold text-[#0d0d0e]">OHO Cloud Sync</div>
            <div className="text-[10px] font-mono text-slate-500">Real-Time Backups</div>
          </div>

        </div>

      </div>

    </div>
  );
}

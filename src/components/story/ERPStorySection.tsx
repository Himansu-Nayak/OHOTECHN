'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutGrid, Users, DollarSign, Package, GitBranch } from 'lucide-react';

export function ERPStorySection() {
  const capabilities = [
    { title: 'ERP Solutions', desc: 'Centralized enterprise platforms unifying multi-department business processes.', icon: LayoutGrid },
    { title: 'CRM Systems', desc: 'Lead tracking, customer communications, sales pipelines, and support tickets.', icon: Users },
    { title: 'HRMS & Payroll', desc: 'Employee records, attendance tracking, automated payroll, and compliance.', icon: DollarSign },
    { title: 'Inventory Management', desc: 'Real-time stock level tracking, warehouse orders, and supplier automation.', icon: Package },
    { title: 'Business Automation', desc: 'Streamlining approval chains and manual cross-department tasks.', icon: GitBranch },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-16 bg-[#fafafa] border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden transition-all duration-500" id="erp-story">
      
      {/* Eyebrow Label */}
      <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-4">
        04 / BUSINESS SYSTEMS
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-14">
        
        {/* Left Column: Visual on Left (Connected System Visual) */}
        <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-sky-400 transition-all duration-300">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-5 h-5 text-sky-600" />
                <span className="text-xs font-bold text-[#0d0d0e]">Connected Business System</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">Unified Architecture</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-[#0d0d0e] mb-1">HR &amp; Payroll</div>
                <div className="text-[11px] text-slate-500">Attendance &amp; Salary</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-[#0d0d0e] mb-1">Inventory Core</div>
                <div className="text-[11px] text-slate-500">Stock &amp; Warehouse</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-[#0d0d0e] mb-1">CRM &amp; Sales</div>
                <div className="text-[11px] text-slate-500">Pipelines &amp; Leads</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-[#0d0d0e] mb-1">Operations</div>
                <div className="text-[11px] text-slate-500">Workflows &amp; Tasks</div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Text on Right */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-6">
            Bring your business into one connected system.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl">
            From ERP and CRM platforms to inventory, HR, finance, and operations, we build systems that simplify complex business processes.
          </p>

          <Link
            href="/services/erp-solutions"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md group hover:scale-[1.02]"
          >
            <span>Explore Business Solutions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* Below: Capabilities Grid */}
      <div className="pt-8 border-t border-slate-200/80">
        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-6">
          BUSINESS SYSTEM CAPABILITIES
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {capabilities.map((item, idx) => {
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

'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, Globe, Smartphone, LayoutGrid, Palette, TrendingUp, CheckCircle2, ShieldCheck, Cpu, Workflow, Database } from 'lucide-react';

export function ServiceStoryTimeline() {
  const stories = [
    {
      id: 'software-story',
      step: '01',
      title: 'Custom Software Development',
      badge: 'SOFTWARE ENGINEERING',
      emoji: '💻',
      headline: 'Software Development 💻',
      desc: 'Full-cycle software development from ideation to deployment using modern tech stacks, custom microservices, and agile methodologies.',
      link: '/services/software-development',
      linkText: 'Explore Software Architecture',
      footerTag: 'SLA-Backed Delivery',
      capabilities: [
        'Requirement Analysis',
        'Architecture Design',
        'Custom Microservices',
        'Workflow Automation',
        'High-Scale DB & Maintenance',
      ],
      visual: (
        <div className="w-full bg-[#141416] text-white border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200">Software Operations Core</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              Microservices Stack
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Custom Business Logic</span>
              </div>
              <span className="text-[10px] text-emerald-400">Optimized</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <Workflow className="w-4 h-4 text-amber-400" />
                <span>Workflow Automation</span>
              </div>
              <span className="text-[10px] text-amber-400">Active</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <Database className="w-4 h-4 text-teal-400" />
                <span>High-Availability Database</span>
              </div>
              <span className="text-[10px] text-teal-400">99.99% Uptime</span>
            </div>
          </div>
        </div>
      ),
    },

    {
      id: 'web-story',
      step: '02',
      title: 'Website & Web Platforms',
      badge: 'WEB ENGINEERING',
      emoji: '🌐',
      headline: 'Website & Web Platforms 🌐',
      desc: 'Responsive, SEO-optimized corporate websites, high-conversion e-commerce portals, and web applications built with cutting-edge frameworks.',
      link: '/services/website-development',
      linkText: 'Explore Web Architecture',
      footerTag: 'Responsive & Fast SLA',
      capabilities: [
        'Corporate Web Platforms',
        'E-Commerce Storefronts',
        'Customer Lead Portals',
        'SEO & Performance Core',
        'CMS & Admin Dashboards',
      ],
      visual: (
        <div className="w-full bg-[#141416] text-white border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200">Web Platform Core</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              Next.js 16
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-slate-200">Fluid Responsive Layout</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-slate-200">Sub-Second Page Load</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-slate-200">Conversion Lead Funnel</span>
              <span className="w-2 h-2 rounded-full bg-teal-400" />
            </div>
          </div>
        </div>
      ),
    },

    {
      id: 'mobile-story',
      step: '03',
      title: 'Mobile App Development',
      badge: 'MOBILE ENGINEERING',
      emoji: '📱',
      headline: 'Mobile App Development 📱',
      desc: 'Native iOS and Android mobile applications engineered for high performance, daily user productivity, and seamless Play Store/App Store deployment.',
      link: '/services/android-app-development',
      linkText: 'Explore Mobile Architecture',
      footerTag: 'Store-Ready Deployment',
      capabilities: [
        'Native Android (Kotlin)',
        'Native iOS (Swift)',
        'Cross-Platform Apps',
        'Biometric & Token Auth',
        'Offline Data Sync Engine',
      ],
      visual: (
        <div className="w-full bg-[#141416] text-white border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200">Mobile Core Platform</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              iOS &amp; Android
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-slate-200">Push Notification Gateway</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-slate-200">Offline DB &amp; Sync Engine</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-slate-200">Biometric Security Auth</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>
      ),
    },

    {
      id: 'erp-story',
      step: '04',
      title: 'Enterprise ERP Systems',
      badge: 'BUSINESS SYSTEMS',
      emoji: '⚙️',
      headline: 'Enterprise ERP Systems ⚙️',
      desc: 'Centralized ERP, CRM, inventory, HRMS, and patient/campus billing systems that unify multi-department business processes into one dashboard.',
      link: '/services/erp-solutions',
      linkText: 'Explore ERP Systems',
      footerTag: 'Enterprise Unified Architecture',
      capabilities: [
        'Hospital EMR & Patient Billing',
        'Campus Management ERP',
        'Retail POS & Stock Engine',
        'HR & Payroll Automation',
        'Custom Business CRM',
      ],
      visual: (
        <div className="w-full bg-[#141416] text-white border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200">Unified ERP Hub</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              Enterprise Ready
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-white font-bold mb-0.5">Hospital EMR</div>
              <div className="text-[10px] text-slate-400">OPD/IPD &amp; IVF</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-white font-bold mb-0.5">Campus ERP</div>
              <div className="text-[10px] text-slate-400">Fee &amp; Exam Core</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-white font-bold mb-0.5">Retail POS</div>
              <div className="text-[10px] text-slate-400">Barcode &amp; Stock</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-white font-bold mb-0.5">HRMS &amp; Payroll</div>
              <div className="text-[10px] text-slate-400">Attendance Sync</div>
            </div>
          </div>
        </div>
      ),
    },

    {
      id: 'design-integration-story',
      step: '05',
      title: 'UI/UX & System Integration',
      badge: 'DESIGN & CONNECTIONS',
      emoji: '🎨',
      headline: 'UI/UX & System Integration 🎨',
      desc: 'Human-centered user interface design coupled with custom API integrations, payment gateways, webhooks, and third-party software connectors.',
      link: '/contact',
      linkText: 'Explore Design & APIs',
      footerTag: 'Atomic Design & API Sync',
      capabilities: [
        'User-Centered UI/UX Design',
        'RESTful & GraphQL APIs',
        'Payment Gateway Integration',
        'WhatsApp & SMS Webhooks',
        'Legacy System Refactoring',
      ],
      visual: (
        <div className="w-full bg-[#141416] text-white border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <Palette className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200">Design &amp; API Layer</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              Seamless Sync
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-slate-200">Atomic UI Design System</span>
              <span className="text-[10px] text-emerald-400">Figma Ready</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-slate-200">Payment &amp; SMS Gateways</span>
              <span className="text-[10px] text-emerald-400">Secure</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-slate-200">CRM &amp; ERP Webhook Bridge</span>
              <span className="text-[10px] text-emerald-400">Active Sync</span>
            </div>
          </div>
        </div>
      ),
    },

    {
      id: 'growth-story',
      step: '06',
      title: 'Digital Growth & Marketing',
      badge: 'CUSTOMER ACQUISITION',
      emoji: '📈',
      headline: 'Digital Growth & Marketing 📈',
      desc: 'Data-driven search engine optimization, Google Ads, Meta campaigns, strategic brand positioning, and WhatsApp acquisition funnels.',
      link: '/services/seo',
      linkText: 'Explore Growth Services',
      footerTag: 'Data-Driven Acquisition',
      capabilities: [
        'Technical SEO Optimization',
        'Google Search & Display Ads',
        'Meta Paid Media Campaigns',
        'Brand Positioning Collateral',
        'WhatsApp Broadcast Funnels',
      ],
      visual: (
        <div className="w-full bg-[#141416] text-white border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-mono font-bold text-slate-200">Growth Engine Core</span>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              Data Driven
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-slate-200">Organic Search Optimization</span>
              <span className="text-[10px] text-amber-400">Page 1 Target</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-slate-200">Google &amp; Meta Ad Conversion</span>
              <span className="text-[10px] text-amber-400">High ROAS</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-slate-200">WhatsApp Broadcast Engine</span>
              <span className="text-[10px] text-amber-400">Automated</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="max-w-[1536px] w-full mx-auto mb-16 bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm relative overflow-hidden" id="capabilities-timeline">
      
      {/* Top Main Section Header */}
      <div className="max-w-4xl mb-16 text-left border-b border-slate-200 pb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          OHO TECH END-TO-END CAPABILITIES 🚀
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-5">
          Engineering &amp; Growth Capabilities Roadmap.
        </h2>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Discover our 6 core capability pillars, from custom software and web platforms to mobile engineering, business ERP systems, UI/UX design, and digital customer acquisition.
        </p>
      </div>

      {/* Main Timeline Body */}
      <div>
        {stories.map((item, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <React.Fragment key={item.id}>
              
              {/* Single Master Card Styled EXACTLY Like Reference Photo */}
              <div
                id={item.id}
                className="bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300"
              >
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Card Top Pill Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-emerald-500 text-white font-mono text-sm font-black flex items-center justify-center shadow-md">
                      {item.step}
                    </span>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                      <span>{item.emoji}</span>
                      <span>{item.badge}</span>
                    </div>
                  </div>

                  <span className="hidden sm:inline-block text-xs font-mono text-slate-400 font-bold uppercase">
                    Pillar {item.step} of 06
                  </span>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-8">
                  
                  {/* Left Column: Text & CTA */}
                  <div className={`lg:col-span-7 ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                    <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 flex items-center gap-3">
                      <span>{item.emoji}</span>
                      <span>{item.headline}</span>
                    </h3>

                    <p className="text-base text-slate-300 leading-relaxed mb-8 max-w-2xl">
                      {item.desc}
                    </p>

                    <Link
                      href={item.link}
                      className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-white text-[#0d0d0e] hover:bg-emerald-400 font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md group-hover:scale-[1.02]"
                    >
                      <span>{item.linkText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Right Column: Visual Component */}
                  <div className={`lg:col-span-5 ${isEven ? 'order-2' : 'order-2 lg:order-1'} flex justify-center`}>
                    {item.visual}
                  </div>

                </div>

                {/* Core Feature Pills (Matching Outline Pill Style from Reference Image) */}
                <div className="pt-6 border-t border-white/10 mt-6">
                  <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">
                    CORE MODULES &amp; DELIVERABLES
                  </h4>
                  <div className="flex flex-wrap items-center gap-3">
                    {item.capabilities.map((cap, capIdx) => (
                      <div
                        key={capIdx}
                        className="px-4 py-2.5 rounded-2xl bg-[#141416] border border-white/10 text-xs font-medium text-slate-200 hover:border-emerald-500/40 transition-colors flex items-center gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monospaced Footer Tag (Matching SLA-Backed Delivery from Photo) */}
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{item.footerTag}</span>
                  <span className="text-emerald-400 font-bold">100% PRODUCTION READY</span>
                </div>

              </div>

              {/* Just the Clean Continuous Stick Line (No Chains, No Arrows) */}
              {idx < stories.length - 1 && (
                <div className="py-6 flex justify-center my-2">
                  <div className="w-1.5 h-16 bg-gradient-to-b from-emerald-500/80 via-emerald-400 to-emerald-500/80 rounded-full shadow-[0_0_10px_#10b981]" />
                </div>
              )}

            </React.Fragment>
          );
        })}
      </div>

    </section>
  );
}

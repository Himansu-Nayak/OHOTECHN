'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Copy, ExternalLink, Key, Search, ShieldCheck, Sparkles, MonitorPlay } from 'lucide-react';
import { softwareDemos, SoftwareDemo } from '@/config/demos';
import { cn } from '@/lib/utils';

export default function ProductsCatalogPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Products (28)' },
    { id: 'education', label: 'Education (6)' },
    { id: 'healthcare', label: 'Healthcare (4)' },
    { id: 'erp', label: 'ERP & HR (5)' },
    { id: 'retail', label: 'Retail & POS (3)' },
    { id: 'real-estate', label: 'Real Estate (2)' },
    { id: 'ecommerce', label: 'E-Commerce (1)' },
    { id: 'services', label: 'Services & Booking (6)' },
    { id: 'finance', label: 'Finance & Banking (1)' },
  ];

  const filteredDemos = softwareDemos.filter((demo) => {
    const matchesCategory = selectedCategory === 'all' || demo.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      demo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demo.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getBadgeStyle = (color: SoftwareDemo['badgeColor']) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'amber':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'teal':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'sky':
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="products-catalog-main">
        
        {/* Header Hero Section */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm text-center mb-10 relative overflow-hidden grid-pattern-light" id="products-hero">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              28 INTERACTIVE LIVE DEMOS AVAILABLE ⚡
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0d0d0e] mb-6 leading-[1.08]">
              Turnkey Software Products &amp; Live Demo Portals
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal max-w-3xl mx-auto leading-relaxed">
              Test drive our turnkey software applications instantly. Explore 28 live product environments complete with direct admin, doctor, user, and student credentials.
            </p>
          </div>
        </section>

        {/* Search & Category Filter Section */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-6 sm:p-8 shadow-sm mb-10" id="products-filter-section">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 28 live products (e.g. Hospital, School, POS, Gym)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-[#fafafa] border-2 border-slate-200 text-xs font-medium text-[#0d0d0e] placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all border-2",
                    selectedCategory === cat.id
                      ? "bg-[#0d0d0e] text-white border-[#0d0d0e] shadow-sm"
                      : "bg-[#fafafa] text-slate-700 border-slate-200 hover:border-slate-400"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-500">
            <span>Displaying {filteredDemos.length} of 28 Live Software Applications</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              All 28 Live Demo Environments Verified &amp; Active
            </span>
          </div>

        </section>

        {/* 28 Live Products & Demos Showcase Grid */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 lg:p-14 shadow-sm" id="products-grid-section">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDemos.map((demo) => {
              const demoUrl = demo.frontendUrl || demo.mainDemoUrl || demo.accounts[0]?.url || '#';

              return (
                <div
                  key={demo.id}
                  className="bg-[#fafafa] border-2 border-slate-200 hover:border-emerald-500 rounded-[32px] p-7 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl relative overflow-hidden group"
                >
                  {/* Decorative Subtle Background Glow on Hover */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

                  <div className="relative z-10">
                    
                    {/* Header Icon & Category Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {demo.emoji || '⚡'}
                        </div>
                        <div>
                          <span className={cn('text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider', getBadgeStyle(demo.badgeColor))}>
                            {demo.category}
                          </span>
                          <div className="text-[10px] font-mono text-slate-400 font-bold mt-0.5">
                            PRODUCT #0{demo.id}
                          </div>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full animate-pulse shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        LIVE
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-extrabold text-[#0d0d0e] mb-3 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                      <span>{demo.title}</span>
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">
                      {demo.description}
                    </p>

                    {/* System Features */}
                    <div className="mb-6 space-y-2 bg-white p-4 rounded-2xl border border-slate-200">
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>Core Capabilities</span>
                        <MonitorPlay className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      {demo.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Live Credentials Accordion Box */}
                    <div className="mb-6 space-y-2.5">
                      <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-amber-500" />
                          Demo Credentials ({demo.accounts.length})
                        </span>
                        <span className="text-[10px] text-slate-400">Click to Copy</span>
                      </div>

                      {demo.accounts.map((acc, accIdx) => {
                        const emailKey = `${demo.id}-${accIdx}-email`;
                        const passKey = `${demo.id}-${accIdx}-pass`;
                        const accTargetUrl = acc.url || demoUrl;

                        return (
                          <div
                            key={accIdx}
                            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 text-xs font-mono flex flex-col gap-1.5 shadow-2xs transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#0d0d0e] text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {acc.role}
                              </span>

                              {accTargetUrl !== '#' && (
                                <a
                                  href={accTargetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center gap-1 shrink-0"
                                >
                                  <span>Open Login</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>

                            {/* Username / Email Field */}
                            {(acc.email || acc.username) && (
                              <div className="flex items-center justify-between text-slate-600 text-[11px] bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                                <span className="truncate">
                                  ID: <strong className="text-slate-900 font-bold">{acc.email || acc.username}</strong>
                                </span>
                                <button
                                  onClick={() => copyToClipboard(acc.email || acc.username || '', emailKey)}
                                  className="text-slate-400 hover:text-emerald-600 p-0.5 rounded transition-colors flex items-center gap-1"
                                  title="Copy Username"
                                >
                                  {copiedKey === emailKey ? (
                                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                                      <Check className="w-3 h-3" /> Copied
                                    </span>
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            )}

                            {/* Password Field */}
                            {acc.password && (
                              <div className="flex items-center justify-between text-slate-600 text-[11px] bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                                <span className="truncate">
                                  Pass: <strong className="text-slate-900 font-bold">{acc.password}</strong>
                                </span>
                                <button
                                  onClick={() => copyToClipboard(acc.password || '', passKey)}
                                  className="text-slate-400 hover:text-emerald-600 p-0.5 rounded transition-colors flex items-center gap-1"
                                  title="Copy Password"
                                >
                                  {copiedKey === passKey ? (
                                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                                      <Check className="w-3 h-3" /> Copied
                                    </span>
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="relative z-10 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded-full bg-[#0d0d0e] hover:bg-emerald-600 text-white font-mono font-bold text-xs uppercase tracking-wider text-center transition-all shadow-md flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Try Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>

                    <Link
                      href="/get-quote"
                      className="py-3 px-4 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-mono font-bold text-xs uppercase tracking-wider border border-slate-300 transition-all text-center shrink-0"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </section>

      </main>
    </div>
  );
}

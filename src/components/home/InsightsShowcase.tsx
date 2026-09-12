'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Clock,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface ArticleItem {
  id: string;
  category: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  slug: string;
  highlightTag: string;
}

const ARTICLES: ArticleItem[] = [
  {
    id: 'enterprise-microservices',
    category: 'SYSTEM ARCHITECTURE',
    title: 'Migrating Monolithic Core Systems to Modular Event-Driven Microservices',
    date: 'SEPTEMBER 2026',
    readTime: '6 MIN READ',
    excerpt: 'How isolating core billing, inventory, and user authentication into stateless microservices prevents database lockups and enables seamless rolling releases.',
    slug: 'custom-software',
    highlightTag: 'FEATURED ARCHITECTURE'
  },
  {
    id: 'emr-data-security',
    category: 'HEALTHCARE INFORMATICS',
    title: 'Architecting Offline-First Clinical Systems with Real-Time Cloud Synchronization',
    date: 'AUGUST 2026',
    readTime: '5 MIN READ',
    excerpt: 'Strategies for engineering resilient clinical and hospital terminals that operate smoothly during internet dropouts with reliable background queue reconciliation.',
    slug: 'cloud-infrastructure',
    highlightTag: 'CLINICAL ENGINEERING'
  },
  {
    id: 'retail-barcode-performance',
    category: 'COMMERCE INFRASTRUCTURE',
    title: 'Sub-Second Barcode Processing & High-Concurrency Multi-Store Inventory Ledgers',
    date: 'JULY 2026',
    readTime: '4 MIN READ',
    excerpt: 'Optimizing high-throughput point-of-sale checkout terminals to handle heavy counter surges without ledger latency or store-to-depot stock drift.',
    slug: 'data-analytics',
    highlightTag: 'PERFORMANCE OPTIMIZATION'
  },
  {
    id: 'zero-trust-cloud',
    category: 'SECURITY & GOVERNANCE',
    title: 'Implementing Zero-Trust API Security & mTLS Federation Across Multi-Region Clouds',
    date: 'JUNE 2026',
    readTime: '7 MIN READ',
    excerpt: 'Practical implementation patterns for strict role-based access control, cryptographic token verification, and automated security audit logging.',
    slug: 'cybersecurity',
    highlightTag: 'SECURITY PRACTICES'
  }
];

export function InsightsShowcase() {
  return (
    <section 
      id="insights" 
      aria-label="OHO TECH Technical Insights and Engineering Perspectives"
      className="w-full py-20 sm:py-28 px-6 sm:px-10 lg:px-16 bg-[#0a0a0b] text-[#e8e8e6] relative overflow-hidden border-t border-white/10"
    >
      {/* Background ambient illumination */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[350px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Sticky Editorial Section Header */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <ScrollReveal yOffset={15} duration={0.6}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>TECHNICAL PERSPECTIVES &amp; INSIGHTS</span>
              </div>
            </ScrollReveal>

            <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-[1.1]">
                What&apos;s Evolving in <br />
                <span className="text-slate-400">Enterprise Tech.</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mt-4">
                In-depth technical perspectives on distributed system design, offline-first architectures, high-concurrency ledgers, and cloud infrastructure best practices.
              </p>
            </ScrollReveal>

            <ScrollReveal yOffset={15} duration={0.6} delay={0.2}>
              <div className="pt-2">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-emerald-500 text-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider border border-white/15 hover:border-emerald-500 transition-all duration-300 shadow-lg group cursor-pointer"
                >
                  <span>Explore Engineering Services</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Quick Stats Pill */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono text-slate-400 space-y-1 hidden lg:block">
              <div className="text-emerald-400 font-bold uppercase">Continuous Technical Research</div>
              <div>Published quarterly for engineering teams &amp; architects.</div>
            </div>
          </div>

          {/* Right Column: Stacked Editorial Articles List */}
          <div className="lg:col-span-8 space-y-4">
            {ARTICLES.map((article, idx) => (
              <ScrollReveal key={article.id} yOffset={20} duration={0.6} delay={idx * 0.08}>
                <Link
                  href={`/services/${article.slug}`}
                  className="block p-6 sm:p-8 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-500/50 transition-all duration-300 group relative overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.08)] hover:-translate-y-0.5"
                >
                  {/* 4-Corner Technical Anchor Points */}
                  <span className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-emerald-400 transition-colors pointer-events-none" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-emerald-400 transition-colors pointer-events-none" />
                  <span className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/20 group-hover:border-emerald-400 transition-colors pointer-events-none" />
                  <span className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/20 group-hover:border-emerald-400 transition-colors pointer-events-none" />

                  {/* Top Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/5 group-hover:border-white/10 text-[10px] font-mono transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider border border-emerald-500/20">
                        {article.category}
                      </span>
                      <span className="text-slate-400 hidden sm:inline-block">
                        // {article.highlightTag}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span className="text-slate-300">{article.readTime}</span>
                    </div>
                  </div>

                  {/* Title & Arrow */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-emerald-500 group-hover:text-black border border-white/10 text-slate-400 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-45">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-4">
                    {article.excerpt}
                  </p>

                  {/* Bottom Line Hover Effect */}
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400/80 group-hover:text-emerald-400 transition-colors">
                    <span>Read Full Perspective</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Background Hover Glow Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </Link>
              </ScrollReveal>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

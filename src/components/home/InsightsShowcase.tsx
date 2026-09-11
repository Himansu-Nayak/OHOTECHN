'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ArrowRight
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
}

const articles: ArticleItem[] = [
  {
    id: 'enterprise-microservices',
    category: 'SYSTEM ARCHITECTURE',
    title: 'Migrating Monolithic Enterprise Operations to Modular Spring Boot & Next.js Microservices',
    date: 'SEPTEMBER 2026',
    readTime: '6 MIN READ',
    excerpt: 'How decoupling core billing, inventory, and user authentication into isolated microservices eliminates database lockups and enables zero-downtime rolling upgrades.',
    slug: 'custom-software-development'
  },
  {
    id: 'emr-data-security',
    category: 'HEALTHCARE INFORMATICS',
    title: 'Architecting Offline-First EMR & Hospital Information Systems with Real-Time Cloud Sync',
    date: 'AUGUST 2026',
    readTime: '5 MIN READ',
    excerpt: 'Strategies for designing resilient hospital clinical terminals that function seamlessly during network dropouts while ensuring complete clinical audit compliance.',
    slug: 'healthcare'
  },
  {
    id: 'retail-barcode-performance',
    category: 'COMMERCE INFRASTRUCTURE',
    title: 'Sub-Second Barcode Processing & Multi-Store Inventory Reconciliation at Scale',
    date: 'JULY 2026',
    readTime: '4 MIN READ',
    excerpt: 'Optimizing high-concurrency thermal billing terminals to process over 10,000 daily transactions without ledger lag or store-to-warehouse stock drift.',
    slug: 'retail-ecommerce'
  }
];

export function InsightsShowcase() {
  return (
    <section id="insights" className="w-full py-20 sm:py-28 px-6 sm:px-10 lg:px-16 bg-[#0a0a0b] relative">
      <div className="max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="max-w-3xl mb-12 sm:mb-16 pb-6 border-b border-white/10">
        <ScrollReveal yOffset={15} duration={0.6}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>TECHNICAL INSIGHTS &amp; PERSPECTIVES</span>
          </div>
        </ScrollReveal>

        <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4 uppercase">
            Engineering Insights.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
            Deep-dive technical perspectives on software architecture, enterprise scalability, and operational digital transformation.
          </p>
        </ScrollReveal>
      </div>

      {/* Large Editorial Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {articles.map((article, idx) => (
          <ScrollReveal key={article.id} yOffset={25} duration={0.65} delay={idx * 0.1}>
            <div className="h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#111113] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10 text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">
                    {article.category}
                  </span>
                  <span className="text-slate-400">
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white leading-snug mb-3 group-hover:text-emerald-400 transition-colors">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-6">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  {article.date}
                </span>

                <Link
                  href={`/services/${article.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white group-hover:text-emerald-400 transition-colors uppercase"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      </div>
    </section>
  );
}

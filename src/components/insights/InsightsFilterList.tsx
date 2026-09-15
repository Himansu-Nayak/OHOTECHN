'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Tag, 
  Filter,
  CheckCircle2,
  Code2,
  Cpu,
  Layers
} from 'lucide-react';
import { 
  InsightArticle, 
  InsightCategory, 
  INSIGHT_CATEGORIES, 
  INSIGHT_ARTICLES 
} from '@/config/insights';

export function InsightsFilterList() {
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredArticles = useMemo(() => {
    return INSIGHT_ARTICLES.filter((article) => {
      const matchesCategory = 
        selectedCategory === 'All' || article.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        article.title.toLowerCase().includes(q) ||
        article.subtitle.toLowerCase().includes(q) ||
        article.abstract.toLowerCase().includes(q) ||
        article.author.name.toLowerCase().includes(q) ||
        article.tags.some(tag => tag.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const featuredArticle = useMemo(() => {
    if (selectedCategory === 'All' && !searchQuery.trim()) {
      return INSIGHT_ARTICLES[0];
    }
    return filteredArticles.length > 0 ? filteredArticles[0] : null;
  }, [selectedCategory, searchQuery, filteredArticles]);

  const regularArticles = useMemo(() => {
    if (!featuredArticle) return [];
    return filteredArticles.filter((a) => a.slug !== featuredArticle.slug);
  }, [featuredArticle, filteredArticles]);

  return (
    <div className="space-y-12">
      {/* Filter & Search Bar */}
      <div className="space-y-6">
        {/* Search & Stats Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search architecture notes, tags, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#111216] border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          <div className="font-mono text-xs text-slate-400 flex items-center gap-2">
            <span>Showing</span>
            <span className="font-bold text-emerald-400">{filteredArticles.length}</span>
            <span>of {INSIGHT_ARTICLES.length} Whitepapers</span>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {INSIGHT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-mono text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border button-tactile glow-focus ${
                  isSelected
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-[#111216]/90 text-slate-400 border-white/10 hover:border-white/25 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Zero Results Notice */}
      {filteredArticles.length === 0 && (
        <div className="p-12 rounded-3xl bg-[#111216] border border-white/10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
            <Filter className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white font-sans">No whitepapers matched your query</h3>
          <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
            Try adjusting your search keywords or switch category to view all publications.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase hover:bg-emerald-500/30 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Featured Article Card */}
      {featuredArticle && (
        <div className="space-y-4">
          <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>FEATURED TECHNICAL WHITEPAPER</span>
          </div>

          <article 
            data-cursor-text="WHITEPAPER"
            className="rounded-3xl bg-[#111216]/95 border border-white/15 hover:border-emerald-500/50 p-6 sm:p-12 transition-all duration-300 shadow-2xl relative overflow-hidden group hover-lift"
          >
            {/* Ambient Background Glow */}
            <div 
              className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px] pointer-events-none opacity-20"
              style={{ backgroundColor: featuredArticle.accent }}
            />

            {/* Header Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6 font-mono text-xs">
              <span className="text-emerald-400 font-bold uppercase tracking-widest">
                ARTICLE {featuredArticle.number} // {featuredArticle.categoryDisplay}
              </span>
              <div className="flex items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  {featuredArticle.readTime}
                </span>
                <span>{featuredArticle.publishedAt}</span>
              </div>
            </div>

            {/* Subtitle */}
            <div className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
              {featuredArticle.subtitle}
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4 group-hover:text-emerald-300 transition-colors">
              <Link href={`/insights/${featuredArticle.slug}`}>
                {featuredArticle.title}
              </Link>
            </h2>

            {/* Abstract */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-4xl font-normal">
              {featuredArticle.abstract}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {featuredArticle.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Footer Strip */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
                  {featuredArticle.author.initials}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{featuredArticle.author.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">{featuredArticle.author.role}</div>
                </div>
              </div>

              <Link
                href={`/insights/${featuredArticle.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg button-tactile glow-focus group/cta"
              >
                <span>Read Full Whitepaper</span>
                <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform arrow-slide" />
              </Link>
            </div>
          </article>
        </div>
      )}

      {/* Regular Articles Grid */}
      {regularArticles.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>ALL SYSTEM ARCHITECTURE PUBLICATIONS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regularArticles.map((article) => (
              <article 
                key={article.slug}
                data-cursor-text="READ"
                className="rounded-3xl bg-[#111216]/90 border border-white/10 hover:border-emerald-500/40 p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover-lift"
              >
                {/* Subtle Accent Glow */}
                <div 
                  className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-[100px] pointer-events-none opacity-10 group-hover:opacity-25 transition-opacity"
                  style={{ backgroundColor: article.accent }}
                />

                <div>
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4 font-mono text-xs">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">
                      {article.categoryDisplay}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {article.readTime}
                    </span>
                  </div>

                  <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    {article.subtitle}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-3 group-hover:text-emerald-300 transition-colors">
                    <Link href={`/insights/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-6 line-clamp-3">
                    {article.abstract}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {article.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono font-bold text-emerald-400">
                      {article.author.initials}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 truncate max-w-[150px]">
                      {article.author.name}
                    </div>
                  </div>

                  <Link
                    href={`/insights/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider glow-focus py-1 px-2 rounded-lg group/link"
                  >
                    <span>Read Note</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform arrow-slide" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

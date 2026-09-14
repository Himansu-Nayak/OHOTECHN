import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, User, Tag, Sparkles, FileCode2 } from 'lucide-react';
import { INSIGHT_ARTICLES } from '@/config/insights';

export const metadata: Metadata = {
  title: 'Engineering Insights & Whitepapers | OHO TECH',
  description: 'Deep-dive technical whitepapers, distributed system architectures, and software engineering principles from OHO TECH engineers.',
  openGraph: {
    title: 'Engineering Insights & Whitepapers | OHO TECH',
    description: 'Deep-dive technical whitepapers, distributed system architectures, and software engineering principles from OHO TECH engineers.',
  },
};

export default function InsightsPage() {
  const featuredArticle = INSIGHT_ARTICLES[0];
  const regularArticles = INSIGHT_ARTICLES.slice(1);

  return (
    <main className="min-h-screen bg-[#07080c] text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute top-20 left-1/4 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-emerald-500/5 rounded-full blur-[190px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-cyan-500/5 rounded-full blur-[190px] pointer-events-none" />

      {/* Grid Mesh */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 sm:mb-10 font-mono text-xs text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-400 transition-colors">HOME</Link>
          <span>/</span>
          <span className="text-emerald-400 font-bold">ENGINEERING INSIGHTS</span>
        </nav>

        {/* Page Header */}
        <div className="mb-14 sm:mb-20 pb-10 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            <span>TECHNICAL WHITEPAPERS // SYSTEM DESIGN // 05</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] uppercase mb-6">
            <span>Engineering Insights</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              System Design &amp; Architecture.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
            Technical whitepapers, distributed systems design patterns, and high-concurrency production notes authored by OHO TECH engineers.
          </p>
        </div>

        {/* Featured Article Card */}
        {featuredArticle && (
          <div className="mb-16 sm:mb-20">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>FEATURED WHITEPAPER</span>
            </div>

            <article className="rounded-3xl bg-[#111216]/95 border border-white/15 hover:border-emerald-500/50 p-6 sm:p-12 transition-all duration-300 shadow-2xl relative overflow-hidden group">
              <div 
                className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[140px] pointer-events-none opacity-20"
                style={{ backgroundColor: featuredArticle.accent }}
              />

              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6 font-mono text-xs">
                <span className="text-emerald-400 font-bold uppercase tracking-widest">
                  ARTICLE {featuredArticle.number} // {featuredArticle.category}
                </span>
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-emerald-400" />{featuredArticle.readTime}</span>
                  <span>{featuredArticle.publishedAt}</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4 group-hover:text-emerald-300 transition-colors">
                <Link href={`/insights/${featuredArticle.slug}`}>
                  {featuredArticle.title}
                </Link>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-4xl">
                {featuredArticle.abstract}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
                    HN
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{featuredArticle.author.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{featuredArticle.author.role}</div>
                  </div>
                </div>

                <Link
                  href={`/insights/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg"
                >
                  <span>Read Full Whitepaper</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {regularArticles.map((article) => (
            <article 
              key={article.slug}
              className="rounded-3xl bg-[#111216]/90 border border-white/10 hover:border-emerald-500/40 p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between shadow-2xl relative overflow-hidden group"
            >
              <div>
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4 font-mono text-xs">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">
                    {article.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    {article.readTime}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-3 group-hover:text-emerald-300 transition-colors">
                  <Link href={`/insights/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-6">
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
                <div className="text-[11px] font-mono text-slate-400">
                  By {article.author.name}
                </div>

                <Link
                  href={`/insights/${article.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider"
                >
                  <span>Read Note</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Technical Collaboration Strip */}
        <div className="rounded-3xl bg-[#14151a] border border-white/15 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-2">
              SYSTEM ARCHITECTURE ADVISORY
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Discuss your technical architecture with our engineers
            </h3>
            <p className="text-sm text-slate-300 font-normal max-w-xl">
              We collaborate with enterprise engineering teams to review database schemas, API topologies, and latency budgets.
            </p>
          </div>

          <Link
            href="/contact"
            className="w-full md:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl shrink-0 flex items-center justify-center gap-2"
          >
            <span>START ARCHITECTURE TALK</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  );
}

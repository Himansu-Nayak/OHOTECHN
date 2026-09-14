import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowRight, 
  ArrowLeft,
  BookOpen, 
  Clock, 
  User, 
  Tag, 
  Sparkles, 
  CheckCircle2, 
  Terminal, 
  AlertCircle,
  FileCode2,
  Share2
} from 'lucide-react';
import { INSIGHT_ARTICLES, getInsightArticle } from '@/config/insights';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return INSIGHT_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsightArticle(slug);

  if (!article) {
    return {
      title: 'Whitepaper Not Found | OHO TECH',
    };
  }

  return {
    title: `${article.title} | Engineering Whitepaper | OHO TECH`,
    description: article.abstract,
    openGraph: {
      title: `${article.title} | OHO TECH Engineering Whitepaper`,
      description: article.abstract,
    },
  };
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getInsightArticle(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = INSIGHT_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <main className="min-h-screen bg-[#07080c] text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div 
        className="absolute top-10 right-10 w-96 sm:w-[600px] h-96 sm:h-[600px] rounded-full blur-[190px] pointer-events-none opacity-20"
        style={{ backgroundColor: article.accent }}
      />
      <div className="absolute bottom-20 left-10 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Grid Mesh */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs text-slate-400 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-emerald-400 transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/insights" className="hover:text-emerald-400 transition-colors">ENGINEERING INSIGHTS</Link>
          <span>/</span>
          <span className="text-emerald-400 font-bold truncate max-w-xs">{article.title}</span>
        </nav>

        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/insights" 
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO ALL WHITEPAPERS</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12 sm:mb-16 pb-10 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>WHITEPAPER // {article.number}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-emerald-400" />{article.readTime}</span>
              <span>{article.publishedAt}</span>
            </div>
          </div>

          <div className="text-xs sm:text-sm font-mono font-bold text-slate-400 tracking-[0.2em] uppercase mb-3">
            {article.category}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] uppercase mb-6">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8">
            {article.abstract}
          </p>

          {/* Author Capsule */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#111216]/90 border border-white/10">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              {article.author.name.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-bold text-white">{article.author.name}</div>
              <div className="text-[11px] font-mono text-slate-400">{article.author.role}</div>
            </div>
          </div>
        </header>

        {/* Key Principles Capsule */}
        <section className="mb-12 p-6 sm:p-8 rounded-3xl bg-emerald-950/15 border border-emerald-500/30">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4" />
            <span>ARCHITECTURAL INVARIANTS &amp; DESIGN PRINCIPLES</span>
          </div>
          <div className="space-y-2.5">
            {article.keyPrinciples.map((principle, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-100 leading-relaxed font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{principle}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Article Body Sections */}
        <div className="space-y-12 sm:space-y-16 mb-16">
          {article.sections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {section.heading}
              </h2>
              {section.subheading && (
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  {section.subheading}
                </div>
              )}

              <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                {section.content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>

              {/* Callout box if present */}
              {section.callout && (
                <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 my-6">
                  <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    {section.callout.title}
                  </div>
                  <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed">
                    {section.callout.text}
                  </p>
                </div>
              )}

              {/* Code Snippet if present */}
              {section.codeSnippet && (
                <div className="rounded-2xl bg-black/90 border border-white/15 overflow-hidden my-6 font-mono">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{section.codeSnippet.filename}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 uppercase">{section.codeSnippet.language}</span>
                  </div>
                  <pre className="p-4 sm:p-6 text-xs text-emerald-300/90 overflow-x-auto leading-relaxed">
                    <code>{section.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Verdict Box */}
        <section className="mb-16 p-6 sm:p-8 rounded-3xl bg-[#121318]/95 border border-white/15">
          <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            ENGINEERING SUMMARY &amp; VERDICT
          </div>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            {article.verdict}
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {article.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                #{tag}
              </span>
            ))}
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mb-16 pt-10 border-t border-white/10">
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6">
              More Architecture Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/insights/${rel.slug}`}
                  className="p-6 rounded-2xl bg-[#111216] border border-white/10 hover:border-emerald-500/40 transition-colors group block"
                >
                  <div className="font-mono text-[10px] text-slate-400 uppercase mb-1">{rel.category}</div>
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                    {rel.title}
                  </h4>
                  <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <span>Read Whitepaper</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="rounded-3xl bg-[#14151a] border border-white/15 p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-1">
              SYSTEM DESIGN REVIEW
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
              Consult on your system design
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              Connect with our technical architects to review implementation trade-offs.
            </p>
          </div>

          <Link
            href="/contact"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shrink-0 flex items-center justify-center gap-2"
          >
            <span>GET IN TOUCH</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  );
}

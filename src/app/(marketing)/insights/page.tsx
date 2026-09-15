import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { InsightsHero } from '@/components/insights/InsightsHero';
import { InsightsFilterList } from '@/components/insights/InsightsFilterList';

import { buildMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Engineering Insights & Technical Journal | OHO TECH',
  description: 'Deep-dive technical whitepapers, distributed system architectures, and software engineering principles from OHO TECH engineers.',
  path: '/insights',
});

export default function InsightsPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Engineering Insights', url: '/insights' },
  ];

  return (
    <main className="min-h-screen bg-[#07080c] text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      {/* Ambient Lighting */}
      <div className="absolute top-20 left-1/4 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-emerald-500/5 rounded-full blur-[190px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-cyan-500/5 rounded-full blur-[190px] pointer-events-none" />

      {/* Grid Mesh */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* 1. HERO SECTION WITH EDITORIAL TYPOGRAPHY & METRICS */}
        <InsightsHero />

        {/* 2. INTERACTIVE FILTERABLE INSIGHTS LIST */}
        <InsightsFilterList />

        {/* 3. TECHNICAL COLLABORATION & ADVISORY CTA */}
        <div className="mt-20 rounded-3xl bg-[#14151a] border border-white/15 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-2">
              SYSTEM ARCHITECTURE ADVISORY
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Discuss your technical architecture with our engineers
            </h3>
            <p className="text-sm text-slate-300 font-normal max-w-xl">
              We collaborate directly with enterprise engineering teams to review database schemas, API topologies, and latency budgets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0 w-full md:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <span>START ARCHITECTURE TALK</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/book-demo"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all border border-white/15 flex items-center justify-center"
            >
              BOOK DEMO
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

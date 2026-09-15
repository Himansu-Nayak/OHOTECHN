import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Workflow, Layers, ShieldCheck, Sparkles, Activity, Terminal } from 'lucide-react';
import { TechnologyHero } from '@/components/technology/TechnologyHero';
import { TechnologyExplorer } from '@/components/technology/TechnologyExplorer';
import { AiInnovationExperience } from '@/components/technology/AiInnovationExperience';
import { ArchitectureTopologyMesh } from '@/components/technology/ArchitectureTopologyMesh';
import { TechnologyStatement } from '@/components/home/TechnologyStatement';

import { buildMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Enterprise Technology & AI Architecture | OHO TECH',
  description: 'Inspect OHO TECH\'s distributed system runtimes, high-concurrency microservices, sovereign relational persistence, pragmatic enterprise AI pipelines, and zero-trust security governance.',
  path: '/technology',
});

export default function TechnologyPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Technology & AI', url: '/technology' },
  ];

  return (
    <main className="min-h-screen bg-[#07080c] text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      {/* Precision Technical Mesh Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* 1. HERO SECTION WITH LARGE TYPOGRAPHY */}
        <TechnologyHero />

        {/* 2. 10-DOMAIN INTERACTIVE ARCHITECTURE MATRIX (NO LOGO WALL) */}
        <TechnologyExplorer />

        {/* 3. DEDICATED AI & INTELLIGENT AUTOMATION EXPERIENCE */}
        <AiInnovationExperience />

        {/* 4. END-TO-END SYSTEM TOPOLOGY MESH FLOW */}
        <ArchitectureTopologyMesh />

        {/* 5. ARCHITECTURAL STATEMENT & CODE SOVEREIGNTY */}
        <div className="mb-20">
          <TechnologyStatement />
        </div>

        {/* 6. TECHNICAL AUDIT & ARCHITECTURE REVIEW CTA */}
        <div className="rounded-3xl bg-[#14151a] border border-white/15 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-2">
              TECHNICAL CONSULTATION
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Evaluate your enterprise software architecture
            </h3>
            <p className="text-sm text-slate-300 font-normal max-w-xl">
              Schedule an in-depth architectural assessment with OHO TECH system engineers to review latency budgets, persistence topologies, and AI automation feasibility.
            </p>
          </div>

          <Link
            href="/contact"
            className="w-full md:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl shrink-0 flex items-center justify-center gap-2"
          >
            <span>SCHEDULE ARCHITECTURE REVIEW</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ArrowRight, 
  Workflow, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Database, 
  Globe, 
  Lock, 
  Sparkles, 
  Activity, 
  Server, 
  CheckCircle2,
  Terminal,
  Code2
} from 'lucide-react';
import { TechnologyExperience } from '@/components/home/TechnologyExperience';
import { TechnologyStatement } from '@/components/home/TechnologyStatement';
import { SystemArchitectureFlow } from '@/components/home/SystemArchitectureFlow';

export const metadata: Metadata = {
  title: 'Technology Stack & Architecture Matrix | OHO TECH',
  description: 'Inspect OHO TECH\'s distributed system runtimes, cloud mesh topologies, event-driven pipelines, and cryptographic security governance.',
  openGraph: {
    title: 'Technology Stack & Architecture Matrix | OHO TECH',
    description: 'Inspect OHO TECH\'s distributed system runtimes, cloud mesh topologies, event-driven pipelines, and cryptographic security governance.',
  },
};

export default function TechnologyPage() {
  return (
    <main className="min-h-screen bg-[#07080c] text-white pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-20 left-1/3 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-cyan-500/5 rounded-full blur-[190px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-emerald-500/5 rounded-full blur-[190px] pointer-events-none" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 sm:mb-10 font-mono text-xs text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-400 transition-colors">HOME</Link>
          <span>/</span>
          <span className="text-emerald-400 font-bold">TECHNOLOGY STACK</span>
        </nav>

        {/* Page Hero Header */}
        <div className="mb-16 sm:mb-20 pb-10 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-6">
            <Workflow className="w-3.5 h-3.5" />
            <span>DISTRIBUTED SYSTEMS // CLOUD MESH // GOVERNANCE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.04] uppercase mb-6">
            <span>Technology Foundation</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Deterministic &amp; Resilient.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
            A deep-dive technical specification of OHO TECH&apos;s architectural runtimes, high-throughput microservices, sovereign persistence cores, and cryptographic security protocols.
          </p>
        </div>

        {/* High-Level Technology Experience Matrix */}
        <div className="mb-20">
          <TechnologyExperience />
        </div>

        {/* Architectural Statement Section */}
        <div className="mb-20">
          <TechnologyStatement />
        </div>

        {/* System Architecture Flow */}
        <div className="mb-20">
          <SystemArchitectureFlow />
        </div>

        {/* CTA Strip */}
        <div className="rounded-3xl bg-[#14151a] border border-white/15 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-2">
              TECHNICAL AUDIT
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Evaluate your enterprise software architecture
            </h3>
            <p className="text-sm text-slate-300 font-normal max-w-xl">
              Schedule an in-depth architectural consultation with OHO TECH system architects to review latency budgets and deployment topologies.
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

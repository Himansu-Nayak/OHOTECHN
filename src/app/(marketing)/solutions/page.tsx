import Link from 'next/link';
import { industries } from '@/config/industries';
import * as Icons from 'lucide-react';
import { ArrowRight, Layers } from 'lucide-react';

function DynamicIcon({ name, ...props }: { name: string } & Icons.LucideProps) {
  const Icon = Icons[name as keyof typeof Icons] as Icons.LucideIcon;
  if (!Icon) return <Layers {...props} />;
  return <Icon {...props} />;
}

export default function SolutionsHubPage() {
  return (
    <div className="bg-[#f8f9fb] text-[#0f172a] min-h-screen pb-20 pt-28 sm:pt-36 px-4 sm:px-6 lg:px-8 selection:bg-slate-900 selection:text-white">
      <main className="max-w-7xl mx-auto" id="solutions-hub-main">
        
        {/* Header Hero */}
        <section className="text-center max-w-4xl mx-auto mb-16" id="solutions-hero">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 block mb-3">
            Industry Solutions
          </span>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 mb-6 leading-tight" id="solutions-hero-heading">
            Tailored Technology &amp; Infrastructure for Every Sector.
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed" id="solutions-hero-desc">
            Discover comprehensive software solutions and digital infrastructure designed specifically to streamline operations, automate workflows, and drive efficiency.
          </p>
        </section>

        {/* Industry Grid */}
        <section id="industries" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Domain Expertise
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">
                Industry Solution Modules
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind) => (
              <Link
                key={ind.slug}
                href={`/solutions/${ind.slug}`}
                className="corporate-card p-7 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 mb-5 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                    <DynamicIcon name={ind.iconName} className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 mb-2 group-hover:text-teal-700 transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {ind.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-teal-700">
                  <span>{ind.products.length} Core Modules</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-20 p-10 rounded-2xl bg-[#090a0f] text-white text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Need a Customized Enterprise Solution?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Our engineering team designs custom enterprise systems tailored to your unique organizational requirements.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white hover:bg-slate-100 text-slate-950 text-xs font-semibold transition-colors"
            >
              <span>Consult Our Architecture Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

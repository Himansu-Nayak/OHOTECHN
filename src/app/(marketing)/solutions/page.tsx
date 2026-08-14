// src/app/(marketing)/solutions/page.tsx
import Link from 'next/link';
import { industries } from '@/config/industries';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';

function DynamicIcon({ name, ...props }: { name: string } & Icons.LucideProps) {
  const Icon = Icons[name as keyof typeof Icons] as Icons.LucideIcon;
  if (!Icon) return null;
  return <Icon {...props} />;
}

export default function SolutionsHubPage() {
  return (
    <main className="bg-white" id="solutions-hub-main">
      {/* Hero Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center" id="solutions-hero">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase mb-4" id="solutions-hero-eyebrow">Solutions by Industry</p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6" id="solutions-hero-heading">
          Tailored Software for Every Industry
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto" id="solutions-hero-desc">
          Discover comprehensive, scalable solutions designed specifically to meet the unique challenges and opportunities of your sector.
        </p>
      </section>

      {/* Grid Section */}
      <section className="pb-20 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="solutions-grid-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="solutions-grid">
          {industries.map((industry) => (
            <Link
              key={industry.slug}
              href={`/solutions/${industry.slug}`}
              id={`solution-card-${industry.slug}`}
              className="group block p-8 bg-white border border-neutral-100 rounded-2xl hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <div className="relative">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <DynamicIcon name={industry.iconName} className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{industry.name}</h3>
                <p className="text-slate-600 mb-6 line-clamp-3">{industry.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                    {industry.products.length} {industry.products.length === 1 ? 'Product' : 'Products'}
                  </span>
                  <span className="text-primary font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    Explore <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

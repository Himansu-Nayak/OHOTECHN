import { notFound } from 'next/navigation';
import Link from 'next/link';
import { industries } from '@/config/industries';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export async function generateMetadata(props: { params: Promise<{ industry: string }> }): Promise<Metadata> {
  const { industry: industrySlug } = await props.params;
  const industry = industries.find((i) => i.slug === industrySlug);
  
  if (!industry) {
    return { title: 'Industry Not Found | OHO TECH' };
  }

  return {
    title: `${industry.name} Solutions | OHO TECH`,
    description: industry.description,
  };
}

export default async function IndustryDetailPage(props: { params: Promise<{ industry: string }> }) {
  const { industry: industrySlug } = await props.params;
  const industry = industries.find((i) => i.slug === industrySlug);

  if (!industry) {
    notFound();
  }

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white" id={`industry-detail-${industry.slug}`}>
      <main className="max-w-[1536px] w-full mx-auto">
        
        {/* Industry Hero Section */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm text-center mb-10 relative overflow-hidden grid-pattern-light" id="industry-hero">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              OHO TECH INDUSTRY SOLUTIONS
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0d0d0e] mb-6 leading-[1.08]" id="industry-hero-heading">
              {industry.name} Software Ecosystem
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal max-w-3xl mx-auto leading-relaxed" id="industry-hero-desc">
              {industry.description}
            </p>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm mb-10" id="industry-products">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-2">
                SYSTEM MODULES
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight">
                {industry.name} Applications &amp; ERP Modules ({industry.products.length})
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-500">
              Customizable &amp; Deployment Ready
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="industry-products-grid">
            {industry.products.map((product) => (
              <div
                key={product.slug}
                className="p-8 bg-[#fafafa] border-2 border-slate-200 hover:border-sky-500 rounded-3xl transition-all duration-300 flex flex-col justify-between hover:shadow-lg relative"
                id={`product-card-${product.slug}`}
              >
                <div>
                  <div className="text-[11px] font-mono font-bold text-sky-600 uppercase tracking-wider mb-2">
                    OHO SOLUTION MODULE
                  </div>
                  <h3 className="text-xl font-bold text-[#0d0d0e] mb-3">{product.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">{product.shortDescription}</p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href="/get-quote"
                    id={`get-quote-${product.slug}`}
                    className="px-5 py-2.5 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md"
                  >
                    Get Quote
                  </Link>

                  <Link
                    href="/book-demo"
                    id={`book-demo-${product.slug}`}
                    className="px-5 py-2.5 rounded-full bg-[#ebebe8] hover:bg-[#e2e2de] text-[#0d0d0e] font-extrabold text-xs uppercase tracking-wider transition-all"
                  >
                    Book Demo
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#0d0d0e] text-white border-2 border-slate-700 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-16 text-center shadow-2xl relative overflow-hidden" id="industry-cta">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Need a custom {industry.name} solution?</h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto">
              Our engineering team can build software tailored precisely to your operational requirements and existing database integrations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/get-quote"
                id="get-quote-cta"
                className="px-8 py-4 rounded-full bg-white hover:bg-sky-400 text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg inline-flex items-center gap-2"
              >
                <span>Get a Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { industries } from '@/config/industries';
import { ArrowRight } from 'lucide-react';
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
    <main className="bg-white min-h-screen" id={`industry-detail-${industry.slug}`}>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center" id="industry-hero">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase mb-4" id="industry-hero-eyebrow">
          Industry Solutions
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6" id="industry-hero-heading">
          {industry.name}
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto" id="industry-hero-desc">
          {industry.description}
        </p>
      </section>

      {/* Products Grid */}
      <section className="pb-20 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="industry-products">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="industry-products-grid">
          {industry.products.map((product) => (
            <div key={product.slug} className="p-8 bg-white border border-neutral-100 rounded-2xl hover:shadow-lg transition-shadow flex flex-col h-full" id={`product-card-${product.slug}`}>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{product.name}</h3>
              <p className="text-slate-600 mb-6 flex-grow">{product.shortDescription}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link
                  href="/book-demo"
                  id={`book-demo-${product.slug}`}
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors"
                >
                  Book Demo
                </Link>
                <Link
                  href={`/products/${product.slug}`}
                  id={`learn-more-${product.slug}`}
                  className="inline-flex justify-center items-center px-6 py-3 border border-neutral-200 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50 border-t border-neutral-100" id="industry-cta">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Need a custom solution?</h2>
          <p className="text-lg text-slate-600 mb-8">
            Our experts can build software tailored precisely to your unique requirements.
          </p>
          <Link
            href="/get-quote"
            id="get-quote-cta"
            className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            Get a Quote <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

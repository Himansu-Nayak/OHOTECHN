// src/app/(marketing)/services/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { services } from '@/config/services';
import { ArrowRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import { Metadata } from 'next';
import * as Icons from 'lucide-react';

import { Enterprise3DCard } from '@/components/services/Enterprise3DCard';
import { FeaturesSlider } from '@/components/services/FeaturesSlider';
import { DeliveryRoadmap } from '@/components/services/DeliveryRoadmap';

function DynamicIcon({ name, ...props }: { name: string } & Icons.LucideProps) {
  const Icon = Icons[name as keyof typeof Icons] as Icons.LucideIcon;
  if (!Icon) return <Layers {...props} />;
  return <Icon {...props} />;
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const service = services.find((s) => s.slug === slug);
  
  if (!service) {
    return { title: 'Service Not Found | OHO TECH' };
  }

  return {
    title: `${service.name} Services | OHO TECH`,
    description: service.description,
  };
}

export default async function ServiceDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white" id={`service-detail-${service.slug}`}>
      <main className="max-w-[1536px] w-full mx-auto">
        
        {/* Service Hero Section */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm mb-10 relative overflow-hidden grid-pattern-light" id="service-hero">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                OHO TECH {service.category.toUpperCase()} SERVICE
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0d0d0e] mb-6 leading-[1.08]" id="service-title">
                {service.name}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed" id="service-desc">
                {service.description}
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href={`/contact?service=${service.slug}`}
                  id="hero-get-started"
                  className="px-8 py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg inline-flex items-center gap-2"
                >
                  <span>Get Started with {service.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md">
              <Enterprise3DCard service={service} />
            </div>
          </div>
        </section>

        {/* Features Section */}
        {service.features && service.features.length > 0 && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm mb-10" id="service-features">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-200">
              <div>
                <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-2">
                  DELIVERABLES &amp; CAPABILITIES
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight">
                  Key Features &amp; Technical Scope
                </h2>
              </div>
              <p className="text-xs font-mono text-slate-500">
                Rigorous Specifications &amp; Quality Control
              </p>
            </div>

            <FeaturesSlider features={service.features} />
          </section>
        )}

        {/* Process Section - Delivery Roadmap */}
        <DeliveryRoadmap />

        {/* CTA Section */}
        <section className="bg-[#0d0d0e] text-white border-2 border-slate-700 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-16 text-center shadow-2xl relative overflow-hidden" id="service-final-cta">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to elevate your {service.name.toLowerCase()}?</h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto">
              Contact us today to discuss your project requirements and receive a custom engineering proposal.
            </p>
            <Link
              href="/contact"
              id="final-contact-cta"
              className="px-8 py-4 rounded-full bg-white hover:bg-sky-400 text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg inline-flex items-center gap-2"
            >
              <span>Let&apos;s Talk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

// src/app/(marketing)/services/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { services } from '@/config/services';
import { cn } from '@/lib/utils';
import { ArrowRight, CheckCircle2, Settings } from 'lucide-react';
import { Metadata } from 'next';
import * as Icons from 'lucide-react';

function DynamicIcon({ name, ...props }: { name: string } & Icons.LucideProps) {
  const Icon = Icons[name as keyof typeof Icons] as Icons.LucideIcon;
  if (!Icon) return null;
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
    <main className="bg-white min-h-screen" id={`service-detail-${service.slug}`}>
      {/* Hero Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="service-hero">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
              <DynamicIcon name={service.iconName || 'Settings'} className="w-10 h-10" />
            </div>
            <p className="text-sm font-semibold tracking-wide text-primary uppercase mb-4" id="service-category">
              {service.category}
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6" id="service-title">
              {service.name}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-8" id="service-desc">
              {service.description}
            </p>
            <Link
              href={`/contact?service=${service.slug}`}
              id="hero-get-started"
              className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started with {service.name} <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
             <div className="aspect-square rounded-3xl bg-slate-50 border border-neutral-100 p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <DynamicIcon name={service.iconName || 'Settings'} className="w-48 h-48 text-primary/20" />
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {service.features && service.features.length > 0 && (
        <section className="py-20 bg-slate-50" id="service-features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Key Features & Capabilities</h2>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-start p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm" id={`feature-${idx}`}>
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mr-4 mt-0.5" />
                  <p className="text-lg font-medium text-slate-700">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="service-process">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How We Deliver</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Our proven methodology ensures consistent, high-quality results.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-neutral-100 z-0"></div>
          
          {[
            { step: '01', title: 'Discovery & Planning', desc: 'We analyze your requirements and chart a strategic roadmap.' },
            { step: '02', title: 'Design & Strategy', desc: 'Crafting the blueprint, architecture, and core approach.' },
            { step: '03', title: 'Execution & Dev', desc: 'Building and executing with precision and agile methodology.' },
            { step: '04', title: 'Review & Launch', desc: 'Rigorous testing, final adjustments, and successful deployment.' },
          ].map((process, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center group" id={`process-step-${i}`}>
              <div className="w-24 h-24 bg-white border-4 border-neutral-50 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-primary/20 transition-colors">
                <span className="text-2xl font-bold text-primary">{process.step}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{process.title}</h3>
              <p className="text-slate-600">{process.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900" id="service-final-cta">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to elevate your {service.name.toLowerCase()}?</h2>
          <p className="text-slate-400 text-lg mb-8">
            Contact us today to discuss your project requirements and get a custom proposal.
          </p>
          <Link
            href="/contact"
            id="final-contact-cta"
            className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-slate-900 bg-white hover:bg-neutral-100 transition-colors"
          >
            Let&apos;s Talk <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

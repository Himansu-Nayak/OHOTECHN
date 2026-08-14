// src/app/(marketing)/services/page.tsx
import Link from 'next/link';
import { services } from '@/config/services';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

function DynamicIcon({ name, ...props }: { name: string } & Icons.LucideProps) {
  const Icon = Icons[name as keyof typeof Icons] as Icons.LucideIcon;
  if (!Icon) return null;
  return <Icon {...props} />;
}

export default function ServicesHubPage() {
  const techServices = services.filter(s => s.category === 'technology');
  const digitalServices = services.filter(s => s.category === 'marketing');

  return (
    <main className="bg-white" id="services-hub-main">
      {/* Hero Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center" id="services-hero">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase mb-4" id="services-hero-eyebrow">Our Services</p>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6" id="services-hero-heading">
          Expert Solutions to Propel Your Business
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto" id="services-hero-desc">
          From cutting-edge technology development to results-driven digital marketing, we provide end-to-end services to accelerate your growth.
        </p>
      </section>

      {/* Technology Services */}
      {techServices.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="tech-services-section">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Technology Services</h2>
            <div className="w-20 h-1 bg-primary rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="tech-services-grid">
            {techServices.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </section>
      )}

      {/* Digital Marketing Services */}
      {digitalServices.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50 rounded-3xl mb-20" id="digital-services-section">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Digital Marketing Services</h2>
            <div className="w-20 h-1 bg-primary rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="digital-services-grid">
            {digitalServices.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA Banner */}
      <section className="py-20 bg-primary" id="services-bottom-cta">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to transform your business?</h2>
          <p className="text-primary-100 text-lg mb-8">
            Let&apos;s discuss how our services can help you achieve your goals faster.
          </p>
          <Link
            href="/contact"
            id="services-contact-cta"
            className="inline-flex justify-center items-center px-8 py-4 text-lg font-medium rounded-lg text-primary bg-white hover:bg-neutral-50 transition-colors shadow-lg hover:shadow-xl"
          >
            Schedule a Consultation <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function ServiceCard({ service }: { service: any }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      id={`service-card-${service.slug}`}
      className="flex flex-col p-6 bg-white border border-neutral-100 rounded-2xl hover:shadow-xl transition-all duration-300 group"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
        <DynamicIcon name={service.iconName} className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{service.name}</h3>
      <p className="text-slate-600 mb-6 text-sm flex-grow line-clamp-3">{service.description}</p>
      
      {service.features && service.features.length > 0 && (
        <ul className="mb-6 space-y-2">
          {service.features.slice(0, 3).map((feature: string, idx: number) => (
            <li key={idx} className="flex items-start text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{feature}</span>
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
        Learn More <ArrowRight className="w-4 h-4 ml-1" />
      </div>
    </Link>
  );
}

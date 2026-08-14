// src/app/(marketing)/services/page.tsx
import Link from 'next/link';
import { services, Service } from '@/config/services';
import * as Icons from 'lucide-react';
import { ArrowRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';

function DynamicIcon({ name, ...props }: { name: string } & Icons.LucideProps) {
  const Icon = Icons[name as keyof typeof Icons] as Icons.LucideIcon;
  if (!Icon) return <Layers {...props} />;
  return <Icon {...props} />;
}

export default function ServicesHubPage() {
  const techServices = services.filter((s) => s.category === 'technology');
  const digitalServices = services.filter((s) => s.category === 'marketing');

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="services-hub-main">
        
        {/* Services Hero Section */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm text-center mb-10 relative overflow-hidden grid-pattern-light" id="services-hero">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              OHO TECH CORE SERVICES
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0d0d0e] mb-6 leading-[1.08]" id="services-hero-heading">
              Engineering &amp; Growth Services for Modern Business.
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed" id="services-hero-desc">
              From bespoke software architecture and cross-platform mobile apps to data-driven digital growth strategies, we deliver end-to-end solutions tailored to your operational goals.
            </p>
          </div>
        </section>

        {/* Technology Services Grid */}
        {techServices.length > 0 && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm mb-10" id="tech-services-section">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-200">
              <div>
                <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-2">
                  01 / SOFTWARE &amp; ENGINEERING
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight">
                  Technology Development Services
                </h2>
              </div>
              <p className="text-xs font-mono text-slate-500">
                Custom Architecture • Full-Stack Development
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="tech-services-grid">
              {techServices.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </section>
        )}

        {/* Digital Growth Services Grid */}
        {digitalServices.length > 0 && (
          <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm mb-10" id="digital-services-section">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-200">
              <div>
                <div className="inline-block text-xs font-mono font-bold text-amber-600 uppercase tracking-widest mb-2">
                  02 / DIGITAL GROWTH &amp; MARKETING
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight">
                  Customer Acquisition &amp; Brand Growth
                </h2>
              </div>
              <p className="text-xs font-mono text-slate-500">
                Data-Driven SEO • Performance Marketing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="digital-services-grid">
              {digitalServices.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA Banner */}
        <section className="bg-[#0d0d0e] text-white border-2 border-slate-700 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-16 text-center shadow-2xl relative overflow-hidden" id="services-bottom-cta">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to build or scale your software?</h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto">
              Schedule a technical consultation with our engineering team to discuss your project requirements and scope.
            </p>
            <Link
              href="/contact"
              id="services-contact-cta"
              className="px-8 py-4 rounded-full bg-white hover:bg-sky-400 text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg inline-flex items-center gap-2"
            >
              <span>Schedule a Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      id={`service-card-${service.slug}`}
      className="group p-8 bg-[#fafafa] border-2 border-slate-200 hover:border-sky-500 rounded-3xl transition-all duration-300 flex flex-col justify-between hover:shadow-lg relative overflow-hidden"
    >
      <div>
        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300">
          <DynamicIcon name={service.iconName} className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-[#0d0d0e] mb-3 group-hover:text-sky-600 transition-colors">{service.name}</h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-6 line-clamp-3">{service.description}</p>
        
        {service.features && service.features.length > 0 && (
          <ul className="mb-6 space-y-2">
            {service.features.slice(0, 3).map((feature: string, idx: number) => (
              <li key={idx} className="flex items-start text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-sky-600">
        <span>Learn More</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

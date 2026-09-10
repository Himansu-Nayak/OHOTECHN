'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Globe, 
  Smartphone, 
  Layers, 
  Building2, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Wrench
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  slug: string;
  desc: string;
  deliverables: string[];
  techStack: string[];
  icon: React.ElementType;
}

const realServices: ServiceItem[] = [
  {
    id: 'custom-software',
    title: 'Custom Software & Enterprise ERP',
    category: 'Enterprise Engineering',
    slug: 'custom-software-development',
    desc: 'Full-cycle engineering of bespoke enterprise platforms tailored to exact business workflows, automating inventory, HRMS, and multi-facility operations.',
    deliverables: [
      'Tailored business logic and role-based access controls',
      'Automated invoice generation & accounting ledger sync',
      'Scalable database design with automated daily backups'
    ],
    techStack: ['Next.js', 'Spring Boot', 'PostgreSQL', 'Docker'],
    icon: Building2
  },
  {
    id: 'web-engineering',
    title: 'Corporate Websites & Web Applications',
    category: 'Web Platform Engineering',
    slug: 'website-development',
    desc: 'High-performance web applications built for speed, conversion, and global search visibility with server-side rendering and sub-second load times.',
    deliverables: [
      'Server-side rendered responsive web interfaces',
      'Technical SEO architecture with rich schema markup',
      'Secure headless CMS & customer portal integrations'
    ],
    techStack: ['React 19', 'Next.js Turbopack', 'Tailwind CSS', 'TypeScript'],
    icon: Globe
  },
  {
    id: 'mobile-development',
    title: 'Native Android & iOS Applications',
    category: 'Mobile Engineering',
    slug: 'android-app-development',
    desc: 'Tactile native and hybrid mobile applications designed for high retention, offline reliability, push notifications, and seamless device hardware integration.',
    deliverables: [
      'Native Kotlin & Swift user interface engineering',
      'Offline-first SQLite local persistence & sync engine',
      'Secure biometric authentication and payment gateway SDKs'
    ],
    techStack: ['Kotlin', 'Swift', 'React Native', 'Firebase'],
    icon: Smartphone
  },
  {
    id: 'api-architecture',
    title: 'API Integrations & Payment Gateways',
    category: 'Systems Integration',
    slug: 'api-integration',
    desc: 'Resilient middleware bridges connecting internal software tools to payment gateways, telecom APIs, shipping aggregators, and legacy databases.',
    deliverables: [
      'Razorpay & Stripe payment gateway integrations with webhooks',
      'Resend SMTP direct email and WhatsApp message dispatchers',
      'Standardized RESTful & GraphQL API contract specifications'
    ],
    techStack: ['REST APIs', 'Webhooks', 'JWT', 'Nginx Gateway'],
    icon: Layers
  },
  {
    id: 'digital-growth',
    title: 'SEO & Performance Digital Marketing',
    category: 'Commercial Growth',
    slug: 'seo',
    desc: 'Technical SEO audits, organic ranking acceleration, Google Ads management, and high-conversion funnel optimization for measurable business growth.',
    deliverables: [
      'Core Web Vitals acceleration & technical SEO auditing',
      'Targeted search & display lead generation campaigns',
      'Customer acquisition funnel tracking & analytics dashboards'
    ],
    techStack: ['Google Search Console', 'Google Analytics 4', 'Meta Ads', 'Schema.org'],
    icon: TrendingUp
  }
];

export function ServicesExplorer() {
  const [selectedService, setSelectedService] = React.useState<string>(realServices[0].id);
  const activeService = realServices.find((s) => s.id === selectedService) || realServices[0];

  return (
    <section id="services-explorer" className="max-w-[1536px] w-full mx-auto mb-10 sm:mb-16 px-4 sm:px-8 lg:px-12 py-12 sm:py-16 bg-[#0d0d0e] text-white border-2 border-slate-800 rounded-[28px] sm:rounded-[44px] shadow-2xl relative overflow-hidden grid-pattern-dark">
      
      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mb-8 sm:mb-12 relative z-10">
        <ScrollReveal yOffset={15} duration={0.6}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>ENGINEERING SERVICES SUITE</span>
          </div>
        </ScrollReveal>

        <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-[1.1] mb-3">
            End-to-End Technology Services.
          </h2>
          <p className="text-xs sm:text-base text-slate-300 font-normal leading-relaxed">
            From architectural discovery to deployment and post-launch scaling, our engineering team builds software that solves operational bottlenecks.
          </p>
        </ScrollReveal>
      </div>

      {/* Interactive Two-Column Service Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 relative z-10 items-start">
        
        {/* Left Column: Service Selector List */}
        <div className="lg:col-span-5 space-y-2.5">
          {realServices.map((service) => {
            const Icon = service.icon;
            const isSelected = service.id === selectedService;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedService(service.id)}
                onMouseEnter={() => setSelectedService(service.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 group ${
                  isSelected
                    ? 'bg-white/10 border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.15)] translate-x-1'
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-colors ${
                    isSelected ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">
                      {service.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      {service.category}
                    </span>
                  </div>
                </div>

                <ArrowRight className={`w-4 h-4 transition-transform duration-200 ${
                  isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Right Column: Detailed Service Delivery Breakdown */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl sm:rounded-3xl bg-[#141416] border border-white/15 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-0.5">
                  SERVICE SCOPE &amp; SPECIFICATION
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {activeService.title}
                </h3>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                Dedicated Team
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
              {activeService.desc}
            </p>

            {/* Core Deliverables */}
            <div className="space-y-3 mb-6">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                KEY DELIVERABLES &amp; STANDARDS
              </span>
              {activeService.deliverables.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Tech Badges & CTA */}
            <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {activeService.techStack.map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>

              <Link
                href={`/services/${activeService.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider font-mono transition-all"
              >
                <span>View Full Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}

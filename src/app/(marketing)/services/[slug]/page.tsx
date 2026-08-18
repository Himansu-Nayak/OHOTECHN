// src/app/(marketing)/services/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { services } from '@/config/services';
import { ArrowRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import { Metadata } from 'next';
import * as Icons from 'lucide-react';

import { Enterprise3DCard } from '@/components/services/Enterprise3DCard';

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {service.features.map((feature: string, idx: number) => {
                const lower = feature.toLowerCase();
                let imagePath: string | null = null;
                if (lower.includes('content planning')) {
                  imagePath = '/images/service-capabilities/content-planning.jpg';
                } else if (lower.includes('graphic') || lower.includes('video') || lower.includes('production')) {
                  imagePath = '/images/service-capabilities/graphic-video-production.jpg';
                } else if (lower.includes('community') || lower.includes('moderation')) {
                  imagePath = '/images/service-capabilities/community-moderation.jpg';
                } else if (lower.includes('audience') || lower.includes('insights')) {
                  imagePath = '/images/service-capabilities/audience-insights.jpg';
                } else if (lower.includes('influencer') || lower.includes('outreach')) {
                  imagePath = '/images/service-capabilities/influencer-outreach.jpg';
                }

                if (imagePath) {
                  return (
                    <div key={idx} className="md:col-span-2 lg:col-span-1 p-6 bg-[#fafafa] border-2 border-slate-200 rounded-3xl flex flex-col justify-between" id={`feature-${idx}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
                        <p className="text-base font-extrabold text-[#0d0d0e]">{feature}</p>
                      </div>
                      
                      {/* Orange Wave Background Image Frame */}
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-orange-400/30 bg-gradient-to-b from-[#ff5e1a] via-[#e03a08] to-[#7a0303] p-3 shadow-lg flex items-center justify-center">
                        {/* Wave Accents */}
                        <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none overflow-hidden">
                          <svg className="absolute bottom-4 w-full h-16 text-[#b81206] fill-current opacity-90" viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <path d="M0,160C320,220,640,220,960,160C1120,130,1280,130,1440,160L1440,320L0,320Z" />
                          </svg>
                          <svg className="absolute bottom-0 w-full h-20 text-[#580000] fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <path d="M0,224C360,265,720,265,1080,224C1260,203,1350,203,1440,224L1440,320L0,320Z" />
                          </svg>
                        </div>
                        {/* Uncropped Image */}
                        <div className="relative z-10 w-full h-full rounded-xl overflow-hidden shadow-xl border border-white/25 flex items-center justify-center bg-black/20">
                          <Image
                            src={imagePath}
                            alt={`${feature} Visual`}
                            fill
                            sizes="(max-width: 768px) 100vw, 360px"
                            className="object-contain object-center p-1"
                          />
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={idx} className="p-7 bg-[#fafafa] border-2 border-slate-200 rounded-3xl flex items-start gap-4" id={`feature-${idx}`}>
                    <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-bold text-[#0d0d0e] leading-snug">{feature}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Process Section */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm mb-10" id="service-process">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-2">
                DELIVERY METHODOLOGY
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight">
                How We Execute &amp; Deliver
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-500">
              4-Phase Structured Development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Discovery & Planning', desc: 'Analyzing technical requirements and mapping architecture.' },
              { step: '02', title: 'Design & Strategy', desc: 'Crafting UI/UX prototypes, schemas, and system workflows.' },
              { step: '03', title: 'Agile Execution', desc: 'Building codebases with continuous integration and security.' },
              { step: '04', title: 'QA & Launch', desc: 'Comprehensive testing, server deployment, and handoff.' },
            ].map((process, i) => (
              <div key={i} className="p-7 bg-[#fafafa] border-2 border-slate-200 rounded-3xl flex flex-col justify-between" id={`process-step-${i}`}>
                <div>
                  <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 inline-block mb-4">
                    PHASE {process.step}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0d0d0e] mb-2">{process.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{process.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

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

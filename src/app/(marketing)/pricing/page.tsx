// src/app/(marketing)/pricing/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Code2, Layers, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing & Engagement Models | OHO TECH',
  description: 'Transparent enterprise software engagement models, project-based engineering, dedicated developer pods, and managed digital growth retainers.',
};

const engagementModels = [
  {
    id: 'custom-project',
    name: 'Custom Project Engineering',
    tag: 'FIXED SCOPE & MILESTONES',
    description: 'Ideal for building bespoke software applications, web portals, mobile apps, or enterprise ERP systems with clear specifications.',
    badge: 'Popular for Software',
    icon: Code2,
    features: [
      'Tailored System Architecture & DB Schema',
      'End-to-End Frontend & Backend Development',
      'Quality Assurance & Security Audit',
      'Deployment & Server Setup',
      'Post-Launch Warranty & Documentation',
    ],
    cta: 'Request Project Quote',
    href: '/get-quote',
    highlighted: false,
  },
  {
    id: 'dedicated-pod',
    name: 'Dedicated Developer Pod',
    tag: 'LONG-TERM PLATFORM TEAM',
    description: 'Full-time dedicated software developers, mobile engineers, and lead architects acting as an extension of your team.',
    badge: 'Best for Scaling Apps',
    icon: Layers,
    features: [
      'Dedicated Senior Engineers & Tech Lead',
      'Agile Sprint Planning & Weekly Demos',
      'Direct Communication via Slack/Teams',
      'Continuous Integration & Code Reviews',
      'Flexible Scaling (Add/Remove Engineers)',
    ],
    cta: 'Book Technical Consultation',
    href: '/book-demo',
    highlighted: true,
  },
  {
    id: 'growth-retainer',
    name: 'Managed Digital Growth',
    tag: 'MONTHLY PERFORMANCE RETAINER',
    description: 'Strategic search engine optimization, Google & Meta advertising campaign management, and conversion rate optimization.',
    badge: 'Best for Customer Reach',
    icon: TrendingUp,
    features: [
      'Data-Driven Technical & Content SEO',
      'Google Ads & Meta Ads Campaign Setup',
      'Landing Page Conversion Optimization',
      'Monthly Analytics & Performance Reports',
      'Dedicated Marketing Strategist',
    ],
    cta: 'Explore Growth Plans',
    href: '/contact',
    highlighted: false,
  },
];

const faqs = [
  {
    question: 'How are custom software development projects priced?',
    answer: 'Custom projects are estimated based on technical requirements, feature scope, third-party integrations, and timeline. We provide a comprehensive milestone-based proposal after an initial discovery phase.',
  },
  {
    question: 'What is included in a Dedicated Developer Pod?',
    answer: 'A dedicated pod gives you full-time access to experienced software developers, UI designers, and a lead architect managed under OHO TECH engineering standards.',
  },
  {
    question: 'Do you provide post-launch maintenance and support?',
    answer: 'Yes, all custom engineering projects include post-launch support. We also offer dedicated SLA maintenance retainers for continuous updates and server monitoring.',
  },
  {
    question: 'Can we combine custom software development with digital growth services?',
    answer: 'Absolutely. Many client partners build custom web or mobile platforms with our engineering team and concurrently run managed SEO and advertising campaigns to acquire customers.',
  },
];

export default async function PricingPage() {
  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="pricing-main">
        
        {/* Header Hero Section */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm text-center mb-10 relative overflow-hidden grid-pattern-light" id="pricing-hero">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              TRANSPARENT ENGAGEMENT MODELS
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0d0d0e] mb-6 leading-[1.08]">
              Transparent Software &amp; Growth Models.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              We offer structured project-based quotes, dedicated engineering teams, and performance marketing retainers tailored to your business stage.
            </p>
          </div>
        </section>

        {/* Engagement Models Grid */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm mb-10" id="engagement-models-section">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-2">
                ENGAGEMENT OPTIONS
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight">
                How We Partner With You
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-500">
              No Hidden Fees • Milestone Based Delivery
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {engagementModels.map((model) => {
              const Icon = model.icon;

              return (
                <div
                  key={model.id}
                  className={`p-8 rounded-3xl border-2 flex flex-col justify-between transition-all duration-300 ${
                    model.highlighted
                      ? 'bg-[#0d0d0e] text-white border-slate-700 shadow-2xl ring-2 ring-sky-400/30'
                      : 'bg-[#fafafa] text-[#0d0d0e] border-slate-200 hover:border-sky-500 hover:shadow-lg'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${
                        model.highlighted ? 'text-sky-300 bg-sky-500/10 border-sky-500/20' : 'text-sky-700 bg-sky-50 border-sky-200'
                      }`}>
                        {model.tag}
                      </span>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        model.highlighted ? 'bg-white/10 text-white' : 'bg-sky-50 text-sky-600 border border-sky-100'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-black mb-3">{model.name}</h3>
                    <p className={`text-xs leading-relaxed mb-6 ${model.highlighted ? 'text-slate-300' : 'text-slate-600'}`}>
                      {model.description}
                    </p>

                    {/* Features list */}
                    <div className="pt-4 border-t border-slate-200/40 space-y-3 mb-8">
                      <div className={`text-[11px] font-mono font-bold uppercase tracking-wider mb-2 ${
                        model.highlighted ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        KEY DELIVERABLES &amp; INCLUSIONS
                      </div>
                      {model.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs font-medium">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${model.highlighted ? 'text-sky-400' : 'text-sky-600'}`} />
                          <span className={model.highlighted ? 'text-slate-200' : 'text-slate-700'}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Link */}
                  <Link
                    href={model.href}
                    className={`w-full py-4 rounded-full text-center font-extrabold text-xs uppercase tracking-wider transition-all shadow-md inline-flex items-center justify-center gap-2 ${
                      model.highlighted
                        ? 'bg-white hover:bg-sky-400 text-[#0d0d0e]'
                        : 'bg-[#0d0d0e] hover:bg-sky-600 text-white'
                    }`}
                  >
                    <span>{model.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

        </section>

        {/* FAQs Section */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm" id="faqs-section">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-2">
                FREQUENTLY ASKED QUESTIONS
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight">
                Clear Answers to Common Questions
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="p-7 bg-[#fafafa] border-2 border-slate-200 rounded-3xl">
                  <h3 className="text-lg font-bold text-[#0d0d0e] mb-2">{faq.question}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

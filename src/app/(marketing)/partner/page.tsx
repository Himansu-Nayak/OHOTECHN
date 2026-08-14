import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Sparkles, ArrowRight, Handshake, ShieldCheck, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Partner Ecosystem & Collaboration | OHO TECH',
  description: 'Join the OHO TECH enterprise partner ecosystem. Reseller programs, agency collaboration, and technical developer integration partnerships.',
};

const partnerTypes = [
  {
    name: 'Reseller & System Integrator',
    description: 'Provide OHO TECH turnkey software platforms (Hospital EMR, Campus ERP, Retail POS) directly to your clients with dedicated implementation support.',
    tag: 'SYSTEM INTEGRATORS',
    benefits: [
      'Competitive revenue share & margins',
      'White-label & co-branded options',
      'Dedicated partner success manager',
      'Sales collateral & technical demos',
    ],
  },
  {
    name: 'Agency & Studio Partner',
    description: 'Leverage our full-stack engineering team to build custom web applications, mobile platforms, and growth campaigns for your agency clients.',
    tag: 'AGENCIES & CONSULTANTS',
    benefits: [
      'Wholesale agency pricing tiers',
      'Centralized client pod management',
      'Priority lead architect support',
      'Co-development & outsourcing',
    ],
  },
  {
    name: 'Developer & API Integration Partner',
    description: 'Build custom integrations, third-party extensions, and plugin tools connected to OHO TECH enterprise software modules.',
    tag: 'DEVELOPERS & DEVOPS',
    benefits: [
      'Early access to REST & GraphQL APIs',
      'API sandbox & test environments',
      'Technical enablement sessions',
      'Marketplace revenue share',
    ],
  },
];

export default async function PartnerPage() {
  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="partner-main">
        
        {/* Hero Section */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm text-center mb-10 relative overflow-hidden grid-pattern-light" id="partner-hero">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-mono text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
              <Handshake className="w-3.5 h-3.5 text-sky-600" />
              OHO TECH PARTNER ECOSYSTEM
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0d0d0e] mb-6 leading-[1.08]">
              Partner With OHO TECH. Grow Together.
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
              Join our ecosystem of software resellers, digital agencies, and technology developers. Deliver high-impact software solutions to your clients.
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/contact?subject=Partner Application"
                id="partner-hero-cta"
                className="px-8 py-4 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg inline-flex items-center gap-2"
              >
                <span>Apply to Become a Partner</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Partner Paths */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm mb-10" id="partner-paths-section">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-block text-xs font-mono font-bold text-sky-600 uppercase tracking-widest mb-2">
                COLLABORATION MODELS
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight">
                Choose Your Partnership Path
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-500">
              Structured Support • Transparent Terms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => (
              <div
                key={index}
                className="p-8 bg-[#fafafa] border-2 border-slate-200 hover:border-sky-500 rounded-3xl transition-all duration-300 flex flex-col justify-between hover:shadow-lg group"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 inline-block mb-4">
                    {type.tag}
                  </span>
                  
                  <h3 className="text-xl font-bold text-[#0d0d0e] mb-3 group-hover:text-sky-600 transition-colors">
                    {type.name}
                  </h3>
                  
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {type.description}
                  </p>

                  <div className="pt-4 border-t border-slate-200/80 space-y-2 mb-6">
                    <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
                      PARTNER ADVANTAGES
                    </div>
                    {type.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/contact?subject=Partner Application"
                  className="w-full py-3.5 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all text-center"
                >
                  Apply for {type.name.split(' ')[0]}
                </Link>
              </div>
            ))}
          </div>

        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-[#0d0d0e] text-white border-2 border-slate-700 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-16 text-center shadow-2xl relative overflow-hidden" id="partner-bottom-cta">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to accelerate client growth?</h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto">
              Fill out our partner inquiry form and our partnership lead will contact you within 24 hours.
            </p>
            <Link
              href="/contact?subject=Partner Application"
              className="px-8 py-4 rounded-full bg-white hover:bg-sky-400 text-[#0d0d0e] font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg inline-flex items-center gap-2"
            >
              <span>Submit Partner Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

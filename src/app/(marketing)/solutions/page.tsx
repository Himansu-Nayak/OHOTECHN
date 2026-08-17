// src/app/(marketing)/solutions/page.tsx
import Link from 'next/link';
import { industries } from '@/config/industries';
import * as Icons from 'lucide-react';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';

function DynamicIcon({ name, ...props }: { name: string } & Icons.LucideProps) {
  const Icon = Icons[name as keyof typeof Icons] as Icons.LucideIcon;
  if (!Icon) return <Layers {...props} />;
  return <Icon {...props} />;
}

const industryEmojis: Record<string, string> = {
  healthcare: '🏥',
  education: '🎓',
  'hotel-hospitality': '🏨',
  'retail-ecommerce': '🛒',
  manufacturing: '🏭',
  'business-enterprise': '🏢',
  finance: '🏦',
  logistics: '🚛',
  fitness: '🏋️',
  'real-estate': '🏢',
  food: '🍔',
  automotive: '🚗',
};

export default function SolutionsHubPage() {
  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-[1536px] w-full mx-auto" id="solutions-hub-main">
        
        {/* Top Header Hero Container */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm text-center mb-10 relative overflow-hidden grid-pattern-light" id="solutions-hero">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-xs font-bold uppercase tracking-wider mb-5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              SOLUTIONS BY INDUSTRY ⚡
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0d0d0e] mb-6 leading-[1.08]" id="solutions-hero-heading">
              Tailored Enterprise Software for Every Sector.
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed" id="solutions-hero-desc">
              Discover comprehensive, scalable software solutions designed specifically to streamline operations, automate workflows, and drive digital growth across 13 industry verticals.
            </p>
          </div>
        </section>

        {/* Industry Solutions Showcase Grid */}
        <section className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 shadow-sm" id="solutions-grid-section">
          
          {/* Flagship Feature Highlights (Marg ERP & Vocational Skill Continuum Inspired) */}
          <div className="mb-16 p-8 sm:p-10 rounded-3xl bg-[#0d0d0e] text-white border border-black shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-block text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-3">
                ⚡ FLAGSHIP ENTERPRISE MODULES
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
                Advanced GST Billing, Mobile Ecosystem &amp; Vocational Skill e-Governance
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed mb-8">
                Empowering businesses and educational institutions across the region with transformational digital solutions—from WhatsApp e-Invoicing and connected banking to the entire Vocational Education &amp; Skill Development continuum.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl mb-2">💬</div>
                  <h4 className="text-base font-bold text-white mb-1">WhatsApp Billing &amp; GST</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automated e-Invoicing, e-Way bills, and instant WhatsApp PDF receipts with payment links.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl mb-2">📱</div>
                  <h4 className="text-base font-bold text-white mb-1">Mobile Apps Ecosystem</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Dedicated mobile apps: Owner Analytics App, Salesperson Order App, and Delivery Tracking.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl mb-2">🏦</div>
                  <h4 className="text-base font-bold text-white mb-1">Connected Banking API</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Direct API bank sync (ICICI, HDFC, SBI) for instant automated bank reconciliation and payouts.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-2xl mb-2">🎓</div>
                  <h4 className="text-base font-bold text-white mb-1">Vocational Skill ERP</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    e-Learning, Digital Assessment, Skill Development continuum, and e-Governance portals.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-block text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest mb-2">
                13 INDUSTRY VERTICALS
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight">
                Enterprise Solution Modules
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-500">
              65+ Custom &amp; SaaS Products Operational
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="solutions-grid">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/solutions/${industry.slug}`}
                id={`solution-card-${industry.slug}`}
                className="group p-8 bg-[#fafafa] border-2 border-slate-200 hover:border-emerald-500 rounded-3xl transition-all duration-300 flex flex-col justify-between hover:shadow-lg relative overflow-hidden"
              >
                <div>
                  {/* Card Header & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-300">
                      {industryEmojis[industry.slug] || '⚡'}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      {industry.products.length} {industry.products.length === 1 ? 'Solution' : 'Solutions'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-extrabold text-[#0d0d0e] mb-3 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                    <span>{industryEmojis[industry.slug] || '⚡'}</span>
                    <span>{industry.name}</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {industry.description}
                  </p>
                </div>

                {/* Card Action Link Footer */}
                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-emerald-600">
                  <span>Explore Architecture</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

        </section>

      </main>
    </div>
  );
}

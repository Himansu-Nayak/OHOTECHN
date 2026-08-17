import { Metadata } from 'next';
import Link from 'next/link';
import NextImage from 'next/image';
import { User, CheckCircle2, Quote, ShieldCheck, ArrowRight, Sparkles, Building2, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us & Founder Leadership | OHO TECH',
  description: 'Meet Founder & Director Jagabandhu Kampa and learn about OHO TECH, our mission, values, and enterprise digital solutions.',
};

const stats = [
  { label: 'Years of Innovation', value: '5+' },
  { label: 'Enterprise Systems Built', value: '100+' },
  { label: 'Industry Verticals Covered', value: '13' },
  { label: 'Organic & Paid Reach', value: '670M+' },
];

const values = [
  {
    name: 'Technical Excellence',
    description: 'We build high-availability, enterprise-grade software engineered for zero downtime and effortless scalability.',
  },
  {
    name: 'Turnkey Software Delivery',
    description: 'From OPD/IPD Hospital EMR to College ERPs & Retail POS, we provide ready-to-deploy software products.',
  },
  {
    name: 'Growth & Performance Focus',
    description: 'We bridge technology with high-ROI digital marketing, performance ads, and omnichannel customer reach.',
  },
  {
    name: 'Uncompromising Transparency',
    description: 'SLA-backed execution, transparent pricing, and dedicated lead architect support for every partner.',
  },
];

export default async function AboutPage() {
  return (
    <div className="bg-[#09090b] text-white min-h-screen pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 pb-16">
      
      {/* ── HERO SECTION ── */}
      <div className="relative isolate pt-24 lg:pt-32 pb-20 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 font-mono text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-4 h-4 text-teal-400" />
              About OHO TECH
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
              Engineering Digital Infrastructure for Modern Businesses
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-8 text-slate-300 max-w-2xl mx-auto">
              Under the visionary leadership of Founder &amp; Director Jagabandhu Kampa, OHO TECH delivers turnkey software products, custom tech solutions, and growth acceleration across 13 industries.
            </p>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-20">
        <div className="bg-[#141416] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-12 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="mx-auto flex max-w-xs flex-col gap-y-2">
                <dt className="text-xs font-mono text-slate-400 uppercase tracking-wider">{stat.label}</dt>
                <dd className="order-first text-4xl font-black tracking-tight text-teal-400 sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── FOUNDER & DIRECTOR SPOTLIGHT SECTION ── */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-24">
        <div className="bg-gradient-to-br from-[#141416] via-[#0d0d0e] to-[#141416] border border-teal-500/20 rounded-[32px] sm:rounded-[44px] p-8 sm:p-16 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Founder Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#09090b] border border-white/10 rounded-3xl p-8 text-center relative shadow-xl">
                
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold uppercase tracking-widest mb-6">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  Founder &amp; Managing Director
                </div>

                {/* Avatar Badge */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-6 rounded-full bg-gradient-to-tr from-teal-400 via-emerald-500 to-amber-400 p-1 shadow-2xl relative">
                  <div className="w-full h-full rounded-full bg-[#0d0d0e] relative overflow-hidden border-2 border-[#0d0d0e]">
                    <NextImage
                      src="/jagabandhu_kampa.jpeg"
                      alt="Jagabandhu Kampa - Founder & Director OHO TECH"
                      width={250}
                      height={250}
                      className="w-full h-full object-cover object-top"
                      priority
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#0d0d0e] border border-teal-400/50 flex items-center justify-center text-teal-400 shadow-lg">
                    <CheckCircle2 className="w-5 h-5 fill-teal-400 text-[#0d0d0e]" />
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Jagabandhu Kampa
                </h3>
                <p className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider mt-1">
                  Founder &amp; Director
                </p>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Visionary tech leader driving software architecture, SaaS product innovation, and high-impact commercial growth.
                </p>

                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-3">
                  <Link
                    href="/contact"
                    className="px-6 py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-[#0d0d0e] font-extrabold text-xs uppercase tracking-wider transition-all shadow-md"
                  >
                    Connect with Leadership
                  </Link>
                </div>

              </div>
            </div>

            {/* Founder Message & Vision */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                <Quote className="w-3.5 h-3.5" />
                Founder&apos;s Message
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                &quot;Technology should empower businesses, not overwhelm them.&quot;
              </h2>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>
                  OHO TECH was established by <strong className="text-white font-semibold">Jagabandhu Kampa</strong> with a single clear directive: to engineer high-performance digital tools and turnkey software applications that deliver tangible business metrics.
                </p>
                <p>
                  Whether serving multi-specialty hospitals with EMR systems, automating college administration, scaling retail point-of-sale systems, or running viral marketing campaigns with millions of views, our team operates at the intersection of technical brilliance and commercial strategy.
                </p>
                <p>
                  We take pride in our long-term client relationships and our commitment to absolute transparency, continuous innovation, and enterprise-grade reliability.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  SLA-Backed Production Guarantee
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  13 Dedicated Vertical Solutions
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ── OUR VALUES SECTION ── */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            Core Principles
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Our Core Values</h2>
          <p className="mt-4 text-base text-slate-400">
            Guided by technical precision, transparency, and relentless client success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => (
            <div key={val.name} className="p-8 rounded-3xl bg-[#141416] border border-white/10 hover:border-teal-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-mono text-xs font-extrabold mb-6">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-black text-white mb-3">{val.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{val.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CALL TO ACTION ── */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
        <div className="bg-[#141416] border border-white/10 rounded-3xl p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Ready to collaborate with OHO TECH?
            </h2>
            <p className="text-slate-400 text-sm mb-8">
              Schedule a strategy discussion with Founder &amp; Director Japabandhu Kampa and our engineering leadership.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/book-demo"
                className="px-8 py-4 rounded-full bg-teal-500 hover:bg-teal-400 text-[#0d0d0e] font-black text-xs uppercase tracking-wider transition-all shadow-xl inline-flex items-center gap-2"
              >
                <span>Book 15-Min Strategy Call</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/get-quote"
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/10"
              >
                Get Custom Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

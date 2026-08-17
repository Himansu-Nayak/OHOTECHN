import { Metadata } from 'next';
import Link from 'next/link';
import NextImage from 'next/image';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About OHO TECHN — Digital Infrastructure & Technology',
  description: 'Learn about OHO TECHN, our leadership, core engineering principles, and how we deliver technology and infrastructure solutions for modern organizations.',
};

const values = [
  {
    name: 'Practical Innovation',
    description: 'We engineer technology and digital systems designed around actual business requirements rather than speculative concepts.',
  },
  {
    name: 'Reliable Execution',
    description: 'From software architecture to infrastructure deployment, our solutions prioritize continuous stability and operational clarity.',
  },
  {
    name: 'End-to-End Capability',
    description: 'We support organizations through every stage of growth—from initial strategy and technical design to deployment and integration.',
  },
  {
    name: 'Long-Term Partnership',
    description: 'We measure success through long-standing business relationships built on performance, trust, and transparent collaboration.',
  },
];

export default async function AboutPage() {
  return (
    <div className="bg-[#f8f9fb] text-[#0f172a] min-h-screen pt-28 sm:pt-36 pb-20 selection:bg-slate-900 selection:text-white">
      
      {/* ── HERO SECTION ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 block mb-3">
          About OHO TECHN
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 max-w-4xl mx-auto leading-tight mb-6">
          Engineering Digital Infrastructure for Modern Business.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          OHO TECHN combines engineering expertise, infrastructure design, and digital solutions to help organizations operate smarter, faster, and more efficiently.
        </p>
      </section>

      {/* ── CORE PRINCIPLES ── */}
      <section className="py-16 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 block mb-2">
              Our Values
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-950">
              Guided by Engineering Principles.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={v.name} className="corporate-card p-6 space-y-3">
                <div className="text-xl font-mono font-bold text-teal-700">0{i + 1}</div>
                <h3 className="text-lg font-bold text-slate-950">{v.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP SECTION ── */}
      <section id="leadership" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <NextImage
                src="/jagabandhu_kampa.jpeg"
                alt="Jagabandhu Kampa - Founder & Director"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
              Executive Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
              Jagabandhu Kampa
            </h2>
            <div className="text-sm font-semibold text-slate-500">
              Founder &amp; Director, OHO TECHN
            </div>
            <p className="text-base text-slate-600 leading-relaxed">
              Under the direct leadership of Jagabandhu Kampa, OHO TECHN has focused on building technology systems that provide operational clarity for organizations across enterprise, healthcare, education, and energy sectors.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our leadership approach prioritizes practical software architecture, transparent execution, and continuous technological resilience over speculative trend-chasing.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#090a0f] text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                <span>Connect with Leadership</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-[#090a0f] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-5">
          <h2 className="text-2xl sm:text-4xl font-bold text-white">
            Ready to Build Your Digital Infrastructure?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Discuss your technical requirements or operational goals with our engineering team.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-md bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Building, 
  Target, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Code2,
  Users
} from 'lucide-react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ETHOS_PILLARS = [
  {
    number: '01',
    title: 'Who We Are',
    subtitle: 'ENGINEERING-LED AGENCY',
    description: 'An independent digital engineering firm rooted in technical precision and direct founder accountability. We partner with ambitious enterprises to architect scalable software platforms and digital systems.',
    icon: Users,
    accent: 'text-emerald-400',
    highlight: 'Direct Founder Oversight',
    stat: '100% IN-HOUSE DELIVERY',
  },
  {
    number: '02',
    title: 'What We Believe',
    subtitle: 'SOVEREIGNTY & PRIDE',
    description: 'We believe clients must retain complete ownership of their digital destiny. That means 100% source code ownership, zero proprietary lock-in, pristine documentation, and transparent architecture.',
    icon: ShieldCheck,
    accent: 'text-cyan-400',
    highlight: 'Zero Vendor Lock-In',
    stat: '100% CODE OWNERSHIP',
  },
  {
    number: '03',
    title: 'What We Build',
    subtitle: 'MISSION-CRITICAL SYSTEMS',
    description: 'From distributed enterprise ERPs and telemedicine engines to AI telemetry pipelines and high-throughput web applications, we engineer resilient software built for long-term commercial dominance.',
    icon: Code2,
    accent: 'text-amber-400',
    highlight: 'Elastic Cloud Scalability',
    stat: 'ENTERPRISE PRODUCTION',
  },
];

export function CompanyStatement() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );

        if (!prefersReducedMotion && window.innerWidth >= 1024) {
          const cards = Array.from(gridRef.current.children);
          cards.forEach((card, idx) => {
            const offset = (idx - 1) * 20;
            gsap.to(card, {
              y: offset,
              ease: 'none',
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.9,
              },
            });
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="w-full bg-[#0d0d10] text-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Top transition blend from DirectorSection */}
      <div className="absolute top-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-b from-[#0d0d0e] to-transparent pointer-events-none z-0" />

      {/* Ambient subtle background radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(16,185,129,0.06),transparent_75%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
              <Building className="w-3.5 h-3.5" />
              <span>ORGANIZATIONAL IDENTITY &amp; VALUES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase">
              About OHO TECH
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300 font-normal max-w-md leading-relaxed">
            Founded with a commitment to technical craftsmanship, architectural resilience, and sovereign client empowerment.
          </p>
        </div>

        {/* 3 Ethos Pillars Responsive Grid: 1 col mobile, 3 cols desktop */}
        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {ETHOS_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 lg:p-10 rounded-2xl bg-[#14151a] border border-white/10 hover:border-white/25 hover:bg-[#181920] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      ETHOS: {pillar.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Subtitle & Title */}
                  <div className="font-mono text-[10px] sm:text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                    {pillar.subtitle}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                {/* Footer Stat Badge */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[10px] sm:text-[11px]">
                  <span className="text-slate-400 uppercase">
                    {pillar.highlight}
                  </span>
                  <span className="font-bold text-emerald-400">
                    {pillar.stat}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Company Summary Banner */}
        <div className="rounded-2xl bg-[#14151a] border border-white/10 p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
              Ready to explore our organizational capabilities?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              Read our full company history, executive leadership ethos, and technical governance roadmap.
            </p>
          </div>

          <Link
            href="/about"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 text-center shrink-0 flex items-center justify-center gap-2"
          >
            <span>LEARN ABOUT US</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}

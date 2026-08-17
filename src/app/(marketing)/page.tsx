'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  ArrowRight,
  Cpu,
  Layers,
  Zap,
  Globe,
  Building2,
  ShieldCheck,
  Server,
  ChevronRight,
} from 'lucide-react';
import { HeroLaunchBackground } from '@/components/ui/HeroLaunchBackground';

export default function CorporateHomePage() {
  return (
    <div className="bg-[#f8f9fb] text-[#0f172a] min-h-screen selection:bg-slate-900 selection:text-white">
      
      {/* ── SECTION 1: HOMEPAGE HERO (Substantially reduced height, single viewport desktop) ── */}
      <section className="pt-28 sm:pt-36 pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-10">
          
          {/* Small Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 border border-slate-300/60 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-6">
            DIGITAL INFRASTRUCTURE &amp; TECHNOLOGY
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.1] mb-5">
            Building Smarter Digital Infrastructure for Modern Business.
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto mb-8 leading-relaxed">
            OHO TECHN delivers technology, infrastructure and digital solutions that help businesses operate smarter, faster and more efficiently.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/solutions"
              className="px-7 py-3.5 rounded-md bg-[#090a0f] hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-xs inline-flex items-center gap-2"
            >
              <span>Explore Solutions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="px-7 py-3.5 rounded-md bg-white hover:bg-slate-100 text-slate-900 font-medium text-sm border border-slate-300/80 transition-all shadow-2xs"
            >
              Talk to Our Team
            </Link>
          </div>

        </div>

        {/* Hero Visual Block */}
        <div className="mt-8">
          <HeroLaunchBackground />
        </div>

      </section>

      {/* ── SECTION 2: CAPABILITY STRIP ── */}
      <section className="py-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-around gap-6 sm:gap-8 text-xs sm:text-sm font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              <span>Technology</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              <span>Infrastructure</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              <span>Digital Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              <span>Renewable Energy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              <span>Enterprise Services</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: WHAT WE DO ── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 block mb-2">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 tracking-tight leading-tight mb-4">
            Technology That Moves Business Forward.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            OHO TECHN combines technology, infrastructure and digital expertise to help organizations solve practical business challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <Link href="/services" className="corporate-card p-7 group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 mb-5 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2 group-hover:text-teal-700 transition-colors">
                Technology Solutions
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Tailored software and enterprise platforms built to streamline complex operational workflows.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 group-hover:text-teal-700">
              <span>Learn more</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/services/erp-solutions" className="corporate-card p-7 group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 mb-5 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2 group-hover:text-teal-700 transition-colors">
                Infrastructure
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Scalable cloud architecture and resilient digital systems engineered for long-term growth.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 group-hover:text-teal-700">
              <span>Learn more</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/services/api-integration" className="corporate-card p-7 group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 mb-5 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2 group-hover:text-teal-700 transition-colors">
                Digital Transformation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                End-to-end system integration and process automation for modern organizations.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 group-hover:text-teal-700">
              <span>Learn more</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4 */}
          <Link href="/solutions/manufacturing" className="corporate-card p-7 group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 mb-5 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2 group-hover:text-teal-700 transition-colors">
                Renewable Energy
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Smarter energy and utility solutions designed for sustainable efficiency.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 group-hover:text-teal-700">
              <span>Learn more</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* ── SECTION 4: FEATURED SOLUTIONS (EDITORIAL BLOCK LAYOUT) ── */}
      <section className="py-20 lg:py-28 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 block mb-2">
                Featured Solutions
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 tracking-tight">
                Architected for Performance.
              </h2>
            </div>
            <Link
              href="/solutions"
              className="text-sm font-semibold text-slate-900 hover:text-teal-700 flex items-center gap-1"
            >
              <span>View All Solutions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-12">
            
            {/* Block 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center corporate-card p-6 sm:p-8">
              <div className="lg:col-span-7 relative h-[280px] sm:h-[360px] rounded-xl overflow-hidden bg-slate-100">
                <NextImage
                  src="/hero_tech_ecosystem.jpg"
                  alt="Technology Systems"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Technology
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-950">
                  Digital systems designed for operational efficiency.
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We build custom software, web platforms, and mobile applications that enable enterprises to automate critical tasks and scale without friction.
                </p>
                <div className="pt-2">
                  <Link
                    href="/solutions/business-enterprise"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-950 hover:text-teal-700 transition-colors"
                  >
                    <span>Explore Technology Solutions</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Block 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center corporate-card p-6 sm:p-8">
              <div className="lg:col-span-5 space-y-4 lg:order-1 order-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Infrastructure
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-950">
                  Reliable systems built for long-term growth.
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  From enterprise ERP to cloud architecture, our infrastructure solutions ensure stability, security, and continuous uptime.
                </p>
                <div className="pt-2">
                  <Link
                    href="/solutions/logistics-transport"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-950 hover:text-teal-700 transition-colors"
                  >
                    <span>Explore Infrastructure</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-7 relative h-[280px] sm:h-[360px] rounded-xl overflow-hidden bg-slate-100 lg:order-2 order-1">
                <NextImage
                  src="/hero_launch_artwork.png"
                  alt="Infrastructure Systems"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Block 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center corporate-card p-6 sm:p-8">
              <div className="lg:col-span-7 relative h-[280px] sm:h-[360px] rounded-xl overflow-hidden bg-slate-100">
                <NextImage
                  src="/hero_workspace_editorial.jpg"
                  alt="Renewable Energy & Sustainability"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Renewable Energy
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-950">
                  Smarter energy solutions for a sustainable future.
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Engineering clean energy integrations and utility monitoring systems to power sustainable industrial operations.
                </p>
                <div className="pt-2">
                  <Link
                    href="/solutions/manufacturing"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-950 hover:text-teal-700 transition-colors"
                  >
                    <span>Explore Renewable Energy</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 5: WHY OHO TECHN (CORPORATE CREDIBILITY) ── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 block mb-2">
            Engineering Principles
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 tracking-tight">
            Built for Real-World Impact.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3 pt-4 border-t border-slate-300">
            <div className="text-2xl font-bold text-slate-400 font-mono">01</div>
            <h3 className="text-lg font-bold text-slate-950">Practical Innovation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Technology designed around actual business requirements rather than trendy gimmicks.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-300">
            <div className="text-2xl font-bold text-slate-400 font-mono">02</div>
            <h3 className="text-lg font-bold text-slate-950">Reliable Execution</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Solutions engineered for long-term operational performance and security.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-300">
            <div className="text-2xl font-bold text-slate-400 font-mono">03</div>
            <h3 className="text-lg font-bold text-slate-950">End-to-End Capability</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              From strategy and system design to implementation and ongoing maintenance.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-300">
            <div className="text-2xl font-bold text-slate-400 font-mono">04</div>
            <h3 className="text-lg font-bold text-slate-950">Long-Term Partnership</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We build lasting organizational relationships, not quick one-off projects.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: INDUSTRIES WE SERVE ── */}
      <section className="py-20 lg:py-28 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 block mb-2">
              Industry Focus
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
              Industries We Serve
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div className="p-6 rounded-lg bg-slate-50 border border-slate-200/80">
              <Building2 className="w-6 h-6 mx-auto mb-3 text-slate-700" />
              <div className="text-sm font-semibold text-slate-900">Infrastructure</div>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 border border-slate-200/80">
              <Zap className="w-6 h-6 mx-auto mb-3 text-slate-700" />
              <div className="text-sm font-semibold text-slate-900">Energy</div>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 border border-slate-200/80">
              <Globe className="w-6 h-6 mx-auto mb-3 text-slate-700" />
              <div className="text-sm font-semibold text-slate-900">Real Estate</div>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 border border-slate-200/80">
              <Server className="w-6 h-6 mx-auto mb-3 text-slate-700" />
              <div className="text-sm font-semibold text-slate-900">Enterprise</div>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 border border-slate-200/80">
              <Cpu className="w-6 h-6 mx-auto mb-3 text-slate-700" />
              <div className="text-sm font-semibold text-slate-900">Technology</div>
            </div>

            <div className="p-6 rounded-lg bg-slate-50 border border-slate-200/80">
              <ShieldCheck className="w-6 h-6 mx-auto mb-3 text-slate-700" />
              <div className="text-sm font-semibold text-slate-900">Public &amp; Institutional</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: COMPANY / LEADERSHIP ── */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
              Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
              People Behind the Vision.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              OHO TECHN is driven by Founder &amp; Director Jagabandhu Kampa, focusing on straightforward engineering principles, operational clarity, and robust enterprise software deployment.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="px-6 py-3 rounded-md bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs tracking-wide inline-flex items-center gap-2 transition-all"
              >
                <span>Meet OHO TECHN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 8: FINAL CORPORATE CTA ── */}
      <section className="py-20 lg:py-28 bg-[#090a0f] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Let’s Build What’s Next.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Have a project, challenge or idea? Let’s explore how OHO TECHN can help your organization operate smarter.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-md bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm transition-all shadow-xs"
            >
              Start a Conversation
            </Link>

            <Link
              href="/solutions"
              className="px-8 py-3.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 transition-all"
            >
              View Solutions
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

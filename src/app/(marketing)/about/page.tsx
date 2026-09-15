import { Metadata } from 'next';
import Link from 'next/link';
import NextImage from 'next/image';
import { 
  User, 
  CheckCircle2, 
  Quote, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Award, 
  Code2, 
  ExternalLink 
} from 'lucide-react';
import { AboutHero } from '@/components/about/AboutHero';
import { CompanyStory } from '@/components/about/CompanyStory';
import { EngineeringApproach } from '@/components/about/EngineeringApproach';
import { CultureAndPhilosophy } from '@/components/about/CultureAndPhilosophy';

import { buildMetadata, getBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'About Us & Leadership | OHO TECH Enterprise Platforms',
  description: 'Learn about OHO TECH, Founder & Director Japabandhu Kampa, our engineering methodology, core values, and digital infrastructure capabilities.',
  path: '/about',
  image: '/hero_workspace_editorial.jpg',
});

export default async function AboutPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'About OHO TECH', url: '/about' },
  ];

  return (
    <main className="bg-[#07080c] text-white min-h-screen pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      {/* Precision Technical Mesh Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* ── 1. HERO SECTION WITH EDITORIAL TYPOGRAPHY & STATS ── */}
        <AboutHero />

        {/* ── 2. COMPANY STORY & ORIGINS ── */}
        <CompanyStory />

        {/* ── 3. METHODOLOGY & 4-PHASE ENGINEERING APPROACH ── */}
        <EngineeringApproach />

        {/* ── 4. VALUES, PHILOSOPHY & DEVELOPER CULTURE ── */}
        <CultureAndPhilosophy />

        {/* ── 5. FOUNDER & DIRECTOR SPOTLIGHT SECTION (PRESERVED EXACTLY) ── */}
        <section className="mb-24">
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
                        src="/japabandhu_kampa.jpeg"
                        alt="Japabandhu Kampa - Founder & Director OHO TECH"
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
                    Japabandhu Kampa
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
                    OHO TECH was established by <strong className="text-white font-semibold">Japabandhu Kampa</strong> with a single clear directive: to engineer high-performance digital tools and turnkey software applications that deliver tangible business metrics.
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

            {/* ── CORE ENGINEERING TEAM SPOTLIGHT: HIMANSU NAYAK ── */}
            <div className="mt-16 pt-16 border-t border-white/10 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 font-mono text-xs font-bold uppercase tracking-wider mb-6">
                <User className="w-3.5 h-3.5" />
                Core Engineering Team Spotlight
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Column: Himansu Card */}
                <div className="lg:col-span-5">
                  <div className="bg-[#09090b] border border-white/10 rounded-3xl p-8 text-center relative shadow-xl hover:border-teal-500/40 transition-all">
                    
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold uppercase tracking-widest mb-6">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                      Full-Stack Developer
                    </div>

                    {/* Avatar Badge */}
                    <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-6 rounded-full bg-gradient-to-tr from-teal-400 via-emerald-500 to-amber-400 p-1 shadow-2xl relative">
                      <div className="w-full h-full rounded-full bg-[#0d0d0e] relative overflow-hidden border-2 border-[#0d0d0e]">
                        <NextImage
                          src="/himansu_nayak.png"
                          alt="Himansu Nayak - Full-Stack Developer OHO TECH"
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
                      Himansu Nayak
                    </h3>
                    <p className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider mt-1">
                      Full-Stack Developer (MCA)
                    </p>
                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      Architecting modern web applications, high-performance API endpoints, and fluid user experiences.
                    </p>

                    <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-2.5">
                      <Link
                        href="/contact"
                        className="w-full py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-[#0d0d0e] font-extrabold text-xs text-center uppercase tracking-wider transition-all shadow-md"
                      >
                        Connect with Himansu
                      </Link>

                      {/* Direct LinkedIn Profile Link */}
                      <a
                        href="https://www.linkedin.com/in/himansu-nayak-243b0482h7/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-full bg-[#0077b5]/20 hover:bg-[#0077b5]/35 text-[#38bdf8] hover:text-white font-mono text-xs text-center font-bold border border-[#0077b5]/40 transition-all flex items-center justify-center gap-2 group/linkedin"
                      >
                        <svg className="w-4 h-4 shrink-0 fill-[#0077b5] group-hover/linkedin:scale-110 transition-transform" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" />
                        </svg>
                        <span>Connect on LinkedIn</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>
                    </div>

                  </div>
                </div>

                {/* Right Column: Himansu Message & Stack Breakdown */}
                <div className="lg:col-span-7 space-y-6">
                  
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                    <Quote className="w-3.5 h-3.5" />
                    Engineering Perspective
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                    &quot;Building full-stack platforms with precision, speed, and continuous scalability.&quot;
                  </h2>

                  <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                    <p>
                      <strong className="text-white font-semibold">Himansu Nayak</strong> completed his <strong className="text-teal-300 font-semibold">Master of Computer Applications (MCA)</strong> degree and leads key full-stack software development initiatives at OHO TECH.
                    </p>
                    <p>
                      With deep expertise across modern frontend engineering (React, Next.js, Tailwind CSS) and backend API development (Node.js, RESTful &amp; GraphQL APIs, SQL &amp; NoSQL databases), Himansu ensures our digital products are performant, responsive, and secure.
                    </p>
                    <p>
                      He works closely with leadership and clients to translate complex operational specifications into clean, scalable software architecture.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                      <ShieldCheck className="w-4 h-4 text-teal-400" />
                      MCA (Master of Computer Applications)
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                      <Code2 className="w-4 h-4 text-amber-400" />
                      Full-Stack Web &amp; API Engineering
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ── 6. STRATEGY CONSULTATION CALL TO ACTION ── */}
        <div className="rounded-3xl bg-[#14151a] border border-white/15 p-8 sm:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-2">
              EXECUTIVE CONSULTATION
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Ready to collaborate with OHO TECH?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 font-normal max-w-xl">
              Schedule a strategic discussion directly with Founder &amp; Director Japabandhu Kampa and our engineering leadership.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0 w-full md:w-auto">
            <Link
              href="/book-demo"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <span>BOOK STRATEGY CALL</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/get-quote"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all border border-white/15 flex items-center justify-center"
            >
              GET CUSTOM QUOTE
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}

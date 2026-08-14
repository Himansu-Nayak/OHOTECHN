'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Flame,
  Check,
  ChevronRight,
  Code2,
  User,
  Quote,
  ShieldCheck,
  Award,
  Building2
} from 'lucide-react';
import { industries } from '@/config/industries';
import { services } from '@/config/services';
import { cn } from '@/lib/utils';
import { HeroLaunchBackground } from '@/components/ui/HeroLaunchBackground';
import { SolutionsSection } from '@/components/solutions/SolutionsSection';
import { ServicesSection } from '@/components/services/ServicesSection';
import { SoftwareStorySection } from '@/components/story/SoftwareStorySection';
import { WebStorySection } from '@/components/story/WebStorySection';
import { MobileStorySection } from '@/components/story/MobileStorySection';
import { ERPStorySection } from '@/components/story/ERPStorySection';
import { DesignIntegrationStorySection } from '@/components/story/DesignIntegrationStorySection';
import { DigitalGrowthStorySection } from '@/components/story/DigitalGrowthStorySection';
import { FinalCTASection } from '@/components/story/FinalCTASection';

export default function WideStudioPage() {
  const [easterEggActive, setEasterEggActive] = React.useState(false);
  const [clickCount, setClickCount] = React.useState(0);

  const handleRedButtonPress = () => {
    setClickCount((prev) => prev + 1);
    setEasterEggActive(true);
  };

  const showcaseProducts = [
    {
      title: 'HealthOS Enterprise',
      tagline: 'Hospital Management & EMR',
      verified: true,
      desc: 'Complete hospital administration, OPD/IPD, lab reports, and pharmacy billing.',
      bg: 'from-amber-700/80 to-amber-900',
      screenText: 'HealthOS',
      screenBg: 'bg-amber-950/60 text-amber-200'
    },
    {
      title: 'SchoolCloud & LMS',
      tagline: 'College ERP & Exams',
      verified: true,
      desc: 'Multi-campus university administration, online examination, and fee collection.',
      bg: 'from-amber-600/60 to-yellow-800',
      screenText: 'SchoolCloud',
      screenBg: 'bg-yellow-950/60 text-yellow-200'
    },
    {
      title: 'RetailPOS & GST Sync',
      tagline: 'Omnichannel Retail POS',
      verified: true,
      desc: 'High-speed retail billing, stock tracking, and multi-store GST invoicing.',
      bg: 'from-emerald-800 to-teal-950',
      screenText: 'RetailPOS',
      screenBg: 'bg-emerald-950/60 text-emerald-200'
    },
    {
      title: 'FinCore & Microfinance',
      tagline: 'Loan Origination & NBFC',
      verified: true,
      desc: 'Group lending, loan disbursement, automated EMI recovery, and audit reports.',
      bg: 'from-orange-700 to-amber-900',
      screenText: 'FinCore',
      screenBg: 'bg-orange-950/60 text-orange-200'
    },
    {
      title: 'Edgetabs & Fitness',
      tagline: 'Gym & Spa Management',
      verified: true,
      desc: 'How we got a brand 2.8M views with 5 posts & automated gym memberships.',
      bg: 'from-stone-800 to-neutral-900',
      screenText: 'EDGE Focus',
      screenBg: 'bg-stone-900 text-stone-200'
    },
    {
      title: 'Breathr Launch',
      tagline: 'Viral App & Marketing',
      verified: true,
      desc: 'The viral app and performance ad campaign generating 670M+ impressions.',
      bg: 'from-slate-800 to-slate-950',
      screenText: 'Breathr App',
      screenBg: 'bg-slate-900 text-slate-200'
    }
  ];

  const businessModels = [
    { title: 'Custom Solution Engineering', desc: 'Bespoke software engineered to exact client specifications and workflows.' },
    { title: 'Ready-Made Software Products', desc: 'Instant-deploy turnkey software applications across 13 industry verticals.' },
    { title: 'Developer & Agency Partnering', desc: 'Collaborative channel partnerships, white-label reselling, and co-development.' },
    { title: 'Software Customization', desc: 'Tailored adaptations and modular enhancements to existing core products.' },
    { title: 'SaaS Subscriptions & Licensing', desc: 'Flexible recurring cloud subscriptions or perpetual software license keys.' },
    { title: 'Digital Transformation & Marketing', desc: 'End-to-end SEO, Google/Meta Ads, WhatsApp API, and brand positioning.' }
  ];

  const customerFlows = [
    {
      num: '01',
      title: 'Software Product Customer',
      steps: [
        'Browse Solution Catalog',
        'View Features & Screenshots',
        'Request Demo / Free Trial',
        'Choose SaaS or License Plan',
        'Seamless Payment Checkout',
        'Account & License Activation',
        'Customer Dashboard Access'
      ],
      cta: 'Browse 65+ Products',
      href: '/solutions'
    },
    {
      num: '02',
      title: 'Custom Development Customer',
      steps: [
        'Browse Service Offerings',
        'Submit Project Requirement',
        'Lead Created & Assigned',
        'Architecture Consultation',
        'Proposal & Scope Review',
        'Quotation Approval',
        'Agile Sprint & Project Kickoff'
      ],
      cta: 'Get a Custom Quote',
      href: '/get-quote'
    },
    {
      num: '03',
      title: 'Digital Marketing Customer',
      steps: [
        'Choose Marketing Service',
        'Request Growth Consultation',
        'Business Review & Audit',
        'Growth Strategy Proposal',
        'Campaign Setup & Creatives',
        'Ad Launch Across Channels',
        'Live ROAS Analytics Dashboard'
      ],
      cta: 'Request Marketing Audit',
      href: '/services'
    }
  ];

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-6 pt-4 px-2 sm:px-4 lg:px-6 selection:bg-[#0d0d0e] selection:text-white">
      
      {/* ── 1. HERO SECTION (ULTRA-POLISHED HEADLINE & TECH BADGES) ── */}
      <section className="max-w-[1536px] w-full mx-auto mb-6 bg-[#fafafa] border border-black/10 rounded-[32px] sm:rounded-[44px] p-5 sm:p-10 lg:p-12 shadow-sm pt-24 sm:pt-32 text-center relative overflow-hidden grid-pattern-light" id="hero">
        
        {/* Tech Stack Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f0f0eb] border border-black/10 text-[#0d0d0e] font-mono text-[11px] font-bold uppercase tracking-wider mb-4 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Enterprise Engineering &amp; High-ROAS Growth
        </div>

        {/* Adjusted Compact Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-5xl mx-auto mb-5 text-[#0d0d0e] leading-[1.06]">
          Premium software & digital systems that turn visitors into customers.
        </h1>

        {/* Adjusted Subheadline */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-normal max-w-xl mx-auto mb-6 leading-relaxed">
          For founders, brands, and enterprise products who want the internet to take them seriously.
        </p>

        {/* Center Dual Pill Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-8">
          <Link
            id="hero-book-call"
            href="/book-demo"
            className="px-7 py-3 rounded-full bg-[#0d0d0e] hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm tracking-tight transition-all shadow-lg hover:scale-105"
          >
            Book a 15-min call →
          </Link>
          <Link
            id="hero-see-work"
            href="#work"
            className="px-7 py-3 rounded-full bg-[#ebebe8] hover:bg-[#e2e2de] text-[#0d0d0e] font-bold text-xs sm:text-sm tracking-tight transition-all hover:scale-105"
          >
            See the work ↓
          </Link>
        </div>

        {/* Full Width Hero Artwork Container */}
        <div className="w-full">
          <HeroLaunchBackground />
        </div>

      </section>

      {/* ── 2. SELECTED WORK SECTION (EXACT MATCH TO REFERENCE SCREENSHOT) ── */}
      <section className="max-w-[1536px] w-full mx-auto mb-6 bg-white border border-black/10 rounded-[32px] sm:rounded-[44px] p-6 sm:p-12 lg:p-16 shadow-sm" id="work">
        
        {/* Section Title */}
        <div className="mb-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0d0d0e]">
            Selected <span className="text-slate-400 font-normal">work.</span>
          </h2>
        </div>

        {/* ── TOP ROW: 4 TALL CARDS (4 COLUMNS GRID) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          
          {/* Card 1: Hydroflow */}
          <div className="launch-card p-3 flex flex-col justify-between group bg-[#fafafa]">
            <div className="relative rounded-2xl h-72 sm:h-80 w-full overflow-hidden mb-3 bg-orange-600 flex items-center justify-center shadow-md">
              <NextImage
                src="/work_hydroflow.png"
                alt="Hydroflow 3D CRT Render"
                width={600}
                height={700}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="px-1 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#0d0d0e]">Hydroflow</span>
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500 stroke-white shrink-0" />
              </div>
            </div>
          </div>

          {/* Card 2: Sterling */}
          <div className="launch-card p-3 flex flex-col justify-between group bg-[#fafafa]">
            <div className="relative rounded-2xl h-72 sm:h-80 w-full overflow-hidden mb-3 bg-amber-700 flex items-center justify-center shadow-md">
              <NextImage
                src="/work_sterling.png"
                alt="Sterling 3D Gold CRT Render"
                width={600}
                height={700}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="px-1 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#0d0d0e]">Sterling</span>
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500 stroke-white shrink-0" />
              </div>
            </div>
          </div>

          {/* Card 3: Dojet */}
          <div className="launch-card p-3 flex flex-col justify-between group bg-[#fafafa]">
            <div className="relative rounded-2xl h-72 sm:h-80 w-full overflow-hidden mb-3 bg-emerald-950 flex items-center justify-center shadow-md">
              <NextImage
                src="/work_dojet.png"
                alt="Dojet 3D Terminal Render"
                width={600}
                height={700}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="px-1 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#0d0d0e]">Dojet</span>
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500 stroke-white shrink-0" />
              </div>
            </div>
          </div>

          {/* Card 4: UpHealth */}
          <div className="launch-card p-3 flex flex-col justify-between group bg-[#fafafa]">
            <div className="relative rounded-2xl h-72 sm:h-80 w-full overflow-hidden mb-3 bg-stone-900 flex items-center justify-center shadow-md">
              <NextImage
                src="/work_uphealth.png"
                alt="UpHealth 3D TV Render"
                width={600}
                height={700}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="px-1 pb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#0d0d0e]">UpHealth</span>
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500 stroke-white shrink-0" />
              </div>
            </div>
          </div>

        </div>

        {/* ── BOTTOM ROW: 3 CARDS (1 COL + 2 COLS WIDE + 1 COL GRID) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Card 5: Edgetabs (1 Col) */}
          <div className="launch-card p-3 flex flex-col justify-between group bg-[#fafafa]">
            <div className="relative rounded-2xl h-72 sm:h-80 w-full overflow-hidden mb-3 bg-stone-900 flex items-center justify-center group-hover:scale-[1.02] transition-transform">
              <NextImage
                src="/oho_tech_studio_launch.png"
                alt="Edgetabs Product"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white">
                <span className="text-[10px] font-mono text-teal-400 uppercase font-bold tracking-wider block">EDGE Energy & Focus</span>
                <span className="text-xs font-bold">Sublingual Nootropic Mint Tin</span>
              </div>
            </div>
            <div className="px-1 pb-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm font-bold text-[#0d0d0e]">Edgetabs</span>
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500 stroke-white shrink-0" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">How we got a brand 2.8M views with 5 posts.</p>
            </div>
          </div>

          {/* Card 6: Breathr (2 Cols Wide!) */}
          <div className="launch-card p-3 flex flex-col justify-between group bg-[#fafafa] lg:col-span-2 relative">
            <div className="relative rounded-2xl h-72 sm:h-80 w-full overflow-hidden mb-3 bg-slate-950 flex items-center justify-center group-hover:scale-[1.02] transition-transform">
              <NextImage
                src="/oho_tech_dev_team_background.png"
                alt="Breathr Launch Video"
                width={900}
                height={500}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-widest block">VIRAL CAMPAIGN & APP</span>
                  <h3 className="text-lg font-black text-white">Breathr Launch Campaign</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/30">
                  670M+ Views
                </div>
              </div>
            </div>
            <div className="px-1 pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm font-bold text-[#0d0d0e]">Breathr</span>
                  <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500 stroke-white shrink-0" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">The viral app to help Gen Z quit vaping.</p>
              </div>

              {/* Handwritten Red Note below card */}
              <div className="sm:text-right shrink-0">
                <span className="handwritten-note text-rose-600 font-bold text-xs">
                  we make launch videos too ↖
                </span>
              </div>
            </div>
          </div>

          {/* Card 7: Monospace Pixel Stats Card (1 Col) */}
          <div className="launch-card p-6 flex flex-col justify-between bg-white border border-black/10 rounded-2xl text-center shadow-sm">
            <div className="space-y-6 my-auto">
              <div>
                <div className="text-4xl sm:text-5xl pixel-stat text-[#0d0d0e]">100+</div>
                <div className="text-xs font-mono text-slate-500 mt-1 uppercase font-bold tracking-wider">projects delivered</div>
              </div>

              <div>
                <div className="text-4xl sm:text-5xl pixel-stat text-[#0d0d0e]">670M</div>
                <div className="text-xs font-mono text-slate-500 mt-1 uppercase font-bold tracking-wider">views generated</div>
              </div>

              <div className="relative inline-block px-4">
                <div className="flex items-center justify-center gap-2">
                  {/* Left Laurel Wreath Branch */}
                  <svg className="w-6 h-8 text-slate-800 opacity-80" viewBox="0 0 24 32" fill="currentColor">
                    <path d="M 12 30 C 8 26 4 20 4 14 C 4 10 6 7 9 5 C 7 8 7 12 9 15 C 11 18 12 24 12 30 Z" />
                  </svg>
                  <div className="text-4xl sm:text-5xl pixel-stat text-[#0d0d0e]">21</div>
                  {/* Right Laurel Wreath Branch */}
                  <svg className="w-6 h-8 text-slate-800 opacity-80" viewBox="0 0 24 32" fill="currentColor">
                    <path d="M 12 30 C 16 26 20 20 20 14 C 20 10 18 7 15 5 C 17 8 17 12 15 15 C 13 18 12 24 12 30 Z" />
                  </svg>
                </div>
                <div className="text-xs font-mono text-slate-500 mt-1 uppercase font-bold tracking-wider">awards received</div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ── 3. HEAR FROM OUR PARTNERS (EXACT MATCH TO THE LAUNCH COMPANY SCREENSHOT) ── */}
      <section className="max-w-[1536px] w-full mx-auto mb-6 bg-[#0d0d0e] text-white border border-black/20 rounded-[32px] sm:rounded-[44px] p-6 sm:p-12 lg:p-16 shadow-xl grid-pattern-dark relative" id="partners">
        
        <div className="mb-12">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#888888]">
            Hear from <span className="text-white">our partners.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Split Card (Webild + ASCII Penguin Graphic) */}
          <div className="bg-[#fafafa] text-[#0d0d0e] rounded-3xl border border-black/10 overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-extrabold uppercase text-slate-500">Webild</span>
                  <p className="text-sm sm:text-base font-bold text-[#0d0d0e] leading-snug mt-4 mb-6">
                    "We went from a 40,000-person waitlist to 150,000 users in two months. A huge part of that growth traces back to OHO TECH and the team."
                  </p>
                </div>
                <div className="text-[11px] font-mono text-slate-500 font-bold">
                  Alex Rivera • Founder @ Webild
                </div>
              </div>

              <div className="bg-[#f0f0eb] border-t sm:border-t-0 sm:border-l border-black/5 p-4 flex items-center justify-center">
                <NextImage
                  src="/ascii_penguin_card.png"
                  alt="ASCII Penguin Art"
                  width={300}
                  height={300}
                  style={{ width: 'auto', height: 'auto' }}
                  className="w-full max-w-[180px] h-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Split Card (Kinematic + Wireframe Ship Graphic) */}
          <div className="bg-[#fafafa] text-[#0d0d0e] rounded-3xl border border-black/10 overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-extrabold uppercase text-slate-500">Kinematic</span>
                  <p className="text-sm sm:text-base font-bold text-[#0d0d0e] leading-snug mt-4 mb-6">
                    "If you're looking for a trusted advisor, OHO TECH should be the go-to team. Their ability to deliver innovative solutions, connect with global brands, and maintain focus on measurable outcomes makes them exceptional."
                  </p>
                </div>
                <div className="text-[11px] font-mono text-slate-500 font-bold">
                  Mike Coers • VP @ Kinematic
                </div>
              </div>

              <div className="bg-[#f0f0eb] border-t sm:border-t-0 sm:border-l border-black/5 p-4 flex items-center justify-center">
                <NextImage
                  src="/wireframe_ship_card.png"
                  alt="Wireframe Ship Art"
                  width={300}
                  height={300}
                  style={{ width: 'auto', height: 'auto' }}
                  className="w-full max-w-[180px] h-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Reserved Space Card + Pink/Coral Concert Ticket Badge */}
          <div className="bg-[#fafafa] text-[#0d0d0e] rounded-3xl border border-black/10 p-8 flex flex-col items-center justify-between text-center relative shadow-lg">
            
            {/* Pink Concert Ticket Badge Tilted at Top */}
            <div className="absolute -top-4 right-6 bg-rose-400 text-rose-950 px-3.5 py-1.5 rounded-lg border-2 border-dashed border-rose-600 shadow-xl font-mono text-[10px] font-bold uppercase tracking-wider rotate-[-8deg] shadow-rose-500/20">
              🎟 SEAT AVAILABLE #738472
            </div>

            <div className="my-auto pt-6">
              <h3 className="text-xl sm:text-2xl font-black text-[#0d0d0e] mb-4 leading-tight">
                This space is reserved for what we build with you.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Partner with OHO TECH to launch high-ROI software products & digital marketing campaigns.
              </p>
            </div>

            <Link
              href="/book-demo"
              className="px-6 py-2.5 rounded-full bg-[#0d0d0e] hover:bg-slate-800 text-white font-extrabold text-xs tracking-tight transition-all shadow-md"
            >
              Book a call
            </Link>
          </div>

        </div>

      </section>

      {/* ── 4. ALL 13 INDUSTRIES & 65+ PRODUCTS (MODERN MINIMAL SOLUTIONS SECTION) ── */}
      <SolutionsSection />

      {/* ── 5. ALL 15 CORE SERVICES (MODERN MINIMAL SERVICES SECTION) ── */}
      <ServicesSection />

      {/* ── PROGRESSIVE SERVICE STORY SECTIONS ── */}
      {/* SECTION 1: SOFTWARE & CUSTOM DEVELOPMENT */}
      <SoftwareStorySection />

      {/* SECTION 2: WEBSITE & DIGITAL PLATFORMS */}
      <WebStorySection />

      {/* SECTION 3: MOBILE APPLICATIONS */}
      <MobileStorySection />

      {/* SECTION 4: ERP & BUSINESS SYSTEMS */}
      <ERPStorySection />

      {/* SECTION 5: DESIGN, UX & INTEGRATION */}
      <DesignIntegrationStorySection />

      {/* SECTION 6: DIGITAL GROWTH SERVICES */}
      <DigitalGrowthStorySection />

      {/* ── 6. THREE CUSTOMER JOURNEYS (STRUCTURED ENGAGEMENT PATHWAYS) ── */}
      <section className="max-w-[1536px] w-full mx-auto mb-6 bg-[#ebebe8] border border-black/10 rounded-[32px] sm:rounded-[44px] p-6 sm:p-12 lg:p-16 shadow-sm" id="flows">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-black/10 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            Structured Engagement Pathways
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] tracking-tight">
            Three Main Customer Journeys
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Clear, transparent workflows whether you're purchasing ready software, building custom tech, or running growth ads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {customerFlows.map((flow) => (
            <div key={flow.num} className="launch-card p-8 flex flex-col justify-between bg-white border border-black/10 shadow-md hover:shadow-xl transition-all">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <span className="w-10 h-10 rounded-2xl bg-[#0d0d0e] text-white flex items-center justify-center font-mono text-sm font-extrabold shadow-sm">
                    {flow.num}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#f7f7f5] text-slate-700 border border-black/5">
                    Workflow Path
                  </span>
                </div>
                
                <h3 className="text-xl font-extrabold text-[#0d0d0e] mb-5 tracking-tight">{flow.title}</h3>
                
                <div className="space-y-2.5 mb-8">
                  {flow.steps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2.5 text-xs text-slate-600 font-medium p-2 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-[#0d0d0e] text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0 shadow-xs">
                        {sIdx + 1}
                      </div>
                      <span className="font-semibold text-slate-800">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={flow.href}
                className="w-full py-3.5 rounded-full bg-[#0d0d0e] text-white font-extrabold text-xs text-center uppercase tracking-wider hover:bg-teal-500 hover:text-slate-950 transition-all shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>{flow.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

      </section>

      {/* ── 7. SIX BUSINESS MODELS (FLEXIBLE COMMERCIAL STRUCTURES) ── */}
      <section className="max-w-[1536px] w-full mx-auto mb-6 bg-white border border-black/10 rounded-[32px] sm:rounded-[44px] p-6 sm:p-12 lg:p-16 shadow-sm" id="models">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            Commercial Flexibility
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0d0d0e] tracking-tight">
            Flexible Engagement &amp; Commercial Models
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            We partner with enterprises, startups, agencies, and developers under 6 distinct commercial structures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessModels.map((model, mIdx) => (
            <div key={mIdx} className="launch-card p-6 bg-[#fafafa] border border-black/10 rounded-3xl hover:border-black/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-9 h-9 rounded-xl bg-[#0d0d0e] text-white flex items-center justify-center text-xs font-mono font-bold shadow-sm">
                    0{mIdx + 1}
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    Structure 0{mIdx + 1}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#0d0d0e] mb-2">{model.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{model.desc}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold">
                <span>Flexible Terms</span>
                <span className="text-teal-600">Available Now →</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ── 8. HI WE'RE OHO TECH & 3D INTERACTIVE RED BUTTON (EXACT MATCH TO REFERENCE SCREENSHOT) ── */}
      <section className="max-w-[1536px] w-full mx-auto mb-6 bg-white border border-black/10 rounded-[32px] sm:rounded-[44px] p-8 sm:p-16 lg:p-20 shadow-sm relative overflow-hidden grid-pattern-light" id="about">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Left-Aligned Giant Bold Typography */}
          <div className="lg:col-span-7 text-left">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0d0d0e] tracking-tight leading-[1.08] mb-6">
              Hi, we're OHO TECH. <span className="inline-block align-middle hover:rotate-12 transition-transform cursor-pointer">🌍</span> We build software &amp; digital systems people trust, and we're annoyingly good at getting people to look at them.
            </h2>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs font-mono font-bold text-slate-500 bg-[#f7f7f5] px-3.5 py-1.5 rounded-full border border-black/10">
                100+ Enterprise Systems Delivered
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 bg-[#f7f7f5] px-3.5 py-1.5 rounded-full border border-black/10">
                670M+ Organic &amp; Paid Views Generated
              </span>
            </div>
          </div>

          {/* Right Column: 3D Arcade Red Button Console Pillar */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Handwritten Red Note with Arrow pointing down at red button */}
            <div className="relative mb-2 self-center text-center">
              <span className="handwritten-note text-rose-600 font-bold text-base sm:text-lg flex items-center justify-center gap-1">
                <span>don't press this button.</span>
                <svg className="w-6 h-8 text-rose-600 inline-block stroke-current fill-none stroke-[2]" viewBox="0 0 24 32">
                  <path d="M 12 2 C 18 8 20 14 14 18 C 8 22 6 16 12 12 C 18 8 18 20 12 28 M 6 22 L 12 28 L 18 22" />
                </svg>
              </span>
            </div>

            {/* Interactive 3D Arcade Red Button Console Pillar */}
            <div className="relative cursor-pointer group hover:scale-[1.02] transition-transform duration-300">
              <button
                onClick={handleRedButtonPress}
                id="red-button-trigger"
                aria-label="Do not press this button"
                className="focus:outline-none block relative"
              >
                <NextImage
                  src="/red_button_console.png"
                  alt="3D Red Arcade Button Console Pillar"
                  width={400}
                  height={550}
                  className="w-56 sm:w-64 md:w-72 h-auto object-contain drop-shadow-2xl"
                  priority
                />
              </button>
            </div>

            {/* Interactive Modal / Activation Notification */}
            {easterEggActive && (
              <div className="mt-6 p-6 rounded-3xl bg-[#0d0d0e] text-white max-w-md animate-slide-up text-left shadow-2xl relative border border-black z-20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-teal-400 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400 animate-bounce" /> VIP Priority Slot Activated!
                  </span>
                  <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">{clickCount} Clicks</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  You pressed it! You've unlocked instant VIP consultation priority with OHO TECH's senior engineering team.
                </p>
                <Link href="/book-demo" className="text-xs font-extrabold text-teal-400 hover:underline inline-flex items-center gap-1">
                  <span>Book 15-min VIP consultation call</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

          </div>

        </div>

      </section>

      {/* ── 8B. FOUNDER & DIRECTOR SPOTLIGHT (ABOUT US) ── */}
      <section className="max-w-[1536px] w-full mx-auto mb-6 bg-[#0d0d0e] text-white border border-black/20 rounded-[32px] sm:rounded-[44px] p-8 sm:p-16 lg:p-20 shadow-2xl relative overflow-hidden grid-pattern-dark" id="founder">
        
        {/* Glow Accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 font-mono text-xs font-bold uppercase tracking-wider mb-4">
                <User className="w-3.5 h-3.5" />
                Leadership &amp; Company Vision
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                About Us &amp; Founder Leadership
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
                Driven by technical excellence and visionary leadership to deliver enterprise-grade software solutions across 13 industry verticals.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-teal-400 hover:text-teal-300 transition-colors uppercase tracking-wider group"
            >
              <span>Explore Full Story</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Main Founder Card & Bio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Founder Profile & Badge Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#141416] border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-teal-500/40 transition-all">
                
                {/* Top Founder Label */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-widest">
                    Founder &amp; Director
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Verified Leadership</span>
                  </div>
                </div>

                {/* Avatar / Portrait Block */}
                <div className="relative mb-6 text-center flex flex-col items-center">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-teal-400 via-emerald-500 to-amber-400 p-1 shadow-2xl relative group-hover:scale-105 transition-transform duration-300">
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
                    {/* Glowing Verified Badge Overlay */}
                    <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#0d0d0e] border border-teal-400/50 flex items-center justify-center text-teal-400 shadow-lg">
                      <CheckCircle2 className="w-5 h-5 fill-teal-400 text-[#0d0d0e]" />
                    </div>
                  </div>
                </div>

                {/* Founder Info */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Jagabandhu Kampa
                  </h3>
                  <p className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider mt-1">
                    Founder &amp; Director
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Architecting Scalable SaaS, Enterprise Systems &amp; High-Impact Growth Technology
                  </p>
                </div>

                {/* Badges / Stats Row */}
                <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/10 text-center mb-6">
                  <div>
                    <div className="text-base font-black text-white">5+ Yrs</div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Leadership</div>
                  </div>
                  <div className="border-x border-white/10">
                    <div className="text-base font-black text-teal-400">100+</div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Projects</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-amber-400">13 Verticals</div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Industries</div>
                  </div>
                </div>

                {/* Social & Contact Buttons */}
                <div className="flex items-center justify-center gap-3">
                  <Link
                    href="/contact"
                    className="flex-1 py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-[#0d0d0e] font-extrabold text-xs text-center uppercase tracking-wider transition-all shadow-md"
                  >
                    Schedule Call
                  </Link>
                  <Link
                    href="/about"
                    className="py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs text-center font-bold border border-white/10 transition-all"
                  >
                    About Us
                  </Link>
                </div>

              </div>
            </div>

            {/* Right: Founder Quote & Company Philosophy */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              
              {/* Executive Statement Quote Card */}
              <div className="bg-[#141416] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl relative">
                <Quote className="w-10 h-10 text-teal-500/30 mb-4" />
                <p className="text-lg sm:text-xl font-medium text-slate-200 leading-relaxed italic">
                  "At OHO TECH, our vision is to simplify high-performance software engineering for businesses. Under Jagabandhu Kampa's leadership, we build scalable digital systems that deliver operational clarity and real market impact across healthcare, education, retail, microfinance, and beyond."
                </p>
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">Jagabandhu Kampa</div>
                    <div className="text-xs font-mono text-slate-400">Founder &amp; Director, OHO TECH</div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-teal-400 text-xs font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" /> Direct Leadership
                  </div>
                </div>
              </div>

              {/* Core Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-[#141416] border border-white/10 hover:border-white/20 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-mono text-xs font-bold mb-3">
                    01
                  </div>
                  <h4 className="text-sm font-extrabold text-white mb-1">Turnkey Software Products</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Instantly deployable enterprise systems designed for hospitals, schools, retail, finance, and logistics.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#141416] border border-white/10 hover:border-white/20 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono text-xs font-bold mb-3">
                    02
                  </div>
                  <h4 className="text-sm font-extrabold text-white mb-1">Growth &amp; Technology Partner</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Combining bespoke engineering with high-converting marketing campaigns to scale digital presence.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ── FINAL CTA SECTION ── */}
      <FinalCTASection />

    </div>
  );
}

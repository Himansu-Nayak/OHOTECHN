'use client';

import * as React from 'react';
import { CinematicHero } from '@/components/home/CinematicHero';
import { ScrollFrameSequence } from '@/components/ui/ScrollFrameSequence';
import { TechMarqueeStream } from '@/components/home/TechMarqueeStream';
import { TechnologyStatement } from '@/components/home/TechnologyStatement';
import { HorizontalServicesShowcase } from '@/components/home/HorizontalServicesShowcase';
import { CapabilityExplorer } from '@/components/home/CapabilityExplorer';
import { SystemArchitectureFlow } from '@/components/home/SystemArchitectureFlow';
import { ProductsShowcase } from '@/components/home/ProductsShowcase';
import { ServicesExplorer } from '@/components/home/ServicesExplorer';
import { DirectorSection } from '@/components/home/DirectorSection';
import { VerifiedCaseStudies } from '@/components/home/VerifiedCaseStudies';
import { InfrastructureStack } from '@/components/home/InfrastructureStack';
import { GlobalInfrastructureMap } from '@/components/home/GlobalInfrastructureMap';
import { TrustProofSection } from '@/components/home/TrustProofSection';
import { EditorialAboutSection } from '@/components/home/EditorialAboutSection';
import { InsightsShowcase } from '@/components/home/InsightsShowcase';
import { EnterpriseFAQSection } from '@/components/home/EnterpriseFAQSection';
import { FinalCinematicCTA } from '@/components/home/FinalCinematicCTA';

export default function WideStudioPage() {
  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-8 pt-2 sm:pt-4 px-3 sm:px-4 lg:px-6 selection:bg-[#0d0d0e] selection:text-white overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          01. CINEMATIC HERO (OHO TECH DIGITAL SYSTEMS PLATFORM)
          ───────────────────────────────────────────────────────────── */}
      <CinematicHero />

      {/* ─────────────────────────────────────────────────────────────
          02. 3D HARDWARE TURNTABLE SEQUENCE (SCROLL SCRUBBER)
          ───────────────────────────────────────────────────────────── */}
      <section id="hardware-sequence" className="max-w-[1536px] w-full mx-auto mb-8 sm:mb-12 rounded-[28px] sm:rounded-[44px] overflow-hidden border-2 border-slate-800 shadow-2xl">
        <ScrollFrameSequence />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          03. TECH MARQUEE STREAM
          ───────────────────────────────────────────────────────────── */}
      <section id="tech-stack" className="max-w-[1536px] w-full mx-auto mb-8 sm:mb-12 rounded-[24px] sm:rounded-[36px] overflow-hidden shadow-lg">
        <TechMarqueeStream />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          04. EDITORIAL TECHNOLOGY STATEMENT
          ───────────────────────────────────────────────────────────── */}
      <TechnologyStatement />

      {/* ─────────────────────────────────────────────────────────────
          05. HORIZONTAL PINNED SERVICES SHOWCASE
          ───────────────────────────────────────────────────────────── */}
      <HorizontalServicesShowcase />

      {/* ─────────────────────────────────────────────────────────────
          06. LIVING SYSTEM ARCHITECTURE FLOW ("EVERYTHING CONNECTS")
          ───────────────────────────────────────────────────────────── */}
      <SystemArchitectureFlow />

      {/* ─────────────────────────────────────────────────────────────
          07. REAL PRODUCTS & PLATFORMS SHOWCASE
          ───────────────────────────────────────────────────────────── */}
      <ProductsShowcase />

      {/* ─────────────────────────────────────────────────────────────
          08. CAPABILITY EXPLORER (WHAT OHO TECH BUILDS)
          ───────────────────────────────────────────────────────────── */}
      <CapabilityExplorer />

      {/* ─────────────────────────────────────────────────────────────
          09. INTERACTIVE SERVICES EXPLORER
          ───────────────────────────────────────────────────────────── */}
      <ServicesExplorer />

      {/* ─────────────────────────────────────────────────────────────
          10. FOUNDER & MANAGING DIRECTOR LEADERSHIP
          ───────────────────────────────────────────────────────────── */}
      <DirectorSection />

      {/* ─────────────────────────────────────────────────────────────
          11. VERIFIED CASE STUDIES (PROBLEM -> APPROACH -> ARCHITECTURE -> RESULT)
          ───────────────────────────────────────────────────────────── */}
      <VerifiedCaseStudies />

      {/* ─────────────────────────────────────────────────────────────
          12. LAYERED INFRASTRUCTURE & TECHNOLOGY STACK
          ───────────────────────────────────────────────────────────── */}
      <InfrastructureStack />

      {/* ─────────────────────────────────────────────────────────────
          13. GLOBAL CLOUD & EDGE INFRASTRUCTURE TOPOLOGY MAP
          ───────────────────────────────────────────────────────────── */}
      <GlobalInfrastructureMap />

      {/* ─────────────────────────────────────────────────────────────
          14. ENTERPRISE TRUST & ARCHITECTURAL PROOF
          ───────────────────────────────────────────────────────────── */}
      <TrustProofSection />

      {/* ─────────────────────────────────────────────────────────────
          14. EDITORIAL ABOUT OHO TECH & ENGINEERING PHILOSOPHY
          ───────────────────────────────────────────────────────────── */}
      <EditorialAboutSection />

      {/* ─────────────────────────────────────────────────────────────
          15. TECHNICAL INSIGHTS & PERSPECTIVES
          ───────────────────────────────────────────────────────────── */}
      <InsightsShowcase />

      {/* ─────────────────────────────────────────────────────────────
          16. ENTERPRISE FAQ & TECHNICAL GOVERNANCE
          ───────────────────────────────────────────────────────────── */}
      <EnterpriseFAQSection />

      {/* ─────────────────────────────────────────────────────────────
          17. DRAMATIC FINAL ACTION CTA
          ───────────────────────────────────────────────────────────── */}
      <FinalCinematicCTA />

    </div>
  );
}

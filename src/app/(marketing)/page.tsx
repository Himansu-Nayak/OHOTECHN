'use client';

import * as React from 'react';
import { CinematicHero } from '@/components/home/CinematicHero';
import { TechnologyStatement } from '@/components/home/TechnologyStatement';
import { CapabilityExplorer } from '@/components/home/CapabilityExplorer';
import { SystemArchitectureFlow } from '@/components/home/SystemArchitectureFlow';
import { ProductsShowcase } from '@/components/home/ProductsShowcase';
import { ServicesExplorer } from '@/components/home/ServicesExplorer';
import { VerifiedCaseStudies } from '@/components/home/VerifiedCaseStudies';
import { InfrastructureStack } from '@/components/home/InfrastructureStack';
import { TrustProofSection } from '@/components/home/TrustProofSection';
import { EditorialAboutSection } from '@/components/home/EditorialAboutSection';
import { InsightsShowcase } from '@/components/home/InsightsShowcase';
import { FinalCinematicCTA } from '@/components/home/FinalCinematicCTA';
import { TechMarqueeStream } from '@/components/home/TechMarqueeStream';

export default function WideStudioPage() {
  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-8 pt-2 sm:pt-4 px-3 sm:px-4 lg:px-6 selection:bg-[#0d0d0e] selection:text-white overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          01. CINEMATIC HERO (OHO TECH DIGITAL SYSTEMS PLATFORM)
          ───────────────────────────────────────────────────────────── */}
      <CinematicHero />

      {/* ─────────────────────────────────────────────────────────────
          01.5 TECH MARQUEE STREAM
          ───────────────────────────────────────────────────────────── */}
      <section id="tech-stack" className="max-w-[1536px] w-full mx-auto mb-8 sm:mb-12 rounded-[24px] sm:rounded-[36px] overflow-hidden shadow-lg">
        <TechMarqueeStream />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          02. EDITORIAL TECHNOLOGY STATEMENT
          ───────────────────────────────────────────────────────────── */}
      <TechnologyStatement />

      {/* ─────────────────────────────────────────────────────────────
          03. CAPABILITY EXPLORER (WHAT OHO TECH BUILDS)
          ───────────────────────────────────────────────────────────── */}
      <CapabilityExplorer />

      {/* ─────────────────────────────────────────────────────────────
          04. LIVING SYSTEM ARCHITECTURE FLOW ("EVERYTHING CONNECTS")
          ───────────────────────────────────────────────────────────── */}
      <SystemArchitectureFlow />

      {/* ─────────────────────────────────────────────────────────────
          05. REAL PRODUCTS & PLATFORMS SHOWCASE
          ───────────────────────────────────────────────────────────── */}
      <ProductsShowcase />

      {/* ─────────────────────────────────────────────────────────────
          06. INTERACTIVE SERVICES EXPLORER
          ───────────────────────────────────────────────────────────── */}
      <ServicesExplorer />

      {/* ─────────────────────────────────────────────────────────────
          07. VERIFIED CASE STUDIES (PROBLEM -> APPROACH -> SYSTEM -> RESULT)
          ───────────────────────────────────────────────────────────── */}
      <VerifiedCaseStudies />

      {/* ─────────────────────────────────────────────────────────────
          08. LAYERED INFRASTRUCTURE & TECHNOLOGY STACK
          ───────────────────────────────────────────────────────────── */}
      <InfrastructureStack />

      {/* ─────────────────────────────────────────────────────────────
          09. ENTERPRISE TRUST & ENGINEERING PROOF
          ───────────────────────────────────────────────────────────── */}
      <TrustProofSection />

      {/* ─────────────────────────────────────────────────────────────
          10. EDITORIAL ABOUT OHO TECH & ENGINEERING PHILOSOPHY
          ───────────────────────────────────────────────────────────── */}
      <EditorialAboutSection />

      {/* ─────────────────────────────────────────────────────────────
          11. TECHNICAL INSIGHTS & PERSPECTIVES
          ───────────────────────────────────────────────────────────── */}
      <InsightsShowcase />

      {/* ─────────────────────────────────────────────────────────────
          12. DRAMATIC FINAL ACTION CTA
          ───────────────────────────────────────────────────────────── */}
      <FinalCinematicCTA />

    </div>
  );
}

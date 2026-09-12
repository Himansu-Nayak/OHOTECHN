'use client';

import * as React from 'react';
import { CinematicHero } from '@/components/home/CinematicHero';
import { TechnologyStatement } from '@/components/home/TechnologyStatement';
import { HorizontalServicesShowcase } from '@/components/home/HorizontalServicesShowcase';
import { VerifiedCaseStudies } from '@/components/home/VerifiedCaseStudies';
import { SystemArchitectureFlow } from '@/components/home/SystemArchitectureFlow';
import { ScrollFrameSequence } from '@/components/ui/ScrollFrameSequence';
import { DirectorSection } from '@/components/home/DirectorSection';
import { EditorialAboutSection } from '@/components/home/EditorialAboutSection';
import { FinalCinematicCTA } from '@/components/home/FinalCinematicCTA';
import { FooterCurtain } from '@/components/layout/FooterCurtain';
import { SystemEstimateModal } from '@/components/home/SystemEstimateModal';

/**
 * OHO TECH 12-Section Homepage Architecture:
 * 01 ─ HEADER        (via layout.tsx - Header.tsx untouched)
 * 02 ─ HERO          (WE BUILD DIGITAL EXPERIENCES.)
 * 03 ─ STATEMENT     (Strategy × Design × Technology)
 * 04 ─ SERVICES      (Interactive horizontal service system)
 * 05 ─ SELECTED WORK (Project 01, Project 02, Project 03, Project 04)
 * 06 ─ TECHNOLOGY    (Interactive technology statement & flow)
 * 07 ─ EXPERIENCE    (Large visual / 3D motion turntable section)
 * 08 ─ DIRECTOR      (Existing Director section - Japabandhu Kampa & Himansu Nayak MCA)
 * 09 ─ ABOUT         (Who we are / What we believe / What we build)
 * 10 ─ FINAL CTA     (LET'S BUILD SOMETHING GREAT.)
 * 11 ─ REVEAL        (Huge OHO TECH - FooterCurtain)
 * 12 ─ FOOTER        (via layout.tsx - Footer.tsx)
 */
export default function WideStudioPage() {
  const [isEstimateOpen, setIsEstimateOpen] = React.useState(false);

  return (
    <div className="bg-[#0a0a0b] text-[#e8e8e6] min-h-screen overflow-x-hidden">
      
      {/* 02. HERO: WE BUILD DIGITAL EXPERIENCES. */}
      <CinematicHero />

      {/* 03. STATEMENT: Strategy × Design × Technology */}
      <TechnologyStatement />

      {/* 04. SERVICES: Interactive horizontal service system */}
      <HorizontalServicesShowcase />

      {/* 05. SELECTED WORK: Project 01, Project 02, Project 03, Project 04 */}
      <VerifiedCaseStudies />

      {/* 06. TECHNOLOGY: Interactive technology statement & system architecture flow */}
      <SystemArchitectureFlow />

      {/* 07. EXPERIENCE: Large visual / motion section (72-frame 3D hardware turntable) */}
      <section id="experience" className="w-full">
        <ScrollFrameSequence />
      </section>

      {/* 08. DIRECTOR: Existing Director section (DON'T CHANGE CONTENT/DESIGN) */}
      <DirectorSection />

      {/* 09. ABOUT OHO TECH: Who we are / What we believe / What we build */}
      <EditorialAboutSection />

      {/* 10. FINAL CTA: LET'S BUILD SOMETHING GREAT. */}
      <FinalCinematicCTA onOpenEstimate={() => setIsEstimateOpen(true)} />

      {/* 11. OHO TECH REVEAL: Huge OHO TECH */}
      <FooterCurtain />

      {/* Interactive System Architecture Estimate Modal */}
      <SystemEstimateModal
        isOpen={isEstimateOpen}
        onClose={() => setIsEstimateOpen(false)}
      />

    </div>
  );
}

'use client';

import * as React from 'react';
import { HeroExperience } from '@/components/home/HeroExperience';
import { BrandStatement } from '@/components/home/BrandStatement';
import { ServicesExperience } from '@/components/home/ServicesExperience';
import { SelectedWork } from '@/components/home/SelectedWork';
import { TechnologyExperience } from '@/components/home/TechnologyExperience';
import { ExperienceShowcase } from '@/components/home/ExperienceShowcase';
import { DirectorSection } from '@/components/home/DirectorSection';
import { ProcessSection } from '@/components/home/ProcessSection';
import { CompanyStatement } from '@/components/home/CompanyStatement';
import { FinalCTA } from '@/components/home/FinalCTA';
import { SystemEstimateModal } from '@/components/home/SystemEstimateModal';

/**
 * Modular OHO TECH Homepage Architecture:
 * 
 * Home
 * ├── ExistingHeader          (rendered in layout.tsx - Header.tsx untouched)
 * ├── HeroExperience          (WE BUILD DIGITAL EXPERIENCES.)
 * ├── BrandStatement          (Strategy × Design × Technology)
 * ├── ServicesExperience      (Core Engineering Services Grid)
 * ├── SelectedWork            (Flagship Architecture Projects 01 - 04)
 * ├── TechnologyExperience    (5-Tier Enterprise Topology & Live Inspector)
 * ├── ExperienceShowcase      (Hardware 3D Motion Sequence Container)
 * ├── ExistingDirectorSection (Japabandhu Kampa & Himansu Nayak MCA - Unchanged)
 * ├── CompanyStatement        (Who We Are / What We Believe / What We Build)
 * ├── FinalCTA                (LET'S BUILD SOMETHING GREAT.)
 * └── UnifiedFooter           (rendered in layout.tsx - OHO TECH Reveal & Directory)
 */
export default function HomePage() {
  const [isEstimateOpen, setIsEstimateOpen] = React.useState(false);

  return (
    <div className="w-full bg-[#0a0a0b] text-[#e8e8e6] min-h-screen overflow-x-hidden">
      
      {/* 01. Hero Experience */}
      <HeroExperience />

      {/* 02. Brand Statement */}
      <BrandStatement />

      {/* 03. Services Experience */}
      <ServicesExperience />

      {/* 04. Selected Work */}
      <SelectedWork />

      {/* 05. Technology Experience */}
      <TechnologyExperience />

      {/* 06. Experience Showcase */}
      <ExperienceShowcase />

      {/* 07. 5-Phase Engineering Roadmap */}
      <ProcessSection />

      {/* 08. Existing Director Section (100% Preserved) */}
      <DirectorSection />

      {/* 08. Company Statement */}
      <CompanyStatement />

      {/* 09. Final CTA */}
      <FinalCTA onOpenEstimate={() => setIsEstimateOpen(true)} />

      {/* Interactive Architecture System Estimate Modal */}
      <SystemEstimateModal
        isOpen={isEstimateOpen}
        onClose={() => setIsEstimateOpen(false)}
      />

    </div>
  );
}

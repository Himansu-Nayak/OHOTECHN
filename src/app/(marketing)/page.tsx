'use client';

import * as React from 'react';
import { HeroExperience } from '@/components/home/HeroExperience';
import { InteractiveMarquee } from '@/components/ui/InteractiveMarquee';
import { BrandStatement } from '@/components/home/BrandStatement';
import { ServicesExperience } from '@/components/home/ServicesExperience';
import { MobileAppShowcase } from '@/components/home/MobileAppShowcase';
import { ProductDiscoveryBanner } from '@/components/home/ProductDiscoveryBanner';
import { SelectedWork } from '@/components/home/SelectedWork';
import { TechnologyExperience } from '@/components/home/TechnologyExperience';
import { ExperienceShowcase } from '@/components/home/ExperienceShowcase';
import { DirectorSection } from '@/components/home/DirectorSection';
import { ProcessSection } from '@/components/home/ProcessSection';
import { CompanyStatement } from '@/components/home/CompanyStatement';
import { FinalCTA } from '@/components/home/FinalCTA';
import { SystemEstimateModal } from '@/components/home/SystemEstimateModal';

/**
 * Authoritative OHO TECH Homepage Architecture:
 * 
 * Home
 * ├── Header                  (rendered in layout.tsx - Header.tsx)
 * ├── HeroExperience          (WE BUILD DIGITAL EXPERIENCES.)
 * ├── InteractiveMarquee      (Real-time ecosystem & technology ticker)
 * ├── BrandStatement          (Strategy × Design × Technology)
 * ├── ServicesExperience      (Core Engineering Services Grid)
 * ├── MobileAppShowcase       (Native iOS, Android & Field Mobility)
 * ├── ProductDiscoveryBanner  (Turnkey Commercial Software Catalog Teaser)
 * ├── SelectedWork            (Verified Flagship Case Studies 01 - 05)
 * ├── TechnologyExperience    (5-Tier Enterprise Topology & Live Inspector)
 * ├── ExperienceShowcase      (Hardware 3D Motion Sequence Container)
 * ├── ProcessSection          (5-Phase Engineering Roadmap)
 * ├── DirectorSection         (Japabandhu Kampa & Himansu Nayak MCA Leadership)
 * ├── CompanyStatement        (Who We Are / What We Believe / What We Build)
 * ├── FinalCTA                (LET'S BUILD SOMETHING GREAT.)
 * └── Footer                  (rendered in layout.tsx - OHO TECH Directory)
 */
export default function HomePage() {
  const [isEstimateOpen, setIsEstimateOpen] = React.useState(false);

  return (
    <div className="w-full bg-transparent text-[#e8e8e6] min-h-screen overflow-x-hidden">
      
      {/* 01. Hero Experience */}
      <HeroExperience />

      {/* 01b. Interactive Drag Marquee */}
      <InteractiveMarquee />

      {/* 02. Brand Statement */}
      <BrandStatement />

      {/* 03. Services Experience */}
      <ServicesExperience />

      {/* 04. Mobile Application Engineering Showcase */}
      <MobileAppShowcase />

      {/* 05. Commercial Turnkey Product Discovery */}
      <ProductDiscoveryBanner />

      {/* 06. Selected Work & Verified Enterprise Case Studies */}
      <SelectedWork />

      {/* 07. Technology Experience & 5-Tier Topology */}
      <TechnologyExperience />

      {/* 08. Experience Showcase */}
      <ExperienceShowcase />

      {/* 09. 5-Phase Engineering Delivery Engine */}
      <ProcessSection />

      {/* 10. Executive & Technical Director Leadership */}
      <DirectorSection />

      {/* 11. Company Statement */}
      <CompanyStatement />

      {/* 12. Final Call-to-Action */}
      <FinalCTA onOpenEstimate={() => setIsEstimateOpen(true)} />

      {/* Interactive Architecture System Estimate Modal */}
      <SystemEstimateModal
        isOpen={isEstimateOpen}
        onClose={() => setIsEstimateOpen(false)}
      />

    </div>
  );
}

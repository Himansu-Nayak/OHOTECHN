'use client';

import * as React from 'react';
import { HeroExperience } from '@/components/home/HeroExperience';
import { InteractiveMarquee } from '@/components/ui/InteractiveMarquee';
import { BrandStatement } from '@/components/home/BrandStatement';
import { ProductDiscoveryBanner } from '@/components/home/ProductDiscoveryBanner';
import { ServicesExperience } from '@/components/home/ServicesExperience';
import { MobileAppShowcase } from '@/components/home/MobileAppShowcase';
import { SelectedWork } from '@/components/home/SelectedWork';
import { TechnologyExperience } from '@/components/home/TechnologyExperience';
import { ProcessSection } from '@/components/home/ProcessSection';
import { CompanyStatement } from '@/components/home/CompanyStatement';
import { DirectorSection } from '@/components/home/DirectorSection';
import { FinalCTA } from '@/components/home/FinalCTA';
import { SystemEstimateModal } from '@/components/home/SystemEstimateModal';

/**
 * World-Class OHO TECH Homepage Architecture:
 * 
 * Home
 * ├── Header                  (rendered in layout.tsx - Header.tsx)
 * ├── 01. HeroExperience          (DIGITAL TECHNOLOGY DESIGN × ENGINEERING)
 * ├── 02. InteractiveMarquee      (Real-time ecosystem & technology ticker)
 * ├── 03. BrandStatement          (What OHO TECH Does: Software Products × Custom Engineering)
 * ├── 04. ProductDiscoveryBanner  (Engine A: Software, Ready to Deploy - 28 Products)
 * ├── 05. ServicesExperience      (Engine B: Custom Software & Digital Services)
 * ├── 06. MobileAppShowcase       (Native iOS, Android & Field Mobility)
 * ├── 07. SelectedWork            (Verified Flagship Case Studies 01 - 05)
 * ├── 08. TechnologyExperience    (Architecture Foundation & 3D Topology Inspector)
 * ├── 09. ProcessSection          (5-Phase Delivery Engine: Discover → Scale)
 * ├── 10. CompanyStatement        (Why OHO TECH: Who We Are / 100% Code Ownership)
 * ├── 11. DirectorSection         (Japabandhu Kampa & Himansu Nayak MCA Governance)
 * ├── 12. FinalCTA                (READY TO BUILD OR DEPLOY? Dual Conversion)
 * └── Footer                  (rendered in layout.tsx - OHO TECH Directory)
 */
export default function HomePage() {
  const [isEstimateOpen, setIsEstimateOpen] = React.useState(false);

  return (
    <div className="w-full bg-transparent text-[#e8e8e6] min-h-screen overflow-x-hidden">
      
      {/* 01. Hero Experience */}
      <HeroExperience />

      {/* 02. Interactive Drag Marquee */}
      <InteractiveMarquee />

      {/* 03. What OHO TECH Does: Two Business Engines (Buy Software × Build With Us) */}
      <BrandStatement />

      {/* 04. Software Products: Software, Ready to Deploy */}
      <ProductDiscoveryBanner />

      {/* 05. Digital Engineering Services: Bespoke Systems */}
      <ServicesExperience />

      {/* 06. Mobile Application Engineering Showcase */}
      <MobileAppShowcase />

      {/* 07. Selected Work & Verified Enterprise Case Studies */}
      <SelectedWork />

      {/* 08. Technology Experience & 3D Topology Foundation */}
      <TechnologyExperience />

      {/* 09. 5-Phase Engineering Delivery Engine */}
      <ProcessSection />

      {/* 10. Why OHO TECH: Company Principles & 100% Code Ownership */}
      <CompanyStatement />

      {/* 11. Executive & Technical Director Leadership */}
      <DirectorSection />

      {/* 12. Final Call-to-Action: Ready to Build or Deploy? */}
      <FinalCTA onOpenEstimate={() => setIsEstimateOpen(true)} />

      {/* Interactive Architecture System Estimate Modal */}
      <SystemEstimateModal
        isOpen={isEstimateOpen}
        onClose={() => setIsEstimateOpen(false)}
      />

    </div>
  );
}

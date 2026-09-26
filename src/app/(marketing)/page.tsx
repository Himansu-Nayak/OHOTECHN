'use client';

import * as React from 'react';
import { HeroExperience } from '@/components/home/HeroExperience';
import { InteractiveMarquee } from '@/components/ui/InteractiveMarquee';
import { ProductDiscoveryBanner } from '@/components/home/ProductDiscoveryBanner';
import { ServicesExperience } from '@/components/home/ServicesExperience';
import { EngineeringTelemetryFeed } from '@/components/home/EngineeringTelemetryFeed';
import { BlueprintRail } from '@/components/home/BlueprintRail';
import { AudienceSolutions } from '@/components/home/AudienceSolutions';
import { MobileAppShowcase } from '@/components/home/MobileAppShowcase';
import { TechnologyExperience } from '@/components/home/TechnologyExperience';
import { ProcessSection } from '@/components/home/ProcessSection';
import { ProofWall } from '@/components/home/ProofWall';
import { DirectorSection } from '@/components/home/DirectorSection';
import { FinalCTA } from '@/components/home/FinalCTA';
import { SystemEstimateModal } from '@/components/home/SystemEstimateModal';

/**
 * Streamlined, World-Class OHO TECH Homepage Architecture:
 * 
 * Home
 * ├── Header                      (rendered in layout.tsx - Header.tsx)
 * ├── 01. HeroExperience          (DIGITAL TECHNOLOGY DESIGN × ENGINEERING)
 * ├── 02. InteractiveMarquee      (Real-time ecosystem & technology ticker)
 * ├── 03. ProductDiscoveryBanner  (Engine A: Software, Ready to Deploy - 28 Products)
 * ├── 04. ServicesExperience      (Engine B: Custom Software & Digital Services)
 * ├── 05. EngineeringTelemetry    (Real-time Telemetry & Autonomous Operations Feed)
 * ├── 06. BlueprintRail           (Architectural Blueprints & Horizontal Pattern Rail)
 * ├── 07. AudienceSolutions       (Operating Scale: Enterprise, Startups, Public Sector, SMEs)
 * ├── 08. MobileAppShowcase       (Native iOS, Android & Field Mobility)
 * ├── 09. TechnologyExperience    (Architecture Foundation & 3D Topology Inspector)
 * ├── 10. ProcessSection          (5-Phase Delivery Engine: Discover → Scale)
 * ├── 11. ProofWall               (Verified Production Endorsements & Proof Matrix)
 * ├── 12. DirectorSection         (Japabandhu Kampa & Himansu Nayak MCA Governance)
 * ├── 13. FinalCTA                (READY TO BUILD OR DEPLOY? Dual Conversion)
 * └── Footer                      (rendered in layout.tsx - OHO TECH Directory)
 * 
 * Note: Legacy BrandStatement, SelectedWork, and CompanyStatement components
 * remain preserved in src/components/home/ for reference and dedicated pages.
 */
export default function HomePage() {
  const [isEstimateOpen, setIsEstimateOpen] = React.useState(false);

  return (
    <div className="w-full bg-transparent text-[#e8e8e6] min-h-screen overflow-x-hidden">
      
      {/* 01. Hero Experience */}
      <HeroExperience />

      {/* 02. Interactive Drag Marquee */}
      <InteractiveMarquee />

      {/* 03. Engine A: Software Products (Software, Ready to Deploy - 28 Products) */}
      <ProductDiscoveryBanner />

      {/* 04. Engine B: Digital Engineering Services (Bespoke Systems & APIs) */}
      <ServicesExperience />

      {/* 05. Real-Time Telemetry & Autonomous Operations Stream (Ploy-inspired animated feed) */}
      <EngineeringTelemetryFeed />

      {/* 06. Architectural Blueprints & Horizontal Scrolling Rail (Ploy-inspired pattern) */}
      <BlueprintRail />

      {/* 07. Built For Your Operating Scale: Expanding Segment Cards (Ploy-inspired fluid accordion) */}
      <AudienceSolutions />

      {/* 08. Mobile Application Engineering Showcase */}
      <MobileAppShowcase />

      {/* 09. Technology Experience & 3D Topology Foundation */}
      <TechnologyExperience />

      {/* 10. 5-Phase Engineering Delivery Engine */}
      <ProcessSection />

      {/* 11. Verified Production Proof & Stakeholder Endorsements (Ploy-inspired animated matrix) */}
      <ProofWall />

      {/* 12. Executive & Technical Director Leadership */}
      <DirectorSection />

      {/* 13. Final Call-to-Action: Ready to Build or Deploy? */}
      <FinalCTA onOpenEstimate={() => setIsEstimateOpen(true)} />

      {/* Interactive Architecture System Estimate Modal */}
      <SystemEstimateModal
        isOpen={isEstimateOpen}
        onClose={() => setIsEstimateOpen(false)}
      />

    </div>
  );
}

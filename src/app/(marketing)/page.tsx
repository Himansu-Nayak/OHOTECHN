'use client';

import * as React from 'react';
import { HeroExperience } from '@/components/home/HeroExperience';
import { InteractiveMarquee } from '@/components/ui/InteractiveMarquee';
import { PlatformEnginesShowcase } from '@/components/home/PlatformEnginesShowcase';
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
 * World-Class OHO TECH Homepage Architecture (Ploy-Inspired Motion Flow):
 * 
 * Home
 * ├── Header                      (rendered in layout.tsx - Header.tsx)
 * ├── 01. HeroExperience          (HTML5 Video Autoplay Background + Kinetic Spheres + Cinematic Title)
 * ├── 02. InteractiveMarquee      (Continuous Flowing Ecosystem & Client Trust Ticker)
 * ├── 03. PlatformEnginesShowcase (ONE PLATFORM / THREE ENGINES Floating Centerpiece)
 * ├── 04. ProductDiscoveryBanner  (Engine A: Software, Ready to Deploy - 28 Products)
 * ├── 05. ServicesExperience      (Engine B: Custom Software & Digital Services)
 * ├── 06. EngineeringTelemetry    (Real-time Animated Counters & Autonomous Operations Stream)
 * ├── 07. BlueprintRail           (Continuous Auto-Scrolling Flowing Blueprint Carousel)
 * ├── 08. AudienceSolutions       (Operating Scale: High-Contrast Color Inversion Accordion)
 * ├── 09. MobileAppShowcase       (Native iOS, Android & Field Mobility)
 * ├── 10. TechnologyExperience    (Architecture Foundation & 3D Topology Inspector)
 * ├── 11. ProcessSection          (5-Phase Delivery Engine: Discover → Scale)
 * ├── 12. ProofWall               (Verified Production Endorsements & Proof Matrix)
 * ├── 13. DirectorSection         (Japabandhu Kampa & Himansu Nayak MCA Governance)
 * ├── 14. FinalCTA                (Instant Scope Input & Dual Conversion)
 * └── Footer                      (rendered in layout.tsx - OHO TECH Directory)
 */
export default function HomePage() {
  const [isEstimateOpen, setIsEstimateOpen] = React.useState(false);

  return (
    <div className="w-full bg-transparent text-[#e8e8e6] min-h-screen overflow-x-hidden">
      
      {/* 01. Hero Experience with HTML5 Video Background & Kinetic Floating Spheres */}
      <HeroExperience />

      {/* 02. Continuous Flowing Ecosystem Trust Marquee */}
      <InteractiveMarquee />

      {/* 03. ONE PLATFORM // THREE ENGINES Kinetic Floating Centerpiece (Inspired by play 1) */}
      <PlatformEnginesShowcase />

      {/* 04. Engine A: Ready Commercial Software (28 Turnkey Products) */}
      <ProductDiscoveryBanner />

      {/* 05. Engine B: Custom Software Engineering Services */}
      <ServicesExperience />

      {/* 06. Real-Time Telemetry & Autonomous Operations Event Stream with Animated Counters */}
      <EngineeringTelemetryFeed />

      {/* 07. Continuous Flowing Architectural Blueprint Rail with Hover Pause */}
      <BlueprintRail />

      {/* 08. Built For Your Operating Scale: High-Contrast Color Inversion Accordion */}
      <AudienceSolutions />

      {/* 09. Mobile Application Engineering Showcase */}
      <MobileAppShowcase />

      {/* 10. Technology Experience & 3D Topology Foundation */}
      <TechnologyExperience />

      {/* 11. 5-Phase Engineering Delivery Engine */}
      <ProcessSection />

      {/* 12. Verified Production Proof & Stakeholder Endorsements with Animated Filters */}
      <ProofWall />

      {/* 13. Executive & Technical Director Leadership */}
      <DirectorSection />

      {/* 14. Final Call-to-Action with Instant Scope Input & Instant Estimate Trigger */}
      <FinalCTA onOpenEstimate={() => setIsEstimateOpen(true)} />

      {/* Interactive Architecture System Estimate Modal */}
      <SystemEstimateModal
        isOpen={isEstimateOpen}
        onClose={() => setIsEstimateOpen(false)}
      />

    </div>
  );
}

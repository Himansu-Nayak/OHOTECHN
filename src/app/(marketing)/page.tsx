'use client';

import * as React from 'react';
import { HeroExperience } from '@/components/home/HeroExperience';
import { InteractiveMarquee } from '@/components/ui/InteractiveMarquee';
import { PlatformEnginesShowcase } from '@/components/home/PlatformEnginesShowcase';
import { ProductDiscoveryBanner } from '@/components/home/ProductDiscoveryBanner';
import { ServicesExperience } from '@/components/home/ServicesExperience';
import { ProofWall } from '@/components/home/ProofWall';
import { DirectorSection } from '@/components/home/DirectorSection';
import { FinalCTA } from '@/components/home/FinalCTA';
import { SystemEstimateModal } from '@/components/home/SystemEstimateModal';

/**
 * OHO TECH Streamlined Homepage Architecture (Section-Locked & Narrative Driven):
 * 
 * ├── Header                      (rendered in layout.tsx - Header.tsx) [LOCKED 1]
 * ├── 01. HeroExperience          (Cinematic H1 + Value Statement + Dual CTAs + Studio Visual) [LOCKED 2]
 * ├── 02. InteractiveMarquee      (Continuous Flowing Ecosystem Ribbon)
 * ├── 03. PlatformEnginesShowcase (ONE PLATFORM // THREE ENGINES Centerpiece) [LOCKED 3]
 * ├── 04. ProductDiscoveryBanner  (Engine A: 28 Ready Turnkey Commercial Software Products)
 * ├── 05. ServicesExperience      (Engine B: Custom Digital Systems & Mobile Engineering)
 * ├── 06. ProofWall               (Verified Production Proof & Case Studies)
 * ├── 07. DirectorSection         (Japabandhu Kampa & Himansu Nayak Leadership) [LOCKED 4]
 * ├── 08. FinalCTA                (Instant Scope Input & Dual Conversion) [LOCKED 5]
 * └── Footer                      (rendered in layout.tsx - OHO TECH Directory) [LOCKED 6]
 */
export default function HomePage() {
  const [isEstimateOpen, setIsEstimateOpen] = React.useState(false);

  return (
    <div className="w-full bg-transparent text-[#e8e8e6] min-h-screen overflow-x-hidden">
      
      {/* 01. Hero Experience (Locked 2) */}
      <HeroExperience />

      {/* 02. Continuous Flowing Ecosystem Trust Ribbon */}
      <InteractiveMarquee />

      {/* 03. ONE PLATFORM // THREE ENGINES (Locked 3 - Second Section) */}
      <PlatformEnginesShowcase />

      {/* 04. Core Offering: Ready Commercial Software (28 Turnkey Products) */}
      <ProductDiscoveryBanner />

      {/* 05. Core Offering: Custom Software & Digital Engineering Services */}
      <ServicesExperience />

      {/* 06. Proof: Verified Production Endorsements & Enterprise Proof */}
      <ProofWall />

      {/* 07. Leadership: Executive & Technical Director Governance (Locked 4) */}
      <DirectorSection />

      {/* 08. Final Conversion: Instant Scope Input & Dual Action CTAs (Locked 5) */}
      <FinalCTA onOpenEstimate={() => setIsEstimateOpen(true)} />

      {/* Interactive Architecture System Estimate Modal */}
      <SystemEstimateModal
        isOpen={isEstimateOpen}
        onClose={() => setIsEstimateOpen(false)}
      />

    </div>
  );
}

'use client';

import * as React from 'react';
import Image from 'next/image';
import { Service } from '@/config/services';

interface Enterprise3DCardProps {
  service: Service;
}

export function Enterprise3DCard({ service }: Enterprise3DCardProps) {
  // Select the appropriate picture from the public/images/service-capabilities folder
  const get3DImagePath = (srv: Service) => {
    if (srv.slug === 'content-planning' || srv.slug === 'content-planning-strategy') {
      return '/images/service-capabilities/content-planning.jpg';
    }
    if (srv.slug === 'social-media-management') {
      return '/images/service-capabilities/social-media-management.jpg';
    }
    if (srv.category === 'marketing') {
      return '/images/service-capabilities/3d-digital-growth.jpg';
    }
    if (
      srv.slug.includes('software') ||
      srv.slug.includes('app') ||
      srv.slug.includes('website') ||
      srv.slug.includes('api')
    ) {
      return '/images/service-capabilities/3d-software-dev.jpg';
    }
    return '/images/service-capabilities/3d-enterprise-node.jpg';
  };

  const imageSrc = get3DImagePath(service);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Whole Outer Card with Orange-to-Red Wave Background (Matching Reference) */}
      <div className="relative bg-gradient-to-b from-[#ff5e1a] via-[#e03a08] to-[#7a0303] border border-orange-400/30 rounded-[36px] p-6 sm:p-8 text-center flex flex-col items-center justify-between shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-orange-950/40">
        
        {/* Layer 1 Bottom Wave Accent */}
        <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none overflow-hidden">
          <svg
            className="absolute bottom-6 w-full h-24 text-[#b81206] fill-current opacity-90"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path d="M0,160C320,220,640,220,960,160C1120,130,1280,130,1440,160L1440,320L0,320Z" />
          </svg>
          
          {/* Layer 2 Bottom Wave Accent */}
          <svg
            className="absolute bottom-0 w-full h-28 text-[#580000] fill-current"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path d="M0,224C360,265,720,265,1080,224C1260,203,1350,203,1440,224L1440,320L0,320Z" />
          </svg>
        </div>

        {/* Floating Uncropped Picture Frame in Center of Card */}
        <div className="relative z-10 w-full aspect-square max-w-[300px] sm:max-w-[320px] mb-6 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 bg-black/20 backdrop-blur-xs flex items-center justify-center p-2">
          <Image
            src={imageSrc}
            alt={`${service.name} Enterprise Visual`}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            priority
            className="object-contain object-center p-1"
          />
        </div>

        {/* Text & Enterprise Capability Badge over Wave Footer */}
        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="inline-block text-xs font-mono font-bold text-sky-700 bg-sky-50/95 backdrop-blur-sm px-4 py-1.5 rounded-full border border-sky-200 shadow-md mb-2.5">
            ENTERPRISE CAPABILITY
          </div>

          <p className="text-xs font-mono text-white/90 font-medium tracking-wide">
            Tailored Execution &amp; Dedicated Engineering
          </p>
        </div>

      </div>
    </div>
  );
}

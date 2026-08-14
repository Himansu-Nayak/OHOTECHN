'use client';

import * as React from 'react';
import NextImage from 'next/image';

export function HeroLaunchBackground() {
  return (
    <div className="w-full relative rounded-3xl sm:rounded-[32px] overflow-hidden border border-slate-200/80 bg-[#111113] shadow-xl group">
      <NextImage
        src="/hero_workspace_editorial.jpg"
        alt="OHO TECH Technology Studio - Real Software Engineers & Product Designers Working in a Modern Architectural Workspace"
        width={1600}
        height={900}
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        className="w-full h-auto max-h-[380px] sm:max-h-[460px] lg:max-h-[520px] object-cover rounded-3xl group-hover:scale-[1.01] transition-transform duration-500"
        priority
      />
    </div>
  );
}

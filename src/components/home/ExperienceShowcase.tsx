'use client';

import * as React from 'react';
import { ScrollFrameSequence } from '@/components/ui/ScrollFrameSequence';
import { Eye, Sparkles } from 'lucide-react';

export function ExperienceShowcase() {
  return (
    <section 
      id="experience" 
      className="w-full bg-[#0a0a0b] text-white relative overflow-hidden"
    >
      {/* Top transition blend from TechnologyExperience */}
      <div className="absolute top-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-b from-[#0a0a0b] to-transparent pointer-events-none z-20" />

      <div className="w-full relative z-10">
        <ScrollFrameSequence totalFrames={0} />
      </div>

      {/* Bottom transition blend into DirectorSection */}
      <div className="absolute bottom-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-t from-[#0d0d0e] to-transparent pointer-events-none z-20" />
    </section>
  );
}

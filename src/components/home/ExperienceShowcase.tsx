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
      <div className="w-full">
        <ScrollFrameSequence />
      </div>
    </section>
  );
}

'use client';

import * as React from 'react';
import { ArrowDown } from 'lucide-react';

interface StoryFlowConnectorProps {
  nextTargetId: string;
}

export function StoryFlowConnector({ nextTargetId }: StoryFlowConnectorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [lightProgress, setLightProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through this connector element (0 to 100%)
      const totalDistance = windowHeight + rect.height;
      const currentPos = windowHeight - rect.top;
      const rawProgress = Math.max(0, Math.min(100, (currentPos / totalDistance) * 100));
      setLightProgress(rawProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToNext = () => {
    const el = document.getElementById(nextTargetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="max-w-[1536px] w-full mx-auto my-10 flex flex-col items-center justify-center relative z-20"
    >
      
      {/* Top Vertical Guide Track with Scroll Point Light */}
      <div className="w-1 h-12 bg-slate-800 rounded-full relative overflow-hidden">
        {/* Dynamic Glowing Point Light Flowing Down */}
        <div
          className="absolute left-0 w-full h-4 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981] transition-all duration-75"
          style={{ top: `${lightProgress}%`, transform: 'translateY(-50%)' }}
        />
      </div>

      {/* Sleek Dark Large Arrow Button (No Text, Matches Screenshot Theme) */}
      <button
        onClick={handleScrollToNext}
        type="button"
        aria-label="Scroll to next section"
        className="group relative my-2 p-4 sm:p-5 rounded-full bg-[#0d0d0e] border-2 border-slate-700 hover:border-emerald-400 shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer flex items-center justify-center"
      >
        {/* Ambient Glowing Aura */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl group-hover:bg-emerald-500/30 transition-all pointer-events-none" />

        {/* Larger Animated Arrow Icon */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#141416] border border-white/10 group-hover:border-emerald-400/50 flex items-center justify-center text-emerald-400 group-hover:text-white transition-all shadow-inner relative z-10">
          <ArrowDown className="w-7 h-7 sm:w-8 sm:h-8 group-hover:translate-y-1 transition-transform duration-300 text-emerald-400" />
        </div>
      </button>

      {/* Bottom Vertical Guide Track with Scroll Point Light */}
      <div className="w-1 h-12 bg-slate-800 rounded-full relative overflow-hidden">
        <div
          className="absolute left-0 w-full h-4 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981] transition-all duration-75"
          style={{ top: `${lightProgress}%`, transform: 'translateY(-50%)' }}
        />
      </div>

    </div>
  );
}

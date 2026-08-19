'use client';

import * as React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Pillar {
  id: string;
  direction: string;
  title: string;
  icon: string;
  description: string;
  color: 'emerald' | 'amber';
  features: string[];
}

const pillars: Pillar[] = [
  {
    id: 'direction-01',
    direction: 'DIRECTION 01',
    title: 'Bespoke Software Engineering',
    icon: '🛠️',
    description:
      'Tailored software applications engineered around exact client operational workflows rather than rigid off-the-shelf templates.',
    color: 'emerald',
    features: ['Custom Architecture', 'Workflow Automation'],
  },
  {
    id: 'direction-02',
    direction: 'DIRECTION 02',
    title: 'Web & Mobile Platforms',
    icon: '🌐',
    description:
      'High-performance web applications, customer portals, and native mobile apps designed for daily user productivity.',
    color: 'emerald',
    features: ['Fluid Responsive UI', 'Cross-Platform Sync'],
  },
  {
    id: 'direction-03',
    direction: 'DIRECTION 03',
    title: 'Digital Growth Engine',
    icon: '📈',
    description:
      'Data-focused search engine optimization, Google & Meta advertising campaigns, and strategic brand positioning.',
    color: 'amber',
    features: ['Targeted Acquisition', 'Conversion Optimization'],
  },
  {
    id: 'direction-04',
    direction: 'DIRECTION 04',
    title: 'Long-Term Scalability',
    icon: '🛡️',
    description:
      'Modular software infrastructure and technical support ensuring your digital products scale cleanly as your business expands.',
    color: 'emerald',
    features: ['Modular Microservices', 'Continuous Support'],
  },
];

export function StrategicPillarsSection() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Scroll active card into the exact center of the container
  const scrollToIndex = React.useCallback((index: number) => {
    setActiveIndex(index);
    const container = containerRef.current;
    const card = cardRefs.current[index];

    if (container && card) {
      const containerWidth = container.offsetWidth;
      const cardLeft = card.offsetLeft;
      const cardWidth = card.offsetWidth;
      const scrollPosition = cardLeft - containerWidth / 2 + cardWidth / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  // Center initial card on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      scrollToIndex(0);
    }, 150);
    return () => clearTimeout(timer);
  }, [scrollToIndex]);

  // Update active index dynamically on horizontal scroll
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    });

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  };

  // Continuous Auto-Scroll Loop (every 3 seconds)
  React.useEffect(() => {
    if (isHovered) return;
    const autoInterval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % pillars.length;
        scrollToIndex(next);
        return next;
      });
    }, 3000);
    return () => clearInterval(autoInterval);
  }, [isHovered, scrollToIndex]);

  return (
    <div
      className="w-full mb-8 bg-[#0d0d0e] text-white rounded-[28px] sm:rounded-[36px] p-4 sm:p-6 lg:p-8 border-2 border-slate-800 shadow-2xl relative overflow-hidden select-none grid-pattern-dark"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Slider Wrapper with Left & Right Dark Fog Masking Overlays */}
      <div className="relative w-full py-4">
        {/* Left Side Dark Fog Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 lg:w-36 bg-gradient-to-r from-[#0d0d0e] via-[#0d0d0e]/85 to-transparent z-20 pointer-events-none backdrop-blur-[2px]" />

        {/* Right Side Dark Fog Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 lg:w-36 bg-gradient-to-l from-[#0d0d0e] via-[#0d0d0e]/85 to-transparent z-20 pointer-events-none backdrop-blur-[2px]" />

        {/* Horizontal Scroll Track */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex gap-6 sm:gap-8 overflow-x-auto scroll-smooth py-6 px-[12vw] sm:px-[25vw] md:px-[30vw] no-scrollbar snap-x snap-mandatory focus:outline-none relative z-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {pillars.map((pillar, index) => {
            const isActive = index === activeIndex;
            const isAmber = pillar.color === 'amber';

            return (
              <div
                key={pillar.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onClick={() => scrollToIndex(index)}
                className={`snap-center shrink-0 w-[290px] sm:w-[340px] md:w-[380px] p-8 rounded-[32px] cursor-pointer transition-all duration-500 ease-out flex flex-col justify-between relative overflow-hidden backdrop-blur-2xl ${
                  isActive
                    ? isAmber
                      ? 'bg-[#141416] border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)] ring-4 ring-amber-400/20 scale-105 opacity-100 z-30 blur-0'
                      : 'bg-[#141416] border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] ring-4 ring-emerald-400/20 scale-105 opacity-100 z-30 blur-0'
                    : 'bg-[#141416]/60 border border-white/10 opacity-45 hover:opacity-85 hover:border-white/20 scale-90 z-10 blur-[1.5px]'
                }`}
              >
                {/* Glowing subtle gradient overlay when active */}
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-tr ${
                    isAmber ? 'from-amber-500/10 via-orange-500/5' : 'from-emerald-500/10 via-teal-500/5'
                  } to-transparent pointer-events-none`} />
                )}

                <div className="relative z-10">
                  {/* Icon & Active Indicator Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 border shadow-inner ${
                        isAmber
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      } ${isActive ? 'scale-110 rotate-3 shadow-lg' : 'scale-100'}`}
                    >
                      {pillar.icon}
                    </div>

                    {isActive && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white font-mono text-[10px] font-extrabold uppercase tracking-wider shadow-sm animate-pulse ${
                        isAmber ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        AUTO-SCROLLING
                      </span>
                    )}
                  </div>

                  {/* Direction Label */}
                  <div
                    className={`text-[11px] font-mono font-bold uppercase tracking-widest mb-2 transition-colors ${
                      isActive
                        ? isAmber
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {pillar.direction}
                  </div>

                  {/* Card Title */}
                  <h3
                    className={`text-xl font-extrabold tracking-tight mb-3 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {pillar.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                {/* Features Footer List */}
                <div className="relative z-10 pt-5 border-t border-white/10 space-y-2.5">
                  {pillar.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-[11px] font-mono text-slate-300"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isAmber ? 'text-amber-400' : 'text-emerald-400'
                        } ${isActive ? 'scale-110' : 'scale-90'}`}
                      />
                      <span className={isActive ? 'font-semibold text-white' : 'text-slate-300'}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-6 relative z-10">
          {pillars.map((pillar, index) => {
            const isActive = index === activeIndex;
            const isAmber = pillar.color === 'amber';
            return (
              <button
                key={pillar.id}
                onClick={() => scrollToIndex(index)}
                aria-label={`Center ${pillar.direction}`}
                className={`h-3 rounded-full transition-all duration-300 ${
                  isActive
                    ? isAmber
                      ? 'w-10 bg-amber-400 shadow-[0_0_10px_#f59e0b] ring-2 ring-amber-400/30'
                      : 'w-10 bg-emerald-400 shadow-[0_0_10px_#10b981] ring-2 ring-emerald-400/30'
                    : 'w-3 bg-white/20 hover:bg-white/40'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

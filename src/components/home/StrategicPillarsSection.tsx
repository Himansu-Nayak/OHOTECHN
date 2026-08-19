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
      className="w-full my-6 relative overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Slider Wrapper with Left & Right Cloud Fog Masking Overlays */}
      <div className="relative w-full py-8">
        {/* Left Side Cloud Fog Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 lg:w-48 bg-gradient-to-r from-white via-white/85 to-transparent z-20 pointer-events-none backdrop-blur-[2px]" />

        {/* Right Side Cloud Fog Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 lg:w-48 bg-gradient-to-l from-white via-white/85 to-transparent z-20 pointer-events-none backdrop-blur-[2px]" />

        {/* Horizontal Scroll Track */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex gap-6 sm:gap-8 overflow-x-auto scroll-smooth py-6 px-[15vw] sm:px-[30vw] md:px-[35vw] no-scrollbar snap-x snap-mandatory focus:outline-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {pillars.map((pillar, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={pillar.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onClick={() => scrollToIndex(index)}
                className={`snap-center shrink-0 w-[290px] sm:w-[340px] md:w-[380px] p-8 rounded-[32px] cursor-pointer transition-all duration-500 ease-out flex flex-col justify-between relative overflow-hidden ${
                  isActive
                    ? 'bg-white border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 ring-4 ring-emerald-500/15 scale-105 opacity-100 z-30 blur-0'
                    : 'bg-[#ffffff]/80 border-2 border-slate-200/90 opacity-45 hover:opacity-85 hover:border-slate-300 scale-90 z-10 blur-[1.5px]'
                }`}
              >
                {/* 4K Solid Background Glow Effect when active */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-teal-500/3 to-transparent pointer-events-none" />
                )}

                <div className="relative z-10">
                  {/* Icon & Active Indicator Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 shadow-sm ${
                        pillar.color === 'amber'
                          ? 'bg-amber-50 border border-amber-200/80 text-amber-600'
                          : 'bg-emerald-50 border border-emerald-200/80 text-emerald-600'
                      } ${isActive ? 'scale-110 rotate-3 shadow-md' : 'scale-100'}`}
                    >
                      {pillar.icon}
                    </div>

                    {isActive && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white font-mono text-[10px] font-extrabold uppercase tracking-wider shadow-sm animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        AUTO-SCROLLING
                      </span>
                    )}
                  </div>

                  {/* Direction Label */}
                  <div
                    className={`text-[11px] font-mono font-bold uppercase tracking-wider mb-2 transition-colors ${
                      isActive
                        ? pillar.color === 'amber'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {pillar.direction}
                  </div>

                  {/* Card Title */}
                  <h3
                    className={`text-xl font-bold tracking-tight mb-3 transition-colors ${
                      isActive ? 'text-[#0d0d0e]' : 'text-slate-700'
                    }`}
                  >
                    {pillar.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                {/* Features Footer List */}
                <div className="relative z-10 pt-5 border-t border-slate-200/90 space-y-2.5">
                  {pillar.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-[11px] font-mono text-slate-700"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          pillar.color === 'amber' ? 'text-amber-600' : 'text-emerald-600'
                        } ${isActive ? 'scale-110' : 'scale-90'}`}
                      />
                      <span className={isActive ? 'font-semibold text-slate-900' : 'text-slate-600'}>
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
        <div className="flex items-center justify-center gap-2.5 mt-6">
          {pillars.map((pillar, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={pillar.id}
                onClick={() => scrollToIndex(index)}
                aria-label={`Center ${pillar.direction}`}
                className={`h-3 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-10 bg-emerald-600 shadow-xs ring-2 ring-emerald-600/30'
                    : 'w-3 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

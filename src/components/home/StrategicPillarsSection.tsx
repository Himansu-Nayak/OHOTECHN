'use client';

import * as React from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [activeIndex, setActiveIndex] = React.useState(1); // Default center on DIRECTION 02 (index 1)
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Scroll active card into the center of the container
  const scrollToIndex = (index: number) => {
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
  };

  // Center initial card on mount
  React.useEffect(() => {
    scrollToIndex(1);
  }, []);

  // Update active index based on scroll position
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

  const handlePrev = () => {
    const nextIndex = activeIndex > 0 ? activeIndex - 1 : pillars.length - 1;
    scrollToIndex(nextIndex);
  };

  const handleNext = () => {
    const nextIndex = activeIndex < pillars.length - 1 ? activeIndex + 1 : 0;
    scrollToIndex(nextIndex);
  };

  return (
    <div className="w-full my-12 relative">
      
      {/* Controls Top Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
          Scrollable Strategic Directions ({activeIndex + 1} / {pillars.length})
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous direction"
            className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 flex items-center justify-center transition-all shadow-xs active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next direction"
            className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 flex items-center justify-center transition-all shadow-xs active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Carousel Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth py-6 px-[10vw] sm:px-[25vw] no-scrollbar snap-x snap-mandatory focus:outline-none"
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
              className={`snap-center shrink-0 w-[280px] sm:w-[320px] md:w-[360px] p-7 rounded-[28px] cursor-pointer transition-all duration-300 flex flex-col justify-between select-none ${
                isActive
                  ? 'bg-white border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-4 ring-emerald-500/10 scale-100 z-10'
                  : 'bg-[#fafafa] border-2 border-slate-200/90 opacity-75 hover:opacity-100 hover:border-slate-300 scale-95 z-0'
              }`}
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-2xl transition-transform ${
                    pillar.color === 'amber'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-emerald-50 text-emerald-600'
                  } ${isActive ? 'scale-110' : ''}`}
                >
                  {pillar.icon}
                </div>

                <div
                  className={`text-[11px] font-mono font-bold uppercase tracking-wider mb-1 ${
                    pillar.color === 'amber' ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {pillar.direction}
                </div>

                <h3 className="text-lg font-bold text-[#0d0d0e] mb-3 flex items-center gap-2">
                  <span>{pillar.icon}</span>
                  <span>{pillar.title}</span>
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80 space-y-2">
                {pillar.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-[11px] font-mono text-slate-700"
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${
                        pillar.color === 'amber' ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {pillars.map((pillar, index) => (
          <button
            key={pillar.id}
            onClick={() => scrollToIndex(index)}
            aria-label={`Go to ${pillar.direction}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'w-8 bg-emerald-600'
                : 'w-2.5 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

    </div>
  );
}

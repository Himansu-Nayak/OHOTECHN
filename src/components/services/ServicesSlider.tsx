'use client';

import * as React from 'react';
import Link from 'next/link';
import { Service } from '@/config/services';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface ServicesSliderProps {
  servicesList: Service[];
  badgeColor?: 'emerald' | 'amber';
}

export function ServicesSlider({
  servicesList,
  badgeColor = 'emerald',
}: ServicesSliderProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Center the active card in the horizontal container
  const scrollToIndex = React.useCallback(
    (index: number) => {
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
    },
    []
  );

  // Center initial card on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      scrollToIndex(0);
    }, 150);
    return () => clearTimeout(timer);
  }, [servicesList, scrollToIndex]);

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

  // Continuous Auto-Scroll Loop (every 3 seconds)
  React.useEffect(() => {
    if (isHovered || servicesList.length <= 1) return;
    const autoInterval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % servicesList.length;
        scrollToIndex(next);
        return next;
      });
    }, 3000);
    return () => clearInterval(autoInterval);
  }, [isHovered, servicesList.length, scrollToIndex]);

  return (
    <div
      className="relative w-full my-6 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left Side Dark Fog Masking Overlay */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 lg:w-36 bg-gradient-to-r from-[#0d0d0e] via-[#0d0d0e]/85 to-transparent z-20 pointer-events-none backdrop-blur-[2px]" />

      {/* Right Side Dark Fog Masking Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 lg:w-36 bg-gradient-to-l from-[#0d0d0e] via-[#0d0d0e]/85 to-transparent z-20 pointer-events-none backdrop-blur-[2px]" />

      {/* Horizontal Scroll Track */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-6 sm:gap-8 overflow-x-auto scroll-smooth py-6 px-[12vw] sm:px-[25vw] md:px-[30vw] no-scrollbar snap-x snap-mandatory focus:outline-none relative z-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {servicesList.map((service, index) => {
          const isActive = index === activeIndex;
          const isTech = service.category === 'technology';

          return (
            <div
              key={service.slug}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onClick={() => scrollToIndex(index)}
              className={cn(
                'snap-center shrink-0 w-[280px] sm:w-[330px] md:w-[360px] p-7 rounded-[28px] cursor-pointer transition-all duration-500 ease-out flex flex-col justify-between relative overflow-hidden backdrop-blur-2xl',
                isActive
                  ? isTech
                    ? 'bg-[#141416] border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] ring-4 ring-emerald-400/20 scale-105 opacity-100 z-30 blur-0'
                    : 'bg-[#141416] border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)] ring-4 ring-amber-400/20 scale-105 opacity-100 z-30 blur-0'
                  : 'bg-[#141416]/60 border border-white/10 opacity-45 hover:opacity-85 hover:border-white/20 scale-90 z-10 blur-[1.5px]'
              )}
            >
              {/* Background Ambient Glow when Active */}
              {isActive && (
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-tr pointer-events-none",
                  isTech ? "from-emerald-500/10 via-teal-500/5" : "from-amber-500/10 via-orange-500/5"
                )} />
              )}

              <div className="relative z-10">
                {/* Header Icon & Category Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 border shadow-inner',
                      isTech
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/15 border-amber-500/30 text-amber-400',
                      isActive && 'scale-110 rotate-3 shadow-lg'
                    )}
                  >
                    {service.emoji || '⚙️'}
                  </div>

                  <span
                    className={cn(
                      'text-[11px] font-mono font-semibold px-3 py-1 rounded-full border transition-colors',
                      isTech
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    )}
                  >
                    {isTech ? 'Technology' : 'Digital Growth'}
                  </span>
                </div>

                {/* Service Title */}
                <h4
                  className={cn(
                    'text-lg sm:text-xl font-extrabold tracking-tight mb-3 flex items-center gap-2 transition-colors',
                    isActive ? 'text-white' : 'text-slate-300'
                  )}
                >
                  <span>{service.emoji || '⚙️'}</span>
                  <span>{service.name}</span>
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-6">
                  {service.description}
                </p>
              </div>

              {/* Action Link Footer */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-xs font-bold text-slate-200 hover:text-emerald-400 flex items-center gap-2 group/btn"
                >
                  <span>Explore Service</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn:text-emerald-400 group-hover/btn:translate-x-1 transition-all" />
                </Link>

                {isActive && (
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    OHO TECH
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 relative z-10">
        {servicesList.map((service, index) => {
          const isActive = index === activeIndex;
          const isTech = service.category === 'technology';
          return (
            <button
              key={service.slug}
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to ${service.name}`}
              className={cn(
                'h-2.5 rounded-full transition-all duration-300',
                isActive
                  ? isTech
                    ? 'w-8 bg-emerald-400 shadow-[0_0_10px_#10b981] ring-2 ring-emerald-400/30'
                    : 'w-8 bg-amber-400 shadow-[0_0_10px_#f59e0b] ring-2 ring-amber-400/30'
                  : 'w-2.5 bg-white/20 hover:bg-white/40'
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

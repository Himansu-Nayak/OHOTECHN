'use client';

import * as React from 'react';
import Link from 'next/link';
import { Service } from '@/config/services';
import { cn } from '@/lib/utils';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

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

  // Auto-scroll loop (4.5 seconds, pauses on mouse hover)
  React.useEffect(() => {
    if (isHovered || servicesList.length <= 1) return;
    const autoInterval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % servicesList.length;
        scrollToIndex(next);
        return next;
      });
    }, 4500);
    return () => clearInterval(autoInterval);
  }, [isHovered, servicesList.length, scrollToIndex]);

  return (
    <div
      className="relative w-full my-6 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left Side Cloud Fog Masking Overlay */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 lg:w-36 bg-gradient-to-r from-[#fafafa] via-[#fafafa]/85 to-transparent z-20 pointer-events-none backdrop-blur-[2px]" />

      {/* Right Side Cloud Fog Masking Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 lg:w-36 bg-gradient-to-l from-[#fafafa] via-[#fafafa]/85 to-transparent z-20 pointer-events-none backdrop-blur-[2px]" />

      {/* Horizontal Scroll Track */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-6 sm:gap-8 overflow-x-auto scroll-smooth py-6 px-[12vw] sm:px-[25vw] md:px-[30vw] no-scrollbar snap-x snap-mandatory focus:outline-none"
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
                'snap-center shrink-0 w-[280px] sm:w-[330px] md:w-[360px] p-7 rounded-[28px] cursor-pointer transition-all duration-500 ease-out flex flex-col justify-between relative overflow-hidden',
                isActive
                  ? 'bg-white border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 ring-4 ring-emerald-500/15 scale-105 opacity-100 z-30 blur-0'
                  : 'bg-white/80 border-2 border-slate-200/90 opacity-45 hover:opacity-85 hover:border-slate-300 scale-90 z-10 blur-[1.5px]'
              )}
            >
              {/* Background Ambient Glow when Active */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-teal-500/3 to-transparent pointer-events-none" />
              )}

              <div className="relative z-10">
                {/* Header Icon & Category Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 shadow-xs',
                      isTech
                        ? 'bg-emerald-50 border border-emerald-200/80 text-emerald-600'
                        : 'bg-amber-50 border border-amber-200/80 text-amber-600',
                      isActive && 'scale-110 rotate-3 shadow-md'
                    )}
                  >
                    {service.emoji || '⚙️'}
                  </div>

                  <span
                    className={cn(
                      'text-[11px] font-mono font-semibold px-3 py-1 rounded-full border transition-colors',
                      isTech
                        ? 'bg-slate-50 text-slate-700 border-slate-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    )}
                  >
                    {isTech ? 'Technology' : 'Digital Growth'}
                  </span>
                </div>

                {/* Service Title */}
                <h4
                  className={cn(
                    'text-lg sm:text-xl font-bold tracking-tight mb-3 flex items-center gap-2 transition-colors',
                    isActive ? 'text-[#0d0d0e]' : 'text-slate-700'
                  )}
                >
                  <span>{service.emoji || '⚙️'}</span>
                  <span>{service.name}</span>
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-6">
                  {service.description}
                </p>
              </div>

              {/* Action Link Footer */}
              <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-xs font-bold text-slate-700 hover:text-emerald-600 flex items-center gap-2 group/btn"
                >
                  <span>Explore Service</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn:text-emerald-600 group-hover/btn:translate-x-1 transition-all" />
                </Link>

                {isActive && (
                  <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full animate-pulse">
                    CENTER
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {servicesList.map((service, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={service.slug}
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to ${service.name}`}
              className={cn(
                'h-2.5 rounded-full transition-all duration-300',
                isActive
                  ? 'w-8 bg-emerald-600 shadow-xs ring-2 ring-emerald-600/30'
                  : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

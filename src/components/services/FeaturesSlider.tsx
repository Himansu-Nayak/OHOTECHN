'use client';

import * as React from 'react';
import Image from 'next/image';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturesSliderProps {
  features: string[];
}

export function FeaturesSlider({ features }: FeaturesSliderProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Function to get image path for a feature
  const getFeatureImagePath = (featureName: string): string | null => {
    const lower = featureName.toLowerCase();
    if (lower.includes('content planning')) {
      return '/images/service-capabilities/content-planning.jpg';
    }
    if (lower.includes('graphic') || lower.includes('video') || lower.includes('production')) {
      return '/images/service-capabilities/graphic-video-production.jpg';
    }
    if (lower.includes('community') || lower.includes('moderation')) {
      return '/images/service-capabilities/community-moderation.jpg';
    }
    if (lower.includes('audience') || lower.includes('insights')) {
      return '/images/service-capabilities/audience-insights.jpg';
    }
    if (lower.includes('influencer') || lower.includes('outreach')) {
      return '/images/service-capabilities/influencer-outreach.jpg';
    }
    return null;
  };

  // Center active card in container
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

  // Auto-scroll loop every 3.5 seconds
  React.useEffect(() => {
    if (isHovered || features.length <= 1) return;
    const autoInterval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % features.length;
        scrollToIndex(next);
        return next;
      });
    }, 3500);
    return () => clearInterval(autoInterval);
  }, [isHovered, features.length, scrollToIndex]);

  const handlePrev = () => {
    const prev = activeIndex === 0 ? features.length - 1 : activeIndex - 1;
    scrollToIndex(prev);
  };

  const handleNext = () => {
    const next = (activeIndex + 1) % features.length;
    scrollToIndex(next);
  };

  return (
    <div
      className="relative w-full my-4 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Navigation Buttons (Left & Right) */}
      <button
        onClick={handlePrev}
        aria-label="Scroll left"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 shadow-xl flex items-center justify-center hover:bg-sky-600 hover:text-white transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Scroll right"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 shadow-xl flex items-center justify-center hover:bg-sky-600 hover:text-white transition-all duration-200 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Left Fog Fade Overlay */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />

      {/* Right Fog Fade Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

      {/* Horizontal Scroll Track */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth py-6 px-[8vw] sm:px-[18vw] md:px-[22vw] no-scrollbar snap-x snap-mandatory focus:outline-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {features.map((feature, index) => {
          const isActive = index === activeIndex;
          const imagePath = getFeatureImagePath(feature);

          return (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onClick={() => scrollToIndex(index)}
              className={cn(
                'snap-center shrink-0 w-[290px] sm:w-[340px] md:w-[380px] p-6 rounded-[32px] cursor-pointer transition-all duration-500 ease-out flex flex-col justify-between relative overflow-hidden',
                isActive
                  ? 'bg-white border-2 border-sky-500 shadow-2xl shadow-sky-500/20 ring-4 ring-sky-500/15 scale-105 opacity-100 z-30'
                  : 'bg-[#fafafa] border-2 border-slate-200 opacity-60 hover:opacity-90 hover:border-slate-300 scale-95 z-10'
              )}
            >
              {/* Feature Header Title */}
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
                <p className="text-base font-extrabold text-[#0d0d0e] leading-snug">{feature}</p>
              </div>

              {/* Image Frame with Orange Wave Background if image exists */}
              {imagePath ? (
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-orange-400/30 bg-gradient-to-b from-[#ff5e1a] via-[#e03a08] to-[#7a0303] p-3 shadow-lg flex items-center justify-center mt-2">
                  {/* Layer 1 Wave Accent */}
                  <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none overflow-hidden">
                    <svg className="absolute bottom-3 w-full h-14 text-[#b81206] fill-current opacity-90" viewBox="0 0 1440 320" preserveAspectRatio="none">
                      <path d="M0,160C320,220,640,220,960,160C1120,130,1280,130,1440,160L1440,320L0,320Z" />
                    </svg>
                    <svg className="absolute bottom-0 w-full h-16 text-[#580000] fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
                      <path d="M0,224C360,265,720,265,1080,224C1260,203,1350,203,1440,224L1440,320L0,320Z" />
                    </svg>
                  </div>
                  {/* Uncropped Picture */}
                  <div className="relative z-10 w-full h-full rounded-xl overflow-hidden shadow-xl border border-white/25 flex items-center justify-center bg-black/20">
                    <Image
                      src={imagePath}
                      alt={`${feature} Capability Visual`}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="object-contain object-center p-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-sky-50/50 border border-sky-100 mt-2 flex items-center justify-center min-h-[140px]">
                  <p className="text-xs font-mono font-medium text-slate-500 text-center">
                    Enterprise Technical Scope &amp; Deliverable Spec
                  </p>
                </div>
              )}

              {/* Card Footer Badge */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Deliverable #{index + 1}
                </span>

                {isActive && (
                  <span className="text-[10px] font-mono font-bold text-sky-600 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full animate-pulse">
                    AUTO-SCROLLING ⚡
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {features.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to feature ${index + 1}`}
              className={cn(
                'h-2.5 rounded-full transition-all duration-300',
                isActive
                  ? 'w-8 bg-sky-600 ring-2 ring-sky-600/30'
                  : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

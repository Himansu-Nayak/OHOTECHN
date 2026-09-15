'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { GalleryItem } from '@/config/work';

interface WorkGalleryProps {
  items: GalleryItem[];
  projectTitle: string;
}

export function WorkGallery({ items, projectTitle }: WorkGalleryProps) {
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeItemIndex === null) return;
      if (e.key === 'Escape') setActiveItemIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveItemIndex((prev) => (prev !== null ? (prev + 1) % items.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setActiveItemIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItemIndex, items.length]);

  if (!items || items.length === 0) return null;

  const currentItem = activeItemIndex !== null ? items[activeItemIndex] : null;

  return (
    <section className="mb-16 sm:mb-24">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>VISUAL BLUEPRINT ARCHIVE &amp; INTERFACE GALLERY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            System Interface Previews
          </h2>
        </div>
        <p className="text-xs font-mono text-slate-400">
          Click any interface card to open high-resolution blueprint inspection.
        </p>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setActiveItemIndex(idx)}
            className="group rounded-3xl bg-[#111216] border border-white/10 hover:border-emerald-500/50 p-4 transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between overflow-hidden relative"
          >
            {/* Image Container with Hover Scale */}
            <div className="relative w-full h-52 sm:h-60 rounded-2xl overflow-hidden bg-black/60 border border-white/5 mb-4 group/img">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover object-center opacity-85 group-hover/img:scale-105 group-hover/img:opacity-100 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover/img:opacity-40 transition-opacity" />

              {/* Tag Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                {item.tag}
              </div>

              {/* Zoom Trigger Button */}
              <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Text Metadata */}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 font-normal leading-relaxed line-clamp-2">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {currentItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn"
          onClick={() => setActiveItemIndex(null)}
        >
          {/* Top Bar */}
          <div 
            className="w-full max-w-6xl flex items-center justify-between pb-4 border-b border-white/15 text-xs font-mono text-slate-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">BLUEPRINT INSPECTOR</span>
              <span>//</span>
              <span className="text-white font-bold truncate max-w-sm sm:max-w-md">{projectTitle}</span>
            </div>

            <button
              onClick={() => setActiveItemIndex(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 text-white transition-all"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content Area */}
          <div 
            className="relative w-full max-w-5xl h-[55vh] sm:h-[65vh] my-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
              <Image
                src={currentItem.image}
                alt={currentItem.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
              />
            </div>

            {/* Prev / Next Buttons */}
            {items.length > 1 && (
              <>
                <button
                  onClick={() => setActiveItemIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : 0))}
                  className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/80 border border-white/20 text-white hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center shadow-xl"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveItemIndex((prev) => (prev !== null ? (prev + 1) % items.length : 0))}
                  className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/80 border border-white/20 text-white hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center shadow-xl"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Caption Bar */}
          <div 
            className="w-full max-w-3xl text-center bg-[#111216] border border-white/15 rounded-2xl p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase mb-1">
              {currentItem.tag} // PREVIEW {activeItemIndex! + 1} OF {items.length}
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-1">
              {currentItem.title}
            </h4>
            <p className="text-xs text-slate-300 font-normal">
              {currentItem.subtitle}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

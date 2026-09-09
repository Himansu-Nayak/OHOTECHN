'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollFrameSequenceProps {
  /** Total number of turntable frames (default: 72) */
  totalFrames?: number;
  /** Directory path containing the sequence frames (default: '/sequence/hero') */
  folderPath?: string;
  /** Frame filename prefix (default: 'frame_') */
  filePrefix?: string;
  /** Frame filename extension (default: 'webp') */
  fileExtension?: string;
  /** Scroll pinning height (default: '250%') */
  pinHeight?: string;
  /** Optional custom class name */
  className?: string;
}

const CALLOUT_STAGES = [
  {
    step: '01 / ARCHITECTURE',
    title: 'High-Throughput Engineering',
    desc: 'Modular microservices, resilient APIs, and enterprise data models engineered for high concurrency.',
    icon: Layers,
    accent: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    progressRange: [0.05, 0.32],
  },
  {
    step: '02 / CLOUD & VELOCITY',
    title: 'Sub-Millisecond Execution',
    desc: 'Autonomous scaling pipelines, global edge distribution, and continuous telemetry monitoring.',
    icon: Zap,
    accent: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
    progressRange: [0.33, 0.65],
  },
  {
    step: '03 / RELIABILITY & SCALE',
    title: 'Mission-Critical Reliability',
    desc: 'Automated failover protocols, enterprise-grade security hardening, and guaranteed 99.99% uptime.',
    icon: ShieldCheck,
    accent: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    progressRange: [0.66, 0.98],
  },
];

export function ScrollFrameSequence({
  totalFrames = 72,
  folderPath = '/sequence/hero',
  filePrefix = 'frame_',
  fileExtension = 'webp',
  pinHeight = '250%',
  className = '',
}: ScrollFrameSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [activeStage, setActiveStage] = useState<number>(0);
  const [loadProgress, setLoadProgress] = useState<number>(0);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);

  const getFrameUrl = useCallback(
    (index: number) => {
      const pad = String(index).padStart(3, '0');
      return `${folderPath}/${filePrefix}${pad}.${fileExtension}`;
    },
    [folderPath, filePrefix, fileExtension]
  );

  // Render a specific frame index onto the canvas
  const renderCanvasFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = imagesRef.current[frameIndex] || imagesRef.current[0];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Fit image aspect ratio (contain)
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = displayWidth / displayHeight;

      let drawWidth = displayWidth;
      let drawHeight = displayHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = displayHeight;
        drawWidth = displayHeight * imgRatio;
        offsetX = (displayWidth - drawWidth) / 2;
      } else {
        drawWidth = displayWidth;
        drawHeight = displayWidth / imgRatio;
        offsetY = (displayHeight - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      ctx.restore();
    },
    []
  );

  // 1. Preload frame sequence
  useEffect(() => {
    let isMounted = true;
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        if (!isMounted) return;
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / totalFrames) * 100));

        if (i === 0) {
          renderCanvasFrame(0);
        }

        if (loadedCount >= Math.min(12, totalFrames)) {
          setImagesLoaded(true);
        }
      };
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      isMounted = false;
    };
  }, [totalFrames, getFrameUrl, renderCanvasFrame]);

  // 2. Handle Resize
  useEffect(() => {
    const handleResize = () => {
      renderCanvasFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvasFrame]);

  // 3. GSAP ScrollTrigger Sequence Scrubbing
  useEffect(() => {
    const container = containerRef.current;
    const pinTarget = pinTargetRef.current;
    if (!container || !pinTarget) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Reduced motion safety fallback: Do not pin, render static initial frame
    if (prefersReducedMotion) {
      renderCanvasFrame(0);
      return;
    }

    const frameObj = { frame: 0 };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${pinHeight}`,
        pin: pinTarget,
        pinSpacing: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;
          const targetFrame = Math.min(
            Math.floor(progress * totalFrames),
            totalFrames - 1
          );

          if (targetFrame !== currentFrameRef.current) {
            currentFrameRef.current = targetFrame;
            frameObj.frame = targetFrame;
            renderCanvasFrame(targetFrame);
          }

          // Active stage update
          if (progress < 0.33) {
            setActiveStage(0);
          } else if (progress < 0.66) {
            setActiveStage(1);
          } else {
            setActiveStage(2);
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, [totalFrames, pinHeight, renderCanvasFrame]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-[#08090b] text-white selection:bg-emerald-500 selection:text-white ${className}`}
      style={{ minHeight: '120vh' }}
    >
      {/* Pinned Viewport Container */}
      <div
        ref={pinTargetRef}
        data-cursor="SCRUB 3D"
        className="w-full h-screen relative flex flex-col justify-between overflow-hidden px-4 sm:px-8 lg:px-14 py-6 sm:py-8 cursor-grab active:cursor-grabbing"
      >
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[250px] bg-sky-500/10 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        {/* ── Top HUD Header ── */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 max-w-[1536px] w-full mx-auto">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OHO 3D TURNTABLE ARCHITECTURE</span>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden md:inline">
              Scroll-driven hardware assembly
            </span>
          </div>

          <div className="flex items-center gap-3">
            {loadProgress < 100 && (
              <div className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                Caching 3D Frames: {loadProgress}%
              </div>
            )}
            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
              Scrub Synced • 60 FPS
            </div>
          </div>
        </div>

        {/* ── Main Centerpiece: Canvas 3D Image Sequence ── */}
        <div className="relative z-10 flex-1 w-full max-w-[1400px] mx-auto flex items-center justify-center my-2 sm:my-4">
          <div className="relative w-full h-full max-h-[560px] sm:max-h-[660px] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain cursor-grab active:cursor-grabbing drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            />
          </div>
        </div>

        {/* ── Bottom Interactive Feature Bar & Callout HUD ── */}
        <div className="relative z-20 max-w-[1536px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          
          {/* Active Stage Callout Card (Left 7 Cols) */}
          <div className="lg:col-span-8 bg-[#0e1014]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl transition-all duration-300">
            <div className="flex items-start gap-4">
              {(() => {
                const stage = CALLOUT_STAGES[activeStage];
                const Icon = stage.icon;
                return (
                  <>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 border ${stage.accent}`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                          {stage.step}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white mb-1 truncate">
                        {stage.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                        {stage.desc}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Stage Progress Indicator Bars */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10">
              {CALLOUT_STAGES.map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        activeStage === idx
                          ? 'bg-emerald-400 w-full'
                          : activeStage > idx
                          ? 'bg-emerald-500/50 w-full'
                          : 'w-0'
                      }`}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 block truncate">
                    {s.title.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Card (Right 4 Cols) */}
          <div className="lg:col-span-4 bg-[#0e1014]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Engineered for mission-critical scale</span>
            </div>
            
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-emerald-400 text-[#0c0d0e] font-extrabold text-xs uppercase tracking-wider transition-all duration-200 group w-full"
            >
              <span>Explore Architecture &amp; Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ScrollFrameSequence;

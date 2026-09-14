'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { ArrowRight, Layers, ShieldCheck, Zap, Sparkles, Cpu, Activity } from 'lucide-react';
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
  /** Scroll pinning height (default: '220%') */
  pinHeight?: string;
  /** Optional custom class name */
  className?: string;
}

const CALLOUT_STAGES = [
  {
    step: '01 / ARCHITECTURE',
    title: 'High-Throughput Engineering',
    subtitle: 'BUILDING DIGITAL SYSTEMS',
    desc: 'Modular microservices, resilient APIs, and enterprise data models engineered for high concurrency and zero single point of failure.',
    icon: Layers,
    accent: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    metric: '15k req/s throughput',
  },
  {
    step: '02 / CLOUD & VELOCITY',
    title: 'Sub-Millisecond Execution',
    subtitle: 'THAT MOVE BUSINESS',
    desc: 'Autonomous scaling pipelines, global edge distribution, and continuous telemetry monitoring for instantaneous user experiences.',
    icon: Zap,
    accent: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
    metric: '< 18ms edge latency',
  },
  {
    step: '03 / RELIABILITY & SCALE',
    title: 'Mission-Critical Reliability',
    subtitle: 'FORWARD.',
    desc: 'Automated failover protocols, enterprise-grade security hardening, and guaranteed 24/7 high-availability operational clustering.',
    icon: ShieldCheck,
    accent: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    metric: 'High-Availability Cluster',
  },
];

export function ScrollFrameSequence({
  totalFrames = 72,
  folderPath = '/sequence/hero',
  filePrefix = 'frame_',
  fileExtension = 'webp',
  pinHeight = '220%',
  className = '',
}: ScrollFrameSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeStage, setActiveStage] = useState<number>(0);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  const getFrameUrl = useCallback(
    (index: number) => {
      const pad = String(index).padStart(3, '0');
      return `${folderPath}/${filePrefix}${pad}.${fileExtension}`;
    },
    [folderPath, filePrefix, fileExtension]
  );

  // Find nearest loaded frame if current target frame is still downloading
  const getBestAvailableImage = useCallback((targetIndex: number): HTMLImageElement | null => {
    const images = imagesRef.current;
    if (images[targetIndex] && images[targetIndex]?.complete && images[targetIndex]?.naturalWidth !== 0) {
      return images[targetIndex];
    }
    // Search nearby loaded frames
    for (let offset = 1; offset < totalFrames; offset++) {
      const forward = targetIndex + offset;
      if (forward < totalFrames && images[forward]?.complete && images[forward]?.naturalWidth !== 0) {
        return images[forward];
      }
      const backward = targetIndex - offset;
      if (backward >= 0 && images[backward]?.complete && images[backward]?.naturalWidth !== 0) {
        return images[backward];
      }
    }
    return images[0] || null;
  }, [totalFrames]);

  // Render frame to canvas with high-DPI scaling & contain fit
  const renderCanvasFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = getBestAvailableImage(frameIndex);
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const displayWidth = canvas.clientWidth || 800;
      const displayHeight = canvas.clientHeight || 500;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Maintain aspect ratio
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
    [getBestAvailableImage]
  );

  // High-performance concurrent preloading
  useEffect(() => {
    isMountedRef.current = true;
    const images: (HTMLImageElement | null)[] = new Array(totalFrames).fill(null);
    imagesRef.current = images;
    let loadedCount = 0;

    const loadIndex = (idx: number) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = getFrameUrl(idx);
        img.onload = () => {
          if (!isMountedRef.current) return resolve();
          images[idx] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
          if (idx === currentFrameRef.current || (idx === 0 && currentFrameRef.current === 0)) {
            renderCanvasFrame(idx);
          }
          resolve();
        };
        img.onerror = () => {
          if (idx === 0) setHasError(true);
          resolve();
        };
      });
    };

    if (totalFrames === 0) {
      setHasError(true);
      return;
    }

    // Test initial frame 0 first; if missing, fail gracefully without firing 72 404 requests
    (async () => {
      const firstFrameValid = await new Promise<boolean>((resolve) => {
        const testImg = new Image();
        testImg.src = getFrameUrl(0);
        testImg.onload = () => {
          if (!isMountedRef.current) return resolve(false);
          images[0] = testImg;
          loadedCount = 1;
          setLoadProgress(Math.round((1 / totalFrames) * 100));
          renderCanvasFrame(0);
          resolve(true);
        };
        testImg.onerror = () => {
          if (isMountedRef.current) setHasError(true);
          resolve(false);
        };
      });

      if (!firstFrameValid || !isMountedRef.current) {
        return;
      }

      // 1. Initial key frames for quick scrubbing
      await Promise.all([18, 36, 54, 71].filter(i => i < totalFrames).map(loadIndex));
      renderCanvasFrame(currentFrameRef.current);
      if (typeof window !== 'undefined') {
        ScrollTrigger.refresh();
      }

      // 2. Load all other frames in parallel batches of 12
      const remaining: number[] = [];
      for (let i = 1; i < totalFrames; i++) {
        if (!images[i] && ![18, 36, 54, 71].includes(i)) remaining.push(i);
      }

      const BATCH_SIZE = 12;
      for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
        if (!isMountedRef.current || hasError) break;
        const chunk = remaining.slice(i, i + BATCH_SIZE);
        await Promise.all(chunk.map(loadIndex));
      }
      if (typeof window !== 'undefined') {
        ScrollTrigger.refresh();
      }
    })();

    return () => {
      isMountedRef.current = false;
    };
  }, [totalFrames, getFrameUrl, renderCanvasFrame]);

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      renderCanvasFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvasFrame]);

  // Direct Interactive Pointer Drag Rotation
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartFrameRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartFrameRef.current = currentFrameRef.current;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    // 1 frame per 8 pixels dragged
    const frameOffset = Math.round(deltaX / 8);
    let newFrame = (dragStartFrameRef.current + frameOffset) % totalFrames;
    if (newFrame < 0) newFrame += totalFrames;
    if (newFrame !== currentFrameRef.current) {
      currentFrameRef.current = newFrame;
      renderCanvasFrame(newFrame);

      const progress = newFrame / totalFrames;
      if (progress < 0.33) {
        setActiveStage(0);
      } else if (progress < 0.66) {
        setActiveStage(1);
      } else {
        setActiveStage(2);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  // GSAP ScrollTrigger Sequence Scrubbing
  useEffect(() => {
    const container = containerRef.current;
    const pinTarget = pinTargetRef.current;
    if (!container || !pinTarget) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reduced motion safety fallback: render static initial frame
    if (prefersReducedMotion) {
      renderCanvasFrame(0);
      return;
    }

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${pinHeight}`,
        pin: pinTarget,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          if (isDraggingRef.current) return;
          const progress = self.progress;
          const targetFrame = Math.min(
            Math.floor(progress * totalFrames),
            totalFrames - 1
          );

          if (targetFrame !== currentFrameRef.current) {
            currentFrameRef.current = targetFrame;
            renderCanvasFrame(targetFrame);
          }

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

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
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
        {/* Subtle Ambient Lighting */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full" />
          <div className="absolute bottom-10 right-10 w-[450px] h-[250px] bg-sky-500/10 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        {/* Top HUD Telemetry Bar */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 max-w-[1536px] w-full mx-auto">
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OHO 3D TURNTABLE ARCHITECTURE</span>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden md:inline">
              Scroll-driven hardware assembly
            </span>
          </div>

          <div className="flex items-center gap-3">
            {loadProgress < 100 && (
              <div className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                Caching Frames: {loadProgress}%
              </div>
            )}
            <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
              Scrub Synced • 60 FPS
            </div>
          </div>
        </div>

        {/* Centerpiece: Canvas 3D Frame Sequence & Stage Typography */}
        <div className="relative z-10 flex-1 w-full max-w-[1400px] mx-auto flex flex-col items-center justify-center my-2">
          
          {/* Choreographed Stage Headline */}
          <div className="text-center mb-2 animate-in fade-in duration-300">
            <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-400 uppercase tracking-[0.25em] block mb-1">
              {CALLOUT_STAGES[activeStage].subtitle}
            </span>
            <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {CALLOUT_STAGES[activeStage].title}
            </h3>
          </div>

          {/* 3D Hardware Canvas */}
          <div
            className="relative w-full h-full max-h-[500px] sm:max-h-[580px] flex items-center justify-center select-none touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {hasError ? (
              <div className="relative w-full h-full min-h-[320px] max-h-[480px] rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl flex items-center justify-center group">
                <NextImage
                  src="/images/3d-enterprise-node.jpg"
                  alt="OHO CORE Enterprise Architecture Node"
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] sm:text-xs text-white px-3.5 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/15">
                  <span className="text-emerald-400 font-bold">NODE: MULTI-TENANT CORE</span>
                  <span className="text-slate-300">HIGH-AVAILABILITY CLUSTER</span>
                </div>
              </div>
            ) : (
              <>
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain cursor-grab active:cursor-grabbing drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] select-none"
                />
                {/* Floating drag rotation hint pill */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-slate-300 pointer-events-none flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>DRAG TO ROTATE 360° // SCROLL TO SCRUB</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Interactive Feature Bar & Callout HUD */}
        <div className="relative z-20 max-w-[1536px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          
          {/* Active Stage Callout Card */}
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
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                          {stage.step}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          {stage.metric}
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

          {/* Action Card */}
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

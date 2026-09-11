'use client';

import React, { useEffect, useRef } from 'react';
import NextImage from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function LayeredParallaxSection() {
  const containerRef = useRef<HTMLElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const layer4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const l1 = layer1Ref.current;
    const l2 = layer2Ref.current;
    const l3 = layer3Ref.current;
    const l4 = layer4Ref.current;

    if (!container || !l1 || !l2 || !l3 || !l4) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Layer 1 (Deepest / Servers): moves least
      gsap.fromTo(
        l1,
        { y: 40 },
        {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      // Layer 2 (Mid-Back / Workstation): moves moderate
      gsap.fromTo(
        l2,
        { y: 80 },
        {
          y: -110,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.3,
          },
        }
      );

      // Layer 3 (Mid-Front / Laptop): moves faster
      gsap.fromTo(
        l3,
        { y: 120 },
        {
          y: -180,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.6,
          },
        }
      );

      // Layer 4 (Foreground / Mobile Devices): moves fastest
      gsap.fromTo(
        l4,
        { y: 160 },
        {
          y: -260,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2,
          },
        }
      );
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="parallax-architecture"
      ref={containerRef}
      aria-label="Layered Technology Infrastructure Parallax Showcase"
      className="w-full bg-[#0a0a0b] py-16 sm:py-28 relative overflow-hidden flex items-center justify-center min-h-[650px] sm:min-h-[820px] lg:min-h-[960px]"
    >
      <div className="w-full max-w-7xl mx-auto relative h-[560px] sm:h-[720px] lg:h-[840px] flex items-center justify-center">

        {/* ── LAYER 1 (Deepest Background / Enterprise Server Rack) ──
            Faked depth: blur(6px), lower opacity, slowest scroll rate */}
        <div
          ref={layer1Ref}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 will-change-transform"
          style={{ filter: 'blur(6px)', opacity: 0.65 }}
        >
          <div className="relative w-[320px] sm:w-[500px] lg:w-[640px] aspect-[16/9]">
            <NextImage
              src="/images/parallax/layer-1-servers.webp"
              alt="Enterprise Datacenter Server Racks"
              fill
              unoptimized
              className="object-contain"
              sizes="(max-width: 768px) 320px, (max-width: 1200px) 500px, 640px"
              priority
            />
          </div>
        </div>

        {/* ── LAYER 2 (Mid-Back / Developer Ultrawide Workstation & IDE) ──
            Faked depth: blur(3px), medium opacity, moderate scroll rate */}
        <div
          ref={layer2Ref}
          className="absolute inset-0 flex items-center justify-center sm:-translate-x-12 lg:-translate-x-20 pointer-events-none z-20 will-change-transform"
          style={{ filter: 'blur(3px)', opacity: 0.82 }}
        >
          <div className="relative w-[380px] sm:w-[620px] lg:w-[840px] aspect-[16/9]">
            <NextImage
              src="/images/parallax/layer-2-workstation.webp"
              alt="Developer Workstation and Code Editor"
              fill
              unoptimized
              className="object-contain"
              sizes="(max-width: 768px) 380px, (max-width: 1200px) 620px, 840px"
            />
          </div>
        </div>

        {/* ── LAYER 3 (Mid-Front / Cloud Telemetry Laptop) ──
            Faked depth: blur(1px), high opacity, faster scroll rate */}
        <div
          ref={layer3Ref}
          className="absolute inset-0 flex items-center justify-end sm:translate-x-6 lg:translate-x-14 sm:translate-y-8 lg:translate-y-12 pointer-events-none z-30 will-change-transform"
          style={{ filter: 'blur(1px)', opacity: 0.94 }}
        >
          <div className="relative w-[340px] sm:w-[520px] lg:w-[700px] aspect-[16/9]">
            <NextImage
              src="/images/parallax/layer-3-laptop.webp"
              alt="Cloud Architecture Telemetry Laptop"
              fill
              unoptimized
              className="object-contain"
              sizes="(max-width: 768px) 340px, (max-width: 1200px) 520px, 700px"
            />
          </div>
        </div>

        {/* ── LAYER 4 (Foreground / Mobile Tablet & Smartphone Device) ──
            Faked depth: blur(0px) (sharp), 100% opacity, fastest scroll rate */}
        <div
          ref={layer4Ref}
          className="absolute inset-0 flex items-center justify-start sm:-translate-x-8 lg:-translate-x-14 sm:translate-y-16 lg:translate-y-24 pointer-events-none z-40 will-change-transform"
          style={{ filter: 'blur(0px)', opacity: 1 }}
        >
          <div className="relative w-[290px] sm:w-[440px] lg:w-[580px] aspect-[16/9]">
            <NextImage
              src="/images/parallax/layer-4-devices.webp"
              alt="Mobile Operations Tablet and Device"
              fill
              unoptimized
              className="object-contain"
              sizes="(max-width: 768px) 290px, (max-width: 1200px) 440px, 580px"
            />
          </div>
        </div>

      </div>
    </section>
  );
}


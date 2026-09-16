'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { 
  Code2, 
  Cpu, 
  Database, 
  Layers, 
  Server, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Zap, 
  Globe, 
  Workflow, 
  Activity,
  LucideIcon
} from 'lucide-react';

interface MarqueeItem {
  name: string;
  category: string;
  icon: LucideIcon;
}

const TECH_BADGES: MarqueeItem[] = [
  { name: 'NEXT.JS 16', category: 'RUNTIME', icon: Globe },
  { name: 'SPRING BOOT 4.1', category: 'BACKEND', icon: Server },
  { name: 'POSTGRESQL 17', category: 'DATABASE', icon: Database },
  { name: 'THREE.JS / WEBGL', category: 'GRAPHICS', icon: Sparkles },
  { name: 'REACT 19', category: 'CLIENT', icon: Code2 },
  { name: 'KUBERNETES', category: 'DEVOPS', icon: Layers },
  { name: 'TURBOPACK', category: 'ENGINE', icon: Zap },
  { name: 'APACHE KAFKA', category: 'STREAMING', icon: Activity },
  { name: 'DOCKER CLOUD', category: 'CONTAINER', icon: Terminal },
  { name: 'GRAPHQL FEDERATION', category: 'PROTOCOL', icon: Workflow },
  { name: 'REDIS PUB/SUB', category: 'CACHE', icon: Cpu },
  { name: 'ZERO-TRUST RBAC', category: 'SECURITY', icon: ShieldCheck },
];

/**
 * Interactive momentum marquee ribbon with pointer drag physics and velocity mapping.
 */
export function InteractiveMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Base motion value for horizontal translation
  const x = useMotionValue(0);

  // Velocity tracking for spring physics
  const velocity = useMotionValue(0);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 350 });

  // Map velocity to subtle kinetic skew (-6deg to +6deg)
  const skewX = useTransform(smoothVelocity, [-1200, 0, 1200], [-6, 0, 6]);

  useEffect(() => {
    if (prefersReduced) return;

    let animFrameId: number;
    let lastTime = performance.now();
    const baseSpeed = 0.65; // base px per frame

    const loop = (time: number) => {
      const delta = Math.min((time - lastTime) / 16.666, 2.0);
      lastTime = time;

      // Decay velocity naturally back to zero
      const currentVel = velocity.get();
      velocity.set(currentVel * 0.92);

      // Advance position by base speed + velocity contribution
      const currentX = x.get();
      let nextX = currentX - (baseSpeed + currentVel * 0.08) * delta;

      // Wrap-around seamlessly across 2 full duplicated badge sets (~2400px)
      const wrapWidth = 2400;
      if (nextX <= -wrapWidth) {
        nextX += wrapWidth;
      } else if (nextX > 0) {
        nextX -= wrapWidth;
      }

      x.set(nextX);
      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);

    // Wheel listener: map horizontal & vertical trackpad/mousewheel scroll into velocity
    const handleWheel = (e: WheelEvent) => {
      const wheelDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      velocity.set(velocity.get() + wheelDelta * 0.15);
    };

    const node = containerRef.current;
    if (node) {
      node.addEventListener('wheel', handleWheel, { passive: true });
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      if (node) {
        node.removeEventListener('wheel', handleWheel);
      }
    };
  }, [x, velocity, prefersReduced]);

  // Triple set for seamless infinite drag/scroll loop
  const displayBadges = [...TECH_BADGES, ...TECH_BADGES, ...TECH_BADGES];

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-[#0a0a0b]/60 backdrop-blur-[2px] border-t border-b border-white/10 py-5 sm:py-6 overflow-hidden select-none cursor-grab active:cursor-grabbing"
      data-cursor-text="DRAG"
    >
      {/* Edge Gradient Masks for clean full-bleed bleed-in */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#0a0a0b]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#0a0a0b]/80 to-transparent z-10 pointer-events-none" />

      {/* Kinetic Drag Ribbon */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -4800, right: 0 }}
        dragElastic={0.05}
        onDrag={(_, info) => {
          velocity.set(info.delta.x * 0.8);
        }}
        style={{ x, skewX }}
        className="flex items-center gap-4 sm:gap-6 will-change-transform whitespace-nowrap"
      >
        {displayBadges.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, borderColor: 'rgba(16, 185, 129, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#121316] hover:bg-[#16171d] border border-white/10 rounded-xl shrink-0 transition-colors duration-200"
            >
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                <Icon className="w-3.5 h-3.5" />
              </div>
              
              <div className="flex flex-col text-left">
                <span className="font-mono text-xs font-bold text-white tracking-wider">
                  {item.name}
                </span>
                <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                  {item.category}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default InteractiveMarquee;

'use client';

import React, { useRef, useEffect } from 'react';

interface Balloon {
  id: number;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  speedY: number;
  driftSpeedX: number;
  swayFreq: number;
  swayAmp: number;
  swayPhase: number;
  rotFreq: number;
  rotAmp: number;
  rotPhase: number;
  stringLength: number;
  colorType: 'chrome' | 'emerald' | 'pearlescent' | 'opal' | 'deepJade';
  opacity: number;
  scale: number;
  depthLayer: number; // 0: background, 1: midground, 2: foreground
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  maxAlpha: number;
  phase: number;
}

export function RealisticBalloonCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const bgLayer = bgLayerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || typeof window === 'undefined') return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let lastTime = performance.now();
    let globalTime = 0;

    // Camera drift state (smooth lerping, no jitter)
    let camX = 0;
    let camY = 0;
    let camScale = 1.0;

    // Track width and height
    let width = container.clientWidth;
    let height = container.clientHeight;

    const resize = () => {
      if (!container || !canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = container.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Initialize realistic balloons distributed across heights and depths
    const BALLOON_COUNT = 15;
    const colorTypes: Balloon['colorType'][] = ['chrome', 'emerald', 'pearlescent', 'opal', 'deepJade'];

    const createBalloon = (index: number, initialY?: number): Balloon => {
      const depthLayer = index % 3; // 0: far, 1: mid, 2: near
      const scale = depthLayer === 0 ? 0.75 + Math.random() * 0.15 : depthLayer === 1 ? 0.95 + Math.random() * 0.2 : 1.25 + Math.random() * 0.35;
      
      const baseRadius = (36 + Math.random() * 14) * scale;
      const radiusX = baseRadius;
      const radiusY = baseRadius * (1.28 + Math.random() * 0.15);

      // Smooth helium upward rising velocity
      const speedY = (22 + Math.random() * 24) * (depthLayer === 0 ? 0.8 : depthLayer === 1 ? 1.0 : 1.2);
      const startX = width * 0.04 + Math.random() * (width * 0.92);
      const startY = initialY !== undefined ? initialY : height + Math.random() * (height * 0.8);

      return {
        id: index,
        x: startX,
        y: startY,
        radiusX,
        radiusY,
        speedY,
        driftSpeedX: (Math.random() - 0.48) * 7, // natural horizontal drift
        swayFreq: 0.75 + Math.random() * 0.5,
        swayAmp: 16 + Math.random() * 20,
        swayPhase: Math.random() * Math.PI * 2,
        rotFreq: 0.65 + Math.random() * 0.45,
        rotAmp: 0.07 + Math.random() * 0.08,
        rotPhase: Math.random() * Math.PI * 2,
        stringLength: (85 + Math.random() * 45) * scale,
        colorType: colorTypes[index % colorTypes.length],
        opacity: depthLayer === 0 ? 0.82 : depthLayer === 1 ? 0.92 : 0.98,
        scale,
        depthLayer,
      };
    };

    // Stagger initial Y positions so balloons are naturally floating across the frame immediately
    const balloons: Balloon[] = [];
    for (let i = 0; i < BALLOON_COUNT; i++) {
      const distributedY = (height / BALLOON_COUNT) * i + (Math.random() * 50 - 25);
      balloons.push(createBalloon(i, distributedY));
    }
    balloons.sort((a, b) => a.depthLayer - b.depthLayer);

    // Subtle atmospheric dust particles
    const PARTICLE_COUNT = 30;
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.8 + Math.random() * 1.6,
        speedY: -(5 + Math.random() * 10),
        speedX: (Math.random() - 0.5) * 4,
        alpha: Math.random() * 0.35,
        maxAlpha: 0.15 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Helper: Draw realistic 3D Balloon with physical materials and trailing string
    const renderBalloon = (b: Balloon, currentX: number, currentY: number, rotation: number) => {
      ctx.save();
      ctx.translate(currentX, currentY);
      ctx.rotate(rotation);
      ctx.globalAlpha = b.opacity;

      const rx = b.radiusX;
      const ry = b.radiusY;

      // 1. Soft Ambient Depth Shadow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(rx * 0.06, ry * 0.1, rx * 1.05, ry * 1.05, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.filter = 'blur(12px)';
      ctx.fill();
      ctx.restore();

      // 2. Base Volumetric Spherical Gradient according to Material
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);

      if (b.colorType === 'chrome') {
        // Highly reflective liquid mirror chrome with crisp environmental horizon reflection
        const grad = ctx.createLinearGradient(-rx * 0.65, -ry * 0.85, rx * 0.75, ry * 0.95);
        grad.addColorStop(0, '#ffffff'); // Pure specular highlight
        grad.addColorStop(0.18, '#e2e8f0');
        grad.addColorStop(0.42, '#475569'); // Dark horizon band
        grad.addColorStop(0.52, '#0f172a');
        grad.addColorStop(0.68, '#64748b'); // Warm room bounce
        grad.addColorStop(0.88, '#94a3b8');
        grad.addColorStop(1, '#1e293b');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = 1.4;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.stroke();

      } else if (b.colorType === 'emerald') {
        // Translucent emerald vinyl with internal light refraction & deep gloss
        const grad = ctx.createRadialGradient(-rx * 0.35, -ry * 0.35, rx * 0.08, 0, 0, ry);
        grad.addColorStop(0, '#a7f3d0'); // Vibrant caustic center
        grad.addColorStop(0.3, '#10b981');
        grad.addColorStop(0.7, '#047857');
        grad.addColorStop(1, '#064e3b');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = 1.6;
        ctx.strokeStyle = 'rgba(167, 243, 208, 0.7)';
        ctx.stroke();

      } else if (b.colorType === 'pearlescent') {
        // Iridescent pearlescent pink & opal rubber
        const grad = ctx.createRadialGradient(-rx * 0.3, -ry * 0.35, rx * 0.12, 0, 0, ry);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.22, '#fce7f3'); // soft rose
        grad.addColorStop(0.5, '#e0e7ff'); // iridescent violet sheen
        grad.addColorStop(0.82, '#fbcfe8');
        grad.addColorStop(1, '#db2777');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = 1.3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.stroke();

      } else if (b.colorType === 'deepJade') {
        // Deep bottle green with rich luster
        const grad = ctx.createRadialGradient(-rx * 0.3, -ry * 0.3, rx * 0.1, 0, 0, ry);
        grad.addColorStop(0, '#6ee7b7');
        grad.addColorStop(0.38, '#059669');
        grad.addColorStop(0.75, '#064e3b');
        grad.addColorStop(1, '#022c22');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = 1.3;
        ctx.strokeStyle = 'rgba(110, 231, 183, 0.55)';
        ctx.stroke();

      } else {
        // Opal / Pearlescent satin white
        const grad = ctx.createRadialGradient(-rx * 0.25, -ry * 0.3, rx * 0.15, 0, 0, ry);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.38, '#f1f5f9');
        grad.addColorStop(0.78, '#cbd5e1');
        grad.addColorStop(1, '#64748b');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = 1.1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.stroke();
      }

      // 3. Primary Curved Specular Glint (Simulates ceiling softbox/window)
      ctx.beginPath();
      ctx.ellipse(-rx * 0.34, -ry * 0.42, rx * 0.32, ry * 0.22, -Math.PI / 6, 0, Math.PI * 2);
      const glintGrad = ctx.createLinearGradient(-rx * 0.45, -ry * 0.52, -rx * 0.18, -ry * 0.28);
      glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
      glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = glintGrad;
      ctx.fill();

      // 4. Secondary Soft Bounce Highlight at bottom-right
      ctx.beginPath();
      ctx.ellipse(rx * 0.32, ry * 0.38, rx * 0.34, ry * 0.18, Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.fill();

      // 5. Balloon Knot / Air Valve at bottom
      ctx.beginPath();
      ctx.moveTo(-rx * 0.1, ry);
      ctx.lineTo(rx * 0.1, ry);
      ctx.lineTo(rx * 0.18, ry + 8 * b.scale);
      ctx.lineTo(-rx * 0.18, ry + 8 * b.scale);
      ctx.closePath();
      ctx.fillStyle = b.colorType === 'chrome' ? '#94a3b8' : b.colorType === 'emerald' ? '#047857' : '#f472b6';
      ctx.fill();

      // 6. Dynamic Trailing String (Bézier physics curve reacting to movement)
      ctx.beginPath();
      const knotY = ry + 8 * b.scale;
      ctx.moveTo(0, knotY);

      // String curvature lags behind horizontal sway
      const lagX = -Math.sin(rotation) * 18 * b.scale;
      const cp1X = lagX * 0.45;
      const cp1Y = knotY + b.stringLength * 0.38;
      const cp2X = lagX * 0.85;
      const cp2Y = knotY + b.stringLength * 0.72;
      const endX = lagX * 0.55;
      const endY = knotY + b.stringLength;

      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.55)';
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.restore();
    };

    // Main 60 FPS Render Loop with Delta Time
    const render = (now: number) => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(render);

      // Delta time capped to 33ms to ensure consistent physics regardless of refresh rate
      const delta = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;
      globalTime += delta;

      // Subtle, buttery smooth camera pan and push-in (closed loop ease)
      const loopPeriod = 14.0; // 14-second closed cycle
      const cycleProgress = (globalTime % loopPeriod) / loopPeriod;
      const easeFactor = 0.5 * (1 - Math.cos(cycleProgress * Math.PI * 2));
      
      const targetX = Math.sin(cycleProgress * Math.PI * 2) * 6;
      const targetY = Math.sin(cycleProgress * Math.PI * 4) * 2.5;
      const targetScale = 1.0 + 0.025 * easeFactor;

      camX += (targetX - camX) * 0.04;
      camY += (targetY - camY) * 0.04;
      camScale += (targetScale - camScale) * 0.04;

      // Apply subtle camera movement to background photo layer smoothly
      if (bgLayer) {
        bgLayer.style.transform = `scale(${camScale.toFixed(4)}) translate3d(${camX.toFixed(2)}px, ${camY.toFixed(2)}px, 0)`;
      }

      // Clear Canvas for transparent overlay
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Dust Motes / Light Particles
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY * delta;
        p.x += (p.speedX + Math.sin(globalTime * 0.5 + p.phase) * 2.5) * delta;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const flicker = 0.7 + 0.3 * Math.sin(globalTime * 2 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 240, 138, ${p.alpha * flicker})`;
        ctx.fill();
      }
      ctx.restore();

      // 2. Update & Draw Flying Helium Balloons
      for (let i = 0; i < balloons.length; i++) {
        const b = balloons[i];

        // Physics: Constant smooth upward velocity
        b.y -= b.speedY * delta;
        b.x += b.driftSpeedX * delta;

        // Gentle organic side-to-side floating sway
        const swayX = Math.sin(globalTime * b.swayFreq + b.swayPhase) * b.swayAmp;
        const currentX = b.x + swayX;
        const currentY = b.y;

        // Subtle rotation matching the direction of sway
        const rotation = Math.cos(globalTime * b.rotFreq + b.rotPhase) * b.rotAmp;

        // Render balloon
        renderBalloon(b, currentX, currentY, rotation);

        // Seamless recycling: when balloon rises past the top of the viewport
        if (b.y < -b.radiusY * 2 - b.stringLength) {
          b.y = height + b.radiusY + 15 + Math.random() * 70;
          b.x = width * 0.05 + Math.random() * (width * 0.9);
          b.speedY = (22 + Math.random() * 24) * (b.depthLayer === 0 ? 0.8 : b.depthLayer === 1 ? 1.0 : 1.2);
          b.driftSpeedX = (Math.random() - 0.48) * 7;
        }
      }
    };

    // IntersectionObserver to halt rendering loop when scrolled down (0% GPU waste)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            lastTime = performance.now();
            animateLoop();
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0.05 }
    );

    const animateLoop = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(render);
    };

    observer.observe(container);
    animateLoop();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Background Image: Original 35mm Office Photograph (Crisp, Stable, 100% Photorealistic) */}
      <div 
        ref={bgLayerRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform scale-105"
        style={{
          backgroundImage: `url('/images/hero-surreal-office.jpg')`,
        }}
      />

      {/* 60 FPS Transparent Canvas Layer for Floating Balloons and Trailing Strings */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}

export default RealisticBalloonCanvas;

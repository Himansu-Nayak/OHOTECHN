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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || typeof window === 'undefined') return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Load original reference image for background
    const bgImage = new Image();
    bgImage.src = '/images/hero-surreal-office.jpg';
    let imageLoaded = false;
    bgImage.onload = () => {
      imageLoaded = true;
    };

    let animationFrameId: number;
    let isVisible = true;
    let lastTime = performance.now();
    let globalTime = 0;

    // Camera drift state (smooth lerping, no jitter)
    let camX = 0;
    let camY = 0;
    let camScale = 1.0;
    const targetCamScale = 1.025;

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
    const BALLOON_COUNT = 16;
    const colorTypes: Balloon['colorType'][] = ['chrome', 'emerald', 'pearlescent', 'opal', 'deepJade'];

    const createBalloon = (index: number, initialY?: number): Balloon => {
      const depthLayer = index % 3; // 0: far, 1: mid, 2: near
      const scale = depthLayer === 0 ? 0.65 + Math.random() * 0.15 : depthLayer === 1 ? 0.85 + Math.random() * 0.2 : 1.05 + Math.random() * 0.35;
      
      const baseRadius = (32 + Math.random() * 12) * scale;
      const radiusX = baseRadius;
      const radiusY = baseRadius * (1.25 + Math.random() * 0.12);

      // Speed increases slightly for lighter/higher balloons
      const speedY = (18 + Math.random() * 22) * (depthLayer === 0 ? 0.75 : depthLayer === 1 ? 1.0 : 1.25);
      const startX = width * 0.05 + Math.random() * (width * 0.9);
      const startY = initialY !== undefined ? initialY : height + Math.random() * (height * 0.8);

      return {
        id: index,
        x: startX,
        y: startY,
        radiusX,
        radiusY,
        speedY,
        driftSpeedX: (Math.random() - 0.48) * 8, // slight natural drift
        swayFreq: 0.8 + Math.random() * 0.6,
        swayAmp: 14 + Math.random() * 18,
        swayPhase: Math.random() * Math.PI * 2,
        rotFreq: 0.7 + Math.random() * 0.5,
        rotAmp: 0.08 + Math.random() * 0.09,
        rotPhase: Math.random() * Math.PI * 2,
        stringLength: (70 + Math.random() * 40) * scale,
        colorType: colorTypes[index % colorTypes.length],
        opacity: depthLayer === 0 ? 0.75 : depthLayer === 1 ? 0.9 : 0.98,
        scale,
        depthLayer,
      };
    };

    // Stagger initial Y positions so balloons are immediately naturally distributed
    const balloons: Balloon[] = [];
    for (let i = 0; i < BALLOON_COUNT; i++) {
      const distributedY = (height / BALLOON_COUNT) * i + (Math.random() * 60 - 30);
      balloons.push(createBalloon(i, distributedY));
    }
    // Sort so deeper layers render behind foreground
    balloons.sort((a, b) => a.depthLayer - b.depthLayer);

    // Subtle atmospheric dust particles
    const PARTICLE_COUNT = 35;
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.8 + Math.random() * 1.8,
        speedY: -(6 + Math.random() * 12),
        speedX: (Math.random() - 0.5) * 5,
        alpha: Math.random() * 0.4,
        maxAlpha: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Helper: Draw realistic 3D Balloon Shading with physical specular and bounce highlights
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
      ctx.ellipse(rx * 0.08, ry * 0.12, rx * 1.05, ry * 1.05, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.filter = 'blur(10px)';
      ctx.fill();
      ctx.restore();

      // 2. Base Volumetric Spherical Gradient according to Material
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);

      if (b.colorType === 'chrome') {
        // Highly reflective liquid chrome with crisp metallic horizon
        const grad = ctx.createLinearGradient(-rx * 0.6, -ry * 0.8, rx * 0.7, ry * 0.9);
        grad.addColorStop(0, '#f8fafc'); // White overhead specular
        grad.addColorStop(0.2, '#cbd5e1');
        grad.addColorStop(0.45, '#475569'); // Dark horizon line
        grad.addColorStop(0.55, '#1e293b');
        grad.addColorStop(0.7, '#64748b'); // Ground bounce reflection
        grad.addColorStop(0.9, '#94a3b8');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fill();

        // High-contrast chrome specular rim
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.stroke();

      } else if (b.colorType === 'emerald') {
        // Translucent emerald vinyl with internal light refraction
        const grad = ctx.createRadialGradient(-rx * 0.35, -ry * 0.35, rx * 0.1, 0, 0, ry);
        grad.addColorStop(0, '#6ee7b7'); // Light refraction center
        grad.addColorStop(0.35, '#10b981');
        grad.addColorStop(0.75, '#047857');
        grad.addColorStop(1, '#064e3b');
        ctx.fillStyle = grad;
        ctx.fill();

        // Edge translucency sheen
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(167, 243, 208, 0.6)';
        ctx.stroke();

      } else if (b.colorType === 'pearlescent') {
        // Iridescent opal/pink pastel rubber
        const grad = ctx.createRadialGradient(-rx * 0.3, -ry * 0.35, rx * 0.15, 0, 0, ry);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.25, '#fce7f3'); // soft rose
        grad.addColorStop(0.55, '#e0e7ff'); // iridescent lilac sheen
        grad.addColorStop(0.85, '#fbcfe8');
        grad.addColorStop(1, '#db2777');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.stroke();

      } else if (b.colorType === 'deepJade') {
        // Deep bottle green with rich luster
        const grad = ctx.createRadialGradient(-rx * 0.3, -ry * 0.3, rx * 0.1, 0, 0, ry);
        grad.addColorStop(0, '#34d399');
        grad.addColorStop(0.4, '#059669');
        grad.addColorStop(0.8, '#064e3b');
        grad.addColorStop(1, '#022c22');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgba(110, 231, 183, 0.5)';
        ctx.stroke();

      } else {
        // Opal / Pearlescent white
        const grad = ctx.createRadialGradient(-rx * 0.25, -ry * 0.3, rx * 0.15, 0, 0, ry);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#f1f5f9');
        grad.addColorStop(0.8, '#cbd5e1');
        grad.addColorStop(1, '#64748b');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = 1.0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.stroke();
      }

      // 3. Primary Curved Specular Glint (Simulates studio window / softbox reflection)
      ctx.beginPath();
      ctx.ellipse(-rx * 0.35, -ry * 0.4, rx * 0.3, ry * 0.22, -Math.PI / 6, 0, Math.PI * 2);
      const glintGrad = ctx.createLinearGradient(-rx * 0.45, -ry * 0.5, -rx * 0.2, -ry * 0.25);
      glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = glintGrad;
      ctx.fill();

      // 4. Secondary Soft Bounce Reflection at bottom-right
      ctx.beginPath();
      ctx.ellipse(rx * 0.32, ry * 0.35, rx * 0.35, ry * 0.18, Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fill();

      // 5. Balloon Tie / Knot at bottom
      ctx.beginPath();
      ctx.moveTo(-rx * 0.1, ry);
      ctx.lineTo(rx * 0.1, ry);
      ctx.lineTo(rx * 0.16, ry + 7 * b.scale);
      ctx.lineTo(-rx * 0.16, ry + 7 * b.scale);
      ctx.closePath();
      ctx.fillStyle = b.colorType === 'chrome' ? '#94a3b8' : b.colorType === 'emerald' ? '#047857' : '#f472b6';
      ctx.fill();

      // 6. Dynamic Trailing String (Bézier physics curve reacting to movement)
      ctx.beginPath();
      const knotY = ry + 7 * b.scale;
      ctx.moveTo(0, knotY);

      // String curvature lags behind horizontal sway
      const lagX = -Math.sin(rotation) * 16 * b.scale;
      const cp1X = lagX * 0.5;
      const cp1Y = knotY + b.stringLength * 0.4;
      const cp2X = lagX * 0.9;
      const cp2Y = knotY + b.stringLength * 0.75;
      const endX = lagX * 0.6;
      const endY = knotY + b.stringLength;

      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
      ctx.strokeStyle = 'rgba(241, 245, 249, 0.45)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      ctx.restore();
    };

    // Main 60 FPS Render Loop with Delta Time
    const render = (now: number) => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(render);

      // Delta time capped to 33ms to prevent giant physics jumps on tab change
      const delta = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;
      globalTime += delta;

      // Subtle, buttery smooth camera pan and push-in (closed loop ease)
      const loopPeriod = 14.0; // 14-second closed cycle
      const cycleProgress = (globalTime % loopPeriod) / loopPeriod;
      const easeFactor = 0.5 * (1 - Math.cos(cycleProgress * Math.PI * 2));
      
      const targetX = Math.sin(cycleProgress * Math.PI * 2) * 8;
      const targetY = Math.sin(cycleProgress * Math.PI * 4) * 3;
      const targetScale = 1.0 + 0.02 * easeFactor;

      camX += (targetX - camX) * 0.04;
      camY += (targetY - camY) * 0.04;
      camScale += (targetScale - camScale) * 0.04;

      // Clear Canvas
      ctx.save();
      ctx.fillStyle = '#08090b';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Background Image with smooth subtle camera push-in
      if (imageLoaded) {
        ctx.save();
        ctx.translate(width / 2 + camX, height / 2 + camY);
        ctx.scale(camScale, camScale);

        // Calculate aspect ratio cover
        const imgRatio = bgImage.naturalWidth / bgImage.naturalHeight;
        const screenRatio = width / height;
        let drawW = width;
        let drawH = height;

        if (screenRatio > imgRatio) {
          drawW = width;
          drawH = width / imgRatio;
        } else {
          drawH = height;
          drawW = height * imgRatio;
        }

        ctx.drawImage(bgImage, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      }

      // 2. Draw Dust Motes / Light Particles
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY * delta;
        p.x += (p.speedX + Math.sin(globalTime * 0.5 + p.phase) * 3) * delta;

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

      // 3. Update & Draw Flying Helium Balloons
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
          b.y = height + b.radiusY + 10 + Math.random() * 80;
          b.x = width * 0.05 + Math.random() * (width * 0.9);
          b.speedY = (18 + Math.random() * 22) * (b.depthLayer === 0 ? 0.75 : b.depthLayer === 1 ? 1.0 : 1.25);
          b.driftSpeedX = (Math.random() - 0.48) * 8;
        }
      }

      ctx.restore();
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
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

export default RealisticBalloonCanvas;

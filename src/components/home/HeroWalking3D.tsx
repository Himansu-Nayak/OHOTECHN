'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * HeroWalking3D — 4K/8K Real-Time 3D Walking Camera Experience
 * 
 * Sensation:
 * - First-person continuous walking forward through a cinematic cyber-architectural corridor
 * - Natural bipedal cadence (rhythmic vertical head-bob, subtle torso sway, gentle roll)
 * - Endless architectural portals, infinite neon perspective cyber grid floor, and floating
 *   surreal liquid-chrome & emerald translucent sculptures
 * - 1,600 volumetric streaming data particles rushing past the camera for intense depth
 * - Razor-sharp 4K/retina resolution (devicePixelRatio clamped to 2.5) with ACES tone mapping
 * - Interactive mouse/cursor parallax to look around the 3D space
 * - Zero GPU waste: automatically pauses when scrolled off-screen via IntersectionObserver
 */
export function HeroWalking3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || typeof window === 'undefined') return;

    // Detect WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setIsSupported(false);
        return;
      }
    } catch {
      setIsSupported(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08090b);
    // Exponential atmospheric distance fog
    scene.fog = new THREE.FogExp2(0x08090b, 0.016);

    // 2. Camera Setup (First-person walking perspective)
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(65, aspect, 0.1, 150);
    const baseEyeHeight = 1.7; // Standard human eye level in meters
    camera.position.set(0, baseEyeHeight, 0);

    // 3. Renderer (High-precision 4K/Retina fidelity)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. Lighting System
    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    // Walker headlight (moves along with the camera, illuminating structures as you walk past)
    const walkerLight = new THREE.PointLight(0x10b981, 3.5, 35, 1.2);
    walkerLight.position.set(0, baseEyeHeight + 0.5, -2);
    scene.add(walkerLight);

    // Secondary cyan rim light
    const cyanRimLight = new THREE.PointLight(0x06b6d4, 2.8, 40, 1.5);
    cyanRimLight.position.set(0, 4, -10);
    scene.add(cyanRimLight);

    // 5. Infinite Reflective Cyber Floor & Grid
    // Primary grid wireframe
    const gridHelper = new THREE.GridHelper(200, 100, 0x10b981, 0x064e3b);
    gridHelper.position.y = 0;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.45;
    scene.add(gridHelper);

    // High-tech floor plane with metallic sheen
    const floorGeo = new THREE.PlaneGeometry(200, 200, 32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x07090d,
      roughness: 0.15,
      metalness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    scene.add(floor);

    // Subtle ceiling grid for futuristic enclosed architectural feel
    const ceilingGrid = new THREE.GridHelper(200, 50, 0x06b6d4, 0x082f49);
    ceilingGrid.position.y = 8.5;
    (ceilingGrid.material as THREE.Material).transparent = true;
    (ceilingGrid.material as THREE.Material).opacity = 0.2;
    scene.add(ceilingGrid);

    // 6. Architectural Portals / Structural Frames (Walking through gateways)
    const PORTAL_COUNT = 10;
    const PORTAL_SPACING = 15;
    const portals: THREE.Group[] = [];

    const portalFrameGeo = new THREE.BoxGeometry(0.3, 7, 0.4);
    const portalTopGeo = new THREE.BoxGeometry(14, 0.4, 0.4);
    const portalMat = new THREE.MeshStandardMaterial({
      color: 0x0e1726,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x064e3b,
      emissiveIntensity: 0.35,
    });
    const portalGlowMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: false,
    });

    for (let i = 0; i < PORTAL_COUNT; i++) {
      const portalGroup = new THREE.Group();
      const zPos = -i * PORTAL_SPACING;

      // Left Pillar
      const leftPillar = new THREE.Mesh(portalFrameGeo, portalMat);
      leftPillar.position.set(-6.5, 3.5, 0);
      portalGroup.add(leftPillar);

      // Left Pillar Neon Accent Strip
      const leftStrip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 7, 0.45), portalGlowMat);
      leftStrip.position.set(-6.3, 3.5, 0);
      portalGroup.add(leftStrip);

      // Right Pillar
      const rightPillar = new THREE.Mesh(portalFrameGeo, portalMat);
      rightPillar.position.set(6.5, 3.5, 0);
      portalGroup.add(rightPillar);

      // Right Pillar Neon Accent Strip
      const rightStrip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 7, 0.45), portalGlowMat);
      rightStrip.position.set(6.3, 3.5, 0);
      portalGroup.add(rightStrip);

      // Overhead Lintel Arch
      const lintel = new THREE.Mesh(portalTopGeo, portalMat);
      lintel.position.set(0, 7, 0);
      portalGroup.add(lintel);

      // Overhead Neon Line
      const topStrip = new THREE.Mesh(new THREE.BoxGeometry(13.8, 0.08, 0.45), portalGlowMat);
      topStrip.position.set(0, 6.8, 0);
      portalGroup.add(topStrip);

      portalGroup.position.set(0, 0, zPos);
      scene.add(portalGroup);
      portals.push(portalGroup);
    }

    // 7. Floating Surreal Sculptures (Chrome toruses, Emerald polyhedra, Data monoliths)
    const sculptures: { mesh: THREE.Mesh | THREE.Group; baseZ: number; rotSpeedX: number; rotSpeedY: number; floatSpeed: number; floatAmp: number; basePosY: number }[] = [];
    const SCULPTURE_COUNT = 14;

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.98,
      roughness: 0.08,
      envMapIntensity: 2.0,
    });

    const emeraldGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.7,
      transparent: true,
      opacity: 0.85,
      ior: 1.5,
      emissive: 0x047857,
      emissiveIntensity: 0.4,
    });

    const cyanPolyMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      metalness: 0.2,
      roughness: 0.2,
      transmission: 0.6,
      transparent: true,
      opacity: 0.8,
      ior: 1.4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.3,
    });

    for (let i = 0; i < SCULPTURE_COUNT; i++) {
      const isLeft = i % 2 === 0;
      const x = (isLeft ? -1 : 1) * (4.2 + Math.random() * 4.5);
      const y = 1.8 + Math.random() * 3.5;
      const z = -(i * 10 + Math.random() * 5);

      let mesh: THREE.Mesh;
      const type = i % 3;

      if (type === 0) {
        // Floating Chrome Torus / Ring
        mesh = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.22, 24, 48), chromeMat);
      } else if (type === 1) {
        // Translucent Emerald Dodecahedron
        mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 0), emeraldGlassMat);
      } else {
        // Floating Cyan Icosahedron
        mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 0), cyanPolyMat);
      }

      mesh.position.set(x, y, z);
      scene.add(mesh);

      sculptures.push({
        mesh,
        baseZ: z,
        rotSpeedX: 0.3 + Math.random() * 0.5,
        rotSpeedY: 0.4 + Math.random() * 0.6,
        floatSpeed: 0.8 + Math.random() * 0.6,
        floatAmp: 0.3 + Math.random() * 0.25,
        basePosY: y,
      });
    }

    // 8. Volumetric Streaming Particles (Data Rush Velocity)
    const PARTICLE_COUNT = 1600;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);

    const cEmerald = new THREE.Color(0x10b981);
    const cCyan = new THREE.Color(0x06b6d4);
    const cWhite = new THREE.Color(0xf8fafc);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * 36;
      particlePositions[idx + 1] = Math.random() * 10;
      particlePositions[idx + 2] = -Math.random() * 160;

      // Color variation
      const r = Math.random();
      const col = r < 0.5 ? cEmerald : r < 0.85 ? cCyan : cWhite;
      particleColors[idx] = col.r;
      particleColors[idx + 1] = col.g;
      particleColors[idx + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 9. Interactive Mouse Parallax (Looking around the environment)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = nx;
      mouse.targetY = ny;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 10. Animation Loop with Realistic Walking Cadence
    let animationFrameId: number;
    let isVisible = true;
    let lastTime = performance.now();
    let walkDistance = 0;
    let walkStep = 0;

    // Cadence Constants
    const walkSpeed = prefersReducedMotion ? 1.0 : 4.2; // Forward movement speed (m/s)
    const walkStepFreq = 3.6; // Step frequency (steps per second)
    const bobAmp = 0.045; // Vertical head-bob amplitude in meters
    const swayAmp = 0.035; // Lateral sway amplitude
    const rollAmp = 0.008; // Subtle lateral tilt roll

    const animate = () => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Update distance & walk cycle
      walkDistance += walkSpeed * delta;
      walkStep += walkStepFreq * delta;

      // Camera Walking Kinematics
      camera.position.z = -walkDistance;

      // Bipedal vertical head-bob (rises and falls twice per full stride)
      camera.position.y = baseEyeHeight + Math.sin(walkStep * 2) * bobAmp;

      // Lateral weight shift / torso sway
      camera.position.x = Math.sin(walkStep) * swayAmp;

      // Subtle lateral roll tilt
      camera.rotation.z = Math.sin(walkStep) * rollAmp;

      // Mouse Parallax Smooth Lerp (Interactive Look Around)
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      camera.rotation.y = -mouse.x * 0.28;
      camera.rotation.x = mouse.y * 0.18 + Math.sin(walkStep * 2) * 0.006;

      // Move walker lights forward in lockstep
      walkerLight.position.z = camera.position.z - 3.0;
      walkerLight.position.x = camera.position.x;
      walkerLight.position.y = camera.position.y;

      cyanRimLight.position.z = camera.position.z - 14.0;

      // Shift floor & ceiling grid textures/positions to loop infinitely
      gridHelper.position.z = camera.position.z - (camera.position.z % 2);
      ceilingGrid.position.z = camera.position.z - (camera.position.z % 4);
      floor.position.z = camera.position.z;

      // Endless Portals Wrapping
      const totalPortalDistance = PORTAL_COUNT * PORTAL_SPACING;
      for (let i = 0; i < PORTAL_COUNT; i++) {
        const portal = portals[i];
        // If portal is more than 5 meters behind the camera, warp it ahead to the horizon
        if (portal.position.z > camera.position.z + 5) {
          portal.position.z -= totalPortalDistance;
        }
      }

      // Endless Floating Sculptures Wrapping & Organic Undulation
      const totalSculptureDistance = SCULPTURE_COUNT * 10;
      for (let i = 0; i < SCULPTURE_COUNT; i++) {
        const sc = sculptures[i];
        if (sc.mesh.position.z > camera.position.z + 5) {
          sc.mesh.position.z -= totalSculptureDistance;
        }
        // Floating organic breathing rotation & vertical hover
        sc.mesh.rotation.x += sc.rotSpeedX * delta;
        sc.mesh.rotation.y += sc.rotSpeedY * delta;
        sc.mesh.position.y = sc.basePosY + Math.sin(now * 0.001 * sc.floatSpeed + i) * sc.floatAmp;
      }

      // Volumetric Streaming Particles Looping
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const zIdx = i * 3 + 2;
        // If particle passed behind the camera, respawn far ahead into the fog
        if (positions[zIdx] > camera.position.z + 2) {
          positions[zIdx] = camera.position.z - 120 - Math.random() * 40;
        }
      }
      posAttr.needsUpdate = true;

      // Render 4K frame
      renderer.render(scene, camera);
    };

    // 11. IntersectionObserver (0% GPU usage when scrolled down)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            lastTime = performance.now();
            animate();
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 12. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    };
    window.addEventListener('resize', handleResize);

    // Initial render
    animate();

    // 13. Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);

      // Clean Three.js memory allocations
      scene.clear();
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      portalFrameGeo.dispose();
      portalTopGeo.dispose();
      portalMat.dispose();
      portalGlowMat.dispose();
      chromeMat.dispose();
      emeraldGlassMat.dispose();
      cyanPolyMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Fallback image if WebGL fails to initialize */}
      {!isSupported && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-[floatSlow_16s_ease-in-out_infinite]"
          style={{ backgroundImage: `url('/images/hero-surreal-office.jpg')` }}
        />
      )}
    </div>
  );
}
export default HeroWalking3D;

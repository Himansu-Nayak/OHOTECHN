'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useMotion } from './MotionContext';

// Vertex Shader: Particle displacement driven by time, scroll velocity, and mouse attraction
const particleVertexShader = `
  uniform float u_time;
  uniform float u_scroll_progress;
  uniform float u_scroll_velocity;
  uniform vec2 u_mouse;
  uniform float u_pixel_ratio;

  attribute float a_scale;
  attribute vec3 a_random;

  varying vec3 v_position;
  varying float v_dist_to_center;

  void main() {
    v_position = position;

    // Base position
    vec3 transformed = position;

    // Subtle breathing harmonic wave
    float waveX = sin(transformed.x * 0.4 + u_time * 0.6) * 0.35;
    float waveY = cos(transformed.y * 0.4 + u_time * 0.5) * 0.35;
    float waveZ = sin((transformed.x + transformed.y) * 0.3 + u_time * 0.8) * 0.4;
    
    transformed.z += waveZ + (waveX + waveY) * 0.5;

    // Scroll-linked velocity stretch
    transformed.y -= u_scroll_velocity * 0.003 * a_random.y;

    // Mouse interactive field displacement
    float mouseDist = distance(vec2(transformed.x * 0.2, transformed.y * 0.2), u_mouse * 2.0);
    float mouseFactor = max(0.0, 1.0 - mouseDist * 0.4);
    transformed.z += mouseFactor * 0.8;
    transformed.xy += (transformed.xy - u_mouse * 4.0) * mouseFactor * 0.15;

    v_dist_to_center = length(transformed.xy);

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size attenuation
    gl_PointSize = a_scale * u_pixel_ratio * (28.0 / -mvPosition.z) * (1.0 + mouseFactor * 0.5);
  }
`;

// Fragment Shader: Soft glowing particle point with dynamic color accent blending
const particleFragmentShader = `
  uniform vec3 u_color_base;
  uniform vec3 u_color_accent;
  uniform float u_opacity;

  varying vec3 v_position;
  varying float v_dist_to_center;

  void main() {
    // Make circular soft particle
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Soft Gaussian-like alpha falloff
    float alpha = smoothstep(0.5, 0.05, dist) * u_opacity;

    // Blend between base digital cyan and active service accent
    float blendFactor = clamp(sin(v_position.x * 0.3 + v_position.y * 0.3) * 0.5 + 0.5, 0.0, 1.0);
    vec3 finalColor = mix(u_color_base, u_color_accent, blendFactor);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Helper: Convert Hex color string to Three.js Color
function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

export function GlobalCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    pointer, 
    scrollProgress, 
    scrollVelocity, 
    activeServiceAccent,
    isWebGLSupported, 
    isReducedMotion 
  } = useMotion();

  const [hasWebGL, setHasWebGL] = useState(false);
  const [mounted, setMounted] = useState(false);

  // References for Three.js engine loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const uniformsRef = useRef<{ [uniform: string]: THREE.IUniform } | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isReducedMotion || !isWebGLSupported || typeof window === 'undefined') {
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    try {
      // 1. Scene & Camera
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
      camera.position.set(0, 0, 8.5);
      cameraRef.current = camera;

      // 2. WebGL Renderer with capped DPR for maximum frame rates
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      rendererRef.current = renderer;

      // 3. Particle Grid Geometry
      const count = 1600;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const scales = new Float32Array(count);
      const randoms = new Float32Array(count * 3);

      const radiusX = 14;
      const radiusY = 9;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Distribute in an elliptical plane with volumetric depth
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random());

        const x = (Math.random() - 0.5) * radiusX * 1.6;
        const y = (Math.random() - 0.5) * radiusY * 1.6;
        const z = (Math.random() - 0.5) * 4.5;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        scales[i] = Math.random() * 1.8 + 0.6;

        randoms[i3] = Math.random();
        randoms[i3 + 1] = Math.random() * 2.0 - 1.0;
        randoms[i3 + 2] = Math.random();
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('a_scale', new THREE.BufferAttribute(scales, 1));
      geometry.setAttribute('a_random', new THREE.BufferAttribute(randoms, 3));

      // 4. Custom GLSL Shader Material
      const uniforms = {
        u_time: { value: 0 },
        u_scroll_progress: { value: 0 },
        u_scroll_velocity: { value: 0 },
        u_mouse: { value: new THREE.Vector2(0, 0) },
        u_pixel_ratio: { value: dpr },
        u_color_base: { value: new THREE.Vector3(0.06, 0.72, 0.55) }, // Emerald Base
        u_color_accent: { value: hexToVec3('#06b6d4') }, // Dynamic Accent
        u_opacity: { value: 0.55 },
      };
      uniformsRef.current = uniforms;

      const material = new THREE.ShaderMaterial({
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const particleMesh = new THREE.Points(geometry, material);
      scene.add(particleMesh);

      setHasWebGL(true);

      // 5. Optimized Render Loop connected to GSAP ticker
      let clock = new THREE.Clock();
      let isVisible = true;

      const handleVisibilityChange = () => {
        isVisible = document.visibilityState === 'visible';
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      const render = () => {
        if (!isVisible || !rendererRef.current || !sceneRef.current || !cameraRef.current) {
          return;
        }

        const elapsedTime = clock.getElapsedTime();
        if (uniformsRef.current) {
          uniformsRef.current.u_time.value = elapsedTime;
        }

        // Camera subtle smooth parallax tracking pointer
        if (cameraRef.current) {
          cameraRef.current.position.x += (pointer.normalizedX * 0.4 - cameraRef.current.position.x) * 0.05;
          cameraRef.current.position.y += (pointer.normalizedY * 0.4 - cameraRef.current.position.y) * 0.05;
          cameraRef.current.lookAt(0, 0, 0);
        }

        rendererRef.current.render(sceneRef.current, cameraRef.current);
      };

      gsap.ticker.add(render);

      // 6. Responsive Resize Handler
      const handleResize = () => {
        if (!cameraRef.current || !rendererRef.current) return;
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
        if (uniformsRef.current) {
          uniformsRef.current.u_pixel_ratio.value = Math.min(window.devicePixelRatio || 1, 1.75);
        }
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('resize', handleResize);
        gsap.ticker.remove(render);

        geometry.dispose();
        material.dispose();
        renderer.dispose();
        scene.remove(particleMesh);
        setHasWebGL(false);
      };
    } catch {
      setHasWebGL(false);
    }
  }, [mounted, isReducedMotion, isWebGLSupported]);

  // Continuously update dynamic uniforms from MotionContext
  useEffect(() => {
    if (!uniformsRef.current) return;
    uniformsRef.current.u_mouse.value.set(pointer.normalizedX, pointer.normalizedY);
    uniformsRef.current.u_scroll_progress.value = scrollProgress;
    uniformsRef.current.u_scroll_velocity.value = scrollVelocity;
    if (activeServiceAccent) {
      uniformsRef.current.u_color_accent.value = hexToVec3(activeServiceAccent);
    }
  }, [pointer, scrollProgress, scrollVelocity, activeServiceAccent]);

  if (!mounted) return null;

  return (
    <div 
      ref={containerRef}
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Three.js Hardware Accelerated Global WebGL Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block opacity-80 transition-opacity duration-1000" 
      />

      {/* Progressive Enhancement Fallback CSS Atmosphere */}
      {!hasWebGL && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(16,185,129,0.07)_0%,transparent_70%)] pointer-events-none" />
      )}
    </div>
  );
}

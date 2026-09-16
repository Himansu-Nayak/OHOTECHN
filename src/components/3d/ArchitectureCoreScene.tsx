'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useMotion } from '@/components/experience/MotionContext';

interface SceneContentProps {
  scrollProgress: number;
  pointer: { normalizedX: number; normalizedY: number };
  isReducedMotion: boolean;
}

function DistributedStackModel({ scrollProgress, pointer, isReducedMotion }: SceneContentProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const tier1Ref = useRef<THREE.Mesh>(null);
  const tier2Ref = useRef<THREE.Mesh>(null);
  const tier3Ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isReducedMotion) {
      groupRef.current.rotation.x = 0.45;
      groupRef.current.rotation.y = 0.65;
      return;
    }

    // Scroll-linked rotation synced with Lenis/GSAP scroll authority
    const targetRotY = scrollProgress * Math.PI * 3 + pointer.normalizedX * 0.4;
    const targetRotX = 0.35 + pointer.normalizedY * 0.25;

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      3.5,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      3.5,
      delta
    );

    // Subtle counter-rotation for internal compute core
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.6;
      coreRef.current.rotation.z += delta * 0.4;
    }

    // Subtle breathing pulse on tier layers
    if (tier1Ref.current && tier3Ref.current) {
      tier1Ref.current.position.y = 1.15 + Math.sin(Date.now() * 0.002) * 0.05;
      tier3Ref.current.position.y = -1.15 - Math.sin(Date.now() * 0.002) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Tier 1: Ingress / Edge Gateway Layer */}
      <mesh ref={tier1Ref} position={[0, 1.15, 0]}>
        <boxGeometry args={[2.6, 0.08, 2.6]} />
        <meshStandardMaterial
          color="#06b6d4"
          metalness={0.75}
          roughness={0.2}
          transparent
          opacity={0.85}
          wireframe={false}
        />
      </mesh>
      {/* Tier 1 Wireframe Accent */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[2.64, 0.1, 2.64]} />
        <meshBasicMaterial color="#22d3ee" wireframe />
      </mesh>

      {/* Tier 2: Microservices & Event Core (Central Platform) */}
      <mesh ref={tier2Ref} position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.1, 3.2]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.8}
          roughness={0.25}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Tier 2 Wireframe Accent */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.24, 0.12, 3.24]} />
        <meshBasicMaterial color="#34d399" wireframe />
      </mesh>

      {/* Tier 3: Distributed State & Database Infrastructure */}
      <mesh ref={tier3Ref} position={[0, -1.15, 0]}>
        <boxGeometry args={[2.6, 0.08, 2.6]} />
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.85}
          roughness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Tier 3 Wireframe Accent */}
      <mesh position={[0, -1.15, 0]}>
        <boxGeometry args={[2.64, 0.1, 2.64]} />
        <meshBasicMaterial color="#60a5fa" wireframe />
      </mesh>

      {/* Central Rotating Autonomous Compute Node */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={coreRef} position={[0, 0, 0]}>
          <octahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#10b981"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Float>

      {/* Inter-Tier Communication Conduit Rods */}
      {[
        [-1.0, -1.0],
        [1.0, -1.0],
        [-1.0, 1.0],
        [1.0, 1.0],
      ].map(([cx, cz], idx) => (
        <mesh key={idx} position={[cx, 0, cz]}>
          <cylinderGeometry args={[0.02, 0.02, 2.4, 8]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Satellite Node Clusters orbiting edges */}
      {[
        [1.8, 1.15, 0],
        [-1.8, -1.15, 0],
        [0, 0, 2.1],
        [0, 0, -2.1],
      ].map(([sx, sy, sz], idx) => (
        <mesh key={`sat-${idx}`} position={[sx, sy, sz]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={idx % 2 === 0 ? '#06b6d4' : '#10b981'}
            emissive={idx % 2 === 0 ? '#06b6d4' : '#10b981'}
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export function ArchitectureCoreScene() {
  const [mounted, setMounted] = useState(false);
  const { scrollProgress, pointer, isReducedMotion } = useMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[380px] lg:min-h-[460px] flex items-center justify-center bg-[#0d0e12]/60 border border-white/10 rounded-none">
        <div className="font-mono text-xs text-slate-500 uppercase tracking-widest animate-pulse">
          INITIALIZING DISTRIBUTED TOPOLOGY CORE...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-[460px] overflow-hidden bg-[#0d0e12]/60 border border-white/10 rounded-none">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.5, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-5, -4, -3]} intensity={0.6} color="#06b6d4" />
        <pointLight position={[0, 0, 0]} intensity={1.5} color="#10b981" distance={4} />

        <DistributedStackModel
          scrollProgress={scrollProgress}
          pointer={pointer}
          isReducedMotion={isReducedMotion}
        />
      </Canvas>
    </div>
  );
}

export default ArchitectureCoreScene;

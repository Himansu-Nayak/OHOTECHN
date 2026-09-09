'use client';

import React, { useEffect, useRef } from 'react';
import { Network, Sparkles, Zap } from 'lucide-react';
import { DotGlobe } from '@/components/ui/DotGlobe';

interface NodePoint {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  label?: string;
}

export function InteractiveMeshPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || 1000);
    let height = (canvas.height = 480);
    let animId: number;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const nodes: NodePoint[] = [];
    const nodeCount = 38;
    const colors = ['#10b981', '#06b6d4', '#3b82f6', '#ffffff'];

    const labels = [
      'EDGE_NODE',
      'REDIS_CLUSTER',
      'POSTGRES_PROD',
      'NEURAL_CORE',
      'API_GATEWAY',
      'AUTH_SERVICE',
      'VECTOR_INDEX',
      'K8S_POD',
      'NEXT_APP_ROUTER',
    ];

    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      nodes.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() > 0.8 ? 5 : 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        label: i < labels.length ? labels[i] : undefined,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = 480;
      }
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nodes with proximity lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 130) {
            const alpha = 1 - dist / 130;
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw nodes
      nodes.forEach((node) => {
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;

          // Mouse repulsion physics
          const mdx = node.x - mouseX;
          const mdy = node.y - mouseY;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < 140) {
            const force = (140 - mdist) / 140;
            node.x += (mdx / mdist) * force * 4;
            node.y += (mdy / mdist) * force * 4;
          }
        }

        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        if (node.radius > 4) {
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 2.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (node.label) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.font = '10px monospace';
          ctx.fillText(node.label, node.x + 8, node.y + 3);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="relative w-full bg-[#0a0c10] text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
                SPATIAL CLOUD MESH // LIVE TOPOLOGY
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                Move cursor across canvas to interact with active cluster nodes
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>38 ACTIVE DATA NODES</span>
          </div>
        </div>

        {/* Interactive Canvas & 3D Globe Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Interactive Mesh Canvas */}
          <div
            data-cursor="INTERACT"
            className="lg:col-span-8 relative w-full h-[480px] rounded-[32px] bg-[#0f121a] border border-white/10 overflow-hidden shadow-2xl cursor-crosshair group"
          >
            <canvas ref={canvasRef} className="w-full h-full block" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-neutral-400 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 pointer-events-none">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DYNAMIC MESH PHYSICS</span>
              </span>
              <span>CURSOR REPULSION: ACTIVE</span>
            </div>
          </div>

          {/* 3D Dot Globe & Live APAC Coordinates */}
          <div className="lg:col-span-4 bg-[#0f121a] border border-white/10 rounded-[32px] p-6 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="w-full flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                GLOBAL NODES
              </span>
              <span className="text-emerald-400 font-bold">120 FPS WEBGL</span>
            </div>

            <div className="my-2" data-cursor="DRAG GLOBE">
              <DotGlobe size={260} />
            </div>

            <div className="w-full space-y-2 pt-4 border-t border-white/10 text-[11px] font-mono text-slate-400">
              <div className="flex justify-between">
                <span>APAC HEADQUARTERS</span>
                <span className="text-white font-bold">INDIA [20.59°N]</span>
              </div>
              <div className="flex justify-between">
                <span>US EAST CLOUD</span>
                <span className="text-white font-bold">N. VIRGINIA [38.03°N]</span>
              </div>
              <div className="flex justify-between">
                <span>EU CENTRAL EDGE</span>
                <span className="text-white font-bold">FRANKFURT [50.11°N]</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

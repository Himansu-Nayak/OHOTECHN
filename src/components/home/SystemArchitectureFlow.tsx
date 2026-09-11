'use client';

import * as React from 'react';
import { 
  User, 
  Globe, 
  Layers, 
  Cpu, 
  Database, 
  Sparkles, 
  Server,
  Zap,
  Activity,
  Shield,
  Radio,
  Play,
  CheckCircle2,
  Lock,
  Workflow
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface ArchLayer {
  id: string;
  step: string;
  name: string;
  layer: string;
  role: string;
  execution: string;
  security: string;
  tech: string;
  dataProtocol: string;
  icon: React.ElementType;
  accent: string;
}

const ARCH_LAYERS: ArchLayer[] = [
  {
    id: 'client',
    step: '01',
    name: 'Client & Multi-Tenant Experience',
    layer: 'USER // CLIENT TIER',
    role: 'Responsive web, native mobile apps, and enterprise administrative portals.',
    execution: 'Client-side hydration, edge SSR & local optimistic UI state',
    security: 'HTTPS / TLS 1.3 • WebAuthn • Biometric Key Storage',
    tech: 'Next.js 16, React 19, Swift, Kotlin',
    dataProtocol: 'JSON-RPC / REST / GraphQL over HTTPS',
    icon: User,
    accent: '#10b981',
  },
  {
    id: 'gateway',
    step: '02',
    name: 'Secure API Gateway & Edge Routing',
    layer: 'GATEWAY // INGRESS TIER',
    role: 'Centralized edge termination, intelligent load routing, and token validation.',
    execution: 'Reverse proxying, rate-limiting & edge geo-distribution',
    security: 'Zero-Trust JWT Validation • Cryptographic Token Signatures',
    tech: 'Nginx, Spring Cloud Gateway, Edge CDN',
    dataProtocol: 'Mutual TLS / Encrypted Header Verification',
    icon: Layers,
    accent: '#06b6d4',
  },
  {
    id: 'compute',
    step: '03',
    name: 'Core Microservices & Domain Logic',
    layer: 'COMPUTE // LOGIC TIER',
    role: 'Stateless business logic, billing calculations, and ERP transaction validation.',
    execution: 'Stateless thread pool execution with isolated domain boundaries',
    security: 'Role-Based Access Control (RBAC) • Strict Memory Isolation',
    tech: 'Java 21, Spring Boot 3, Node.js',
    dataProtocol: 'gRPC / Internal High-Speed Binary IPC',
    icon: Cpu,
    accent: '#3b82f6',
  },
  {
    id: 'messaging',
    step: '04',
    name: 'Event Stream & Background Pipelines',
    layer: 'MESSAGING // ASYNC TIER',
    role: 'Asynchronous task delegation, event broadcasting, and high-volume job queues.',
    execution: 'Decoupled pub/sub event consumption with idempotent retry logic',
    security: 'Signed Event Payloads • Poison-Pill Dead Letter Queues',
    tech: 'Redis Streams, RabbitMQ, Celery',
    dataProtocol: 'Binary Message Queues / Pub-Sub Topics',
    icon: Workflow,
    accent: '#8b5cf6',
  },
  {
    id: 'persistence',
    step: '05',
    name: 'Persistence & In-Memory Cache',
    layer: 'DATA // STORAGE TIER',
    role: 'ACID-compliant relational storage, read-heavy distributed caching, and state sync.',
    execution: 'Connection pooling, query optimization & automated transaction rollbacks',
    security: 'AES-256 Data-at-Rest Encryption • Parameterized Prepared Statements',
    tech: 'PostgreSQL 16, Redis Clusters, Enterprise JPA',
    dataProtocol: 'PostgreSQL Wire Protocol / TCP Socket Pooling',
    icon: Database,
    accent: '#ec4899',
  },
  {
    id: 'integrations',
    step: '06',
    name: 'Enterprise Connectors & Intelligence',
    layer: 'INTELLIGENCE // CONNECTORS TIER',
    role: 'External third-party payment gateways, transactional email, and analytics.',
    execution: 'Idempotent webhook handlers, secure credential vaulting & task workers',
    security: 'HMAC-SHA256 Signature Verification • Secret Token Rotation',
    tech: 'Razorpay, Stripe, Resend SMTP, FastAPI',
    dataProtocol: 'REST Webhooks / Signed JSON Envelopes',
    icon: Sparkles,
    accent: '#f59e0b',
  },
  {
    id: 'cloud',
    step: '07',
    name: 'Containerized Cloud Infrastructure',
    layer: 'INFRASTRUCTURE // HOSTING TIER',
    role: 'High-availability cluster orchestration, automated pod scaling, and telemetry.',
    execution: 'Multi-zone container scheduling with automated health liveness probes',
    security: 'VPC Isolation • Read-Only Container Root FS • Network Policies',
    tech: 'Docker Containers, Kubernetes Mesh, Multi-AZ Cloud',
    dataProtocol: 'Overlay Network / Zero-Egress Pod Virtualization',
    icon: Server,
    accent: '#10b981',
  },
];

export function SystemArchitectureFlow() {
  const [activeLayer, setActiveLayer] = React.useState<number>(0);
  const [isSimulating, setIsSimulating] = React.useState<boolean>(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isVisibleRef = React.useRef<boolean>(true);

  // IntersectionObserver to pause rendering when offscreen
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Living Canvas Particle & Data Circuit Simulation
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 800);
    let height = (canvas.height = canvas.offsetHeight || 500);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 800;
      height = canvas.height = canvas.offsetHeight || 500;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool for flowing data packets
    interface Packet {
      x: number;
      y: number;
      speed: number;
      layerIdx: number;
      size: number;
      color: string;
      alpha: number;
    }

    const packets: Packet[] = [];
    const colors = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    for (let i = 0; i < 28; i++) {
      packets.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 1.2 + Math.random() * 1.8,
        layerIdx: Math.floor(Math.random() * 7),
        size: 2 + Math.random() * 2.5,
        color: colors[i % colors.length],
        alpha: 0.3 + Math.random() * 0.7,
      });
    }

    let tick = 0;

    const render = () => {
      if (!isVisibleRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      tick += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle circuit bus lines
      const laneCount = 7;
      const laneGap = height / (laneCount + 1);

      for (let i = 0; i < laneCount; i++) {
        const laneY = (i + 1) * laneGap;
        ctx.beginPath();
        ctx.strokeStyle = i === activeLayer ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = i === activeLayer ? 2 : 1;
        ctx.setLineDash([4, 8]);
        ctx.moveTo(40, laneY);
        ctx.lineTo(width - 40, laneY);
        ctx.stroke();

        // Node connection indicator
        ctx.beginPath();
        ctx.arc(40, laneY, i === activeLayer ? 4 : 2, 0, Math.PI * 2);
        ctx.arc(width - 40, laneY, i === activeLayer ? 4 : 2, 0, Math.PI * 2);
        ctx.fillStyle = i === activeLayer ? '#10b981' : 'rgba(255, 255, 255, 0.15)';
        ctx.fill();
      }

      ctx.setLineDash([]);

      // Draw and update moving data packets
      packets.forEach((p) => {
        const targetY = (p.layerIdx + 1) * laneGap;
        p.x += p.speed;
        if (p.x > width - 40) {
          p.x = 40;
          p.layerIdx = Math.floor(Math.random() * 7);
        }

        // Draw glowing packet
        ctx.beginPath();
        ctx.arc(p.x, targetY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.layerIdx === activeLayer ? '#10b981' : p.color;
        ctx.shadowColor = p.layerIdx === activeLayer ? '#10b981' : p.color;
        ctx.shadowBlur = p.layerIdx === activeLayer ? 12 : 6;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeLayer]);

  // Simulation Pulse Trigger
  const triggerSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    let step = 0;
    const interval = setInterval(() => {
      setActiveLayer(step);
      step++;
      if (step >= ARCH_LAYERS.length) {
        clearInterval(interval);
        setTimeout(() => setIsSimulating(false), 800);
      }
    }, 450);
  };

  const selectedNode = ARCH_LAYERS[activeLayer];
  const SelectedIcon = selectedNode.icon;

  return (
    <section 
      id="architecture" 
      ref={containerRef}
      role="region"
      aria-label="OHO TECH Living System Architecture and Technology Topology"
      className="w-full bg-[#0c0d11] text-white py-20 sm:py-28 px-6 sm:px-10 lg:px-16 relative overflow-hidden"
    >
      {/* Background Architectural Mesh & Subtle Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(16,185,129,0.12),transparent_75%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Container with Simulation Trigger */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-12 relative z-10 pb-6 border-b border-white/10">
        <div>
          <ScrollReveal yOffset={14} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>LIVING SYSTEM TOPOLOGY // CONTINUOUS COMPUTATION</span>
            </div>
          </ScrollReveal>

          <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase">
              Everything <span className="text-neutral-400">Connects.</span>
            </h2>
          </ScrollReveal>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl font-mono mt-2">
            A deterministic data lifecycle routing client interactions through secure API gateways, stateless microservices, and high-availability database clusters.
          </p>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={triggerSimulation}
            disabled={isSimulating}
            className={`px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 ${
              isSimulating
                ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-white/10 hover:bg-emerald-500 hover:text-black border border-white/20 text-white'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating Pipeline...' : 'Simulate Request Flow'}</span>
          </button>
        </div>
      </div>

      {/* Main Architecture Interactive Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 relative z-10">
        
        {/* Left 7 Columns: Living 7-Layer Node Topology */}
        <div className="lg:col-span-7 flex flex-col gap-2.5">
          {ARCH_LAYERS.map((node, index) => {
            const Icon = node.icon;
            const isActive = index === activeLayer;
            return (
              <div
                key={node.id}
                onClick={() => setActiveLayer(index)}
                onMouseEnter={() => setActiveLayer(index)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-[#141822] border-emerald-500/70 shadow-[0_4px_25px_rgba(16,185,129,0.18)] ring-1 ring-emerald-500/40 translate-x-1.5'
                    : 'bg-[#0f1117]/80 border-white/10 hover:border-white/20 hover:bg-[#13161f]'
                }`}
              >
                {/* Node Icon & Meta */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <span className={`font-mono text-xs font-bold px-2 py-1 rounded-md shrink-0 transition-colors ${
                    isActive ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-400'
                  }`}>
                    {node.step}
                  </span>

                  <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                    isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  <div className="min-w-0">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block truncate">
                      {node.layer}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                      {node.name}
                    </h3>
                  </div>
                </div>

                {/* Right Status Indicator */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`w-2 h-2 rounded-full transition-colors ${
                    isActive ? 'bg-emerald-400 animate-ping' : 'bg-white/20'
                  }`} />
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                    {node.tech.split(',')[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 5 Columns: Active Node Deep Architecture Telemetry Card */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="h-full bg-[#12151d] border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            
            {/* Background Data Stream Canvas */}
            <div className="absolute inset-0 opacity-25 pointer-events-none">
              <canvas ref={canvasRef} className="w-full h-full object-cover" />
            </div>

            <div className="relative z-10">
              {/* Header Telemetry */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <SelectedIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                      ACTIVE LAYER TELEMETRY
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      [{selectedNode.step}] {selectedNode.name}
                    </h4>
                  </div>
                </div>
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
              </div>

              {/* Functional Purpose */}
              <div className="mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                  FUNCTIONAL PURPOSE
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {selectedNode.role}
                </p>
              </div>

              {/* Deep Technical Specs Grid */}
              <div className="space-y-3.5 pt-4 border-t border-white/10">
                <div className="flex items-start gap-2.5 text-xs">
                  <Radio className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      EXECUTION PATTERN
                    </span>
                    <span className="text-slate-200 font-mono text-xs">
                      {selectedNode.execution}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      SECURITY &amp; COMPLIANCE
                    </span>
                    <span className="text-slate-200 font-mono text-xs">
                      {selectedNode.security}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      DATA PROTOCOL
                    </span>
                    <span className="text-slate-200 font-mono text-xs">
                      {selectedNode.dataProtocol}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Tech Stack Capsule */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
                  VERIFIED STACK
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {selectedNode.tech}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>FAULT ISOLATED</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}

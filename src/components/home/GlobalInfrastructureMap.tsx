'use client';

import * as React from 'react';
import { 
  Globe, 
  Server, 
  Shield, 
  Activity, 
  Radio, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  RefreshCw,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface RegionNode {
  id: string;
  name: string;
  code: string;
  coords: { x: number; y: number }; // Percentage 0-100 on 2D map projection
  type: 'Primary Core' | 'Edge Gateway' | 'Cloud Cluster' | 'Anycast POP';
  latency: string;
  uptime: string;
  specs: string;
  services: string[];
  protocol: string;
  routing: string;
  description: string;
}

const REGION_NODES: RegionNode[] = [
  {
    id: 'in-hub',
    name: 'India Central (Mumbai & Bhubaneswar)',
    code: 'IN-WEST-01 / IN-EAST-01',
    coords: { x: 67, y: 48 },
    type: 'Primary Core',
    latency: '14ms',
    uptime: '99.995%',
    specs: 'Distributed Kubernetes Cluster // PostgreSQL Read/Write Primary',
    services: ['Core Application APIs', 'Primary DB Sentinel', 'AI Inference Cluster', 'Enterprise ERP Engine'],
    protocol: 'gRPC / HTTP/3 / TLS 1.3',
    routing: 'Multi-AZ Active-Active with BGP Anycast',
    description: 'Central engineering control plane and primary high-availability database cluster orchestrating enterprise workloads.'
  },
  {
    id: 'sg-edge',
    name: 'Singapore (APAC Edge Hub)',
    code: 'AP-SOUTHEAST-01',
    coords: { x: 77, y: 56 },
    type: 'Edge Gateway',
    latency: '28ms',
    uptime: '99.99%',
    specs: 'Cloudflare Workers Edge // Redis Cache Cluster',
    services: ['Static & Dynamic Edge CDN', 'APAC API Proxy', 'Real-time WebSocket Broker'],
    protocol: 'QUIC / HTTP/3',
    routing: 'Anycast DNS with Sub-30ms Regional Routing',
    description: 'Low-latency Southeast Asian acceleration node handling real-time telemetry, cache invalidation, and edge security.'
  },
  {
    id: 'eu-fra',
    name: 'Frankfurt (EU Central Cloud)',
    code: 'EU-CENTRAL-01',
    coords: { x: 50, y: 32 },
    type: 'Cloud Cluster',
    latency: '108ms',
    uptime: '99.99%',
    specs: 'GDPR-Compliant Microservices // Read Replica',
    services: ['EU Data Isolation Engine', 'Asynchronous Job Workers', 'Encrypted Backup Mirror'],
    protocol: 'Mutual TLS (mTLS) / REST / gRPC',
    routing: 'Dedicated Tier-1 Transit Fiber Interconnect',
    description: 'European data-sovereignty compliant compute node with zero-knowledge encryption pipelines.'
  },
  {
    id: 'uk-lon',
    name: 'London (UK & West Europe POP)',
    code: 'EU-WEST-02',
    coords: { x: 46, y: 28 },
    type: 'Anycast POP',
    latency: '118ms',
    uptime: '99.99%',
    specs: 'Edge Reverse Proxy // DDoS Mitigation Shield',
    services: ['WAF Edge Filtering', 'Bot Detection Core', 'Static Asset Pre-warming'],
    protocol: 'HTTP/3 / WireGuard Mesh',
    routing: 'Cloudflare Magic Transit & Edge Anycast',
    description: 'Perimeter threat prevention layer filtering malicious requests before reaching central compute layers.'
  },
  {
    id: 'us-iad',
    name: 'North Virginia (US East Core)',
    code: 'US-EAST-01',
    coords: { x: 26, y: 37 },
    type: 'Cloud Cluster',
    latency: '168ms',
    uptime: '99.99%',
    specs: 'Auto-scaling EC2 / S3 Multi-Region Replica',
    services: ['North America API Gateway', 'Analytics ETL Pipeline', 'Object Storage Mirror'],
    protocol: 'REST / GraphQL / gRPC',
    routing: 'AWS Direct Connect Cross-Region Peering',
    description: 'High-throughput transatlantic data sync node powering US-based client integrations and real-time backups.'
  },
  {
    id: 'us-pdx',
    name: 'Oregon (US West Edge POP)',
    code: 'US-WEST-02',
    coords: { x: 17, y: 34 },
    type: 'Anycast POP',
    latency: '188ms',
    uptime: '99.99%',
    specs: 'Global DNS Router // Edge Cache',
    services: ['Pacific Rim Gateway', 'Dynamic Edge SSR', 'Load Balancer Health Probe'],
    protocol: 'HTTPS / QUIC',
    routing: 'Geo-DNS Latency-Based Failover',
    description: 'West coast ingress point ensuring sub-second response times across the Pacific corridor.'
  },
  {
    id: 'jp-tyo',
    name: 'Tokyo (East Asia Edge Node)',
    code: 'AP-NORTHEAST-01',
    coords: { x: 86, y: 38 },
    type: 'Edge Gateway',
    latency: '82ms',
    uptime: '99.99%',
    specs: 'Low-latency Edge Cluster // Redis Replica',
    services: ['East Asia API Ingress', 'Real-time Pub/Sub Relaying', 'Image Optimization Core'],
    protocol: 'gRPC / HTTP/3',
    routing: 'Direct Equinix Fabric Interconnect',
    description: 'High-speed Tokyo point of presence delivering instantaneous API throughput across Japan and East Asia.'
  }
];

export function GlobalInfrastructureMap() {
  const [selectedNodeId, setSelectedNodeId] = React.useState<string>('in-hub');
  const [isPinging, setIsPinging] = React.useState<boolean>(false);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const selectedNode = React.useMemo(() => {
    return REGION_NODES.find(n => n.id === selectedNodeId) || REGION_NODES[0];
  }, [selectedNodeId]);

  // Handle 60 FPS connection beam animation on canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const primaryNode = REGION_NODES[0]; // India Central
    let packetPhase = 0;

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);
      packetPhase += 0.012;

      const pX = (primaryNode.coords.x / 100) * width;
      const pY = (primaryNode.coords.y / 100) * height;

      // Draw curved data arcs between primary core and each satellite node
      REGION_NODES.forEach((node, idx) => {
        if (node.id === primaryNode.id) return;

        const targetX = (node.coords.x / 100) * width;
        const targetY = (node.coords.y / 100) * height;

        // Control point for quadratic curve
        const midX = (pX + targetX) / 2;
        const midY = Math.min(pY, targetY) - 35 - (idx * 5);

        // Draw background subtle arc
        ctx.beginPath();
        ctx.moveTo(pX, pY);
        ctx.quadraticCurveTo(midX, midY, targetX, targetY);
        ctx.strokeStyle = node.id === selectedNodeId ? 'rgba(52, 211, 153, 0.45)' : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = node.id === selectedNodeId ? 2 : 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw animated glowing data pulse along the arc
        const t = (packetPhase + idx * 0.22) % 1;
        // Calculate point on quadratic bezier curve
        const curX = (1 - t) * (1 - t) * pX + 2 * (1 - t) * t * midX + t * t * targetX;
        const curY = (1 - t) * (1 - t) * pY + 2 * (1 - t) * t * midY + t * t * targetY;

        ctx.beginPath();
        ctx.arc(curX, curY, node.id === selectedNodeId ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = node.id === selectedNodeId ? '#34d399' : '#38bdf8';
        ctx.shadowColor = node.id === selectedNodeId ? '#34d399' : '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [selectedNodeId]);

  const triggerPingSweep = () => {
    if (isPinging) return;
    setIsPinging(true);
    let index = 0;
    const interval = setInterval(() => {
      setSelectedNodeId(REGION_NODES[index].id);
      index++;
      if (index >= REGION_NODES.length) {
        clearInterval(interval);
        setTimeout(() => setIsPinging(false), 600);
      }
    }, 450);
  };

  return (
    <section 
      id="global-network"
      ref={containerRef}
      role="region"
      aria-label="OHO TECH Global Infrastructure and Multi-Region Deployment Topology"
      className="w-full py-20 sm:py-28 px-6 sm:px-10 lg:px-16 bg-[#0c0d11] text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-12 relative z-10 pb-6 border-b border-white/10">
        <div>
          <ScrollReveal yOffset={14} duration={0.6}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>GLOBAL CLOUD TOPOLOGY // MULTI-REGION ANYCAST</span>
            </div>
          </ScrollReveal>

          <ScrollReveal yOffset={20} duration={0.7} delay={0.1}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase">
              Global Scale. <span className="text-neutral-400">Zero Latency.</span>
            </h2>
          </ScrollReveal>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl font-mono mt-2">
            Multi-region edge clusters, continuous database replication, and sub-30ms routing across international enterprise corridors.
          </p>
        </div>

        {/* Live Simulation Ping Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={triggerPingSweep}
            disabled={isPinging}
            className={`px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 ${
              isPinging
                ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-white/10 hover:bg-emerald-500 hover:text-black border border-white/20 text-white'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            <span>{isPinging ? 'Sweeping Latency...' : 'Ping Global Network'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Live Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left 8 Cols: World Topology Projection Map */}
        <div className="lg:col-span-8 bg-[#12151d]/90 border border-white/15 rounded-3xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden min-h-[360px] sm:min-h-[480px]">
          
          {/* Top Map Status Strip */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-3 border-b border-white/10 relative z-20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-white font-bold">7 REGIONAL NODES ONLINE</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-slate-500">
              <span>ANYCAST BGP ACTIVE</span>
              <span>•</span>
              <span>TLS 1.3 MESH</span>
            </div>
          </div>

          {/* Interactive Map Visual Area */}
          <div className="relative w-full h-[280px] sm:h-[380px] my-auto">
            
            {/* Background Canvas for Curved Animated Beams */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

            {/* Stylized World Dots Grid Background (SVG) */}
            <svg 
              className="absolute inset-0 w-full h-full opacity-20 pointer-events-none select-none" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 1000 500" 
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Simplified world continent outlines for high-tech aesthetic */}
              <path 
                d="M150,120 Q200,90 280,100 Q320,150 280,220 Q220,240 180,200 Z" 
                fill="rgba(255,255,255,0.06)" 
              />
              <path 
                d="M220,260 Q280,280 300,360 Q260,420 220,380 Z" 
                fill="rgba(255,255,255,0.06)" 
              />
              <path 
                d="M450,100 Q550,80 580,160 Q520,200 460,180 Z" 
                fill="rgba(255,255,255,0.06)" 
              />
              <path 
                d="M480,220 Q560,240 540,360 Q480,380 460,280 Z" 
                fill="rgba(255,255,255,0.06)" 
              />
              <path 
                d="M600,100 Q800,80 880,180 Q780,260 660,220 Z" 
                fill="rgba(255,255,255,0.06)" 
              />
              <path 
                d="M780,320 Q860,330 840,400 Q760,400 780,320 Z" 
                fill="rgba(255,255,255,0.06)" 
              />
            </svg>

            {/* Interactive Node Markers */}
            {REGION_NODES.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isPrimary = node.type === 'Primary Core';

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  onMouseEnter={() => setSelectedNodeId(node.id)}
                  style={{
                    left: `${node.coords.x}%`,
                    top: `${node.coords.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={`absolute z-20 group focus:outline-none transition-transform duration-300 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                  aria-label={`${node.name} node`}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing ring for selected/primary */}
                    {(isSelected || isPrimary) && (
                      <span className={`absolute w-8 h-8 rounded-full animate-ping opacity-60 ${
                        isPrimary ? 'bg-emerald-400' : 'bg-cyan-400'
                      }`} />
                    )}

                    {/* Outer Glow Ring */}
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 text-black border-white shadow-[0_0_15px_#34d399]'
                        : isPrimary
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                          : 'bg-slate-900/90 border-cyan-400/60 text-cyan-300'
                    }`}>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current" />
                    </div>

                    {/* Node Tooltip Label (Desktop) */}
                    <div className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[9px] font-mono tracking-wider transition-all pointer-events-none ${
                      isSelected
                        ? 'bg-emerald-500 text-black font-bold opacity-100 shadow-md'
                        : 'bg-black/80 text-slate-300 opacity-70 group-hover:opacity-100 border border-white/10'
                    }`}>
                      {node.name.split('(')[0].trim()}
                    </div>
                  </div>
                </button>
              );
            })}

          </div>

          {/* Bottom Fast Selector Badges */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2 relative z-20">
            {REGION_NODES.map((node) => {
              const isSelected = node.id === selectedNodeId;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {node.code.split('/')[0].trim()}
                </button>
              );
            })}
          </div>

        </div>

        {/* Right 4 Cols: Active Regional Telemetry Inspector Card */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="h-full bg-[#12151d] border border-white/15 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                    {selectedNode.type}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                    {selectedNode.name}
                  </h3>
                </div>
                <Activity className="w-5 h-5 text-emerald-400 shrink-0 animate-pulse" />
              </div>

              {/* Latency & Uptime Stat Strip */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9.5px] font-mono text-slate-400 uppercase tracking-wider block">
                    TARGET EDGE LATENCY
                  </span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {selectedNode.latency}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9.5px] font-mono text-slate-400 uppercase tracking-wider block">
                    TARGET SLA OBJECTIVE
                  </span>
                  <span className="text-lg font-black text-cyan-400 font-mono">
                    {selectedNode.uptime}
                  </span>
                </div>
              </div>

              {/* Node Summary Description */}
              <p className="text-xs text-slate-300 font-normal leading-relaxed mb-5">
                {selectedNode.description}
              </p>

              {/* Deep Technical Specs */}
              <div className="space-y-3 pt-4 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block mb-0.5">
                    ROUTING ARCHITECTURE
                  </span>
                  <span className="text-slate-200 text-[11px]">
                    {selectedNode.routing}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-500 block mb-0.5">
                    DATA PROTOCOLS
                  </span>
                  <span className="text-slate-200 text-[11px]">
                    {selectedNode.protocol}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-500 block mb-1">
                    ACTIVE PROVISIONED SERVICES
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.services.map((srv, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Hardware Spec */}
            <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-emerald-400 font-bold truncate max-w-[200px]">
                {selectedNode.specs}
              </span>
              <div className="flex items-center gap-1 shrink-0 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>HEALTHY</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Architectural Topology Footnote */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Multi-Cloud Architecture Topology: AWS EC2 Multi-AZ + Cloudflare Anycast + Tier-1 Interconnect Routing</span>
        </div>
        <span className="text-slate-400">
          * Latency figures represent standard benchmark target objectives across edge points of presence.
        </span>
      </div>

      </div>
    </section>
  );
}
